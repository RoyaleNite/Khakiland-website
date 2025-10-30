from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from products.models import Product, ProductVariant
from .serializers import CartSerializer, AddToCartSerializer, UpdateCartItemSerializer


class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class AddToCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart, created = Cart.objects.get_or_create(user=request.user)
        product = get_object_or_404(Product, id=serializer.validated_data['product_id'])
        variant = None

        if serializer.validated_data.get('variant_id'):
            variant = get_object_or_404(ProductVariant, id=serializer.validated_data['variant_id'])

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            variant=variant,
            defaults={'quantity': serializer.validated_data['quantity']}
        )

        if not created:
            cart_item.quantity += serializer.validated_data['quantity']
            cart_item.save()

        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)


class UpdateCartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, item_id):
        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart = get_object_or_404(Cart, user=request.user)
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)

        if serializer.validated_data['quantity'] == 0:
            cart_item.delete()
        else:
            cart_item.quantity = serializer.validated_data['quantity']
            cart_item.save()

        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)


class RemoveFromCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, item_id):
        cart = get_object_or_404(Cart, user=request.user)
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
        cart_item.delete()

        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)


class ClearCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        cart = get_object_or_404(Cart, user=request.user)
        cart.items.all().delete()

        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)
