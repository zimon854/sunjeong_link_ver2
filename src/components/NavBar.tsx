"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavMenu({ href, label, desc }: { href: string; label: string; desc: string }) {
  return (
    <Link href={href} className="group flex flex-col items-center justify-center min-w-[90px] px-3 py-1 rounded-xl hover:bg-blue-800/70 transition text-white font-semibold relative">
      <span className="text-base whitespace-nowrap">{label}</span>
      <span className="absolute left-1/2 -bottom-2 translate-x-[-50%] translate-y-full opacity-0 group-hover:opacity-100 bg-[#181830] text-blue-200 text-xs rounded px-2 py-1 shadow-lg pointer-events-none z-50">{desc}</span>
    </Link>
  );
}

export default function NavBar() {
  const pathname = usePathname();
  const mainMenus = [
    { href: '/auth', label: '로그인/회원가입', desc: '서비스 이용 계정' },
    { href: '/campaigns', label: '캠페인 리스트', desc: '진행 캠페인 보기' },
    { href: '/influencers', label: '인플루언서 리스트', desc: '인플루언서 한눈에' },
    { href: '/dashboard', label: '내 대시보드', desc: '내 서비스 현황' },
  ];
  const allMenus = [
    { href: '/auth', label: '로그인/회원가입', desc: '서비스 이용 계정' },
    { href: '/campaigns', label: '캠페인 리스트', desc: '진행 캠페인 보기' },
    { href: '/campaigns/new', label: '캠페인 생성', desc: '신규 캠페인 등록' },
    { href: '/influencers', label: '인플루언서 리스트', desc: '인플루언서 한눈에' },
    { href: '/chat', label: '실시간 채팅', desc: '실시간 소통' },
    { href: '/profile', label: '내 프로필 관리', desc: '프로필 관리' },
    { href: '/dashboard', label: '내 대시보드', desc: '내 서비스 현황' },
  ];
  const menus = pathname === "/" ? mainMenus : allMenus;
  return (
    <nav className="sticky top-0 z-30 w-full bg-[#10112a]/80 backdrop-blur border-b border-blue-900 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
        <Link href="/" className="flex items-center">
          <img src="/logo/sunjeong_link_logo.png" alt="선정링크 로고" className="h-14 w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-6 text-[15px] font-medium text-white">
          {menus.map(m => (
            <NavMenu key={m.href} {...m} />
          ))}
        </div>
      </div>
    </nav>
  );
} 