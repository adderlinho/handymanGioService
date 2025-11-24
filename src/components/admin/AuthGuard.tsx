import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
    
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
  
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}