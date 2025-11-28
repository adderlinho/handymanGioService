/**
 * Centralized admin authentication configuration
 * 
 * IMPORTANT: For production, set VITE_ADMIN_ACCESS_KEY environment variable
 * Never commit production keys to the repository
 */
export const ADMIN_AUTH_CONFIG = {
  // Use environment variable or fallback to development key
  passcode: (import.meta as any).env?.VITE_ADMIN_ACCESS_KEY || 'admin123',
  
  // Session timeout in milliseconds (24 hours)
  sessionTimeout: 24 * 60 * 60 * 1000,
  
  // Local storage key for auth state
  storageKey: 'gioService.adminAuth',
  
  // Local storage key for auth timestamp
  timestampKey: 'gioService.adminAuthTime',
};