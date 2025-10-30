from django.urls import path
from .views import (
    CategoryListView,
    ProductListView,
    ProductDetailView,
    StaffCategoryListView,
    StaffCategoryCreateView,
    StaffCategoryDetailView,
    StaffProductListView,
    StaffProductCreateView,
    StaffProductDetailView,
    StaffProductVariantListView,
    StaffProductVariantDetailView,
)

urlpatterns = [
    # Public endpoints
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('', ProductListView.as_view(), name='product-list'),

    # Staff endpoints for category management
    path('staff/categories/', StaffCategoryListView.as_view(), name='staff-category-list'),
    path('staff/categories/create/', StaffCategoryCreateView.as_view(), name='staff-category-create'),
    path('staff/categories/<int:pk>/', StaffCategoryDetailView.as_view(), name='staff-category-detail'),

    # Staff endpoints for product management
    path('staff/products/', StaffProductListView.as_view(), name='staff-product-list'),
    path('staff/products/create/', StaffProductCreateView.as_view(), name='staff-product-create'),
    path('staff/products/<int:pk>/', StaffProductDetailView.as_view(), name='staff-product-detail'),
    path('staff/products/<int:product_id>/variants/', StaffProductVariantListView.as_view(), name='staff-variant-list'),
    path('staff/products/<int:product_id>/variants/<int:pk>/', StaffProductVariantDetailView.as_view(), name='staff-variant-detail'),

    # Public product detail (must be last due to slug matching)
    path('<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),
]
