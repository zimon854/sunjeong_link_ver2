"use client";

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import TikTokEmbed from './TikTokEmbed';
import type { VietnamInfluencer } from '@/data/vietnamInfluencers';

interface InfluencerShowcaseProps {
  influencers: VietnamInfluencer[];
}

function formatFollowers(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toLocaleString();
}

export default function InfluencerShowcase({ influencers }: InfluencerShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [search, setSearch] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const unique = new Set<string>();
    influencers.forEach((influencer) => {
      influencer.niches.forEach((niche) => unique.add(niche));
    });
    return ['전체'].concat(Array.from(unique));
  }, [influencers]);

  const stats = useMemo(() => {
    const totalFollowers = influencers.reduce((accumulator, influencer) => {
      const tiktok = influencer.platforms.find((platform) => platform.platform === 'TikTok');
      return accumulator + (tiktok ? tiktok.followers : 0);
    }, 0);

    const averageFollowers = influencers.length > 0 ? Math.round(totalFollowers / influencers.length) : 0;

    return {
      totalInfluencers: influencers.length,
      totalFollowers,
      averageFollowers,
    };
  }, [influencers]);

  const filteredInfluencers = useMemo(() => {
    const lowerKeyword = search.trim().toLowerCase();
    return influencers.filter((influencer) => {
      const matchesCategory = selectedCategory === '전체' || influencer.niches.includes(selectedCategory);
      const matchesKeyword = lowerKeyword
        ? influencer.name.toLowerCase().includes(lowerKeyword) ||
          influencer.niches.some((niche) => niche.toLowerCase().includes(lowerKeyword)) ||
          influencer.city.toLowerCase().includes(lowerKeyword)
        : true;
      return matchesCategory && matchesKeyword;
    });
  }, [selectedCategory, search, influencers]);

  const activeInfluencer = useMemo(() => {
    return influencers.find((influencer) => influencer.id === activeId) || null;
  }, [activeId, influencers]);

  return (
    <div className="space-y-10 pb-16">
      <section className="rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-8 py-12 text-white shadow-xl">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm uppercase tracking-widest text-white/70">Market Spotlight</p>
          <h1 className="text-3xl font-semibold sm:text-4xl">베트남 인플루언서 풀</h1>
          <p className="text-lg text-white/80">
            틱톡을 중심으로 빠르게 성장 중인 베트남 크리에이터 6명을 선별했습니다. 모바일 숏폼 트렌드에 최적화된 파트너십을 고민 중이라면 이 리스트로 시작해보세요.
          </p>
          <div className="flex flex-wrap gap-6 pt-4 text-sm">
            <div>
              <p className="text-white/70">총 인플루언서</p>
              <p className="text-xl font-semibold">{stats.totalInfluencers.toLocaleString()}명</p>
            </div>
            <div>
              <p className="text-white/70">틱톡 팔로워 합계</p>
              <p className="text-xl font-semibold">{formatFollowers(stats.totalFollowers)}</p>
            </div>
            <div>
              <p className="text-white/70">틱톡 평균 팔로워</p>
              <p className="text-xl font-semibold">{formatFollowers(stats.averageFollowers)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white/60 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">인플루언서를 빠르게 탐색하세요</h2>
              <p className="text-sm text-gray-600">분야, 도시, 키워드로 필터링할 수 있습니다.</p>
            </div>
            <div className="relative w-full lg:w-72">
              <input
                aria-label="인플루언서 검색"
                className="w-full rounded-full border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none"
                placeholder="이름, 분야, 도시 검색"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M9 3.5a5.5 5.5 0 1 0 3.478 9.85l3.586 3.586a1 1 0 0 0 1.414-1.414l-3.586-3.586A5.5 5.5 0 0 0 9 3.5Zm-3.5 5.5a3.5 3.5 0 1 1 7 0a3.5 3.5 0 0 1-7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isActive = category === selectedCategory;
              const buttonClass = isActive
                ? 'rounded-full border px-4 py-1 text-sm transition border-emerald-500 bg-emerald-500 text-white shadow'
                : 'rounded-full border px-4 py-1 text-sm transition border-gray-200 bg-white text-gray-700 hover:border-emerald-400 hover:text-emerald-600';
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={buttonClass}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredInfluencers.map((influencer) => {
            const hasHighlight = Boolean(influencer.highlightVideo?.url);
            return (
              <article
                key={influencer.id}
                className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className="relative flex flex-col gap-4 p-6">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-gray-200">
                    <Image src={influencer.avatar} alt={influencer.name} fill sizes="64px" className="object-cover" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{influencer.name}</h3>
                    <p className="text-sm text-gray-600">{influencer.city}</p>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                      {influencer.niches.map((niche) => (
                        <span key={niche} className="rounded-full bg-gray-100 px-3 py-1">
                          {niche}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-700">{influencer.bio}</p>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Followers</p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    {influencer.platforms.map((platform) => {
                      const hasExternalLink = platform.url && platform.url !== '#';
                      const content = (
                        <>
                          <span className="font-medium text-emerald-600">{platform.platform}</span>
                          <span>{platform.handle}</span>
                          <span className="text-gray-400">·</span>
                          <span>{formatFollowers(platform.followers)}</span>
                        </>
                      );

                      const key = `${influencer.id}-${platform.platform}`;

                      if (!hasExternalLink) {
                        return (
                          <span
                            key={key}
                            className="flex items-center gap-2 rounded-full bg-white px-3 py-1 text-gray-400 shadow-sm"
                          >
                            {content}
                          </span>
                        );
                      }

                      return (
                        <Link
                          key={key}
                          href={platform.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 rounded-full bg-white px-3 py-1 text-gray-700 shadow-sm transition hover:shadow"
                        >
                          {content}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => hasHighlight && setActiveId(influencer.id)}
                    disabled={!hasHighlight}
                    className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    대표 영상 보기
                  </button>
                  {hasHighlight && influencer.highlightVideo?.url ? (
                    <Link
                      href={influencer.highlightVideo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-gray-500 underline-offset-4 hover:underline"
                    >
                      TikTok에서 직접 보기
                    </Link>
                  ) : (
                    <p className="text-xs text-gray-400">대표 영상 정보가 준비 중입니다.</p>
                  )}
                </div>
              </article>
            );
          })}

          {filteredInfluencers.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center text-gray-500">
              조건에 맞는 인플루언서를 찾지 못했습니다. 필터를 조정해보세요.
            </div>
          )}
        </div>
      </section>

      {activeInfluencer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button aria-label="모달 닫기" className="absolute inset-0 bg-black/60" onClick={() => setActiveId(null)} />
          <div className="relative w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:text-gray-700"
              onClick={() => setActiveId(null)}
            >
              <span className="text-lg">×</span>
            </button>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-gray-200">
                  <Image src={activeInfluencer.avatar} alt={activeInfluencer.name} fill sizes="56px" className="object-cover" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-wide text-emerald-500">TikTok Highlight</p>
                  <h3 className="text-xl font-semibold text-gray-900">{activeInfluencer.name}</h3>
                  <p className="text-sm text-gray-500">{activeInfluencer.city} · {activeInfluencer.niches.join(', ')}</p>
                </div>
              </div>
              {activeInfluencer.highlightVideo?.url ? (
                <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
                  <TikTokEmbed url={activeInfluencer.highlightVideo.url} title={activeInfluencer.name + ' TikTok'} />
                </div>
              ) : (
                <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500">
                  대표 영상이 아직 등록되지 않았습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
