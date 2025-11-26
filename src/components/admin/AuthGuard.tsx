import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
}

const SESSION_DURATION = 30 * 60 * 1000; // 30 minutos en milisegundos

export default function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();

  const isSessionValid = useCallback(() => {
    const authTime = localStorage.getItem('adminAuthTime');
    const isAuth = localStorage.getItem('adminAuth') === 'true';
    
    if (!isAuth || !authTime) return false;
    
    const sessionAge = Date.now() - parseInt(authTime);
    return sessionAge < SESSION_DURATION;
  }, []);

  const renewSession = useCallback(() => {
    if (localStorage.getItem('adminAuth') === 'true') {
      localStorage.setItem('adminAuthTime', Date.now().toString());
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminAuthTime');
    navigate('/admin/login');
  }, [navigate]);

  useEffect(() => {
    if (!isSessionValid()) {
      logout();
      return;
    }

    // Renovar sesión en actividad del usuario
    const handleActivity = () => renewSession();
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Verificar sesión cada minuto
    const sessionCheck = setInterval(() => {
      if (!isSessionValid()) {
        logout();
      }
    }, 60000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      clearInterval(sessionCheck);
    };
  }, [isSessionValid, renewSession, logout]);

  if (!isSessionValid()) {
    return null;
  }

  return <>{children}</>;
}