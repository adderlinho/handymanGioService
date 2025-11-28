import React, { createContext, useContext, useState, useEffect } from 'react';
import { ADMIN_AUTH_CONFIG } from '../config/adminAuth';

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  login: (passcode: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = () => {
    try {
      const authState = localStorage.getItem(ADMIN_AUTH_CONFIG.storageKey);
      const authTime = localStorage.getItem(ADMIN_AUTH_CONFIG.timestampKey);
      
      if (authState === 'true' && authTime) {
        const timestamp = parseInt(authTime, 10);
        const now = Date.now();
        
        // Check if session has expired
        if (now - timestamp < ADMIN_AUTH_CONFIG.sessionTimeout) {
          setIsAuthenticated(true);
        } else {
          // Session expired, clear storage
          logout();
        }
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = (passcode: string): boolean => {
    const expectedPasscode = ADMIN_AUTH_CONFIG.passcode;
    
    if (!expectedPasscode || passcode !== expectedPasscode) {
      return false;
    }

    try {
      setIsAuthenticated(true);
      localStorage.setItem(ADMIN_AUTH_CONFIG.storageKey, 'true');
      localStorage.setItem(ADMIN_AUTH_CONFIG.timestampKey, Date.now().toString());
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  const logout = () => {
    try {
      setIsAuthenticated(false);
      localStorage.removeItem(ADMIN_AUTH_CONFIG.storageKey);
      localStorage.removeItem(ADMIN_AUTH_CONFIG.timestampKey);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextValue => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};