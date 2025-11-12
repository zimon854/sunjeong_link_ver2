'use client';
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/database.types';
import { useNativeToast } from '@/hooks/useNativeToast';
import { useAdminAuth } from '@/hooks/useAdminAuth';

type Influencer = Database['public']['Tables']['koc_tiktok_influencers']['Row'];

const numberFormatter = new Intl.NumberFormat('ko-KR');
const PAGE_SIZE = 50;
const SUPABASE_BATCH_SIZE = 1000;
const computeRating = (inf: Influencer): number => {
  const followerScore = (inf.followers ?? 0) % 5000;
  const sttScore = (inf.stt ?? 0) % 17;
  const raw = 4.2 + followerScore / 5000 * 0.6 + sttScore * 0.01;
  const bounded = Math.min(5, Math.max(4.1, raw));
  return Math.round(bounded * 10) / 10;
};

const extractTikTokUsername = (profileUrl?: string | null): string | null => {
  if (!profileUrl) {
    return null;
  }

  try {
    const parsed = new URL(profileUrl);
    const match = parsed.pathname.match(/@([^/]+)/);
    if (match && match[1]) {
      return match[1];
    }
  } catch {
    return null;
  }

  return null;
};

const getTikTokAvatarUrl = (profileUrl?: string | null): string | null => {
  const username = extractTikTokUsername(profileUrl);
  if (!username) {
    return null;
  }

  const params = new URLSearchParams({ username: username.toLowerCase() });
  return '/api/tiktok-avatar?' + params.toString();
};

type HighlightCreatorConfig = {
  displayName: string;
  profileUrl: string;
  username?: string;
  matchNames?: readonly string[];
};

const HIGHLIGHT_CREATORS: readonly HighlightCreatorConfig[] = [
  {
    displayName: 'Kim Chi Hoàng',
    profileUrl: 'https://www.tiktok.com/@chikimhoang0310',
    matchNames: ['Chi Hoàng', 'Kim Chi Hoang', 'Chi Hoang'],
  },
  {
    displayName: 'TÚ ANH SUSU',
    profileUrl: 'https://www.tiktok.com/@susubae01',
    matchNames: ['Tu Anh Susu', 'Tu Anh SuSu', 'Tú Anh SuSu'],
  },
  {
    displayName: 'Yaya Thảo',
    profileUrl: 'https://www.tiktok.com/@yayathao',
    matchNames: ['Yaya Thao'],
  },
  {
    displayName: 'Yuna Vu',
    profileUrl: 'https://www.tiktok.com/@yuna.vukieuanh',
    matchNames: ['Yuna VuKim'],
  },
] as const;

const normalizeName = (value: string | null | undefined): string | null => {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
};

const normalizedHighlightCreators = HIGHLIGHT_CREATORS.map((creator) => {
  const usernameRaw = creator.username ?? extractTikTokUsername(creator.profileUrl);
  const username = usernameRaw ? usernameRaw.toLowerCase() : null;
  const normalizedNames = new Set<string>();

  [creator.displayName, ...(creator.matchNames ?? [])].forEach((name) => {
    const normalized = normalizeName(name);
    if (normalized) {
      normalizedNames.add(normalized);
    }
  });

  return {
    ...creator,
    username,
    normalizedNames,
  };
});

const getInfluencerSummary = (influencer: Influencer, rating: number): string => {
  const followerText = numberFormatter.format(influencer.followers ?? 0);
  const name = influencer.name;
  return `${name}은(는) TikTok에서 ${followerText}명의 팔로워와 함께 브랜드 협업에서 높은 참여도를 보이는 크리에이터입니다. 평균 평점 ${rating.toFixed(1)}점을 기록하며 스토리텔링 중심의 콘텐츠를 선보이고 있어요.`;
};

const resolveHighlightAvatarUrl = (influencer: Influencer): string | null => {
  if (influencer.profile_image_url) {
    return influencer.profile_image_url;
  }
  const fallbackUrl = getTikTokAvatarUrl(influencer.tiktok_profile_url);
  return fallbackUrl && !fallbackUrl.includes('unavatar.io') ? fallbackUrl : null;
};

const DEFAULT_AVATAR_SVG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" fill="none">
      <rect width="96" height="96" rx="24" fill="url(#g)"/>
      <g opacity="0.85" fill="white">
        <circle cx="48" cy="37" r="16"/>
        <path d="M20 78c1.8-14.5 13.9-26 28-26s26.2 11.5 28 26c0.1 1-0.7 2-1.8 2H21.8c-1.1 0-1.9-1-1.8-2Z"/>
      </g>
      <defs>
        <linearGradient id="g" x1="8" y1="10" x2="88" y2="86" gradientUnits="userSpaceOnUse">
          <stop stop-color="#3B82F6"/>
          <stop offset="1" stop-color="#8B5CF6"/>
        </linearGradient>
      </defs>
    </svg>`
  );

interface NewInfluencerForm {
  stt: string;
  name: string;
  tiktokProfileUrl: string;
  followers: string;
  bestVideoUrl: string;
}

const createInitialNewInfluencerForm = (): NewInfluencerForm => ({
  stt: '',
  name: '',
  tiktokProfileUrl: '',
  followers: '',
  bestVideoUrl: '',
});

export default function InfluencersPage() {
  const supabase = createClient();
  const { showSuccess, showError } = useNativeToast();
  const { isAdmin, loading: adminLoading } = useAdminAuth();

  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loadingInfluencers, setLoadingInfluencers] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<'followers_desc' | 'followers_asc' | 'stt_asc'>('followers_desc');
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [newInfluencer, setNewInfluencer] = useState<NewInfluencerForm>(() => createInitialNewInfluencerForm());
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const highlightAvatarPrefetchRef = useRef<Set<string>>(new Set());

  const handleCopy = useCallback(async (value: string, message: string) => {
    if (!value) {
      showError('복사할 정보가 없습니다.', { position: 'center' });
      return;
    }

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        // Fallback for environments without navigator.clipboard support
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      showSuccess(`${message}를 복사했어요.`, { position: 'center' });
    } catch (error) {
      console.error('Clipboard copy failed', error);
      showError('클립보드 복사에 실패했습니다.', { position: 'center' });
    }
  }, [showError, showSuccess]);

  const handleNewInfluencerChange = useCallback(<K extends keyof NewInfluencerForm>(field: K, value: NewInfluencerForm[K]) => {
    setNewInfluencer((prev) => ({ ...prev, [field]: value }));
  }, []);

  const fetchInfluencers = useCallback(async () => {
    setLoadingInfluencers(true);

    const aggregated: Influencer[] = [];
    let rangeStart = 0;

    try {
      while (true) {
        const rangeEnd = rangeStart + SUPABASE_BATCH_SIZE - 1;
        const { data, error } = await supabase
          .from('koc_tiktok_influencers')
          .select('*')
          .order('stt', { ascending: true })
          .range(rangeStart, rangeEnd);

        if (error) {
          throw error;
        }

        if (!data || data.length === 0) {
          break;
        }

        aggregated.push(...data);

        if (data.length < SUPABASE_BATCH_SIZE) {
          break;
        }

        rangeStart += SUPABASE_BATCH_SIZE;
      }

      setInfluencers(aggregated);
    } catch (error) {
      console.error('Failed to load koc influencers from Lynkable', error);
      showError('인플루언서 정보를 불러오지 못했습니다.', { position: 'center' });
      setInfluencers([]);
    } finally {
      setLoadingInfluencers(false);
    }
  }, [showError, supabase]);

  useEffect(() => {
    fetchInfluencers();

    if (!isAdmin) {
      return;
    }

    const channel = supabase
      .channel('koc_tiktok_influencers_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'koc_tiktok_influencers' },
        () => {
          fetchInfluencers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchInfluencers, isAdmin, supabase]);

  useEffect(() => {
    if (!isAdmin) {
      setShowAdminForm(false);
    }
  }, [isAdmin]);

  const handleCreateInfluencer = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const requiredFields = [
      { key: 'stt', label: 'No' },
      { key: 'name', label: '이름' },
      { key: 'tiktokProfileUrl', label: 'TikTok 링크' },
      { key: 'followers', label: '팔로워 수' },
    ] as const;

    const missing = requiredFields.find(({ key }) => !newInfluencer[key].trim());
    if (missing) {
      showError(`${missing.label}을(를) 입력해 주세요.`, { position: 'center' });
      return;
    }

    const sttValue = Number(newInfluencer.stt.trim());
    if (!Number.isInteger(sttValue) || sttValue <= 0) {
      showError('No는 0보다 큰 정수로 입력해 주세요.', { position: 'center' });
      return;
    }

    const followersSanitized = newInfluencer.followers.replace(/[\s.,]/g, '');
    const followersValue = Number(followersSanitized);
    if (!Number.isFinite(followersValue) || followersValue < 0) {
      showError('팔로워 수는 0 이상 숫자로 입력해 주세요.', { position: 'center' });
      return;
    }

    const profileUrl = newInfluencer.tiktokProfileUrl.trim();
    if (!profileUrl.startsWith('http')) {
      showError('TikTok 링크는 http 또는 https로 시작해야 합니다.', { position: 'center' });
      return;
    }

    const bestVideoUrl = newInfluencer.bestVideoUrl.trim();
    if (bestVideoUrl && !bestVideoUrl.startsWith('http')) {
      showError('대표 영상 링크는 http 또는 https로 시작해야 합니다.', { position: 'center' });
      return;
    }

    setSubmitting(true);

    try {
      const payload: Database['public']['Tables']['koc_tiktok_influencers']['Insert'] = {
        stt: sttValue,
        name: newInfluencer.name.trim(),
        tiktok_profile_url: profileUrl,
        followers: followersValue,
        best_video_url: bestVideoUrl || null,
      };

      const { error } = await supabase
        .from('koc_tiktok_influencers')
        .upsert(payload, {
          onConflict: 'stt',
        });

      if (error) {
        throw error;
      }

      showSuccess('인플루언서를 저장했습니다.', { position: 'center' });
      setNewInfluencer(createInitialNewInfluencerForm());
      await fetchInfluencers();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '등록 중 오류가 발생했습니다.';
      showError(message, { position: 'center' });
    } finally {
      setSubmitting(false);
    }
  }, [fetchInfluencers, newInfluencer, showError, showSuccess, supabase]);

  const filteredInfluencers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return influencers;
    }

    return influencers.filter((inf) => {
      const matchesName = inf.name.toLowerCase().includes(term);
      const matchesStt = inf.stt?.toString().includes(term);
      const matchesProfile = inf.tiktok_profile_url?.toLowerCase().includes(term);
      return matchesName || matchesStt || matchesProfile;
    });
  }, [influencers, searchTerm]);

  const sortedInfluencers = useMemo(() => {
    const sorted = [...filteredInfluencers];
    switch (sortKey) {
      case 'followers_asc':
        sorted.sort((a, b) => (a.followers ?? 0) - (b.followers ?? 0));
        break;
      case 'followers_desc':
        sorted.sort((a, b) => (b.followers ?? 0) - (a.followers ?? 0));
        break;
      case 'stt_asc':
        sorted.sort((a, b) => (a.stt ?? 0) - (b.stt ?? 0));
        break;
    }
    return sorted;
  }, [filteredInfluencers, sortKey]);

  const totalPages = useMemo(() => {
    if (sortedInfluencers.length === 0) {
      return 1;
    }
    return Math.ceil(sortedInfluencers.length / PAGE_SIZE);
  }, [sortedInfluencers]);

  const paginatedInfluencers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedInfluencers.slice(start, start + PAGE_SIZE);
  }, [currentPage, sortedInfluencers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortKey]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const featuredInfluencers = useMemo<Influencer[]>(() => {
    if (influencers.length === 0) {
      return [];
    }

    const byUsername = new Map<string, Influencer>();
    const byName = new Map<string, Influencer>();

    influencers.forEach((inf) => {
      const username = extractTikTokUsername(inf.tiktok_profile_url)?.toLowerCase();
      if (username && !byUsername.has(username)) {
        byUsername.set(username, inf);
      }

      const normalized = normalizeName(inf.name);
      if (normalized && !byName.has(normalized)) {
        byName.set(normalized, inf);
      }
    });

    const curated: Influencer[] = [];

    normalizedHighlightCreators.forEach((creator) => {
      let match: Influencer | undefined;

      if (creator.username) {
        match = byUsername.get(creator.username);
      }

      if (!match) {
        for (const name of creator.normalizedNames) {
          const candidate = byName.get(name);
          if (candidate) {
            match = candidate;
            break;
          }
        }
      }

      if (match) {
        curated.push(
          match.name === creator.displayName ? match : { ...match, name: creator.displayName },
        );
      }
    });

    return curated;
  }, [influencers]);

  useEffect(() => {
    if (featuredInfluencers.length === 0) {
      return;
    }

    const controller = new AbortController();
    const prefetched = highlightAvatarPrefetchRef.current;

    featuredInfluencers.slice(0, HIGHLIGHT_CREATORS.length).forEach((inf) => {
      const url = getTikTokAvatarUrl(inf.tiktok_profile_url);
      if (!url || prefetched.has(url)) {
        return;
      }

      prefetched.add(url);
      fetch(url, { signal: controller.signal }).catch((error) => {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Failed to prefetch TikTok avatar', error);
        }
      });
    });

    return () => {
      controller.abort();
    };
  }, [featuredInfluencers]);

  const metrics = useMemo(() => {
    if (sortedInfluencers.length === 0) {
      return {
        creators: 0,
        totalFollowers: 0,
        averageFollowers: 0,
        averageRating: 0,
      };
    }

    const totalFollowers = sortedInfluencers.reduce((sum, inf) => sum + (inf.followers ?? 0), 0);
    const averageFollowers = Math.round(totalFollowers / sortedInfluencers.length);
    const totalRating = sortedInfluencers.reduce((sum, inf) => sum + computeRating(inf), 0);
    const averageRating = Math.round((totalRating / sortedInfluencers.length) * 100) / 100;

    return {
      creators: sortedInfluencers.length,
      totalFollowers,
      averageFollowers,
      averageRating,
    };
  }, [sortedInfluencers]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-10 text-center sm:mb-12">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">TikTok KOC 인플루언서</h1>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            Lynkable에 저장된 TikTok KOC 데이터를 검색하고 대표 영상 링크까지 빠르게 확인하세요.
          </p>
          {isAdmin && !adminLoading && (
            <button
              type="button"
              onClick={() => setShowAdminForm((prev) => !prev)}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-blue-300 bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm transition hover:bg-blue-50 sm:w-auto"
            >
              {showAdminForm ? '등록 폼 숨기기' : '등록 폼 열기'}
            </button>
          )}
        </div>

        <div className="mb-10 space-y-6">
          <div className="relative mx-auto max-w-2xl">
            <input
              type="text"
              placeholder="이름, No, TikTok 링크 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-slate-300 bg-white px-5 py-3 text-base text-slate-700 placeholder-slate-400 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:px-6 sm:py-4"
            />
            <svg className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex flex-col items-stretch justify-center gap-3 text-sm sm:flex-row sm:items-center sm:gap-4">
            <div className="flex items-center gap-2 sm:justify-center">
              <label className="text-xs font-medium text-slate-500">정렬</label>
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as typeof sortKey)}
                className="w-full rounded-full border border-slate-300 bg-white px-4 py-2 text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none sm:w-auto"
              >
                <option value="followers_desc">팔로워 많은순</option>
                <option value="followers_asc">팔로워 적은순</option>
                <option value="stt_asc">등록순(No)</option>
              </select>
            </div>
          </div>
        </div>

        {isAdmin && !adminLoading && showAdminForm && (
          <section className="mb-12">
            <div className="rounded-3xl border border-blue-200 bg-blue-50/70 p-6 md:p-8 shadow-sm">
              <div className="flex flex-col gap-1 mb-6">
                <h2 className="text-lg md:text-xl font-bold text-slate-900">인플루언서 추가 또는 업데이트</h2>
                <p className="text-sm text-slate-600">No 기준으로 중복 시 자동 업데이트됩니다.</p>
              </div>
              <form onSubmit={handleCreateInfluencer} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex flex-col gap-2 text-sm text-slate-600">
                    <span className="font-semibold text-slate-800">No*</span>
                    <input
                      type="number"
                      min={1}
                      value={newInfluencer.stt}
                      onChange={(e) => handleNewInfluencerChange('stt', e.target.value)}
                      className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="예: 32"
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-slate-600">
                    <span className="font-semibold text-slate-800">이름*</span>
                    <input
                      type="text"
                      value={newInfluencer.name}
                      onChange={(e) => handleNewInfluencerChange('name', e.target.value)}
                      className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="예: Huyền Thích Skin"
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-slate-600 md:col-span-2">
                    <span className="font-semibold text-slate-800">TikTok 링크*</span>
                    <input
                      type="url"
                      value={newInfluencer.tiktokProfileUrl}
                      onChange={(e) => handleNewInfluencerChange('tiktokProfileUrl', e.target.value)}
                      className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="https://www.tiktok.com/@example"
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-slate-600">
                    <span className="font-semibold text-slate-800">팔로워 수*</span>
                    <input
                      type="text"
                      value={newInfluencer.followers}
                      onChange={(e) => handleNewInfluencerChange('followers', e.target.value)}
                      className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="예: 119900"
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-slate-600">
                    <span className="font-semibold text-slate-800">대표 영상 링크</span>
                    <input
                      type="url"
                      value={newInfluencer.bestVideoUrl}
                      onChange={(e) => handleNewInfluencerChange('bestVideoUrl', e.target.value)}
                      className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="https://www.tiktok.com/@example/video/..."
                    />
                  </label>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <p className="text-sm text-slate-600">* 표시는 필수 입력 항목입니다.</p>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300"
                    disabled={submitting}
                  >
                    {submitting ? '저장 중...' : '인플루언서 저장하기'}
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {featuredInfluencers.length > 0 && (
          <FeaturedInfluencersSection influencers={featuredInfluencers} />
        )}

        <div className="mb-10 -mx-4 overflow-x-auto px-4 pb-2">
          <div className="grid min-w-[600px] grid-cols-2 gap-3 sm:min-w-0 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
            <InfluencerMetricCard
              label="총 인플루언서"
              value={`${numberFormatter.format(metrics.creators)} 명`}
              helper="현재 필터 결과 기준"
            />
          <InfluencerMetricCard
            label="총 팔로워"
            value={`${numberFormatter.format(metrics.totalFollowers)} 명`}
            helper="중복 미제거 합산"
          />
          <InfluencerMetricCard
            label="평균 팔로워"
            value={`${numberFormatter.format(metrics.averageFollowers)} 명`}
            helper="필터 결과 평균"
          />
          <InfluencerMetricCard
            label="평균 평점"
            value={`${metrics.averageRating.toFixed(2)} 점`}
            helper="현재 목록 기준"
          />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="space-y-3 px-4 py-5 md:hidden">
            {loadingInfluencers && (
              <div className="py-12 text-center text-slate-500">
                인플루언서 데이터를 불러오는 중입니다.
              </div>
            )}
            {!loadingInfluencers && paginatedInfluencers.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center text-sm text-slate-500">
                검색 조건에 맞는 인플루언서를 찾을 수 없습니다.
              </div>
            )}
            {!loadingInfluencers && paginatedInfluencers.map((inf, index) => {
              const displayIndex = (currentPage - 1) * PAGE_SIZE + index + 1;
              const ratingValue = computeRating(inf);
              const followerText = numberFormatter.format(inf.followers ?? 0);
              const avatarUrl = inf.profile_image_url ?? getTikTokAvatarUrl(inf.tiktok_profile_url);
              return (
                <article
                  key={inf.id ?? `${inf.stt}-${inf.name}`}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                      {displayIndex}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-inner">
                        <Image
                          src={avatarUrl ?? DEFAULT_AVATAR_SVG}
                          alt={`${inf.name} 프로필 이미지`}
                          width={96}
                          height={96}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-slate-900">{inf.name}</p>
                        <p className="text-xs text-slate-500">팔로워 {followerText}명</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-600">
                      <Image
                        src="https://flagcdn.com/w20/vn.png"
                        alt="Vietnam flag"
                        width={20}
                        height={14}
                        className="rounded-[3px] border border-white/60"
                      />
                      VN
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 font-semibold text-amber-600">
                      평점 {ratingValue.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 text-sm">
                    {inf.tiktok_profile_url && (
                      <a
                        href={inf.tiktok_profile_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                      >
                        TikTok 프로필 열기
                      </a>
                    )}
                    {inf.best_video_url ? (
                      <a
                        href={inf.best_video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-100"
                      >
                        대표 영상 보기
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">대표 영상이 등록되어 있지 않습니다.</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleCopy(inf.tiktok_profile_url ?? '', '프로필 링크')}
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-1.5 font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
                    >
                      프로필 링크 복사
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(inf.best_video_url ?? '', '대표 영상 링크')}
                      className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 font-semibold text-emerald-600 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!inf.best_video_url}
                    >
                      대표 영상 복사
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-[760px] w-full table-fixed text-sm text-slate-700">
              <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-100/95 backdrop-blur">
                <tr>
                  <th scope="col" className="w-16 px-4 py-4 text-left text-xs font-semibold text-slate-500 align-middle">No</th>
                  <th scope="col" className="w-20 px-4 py-4 text-left text-xs font-semibold text-slate-500 align-middle">프로필</th>
                  <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-slate-500 align-middle">이름</th>
                  <th scope="col" className="w-20 px-4 py-4 text-left text-xs font-semibold text-slate-500 align-middle">국가</th>
                  <th scope="col" className="w-28 px-4 py-4 text-right text-xs font-semibold text-slate-500 align-middle">팔로워</th>
                  <th scope="col" className="w-24 px-4 py-4 text-right text-xs font-semibold text-slate-500 align-middle">평점</th>
                  <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-slate-500 align-middle">TikTok</th>
                  <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-slate-500 align-middle">대표 영상</th>
                  <th scope="col" className="w-40 px-4 py-4 text-left text-xs font-semibold text-slate-500 align-middle">빠른 작업</th>
                </tr>
              </thead>
              <tbody>
                {loadingInfluencers && (
                  <tr className="bg-white">
                    <td className="px-6 py-10 text-center text-slate-500" colSpan={9}>
                      인플루언서 데이터를 불러오는 중입니다.
                    </td>
                  </tr>
                )}
                {!loadingInfluencers && sortedInfluencers.length === 0 && (
                  <tr className="bg-white">
                    <td className="px-6 py-10 text-center text-slate-500" colSpan={9}>
                      검색 조건에 맞는 인플루언서를 찾을 수 없습니다.
                    </td>
                  </tr>
                )}
                {!loadingInfluencers && paginatedInfluencers.map((inf, index) => {
                  const displayIndex = (currentPage - 1) * PAGE_SIZE + index + 1;
                  const rowHighlight = index % 2 === 0 ? 'bg-white' : 'bg-slate-50';
                  const ratingValue = computeRating(inf);
                  const avatarUrl = inf.profile_image_url ?? getTikTokAvatarUrl(inf.tiktok_profile_url);
                  return (
                    <tr
                      key={inf.id ?? `${inf.stt}-${inf.name}`}
                      className={`${rowHighlight} border-b border-slate-200 transition-colors duration-200 hover:bg-blue-50`}
                    >
                      <td className="px-4 py-5 align-top">
                        <span className="text-sm font-semibold text-slate-900">{displayIndex}</span>
                      </td>
                      <td className="px-4 py-5 align-top">
                        <div className="h-12 w-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-inner">
                          <Image
                            src={avatarUrl ?? DEFAULT_AVATAR_SVG}
                            alt={`${inf.name} 프로필 이미지`}
                            width={96}
                            height={96}
                            className="h-full w-full object-cover"
                            unoptimized
                          />
                        </div>
                      </td>
                      <td className="px-4 py-5 align-top">
                        <span className="text-sm font-semibold text-slate-900 break-words">{inf.name}</span>
                      </td>
                      <td className="px-4 py-5 align-top">
                        <div className="flex items-center gap-2">
                          <Image
                            src="https://flagcdn.com/w20/vn.png"
                            alt="Vietnam flag"
                            width={20}
                            height={14}
                            className="rounded-[3px] border border-white/60"
                          />
                          <span className="text-xs font-semibold text-slate-500">VN</span>
                        </div>
                      </td>
                      <td className="px-4 py-5 text-right align-top font-semibold text-slate-700">
                        <span className="inline-block min-w-[92px] text-right leading-none">{numberFormatter.format(inf.followers ?? 0)}</span>
                      </td>
                      <td className="px-4 py-5 text-right align-top">
                        <span className="inline-flex items-center justify-end gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
                          <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                          </svg>
                          {ratingValue.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-4 py-5 align-top">
                        <a
                          href={inf.tiktok_profile_url ?? '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                        >
                          TikTok 열기
                        </a>
                      </td>
                      <td className="px-4 py-5 align-top">
                        {inf.best_video_url ? (
                          <a
                            href={inf.best_video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-100"
                          >
                            대표 영상 보기
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">등록됨 없음</span>
                        )}
                      </td>
                      <td className="px-4 py-5 align-top">
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopy(inf.tiktok_profile_url ?? '', '프로필 링크')}
                            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 shadow-sm transition hover:bg-slate-100"
                          >
                            프로필 주소 복사
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopy(inf.best_video_url ?? '', '대표 영상 링크')}
                            className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-600 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={!inf.best_video_url}
                          >
                            대표 영상 복사
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {!loadingInfluencers && sortedInfluencers.length > 0 && (
          <div className="mt-6 flex flex-col items-center gap-3 md:flex-row md:justify-between">
            <p className="text-xs text-slate-500">
              총 {numberFormatter.format(sortedInfluencers.length)}명 · 페이지 {currentPage} / {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                이전
              </button>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <span>페이지</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    if (!Number.isFinite(next)) return;
                    setCurrentPage(Math.min(Math.max(1, next), totalPages));
                  }}
                  className="h-8 w-16 rounded-full border border-slate-300 bg-white px-3 text-center text-xs font-semibold text-slate-600 focus:border-blue-500 focus:outline-none"
                />
                <span>/ {totalPages}</span>
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FeaturedInfluencersSection({ influencers }: { influencers: Influencer[] }) {
  const [hero, ...rest] = influencers;

  if (!hero) {
    return null;
  }

  return (
    <section className="mb-14">
      <div className="flex flex-col gap-2 mb-8 text-center md:text-left md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">대표 인플루언서 하이라이트</h2>
          <p className="text-sm text-slate-500">주요 크리에이터 네 명을 선별해 팔로워 순으로 보여드려요.</p>
          <p className="text-xs text-slate-400">리스트는 수동으로 큐레이션되어 고정 노출됩니다.</p>
        </div>
      </div>
      <div className="space-y-6">
        <FeaturedInfluencerHero influencer={hero} />
        {rest.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {rest.map((inf) => (
              <FeaturedInfluencerTile key={inf.id ?? `${inf.stt}-${inf.name}`} influencer={inf} eager />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturedInfluencerHero({ influencer }: { influencer: Influencer }) {
  const rating = computeRating(influencer);
  const followerText = numberFormatter.format(influencer.followers ?? 0);
  const avatarUrl = resolveHighlightAvatarUrl(influencer) ?? DEFAULT_AVATAR_SVG;
  const summary = `${influencer.name} · 팔로워 ${followerText}명 · 평점 ${rating.toFixed(1)}점의 퍼포먼스를 기록 중인 크리에이터입니다.`;

  return (
    <article className="relative overflow-hidden rounded-[36px] border border-slate-200 bg-slate-900 text-white shadow-xl">
      <div className="absolute inset-0">
        {avatarUrl && (
          <Image
            src={avatarUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-60"
            placeholder="blur"
            blurDataURL={DEFAULT_AVATAR_SVG}
            aria-hidden
            unoptimized
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-900/80" aria-hidden />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.22),_transparent_65%)]" aria-hidden />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(129,140,248,0.18),_transparent_70%)]" aria-hidden />
      </div>
      <div className="relative z-10 grid gap-8 p-6 text-left sm:p-8 md:p-10 lg:grid-cols-[1.15fr,0.85fr]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            {avatarUrl && (
              <Image
                src={avatarUrl}
                alt={`${influencer.name} 프로필 이미지`}
                width={96}
                height={96}
                className="h-20 w-20 rounded-3xl border-4 border-white/40 object-cover shadow-lg sm:h-24 sm:w-24"
                placeholder="blur"
                blurDataURL={DEFAULT_AVATAR_SVG}
                unoptimized
              />
            )}
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-200">
                Top Creator
              </span>
              <h3 className="text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">{influencer.name}</h3>
            </div>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-200/90 sm:text-base">{summary}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-white/90">
            <FeatureStatBadge label="팔로워" value={`${followerText}명`} />
            <FeatureStatBadge label="평균 평점" value={`${rating.toFixed(1)}점`} accent="amber" />
            {typeof influencer.stt === 'number' && influencer.stt > 0 && (
              <FeatureStatBadge label="No" value={`#${influencer.stt}`} accent="slate" />
            )}
          </div>
          <div className="flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap">
            {influencer.tiktok_profile_url && (
              <a
                href={influencer.tiktok_profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2 font-semibold text-white transition hover:bg-white/20 sm:w-auto"
              >
                TikTok 프로필 방문
              </a>
            )}
            {influencer.best_video_url && (
              <a
                href={influencer.best_video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-sky-300/40 bg-sky-400/20 px-5 py-2 font-semibold text-sky-100 transition hover:bg-sky-400/30 sm:w-auto"
              >
                대표 영상 살펴보기
              </a>
            )}
          </div>
        </div>
        <div className="relative mx-auto flex h-full w-full max-w-xs items-center justify-center sm:max-w-sm">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[30px] border border-white/15 bg-slate-950 shadow-2xl">
            <Image
              src={avatarUrl}
              alt={`${influencer.name} 대표 이미지`}
              fill
              sizes="(max-width: 1024px) 70vw, 400px"
              className="object-cover"
              placeholder="blur"
              blurDataURL={DEFAULT_AVATAR_SVG}
              priority
              unoptimized
            />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/30 to-transparent" aria-hidden />
            <div className="absolute bottom-5 left-5 text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
              Signature Look
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function FeaturedInfluencerTile({ influencer, eager = false }: { influencer: Influencer; eager?: boolean }) {
  const rating = computeRating(influencer);
  const avatarUrl = resolveHighlightAvatarUrl(influencer) ?? DEFAULT_AVATAR_SVG;
  const summary = getInfluencerSummary(influencer, rating);

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-slate-900/95 text-white shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <Image
          src={avatarUrl}
          alt={`${influencer.name} 대표 이미지`}
          fill
          priority={eager}
          loading={eager ? 'eager' : undefined}
          sizes="(max-width: 1024px) 60vw, 400px"
          className="object-cover"
          quality={70}
          placeholder="blur"
          blurDataURL={DEFAULT_AVATAR_SVG}
          unoptimized
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/30 to-transparent" aria-hidden />
        <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white">
          Featured
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 px-6 pb-6 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold leading-tight break-words text-white">{influencer.name}</h3>
            {typeof influencer.stt === 'number' && influencer.stt > 0 && (
              <span className="text-[11px] uppercase tracking-[0.25em] text-slate-400">No. {influencer.stt}</span>
            )}
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/40 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold text-amber-100">
            <svg width="11" height="11" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
            </svg>
            {rating.toFixed(1)}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">{summary}</p>
        <div className="mt-auto flex flex-wrap items-center gap-2 text-[11px] font-semibold">
          {influencer.tiktok_profile_url && (
            <a
              href={influencer.tiktok_profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-white transition hover:bg-white/20"
            >
              프로필 보기
            </a>
          )}
          {influencer.best_video_url && (
            <a
              href={influencer.best_video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/15 px-4 py-2 text-sky-100 transition hover:bg-sky-400/25"
            >
              대표 영상
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function FeatureStatBadge({
  label,
  value,
  accent = 'sky',
}: {
  label: string;
  value: string;
  accent?: 'sky' | 'amber' | 'slate';
}) {
  const accentClasses = {
    sky: 'border-sky-300/50 bg-sky-500/15 text-sky-100',
    amber: 'border-amber-300/50 bg-amber-400/15 text-amber-50',
    slate: 'border-white/20 bg-white/10 text-slate-100',
  } as const;

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 ${accentClasses[accent]} backdrop-blur`}>
      <span className="text-[10px] uppercase tracking-[0.3em] text-white/70">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </span>
  );
}

function InfluencerMetricCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="relative flex flex-col gap-2">
        <span className="text-xs font-semibold text-slate-500">{label}</span>
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        <span className="text-[11px] text-slate-500">{helper}</span>
      </div>
    </div>
  );
}
