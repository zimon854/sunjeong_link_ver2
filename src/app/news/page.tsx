'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import AdaptiveLayout from '@/components/AdaptiveLayout';
import { newsPosts } from '@/data/newsPosts';

const NewsPage = () => {
  const sortedPosts = useMemo(() => {
    return [...newsPosts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  }, []);

  const renderLink = (post: (typeof newsPosts)[number]) => {
    const linkContent = (
      <span className="inline-flex items-center gap-2 text-sm font-semibold">
        기사 보기 <FiArrowRight className="h-4 w-4" aria-hidden />
      </span>
    );

    if (post.externalUrl) {
      return (
        <a
          href={post.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-blue-700 transition hover:bg-blue-50 sm:w-auto"
        >
          {linkContent}
        </a>
      );
    }

    return (
      <Link
        href={`/news/${post.id}`}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-blue-700 transition hover:bg-blue-50 sm:w-auto"
      >
        {linkContent}
      </Link>
    );
  };

  const newsImages = ['/news/news1.png', '/news/news2.png', '/news/news3.png'];
  const fallbackImage = newsImages[0];

  return (
    <AdaptiveLayout title="업계 뉴스룸">
      <div className="mx-auto w-full max-w-4xl space-y-10 px-4 py-12 sm:px-6">
        <header className="space-y-5 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white">
            Lynkable Newsroom
          </span>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">글로벌 커머스 뉴스 & 공식 발표</h1>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              링커블이 직접 작성하거나 검증한 최신 동향, 정책 업데이트, 성과 리포트를 한눈에 확인하세요.
              모든 콘텐츠는 내부 편집 규정을 거쳐 발행되며, 출처와 발행 날짜를 명시합니다.
            </p>
          </div>
          <div className="flex flex-col gap-3 text-sm sm:flex-row sm:flex-wrap sm:justify-center">
            <Link
              href="/news/editorial-policy"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 font-semibold text-blue-700 transition hover:bg-blue-100 sm:w-auto"
            >
              편집 기준 및 제보 안내
            </Link>
            <a
              href="mailto:press@lynkable.co"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-500 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-blue-600 sm:w-auto"
            >
              뉴스룸 제보하기
            </a>
          </div>
        </header>

        <section className="space-y-6">
          {sortedPosts.map((post, index) => {
            const previewImage = post.imageUrl ?? newsImages[index % newsImages.length];
            const previewAlt = post.imageAlt ?? `${post.source} 기사 대표 이미지`;

            return (
              <article
                key={post.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md sm:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-6">
                  <div className="relative h-52 w-full overflow-hidden rounded-2xl bg-slate-100 sm:h-60 lg:h-32 lg:w-48">
                    <Image
                      src={previewImage || fallbackImage}
                      alt={previewAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 18rem"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-slate-400">
                      <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString('ko-KR')}</time>
                      <span>•</span>
                      <span>{post.source}</span>
                      <span>•</span>
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.readingTime}</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{post.title}</h2>
                    <p className="text-sm leading-relaxed text-slate-600 sm:text-base">{post.summary}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {post.categories.map((category) => (
                        <span
                          key={category}
                          className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 font-semibold text-blue-700"
                        >
                          #{category}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex w-full justify-start lg:justify-end">
                      {renderLink(post)}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <footer className="text-xs text-slate-500 text-center space-y-2">
          <p>편집 책임자: 링커블 미디어팀 / contact@lynkable.co</p>
          <p>
            뉴스룸 콘텐츠는 내부 취재와 파트너 인터뷰를 기반으로 작성되며, 외부 기사 인용 시 원문 링크를 제공합니다.
          </p>
          <p>
            정확성에 대한 정정 또는 문의는 <a href="mailto:press@lynkable.co" className="underline text-blue-600">press@lynkable.co</a>로 접수해주세요.
          </p>
        </footer>
      </div>
    </AdaptiveLayout>
  );
};

export default NewsPage;
