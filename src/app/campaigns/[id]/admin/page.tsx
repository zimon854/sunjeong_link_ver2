import AdminPageClient from './AdminPageClient';

type AdminPageProps = {
  params?: { id?: string | string[] };
};

export default function AdminPage({ params }: AdminPageProps) {
  const idParam = params?.id;
  const campaignId = Array.isArray(idParam) ? idParam[0] : idParam ?? null;

  return <AdminPageClient campaignId={campaignId} />;
}
