from rest_framework import serializers
from .models import Cart, CartItem
from products.serializers import ProductListSerializer, ProductVariantSerializer


class CartItemSerializer(serializers.ModelSerializer):
    product_detail = ProductListSerializer(source='product', read_only=True)
    variant_detail = ProductVariantSerializer(source='variant', read_only=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_detail', 'variant', 'variant_detail', 'quantity', 'price', 'subtotal']
        read_only_fields = ['id', 'price', 'subtotal']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    item_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total', 'item_count', 'updated_at']


class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField(required=True)
    variant_id = serializers.IntegerField(required=False, allow_null=True)
    quantity = serializers.IntegerField(required=True, min_value=1)


class UpdateCartItemSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(required=True, min_value=0)
