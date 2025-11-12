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
    <div className="flex flex-wrap items-center justify-center gap-3 text-center md:justify-start md:text-left">
      <span className="text-sm text-slate-600">
        안녕하세요, {greetingLabel}님!
      </span>
      <Link
        href="/mypage"
        className="w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition duration-200 hover:bg-blue-100 sm:w-auto"
      >
        마이페이지
      </Link>
      <button
        onClick={handleLogout}
        className="w-full rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-rose-600 sm:w-auto"
      >
        로그아웃
      </button>
    </div>
  ) : (
    <Link
      href="/auth"
      className="btn-primary inline-flex w-full items-center justify-center px-4 py-2 text-sm sm:w-auto"
    >
      관리자 로그인
    </Link>
  );
}
