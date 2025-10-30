from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.utils import timezone
from .models import Order, OrderItem
from cart.models import Cart
from .serializers import OrderSerializer, CreateOrderSerializer
from .utils import deduct_stock


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'order_number'

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')


class CreateOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart = get_object_or_404(Cart, user=request.user)

        if not cart.items.exists():
            return Response(
                {'error': 'Cart is empty'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calculate totals
        subtotal = cart.total
        tax = subtotal * 0.08  # 8% tax
        shipping_cost = 10.00 if subtotal < 50 else 0.00  # Free shipping over $50
        total = subtotal + tax + shipping_cost

        # Get payment information from request
        payment_method = request.data.get('payment_method')
        payment_status = request.data.get('payment_status', 'unpaid')

        # Create order
        order = Order.objects.create(
            user=request.user,
            subtotal=subtotal,
            tax=tax,
            shipping_cost=shipping_cost,
            total=total,
            payment_method=payment_method,
            payment_status=payment_status,
            **serializer.validated_data
        )

        # If order is paid, set paid_at timestamp
        if payment_status == 'paid':
            order.paid_at = timezone.now()
            order.save()

        # Create order items from cart
        for cart_item in cart.items.all():
            variant_info = ''
            if cart_item.variant:
                parts = []
                if cart_item.variant.color:
                    parts.append(f"Color: {cart_item.variant.color}")
                if cart_item.variant.size:
                    parts.append(f"Size: {cart_item.variant.size}")
                variant_info = ', '.join(parts)

            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                variant=cart_item.variant,
                product_name=cart_item.product.name,
                variant_info=variant_info,
                price=cart_item.price,
                quantity=cart_item.quantity,
                subtotal=cart_item.subtotal
            )

        # Deduct stock if order is paid
        if payment_status == 'paid':
            deduct_stock(order)

        # Clear cart
        cart.items.all().delete()

        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED
        )


class CancelOrderView(APIView):
    """Allow users to cancel their own orders if not shipped"""
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, order_number):
        from .utils import cancel_order

        order = get_object_or_404(Order, order_number=order_number, user=request.user)

        # Check if order can be cancelled
        if order.status == 'cancelled':
            return Response(
                {'error': 'Order is already cancelled'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if order.shipped_at:
            return Response(
                {'error': 'Cannot cancel order that has already been shipped'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Cancel order
        reason = request.data.get('reason', 'Cancelled by customer')
        cancel_order(order, request.user, reason)

        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_200_OK
        )


# Staff-only views
class StaffOrderListView(generics.ListAPIView):
    """Staff view to see all orders with filtering"""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get_queryset(self):
        queryset = Order.objects.all().prefetch_related('items')

        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        # Filter by payment status
        payment_status = self.request.query_params.get('payment_status')
        if payment_status:
            queryset = queryset.filter(payment_status=payment_status)

        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date:
            queryset = queryset.filter(created_at__gte=start_date)
        if end_date:
            queryset = queryset.filter(created_at__lte=end_date)

        return queryset


class StaffOrderDetailView(generics.RetrieveAPIView):
    """Staff view to see any order details"""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    lookup_field = 'order_number'
    queryset = Order.objects.all().prefetch_related('items')


class UpdateOrderStatusView(APIView):
    """Staff can update order status, mark as shipped, etc."""
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    @transaction.atomic
    def patch(self, request, order_number):
        from .utils import mark_order_as_paid

        order = get_object_or_404(Order, order_number=order_number)

        # Update status
        new_status = request.data.get('status')
        if new_status and new_status in dict(Order.STATUS_CHOICES):
            order.status = new_status

            # Set shipped_at if marking as shipped
            if new_status == 'shipped' and not order.shipped_at:
                order.shipped_at = timezone.now()

            # Set delivered_at if marking as delivered
            elif new_status == 'delivered' and not order.delivered_at:
                order.delivered_at = timezone.now()

        # Update payment status
        new_payment_status = request.data.get('payment_status')
        if new_payment_status and new_payment_status in dict(Order.PAYMENT_STATUS_CHOICES):
            old_payment_status = order.payment_status
            order.payment_status = new_payment_status

            # If marking as paid, deduct stock and set paid_at
            if new_payment_status == 'paid' and old_payment_status != 'paid':
                mark_order_as_paid(order)
                order = Order.objects.get(pk=order.pk)  # Refresh

        # Update payment method
        payment_method = request.data.get('payment_method')
        if payment_method:
            order.payment_method = payment_method

        order.save()

        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_200_OK
        )


class StaffCancelOrderView(APIView):
    """Staff can cancel any order"""
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    @transaction.atomic
    def post(self, request, order_number):
        from .utils import cancel_order

        order = get_object_or_404(Order, order_number=order_number)

        if order.status == 'cancelled':
            return Response(
                {'error': 'Order is already cancelled'},
                status=status.HTTP_400_BAD_REQUEST
            )

        reason = request.data.get('reason', 'Cancelled by staff')
        cancel_order(order, request.user, reason)

        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_200_OK
        )


class MarkOrderReceivedBackView(APIView):
    """Mark order items as received back after return"""
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    @transaction.atomic
    def post(self, request, order_number):
        from .utils import mark_order_received_back

        order = get_object_or_404(Order, order_number=order_number)

        if not order.shipped_at:
            return Response(
                {'error': 'Order was never shipped'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if order.is_received_back:
            return Response(
                {'error': 'Order already marked as received back'},
                status=status.HTTP_400_BAD_REQUEST
            )

        mark_order_received_back(order)

        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_200_OK
        )


class OrderStatsView(APIView):
    """Get order statistics for staff dashboard"""
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get(self, request):
        from django.db.models import Count, Sum, Q

        total_orders = Order.objects.count()
        pending_orders = Order.objects.filter(status='pending').count()
        processing_orders = Order.objects.filter(status='processing').count()
        shipped_orders = Order.objects.filter(status='shipped').count()
        delivered_orders = Order.objects.filter(status='delivered').count()
        cancelled_orders = Order.objects.filter(status='cancelled').count()

        paid_orders = Order.objects.filter(payment_status='paid').count()
        unpaid_orders = Order.objects.filter(payment_status='unpaid').count()

        total_revenue = Order.objects.filter(
            payment_status='paid'
        ).aggregate(Sum('total'))['total__sum'] or 0

        return Response({
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'processing_orders': processing_orders,
            'shipped_orders': shipped_orders,
            'delivered_orders': delivered_orders,
            'cancelled_orders': cancelled_orders,
            'paid_orders': paid_orders,
            'unpaid_orders': unpaid_orders,
            'total_revenue': float(total_revenue),
        })


class OrderInvoiceView(APIView):
    """Generate invoice for an order"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, order_number):
        # Check if user owns this order or is staff
        if request.user.is_staff:
            order = get_object_or_404(Order, order_number=order_number)
        else:
            order = get_object_or_404(Order, order_number=order_number, user=request.user)

        invoice_data = {
            'order_number': order.order_number,
            'order_date': order.created_at.strftime('%Y-%m-%d %H:%M'),
            'customer': {
                'name': order.user.get_full_name() or order.user.email,
                'email': order.user.email,
            },
            'shipping_address': {
                'full_name': order.shipping_full_name,
                'phone': order.shipping_phone,
                'address_line1': order.shipping_address_line1,
                'address_line2': order.shipping_address_line2,
                'city': order.shipping_city,
                'state': order.shipping_state,
                'postal_code': order.shipping_postal_code,
                'country': order.shipping_country,
            },
            'items': [],
            'subtotal': float(order.subtotal),
            'tax': float(order.tax),
            'shipping_cost': float(order.shipping_cost),
            'total': float(order.total),
            'payment_status': order.payment_status,
            'payment_method': order.payment_method,
            'status': order.status,
        }

        for item in order.items.all():
            invoice_data['items'].append({
                'product_name': item.product_name,
                'variant_info': item.variant_info,
                'quantity': item.quantity,
                'unit_price': float(item.price),
                'subtotal': float(item.subtotal),
            })

        return Response(invoice_data)
