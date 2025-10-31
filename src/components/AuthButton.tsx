'use client';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthButton() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [role, setRole] = useState<'admin' | 'reviewer' | null>(null);
  const router = useRouter();

  const syncAdminState = useCallback(() => {
    const sessionValue = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('adminAuth') : null;
    const localValue = typeof localStorage !== 'undefined' ? localStorage.getItem('adminAuth') : null;
    const adminAuth = sessionValue ?? localValue;

    if (adminAuth) {
      try {
        const authData = JSON.parse(adminAuth);
        const parsedRole = typeof authData.role === 'string' ? authData.role : null;
        if (parsedRole && ['admin', 'reviewer'].includes(parsedRole)) {
          setIsAdmin(true);
          setRole(parsedRole as 'admin' | 'reviewer');
        } else if (authData.user === 'admin') {
          setIsAdmin(true);
          setRole('admin');
        } else {
          setIsAdmin(false);
          setRole(null);
        }
      } catch (error) {
        console.error('Error parsing admin auth:', error);
        setIsAdmin(false);
        setRole(null);
      }
    } else {
      setIsAdmin(false);
      setRole(null);
    }
  }, []);

  useEffect(() => {
    syncAdminState();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'adminAuth') {
        syncAdminState();
      }
    };

    const handleCustomEvent = () => syncAdminState();

    window.addEventListener('storage', handleStorage);
    window.addEventListener('adminAuth:changed', handleCustomEvent as EventListener);
    window.addEventListener('focus', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('adminAuth:changed', handleCustomEvent as EventListener);
      window.removeEventListener('focus', handleCustomEvent);
    };
  }, [syncAdminState]);

  const handleLogout = () => {
    try {
      // sessionStorage와 localStorage 모두 삭제
      sessionStorage.removeItem('adminAuth');
      localStorage.removeItem('adminAuth');
      // 쿠키도 삭제
      document.cookie = 'adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      setIsAdmin(false);
      setRole(null);
      window.dispatchEvent(new Event('adminAuth:changed'));
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const greetingLabel = '관리자 계정';

  return isAdmin ? (
    <div className="flex items-center gap-4 flex-nowrap">
      <span className="text-sm text-slate-600 whitespace-nowrap">
        안녕하세요, {greetingLabel}님!
      </span>
      <Link
        href="/mypage"
        className="px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-semibold transition duration-200 shadow-sm whitespace-nowrap"
      >
        마이페이지
      </Link>
      <button
        onClick={handleLogout}
        className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition duration-200 shadow-sm whitespace-nowrap"
      >
        로그아웃
      </button>
    </div>
  ) : (
    <Link
      href="/auth"
      className="btn-primary text-sm px-4 py-2 whitespace-nowrap inline-flex items-center justify-center"
    >
      관리자 로그인
    </Link>
  );
}
