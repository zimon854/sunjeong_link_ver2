'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm text-secondary">안녕하세요, {user.email}님!</span>
      <button
        onClick={handleLogout}
        className="px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-sm font-semibold transition break-keep duration-200 transform hover:scale-105 active:scale-100"
      >
        로그아웃
      </button>
    </div>
  ) : (
    <Link href="/auth" className="btn-primary text-sm px-4 py-2">
      로그인 / 회원가입
    </Link>
  );
}
