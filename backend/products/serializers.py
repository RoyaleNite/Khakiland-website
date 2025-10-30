from rest_framework import serializers
from .models import Category, Product, ProductVariant


class CategorySerializer(serializers.ModelSerializer):
    parent_name = serializers.CharField(source='parent.name', read_only=True, allow_null=True)
    subcategories = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = '__all__'

    def get_subcategories(self, obj):
        if obj.subcategories.exists():
            return [{'id': sub.id, 'name': sub.name, 'slug': sub.slug} for sub in obj.subcategories.all()]
        return []


class ProductVariantSerializer(serializers.ModelSerializer):
    price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = ProductVariant
        fields = ['id', 'sku', 'color', 'size', 'price', 'price_modifier', 'stock', 'is_active']


class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'category', 'category_name', 'base_price', 'stock', 'svg_placeholder', 'is_active']


class ProductDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_variant_type = serializers.CharField(source='category.variant_type', read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    has_variants = serializers.BooleanField(read_only=True)

    class Meta:
        model = Product
        fields = '__all__'


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating products (staff only)"""

    class Meta:
        model = Product
        fields = ['name', 'slug', 'category', 'description', 'base_price', 'stock',
                  'image', 'svg_placeholder', 'is_active', 'is_restockable']

    def validate_slug(self, value):
        """Ensure slug is unique when creating, or unique excluding current instance when updating"""
        instance = self.instance
        if instance:
            # Updating - check if slug exists for other products
            if Product.objects.exclude(pk=instance.pk).filter(slug=value).exists():
                raise serializers.ValidationError("A product with this slug already exists.")
        else:
            # Creating - check if slug exists
            if Product.objects.filter(slug=value).exists():
                raise serializers.ValidationError("A product with this slug already exists.")
        return value


class ProductVariantCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating product variants (staff only)"""

    class Meta:
        model = ProductVariant
        fields = ['id', 'sku', 'color', 'size', 'price_modifier', 'stock', 'is_active']

    def validate_sku(self, value):
        """Ensure SKU is unique"""
        instance = self.instance
        if instance:
            if ProductVariant.objects.exclude(pk=instance.pk).filter(sku=value).exists():
                raise serializers.ValidationError("A variant with this SKU already exists.")
        else:
            if ProductVariant.objects.filter(sku=value).exists():
                raise serializers.ValidationError("A variant with this SKU already exists.")
        return value
