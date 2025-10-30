from django.contrib import admin
from .models import Category, Product, ProductVariant


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'has_variants', 'variant_type']
    prepopulated_fields = {'slug': ('name',)}


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 0


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'base_price', 'stock', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductVariantInline]


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ['product', 'sku', 'color', 'size', 'price', 'stock', 'is_active']
    list_filter = ['is_active', 'color', 'size']
    search_fields = ['product__name', 'sku']
