from django.db import models
from django.conf import settings


class StockAdjustment(models.Model):
    """
    Track manual inventory adjustments made by staff
    """
    ADJUSTMENT_TYPES = [
        ('add', 'Stock Added'),
        ('remove', 'Stock Removed'),
        ('correction', 'Inventory Correction'),
        ('return', 'Customer Return'),
        ('damaged', 'Damaged/Lost'),
    ]

    product = models.ForeignKey('products.Product', on_delete=models.CASCADE, related_name='stock_adjustments')
    variant = models.ForeignKey('products.ProductVariant', on_delete=models.CASCADE, null=True, blank=True, related_name='stock_adjustments')
    adjustment_type = models.CharField(max_length=20, choices=ADJUSTMENT_TYPES)
    quantity = models.IntegerField(help_text="Positive for additions, negative for removals")
    reason = models.TextField()
    adjusted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='stock_adjustments')
    previous_stock = models.IntegerField()
    new_stock = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        target = f"{self.product.name}"
        if self.variant:
            target += f" ({self.variant.color} - {self.variant.size})"
        return f"{self.get_adjustment_type_display()}: {target} by {self.adjusted_by.email}"
