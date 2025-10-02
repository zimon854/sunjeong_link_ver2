'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import AuthButton from "./AuthButton"; // AuthButton을 가져옵니다.

function NavLink({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
  return (
    <Link href={href} className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200 ${isActive ? 'bg-blue-500/20 text-blue-300' : 'text-secondary hover:bg-white/10 hover:text-primary'}`}>
      {label}
    </Link>
  );
}

export default function NavBar() {
  const pathname = usePathname();
  const menus = [
    { href: '/campaigns', label: '캠페인' },
    { href: '/influencers', label: '인플루언서' },
    { href: '/dashboard', label: '대시보드' },
    { href: '/profile', label: '내 프로필' },
    { href: '/chat', label: '채팅' },
    { href: '/contact', label: '연락처' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg border-b border-border">
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