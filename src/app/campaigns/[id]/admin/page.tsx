import AdminPageClient from './AdminPageClient';

type AdminPageProps = {
  params?: Promise<{ id?: string | string[] }>;
};

export default async function AdminPage({ params }: AdminPageProps) {
  const resolvedParams = params ? await params : undefined;
  const idParam = resolvedParams?.id;
  const campaignId = Array.isArray(idParam) ? idParam[0] : idParam ?? null;

  return <AdminPageClient campaignId={campaignId} />;
}
