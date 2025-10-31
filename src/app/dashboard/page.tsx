'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import AdaptiveLayout from '@/components/AdaptiveLayout';
import {
  FiPlayCircle,
  FiUsers,
  FiTrendingUp,
  FiShare2,
  FiVideo,
  FiHash,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiActivity,
  FiBarChart2,
  FiStar,
  FiCompass,
  FiTarget,
  FiZap,
} from 'react-icons/fi';

type AccentTone = 'blue' | 'indigo' | 'teal' | 'amber' | 'rose' | 'violet';

type PerformanceMetric = {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  helper: string;
  icon: React.ReactNode;
  accent: AccentTone;
};

type WeeklyPerformancePoint = {
  week: string;
  views: number;
  engagementRate: number;
  completion: number;
};

type TikTokVideo = {
  id: string;
  title: string;
  views: string;
  likes: string;
  saves: string;
  completion: number;
  hashtag: string;
  postedAt: string;
  growth: string;
};

type AudienceInsight = {
  label: string;
  value: string;
  description: string;
  icon: React.ReactNode;
};

type FunnelMetric = {
  stage: string;
  count: string;
  conversion: string;
  accent: AccentTone;
};

type InfluencerStat = {
  id: string;
  name: string;
  handle: string;
  views: string;
  conversion: string;
  avgWatch: string;
  trend: number;
};

type TaskItem = {
  id: string;
  title: string;
  owner: string;
  due: string;
  status: '준비' | '진행중' | '완료';
};

type InsightTickerItem = {
  label: string;
  detail: string;
  delta: string;
  isPositive: boolean;
};

type AccentStyle = {
  iconBg: string;
  iconText: string;
};

const accentStyles: Record<AccentTone, AccentStyle> = {
  blue: { iconBg: 'bg-blue-100', iconText: 'text-blue-600' },
  indigo: { iconBg: 'bg-indigo-100', iconText: 'text-indigo-600' },
  teal: { iconBg: 'bg-teal-100', iconText: 'text-teal-600' },
  amber: { iconBg: 'bg-amber-100', iconText: 'text-amber-600' },
  rose: { iconBg: 'bg-rose-100', iconText: 'text-rose-600' },
  violet: { iconBg: 'bg-violet-100', iconText: 'text-violet-600' },
};

const getAccentStyle = (accent: AccentTone): AccentStyle => accentStyles[accent] ?? accentStyles.blue;

export default function DashboardPage() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [role, setRole] = useState<'admin' | 'reviewer' | null>(null);

  useEffect(() => {
    // 관리자 세션 동기화
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

  const heroHighlights = useMemo(
    () => [
      { label: '최근 30일 조회수', value: '4.62M', caption: '+32% 성장', accent: 'blue' as AccentTone },
      { label: '평균 완주율', value: '71%', caption: '숏폼 챌린지', accent: 'indigo' as AccentTone },
      { label: '신규 팔로워', value: '12,480', caption: '틱톡 캠페인 유입', accent: 'teal' as AccentTone },
    ],
    []
  );

  const performanceMetrics = useMemo<PerformanceMetric[]>(
    () => [
      {
        label: '총 조회수',
        value: '4.62M',
        change: '+32%',
        isPositive: true,
        helper: '지난 30일 TikTok 도달',
        icon: <FiPlayCircle />,
        accent: 'blue',
      },
      {
        label: '완주율',
        value: '71%',
        change: '+5.3pt',
        isPositive: true,
        helper: '숏폼 핵심 12편 평균',
        icon: <FiActivity />,
        accent: 'indigo',
      },
      {
        label: '공유 수',
        value: '38,214',
        change: '+18%',
        isPositive: true,
        helper: 'UGC 확산량',
        icon: <FiShare2 />,
        accent: 'teal',
      },
      {
        label: '신규 팔로워',
        value: '12,480',
        change: '+24%',
        isPositive: true,
        helper: '캠페인 기간 순증',
        icon: <FiUsers />,
        accent: 'amber',
      },
      {
        label: '클릭률',
        value: '5.8%',
        change: '+1.1pt',
        isPositive: true,
        helper: '랜딩 페이지 전환',
        icon: <FiTrendingUp />,
        accent: 'rose',
      },
    ],
    []
  );

  const weeklyPerformance = useMemo<WeeklyPerformancePoint[]>(
    () => [
      { week: '10.01', views: 620_000, engagementRate: 6.2, completion: 65 },
      { week: '10.08', views: 710_000, engagementRate: 6.8, completion: 68 },
      { week: '10.15', views: 830_000, engagementRate: 7.4, completion: 72 },
      { week: '10.22', views: 905_000, engagementRate: 7.9, completion: 73 },
      { week: '10.29', views: 1_020_000, engagementRate: 8.6, completion: 76 },
    ],
    []
  );

  const topVideos = useMemo<TikTokVideo[]>(
    () => [
      {
        id: 'vid-01',
        title: '글로벌 공동구매 하이라이트',
        views: '1.12M',
        likes: '96K',
        saves: '12.4K',
        completion: 78,
        hashtag: '#LinkableLive',
        postedAt: '2025.10.24',
        growth: '+42%',
      },
      {
        id: 'vid-02',
        title: '링커블 AI 추천 챌린지',
        views: '886K',
        likes: '74K',
        saves: '9.1K',
        completion: 72,
        hashtag: '#ShopperTok',
        postedAt: '2025.10.19',
        growth: '+18%',
      },
      {
        id: 'vid-03',
        title: '동남아 파트너 리믹스',
        views: '742K',
        likes: '58K',
        saves: '7.8K',
        completion: 69,
        hashtag: '#GlobalDrop',
        postedAt: '2025.10.17',
        growth: '+11%',
      },
    ],
    []
  );

  const audienceInsights = useMemo<AudienceInsight[]>(
    () => [
      {
        label: '핵심 연령대',
        value: '25-34 • 42%',
        description: '직접구매 전환율 1.6배',
        icon: <FiUsers className="h-4 w-4" />,
      },
      {
        label: '평균 시청 시간',
        value: '18.4초',
        description: '숏폼 벤치마크 상위 12%',
        icon: <FiClock className="h-4 w-4" />,
      },
      {
        label: '상위 국가',
        value: '베트남 • 태국',
        description: '동남아 공동구매 58%',
        icon: <FiCompass className="h-4 w-4" />,
      },
      {
        label: '관심 카테고리',
        value: '뷰티 • 홈리빙',
        description: 'UGC 참여율 2.1배',
        icon: <FiTarget className="h-4 w-4" />,
      },
    ],
    []
  );

  const funnelMetrics = useMemo<FunnelMetric[]>(
    () => [
      { stage: '노출', count: '8.2M', conversion: '100%', accent: 'blue' },
      { stage: '시청', count: '4.6M', conversion: '56%', accent: 'indigo' },
      { stage: '참여', count: '1.3M', conversion: '28%', accent: 'teal' },
      { stage: '전환', count: '184K', conversion: '4%', accent: 'rose' },
    ],
    []
  );

  const influencerLeaderboard = useMemo<InfluencerStat[]>(
    () => [
      { id: 'cr-01', name: '지아림', handle: '@jiarim_tt', views: '612K', conversion: '3.8%', avgWatch: '21.2s', trend: 12 },
      { id: 'cr-02', name: '호치민 미나', handle: '@mina_biz', views: '488K', conversion: '4.5%', avgWatch: '24.5s', trend: 8 },
      { id: 'cr-03', name: '캄보디아 린', handle: '@lin_creates', views: '402K', conversion: '2.9%', avgWatch: '18.7s', trend: 5 },
      { id: 'cr-04', name: '방콕 재키', handle: '@jackie_wave', views: '356K', conversion: '3.1%', avgWatch: '20.1s', trend: 4 },
    ],
    []
  );

  const nextActions = useMemo<TaskItem[]>(
    () => [
      { id: 'task-01', title: '11월 틱톡 광고 세그먼트 확정', owner: 'Paid Media', due: '10.31', status: '진행중' },
      { id: 'task-02', title: '동남아 공동구매 인플루언서 브리핑', owner: 'Creator Ops', due: '11.02', status: '준비' },
      { id: 'task-03', title: 'AI 추천 제품 큐레이션 업데이트', owner: 'Product', due: '11.04', status: '진행중' },
      { id: 'task-04', title: '틱톡 리뷰 리마인드 메시지 발송', owner: 'CRM', due: '11.05', status: '준비' },
    ],
    []
  );

  const insightsTicker = useMemo<InsightTickerItem[]>(
    () => [
      { label: '#LinkableLive', detail: '챌린지 참여 영상 1,420건', delta: '+38%', isPositive: true },
      { label: '#ShopperTok', detail: 'UGC 리뷰 612건', delta: '+12%', isPositive: true },
      { label: 'AI 추천 CTA', detail: '프로필 링크 클릭률 5.8%', delta: '+1.1pt', isPositive: true },
    ],
    []
  );

  if (loading) {
    return (
      <AdaptiveLayout title="틱톡 대시보드">
        <div className="py-20 text-center text-slate-500">로딩 중...</div>
      </AdaptiveLayout>
    );
  }

  if (!isAdmin) {
    return (
      <AdaptiveLayout title="틱톡 대시보드">
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">관리자 전용 페이지입니다.</p>
            <p className="mt-2 text-sm text-slate-500">대시보드 접근을 위해 관리자 계정으로 로그인해 주세요.</p>
            <Link href="/auth" className="btn-primary mt-6 inline-flex items-center justify-center">관리자 로그인</Link>
          </div>
        </div>
      </AdaptiveLayout>
    );
  }

  return (
    <AdaptiveLayout title="틱톡 대시보드">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="mx-auto max-w-6xl space-y-10 px-4 py-8">
          <DashboardHero role={role} highlights={heroHighlights} />
          <MetricGrid metrics={performanceMetrics} />
          <div className="grid gap-8 lg:grid-cols-[1.7fr,1fr]">
            <TikTokPerformancePanel weekly={weeklyPerformance} videos={topVideos} />
            <AudiencePanel audience={audienceInsights} funnel={funnelMetrics} />
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <InfluencerLeaderboard entries={influencerLeaderboard} />
            <TaskBoard tasks={nextActions} />
          </div>
          <InsightsTicker items={insightsTicker} />
        </div>
      </div>
    </AdaptiveLayout>
  );
}

type HeroHighlight = {
  label: string;
  value: string;
  caption: string;
  accent: AccentTone;
};

function DashboardHero({ role, highlights }: { role: 'admin' | 'reviewer' | null; highlights: HeroHighlight[] }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 p-8 text-white shadow-lg">
      <div className="absolute inset-0 opacity-30 mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4), transparent 55%)' }} aria-hidden="true" />
      <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-blue-100">
            <FiStar className="h-4 w-4" /> TikTok Growth Engine
          </span>
          <h1 className="font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
            글로벌 숏폼 캠페인을 실시간으로
            <br className="hidden sm:block" />
            조율하세요.
          </h1>
          <p className="text-sm text-blue-100 sm:text-base">
            링커블의 AI 매칭과 공동구매 파이프라인으로 틱톡 퍼포먼스를 빠르게 확대하고, 콘텐츠-커머스 전환을 한 화면에서 확인하세요.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={role === 'reviewer' ? '/campaigns' : '/campaigns/new'}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-blue-700 shadow-md transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              <FiZap className="h-4 w-4" /> 틱톡 캠페인 만들기
            </Link>
            <Link
              href="/dashboard/performance"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              <FiBarChart2 className="h-4 w-4" /> 성과 리포트 다운로드
            </Link>
          </div>
        </div>
        <div className="grid w-full max-w-sm gap-3 sm:grid-cols-3 lg:max-w-md">
          {highlights.map((highlight) => (
            <div key={highlight.label} className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-100">{highlight.label}</p>
              <p className="mt-2 text-2xl font-bold text-white">{highlight.value}</p>
              <p className="text-xs text-blue-100/80">{highlight.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MetricGrid({ metrics }: { metrics: PerformanceMetric[] }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {metrics.map((metric) => (
        <MetricCard key={metric.label} metric={metric} />
      ))}
    </section>
  );
}

function MetricCard({ metric }: { metric: PerformanceMetric }) {
  const tone = getAccentStyle(metric.accent);
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${tone.iconBg} ${tone.iconText}`}>{metric.icon}</div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{metric.label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{metric.value}</p>
      <div className="mt-2 flex items-center gap-2 text-sm">
        <span className={`font-semibold ${metric.isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>{metric.change}</span>
        <span className="text-slate-400">vs. 지난 30일</span>
      </div>
      <p className="mt-2 text-sm text-slate-500">{metric.helper}</p>
    </article>
  );
}

function TikTokPerformancePanel({ weekly, videos }: { weekly: WeeklyPerformancePoint[]; videos: TikTokVideo[] }) {
  return (
    <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">틱톡 콘텐츠 성과</h2>
          <p className="text-sm text-slate-500">최근 5주간 조회수와 참여율 흐름</p>
        </div>
        <Link href="/dashboard/performance" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
          상세 리포트
          <FiArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <WeeklyPerformance weekly={weekly} />
      <TopVideosList videos={videos} />
    </section>
  );
}

function WeeklyPerformance({ weekly }: { weekly: WeeklyPerformancePoint[] }) {
  const maxViews = Math.max(...weekly.map((w) => w.views));
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
      <div className="flex h-36 items-end gap-4">
        {weekly.map((item) => {
          const heightPercent = Math.round((item.views / maxViews) * 100);
          return (
            <div key={item.week} className="flex flex-1 flex-col items-center justify-end gap-2">
              <div className="relative flex w-full flex-1 items-end rounded-2xl bg-white shadow-inner">
                <div
                  className="absolute inset-x-2 bottom-0 rounded-t-2xl bg-gradient-to-t from-blue-500 via-indigo-400 to-blue-300"
                  style={{ height: `${heightPercent}%` }}
                />
                <div
                  className="absolute inset-x-4 bottom-0 rounded-t-2xl bg-white/30"
                  style={{ height: `${item.completion}%` }}
                  aria-hidden="true"
                />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-slate-600">{item.week}</p>
                <p className="text-[11px] text-slate-400">완주 {item.completion}% · 참여 {item.engagementRate}%</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TopVideosList({ videos }: { videos: TikTokVideo[] }) {
  return (
    <div className="space-y-3">
      {videos.map((video) => (
        <div key={video.id} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FiVideo className="h-6 w-6" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-semibold text-slate-900">{video.title}</p>
            <p className="text-xs text-slate-500">{video.postedAt} • {video.hashtag}</p>
            <div className="flex flex-wrap gap-3 text-xs text-slate-500">
              <span>조회수 {video.views}</span>
              <span>좋아요 {video.likes}</span>
              <span>저장 {video.saves}</span>
              <span>완주 {video.completion}%</span>
            </div>
          </div>
          <div className="text-right text-xs font-semibold text-emerald-600">{video.growth}</div>
        </div>
      ))}
    </div>
  );
}

function AudiencePanel({ audience, funnel }: { audience: AudienceInsight[]; funnel: FunnelMetric[] }) {
  return (
    <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">오디언스 & 전환 퍼널</h2>
        <p className="text-sm text-slate-500">틱톡 타겟팅 지표와 전환 흐름</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {audience.map((item) => (
          <div key={item.label} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
              {item.icon}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
              <p className="text-sm font-semibold text-slate-900">{item.value}</p>
              <p className="text-xs text-slate-500">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      <FunnelPanel funnel={funnel} />
    </section>
  );
}

function FunnelPanel({ funnel }: { funnel: FunnelMetric[] }) {
  return (
    <div className="space-y-2">
      {funnel.map((stage) => {
        const tone = getAccentStyle(stage.accent);
        return (
          <div key={stage.stage} className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
            <div className={`flex items-center justify-between bg-gradient-to-r ${tone.iconBg} px-5 py-3`}> 
              <div className="flex items-center gap-3">
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone.iconBg} ${tone.iconText} bg-opacity-80`}>{stage.stage.slice(0, 1)}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{stage.stage}</p>
                  <p className="text-xs text-slate-500">전환율 {stage.conversion}</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-slate-700">{stage.count}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function InfluencerLeaderboard({ entries }: { entries: InfluencerStat[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">인플루언서 리더보드</h2>
          <p className="text-sm text-slate-500">틱톡 파트너별 퍼포먼스</p>
        </div>
        <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">Top Creators</span>
      </div>
      <div className="space-y-3">
        {entries.map((creator) => (
          <div key={creator.id} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
              {creator.name.slice(0, 1)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">{creator.name}</p>
              <p className="text-xs text-slate-500">{creator.handle}</p>
            </div>
            <div className="grid w-48 grid-cols-3 gap-3 text-center text-xs">
              <div>
                <p className="font-semibold text-slate-900">{creator.views}</p>
                <p className="text-slate-500">조회</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">{creator.conversion}</p>
                <p className="text-slate-500">전환</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">{creator.avgWatch}</p>
                <p className="text-slate-500">평균 시청</p>
              </div>
            </div>
            <div className={`text-xs font-semibold ${creator.trend >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
              {creator.trend >= 0 ? '+' : ''}{creator.trend}%
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TaskBoard({ tasks }: { tasks: TaskItem[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">운영 체크리스트</h2>
          <p className="text-sm text-slate-500">틱톡 캠페인 실행 현황</p>
        </div>
        <Link href="/campaigns" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
          작업 보드 이동
          <FiArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <TaskBadge status={task.status} />
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">{task.title}</p>
              <p className="text-xs text-slate-500">담당 {task.owner}</p>
            </div>
            <div className="text-xs font-semibold text-slate-500">마감 {task.due}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TaskBadge({ status }: { status: TaskItem['status'] }) {
  const style = {
    준비: { bg: 'bg-slate-200', text: 'text-slate-600', icon: <FiClock className="h-3.5 w-3.5" /> },
    진행중: { bg: 'bg-blue-100', text: 'text-blue-600', icon: <FiActivity className="h-3.5 w-3.5" /> },
    완료: { bg: 'bg-emerald-100', text: 'text-emerald-600', icon: <FiCheckCircle className="h-3.5 w-3.5" /> },
  }[status];

  return (
    <span className={`inline-flex items-center gap-2 rounded-full ${style.bg} ${style.text} px-3 py-1 text-xs font-semibold`}>
      {style.icon}
      {status}
    </span>
  );
}

function InsightsTicker({ items }: { items: InsightTickerItem[] }) {
  return (
    <section className="rounded-3xl border border-blue-100 bg-blue-50/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
              <FiHash className="h-3.5 w-3.5" />
              {item.label}
            </span>
            <span className="text-slate-700">{item.detail}</span>
            <span className={`text-xs font-semibold ${item.isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>{item.delta}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
