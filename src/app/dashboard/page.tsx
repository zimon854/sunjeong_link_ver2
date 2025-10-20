'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdaptiveLayout from '@/components/AdaptiveLayout';
import { FiBell, FiMessageSquare, FiPlusCircle, FiList, FiUser, FiBarChart2 } from 'react-icons/fi';

type DashboardCampaign = { id: number; title: string; status: string };

// Mock 데이터 (실제로는 API 호출로 대체)
const dummyData: {
  myCampaigns: DashboardCampaign[];
  joinedCampaigns: DashboardCampaign[];
  notifications: { id: number; text: string; date: string }[];
  messages: { id: number; from: string; text: string; date: string }[];
} = {
  myCampaigns: [
    { id: 1, title: "비건 뷰티 마스크팩", status: "진행중" },
    { id: 2, title: "프리미엄 헤어오일", status: "종료" },
  ],
  joinedCampaigns: [],
  notifications: [
    { id: 1, text: "캠페인 '비건 뷰티 마스크팩'이 승인되었습니다.", date: "2024-06-01" },
    { id: 2, text: "새로운 메시지가 도착했습니다.", date: "2024-06-02" },
  ],
  messages: [
    { id: 1, from: "인플루언서A", text: "참여 문의드립니다!", date: "2024-06-02" },
  ],
};

export default function DashboardPage() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [role, setRole] = useState<'admin' | 'reviewer' | null>(null);

  useEffect(() => {
    // localStorage에서 관리자 세션 확인
    const syncAdminAuthState = () => {
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
      setLoading(false);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'adminAuth') {
        syncAdminAuthState();
      }
    };

    syncAdminAuthState();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  if (loading) {
    return (
      <AdaptiveLayout title="대시보드">
        <div className="text-center text-secondary py-20">
          <p>로딩 중...</p>
        </div>
      </AdaptiveLayout>
    );
  }

  if (!isAdmin) {
    return (
      <AdaptiveLayout title="대시보드">
        <div className="text-center text-secondary py-20">
          <p>대시보드에 접근하려면 관리자 또는 검수 계정 로그인이 필요합니다.</p>
          <Link href="/auth" className="btn-primary mt-4 inline-block">관리자 로그인</Link>
        </div>
      </AdaptiveLayout>
    );
  }

  const greetingLabel = role === 'reviewer' ? '검수 계정' : '관리자';

  return (
    <AdaptiveLayout title="대시보드">
      <div className="space-y-10">
        {/* 프로필 및 환영 메시지 */}
        <section className="card flex flex-col md:flex-row items-center gap-6">
          <img
            src="/logo/sunjeong_link_logo.png"
            alt="관리자"
            className="w-24 h-24 rounded-full border-4 border-border object-cover bg-background"
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">환영합니다, {greetingLabel}님!</h1>
            <p className="text-secondary mt-1">오늘도 멋진 캠페인을 관리해보세요.</p>
            {role === 'reviewer' && (
              <p className="mt-2 text-xs text-secondary/80">
                검수 전용 계정은 샘플 데이터로 앱 기능을 체험할 수 있습니다.
              </p>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* 캠페인 관리 */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">내 캠페인</h2>
              <div className="card space-y-4">
                {dummyData.myCampaigns.map(c => <CampaignItem key={c.id} {...c} />)}
                {dummyData.myCampaigns.length === 0 && <p className="text-secondary text-center py-4">생성한 캠페인이 없습니다.</p>}
              </div>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">참여한 캠페인</h2>
              <div className="card space-y-4">
                {dummyData.joinedCampaigns.map(c => <CampaignItem key={c.id} {...c} />)}
                {dummyData.joinedCampaigns.length === 0 && (
                  <p className="text-secondary text-center py-4">참여한 캠페인 정보는 현재 제공되지 않습니다.</p>
                )}
              </div>
            </section>
          </div>

          {/* 빠른 메뉴 및 알림 */}
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">빠른 메뉴</h2>
              <div className="card grid grid-cols-2 gap-4">
                <QuickMenuLink href="/campaigns/new" icon={<FiPlusCircle />} label="캠페인 생성" />
                <QuickMenuLink href="/campaigns" icon={<FiList />} label="캠페인 목록" />
                <QuickMenuLink href="/profile" icon={<FiUser />} label="내 프로필" />
                <QuickMenuLink href="/chat" icon={<FiMessageSquare />} label="메시지" />
                <QuickMenuLink href="/dashboard/performance" icon={<FiBarChart2 />} label="성과 대시보드" />
              </div>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">최근 알림</h2>
              <div className="card space-y-3">
                {dummyData.notifications.map(n => (
                  <div key={n.id} className="flex items-start gap-3 text-sm">
                    <FiBell className="w-5 h-5 mt-0.5 text-blue-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-primary">{n.text}</p>
                      <p className="text-xs text-secondary">{n.date}</p>
                    </div>
                  </div>
                ))}
                {dummyData.notifications.length === 0 && <p className="text-secondary text-center py-4">새로운 알림이 없습니다.</p>}
              </div>
            </section>
          </div>
        </div>
      </div>
    </AdaptiveLayout>
  );
}

// --- Sub-components ---
const CampaignItem = ({ id, title, status }: { id: number, title: string, status: string }) => (
  <Link href={`/campaigns/${id}`} className="block p-4 rounded-lg bg-black/20 hover:bg-black/40 transition-colors">
    <div className="flex justify-between items-center">
      <p className="font-semibold text-primary">{title}</p>
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${status === '진행중' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-400'}`}>
        {status}
      </span>
    </div>
  </Link>
);

const QuickMenuLink = ({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) => (
  <Link href={href} className="flex flex-col items-center justify-center p-4 bg-black/20 rounded-lg hover:bg-black/40 transition-colors text-secondary hover:text-primary">
    <div className="w-7 h-7 mb-2">{icon}</div>
    <span className="font-semibold text-sm">{label}</span>
  </Link>
);