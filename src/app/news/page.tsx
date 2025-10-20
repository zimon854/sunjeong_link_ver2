'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import AdaptiveLayout from '@/components/AdaptiveLayout';
import { newsPosts } from '@/data/newsPosts';

const NewsPage = () => {
  const sortedPosts = useMemo(() => {
    return [...newsPosts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  }, []);

  return (
    <AdaptiveLayout title="업계 뉴스룸">
      <div className="max-w-3xl mx-auto py-12 space-y-10">
        <header className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-300/80">Lynkable Newsroom</p>
          <h1 className="text-4xl font-extrabold text-white">글로벌 커머스 뉴스 & 공식 발표</h1>
          <p className="text-secondary text-sm md:text-base">
            링커블이 직접 작성하거나 검증한 최신 동향, 정책 업데이트, 성과 리포트를 한눈에 확인하세요.
            모든 콘텐츠는 내부 편집 규정을 거쳐 게재되며, 출처와 발행 날짜를 명시합니다.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/news/editorial-policy" className="inline-flex items-center gap-2 rounded-lg border border-blue-400/60 px-4 py-2 text-blue-100 hover:bg-blue-500/20 transition">
              편집 기준 및 제보 안내
            </Link>
            <a href="mailto:press@lynkable.co" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition">
              뉴스룸 제보하기
            </a>
          </div>
        </header>

        <section className="space-y-6">
          {sortedPosts.map((post) => (
            <article
              key={post.id}
              className="card bg-black/30 border border-blue-500/20 hover:border-blue-400/50 transition-colors"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-3 md:w-3/4">
                  <div className="flex flex-wrap gap-2 text-xs text-blue-200/80">
                    <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString('ko-KR')}</time>
                    <span>·</span>
                    <span>{post.source}</span>
                    <span>·</span>
                    <span>{post.author}</span>
                    <span>·</span>
                    <span>{post.readingTime}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{post.title}</h2>
                  <p className="text-secondary leading-relaxed text-sm md:text-base">{post.summary}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-blue-300/80">
                    {post.categories.map((category) => (
                      <span key={category} className="rounded-full border border-blue-500/40 px-3 py-1">
                        #{category}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="md:w-1/4 text-right">
                  <Link
                    href={`/news/${post.id}`}
                    className="inline-flex items-center justify-center rounded-lg border border-blue-400/70 px-4 py-2 text-sm font-semibold text-blue-200 hover:bg-blue-500/20 transition"
                  >
                    기사 보기
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>

        <footer className="text-xs text-secondary text-center space-y-2">
          <p>편집 책임자: 링커블 미디어팀 / contact@lynkable.co</p>
          <p>
            뉴스룸 콘텐츠는 내부 취재와 파트너 인터뷰를 기반으로 작성되며, 외부 기사 인용 시 원문 링크를 제공합니다.
          </p>
          <p>
            정확성에 대한 정정 또는 문의는 <a href="mailto:press@lynkable.co" className="underline text-blue-200">press@lynkable.co</a>로 접수해주세요.
          </p>
        </footer>
      </div>
    </AdaptiveLayout>
  );
};

export default NewsPage;
