'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthButton() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // localStorage에서 관리자 세션 확인
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth) {
      try {
        const authData = JSON.parse(adminAuth);
        setIsAdmin(authData.user === 'admin');
      } catch (error) {
        console.error('Error parsing admin auth:', error);
        setIsAdmin(false);
      }
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('adminAuth');
      // 쿠키도 삭제
      document.cookie = 'adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      setIsAdmin(false);
      router.push('/auth');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return isAdmin ? (
    <div className="flex items-center gap-4">
      <span className="text-sm text-secondary">
        안녕하세요, 관리자님!
      </span>
      <button
        onClick={handleLogout}
        className="px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-sm font-semibold transition break-keep duration-200 transform hover:scale-105 active:scale-100"
      >
        로그아웃
      </button>
    </div>
  ) : (
    <Link href="/auth" className="btn-primary text-sm px-4 py-2">
      관리자 로그인
    </Link>
  );
}
