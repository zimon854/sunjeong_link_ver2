import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import MobileTabNavigation from "./components/MobileTabNavigation";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import NetworkStatus from "../components/NetworkStatus";
import AuthButton from "../components/AuthButton";

export const metadata: Metadata = {
  title: "Lynkable - 인플루언서 마케팅 플랫폼",
  description: "한국 브랜드와 동남아시아 인플루언서를 연결하는 글로벌 공동구매 플랫폼",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "링커블",
    startupImage: [
      {
        url: "/logo/sunjeong_link_logo.png",
        media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/logo/sunjeong_link_logo.png",
        media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/logo/sunjeong_link_logo.png",
        media: "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        url: "/logo/sunjeong_link_logo.png",
        media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        url: "/logo/sunjeong_link_logo.png",
        media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/logo/sunjeong_link_logo.png",
        media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)",
      },
    ],
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  icons: {
    icon: [
      { url: "/logo/sunjeong_link_logo.png", sizes: "192x192", type: "image/png" },
      { url: "/logo/sunjeong_link_logo.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/logo/sunjeong_link_logo.png", sizes: "180x180", type: "image/png" },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "링커블",
    "application-name": "링커블",
    "msapplication-TileColor": "#2563eb",
    "msapplication-tap-highlight": "no",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#2563eb',
  viewportFit: 'cover',
};

function NavMenu({ href, label, desc }: { href: string; label: string; desc: string }) {
  return (
    <Link href={href} className="group flex flex-col items-center justify-center min-w-[90px] px-3 py-1 rounded-xl hover:bg-blue-800/70 transition text-white font-semibold relative">
      <span className="text-base whitespace-nowrap">{label}</span>
      <span className="absolute left-1/2 -bottom-2 translate-x-[-50%] translate-y-full opacity-0 group-hover:opacity-100 bg-[#181830] text-blue-200 text-xs rounded px-2 py-1 shadow-lg pointer-events-none transition z-20 whitespace-nowrap">
        {desc}
      </span>
    </Link>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="링커블" />
        <meta name="application-name" content="링커블" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* iOS specific meta tags */}
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-orientations" content="portrait" />
        
        {/* Apple touch icons */}
        <link rel="apple-touch-icon" href="/logo/sunjeong_link_logo.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/logo/sunjeong_link_logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo/sunjeong_link_logo.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/logo/sunjeong_link_logo.png" />
        
        {/* Splash screens for iOS */}
        <link rel="apple-touch-startup-image" media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)" href="/logo/sunjeong_link_logo.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)" href="/logo/sunjeong_link_logo.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)" href="/logo/sunjeong_link_logo.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" href="/logo/sunjeong_link_logo.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" href="/logo/sunjeong_link_logo.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" href="/logo/sunjeong_link_logo.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" href="/logo/sunjeong_link_logo.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" href="/logo/sunjeong_link_logo.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" href="/logo/sunjeong_link_logo.png" />
      </head>
      <body className="bg-background text-foreground min-h-screen">
        <div className="flex flex-col min-h-screen">
          {/* PWA 전용 상태바 */}
          <div className="pwa-status-bar"></div>
          
          {/* 네비게이션바 */}
          <nav className="sticky top-0 z-50 w-full bg-[#181b3a]/95 backdrop-blur-xl border-b border-[#2d2f5d]/50 shadow-lg pwa-safe-top">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-3 md:py-4">
              {/* 왼쪽: 링커블 로고 */}
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo/sunjeong_link_logo.png"
                  alt="링커블 로고"
                  width={240}
                  height={80}
                  priority
                  className="h-8 md:h-14 w-auto object-contain"
                />
              </Link>
              
              {/* 데스크톱 메뉴 (모바일에서는 완전히 숨김) */}
              <div className="hidden lg:flex items-center gap-6 text-[15px] font-medium text-white">
                <NavMenu href="/campaigns" label="캠페인 리스트" desc="진행 중인 모든 캠페인 한눈에 보기" />
                <NavMenu href="/campaigns/new" label="캠페인 생성" desc="브랜드/셀러용 신규 캠페인 등록" />
                <NavMenu href="/influencers" label="인플루언서 리스트" desc="인플루언서 한눈에 보기" />
                <NavMenu href="/chat" label="실시간 채팅" desc="브랜드-인플루언서 실시간 소통" />
                <NavMenu href="/profile" label="내 프로필 관리" desc="이름, 역할, 소개, 프로필 이미지 관리" />
                <NavMenu href="/dashboard" label="내 대시보드" desc="내 서비스 현황 한눈에 보기" />
                <AuthButton />
              </div>
            </div>
          </nav>
          
          {/* 메인 콘텐츠 영역 */}
          <main className="flex-grow">
            {children}
          </main>

          {/* 푸터 */}
          <footer className="bg-[#181b3a]/95 border-t border-[#2d2f5d]/50 mt-auto">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* 회사 정보 */}
                <div className="text-xs text-gray-400 leading-relaxed">
                  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                    <span className="font-semibold">상호: 주식회사 선정에이전시</span>
                    <span>대표: 최성훈</span>
                    <span>사업자등록번호: 170-88-03245</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 mt-1">
                    <span>전화: 010-2803-5248</span>
                    <span>주소: 서울특별시 성동구 성수일로8길 55 B동 706호</span>
                  </div>
                  <div className="mt-1">
                    <span>광고관련: </span>
                    <a href="mailto:borrow13@sunjeong.co.kr" className="text-blue-400 hover:text-blue-300 transition">
                      borrow13@sunjeong.co.kr
                    </a>
                  </div>
                </div>

                {/* 로고 */}
                <div className="flex items-center">
                  <Image
                    src="/logo/sunjeong_link_logo.png"
                    alt="링커블 로고"
                    width={120}
                    height={40}
                    className="h-8 w-auto object-contain opacity-70"
                  />
                </div>
              </div>
            </div>
          </footer>

          {/* 모바일 하단 탭 네비게이션 */}
          <div className="block md:hidden">
            <MobileTabNavigation />
          </div>
        </div>
        <PWAInstallPrompt />
        <NetworkStatus />
      </body>
    </html>
  );
}
