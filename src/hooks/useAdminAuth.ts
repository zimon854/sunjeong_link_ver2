import { useState, useEffect } from 'react';

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAdminAuth = () => {
      try {
        const adminAuth = localStorage.getItem('adminAuth');
        if (adminAuth) {
          const authData = JSON.parse(adminAuth);
          setIsAdmin(authData.user === 'admin');
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
  }, []);

  return { isAdmin, loading };
}