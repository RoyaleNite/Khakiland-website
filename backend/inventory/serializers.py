from rest_framework import serializers
from .models import StockAdjustment
from products.models import Product, ProductVariant, Category


class StockAdjustmentSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    variant_info = serializers.SerializerMethodField()
    adjusted_by_email = serializers.CharField(source='adjusted_by.email', read_only=True)

    class Meta:
        model = StockAdjustment
        fields = '__all__'
        read_only_fields = ['adjusted_by', 'previous_stock', 'new_stock', 'created_at']

    def get_variant_info(self, obj):
        if obj.variant:
            parts = []
            if obj.variant.color:
                parts.append(obj.variant.color)
            if obj.variant.size:
                parts.append(obj.variant.size)
            return ' - '.join(parts) if parts else None
        return None


class AdjustStockSerializer(serializers.Serializer):
    """Serializer for adjusting stock levels"""
    product_id = serializers.IntegerField()
    variant_id = serializers.IntegerField(required=False, allow_null=True)
    adjustment_type = serializers.ChoiceField(choices=StockAdjustment.ADJUSTMENT_TYPES)
    quantity = serializers.IntegerField(help_text="Positive for add, negative for remove")
    reason = serializers.CharField()


class ProductManagementSerializer(serializers.ModelSerializer):
    """Serializer for staff product management"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    variant_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_variant_count(self, obj):
        return obj.variants.count()


class ProductVariantManagementSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = ProductVariant
        fields = '__all__'


class CategoryManagementSerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = '__all__'

    def get_product_count(self, obj):
        return obj.products.count()
