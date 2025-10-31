import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import MobileTabNavigation from "./components/MobileTabNavigation";
import AuthButton from "../components/AuthButton";

export const metadata: Metadata = {
  title: "Lynkable - 인플루언서 마케팅 플랫폼",
  description: "한국 브랜드와 동남아시아 인플루언서를 연결하는 글로벌 공동구매 플랫폼",
};



function NavMenu({ href, label, desc }: { href: string; label: string; desc: string }) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center justify-center min-w-[90px] px-3 py-1 rounded-xl transition text-slate-700 font-semibold relative hover:bg-slate-100"
    >
      <span className="text-base whitespace-nowrap">{label}</span>
      <span className="absolute left-1/2 -bottom-2 translate-x-[-50%] translate-y-full opacity-0 group-hover:opacity-100 bg-white text-slate-600 text-xs rounded px-2 py-1 shadow-lg pointer-events-none transition z-20 whitespace-nowrap border border-slate-200">
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
      </head>
      <body className="bg-background text-foreground min-h-screen">
        <div className="flex flex-col min-h-screen">
          {/* 네비게이션바 */}
          <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-sm border-b border-slate-200 shadow-sm">
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
              
              {/* Desktop navigation */}
              <div className="hidden lg:flex items-center gap-6 text-[15px] font-medium text-slate-700">
                <NavMenu href="/campaigns" label="캠페인" desc="진행 중인 캠페인을 모두 확인" />
                <NavMenu href="/influencers" label="인플루언서" desc="인플루언서를 한눈에 살펴보기" />
                <NavMenu href="/news" label="뉴스룸" desc="최신 기사와 발표 확인" />
                <NavMenu href="/contact" label="연락처" desc="파트너십 & 고객지원 연결" />
                <NavMenu href="/dashboard" label="대시보드" desc="서비스 현황을 바로 확인" />
                <AuthButton />
              </div>
            </div>
          </nav>
          
          {/* 메인 콘텐츠 영역 */}
          <main className="flex-grow">
            {children}
          </main>

          {/* 푸터 */}
          <footer className="bg-white border-t border-slate-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* 회사 정보 */}
                <div className="text-xs text-slate-600 leading-relaxed">
                  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                    <span className="font-semibold text-slate-700">상호: 주식회사 선정에이전시</span>
                    <span>대표: 최성훈</span>
                    <span>사업자등록번호: 170-88-03245</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 mt-1">
                    <span>전화: 010-2803-5248</span>
                    <span>주소: 서울특별시 성동구 성수일로8길 55 B동 706호</span>
                  </div>
                  <div className="mt-1">
                    <span>광고관련: </span>
                    <a href="mailto:borrow13@sunjeong.co.kr" className="text-blue-600 hover:text-blue-700 transition">
                      borrow13@sunjeong.co.kr
                    </a>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-4">
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-700 transition text-xs">
                      개인정보처리방침
                    </Link>
                    <Link href="/terms" className="text-blue-600 hover:text-blue-700 transition text-xs">
                      이용약관
                    </Link>
                    <Link href="/contact" className="text-blue-600 hover:text-blue-700 transition text-xs">
                      연락처
                    </Link>
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
      </body>
    </html>
  );
}
