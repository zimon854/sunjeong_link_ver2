'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import AuthButton from "./AuthButton";

function NavLink({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
  const baseClasses = 'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';

  if (isActive) {
    return (
      <Link
        href={href}
        className={`${baseClasses} bg-blue-100 text-blue-700 border border-blue-200 shadow-sm hover:bg-blue-200`}
        aria-current="page"
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`${baseClasses} text-slate-600 hover:text-blue-600 hover:bg-blue-50`}
    >
      {label}
    </Link>
  );
}

function MobileMenuButton({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
      aria-expanded={isOpen}
      aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
    >
      <span 
        className={`block h-0.5 w-6 bg-slate-600 transition-all duration-300 ${
          isOpen ? 'rotate-45 translate-y-1.5' : ''
        }`}
        aria-hidden="true"
      />
      <span 
        className={`block h-0.5 w-6 bg-slate-600 transition-opacity duration-300 ${
          isOpen ? 'opacity-0' : ''
        }`}
        aria-hidden="true"
      />
      <span 
        className={`block h-0.5 w-6 bg-slate-600 transition-all duration-300 ${
          isOpen ? '-rotate-45 -translate-y-1.5' : ''
        }`}
        aria-hidden="true"
      />
    </button>
  );
}

export default function NavBar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const menus = [
    { href: '/campaigns', label: '캠페인' },
    { href: '/influencers', label: '인플루언서' },
    { href: '/news', label: '뉴스룸' },
    { href: '/contact', label: '연락처' },
    { href: '/dashboard', label: '대시보드' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3">
        {/* 로고 */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded">
            <Image 
              src="/logo/sunjeong_link_logo.png" 
              alt="선정링크 로고" 
              width={140} 
              height={45} 
              className="h-10 md:h-12 w-auto object-contain" 
              priority
            />
          </Link>
        </div>

        {/* 데스크톱 메뉴 */}
        <div className="hidden md:flex items-center gap-2">
          {menus.map(m => (
            <NavLink 
              key={m.href} 
              href={m.href} 
              label={m.label} 
              isActive={pathname.startsWith(m.href)} 
            />
          ))}
        </div>

        {/* 우측 컨트롤 */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <AuthButton />
          </div>
          <MobileMenuButton 
            isOpen={isMobileMenuOpen} 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          />
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {menus.map(m => (
              <Link
                key={m.href}
                href={m.href}
                className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  pathname.startsWith(m.href)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-current={pathname.startsWith(m.href) ? "page" : undefined}
              >
                {m.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-200">
              <AuthButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
