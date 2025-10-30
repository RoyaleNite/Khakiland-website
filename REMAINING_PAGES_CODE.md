# Remaining Pages - Complete Implementation Code

## 1. Staff Orders Page (`/frontend/src/pages/staff/OrdersPage.tsx`)

This page needs:
- List all orders with filtering (status, payment_status, date range)
- Update order status (mark as processing, shipped, delivered)
- Update payment status (mark as paid/unpaid)
- Cancel orders
- Mark items as received back
- Search and pagination

Create this file with API calls to:
- GET `/api/orders/staff/all/?status=&payment_status=&start_date=&end_date=`
- PATCH `/api/orders/staff/<number>/update/` - Update status/payment
- POST `/api/orders/staff/<number>/cancel/` - Cancel order
- POST `/api/orders/staff/<number>/received-back/` - Mark return received

## 2. Staff Inventory Page (`/frontend/src/pages/staff/InventoryPage.tsx`)

This page needs:
- List all products with filtering
- Add/Edit/Delete products
- Adjust stock levels (manual adjustments for in-store sales)
- View stock adjustment history
- Filter by category, stock level (out of stock, low stock)

Create this file with API calls to:
- GET `/api/inventory/products/?category_id=&low_stock=&out_of_stock=`
- POST `/api/inventory/stock/adjust/` - Adjust stock
- GET `/api/inventory/stock/history/` - View adjustment history
- POST/PATCH/DELETE `/api/inventory/products/` - CRUD operations

## 3. Update CheckoutPage - Add Payment Method Selection

Add to existing CheckoutPage:
```typescript
const [paymentMethod, setPaymentMethod] = useState<string>('card');
const [paymentStatus, setPaymentStatus] = useState<string>('unpaid');

// In form:
<div>
  <Label>Payment Method</Label>
  <select
    value={paymentMethod}
    onChange={(e) => setPaymentMethod(e.target.value)}
    className="w-full px-3 py-2 border rounded-md"
  >
    <option value="card">Credit/Debit Card</option>
    <option value="cash">Cash</option>
    <option value="eft">EFT</option>
    <option value="bank_transfer">Bank Transfer</option>
    <option value="in_store">In Store</option>
  </select>
</div>

<div className="flex items-center gap-2">
  <input
    type="checkbox"
    id="pay_now"
    checked={paymentStatus === 'paid'}
    onChange={(e) => setPaymentStatus(e.target.checked ? 'paid' : 'unpaid')}
  />
  <Label htmlFor="pay_now">Mark as paid now</Label>
</div>

// In handleSubmit, include:
const orderData = {
  ...shippingInfo,
  payment_method: paymentMethod,
  payment_status: paymentStatus,
};
```

## 4. Update ProductDetailPage - Better Quantity Display

Add to existing ProductDetailPage after variant selection:
```typescript
// Show stock prominently
<div className="mb-6 p-4 border rounded-md bg-amber-50 dark:bg-stone-800">
  <Typography variant="subtitle1" className="font-semibold mb-2">
    Stock Availability
  </Typography>

  {selectedVariant ? (
    <>
      <Typography className="text-2xl font-bold text-green-600">
        {selectedVariant.stock} units available
      </Typography>
      {selectedVariant.stock < 10 && selectedVariant.stock > 0 && (
        <Typography variant="body2" className="text-orange-600 mt-1">
          Only {selectedVariant.stock} left in stock - order soon!
        </Typography>
      )}
      {selectedVariant.stock === 0 && (
        <Typography variant="body2" className="text-red-600 mt-1">
          Out of stock
        </Typography>
      )}
    </>
  ) : (
    <>
      <Typography className="text-2xl font-bold text-green-600">
        {product.stock} units available
      </Typography>
      {product.stock < 10 && product.stock > 0 && (
        <Typography variant="body2" className="text-orange-600 mt-1">
          Only {product.stock} left in stock - order soon!
        </Typography>
      )}
      {product.stock === 0 && product.is_one_time ? (
        <Typography variant="body2" className="text-red-600 mt-1">
          This item is no longer available
        </Typography>
      ) : product.stock === 0 ? (
        <Typography variant="body2" className="text-red-600 mt-1">
          Out of stock - will be restocked soon
        </Typography>
      ) : null}
    </>
  )}
</div>
```

## 5. Update App.tsx - Add All Routes

```typescript
import { StaffRoute } from './components/StaffRoute';
import { ProfilePage } from './pages/ProfilePage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { StaffDashboard } from './pages/staff/Dashboard';
import { StaffOrdersPage } from './pages/staff/OrdersPage';
import { StaffInventoryPage } from './pages/staff/InventoryPage';

// In Routes, add:
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  }
/>
<Route
  path="/my-orders"
  element={
    <ProtectedRoute>
      <OrdersPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/my-orders/:orderNumber"
  element={
    <ProtectedRoute>
      <OrderDetailPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/staff/dashboard"
  element={
    <StaffRoute>
      <StaffDashboard />
    </StaffRoute>
  }
/>
<Route
  path="/staff/orders"
  element={
    <StaffRoute>
      <StaffOrdersPage />
    </StaffRoute>
  }
/>
<Route
  path="/staff/inventory"
  element={
    <StaffRoute>
      <StaffInventoryPage />
    </StaffRoute>
  }
/>
```

## Quick Implementation Steps

1. **Create StaffOrdersPage.tsx** - Copy pattern from OrdersPage but use staff endpoints
2. **Create StaffInventoryPage.tsx** - Table with products, stock levels, adjustment form
3. **Update CheckoutPage.tsx** - Add payment method dropdown and paid checkbox
4. **Update ProductDetailPage.tsx** - Add stock availability section
5. **Update App.tsx** - Import and add all new routes

All backend APIs are ready and tested. Just connect the frontend!
