from rest_framework import generics, filters, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product, ProductVariant
from .serializers import (
    CategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    ProductCreateUpdateSerializer,
    ProductVariantCreateUpdateSerializer,
)


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True).select_related('category').prefetch_related('variants')
    serializer_class = ProductListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'category__slug']
    search_fields = ['name', 'description']
    ordering_fields = ['base_price', 'name', 'created_at']
    ordering = ['-created_at']


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True).select_related('category').prefetch_related('variants')
    serializer_class = ProductDetailSerializer
    lookup_field = 'slug'


# Staff-only views for product management
class StaffProductListView(generics.ListAPIView):
    """List all products (including inactive) for staff"""
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    queryset = Product.objects.all().select_related('category').prefetch_related('variants')
    serializer_class = ProductDetailSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_active']
    search_fields = ['name', 'description']
    ordering_fields = ['base_price', 'name', 'created_at']
    ordering = ['-created_at']


class StaffProductCreateView(generics.CreateAPIView):
    """Create a new product (staff only)"""
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    queryset = Product.objects.all()
    serializer_class = ProductCreateUpdateSerializer


class StaffProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a product (staff only)"""
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    queryset = Product.objects.all()
    serializer_class = ProductCreateUpdateSerializer
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        # Soft delete - just mark as inactive instead of deleting
        instance.is_active = False
        instance.save()


class StaffProductVariantListView(generics.ListCreateAPIView):
    """List and create variants for a product (staff only)"""
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    serializer_class = ProductVariantCreateUpdateSerializer

    def get_queryset(self):
        product_id = self.kwargs.get('product_id')
        return ProductVariant.objects.filter(product_id=product_id)

    def perform_create(self, serializer):
        product_id = self.kwargs.get('product_id')
        serializer.save(product_id=product_id)


class StaffProductVariantDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a variant (staff only)"""
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    queryset = ProductVariant.objects.all()
    serializer_class = ProductVariantCreateUpdateSerializer
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        # Soft delete - just mark as inactive
        instance.is_active = False
        instance.save()
