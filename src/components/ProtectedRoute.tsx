import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" replace />;
}