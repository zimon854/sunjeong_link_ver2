import { useState, useEffect } from 'react';

type AdminRole = 'admin' | 'reviewer';

export function useAdminAuth() {
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [role, setRole] = useState<AdminRole | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const assignStateFromAuth = (adminAuth: string | null) => {
    if (!adminAuth) {
      setHasAccess(false);
      setRole(null);
      return;
    }

    try {
      const authData = JSON.parse(adminAuth);
      const parsedRole = typeof authData.role === 'string' ? authData.role : null;

      if (parsedRole && (parsedRole === 'admin' || parsedRole === 'reviewer')) {
        setHasAccess(true);
        setRole(parsedRole);
        return;
      }

      if (authData.user === 'admin') {
        setHasAccess(true);
        setRole('admin');
        return;
      }
    } catch (error) {
      console.error('Error checking admin auth:', error);
    }

    setHasAccess(false);
    setRole(null);
  };

  useEffect(() => {
    const checkAdminAuth = () => {
      try {
        const rawSession = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('adminAuth') : null;
        const rawLocal = typeof localStorage !== 'undefined' ? localStorage.getItem('adminAuth') : null;
        const adminAuth = rawSession ?? rawLocal;
        assignStateFromAuth(adminAuth);
      } catch (error) {
        console.error('Error checking admin auth:', error);
        setHasAccess(false);
        setRole(null);
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

  return { isAdmin: hasAccess, loading, role, canManage: role === 'admin' };
}
