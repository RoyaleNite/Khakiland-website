# 🔧 ISSUES TO FIX - Priority List

## Last Updated: October 28, 2025

---

## 🔴 CRITICAL ISSUES (Must Fix)

### 1. LoadingSplash Component - Wrong Colors
**File:** `/frontend/src/components/LoadingSplash.tsx`

**Issue:** Still uses amber colors everywhere

**Current:**
```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-amber-600 via-yellow-700 to-amber-800">
  <div className="absolute top-0 left-0 w-24 h-24 bg-amber-200/20 rounded-full animate-ping" />
  <div className="w-24 h-24 border-8 border-amber-100/30 rounded-full" />
  <div className="absolute top-0 left-0 w-24 h-24 border-8 border-amber-100 border-t-transparent rounded-full animate-spin" />
  <h1 className="text-5xl font-bold text-amber-50 mb-2 animate-pulse drop-shadow-lg">
  <p className="text-amber-100 text-lg drop-shadow">
  <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-200 rounded-full animate-float" />
```

**Should Be:**
```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#6B8E23] via-[#8B7D3A] to-[#4B5320]">
  <div className="absolute top-0 left-0 w-24 h-24 bg-[#C2B280]/20 rounded-full animate-ping" />
  <div className="w-24 h-24 border-8 border-[#E8E6D5]/30 rounded-full" />
  <div className="absolute top-0 left-0 w-24 h-24 border-8 border-[#E8E6D5] border-t-transparent rounded-full animate-spin" />
  <h1 className="text-5xl font-bold text-[#F5F4ED] mb-2 animate-pulse drop-shadow-lg">
  <p className="text-[#E8E6D5] text-lg drop-shadow">
  <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#C2B280] rounded-full animate-float" />
```

---

### 2. Status Badges - Wrong Colors
**Files:**
- `/frontend/src/pages/OrdersPage.tsx`
- `/frontend/src/pages/OrderDetailPage.tsx`

**Issue:** Using blue, purple, green, red, orange, gray instead of olive/khaki palette

**Current:**
```tsx
const statusColors: Record<Order['status'], string> = {
  pending: 'bg-[#D2B48C]',
  processing: 'bg-blue-500',     // ❌ WRONG
  shipped: 'bg-purple-500',      // ❌ WRONG
  delivered: 'bg-green-500',     // ❌ WRONG
  cancelled: 'bg-red-500',       // ❌ WRONG
};

const paymentStatusColors: Record<Order['payment_status'], string> = {
  unpaid: 'bg-orange-500',       // ❌ WRONG
  paid: 'bg-green-500',          // ❌ WRONG
  refunded: 'bg-gray-500',       // ❌ WRONG
};
```

**Should Be:**
```tsx
const statusColors: Record<Order['status'], string> = {
  pending: 'bg-[#D2B48C]',       // ✅ Khaki - Warning/Pending
  processing: 'bg-[#D2B48C]',    // ✅ Khaki - Processing
  shipped: 'bg-[#9C9A73]',       // ✅ Olive Light - In Transit
  delivered: 'bg-[#6B8E23]',     // ✅ Olive Default - Success
  cancelled: 'bg-[#6C541E]',     // ✅ Khaki Dark - Cancelled
};

const paymentStatusColors: Record<Order['payment_status'], string> = {
  unpaid: 'bg-[#D2B48C]',        // ✅ Khaki - Pending Payment
  paid: 'bg-[#6B8E23]',          // ✅ Olive Default - Paid
  refunded: 'bg-[#6C541E]',      // ✅ Khaki Dark - Refunded
};

// Text colors for badges
const statusTextColors: Record<Order['status'], string> = {
  pending: 'text-[#3B3A2E]',
  processing: 'text-[#3B3A2E]',
  shipped: 'text-white',
  delivered: 'text-white',
  cancelled: 'text-white',
};

const paymentTextColors: Record<Order['payment_status'], string> = {
  unpaid: 'text-[#3B3A2E]',
  paid: 'text-white',
  refunded: 'text-white',
};
```

---

### 3. OrderConfirmationPage - Gray & Green Colors
**File:** `/frontend/src/pages/OrderConfirmationPage.tsx`

**Issue:** Uses gray colors and system green CheckCircle

**Current Problems:**
```tsx
<CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />  // ❌
<Typography className="!text-gray-600 dark:!text-gray-400 !text-lg">  // ❌
<Card className="mb-6 !border-gray-200 dark:!border-gray-800 !shadow-lg">  // ❌
```

**Should Be:**
```tsx
<CheckCircle className="h-20 w-20 text-[#6B8E23] dark:text-[#9C9A73] mx-auto mb-4" />  // ✅
<Typography className="!text-[#5C5A44] dark:!text-[#C2B280] !text-lg">  // ✅
<Card className="mb-6 !border-[#C2B280] dark:!border-[#4B5320] !shadow-lg">  // ✅
```

---

## 🟡 HIGH PRIORITY ISSUES

### 4. ProfilePage - No Background Gradient
**File:** `/frontend/src/pages/ProfilePage.tsx`

**Issue:** Page lacks the standard background gradient

**Current:**
```tsx
<Container maxWidth="lg" className="py-8">
```

**Should Be:**
```tsx
<div className="min-h-screen bg-gradient-to-br from-[#F5F4ED] via-[#E8E6D5] to-[#D2B48C] dark:from-[#2A2817] dark:via-[#3A3621] dark:to-[#2A2817]">
  <Container maxWidth="lg" className="py-8">
```

---

### 5. ProductDetailPage - One Amber Reference
**File:** `/frontend/src/pages/ProductDetailPage.tsx`

**Issue:** Loading spinner still uses amber-600

**Current:**
```tsx
<div className="inline-block w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4" />
```

**Should Be:**
```tsx
<div className="inline-block w-12 h-12 border-4 border-[#6B8E23] border-t-transparent rounded-full animate-spin mb-4" />
```

---

### 6. CheckoutPage - Select Dropdown Border
**File:** `/frontend/src/pages/CheckoutPage.tsx`

**Issue:** Select dropdown uses gray border

**Current:**
```tsx
className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-background"
```

**Should Be:**
```tsx
className="w-full px-3 py-2 border border-[#C2B280] dark:border-[#4B5320] rounded-md bg-background"
```

---

## 🟢 MEDIUM PRIORITY ISSUES

### 7. StaffDashboard - Minimal Theming
**File:** `/frontend/src/pages/staff/Dashboard.tsx`

**Issue:** Needs background gradient and enhanced card styling

**Add:**
```tsx
// Wrap entire return in:
<div className="min-h-screen bg-gradient-to-br from-[#F5F4ED] via-[#E8E6D5] to-[#D2B48C] dark:from-[#2A2817] dark:via-[#3A3621] dark:to-[#2A2817]">
  <Container maxWidth="xl" className="py-8">
    {/* existing content */}
  </Container>
</div>
```

---

### 8. Toast Component - Gray Default State
**File:** `/frontend/src/components/ui/Toast.tsx`

**Issue:** Default toast uses gray colors

**Current:**
```tsx
variant === "default" && "border-gray-200 bg-white text-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
```

**Should Be:**
```tsx
variant === "default" && "border-[#C2B280] bg-white text-[#3B3A2E] dark:border-[#4B5320] dark:bg-[#3A3621] dark:text-[#E8E6D5]",
```

---

### 9. OrderDetailPage - Red Cancel Button
**File:** `/frontend/src/pages/OrderDetailPage.tsx`

**Issue:** Cancel button uses system red

**Current:**
```tsx
className="w-full text-red-600 hover:text-red-700 mt-4"
```

**Should Be:**
```tsx
className="w-full text-destructive hover:text-destructive/90 mt-4"
// This is acceptable as it's a destructive action
// OR use: text-[#6C541E] hover:text-[#4B5320]
```

---

## 🔵 LOW PRIORITY ISSUES

### 10. CartPage - Red Remove Button
**File:** `/frontend/src/pages/CartPage.tsx`

**Issue:** Remove button uses system red

**Current:**
```tsx
className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
```

**Keep As-Is:** This is acceptable for delete actions
**OR Change To:**
```tsx
className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
```

---

### 11. LoginPage/RegisterPage - Red Error Alert
**Files:**
- `/frontend/src/pages/LoginPage.tsx`
- `/frontend/src/pages/RegisterPage.tsx`

**Issue:** Error alerts use system red

**Current:**
```tsx
className="mb-4 !bg-red-50 dark:!bg-red-950 !border-red-200 dark:!border-red-900"
```

**Keep As-Is:** Red is appropriate for errors
**This is acceptable**

---

## 📊 SUMMARY

### By Priority
- **Critical (Must Fix):** 3 issues
- **High Priority:** 3 issues
- **Medium Priority:** 3 issues
- **Low Priority:** 2 issues

### By File
- **LoadingSplash.tsx:** 1 critical issue
- **OrdersPage.tsx:** 1 critical issue (status colors)
- **OrderDetailPage.tsx:** 2 issues (status colors + cancel button)
- **OrderConfirmationPage.tsx:** 1 critical issue
- **ProfilePage.tsx:** 1 high priority issue
- **ProductDetailPage.tsx:** 1 high priority issue
- **CheckoutPage.tsx:** 1 high priority issue
- **Dashboard.tsx:** 1 medium priority issue
- **Toast.tsx:** 1 medium priority issue
- **CartPage.tsx:** 1 low priority issue
- **LoginPage.tsx/RegisterPage.tsx:** 1 low priority issue (acceptable)

### Total Issues: 11 (3 critical, 3 high, 3 medium, 2 low)

---

## ✅ FIX ORDER

1. Fix LoadingSplash colors (CRITICAL)
2. Fix status badge colors in OrdersPage (CRITICAL)
3. Fix status badge colors in OrderDetailPage (CRITICAL)
4. Fix OrderConfirmationPage colors (CRITICAL)
5. Fix ProductDetailPage loading spinner (HIGH)
6. Fix CheckoutPage select border (HIGH)
7. Add ProfilePage background gradient (HIGH)
8. Add StaffDashboard background gradient (MEDIUM)
9. Fix Toast default colors (MEDIUM)
10. Review cancel/delete button colors (LOW - Optional)
11. Review error alert colors (LOW - Keep as-is)

---

**Estimated Fix Time:** 30-45 minutes for all critical and high priority issues

---

**Next Steps:**
1. Read this file to understand all issues
2. Fix issues in priority order
3. Test each fix
4. Update this file when complete
