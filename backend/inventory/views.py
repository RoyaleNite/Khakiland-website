from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.db.models import Sum, Q

from .models import StockAdjustment
from products.models import Product, ProductVariant, Category
from .serializers import (
    StockAdjustmentSerializer,
    AdjustStockSerializer,
    ProductManagementSerializer,
    ProductVariantManagementSerializer,
    CategoryManagementSerializer,
)


class AdjustStockView(APIView):
    """Staff endpoint to manually adjust stock levels"""
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    @transaction.atomic
    def post(self, request):
        serializer = AdjustStockSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product_id = serializer.validated_data['product_id']
        variant_id = serializer.validated_data.get('variant_id')
        adjustment_type = serializer.validated_data['adjustment_type']
        quantity = serializer.validated_data['quantity']
        reason = serializer.validated_data['reason']

        product = get_object_or_404(Product, id=product_id)
        variant = None

        if variant_id:
            variant = get_object_or_404(ProductVariant, id=variant_id, product=product)
            current_stock = variant.stock
            new_stock = current_stock + quantity
            variant.stock = new_stock
            variant.save()
        else:
            current_stock = product.stock
            new_stock = current_stock + quantity
            product.stock = new_stock
            product.save()

        # Create stock adjustment record
        adjustment = StockAdjustment.objects.create(
            product=product,
            variant=variant,
            adjustment_type=adjustment_type,
            quantity=quantity,
            reason=reason,
            adjusted_by=request.user,
            previous_stock=current_stock,
            new_stock=new_stock,
        )

        return Response(
            StockAdjustmentSerializer(adjustment).data,
            status=status.HTTP_201_CREATED
        )


class StockAdjustmentHistoryView(generics.ListAPIView):
    """View stock adjustment history"""
    serializer_class = StockAdjustmentSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get_queryset(self):
        queryset = StockAdjustment.objects.all()

        # Filter by product
        product_id = self.request.query_params.get('product_id')
        if product_id:
            queryset = queryset.filter(product_id=product_id)

        # Filter by adjustment type
        adjustment_type = self.request.query_params.get('adjustment_type')
        if adjustment_type:
            queryset = queryset.filter(adjustment_type=adjustment_type)

        return queryset


class ProductListCreateView(generics.ListCreateAPIView):
    """Staff endpoint for listing and creating products"""
    serializer_class = ProductManagementSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    queryset = Product.objects.all().select_related('category')

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filter by category
        category_id = self.request.query_params.get('category_id')
        if category_id:
            queryset = queryset.filter(category_id=category_id)

        # Filter by stock level
        low_stock = self.request.query_params.get('low_stock')
        if low_stock:
            queryset = queryset.filter(stock__lt=10)

        out_of_stock = self.request.query_params.get('out_of_stock')
        if out_of_stock:
            queryset = queryset.filter(stock=0)

        # Filter by active status
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')

        return queryset


class ProductDetailUpdateView(generics.RetrieveUpdateDestroyAPIView):
    """Staff endpoint for viewing, updating, and deleting products"""
    serializer_class = ProductManagementSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    queryset = Product.objects.all()
    lookup_field = 'slug'


class ProductVariantListCreateView(generics.ListCreateAPIView):
    """Staff endpoint for managing product variants"""
    serializer_class = ProductVariantManagementSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get_queryset(self):
        product_id = self.request.query_params.get('product_id')
        if product_id:
            return ProductVariant.objects.filter(product_id=product_id)
        return ProductVariant.objects.all()


class ProductVariantDetailUpdateView(generics.RetrieveUpdateDestroyAPIView):
    """Staff endpoint for updating/deleting product variants"""
    serializer_class = ProductVariantManagementSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    queryset = ProductVariant.objects.all()


class CategoryListCreateView(generics.ListCreateAPIView):
    """Staff endpoint for managing categories"""
    serializer_class = CategoryManagementSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    queryset = Category.objects.all()


class CategoryDetailUpdateView(generics.RetrieveUpdateDestroyAPIView):
    """Staff endpoint for updating/deleting categories"""
    serializer_class = CategoryManagementSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    queryset = Category.objects.all()
    lookup_field = 'slug'


class InventoryStatsView(APIView):
    """Get inventory statistics for staff dashboard"""
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get(self, request):
        total_products = Product.objects.count()
        active_products = Product.objects.filter(is_active=True).count()
        out_of_stock = Product.objects.filter(stock=0).count()
        low_stock = Product.objects.filter(stock__gt=0, stock__lt=10).count()

        total_stock_value = Product.objects.aggregate(
            total_value=Sum('base_price')
        )['total_value'] or 0

        categories_count = Category.objects.count()

        return Response({
            'total_products': total_products,
            'active_products': active_products,
            'out_of_stock': out_of_stock,
            'low_stock': low_stock,
            'total_stock_value': float(total_stock_value),
            'categories_count': categories_count,
        })
