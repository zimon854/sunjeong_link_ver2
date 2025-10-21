import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdaptiveLayout from '@/components/AdaptiveLayout';
import { getNewsPostById } from '@/data/newsPosts';

interface NewsDetailPageProps {
  params?: Promise<{ id?: string | string[] }>;
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const resolvedParams = params ? await params : undefined;
  const rawId = resolvedParams?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  if (!id) {
    notFound();
  }

  const post = getNewsPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <AdaptiveLayout title={post.title} showBackButton>
      <article className="mx-auto w-full max-w-3xl py-12 text-white">
        <header className="space-y-4 border-b border-blue-900/60 pb-8">
          <p className="text-xs uppercase tracking-[0.4em] text-blue-300/70">Lynkable Newsroom</p>
          <h1 className="text-4xl font-extrabold leading-tight">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-blue-200/70">
            <span>{new Date(post.publishedAt).toLocaleDateString('ko-KR')}</span>
            <span>·</span>
            <span>작성 {post.author}</span>
            <span>·</span>
            <span>편집 {post.editor}</span>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-blue-300/80">
            {post.categories.map((category) => (
              <span key={category} className="rounded-full border border-blue-500/40 px-3 py-1">
                #{category}
              </span>
            ))}
          </div>
        </header>

        <section className="prose prose-invert prose-blue mx-auto max-w-none py-10">
          <p className="text-base text-blue-100/90 leading-relaxed">{post.summary}</p>
          <hr className="my-6 border-blue-900/60" />
          {post.body.map((paragraph, index) => (
            <p key={index} className="text-base leading-relaxed text-blue-100/90">
              {paragraph}
            </p>
          ))}
        </section>

        {post.highlights && post.highlights.length > 0 && (
          <section className="bg-blue-900/30 border border-blue-500/30 rounded-2xl p-6 text-sm text-blue-100/90">
            <h2 className="text-lg font-semibold text-white">핵심 요약</h2>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              {post.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </section>
        )}

        {post.factSources && post.factSources.length > 0 && (
          <section className="mt-10 space-y-3 text-sm text-blue-200">
            <h2 className="text-lg font-semibold text-white">참고 자료</h2>
            <ul className="space-y-2">
              {post.factSources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-100">
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <footer className="mt-12 space-y-4 border-t border-blue-900/60 pt-6 text-xs text-blue-300/80">
          {post.externalUrl && (
            <p>
              원문은 <a href={post.externalUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-100">링커블 공식 홈페이지</a>에서도 확인할 수 있습니다.
            </p>
          )}
          <p>정정 및 제보: <a href="mailto:press@lynkable.co" className="underline text-blue-100">press@lynkable.co</a></p>
          <p>
            편집윤리 준수: <Link href="/news/editorial-policy" className="underline text-blue-100">뉴스룸 편집 기준</Link>
          </p>
        </footer>
      </article>
    </AdaptiveLayout>
  );
}
