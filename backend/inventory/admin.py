from django.contrib import admin
from .models import StockAdjustment


@admin.register(StockAdjustment)
class StockAdjustmentAdmin(admin.ModelAdmin):
    list_display = ['product', 'variant', 'adjustment_type', 'quantity', 'adjusted_by', 'created_at']
    list_filter = ['adjustment_type', 'created_at']
    search_fields = ['product__name', 'reason', 'adjusted_by__email']
    readonly_fields = ['previous_stock', 'new_stock', 'created_at']
    date_hierarchy = 'created_at'
