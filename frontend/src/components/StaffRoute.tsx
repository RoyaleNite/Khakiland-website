import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LoadingSplash } from './LoadingSplash';

interface StaffRouteProps {
  children: React.ReactNode;
}

export function StaffRoute({ children }: StaffRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) {
    return <LoadingSplash />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.is_staff) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
