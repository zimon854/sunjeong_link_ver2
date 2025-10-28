'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import AuthButton from "./AuthButton"; // AuthButton을 가져옵니다.

function NavLink({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
  const baseClasses = 'px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200';

  if (isActive) {
    return (
      <Link
        href={href}
        className={`${baseClasses} bg-blue-100 text-blue-700 border border-blue-200 shadow-sm`}
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

export default function NavBar() {
  const pathname = usePathname();
  const menus = [
    { href: '/campaigns', label: '캠페인' },
    { href: '/influencers', label: '인플루언서' },
    { href: '/news', label: '뉴스룸' },
    { href: '/dashboard', label: '대시보드' },
    { href: '/profile', label: '내 프로필' },
    { href: '/contact', label: '연락처' },
  ];

  return (
  <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Image src="/logo/sunjeong_link_logo.png" alt="선정링크 로고" width={120} height={40} className="h-10 w-auto object-contain" />
          </Link>
          <div className="hidden md:flex items-center gap-4">
            {menus.map(m => (
              <NavLink key={m.href} href={m.href} label={m.label} isActive={pathname.startsWith(m.href)} />
            ))}
          </div>
        </div>
        <AuthButton />
      </div>
    </nav>
  );
}