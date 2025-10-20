import { useState, useEffect } from 'react';

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAdminAuth = () => {
      try {
        const rawSession = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('adminAuth') : null;
        const rawLocal = typeof localStorage !== 'undefined' ? localStorage.getItem('adminAuth') : null;
        const adminAuth = rawSession ?? rawLocal;
        if (adminAuth) {
          const authData = JSON.parse(adminAuth);
          const role = typeof authData.role === 'string' ? authData.role : null;
          if (role && ['admin', 'reviewer'].includes(role)) {
            setIsAdmin(true);
          } else {
            setIsAdmin(authData.user === 'admin');
          }
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin auth:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'adminAuth') {
        checkAdminAuth();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return { isAdmin, loading };
}