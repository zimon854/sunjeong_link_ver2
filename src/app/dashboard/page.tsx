'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import AdaptiveLayout from '@/components/AdaptiveLayout';
import {
  FiBell,
  FiPlusCircle,
  FiList,
  FiUser,
  FiBarChart2,
  FiSettings,
  FiMessageSquare,
  FiCalendar,
  FiZap,
  FiGrid
} from 'react-icons/fi';

type DashboardCampaign = { id: number; title: string; status: string };
type AccentTone = 'blue' | 'indigo' | 'teal' | 'amber' | 'rose' | 'violet';

const myCampaigns: DashboardCampaign[] = [];
const joinedCampaigns: DashboardCampaign[] = [];
const notifications: { id: number; text: string; date: string }[] = [];
const messages: { id: number; from: string; text: string; date: string }[] = [];
const numberFormatter = new Intl.NumberFormat('ko-KR');

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

  const greetingLabel = '관리자';
  const campaignMetrics = useMemo(() => {
    const active = myCampaigns.filter((c) => c.status === '진행중').length;
    const draft = myCampaigns.filter((c) => ['준비중', '대기', '검토중'].includes(c.status)).length;
    const upcoming = myCampaigns.filter((c) => c.status === '예정').length;
    return {
      active,
      draft,
      upcoming,
      total: myCampaigns.length,
      joined: joinedCampaigns.length,
      notifications: notifications.length,
      messages: messages.length,
    };
  }, []);

  const { active, draft, upcoming, total, joined, notifications: notificationCount, messages: messageCount } = campaignMetrics;

  const stats = useMemo(() => [
    {
      label: '활성 캠페인',
      value: numberFormatter.format(active),
      helper: active > 0 ? 'Lynkable 실시간 모니터링' : '활성 캠페인 없음',
      icon: <FiBarChart2 />,
      accent: 'blue' as AccentTone,
      trend: {
        value: active > 0 ? '+18%' : '0%',
        isPositive: active > 0,
        description: '지난 30일 대비',
      },
    },
    {
      label: '등록 캠페인',
      value: numberFormatter.format(total),
      helper: draft > 0 ? `${draft}건 기획 중` : '모든 캠페인이 최신 상태',
      icon: <FiGrid />,
      accent: 'indigo' as AccentTone,
      trend: {
        value: total > 0 ? '+6%' : '0%',
        isPositive: total > 0,
        description: '월간 누적',
      },
    },
    {
      label: '참여 캠페인',
      value: numberFormatter.format(joined),
      helper: '파트너 협업 현황',
      icon: <FiUser />,
      accent: 'teal' as AccentTone,
      trend: {
        value: joined > 0 ? '+2건' : '0건',
        isPositive: joined > 0,
        description: '이번 분기',
      },
    },
    {
      label: '알림 승인',
      value: numberFormatter.format(notificationCount),
      helper: notificationCount > 0 ? '검토가 필요한 요청 있음' : '새 알림 없음',
      icon: <FiBell />,
      accent: 'amber' as AccentTone,
    },
    {
      label: '새 메시지',
      value: numberFormatter.format(messageCount),
      helper: messageCount > 0 ? '파트너 문의 대응' : '새로운 메시지 없음',
      icon: <FiMessageSquare />,
      accent: 'rose' as AccentTone,
    },
  ], [active, total, draft, joined, notificationCount, messageCount]);

  const heroHighlights = useMemo(
    () => [
      {
        label: '활성 파이프라인',
        value: `${active}건`,
        icon: <FiZap />,
        accent: 'blue' as AccentTone,
      },
      {
        label: '준비 캠페인',
        value: `${draft + upcoming}건`,
        icon: <FiCalendar />,
        accent: 'violet' as AccentTone,
      },
      {
        label: '계정 권한',
        value: role === 'reviewer' ? '체험 모드' : '전체 권한',
        icon: <FiSettings />,
        accent: (role === 'reviewer' ? 'amber' : 'teal') as AccentTone,
      },
    ],
    [active, draft, upcoming, role]
  );

  const quickLinks = useMemo(
    () => [
      { href: '/campaigns/new', icon: <FiPlusCircle />, label: '캠페인 생성' },
      { href: '/campaigns', icon: <FiList />, label: '캠페인 목록' },
      { href: '/dashboard/performance', icon: <FiBarChart2 />, label: '성과 대시보드' },
  { href: '/profile', icon: <FiUser />, label: '내 프로필' },
      { href: '/settings', icon: <FiSettings />, label: '시스템 설정', disabled: true, note: '준비 중' },
      { href: '/resources', icon: <FiGrid />, label: '운영 가이드', disabled: true, note: '문서 제작 중' },
    ],
    []
  );

  if (loading) {
    return (
      <AdaptiveLayout title="대시보드">
        <div className="text-center text-slate-500 py-20">
          <p>로딩 중...</p>
        </div>
      </AdaptiveLayout>
    );
  }

  if (!isAdmin) {
    return (
      <AdaptiveLayout title="대시보드">
        <div className="text-center text-slate-500 py-20">
          <p>대시보드에 접근하려면 관리자 로그인이 필요합니다.</p>
          <Link href="/auth" className="btn-primary mt-4 inline-block">관리자 로그인</Link>
        </div>
      </AdaptiveLayout>
    );
  }

  return (
    <AdaptiveLayout title="대시보드">
      <div className="space-y-10">
        <DashboardHero greetingLabel={greetingLabel} role={role} highlights={heroHighlights} />
        <DashboardSummary stats={stats} />

        <div className="grid gap-8 xl:grid-cols-[1.75fr,1fr]">
          <div className="space-y-8">
            <CampaignSection
              title="내 캠페인"
              description="Lynkable에 등록된 캠페인을 한눈에 확인하세요."
              campaigns={myCampaigns}
              emptyLabel="생성한 캠페인이 아직 없습니다."
              emptyAction={{ label: '첫 캠페인 만들기', href: '/campaigns/new', icon: <FiPlusCircle /> }}
              viewHref="/campaigns"
            />
            <CampaignSection
              title="참여한 캠페인"
              description="파트너와 함께 진행 중인 외부 캠페인의 현황입니다."
              campaigns={joinedCampaigns}
              emptyLabel="참여 중인 캠페인 정보가 없습니다."
              emptyAction={{ label: '캠페인 탐색', href: '/campaigns', icon: <FiList /> }}
              viewHref="/campaigns"
            />
            <OperationalInsights role={role} />
          </div>

          <div className="space-y-8">
            <QuickActionBoard links={quickLinks} />
            <NotificationPanel notifications={notifications} />
            <MessagePanel messages={messages} />
          </div>
        </div>
      </div>
    </AdaptiveLayout>
  );
}

// --- Sub-components ---
type AccentStyle = {
  iconBg: string;
  iconText: string;
};

const accentStyles: Record<AccentTone, AccentStyle> = {
  blue: {
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
  },
  indigo: {
    iconBg: 'bg-indigo-100',
    iconText: 'text-indigo-600',
  },
  teal: {
    iconBg: 'bg-teal-100',
    iconText: 'text-teal-600',
  },
  amber: {
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-600',
  },
  rose: {
    iconBg: 'bg-rose-100',
    iconText: 'text-rose-600',
  },
  violet: {
    iconBg: 'bg-violet-100',
    iconText: 'text-violet-600',
  },
};

const getAccentStyle = (accent: AccentTone): AccentStyle => accentStyles[accent] ?? accentStyles.blue;

type HeroHighlightTile = {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent: AccentTone;
};

function DashboardHero({ greetingLabel, role, highlights }: { greetingLabel: string; role: 'admin' | 'reviewer' | null; highlights: HeroHighlightTile[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-600">
            <FiZap className="h-4 w-4" />
            Lynkable Dashboard
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">환영합니다, {greetingLabel}님</h1>
          <p className="mt-2 text-base text-slate-600">캠페인 파이프라인을 한 곳에서 관리하고 실시간 피드백을 확인하세요.</p>
          {role === 'reviewer' && (
            <p className="mt-2 text-xs text-slate-500">보조 관리자 계정은 샘플 데이터로 앱 기능을 체험할 수 있습니다.</p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={role === 'reviewer' ? '/campaigns' : '/campaigns/new'}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
            >
              <FiPlusCircle className="h-4 w-4" />
              새 캠페인 만들기
            </Link>
            <Link
              href="/dashboard/performance"
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-2 text-sm font-semibold text-blue-700 hover:border-blue-300"
            >
              <FiBarChart2 className="h-4 w-4" />
              성과 리포트 보기
            </Link>
          </div>
        </div>

        <div className="grid w-full max-w-sm gap-3 sm:grid-cols-2 md:max-w-md">
          {highlights.map((highlight) => (
            <HeroHighlight key={highlight.label} {...highlight} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroHighlight({ label, value, icon, accent }: HeroHighlightTile) {
  const tone = getAccentStyle(accent);
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone.iconBg} ${tone.iconText}`}>{icon}</div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <p className="text-lg font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

type StatItem = {
  label: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
  accent: AccentTone;
  trend?: {
    value: string;
    isPositive: boolean;
    description?: string;
  };
};

function DashboardSummary({ stats }: { stats: StatItem[] }) {
  if (!stats.length) return null;
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </section>
  );
}

function StatCard({ label, value, helper, icon, accent, trend }: StatItem) {
  const tone = getAccentStyle(accent);
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${tone.iconBg} ${tone.iconText}`}>{icon}</div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      {trend && (
        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className={`font-semibold ${trend.isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>{trend.value}</span>
          {trend.description && <span className="text-slate-400">{trend.description}</span>}
        </div>
      )}
      <p className="mt-2 text-sm text-slate-500">{helper}</p>
    </article>
  );
}

type CampaignSectionProps = {
  title: string;
  description: string;
  campaigns: DashboardCampaign[];
  emptyLabel: string;
  emptyAction?: {
    label: string;
    href: string;
    icon: React.ReactNode;
  };
  viewHref?: string;
};

function CampaignSection({ title, description, campaigns, emptyLabel, emptyAction, viewHref = '/campaigns' }: CampaignSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        {campaigns.length > 0 && (
          <Link href={viewHref} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
            전체 보기
            <FiList className="h-4 w-4" />
          </Link>
        )}
      </div>

      <div className="mt-5 space-y-3">
        {campaigns.length > 0 ? campaigns.map((campaign) => <CampaignItem key={campaign.id} {...campaign} />) : <EmptyState label={emptyLabel} action={emptyAction} />}
      </div>
    </section>
  );
}

function CampaignItem({ id, title, status }: DashboardCampaign) {
  const isActive = status === '진행중';
  return (
    <Link
      href={`/campaigns/${id}`}
      className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white"
    >
      <div>
        <p className="font-semibold text-slate-900 group-hover:text-blue-700">{title}</p>
        <p className="text-xs text-slate-500">캠페인 상세로 이동</p>
      </div>
      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
        <span className="h-2 w-2 rounded-full bg-current" />
        {status}
      </span>
    </Link>
  );
}

function EmptyState({ label, action }: { label: string; action?: { label: string; href: string; icon: React.ReactNode } }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-10 text-center">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      {action && (
        <Link
          href={action.href}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
        >
          {action.icon}
          {action.label}
        </Link>
      )}
    </div>
  );
}

function OperationalInsights({ role }: { role: 'admin' | 'reviewer' | null }) {
  const checklist = role === 'reviewer'
    ? [
        { title: '데모 캠페인 흐름 체험', description: '등록 → 매칭 → 리포팅 단계를 순서대로 확인해보세요.' },
        { title: 'Lynkable UI 가이드 검토', description: '팀과 공유할 소개 자료를 준비해두었어요.' },
      ]
    : [
        { title: '이번 주 보고 준비', description: '핵심 지표와 알림 내역을 정리해 두면 회의가 더 빨라집니다.' },
        { title: '파트너 커뮤니케이션', description: '메시지 탭에서 신규 문의를 빠르게 확인하세요.' },
      ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 text-slate-900">
        <FiZap className="h-5 w-5 text-blue-500" />
        <h2 className="text-lg font-semibold">오늘의 운영 인사이트</h2>
      </div>
      <ul className="mt-4 space-y-3">
        {checklist.map((item) => (
          <li key={item.title} className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
            <p className="font-semibold text-slate-900">{item.title}</p>
            <p className="text-sm text-slate-500">{item.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

type QuickAction = {
  href: string;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  note?: string;
};

function QuickActionBoard({ links }: { links: QuickAction[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 text-slate-900">
        <FiGrid className="h-5 w-5 text-blue-500" />
        <h2 className="text-lg font-semibold">빠른 실행</h2>
      </div>
      <p className="mt-2 text-sm text-slate-500">자주 사용하는 관리 메뉴를 바로 이동할 수 있어요.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <QuickActionLink key={link.label} {...link} />
        ))}
      </div>
    </section>
  );
}

function QuickActionLink({ href, icon, label, disabled, note }: QuickAction) {
  if (disabled) {
    return (
      <div className="flex flex-col items-start justify-between rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-4 text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/50 text-slate-400">
            {icon}
          </div>
          <p className="font-semibold">{label}</p>
        </div>
        {note && <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-600">{note}</span>}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-900 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 group-hover:text-blue-600">
          {icon}
        </div>
        <p className="font-semibold">{label}</p>
      </div>
      <span className="text-xs font-medium text-blue-600 opacity-0 transition group-hover:opacity-100">바로 이동하기 →</span>
    </Link>
  );
}

function NotificationPanel({ notifications }: { notifications: { id: number; text: string; date: string }[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 text-slate-900">
        <FiBell className="h-5 w-5 text-blue-500" />
        <h2 className="text-lg font-semibold">최근 알림</h2>
      </div>
      <div className="mt-4 space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <article key={notification.id} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <FiBell className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{notification.text}</p>
                <p className="text-xs text-slate-500">{notification.date}</p>
              </div>
            </article>
          ))
        ) : (
          <EmptyState label="새로운 알림이 없습니다." />
        )}
      </div>
    </section>
  );
}

function MessagePanel({ messages }: { messages: { id: number; from: string; text: string; date: string }[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 text-slate-900">
        <FiMessageSquare className="h-5 w-5 text-blue-500" />
        <h2 className="text-lg font-semibold">파트너 메시지</h2>
      </div>
      <div className="mt-4 space-y-3">
        {messages.length > 0 ? (
          messages.map((message) => (
            <article key={message.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-900">{message.from}</span>
                <span className="text-xs text-slate-500">{message.date}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{message.text}</p>
            </article>
          ))
        ) : (
          <EmptyState label="새로운 메시지가 없습니다." action={{ label: '최근 캠페인 보기', href: '/campaigns', icon: <FiList /> }} />
        )}
      </div>
    </section>
  );
}
