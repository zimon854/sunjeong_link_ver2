import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
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

  if (post.externalUrl) {
    redirect(post.externalUrl);
  }

  return (
    <AdaptiveLayout title={post.title} showBackButton>
      <article className="mx-auto w-full max-w-3xl py-12 bg-white rounded-2xl shadow-sm border border-slate-200 px-6 md:px-10 text-slate-800">
        <header className="space-y-4 border-b border-slate-200 pb-8">
          <p className="text-xs font-semibold text-blue-600/80">Lynkable Newsroom</p>
          <h1 className="text-4xl font-extrabold leading-tight text-slate-900">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span>{new Date(post.publishedAt).toLocaleDateString('ko-KR')}</span>
            <span>·</span>
            <span>작성 {post.author}</span>
            <span>·</span>
            <span>편집 {post.editor}</span>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {post.categories.map((category) => (
              <span
                key={category}
                className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-blue-700"
              >
                #{category}
              </span>
            ))}
          </div>
        </header>

        <section className="prose prose-slate mx-auto max-w-none py-10">
          <p className="text-base leading-relaxed text-slate-600">{post.summary}</p>
          <hr className="my-6 border-slate-200" />
          {post.body.map((paragraph, index) => (
            <p key={index} className="text-base leading-relaxed text-slate-700">
              {paragraph}
            </p>
          ))}
        </section>

        {post.highlights && post.highlights.length > 0 && (
          <section className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-sm text-slate-700">
            <h2 className="text-lg font-semibold text-blue-700">핵심 요약</h2>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              {post.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </section>
        )}

        {post.factSources && post.factSources.length > 0 && (
          <section className="mt-10 space-y-3 text-sm text-slate-600">
            <h2 className="text-lg font-semibold text-slate-900">참고 자료</h2>
            <ul className="space-y-2">
              {post.factSources.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-600 hover:text-blue-500"
                  >
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <footer className="mt-12 space-y-4 border-t border-slate-200 pt-6 text-xs text-slate-500">
          {post.externalUrl && (
            <p>
              원문은{' '}
              <a
                href={post.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600 hover:text-blue-500"
              >
                링커블 공식 홈페이지
              </a>
              에서도 확인할 수 있습니다.
            </p>
          )}
          <p>
            정정 및 제보:{' '}
            <a href="mailto:press@lynkable.co" className="underline text-blue-600 hover:text-blue-500">
              press@lynkable.co
            </a>
          </p>
          <p>
            편집윤리 준수:{' '}
            <Link href="/news/editorial-policy" className="underline text-blue-600 hover:text-blue-500">
              뉴스룸 편집 기준
            </Link>
          </p>
        </footer>
      </article>
    </AdaptiveLayout>
  );
}
