import CampaignDetailClient from './CampaignDetailClient'

interface CampaignPageProps {
  params: Promise<{ id?: string | string[] }>
}

export default async function CampaignDetailPage({ params }: CampaignPageProps) {
  const resolved = await params
  const rawId = resolved?.id
  const campaignId = Array.isArray(rawId) ? rawId[0] ?? null : rawId ?? null

  return <CampaignDetailClient campaignId={campaignId} />
}
