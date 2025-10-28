"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getDeviceInfo } from "@/lib/device";

// 모바일 하단 탭 네비게이션 컴포넌트 - PWA 최적화
export default function MobileTabNavigation() {
  const supabase = useMemo(() => createClient(), []);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deviceInfo, setDeviceInfo] = useState<ReturnType<typeof getDeviceInfo> | null>(null);

  useEffect(() => {
    setDeviceInfo(getDeviceInfo());
  }, []);

  useEffect(() => {
    // 현재 세션 확인
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsLoggedIn(!!session);
      } catch (error) {
        console.error('세션 확인 오류:', error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsLoggedIn(!!session);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  // PWA 스타일 적용
  const containerClasses = deviceInfo?.isPWA 
    ? "fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 md:hidden z-50 shadow-lg pwa-safe-bottom"
    : "fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 md:hidden z-50 shadow";
    
  const itemClasses = deviceInfo?.isTouchDevice
    ? "flex flex-col items-center p-2 text-slate-600 hover:text-blue-600 active:text-blue-700 transition-all duration-200 min-h-[48px] active:scale-95 material-ripple touch-optimized"
    : "flex flex-col items-center p-1 text-slate-600 hover:text-blue-600 transition-colors duration-200";

  if (loading) {
    return (
      <div
        className={containerClasses}
        style={{
          paddingBottom: deviceInfo?.isPWA ? 'env(safe-area-inset-bottom)' : undefined
        }}
        data-authenticated={isLoggedIn ? 'true' : 'false'}
      >
        <div className="flex items-center justify-around py-1">
          <Link href="/" className={itemClasses}>
            <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-xs font-medium">홈</span>
          </Link>
          <Link href="/campaigns" className={itemClasses}>
            <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-medium">캠페인</span>
          </Link>
          <Link href="/influencers" className={itemClasses}>
            <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
            </svg>
            <span className="text-xs font-medium">인플루언서</span>
          </Link>
          <Link href="/news" className={itemClasses}>
            <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 00-2 2v10a1 1 0 001 1h12a3 3 0 003-3V7a1 1 0 00-1-1h-2V5a2 2 0 00-2-2H4z" />
              <path d="M6 7h4a1 1 0 010 2H6a1 1 0 110-2zm0 4h6a1 1 0 010 2H6a1 1 0 010-2z" />
            </svg>
            <span className="text-xs font-medium">뉴스룸</span>
          </Link>
          <Link href="/dashboard" className={itemClasses}>
            <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            <span className="text-xs font-medium">대시보드</span>
          </Link>
          <Link href="/contact" className={itemClasses}>
            <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <span className="text-xs font-medium">연락처</span>
          </Link>
          <Link href={isLoggedIn ? "/profile" : "/auth"} className={itemClasses}>
            <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a4 4 0 014 4v1a4 4 0 11-8 0V6a4 4 0 014-4z" />
              <path d="M4 14a4 4 0 014-4h4a4 4 0 014 4v2H4v-2z" />
            </svg>
            <span className="text-xs font-medium">{isLoggedIn ? '내 계정' : '로그인'}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={containerClasses}
      style={{
        paddingBottom: deviceInfo?.isPWA ? 'env(safe-area-inset-bottom)' : undefined
      }}
      data-authenticated={isLoggedIn ? 'true' : 'false'}
    >
      <div className="flex items-center justify-around py-1">
        <Link href="/" className={itemClasses}>
          <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span className="text-xs font-medium">홈</span>
        </Link>
        <Link href="/campaigns" className={itemClasses}>
          <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-medium">캠페인</span>
        </Link>
        <Link href="/influencers" className={itemClasses}>
          <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
          </svg>
          <span className="text-xs font-medium">인플루언서</span>
        </Link>
        <Link href="/news" className={itemClasses}>
          <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a2 2 0 00-2 2v10a1 1 0 001 1h12a3 3 0 003-3V7a1 1 0 00-1-1h-2V5a2 2 0 00-2-2H4z" />
            <path d="M6 7h4a1 1 0 010 2H6a1 1 0 110-2zm0 4h6a1 1 0 010 2H6a1 1 0 010-2z" />
          </svg>
          <span className="text-xs font-medium">뉴스룸</span>
        </Link>
        <Link href="/dashboard" className={itemClasses}>
          <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
          <span className="text-xs font-medium">대시보드</span>
        </Link>
        <Link href="/contact" className={itemClasses}>
          <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <span className="text-xs font-medium">연락처</span>
        </Link>
        <Link href={isLoggedIn ? "/profile" : "/auth"} className={itemClasses}>
          <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a4 4 0 014 4v1a4 4 0 11-8 0V6a4 4 0 014-4z" />
            <path d="M4 14a4 4 0 014-4h4a4 4 0 014 4v2H4v-2z" />
          </svg>
          <span className="text-xs font-medium">{isLoggedIn ? '내 계정' : '로그인'}</span>
        </Link>
      </div>
    </div>
  );
} 