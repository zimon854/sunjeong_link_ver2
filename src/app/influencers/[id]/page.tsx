import React from 'react';
import InfluencerDetailClient from './InfluencerDetailClient';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/lib/database.types';

type Influencer = Database['public']['Tables']['influencers']['Row'];
type InfluencerPageProps = {
  params?: Promise<{ id?: string | string[] }>;
};

export default async function InfluencerDetailPage({ params }: InfluencerPageProps) {
  const supabase = await createClient();
  const resolvedParams = params ? await params : undefined;
  const rawId = resolvedParams?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  if (!id) {
    const fallbackInfluencer: Influencer = {
      id: 'unknown',
      name: 'Unknown Influencer',
      avatar: '/campaign_sample/kahi.png',
      country: 'Unknown',
      country_code: 'us',
      follower_count: 0,
      categories: [],
      campaigns_count: 0,
      rating: 0,
      bio: '요청한 인플루언서를 찾을 수 없습니다.',
      is_online: false,
      social_handles: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return <InfluencerDetailClient influencer={fallbackInfluencer} />;
  }
  
  const { data: influencer, error } = await supabase
    .from('influencers')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !influencer) {
    // Fallback to mock data for development
    const mockInfluencer: Influencer = {
      id: id,
      name: 'Nicha',
      avatar: '/campaign_sample/kahi.png',
      country: 'Thailand',
      country_code: 'th',
      follower_count: 12000,
      categories: ['뷰티', '라이프스타일'],
      campaigns_count: 8,
      rating: 4.8,
      bio: 'K-뷰티와 라이프스타일을 사랑하는 태국 인플루언서. 다양한 브랜드와 협업 경험 보유. 맑고 투명한 피부 표현과 감성적인 영상미로 많은 사랑을 받고 있습니다.',
      is_online: true,
      social_handles: {
        instagram: '@nicha_official',
        tiktok: '@nicha_beauty'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return <InfluencerDetailClient influencer={mockInfluencer} />;
  }

  return <InfluencerDetailClient influencer={influencer} />;
}
