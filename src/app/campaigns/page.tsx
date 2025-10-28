"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FiArrowUpRight,
  FiCalendar,
  FiTrendingUp,
  FiUsers,
  FiAward,
  FiInfo,
} from 'react-icons/fi';

import { createOptionalClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/database.types';
import { useAdminAuth } from '@/hooks/useAdminAuth';

type CampaignRow = Database['public']['Tables']['campaigns']['Row'];

const sortOptions = [
  { value: 'recommend', label: '추천순' },
  { value: 'latest', label: '최신순' },
  { value: 'participants', label: '참여자순' },
];

const numberFormatter = new Intl.NumberFormat('ko-KR');

const hasSupabaseConfig = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const dummyCampaigns: CampaignRow[] = [
  {
    id: 1,
    title: '링커블 X 가희 촉촉보습 릴스 캠페인',
    brand: '가희',
    category: '뷰티',
    price: 250000,
    image: '/campaign_sample/sample1.jpeg',
    shopify_url: 'https://lynkable.kr/campaigns/gahee-hydration',
    status: '모집중',
    participants: 32,
    description:
      '비건 성분을 강조한 가희 촉촉보습 앰플을 활용해 30초 내외의 릴스로 생기 가득한 피부 연출을 보여주세요.',
    created_at: '2024-08-18T09:00:00Z',
    updated_at: '2024-09-02T11:30:00Z',
  },
  {
    id: 2,
    title: 'Dr.G 레드 블레미쉬 진정 루틴 숏폼',
    brand: 'Dr.G',
    category: '뷰티',
    price: 180000,
    image: '/campaign_sample/sample2.jpeg',
    shopify_url: 'https://lynkable.kr/campaigns/drg-cica-routine',
    status: '마감임박',
    participants: 54,
    description:
      '민감성 피부를 위한 진정 루틴을 루즈하지 않고 담백한 톤으로 표현해 주세요. 사용 전후 피부 변화를 함께 작성해 주시면 좋아요.',
    created_at: '2024-08-24T12:00:00Z',
    updated_at: '2024-09-06T09:45:00Z',
  },
  {
    id: 3,
    title: 'Dyson Airstrait 모닝 루틴 챌린지',
    brand: 'Dyson',
    category: '라이프스타일',
    price: 350000,
    image: '/campaign_sample/sample3.jpeg',
    shopify_url: 'https://lynkable.kr/campaigns/dyson-airstrait',
    status: '진행중',
    participants: 48,
    description:
      '프리미엄 스타일러를 활용한 숏폼 챌린지입니다. 아침 루틴과 출근 준비 상황에서 Airstrait가 어떻게 시간을 단축하는지 보여주세요.',
    created_at: '2024-08-28T10:00:00Z',
    updated_at: '2024-09-05T16:30:00Z',
  },
  {
    id: 4,
    title: 'Galaxy Buds3 Pro 거리 인터뷰 콘텐츠',
    brand: 'Samsung',
    category: '테크',
    price: 210000,
    image: '/campaign_sample/sample4.jpeg',
    shopify_url: 'https://lynkable.kr/campaigns/galaxy-buds3pro',
    status: '모집중',
    participants: 26,
    description:
      '서울 주요 핫플에서 Galaxy Buds3 Pro를 체험해 보고 생생한 사운드와 통화 품질을 인터뷰 형식으로 담아주세요.',
    created_at: '2024-08-30T08:00:00Z',
    updated_at: '2024-09-04T18:10:00Z',
  },
  {
    id: 5,
    title: '무신사 가을 룩북 숏폼 트렌드 챌린지',
    brand: '무신사',
    category: '패션',
    price: 200000,
    image: '/campaign_sample/sample2.jpeg',
    shopify_url: 'https://lynkable.kr/campaigns/musinsa-fall-lookbook',
    status: '진행중',
    participants: 41,
    description:
      '가을 무드의 도심 배경에서 3가지 스타일링을 15초 내외 숏폼으로 소개해 주세요. 착장 정보와 스타일 팁을 함께 안내하면 좋아요.',
    created_at: '2024-08-12T14:20:00Z',
    updated_at: '2024-09-01T09:10:00Z',
  },
  {
    id: 6,
    title: '뚜레쥬르 샤인머스캣 케이크 집콕 파티',
    brand: '뚜레쥬르',
    category: 'F&B',
    price: 150000,
    image: '/campaign_sample/sample1.jpeg',
    shopify_url: 'https://lynkable.kr/campaigns/tlj-shinemuscat-party',
    status: '모집예정',
    participants: 18,
    description:
      '신선한 샤인머스캣 케이크와 함께하는 홈 파티 VLOG를 만들어 주세요. 가족 혹은 친구와 함께 나누는 밝은 분위기가 필요합니다.',
    created_at: '2024-09-02T06:30:00Z',
    updated_at: '2024-09-07T08:45:00Z',
  },
];

function resolveImageSrc(image: string | null | undefined) {
  if (!image) return '/logo/sunjeong_link_logo.png';
  if (image.startsWith('http')) return image;
  if (image.startsWith('/')) return image;
  if (hasSupabaseConfig && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const sanitized = image.replace(/^\/+/, '');
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/campaigns/${sanitized}`;
  }
  return image;
}

type SummaryCardProps = {
  label: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
};

function CampaignSummaryCard({ label, value, helper, icon }: SummaryCardProps) {
  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 shadow-sm transition hover:border-blue-300 hover:bg-white">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <p className="text-xl font-bold text-slate-900">{value}</p>
        <p className="text-xs text-slate-400">{helper}</p>
      </div>
    </div>
  );
}

type CampaignCardProps = {
  campaign: CampaignRow;
};

function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-400/50 hover:shadow-lg">
      <div className="relative h-56 overflow-hidden">
        <Link href={`/campaigns/${campaign.id}`} className="block h-full">
          <Image
            src={resolveImageSrc(campaign.image)}
            alt={campaign.title}
            width={640}
            height={360}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="absolute left-4 top-4 rounded-full border border-blue-200 bg-white/90 px-3 py-1 text-xs font-semibold text-blue-600 shadow-sm">
          {campaign.status || '상태 미정'}
        </div>
      </div>
      <div className="flex flex-1 flex-col space-y-4 p-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-500">{campaign.brand || '브랜드 미정'}</p>
          <h3 className="line-clamp-2 text-xl font-bold text-slate-900">{campaign.title}</h3>
          {campaign.description && (
            <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">{campaign.description}</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-600">
            {campaign.category || '카테고리 미정'}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
            참여 {numberFormatter.format(campaign.participants ?? 0)}명
          </span>
        </div>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">캠페인 보상</p>
            <p className="text-2xl font-bold text-slate-900">
              {campaign.price ? `${numberFormatter.format(campaign.price)}원` : '협의'}
            </p>
          </div>
          <div className="text-right text-xs text-slate-400">
            {campaign.created_at && (
              <p>등록 {new Date(campaign.created_at).toLocaleDateString('ko-KR')}</p>
            )}
            {campaign.updated_at && (
              <p>업데이트 {new Date(campaign.updated_at).toLocaleDateString('ko-KR')}</p>
            )}
          </div>
        </div>
        <Link
          href={`/campaigns/${campaign.id}`}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          캠페인 살펴보기
          <FiArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export default function CampaignListPage() {
  const supabase = useMemo(() => createOptionalClient(), []);
  const { isAdmin, loading: authLoading } = useAdminAuth();

  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [sort, setSort] = useState('recommend');
  const [usingFallbackData, setUsingFallbackData] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    let isMounted = true;

    if (!isAdmin) {
      setCampaigns([]);
      setUsingFallbackData(false);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const loadCampaigns = async () => {
      if (!supabase || !hasSupabaseConfig) {
        if (!isMounted) return;
        setCampaigns(dummyCampaigns);
        setUsingFallbackData(true);
        setError(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('campaigns')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        if (!isMounted) return;

        if (data && data.length > 0) {
          setCampaigns(data);
          setUsingFallbackData(false);
          setError(null);
        } else {
          setCampaigns(dummyCampaigns);
          setUsingFallbackData(true);
          setError(null);
        }
      } catch (err) {
        console.error('캠페인 목록 조회 실패:', err);
        if (!isMounted) return;

        setCampaigns(dummyCampaigns);
        setUsingFallbackData(true);
        setError('캠페인 목록을 불러오지 못했습니다. 더미 데이터를 표시합니다.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCampaigns();

    return () => {
      isMounted = false;
    };
  }, [authLoading, isAdmin, supabase]);

  const availableCategories = useMemo(() => {
    const categories = new Set<string>(['전체']);
    campaigns.forEach((campaign) => {
      if (campaign.category) categories.add(campaign.category);
    });
    return Array.from(categories);
  }, [campaigns]);

  const filtered = useMemo(() => {
    let result = campaigns;

    if (selectedCategory !== '전체') {
      result = result.filter((campaign) => campaign.category === selectedCategory);
    }

    result = [...result];

    if (sort === 'latest') {
      result.sort((a, b) => {
        const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
        return bTime - aTime;
      });
    } else if (sort === 'participants') {
      result.sort((a, b) => (b.participants ?? 0) - (a.participants ?? 0));
    }

    return result;
  }, [campaigns, selectedCategory, sort]);

  const summary = useMemo(() => {
    const total = campaigns.length;
    const activeStatuses = ['모집중', '진행중', '마감임박'];
    const active = campaigns.filter((campaign) => activeStatuses.includes(campaign.status ?? '')).length;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newThisMonth = campaigns.filter((campaign) => {
      if (!campaign.created_at) return false;
      const createdAt = new Date(campaign.created_at);
      return createdAt >= startOfMonth;
    }).length;
    const totalParticipants = campaigns.reduce((acc, campaign) => acc + (campaign.participants ?? 0), 0);
    const averageReward = total
      ? Math.round(campaigns.reduce((acc, campaign) => acc + (campaign.price ?? 0), 0) / total)
      : 0;

    return {
      total,
      active,
      newThisMonth,
      totalParticipants,
      averageReward,
    };
  }, [campaigns]);

  const summaryCards = useMemo(
    () => [
      {
        label: '전체 캠페인',
        value: numberFormatter.format(summary.total),
        helper: '등록 완료',
        icon: <FiAward className="h-4 w-4" />,
      },
      {
        label: '활성 캠페인',
        value: numberFormatter.format(summary.active),
        helper: '모집·진행 중',
        icon: <FiTrendingUp className="h-4 w-4" />,
      },
      {
        label: '신규 캠페인',
        value: numberFormatter.format(summary.newThisMonth),
        helper: '이번 달 등록',
        icon: <FiCalendar className="h-4 w-4" />,
      },
      {
        label: '누적 참여자',
        value: numberFormatter.format(summary.totalParticipants),
        helper: '크리에이터 참여',
        icon: <FiUsers className="h-4 w-4" />,
      },
    ],
    [summary]
  );

  const trendingCategories = useMemo(() => {
    const counts = new Map<string, number>();
    campaigns.forEach((campaign) => {
      if (!campaign.category) return;
      counts.set(campaign.category, (counts.get(campaign.category) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([category, count]) => ({ category, count }));
  }, [campaigns]);

  const brandHighlights = useMemo(() => {
    const counts = new Map<string, number>();
    campaigns.forEach((campaign) => {
      if (!campaign.brand) return;
      counts.set(campaign.brand, (counts.get(campaign.brand) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([brand, count]) => ({ brand, count }));
  }, [campaigns]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="space-y-3 text-center text-slate-500">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-300/60 border-t-blue-500" />
          <p>관리자 권한을 확인하는 중입니다.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">관리자 전용 페이지</h1>
          <p className="text-sm leading-relaxed text-slate-600">
            캠페인 목록은 관리자만 확인할 수 있습니다. 관리자 계정으로 로그인해 주세요.
          </p>
          <Link
            href="/auth"
            className="inline-flex w-full items-center justify-center rounded-full bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
          >
            관리자 로그인
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col space-y-12">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs font-semibold text-blue-600">
                Lynkable Campaign Hub
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">캠페인 허브</h1>
              <p className="text-base text-slate-600 md:text-lg">
                브랜드와 크리에이터를 연결하는 링커블의 캠페인 현황입니다. 신규 제안을 빠르게 확인하고, 진행 중인 액션을 한눈에 파악하세요.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/campaigns/new"
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-blue-700"
                >
                  새 캠페인 등록
                  <FiArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/dashboard/performance"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
                >
                  성과 리포트 이동
                  <FiArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div className="grid w-full gap-3 sm:grid-cols-2 lg:max-w-xl">
              {summaryCards.map((card) => (
                <CampaignSummaryCard key={card.label} {...card} />
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-semibold text-slate-700">
              평균 보상 {summary.averageReward ? `${numberFormatter.format(summary.averageReward)}원` : '데이터 준비 중'}
            </span>
            {brandHighlights.map((brand) => (
              <span
                key={brand.brand}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600"
              >
                <FiTrendingUp className="h-3.5 w-3.5 text-blue-500" />
                {brand.brand}
                <span className="text-slate-400">{brand.count}건</span>
              </span>
            ))}
          </div>
          {usingFallbackData && (
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-600">
              <FiInfo className="h-5 w-5 text-blue-500" aria-hidden="true" />
              <span>현재는 시연을 위해 더미 캠페인 데이터를 표시하고 있습니다. 데이터베이스 연결 후 실시간 정보로 자동 전환됩니다.</span>
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 border ${
                    selectedCategory === cat
                      ? 'border-blue-500 bg-blue-600 text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600'
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex w-full flex-col gap-4 lg:w-auto">
              <div className="flex w-full items-center gap-3">
                <select
                  className="w-full rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              {trendingCategories.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-600">
                    인기 카테고리
                  </span>
                  {trendingCategories.map((category) => (
                    <span
                      key={category.category}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-600"
                    >
                      #{category.category}
                      <span className="text-slate-400">{category.count}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4 text-sm text-amber-700 shadow-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-40 text-center text-slate-500">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-300/60 border-t-blue-500" />
            <p>캠페인 정보를 불러오는 중입니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white py-24 text-center text-slate-500 shadow-sm">
                <p className="mb-4 text-3xl"></p>
                <p className="text-lg">조건에 맞는 캠페인이 없습니다. 필터를 조정해 보세요.</p>
              </div>
            ) : (
              filtered.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} />)
            )}
          </div>
        )}
      </div>
    </div>
  );
}
