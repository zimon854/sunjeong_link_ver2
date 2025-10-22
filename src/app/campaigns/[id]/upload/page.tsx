import UploadPageClient from './UploadPageClient';

type UploadPageProps = {
  params: Promise<{ id?: string | string[] }>;
};

export default async function UploadPage({ params }: UploadPageProps) {
  const resolvedParams = await params;
  const rawId = resolvedParams?.id;
  const campaignId = Array.isArray(rawId) ? rawId[0] ?? null : rawId ?? null;

  return <UploadPageClient campaignId={campaignId} />;
}
