from django.db import models
import json


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    parent = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='subcategories',
        help_text="Parent category for subcategories"
    )
    has_variants = models.BooleanField(default=False)
    variant_type = models.CharField(
        max_length=50,
        blank=True,
        help_text="Type of variants: size_color, color, none"
    )

    # Define available attributes for this category
    # Example: {"clothing": ["size", "wear_type"], "sauce": ["spicy_level"]}
    attribute_schema = models.JSONField(
        default=dict,
        blank=True,
        help_text="Define attribute fields for products in this category"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        if self.parent:
            return f"{self.parent.name} > {self.name}"
        return self.name


class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    stock = models.IntegerField(default=0)
    image = models.ImageField(upload_to='products/', null=True, blank=True)

    # Inventory management
    is_one_time = models.BooleanField(
        default=False,
        help_text="One-time items are hidden when out of stock. Restockable items show 'Out of Stock'."
    )
    is_restockable = models.BooleanField(
        default=True,
        help_text="Can this item be restocked? Alternative to is_one_time."
    )

    # Category-specific attributes (stored as JSON)
    # Examples: {"size": "Large", "spicy": true, "wear_type": "outdoor"}
    attributes = models.JSONField(
        default=dict,
        blank=True,
        help_text="Category-specific attributes like size, spicy level, wear type, etc."
    )

    svg_placeholder = models.TextField(blank=True, default='', help_text="SVG code for placeholder image")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    @property
    def has_variants(self):
        return self.variants.exists()


class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    sku = models.CharField(max_length=100, unique=True)
    color = models.CharField(max_length=50, blank=True)
    size = models.CharField(max_length=20, blank=True)
    price_modifier = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    stock = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        parts = [self.product.name]
        if self.color:
            parts.append(self.color)
        if self.size:
            parts.append(self.size)
        return " - ".join(parts)

    @property
    def price(self):
        return self.product.base_price + self.price_modifier

    class Meta:
        unique_together = ['product', 'color', 'size']
