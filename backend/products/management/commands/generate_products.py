from django.core.management.base import BaseCommand
from django.utils.text import slugify
from products.models import Category, Product, ProductVariant
import random


class Command(BaseCommand):
    help = 'Generate 100 products with variants'

    def generate_svg(self, category_name, product_index):
        """Generate a simple SVG placeholder"""
        colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
                  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788']
        color = colors[product_index % len(colors)]

        return f'''<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="{color}"/>
  <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle" dominant-baseline="middle">
    {category_name}
  </text>
  <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" dominant-baseline="middle">
    Product #{product_index + 1}
  </text>
</svg>'''

    def handle(self, *args, **kwargs):
        self.stdout.write('Generating categories and products...')

        # Clear existing data
        ProductVariant.objects.all().delete()
        Product.objects.all().delete()
        Category.objects.all().delete()

        # Define categories
        categories_data = [
            {
                'name': 'Wearables',
                'description': 'Clothing and wearable equipment',
                'has_variants': True,
                'variant_type': 'size_color',
                'products': 30
            },
            {
                'name': 'Electronics',
                'description': 'Electronic equipment and gadgets',
                'has_variants': True,
                'variant_type': 'color',
                'products': 15
            },
            {
                'name': 'Tools',
                'description': 'Tools and hardware',
                'has_variants': True,
                'variant_type': 'color',
                'products': 15
            },
            {
                'name': 'Hot Sauces',
                'description': 'Spicy hot sauces from around the world',
                'has_variants': False,
                'variant_type': 'none',
                'products': 15
            },
            {
                'name': 'BBQ Sauces',
                'description': 'Delicious barbecue sauces',
                'has_variants': False,
                'variant_type': 'none',
                'products': 13
            },
            {
                'name': 'Condiments',
                'description': 'Various condiments and dressings',
                'has_variants': False,
                'variant_type': 'none',
                'products': 12
            },
        ]

        # Product names for each category
        product_names = {
            'Wearables': [
                'Premium Cotton T-Shirt', 'Classic Denim Jeans', 'Hooded Sweatshirt',
                'Athletic Running Shorts', 'Fleece Zip-Up Jacket', 'Cargo Work Pants',
                'Thermal Base Layer', 'Waterproof Rain Jacket', 'Casual Polo Shirt',
                'Winter Puffer Coat', 'Track Sweatpants', 'Button-Up Dress Shirt',
                'Graphic Print Tee', 'Slim Fit Chinos', 'Windbreaker Jacket',
                'Athletic Tank Top', 'Wool Sweater', 'Shorts Boardshorts',
                'Long Sleeve Henley', 'Quilted Vest', 'Jogger Pants',
                'Performance Compression Shirt', 'Flannel Shirt', 'Leather Jacket',
                'Pullover Hoodie', 'Cargo Shorts', 'Tactical Pants',
                'Reflective Safety Vest', 'Insulated Work Jacket', 'Sports Jersey'
            ],
            'Electronics': [
                'Wireless Bluetooth Headphones', 'USB-C Hub Multi-Adapter', 'Portable Power Bank',
                'Smart LED Light Strip', 'Mechanical Gaming Keyboard', 'Wireless Mouse',
                'External SSD Drive', 'Webcam HD 1080p', 'Phone Charging Stand',
                'Tablet Stylus Pen', 'Cable Management Kit', 'Laptop Cooling Pad',
                'USB Microphone', 'Monitor Screen Bar', 'Bluetooth Speaker'
            ],
            'Tools': [
                'Cordless Power Drill', 'Multi-Bit Screwdriver Set', 'Adjustable Wrench Set',
                'Digital Tape Measure', 'Heavy Duty Utility Knife', 'Socket Wrench Set',
                'Inspection Flashlight', 'Precision Level Tool', 'Wire Stripper Pliers',
                'Magnetic Tool Holder', 'Portable Tool Box', 'Hex Key Set',
                'Stud Finder Scanner', 'Clamp Set', 'Hammer Multi-Tool'
            ],
            'Hot Sauces': [
                'Ghost Pepper Inferno', 'Carolina Reaper Madness', 'Habanero Heat Wave',
                'Sriracha Original', 'Jalapeño Verde Sauce', 'Trinidad Scorpion Blast',
                'Chipotle Smoke Sauce', 'Thai Dragon Fire', 'Cayenne Classic Red',
                'Scotch Bonnet Island Sauce', 'Tabasco Original', 'Peri Peri African Heat',
                'Ancho Chili Sauce', 'Serrano Green Hot Sauce', 'Diablo Extra Hot'
            ],
            'BBQ Sauces': [
                'Sweet Hickory BBQ', 'Smoky Mesquite Sauce', 'Carolina Mustard BBQ',
                'Kansas City Classic', 'Memphis Dry Rub Sauce', 'Texas Spicy BBQ',
                'Honey Bourbon Glaze', 'Apple Wood Smoked Sauce', 'Tangy Vinegar BBQ',
                'Brown Sugar BBQ', 'Chipotle BBQ Sauce', 'Korean BBQ Sauce', 'Alabama White Sauce'
            ],
            'Condiments': [
                'Artisan Dijon Mustard', 'Honey Mustard Premium', 'Spicy Brown Mustard',
                'Whole Grain Mustard', 'Sweet Pickle Relish', 'Garlic Aioli',
                'Truffle Mayo', 'Chipotle Mayo', 'Horseradish Sauce',
                'Tartar Sauce', 'Cocktail Sauce', 'Steak Sauce'
            ]
        }

        descriptions = {
            'Wearables': 'High-quality {} made from premium materials. Perfect for everyday wear with superior comfort and durability.',
            'Electronics': 'Advanced {} featuring the latest technology. Reliable, efficient, and designed for modern users.',
            'Tools': 'Professional-grade {} built to last. Essential for any toolbox with precision engineering.',
            'Hot Sauces': 'Fiery {} crafted with premium peppers. Perfect for spice lovers who want authentic flavor and heat.',
            'BBQ Sauces': 'Delicious {} slow-cooked to perfection. Ideal for grilling, marinating, and adding bold flavor.',
            'Condiments': 'Gourmet {} made with quality ingredients. Elevate any meal with this versatile condiment.'
        }

        # Colors for variants
        colors = ['Red', 'Blue', 'Black', 'White', 'Green', 'Gray', 'Navy', 'Orange']
        sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

        product_counter = 0

        for cat_data in categories_data:
            # Create category
            category = Category.objects.create(
                name=cat_data['name'],
                slug=slugify(cat_data['name']),
                description=cat_data['description'],
                has_variants=cat_data['has_variants'],
                variant_type=cat_data['variant_type']
            )

            self.stdout.write(f'Created category: {category.name}')

            # Generate products for this category
            for i in range(cat_data['products']):
                if i < len(product_names[cat_data['name']]):
                    product_name = product_names[cat_data['name']][i]
                else:
                    product_name = f"{cat_data['name']} Item {i + 1}"

                base_price = round(random.uniform(9.99, 299.99), 2)
                stock = random.randint(10, 100)

                product = Product.objects.create(
                    category=category,
                    name=product_name,
                    slug=slugify(f"{product_name}-{product_counter}"),
                    description=descriptions[cat_data['name']].format(product_name.lower()),
                    base_price=base_price,
                    stock=stock,
                    svg_placeholder=self.generate_svg(cat_data['name'], product_counter),
                    is_active=True
                )

                # Create variants if category has them
                if cat_data['has_variants']:
                    if cat_data['variant_type'] == 'size_color':
                        # Wearables: create size and color variants
                        for size in sizes[:4]:  # Use first 4 sizes
                            for color in colors[:4]:  # Use first 4 colors
                                ProductVariant.objects.create(
                                    product=product,
                                    sku=f"{product.slug}-{size}-{color}".upper(),
                                    color=color,
                                    size=size,
                                    price_modifier=0.00,
                                    stock=random.randint(5, 30),
                                    is_active=True
                                )
                    elif cat_data['variant_type'] == 'color':
                        # Electronics and Tools: only color variants
                        for color in colors[:5]:
                            ProductVariant.objects.create(
                                product=product,
                                sku=f"{product.slug}-{color}".upper(),
                                color=color,
                                price_modifier=0.00,
                                stock=random.randint(10, 40),
                                is_active=True
                            )

                product_counter += 1
                if product_counter % 10 == 0:
                    self.stdout.write(f'Generated {product_counter} products...')

        self.stdout.write(self.style.SUCCESS(f'Successfully generated {product_counter} products!'))
