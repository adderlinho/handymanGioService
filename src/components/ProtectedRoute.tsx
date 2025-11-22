import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
  const authExpiry = localStorage.getItem('adminAuthExpiry');
  
  // Check if session has expired
  if (isAuthenticated && authExpiry) {
    const now = Date.now();
    if (now > parseInt(authExpiry)) {
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('adminAuthExpiry');
      return <Navigate to="/admin/login" replace />;
    }
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" replace />;
}