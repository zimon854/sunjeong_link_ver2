import MatchPageClient from './MatchPageClient';

type MatchPageProps = {
  params: Promise<{ id?: string | string[] }>;
};

export default async function MatchPage({ params }: MatchPageProps) {
  const resolvedParams = await params;
  const rawId = resolvedParams?.id;
  const campaignId = Array.isArray(rawId) ? rawId[0] ?? null : rawId ?? null;

  return <MatchPageClient campaignId={campaignId} />;
}
