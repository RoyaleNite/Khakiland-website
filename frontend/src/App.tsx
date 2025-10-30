import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useCartStore } from './store/cartStore';
import { useThemeStore } from './store/themeStore';
import { Navbar } from './components/Navbar';
import { Toaster } from './components/ui/Toaster';
import { LoadingSplash } from './components/LoadingSplash';
import { StaffRoute } from './components/StaffRoute';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { ProfilePage } from './pages/ProfilePage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { StaffDashboard } from './pages/staff/Dashboard';
import { StaffOrdersPage } from './pages/staff/OrdersPage';
import { StaffInventoryPage } from './pages/staff/InventoryPage';
import { ProductManagementPage } from './pages/staff/ProductManagementPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingSplash />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { loadUser, isAuthenticated } = useAuthStore();
  const { fetchCart } = useCartStore();
  const { applyTheme } = useThemeStore();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    loadUser();
    applyTheme();

    // Show splash screen for 2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  if (showSplash) {
    return <LoadingSplash />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:orderNumber"
            element={
              <ProtectedRoute>
                <OrderConfirmationPage />
              </ProtectedRoute>
            }
          />
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
          <Route
            path="/staff/products"
            element={
              <StaffRoute>
                <ProductManagementPage />
              </StaffRoute>
            }
          />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;
