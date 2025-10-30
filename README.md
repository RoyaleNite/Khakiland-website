# POC Online Shop

A full-stack e-commerce application built with Django REST Framework and React + TypeScript.

## Features

- User authentication (JWT-based)
- Product browsing with filtering and search
- 100 pre-generated products across 6 categories
- Product variants (sizes and colors for wearables, colors for electronics/tools)
- Shopping cart functionality
- Checkout with shipping information
- Order history and invoicing
- Light/Dark theme switching
- Responsive design with Tailwind CSS, MUI, Radix UI, and shadcn components

## Tech Stack

### Backend
- Django 5.0.2
- Django REST Framework
- djangorestframework-simplejwt (JWT authentication)
- SQLite database
- django-cors-headers

### Frontend
- React 18 + TypeScript
- Vite
- React Router
- Zustand (state management)
- Axios (API client)
- Tailwind CSS
- Material UI (MUI)
- Radix UI
- shadcn/ui components

## Project Structure

```
POC-Online-Shop/
├── backend/              # Django backend
│   ├── accounts/         # User authentication & profiles
│   ├── products/         # Products, categories, variants
│   ├── cart/             # Shopping cart
│   ├── orders/           # Orders and order items
│   ├── config/           # Django settings
│   └── manage.py
│
└── frontend/             # React frontend
    ├── src/
    │   ├── api/          # API client
    │   ├── components/   # React components
    │   ├── pages/        # Page components
    │   ├── store/        # Zustand stores
    │   ├── types/        # TypeScript types
    │   └── lib/          # Utilities
    └── package.json
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd POC-Online-Shop/backend
   ```

2. Activate the virtual environment:
   ```bash
   source venv/bin/activate
   ```

3. The database is already set up with migrations applied and 100 products generated.

4. Run the development server:
   ```bash
   python manage.py runserver
   ```

   The API will be available at `http://localhost:8000/`

5. (Optional) Create a superuser to access the admin panel:
   ```bash
   python manage.py createsuperuser
   ```

   Admin panel: `http://localhost:8000/admin/`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd POC-Online-Shop/frontend
   ```

2. Dependencies are already installed.

3. Run the development server:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173/`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login (get JWT tokens)
- `POST /api/auth/token/refresh/` - Refresh access token
- `GET /api/auth/profile/` - Get user profile
- `PATCH /api/auth/profile/` - Update user profile

### Products
- `GET /api/products/` - List products (with pagination, filtering, search)
- `GET /api/products/{slug}/` - Get product details
- `GET /api/products/categories/` - List all categories

### Cart
- `GET /api/cart/` - Get user's cart
- `POST /api/cart/add/` - Add item to cart
- `PATCH /api/cart/items/{id}/` - Update cart item quantity
- `DELETE /api/cart/items/{id}/remove/` - Remove item from cart
- `DELETE /api/cart/clear/` - Clear entire cart

### Orders
- `GET /api/orders/` - List user's orders
- `GET /api/orders/{order_number}/` - Get order details
- `POST /api/orders/create/` - Create new order

## Product Categories

The system includes 100 products across these categories:

1. **Wearables** (30 products) - Clothing with size and color variants
   - T-shirts, Jeans, Hoodies, Jackets, etc.

2. **Electronics** (15 products) - Electronics with color variants
   - Headphones, Keyboards, Mice, Webcams, etc.

3. **Tools** (15 products) - Tools with color variants
   - Drills, Screwdrivers, Wrenches, etc.

4. **Hot Sauces** (15 products) - No variants
   - Ghost Pepper, Carolina Reaper, Habanero, etc.

5. **BBQ Sauces** (13 products) - No variants
   - Hickory, Mesquite, Carolina Mustard, etc.

6. **Condiments** (12 products) - No variants
   - Mustards, Mayo, Horseradish, etc.

## Features Implemented

### Backend
✅ Custom User model with email authentication
✅ JWT token authentication with refresh
✅ Product models with variants support
✅ Dynamic product options (sizes/colors) based on category
✅ Shopping cart with item management
✅ Order creation with shipping info
✅ Management command to generate 100 products
✅ SVG placeholder image generation
✅ Admin panel for all models
✅ CORS configuration for React frontend

### Frontend (In Progress)
✅ Project structure setup
✅ TypeScript types for all models
✅ API client with interceptors
✅ Auth store with Zustand
✅ Cart store with Zustand
✅ Theme store for light/dark mode
✅ Tailwind CSS configuration
✅ UI component setup (Button, Input, Card)

### To Complete (Frontend Pages)
- [ ] App.tsx with routing
- [ ] Login page
- [ ] Signup page
- [ ] Home page with product grid
- [ ] Product detail page
- [ ] Shopping cart page
- [ ] Checkout page
- [ ] Order confirmation page
- [ ] Theme toggle component
- [ ] Navigation/Header component

## Development Notes

- All 100 products have been generated with realistic names and descriptions
- Products include SVG placeholders with category-specific colors
- Cart calculations include tax (8%) and shipping ($10, free over $50)
- Order numbers are auto-generated with format: ORD-XXXXXXXX

## Next Steps

Complete the frontend React pages and components to create a fully functional e-commerce experience.
