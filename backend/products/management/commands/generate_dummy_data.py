from django.core.management.base import BaseCommand
from products.models import Category, Product, ProductVariant
from django.utils.text import slugify


class Command(BaseCommand):
    help = 'Generate dummy products with categories and subcategories'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating categories and subcategories...')

        # Clear existing data
        ProductVariant.objects.all().delete()
        Product.objects.all().delete()
        Category.objects.all().delete()

        # SVG Placeholder for products
        svg_placeholder = '''<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
            <rect width="200" height="200" fill="#F5F4ED"/>
            <circle cx="100" cy="100" r="40" fill="#6B8E23" opacity="0.3"/>
            <text x="100" y="110" font-family="Arial" font-size="14" fill="#3B3A2E" text-anchor="middle">Product</text>
        </svg>'''

        # ===== CLOTHING CATEGORY =====
        clothing = Category.objects.create(
            name='Clothing',
            slug='clothing',
            description='Apparel and clothing items',
            has_variants=True,
            variant_type='size_color'
        )

        # Clothing subcategories
        mens_clothing = Category.objects.create(
            name="Men's Clothing",
            slug='mens-clothing',
            description="Men's apparel",
            parent=clothing,
            has_variants=True,
            variant_type='size_color'
        )

        womens_clothing = Category.objects.create(
            name="Women's Clothing",
            slug='womens-clothing',
            description="Women's apparel",
            parent=clothing,
            has_variants=True,
            variant_type='size_color'
        )

        # Men's T-Shirts
        mens_tshirt = Product.objects.create(
            name="Classic Men's T-Shirt",
            slug='classic-mens-tshirt',
            category=mens_clothing,
            description='Comfortable cotton t-shirt for everyday wear',
            base_price=299.00,
            stock=0,
            is_active=True,
            is_restockable=True,
            svg_placeholder=svg_placeholder
        )
        for size in ['S', 'M', 'L', 'XL']:
            for color in ['Black', 'White', 'Olive']:
                ProductVariant.objects.create(
                    product=mens_tshirt,
                    sku=f'MTSH-{color[:3].upper()}-{size}',
                    color=color,
                    size=size,
                    price_modifier=0.00 if size in ['S', 'M'] else 50.00,
                    stock=25,
                    is_active=True
                )

        # Men's Jeans
        mens_jeans = Product.objects.create(
            name="Men's Denim Jeans",
            slug='mens-denim-jeans',
            category=mens_clothing,
            description='Classic fit denim jeans',
            base_price=799.00,
            stock=0,
            is_active=True,
            is_restockable=True,
            svg_placeholder=svg_placeholder
        )
        for size in ['30', '32', '34', '36', '38']:
            for color in ['Blue', 'Black']:
                ProductVariant.objects.create(
                    product=mens_jeans,
                    sku=f'MJEAN-{color[:3].upper()}-{size}',
                    color=color,
                    size=size,
                    price_modifier=0.00,
                    stock=15,
                    is_active=True
                )

        # Women's Dress
        womens_dress = Product.objects.create(
            name="Women's Summer Dress",
            slug='womens-summer-dress',
            category=womens_clothing,
            description='Elegant summer dress perfect for any occasion',
            base_price=599.00,
            stock=0,
            is_active=True,
            is_restockable=True,
            svg_placeholder=svg_placeholder
        )
        for size in ['XS', 'S', 'M', 'L', 'XL']:
            for color in ['Floral', 'White', 'Olive']:
                ProductVariant.objects.create(
                    product=womens_dress,
                    sku=f'WDRS-{color[:3].upper()}-{size}',
                    color=color,
                    size=size,
                    price_modifier=0.00 if size in ['XS', 'S', 'M'] else 100.00,
                    stock=20,
                    is_active=True
                )

        # ===== FOOTWEAR CATEGORY =====
        footwear = Category.objects.create(
            name='Footwear',
            slug='footwear',
            description='Shoes and sneakers',
            has_variants=True,
            variant_type='size_color'
        )

        mens_shoes = Category.objects.create(
            name="Men's Shoes",
            slug='mens-shoes',
            description="Men's footwear",
            parent=footwear,
            has_variants=True,
            variant_type='size_color'
        )

        womens_shoes = Category.objects.create(
            name="Women's Shoes",
            slug='womens-shoes',
            description="Women's footwear",
            parent=footwear,
            has_variants=True,
            variant_type='size_color'
        )

        # Men's Sneakers
        mens_sneakers = Product.objects.create(
            name="Men's Athletic Sneakers",
            slug='mens-athletic-sneakers',
            category=mens_shoes,
            description='Comfortable sneakers for sports and casual wear',
            base_price=1299.00,
            stock=0,
            is_active=True,
            is_restockable=True,
            svg_placeholder=svg_placeholder
        )
        for size in ['8', '9', '10', '11', '12']:
            for color in ['White', 'Black', 'Olive']:
                ProductVariant.objects.create(
                    product=mens_sneakers,
                    sku=f'MSNK-{color[:3].upper()}-{size}',
                    color=color,
                    size=size,
                    price_modifier=0.00,
                    stock=12,
                    is_active=True
                )

        # Women's Heels
        womens_heels = Product.objects.create(
            name="Women's Classic Heels",
            slug='womens-classic-heels',
            category=womens_shoes,
            description='Elegant heels for formal occasions',
            base_price=899.00,
            stock=0,
            is_active=True,
            is_restockable=True,
            svg_placeholder=svg_placeholder
        )
        for size in ['5', '6', '7', '8', '9']:
            for color in ['Black', 'Nude', 'Red']:
                ProductVariant.objects.create(
                    product=womens_heels,
                    sku=f'WHEL-{color[:3].upper()}-{size}',
                    color=color,
                    size=size,
                    price_modifier=0.00,
                    stock=10,
                    is_active=True
                )

        # ===== HOME & KITCHEN CATEGORY =====
        home_kitchen = Category.objects.create(
            name='Home & Kitchen',
            slug='home-kitchen',
            description='Home essentials and kitchenware',
            has_variants=False,
            variant_type=''
        )

        kitchen_appliances = Category.objects.create(
            name='Kitchen Appliances',
            slug='kitchen-appliances',
            description='Kitchen gadgets and appliances',
            parent=home_kitchen,
            has_variants=False,
            variant_type=''
        )

        home_decor = Category.objects.create(
            name='Home Decor',
            slug='home-decor',
            description='Decorative items for your home',
            parent=home_kitchen,
            has_variants=False,
            variant_type=''
        )

        # Coffee Maker
        Product.objects.create(
            name='Automatic Coffee Maker',
            slug='automatic-coffee-maker',
            category=kitchen_appliances,
            description='12-cup programmable coffee maker with thermal carafe',
            base_price=1499.00,
            stock=35,
            is_active=True,
            is_restockable=True,
            svg_placeholder=svg_placeholder
        )

        # Blender
        Product.objects.create(
            name='High-Speed Blender',
            slug='high-speed-blender',
            category=kitchen_appliances,
            description='Professional-grade blender for smoothies and more',
            base_price=2999.00,
            stock=20,
            is_active=True,
            is_restockable=True,
            svg_placeholder=svg_placeholder
        )

        # Decorative Vase
        Product.objects.create(
            name='Ceramic Decorative Vase',
            slug='ceramic-decorative-vase',
            category=home_decor,
            description='Handcrafted ceramic vase in olive finish',
            base_price=499.00,
            stock=45,
            is_active=True,
            is_restockable=True,
            svg_placeholder=svg_placeholder
        )

        # Wall Art
        Product.objects.create(
            name='Abstract Wall Art Canvas',
            slug='abstract-wall-art-canvas',
            category=home_decor,
            description='Modern abstract canvas print for living spaces',
            base_price=899.00,
            stock=15,
            is_active=True,
            is_restockable=True,
            svg_placeholder=svg_placeholder
        )

        # ===== ELECTRONICS CATEGORY =====
        electronics = Category.objects.create(
            name='Electronics',
            slug='electronics',
            description='Electronic devices and accessories',
            has_variants=False,
            variant_type=''
        )

        computers = Category.objects.create(
            name='Computers & Accessories',
            slug='computers-accessories',
            description='Computers and computer accessories',
            parent=electronics,
            has_variants=False,
            variant_type=''
        )

        audio = Category.objects.create(
            name='Audio',
            slug='audio',
            description='Audio equipment and headphones',
            parent=electronics,
            has_variants=False,
            variant_type=''
        )

        # Wireless Mouse
        Product.objects.create(
            name='Wireless Optical Mouse',
            slug='wireless-optical-mouse',
            category=computers,
            description='Ergonomic wireless mouse with precision tracking',
            base_price=399.00,
            stock=80,
            is_active=True,
            is_restockable=True,
            svg_placeholder=svg_placeholder
        )

        # USB-C Hub
        Product.objects.create(
            name='7-in-1 USB-C Hub',
            slug='7-in-1-usb-c-hub',
            category=computers,
            description='Multi-port USB-C hub with HDMI, USB 3.0, and card reader',
            base_price=699.00,
            stock=50,
            is_active=True,
            is_restockable=True,
            svg_placeholder=svg_placeholder
        )

        # Bluetooth Headphones
        Product.objects.create(
            name='Wireless Bluetooth Headphones',
            slug='wireless-bluetooth-headphones',
            category=audio,
            description='Noise-cancelling over-ear headphones with 30-hour battery',
            base_price=2499.00,
            stock=40,
            is_active=True,
            is_restockable=True,
            svg_placeholder=svg_placeholder
        )

        # Portable Speaker
        Product.objects.create(
            name='Portable Bluetooth Speaker',
            slug='portable-bluetooth-speaker',
            category=audio,
            description='Waterproof portable speaker with rich bass',
            base_price=1299.00,
            stock=60,
            is_active=True,
            is_restockable=True,
            svg_placeholder=svg_placeholder
        )

        # ===== SPORTS & OUTDOORS CATEGORY =====
        sports_outdoors = Category.objects.create(
            name='Sports & Outdoors',
            slug='sports-outdoors',
            description='Sports equipment and outdoor gear',
            has_variants=False,
            variant_type=''
        )

        fitness = Category.objects.create(
            name='Fitness Equipment',
            slug='fitness-equipment',
            description='Home fitness and gym equipment',
            parent=sports_outdoors,
            has_variants=False,
            variant_type=''
        )

        camping = Category.objects.create(
            name='Camping & Hiking',
            slug='camping-hiking',
            description='Camping and hiking essentials',
            parent=sports_outdoors,
            has_variants=False,
            variant_type=''
        )

        # Yoga Mat
        Product.objects.create(
            name='Premium Yoga Mat',
            slug='premium-yoga-mat',
            category=fitness,
            description='Non-slip yoga mat with carrying strap',
            base_price=599.00,
            stock=70,
            is_active=True,
            is_restockable=True,
            svg_placeholder=svg_placeholder
        )

        # Dumbbells Set
        Product.objects.create(
            name='Adjustable Dumbbell Set',
            slug='adjustable-dumbbell-set',
            category=fitness,
            description='Pair of adjustable dumbbells (5-25kg)',
            base_price=3499.00,
            stock=25,
            is_active=True,
            is_restockable=True,
            svg_placeholder=svg_placeholder
        )

        # Camping Tent
        Product.objects.create(
            name='4-Person Camping Tent',
            slug='4-person-camping-tent',
            category=camping,
            description='Waterproof family tent with easy setup',
            base_price=2999.00,
            stock=15,
            is_active=True,
            is_restockable=True,
            svg_placeholder=svg_placeholder
        )

        # Hiking Backpack
        Product.objects.create(
            name='40L Hiking Backpack',
            slug='40l-hiking-backpack',
            category=camping,
            description='Durable hiking backpack with multiple compartments',
            base_price=1499.00,
            stock=30,
            is_active=True,
            is_restockable=True,
            svg_placeholder=svg_placeholder
        )

        # ===== BOOKS CATEGORY =====
        books = Category.objects.create(
            name='Books',
            slug='books',
            description='Books and literature',
            has_variants=False,
            variant_type=''
        )

        fiction = Category.objects.create(
            name='Fiction',
            slug='fiction',
            description='Fiction books and novels',
            parent=books,
            has_variants=False,
            variant_type=''
        )

        non_fiction = Category.objects.create(
            name='Non-Fiction',
            slug='non-fiction',
            description='Non-fiction and educational books',
            parent=books,
            has_variants=False,
            variant_type=''
        )

        # Fiction Books
        Product.objects.create(
            name='The Great Adventure Novel',
            slug='the-great-adventure-novel',
            category=fiction,
            description='A thrilling adventure story set in exotic lands',
            base_price=299.00,
            stock=100,
            is_active=True,
            is_restockable=True,
            svg_placeholder=svg_placeholder
        )

        Product.objects.create(
            name='Mystery in the City',
            slug='mystery-in-the-city',
            category=fiction,
            description='A gripping mystery novel full of twists',
            base_price=349.00,
            stock=85,
            is_active=True,
            is_restockable=True,
            svg_placeholder=svg_placeholder
        )

        # Non-Fiction Books
        Product.objects.create(
            name='The Art of Productivity',
            slug='the-art-of-productivity',
            category=non_fiction,
            description='Master your time and boost productivity',
            base_price=399.00,
            stock=75,
            is_active=True,
            is_restockable=True,
            svg_placeholder=svg_placeholder
        )

        Product.objects.create(
            name='Cooking Basics: A Beginner Guide',
            slug='cooking-basics-beginner-guide',
            category=non_fiction,
            description='Learn essential cooking techniques and recipes',
            base_price=449.00,
            stock=60,
            is_active=True,
            is_restockable=True,
            svg_placeholder=svg_placeholder
        )

        self.stdout.write(self.style.SUCCESS('Successfully created dummy data!'))
        self.stdout.write(f'Created {Category.objects.count()} categories')
        self.stdout.write(f'Created {Product.objects.count()} products')
        self.stdout.write(f'Created {ProductVariant.objects.count()} product variants')
