'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';

import AdaptiveLayout from '@/components/AdaptiveLayout';
import { createOptionalClient } from '@/lib/supabase/client';
import { Database } from '@/lib/database.types';
import {
  FiExternalLink,
  FiLink2,
  FiMessageCircle,
  FiPlayCircle,
  FiShoppingBag,
  FiStar,
  FiTrendingUp,
} from 'react-icons/fi';

type Campaign = Database['public']['Tables']['campaigns']['Row'];
type Influencer = Database['public']['Tables']['influencers']['Row'];
type CampaignParticipant = Database['public']['Tables']['campaign_participants']['Row'];
type CampaignReview = Database['public']['Tables']['campaign_reviews']['Row'];

type ParticipantWithInfluencer = CampaignParticipant & { influencer: Influencer };

interface CampaignWithRelations extends Campaign {
  participants_data: ParticipantWithInfluencer[];
  reviews_data: CampaignReview[];
}

const hasSupabaseConfig = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const numberFormatter = new Intl.NumberFormat('ko-KR');

function resolveCampaignImageSrc(image: string | null | undefined) {
  if (!image) return '/logo/sunjeong_link_logo.png';
  if (image.startsWith('http')) return image;
  if (image.startsWith('/')) return image;
  if (hasSupabaseConfig && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const sanitized = image.replace(/^\/+/, '');
    return process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/campaigns/' + sanitized;
  }
  return image;
}

function formatMetricValue(value: unknown): string {
  const num = Number(value);
  return Number.isFinite(num) ? numberFormatter.format(num) : '0';
}

function getPrimarySocialLink(handles: Influencer['social_handles'] | null | undefined): string | null {
  if (!handles) return null;
  const record = handles as Record<string, string | undefined>;
  const priorityOrder = ['tiktok', 'instagram', 'youtube', 'twitter', 'linkedin'];
  for (const key of priorityOrder) {
    const link = record[key];
    if (typeof link === 'string' && link.trim().length > 0) {
      return link;
    }
  }
  return null;
}

interface CampaignDetailClientProps {
  campaignId: string | null;
}

export default function CampaignDetailClient({ campaignId }: CampaignDetailClientProps) {
  const [id, setId] = useState<string | null>(campaignId);
  const [campaign, setCampaign] = useState<CampaignWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'participants' | 'reviews' | 'performance'>('overview');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const supabase = useMemo(() => createOptionalClient(), []);

  const aggregatedKPI = useMemo(() => {
    if (!campaign || !Array.isArray(campaign.participants_data)) {
      return null;
    }

    let views = 0;
    let clicks = 0;
    let conversions = 0;
    let sales = 0;
    let roiSum = 0;
    let roiCount = 0;

    campaign.participants_data.forEach((participant) => {
      const metrics = participant.performance_metrics as Record<string, unknown> | null | undefined;
      if (!metrics) return;

      views += Number(metrics.views) || 0;
      clicks += Number(metrics.clicks) || 0;
      conversions += Number(metrics.conversions) || 0;
      sales += Number(metrics.sales) || 0;

      const roiValue = Number(metrics.roi);
      if (!Number.isNaN(roiValue) && metrics.roi !== undefined && metrics.roi !== null) {
        roiSum += roiValue;
        roiCount += 1;
      }
    });

    if (views === 0 && clicks === 0 && conversions === 0 && sales === 0 && roiCount === 0) {
      return null;
    }

    return {
      views,
      clicks,
      conversions,
      sales,
      roi: roiCount ? parseFloat((roiSum / roiCount).toFixed(2)) : null,
    };
  }, [campaign]);
  useEffect(() => {
    setId(campaignId);
  }, [campaignId]);

  useEffect(() => {
    if (!id) {
      setCampaign(null);
      setErrorMessage('유효한 캠페인 ID를 찾을 수 없습니다.');
      setLoading(false);
      return;
    }

    let isMounted = true;
    let channel: ReturnType<SupabaseClient['channel']> | null = null;

    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      setCampaign(null);
      setErrorMessage('유효한 캠페인 ID를 찾을 수 없습니다.');
      setLoading(false);
      return;
    }

    const fetchCampaignData = async ({ skipSubscription } = { skipSubscription: false }) => {
      if (!supabase || !hasSupabaseConfig) {
        setErrorMessage('캠페인 데이터를 불러오려면 데이터베이스 구성이 필요합니다.');
        setCampaign(null);
        setLoading(false);
        return;
      }

      try {
        const { data: campaignData, error: campaignError } = await supabase
          .from('campaigns')
          .select('*')
          .eq('id', numericId)
          .single();

        if (campaignError || !campaignData) {
          setErrorMessage('캠페인 정보를 찾을 수 없습니다.');
          setCampaign(null);
          setLoading(false);
          return;
        }

        const { data: participantsData, error: participantsError } = await supabase
          .from('campaign_participants')
          .select(
            '*,\n            influencer:influencers(*)'
          )
          .eq('campaign_id', numericId);

        const { data: reviewsData, error: reviewsError } = await supabase
          .from('campaign_reviews')
          .select('*')
          .eq('campaign_id', numericId);

        if (participantsError || reviewsError) {
          setErrorMessage('참여자 또는 리뷰 데이터를 불러오지 못했습니다.');
          if (isMounted) {
            setCampaign({
              ...campaignData,
              participants_data: (participantsData as ParticipantWithInfluencer[]) || [],
              reviews_data: reviewsData || [],
            });
            setLoading(false);
          }
          return;
        }

        if (!isMounted) {
          return;
        }

        setCampaign({
          ...campaignData,
          participants_data: (participantsData as ParticipantWithInfluencer[]) || [],
          reviews_data: reviewsData || [],
        });
        setErrorMessage(null);
        setLoading(false);

        if (!skipSubscription && !channel) {
          channel = supabase
            .channel('campaign-' + numericId)
            .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'campaign_participants', filter: 'campaign_id=eq.' + numericId },
              () => fetchCampaignData({ skipSubscription: true })
            )
            .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'campaign_reviews', filter: 'campaign_id=eq.' + numericId },
              () => fetchCampaignData({ skipSubscription: true })
            )
            .subscribe();
        }
      } catch (error) {
        console.error('캠페인 정보를 불러오는 중 오류:', error);
        setErrorMessage('캠페인 정보를 불러오는 중 오류가 발생했습니다.');
        setCampaign(null);
        setLoading(false);
      }
    };

    fetchCampaignData();

    return () => {
      isMounted = false;
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [id, supabase]);
  if (loading) {
    return (
      <AdaptiveLayout title="Campaign Spotlight">
        <div className="flex min-h-[60vh] items-center justify-center bg-slate-50">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />
        </div>
      </AdaptiveLayout>
    );
  }

  if (!campaign) {
    return (
      <AdaptiveLayout title="Campaign Spotlight">
        <div className="flex flex-col items-center gap-4 bg-slate-50 py-24 text-center text-slate-600">
          <span className="text-3xl">🚫</span>
          <p className="text-lg text-slate-500">{errorMessage ?? '캠페인을 찾을 수 없습니다.'}</p>
          <Link
            href="/campaigns"
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-6 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
          >
            캠페인 목록으로 돌아가기
          </Link>
        </div>
      </AdaptiveLayout>
    );
  }

  const participantsList = campaign.participants_data ?? [];
  const tabConfig = [
    { id: 'overview', label: '캠페인 브리프' },
    { id: 'participants', label: '크리에이터' },
    { id: 'reviews', label: '브랜드 피드백' },
    { id: 'performance', label: '성과 요약' },
  ] as const;

  const focusPoints = [
    '틱톡 15~30초 숏폼 포맷으로 진행',
    (campaign.brand || '브랜드') + '의 핵심 USP 강조',
    '사용 장면과 전후 비교 중심의 UGC 무드',
    '댓글 유도 CTA 혹은 링크 클릭 전환 목표 달성',
  ];

  const quickFacts = [
    { label: '브랜드', value: campaign.brand ?? '미정', icon: <FiShoppingBag className="h-4 w-4" aria-hidden="true" /> },
    { label: '카테고리', value: campaign.category ?? '미정', icon: <FiPlayCircle className="h-4 w-4" aria-hidden="true" /> },
    { label: '캠페인 상태', value: campaign.status ?? '상태 미정', icon: <FiTrendingUp className="h-4 w-4" aria-hidden="true" /> },
    {
      label: '보상',
      value: campaign.price ? numberFormatter.format(campaign.price) + '원' : '협의',
      icon: <FiShoppingBag className="h-4 w-4" aria-hidden="true" />,
    },
    {
      label: '참여 크리에이터',
      value: numberFormatter.format(participantsList.length) + '명',
      icon: <FiStar className="h-4 w-4" aria-hidden="true" />,
    },
    {
      label: '캠페인 링크',
      value: campaign.shopify_url ? '랜딩 페이지 연결됨' : '추가 예정',
      icon: <FiLink2 className="h-4 w-4" aria-hidden="true" />,
      href: campaign.shopify_url || undefined,
    },
  ];

  const topByViews = participantsList.length
    ? [...participantsList].sort(
        (a, b) => (Number(b.performance_metrics?.views) || 0) - (Number(a.performance_metrics?.views) || 0)
      )[0]
    : null;

  const topByConversions = participantsList.length
    ? [...participantsList].sort(
        (a, b) => (Number(b.performance_metrics?.conversions) || 0) - (Number(a.performance_metrics?.conversions) || 0)
      )[0]
    : null;

  const overviewDescription = campaign.description
    ? campaign.description.split(/\n+/).filter((paragraph) => paragraph.trim().length > 0)
    : [];
  const renderTabContent = () => {
    switch (activeTab) {
      case 'participants': {
        if (!participantsList.length) {
          return (
            <div className="py-16 text-center text-slate-400">
              <p>아직 참여한 인플루언서가 없습니다.</p>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            {participantsList.map((participant) => {
              const metrics = (participant.performance_metrics as Record<string, unknown>) ?? {};
              const views = Number(metrics.views) || 0;
              const likes = Number(metrics.likes) || 0;
              const comments = Number(metrics.comments) || 0;
              const conversions = Number(metrics.conversions) || 0;
              const primaryProfileLink = getPrimarySocialLink(participant.influencer.social_handles);
              const statusMeta = ((status: string) => {
                if (status === 'approved') {
                  return {
                    label: '승인 완료',
                    className:
                      'inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600',
                  };
                }
                if (status === 'pending') {
                  return {
                    label: '검토 중',
                    className:
                      'inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600',
                  };
                }
                if (status === 'rejected') {
                  return {
                    label: '반려',
                    className:
                      'inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600',
                  };
                }
                return {
                  label: '대기',
                  className:
                    'inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600',
                };
              })(participant.approval_status || 'pending');

              return (
                <article key={participant.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-4">
                      <Link href={'/influencers/' + participant.influencer_id} className="shrink-0">
                        <Image
                          src={participant.influencer.avatar || '/logo/sunjeong_link_logo.png'}
                          alt={participant.influencer.name}
                          width={64}
                          height={64}
                          className="h-16 w-16 rounded-full border border-slate-200 object-cover"
                        />
                      </Link>
                      <div className="space-y-1">
                        <Link
                          href={'/influencers/' + participant.influencer_id}
                          className="text-lg font-semibold text-slate-900 hover:text-blue-600"
                        >
                          {participant.influencer.name}
                        </Link>
                        <p className="text-sm text-slate-500">
                          {participant.influencer.country} · {numberFormatter.format(participant.influencer.follower_count)}명 팔로워
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          {(participant.influencer.categories || []).slice(0, 4).map((category) => (
                            <span key={category} className="rounded-full bg-slate-100 px-2 py-1 font-medium">
                              #{category}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className={statusMeta.className}>{statusMeta.label}</span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <MetricChip label="조회수" value={formatMetricValue(views)} helper="누적" />
                    <MetricChip label="좋아요" value={formatMetricValue(likes)} helper="누적" />
                    <MetricChip label="댓글" value={formatMetricValue(comments)} helper="누적" />
                    <MetricChip label="전환" value={formatMetricValue(conversions)} helper="누적" />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {primaryProfileLink && (
                      <a
                        href={primaryProfileLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-300 hover:text-blue-600"
                      >
                        <FiExternalLink className="h-4 w-4" aria-hidden="true" /> 프로필 방문
                      </a>
                    )}
                    {participant.content_url && (
                      <a
                        href={participant.content_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                      >
                        <FiPlayCircle className="h-4 w-4" aria-hidden="true" /> 콘텐츠 보기
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        );
      }
      case 'reviews': {
        if (!campaign.reviews_data?.length) {
          return (
            <div className="py-16 text-center text-slate-400">
              <p>아직 작성된 리뷰가 없습니다.</p>
            </div>
          );
        }

        return (
          <div className="space-y-4">
            {campaign.reviews_data.map((review) => (
              <article key={review.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-base font-semibold text-slate-900">{review.reviewer_name}</p>
                    <time className="text-xs text-slate-400" dateTime={review.created_at}>
                      {new Date(review.created_at).toLocaleDateString('ko-KR')}
                    </time>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-600">
                    <FiStar className="h-4 w-4" aria-hidden="true" />
                    {review.rating.toFixed(1)} / 5.0
                  </div>
                </div>
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600">{review.comment}</p>
              </article>
            ))}
          </div>
        );
      }
      case 'performance': {
        return (
          <div className="space-y-8">
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <PerformanceCard label="누적 조회수" value={aggregatedKPI?.views ?? 0} helper="전 참여자" />
              <PerformanceCard label="누적 클릭" value={aggregatedKPI?.clicks ?? 0} helper="전 참여자" />
              <PerformanceCard label="총 전환" value={aggregatedKPI?.conversions ?? 0} helper="전 참여자" />
              <PerformanceCard label="캠페인 매출" value={aggregatedKPI?.sales ?? 0} helper="원" isCurrency />
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">인사이트</h3>
              {aggregatedKPI ? (
                <div className="mt-4 space-y-4">
                  <p className="text-sm text-slate-600">
                    총 <strong className="font-semibold text-slate-900">{numberFormatter.format(aggregatedKPI.views)}회</strong>의 조회수와 {' '}
                    <strong className="font-semibold text-slate-900">{numberFormatter.format(aggregatedKPI.clicks)}회</strong>의 클릭이 발생했습니다. 평균 ROI는 {' '}
                    <strong className="font-semibold text-slate-900">{aggregatedKPI.roi !== null ? aggregatedKPI.roi + '배' : '집계중'}</strong> 입니다.
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <HighlightCard title="조회수 리더" participant={topByViews} metricKey="views" helper="가장 높은 조회수를 기록" />
                    <HighlightCard title="전환 리더" participant={topByConversions} metricKey="conversions" helper="가장 많은 전환을 기록" />
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">성과 데이터가 집계되면 요약이 표시됩니다.</p>
              )}
            </section>
          </div>
        );
      }
      case 'overview':
      default: {
        return (
          <div className="space-y-8">
            <section className="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">캠페인 소개</h3>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600">
                  {overviewDescription.length ? (
                    overviewDescription.map((paragraph, index) => <p key={index}>{paragraph}</p>)
                  ) : (
                    <p>캠페인 설명이 곧 업데이트될 예정입니다. 관리자에게 문의해 주세요.</p>
                  )}
                </div>
                <div className="mt-6 space-y-3">
                  <h4 className="text-sm font-semibold text-slate-900">콘텐츠 가이드</h4>
                  <ul className="space-y-2">
                    {focusPoints.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-sm text-slate-600">
                        <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                          <FiPlayCircle className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">퀵 팩트</h3>
                <div className="space-y-3 text-sm">
                  {quickFacts.map(({ label, value, icon, href }) => (
                    <QuickFactItem key={label} label={label} value={value} icon={icon} href={href} />
                  ))}
                </div>
                {campaign.shopify_url && (
                  <Link
                    href={campaign.shopify_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                  >
                    <FiExternalLink className="h-4 w-4" aria-hidden="true" /> 랜딩 페이지 열기
                  </Link>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">최근 하이라이트</h3>
              {participantsList.length ? (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <HighlightCard title="조회수 리더" participant={topByViews} metricKey="views" helper="가장 많은 조회수를 기록" />
                  <HighlightCard title="전환 리더" participant={topByConversions} metricKey="conversions" helper="가장 많은 전환을 기록" />
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">참여 인플루언서가 등록되면 요약이 표시됩니다.</p>
              )}
            </section>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricChip label="참여 신청" value={numberFormatter.format(campaign.participants ?? 0) + '명'} helper="현재 모집 현황" />
              <MetricChip label="누적 리뷰" value={numberFormatter.format(campaign.reviews_data?.length ?? 0) + '건'} helper="브랜드 피드백" />
              <MetricChip
                label="평균 ROI"
                value={aggregatedKPI && aggregatedKPI.roi !== null ? aggregatedKPI.roi + '배' : '집계중'}
                helper="성과 요약"
              />
              <MetricChip
                label="누적 조회수"
                value={aggregatedKPI ? numberFormatter.format(aggregatedKPI.views) : '집계중'}
                helper="전 참여자 기준"
              />
            </section>
          </div>
        );
      }
    }
  };
  return (
    <AdaptiveLayout title={campaign.title ?? 'Campaign Spotlight'} showBackButton>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 py-8">
        <header className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[2fr,3fr]">
            <div className="relative h-64 overflow-hidden bg-slate-100 lg:h-full">
              <Image
                src={resolveCampaignImageSrc(campaign.image)}
                alt={campaign.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
                priority
              />
              {campaign.status && (
                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-1 text-xs font-semibold text-blue-600 shadow-sm">
                  <FiTrendingUp className="h-4 w-4" aria-hidden="true" />
                  {campaign.status}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-6 p-6 lg:p-8">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">Campaign Spotlight</p>
                <h1 className="text-3xl font-bold leading-tight text-slate-900 lg:text-4xl">{campaign.title}</h1>
                <p className="text-sm text-slate-500">
                  등록일 {campaign.created_at ? new Date(campaign.created_at).toLocaleDateString('ko-KR') : '미정'} · 업데이트 {campaign.updated_at ? new Date(campaign.updated_at).toLocaleDateString('ko-KR') : '미정'}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-600">
                  <FiShoppingBag className="h-4 w-4" aria-hidden="true" />
                  {campaign.brand || '브랜드 미정'}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-600">
                  <FiPlayCircle className="h-4 w-4" aria-hidden="true" />
                  {campaign.category || '카테고리 미정'}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-600">
                  참여 {numberFormatter.format(campaign.participants ?? participantsList.length)}명
                </span>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                캠페인 보상은 {campaign.price ? numberFormatter.format(campaign.price) + '원' : '협의 가능'} 입니다. 상세 안내는 관리자 승인 후 전달됩니다.
              </div>
              <div className="mt-auto flex flex-wrap items-center gap-3">
                {campaign.shopify_url && (
                  <Link
                    href={campaign.shopify_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:border-blue-300 hover:bg-white"
                  >
                    <FiExternalLink className="h-4 w-4" aria-hidden="true" /> 랜딩 페이지 보기
                  </Link>
                )}
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                  disabled
                >
                  <FiMessageCircle className="h-4 w-4" aria-hidden="true" /> 메시지 문의 준비중
                </button>
              </div>
            </div>
          </div>
        </header>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <nav className="flex flex-wrap gap-2">
              {tabConfig.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={
                    'rounded-full px-4 py-2 text-sm font-semibold transition ' +
                    (activeTab === tab.id ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
                  }
                >
                  {tab.label}
                </button>
              ))}
            </nav>
            <div className="text-xs text-slate-400">실시간 데이터는 Supabase 연동 시 자동으로 업데이트됩니다.</div>
          </div>
          <div className="p-6">{renderTabContent()}</div>
        </section>

        <section className="rounded-3xl border border-dashed border-blue-200 bg-blue-50/50 p-6 text-center text-sm text-blue-700">
          <p className="font-semibold">콘텐츠 업로드 / 참여하기 기능은 곧 오픈 예정이에요.</p>
          <p className="mt-2 text-blue-600">관리자 승인을 통해 접수 중이며, 정식 오픈 시 푸시로 가장 먼저 알려드릴게요.</p>
        </section>
      </div>
    </AdaptiveLayout>
  );
}
interface MetricChipProps {
  label: string;
  value: string;
  helper?: string;
}

function MetricChip({ label, value, helper }: MetricChipProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
      {helper && <p className="text-xs text-slate-500">{helper}</p>}
    </div>
  );
}

interface QuickFactItemProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  href?: string;
}

function QuickFactItem({ label, value, icon, href }: QuickFactItemProps) {
  const content = (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition hover:border-blue-200">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">{icon}</span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-700">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </Link>
    );
  }

  return content;
}

interface HighlightCardProps {
  title: string;
  participant: ParticipantWithInfluencer | null;
  metricKey: 'views' | 'conversions';
  helper: string;
}

function HighlightCard({ title, participant, metricKey, helper }: HighlightCardProps) {
  if (!participant) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
        데이터가 집계되면 자동으로 표시됩니다.
      </div>
    );
  }

  const metrics = (participant.performance_metrics as Record<string, unknown>) ?? {};
  const metricValue = metricKey === 'views' ? Number(metrics.views) || 0 : Number(metrics.conversions) || 0;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-blue-200 bg-blue-50/50 p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">{helper}</p>
        <h4 className="mt-1 text-lg font-bold text-blue-900">{title}</h4>
      </div>
      <div className="flex items-center gap-4">
        <Image
          src={participant.influencer.avatar || '/logo/sunjeong_link_logo.png'}
          alt={participant.influencer.name}
          width={56}
          height={56}
          className="h-14 w-14 rounded-full border border-blue-200 object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-slate-900">{participant.influencer.name}</p>
          <p className="text-xs text-slate-500">
            {(metricKey === 'views' ? '조회수 ' : '전환 ') + numberFormatter.format(metricValue)} · 팔로워 {numberFormatter.format(participant.influencer.follower_count)}명
          </p>
        </div>
      </div>
    </div>
  );
}

interface PerformanceCardProps {
  label: string;
  value: number;
  helper?: string;
  isCurrency?: boolean;
}

function PerformanceCard({ label, value, helper, isCurrency = false }: PerformanceCardProps) {
  const display = value > 0 ? numberFormatter.format(value) + (isCurrency ? '원' : '') : '집계중';
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 flex items-baseline gap-2 text-2xl font-bold text-slate-900">
        <FiTrendingUp className="h-5 w-5 text-blue-500" aria-hidden="true" />
        {display}
      </p>
      {helper && <p className="text-xs text-slate-500">{helper}</p>}
    </div>
  );
}
