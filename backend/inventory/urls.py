from django.urls import path
from .views import (
    AdjustStockView,
    StockAdjustmentHistoryView,
    ProductListCreateView,
    ProductDetailUpdateView,
    ProductVariantListCreateView,
    ProductVariantDetailUpdateView,
    CategoryListCreateView,
    CategoryDetailUpdateView,
    InventoryStatsView,
)

urlpatterns = [
    # Stock management
    path('stock/adjust/', AdjustStockView.as_view(), name='adjust-stock'),
    path('stock/history/', StockAdjustmentHistoryView.as_view(), name='stock-history'),

    # Product management
    path('products/', ProductListCreateView.as_view(), name='inventory-product-list'),
    path('products/<slug:slug>/', ProductDetailUpdateView.as_view(), name='inventory-product-detail'),

    # Variant management
    path('variants/', ProductVariantListCreateView.as_view(), name='inventory-variant-list'),
    path('variants/<int:pk>/', ProductVariantDetailUpdateView.as_view(), name='inventory-variant-detail'),

    # Category management
    path('categories/', CategoryListCreateView.as_view(), name='inventory-category-list'),
    path('categories/<slug:slug>/', CategoryDetailUpdateView.as_view(), name='inventory-category-detail'),

    # Stats
    path('stats/', InventoryStatsView.as_view(), name='inventory-stats'),
]
