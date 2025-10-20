import { Database } from '@/lib/database.types';

export interface CampaignCard {
  id: number;
  title: string;
  brand: string;
  image: string;
  price: number;
  discount: number;
  description: string;
  rating: number;
  reviewCount: number;
  participants: number;
  liked: boolean;
  status: string;
  category: string;
  mine?: boolean;
}

export type CampaignRow = Database['public']['Tables']['campaigns']['Row'];
export type CampaignParticipantRow = Database['public']['Tables']['campaign_participants']['Row'];
export type CampaignReviewRow = Database['public']['Tables']['campaign_reviews']['Row'];
export type InfluencerRow = Database['public']['Tables']['influencers']['Row'];

export interface SampleCampaignDetail extends CampaignRow {
  discount: number;
  rating: number;
  reviewCount: number;
  liked: boolean;
  mine?: boolean;
  participants_data: (CampaignParticipantRow & { influencer: InfluencerRow })[];
  reviews_data: CampaignReviewRow[];
}

export const campaignCards: CampaignCard[] = [
  {
    id: 1,
    title: '비건 뷰티 마스크팩 공동구매',
    brand: '그린코스',
    image: '/campaign_sample/sample1.jpeg',
    price: 34000,
    discount: 11,
    description: '맑고 뽀얀 피부를 위해, 짜서쓰는 백담고',
    rating: 4.3,
    reviewCount: 7,
    participants: 57,
    liked: true,
    status: '진행중',
    category: '뷰티',
    mine: true,
  },
  {
    id: 2,
    title: '가방에서 립스틱 찾지 마세요!',
    brand: 'yyeon',
    image: '/campaign_sample/sample2.jpeg',
    price: 135000,
    discount: 34,
    description: '더 이상 가방에서 립스틱 찾지 마세요. [가방+파우치]',
    rating: 4.6,
    reviewCount: 3,
    participants: 34,
    liked: false,
    status: '진행중',
    category: '패션',
  },
  {
    id: 3,
    title: "피부 노화의 원인, 줄어드는 'EGF'는 이렇게 채우는 것입니다.",
    brand: '스킨케어',
    image: '/campaign_sample/sample3.jpeg',
    price: 48900,
    discount: 25,
    description: "[크림]피부 노화의 원인, 줄어드는 'EGF'는 이렇게 채우는 것입니다.",
    rating: 4.7,
    reviewCount: 19,
    participants: 21,
    liked: false,
    status: '종료',
    category: '뷰티',
  },
  {
    id: 4,
    title: '노벨상 받은 바로 그 EGF, 메디비티 노벨상 앰플',
    brand: '다이애저스메디(주)',
    image: '/campaign_sample/sample4.jpeg',
    price: 49000,
    discount: 0,
    description: '노벨상 받은 바로 그 EGF, 메디비티 노벨상 앰플',
    rating: 4.6,
    reviewCount: 21,
    participants: 42,
    liked: true,
    status: '진행중',
    category: '뷰티',
  },
];

const baseInfluencers: InfluencerRow[] = [
  {
    id: 'influencer-mita',
    name: 'Mita Kanya',
    avatar: '/campaign_sample/sample1.jpeg',
    country: 'Thailand',
    country_code: 'th',
    follower_count: 128000,
    categories: ['뷰티', '라이프'],
    campaigns_count: 42,
    rating: 4.8,
    bio: '태국 현지 뷰티 크리에이터, 클린뷰티 전문 리뷰',
    is_online: true,
    social_handles: { instagram: '@mitareview', tiktok: '@mitabeauty' },
    created_at: '2025-09-01T03:00:00.000Z',
    updated_at: '2025-09-01T03:00:00.000Z',
  },
  {
    id: 'influencer-nicha',
    name: 'Nicha',
    avatar: '/campaign_sample/sample2.jpeg',
    country: 'Thailand',
    country_code: 'th',
    follower_count: 95000,
    categories: ['패션', '뷰티'],
    campaigns_count: 36,
    rating: 4.7,
    bio: '방콕 기반 라이프스타일 & 패션 인플루언서',
    is_online: false,
    social_handles: { instagram: '@nicha.story' },
    created_at: '2025-05-12T03:00:00.000Z',
    updated_at: '2025-05-12T03:00:00.000Z',
  },
  {
    id: 'influencer-rosa',
    name: 'Rosa Nguyen',
    avatar: '/campaign_sample/sample3.jpeg',
    country: 'Vietnam',
    country_code: 'vn',
    follower_count: 78000,
    categories: ['뷰티', '푸드'],
    campaigns_count: 28,
    rating: 4.5,
    bio: '호치민 기반 K-뷰티 매니아',
    is_online: false,
    social_handles: { instagram: '@rosawow' },
    created_at: '2025-04-02T03:00:00.000Z',
    updated_at: '2025-04-02T03:00:00.000Z',
  },
];

export const campaignDetails: SampleCampaignDetail[] = [
  {
    id: 1,
    title: '비건 뷰티 마스크팩 공동구매',
    brand: '그린코스',
    category: '뷰티',
    price: 34000,
    image: '/campaign_sample/sample1.jpeg',
    shopify_url: 'https://lynkable.co/campaign/mask-pack',
    status: '진행중',
    participants: 57,
    description: '저자극 비건 시트마스크를 동남아 소비자에게 소개하는 공동구매 캠페인입니다.',
    created_at: '2025-08-01T09:00:00.000Z',
    updated_at: '2025-09-18T07:00:00.000Z',
    discount: 11,
    rating: 4.3,
    reviewCount: 7,
    liked: true,
    mine: true,
    participants_data: [
      {
        id: 101,
        campaign_id: 1,
        influencer_id: baseInfluencers[0].id,
        status: 'completed',
  content_url: '/campaign_sample/sample1.jpeg',
        content_caption: '신선한 수분이 느껴지는 마스크팩, 하루종일 촉촉해요!',
        approval_status: 'approved',
        performance_metrics: { views: 18500, likes: 2100, comments: 180 },
        created_at: '2025-09-10T08:00:00.000Z',
        updated_at: '2025-09-12T08:00:00.000Z',
        influencer: baseInfluencers[0],
      },
      {
        id: 102,
        campaign_id: 1,
        influencer_id: baseInfluencers[2].id,
        status: 'in_progress',
  content_url: '/campaign_sample/sample3.jpeg',
        content_caption: '자극 없이 사용할 수 있는 K-뷰티 마스크, 베트남 뷰티 러버에게 추천!',
        approval_status: 'pending',
        performance_metrics: { views: 9200, likes: 870, comments: 62 },
        created_at: '2025-09-14T11:00:00.000Z',
        updated_at: '2025-09-14T11:00:00.000Z',
        influencer: baseInfluencers[2],
      },
    ],
    reviews_data: [
      {
        id: 501,
        campaign_id: 1,
        reviewer_id: 'brand-green-gm',
        reviewer_name: '그린코스 마케팅팀',
        rating: 4.5,
        comment: '태국/베트남 채널에서 신규 팔로워가 크게 늘었습니다. 상세 보고서도 꼼꼼했습니다.',
        created_at: '2025-09-20T02:00:00.000Z',
      },
      {
        id: 502,
        campaign_id: 1,
        reviewer_id: 'brand-green-ceo',
        reviewer_name: '박서윤 대표',
        rating: 4.0,
        comment: '공동구매 준비 시간이 조금 더 짧았다면 좋았을 것 같아요.',
        created_at: '2025-09-22T02:00:00.000Z',
      },
    ],
  },
  {
    id: 2,
    title: '가방에서 립스틱 찾지 마세요!',
    brand: 'yyeon',
    category: '패션',
    price: 135000,
    image: '/campaign_sample/sample2.jpeg',
    shopify_url: 'https://lynkable.co/campaign/yyeon-bag',
    status: '진행중',
    participants: 34,
    description: '가방 내부 조명과 파우치를 결합한 신개념 백, 인플루언서 리뷰어 20명을 모집합니다.',
    created_at: '2025-07-18T09:00:00.000Z',
    updated_at: '2025-09-05T05:00:00.000Z',
    discount: 34,
    rating: 4.6,
    reviewCount: 3,
    liked: false,
    participants_data: [
      {
        id: 201,
        campaign_id: 2,
        influencer_id: baseInfluencers[1].id,
        status: 'completed',
  content_url: '/campaign_sample/sample2.jpeg',
        content_caption: '어두운 곳에서도 립스틱 찾기 쉬운 조명백! 여행 필수템으로 추천합니다.',
        approval_status: 'approved',
        performance_metrics: { views: 26400, likes: 3200, comments: 245 },
        created_at: '2025-08-25T08:30:00.000Z',
        updated_at: '2025-08-27T08:30:00.000Z',
        influencer: baseInfluencers[1],
      },
    ],
    reviews_data: [
      {
        id: 601,
        campaign_id: 2,
        reviewer_id: 'brand-yyeon-pm',
        reviewer_name: 'Yyeon PM',
        rating: 5,
        comment: '릴스 영상 덕분에 태국 여성 고객 문의가 급증했습니다. 협업 프로세스도 매끄러웠어요.',
        created_at: '2025-09-10T02:00:00.000Z',
      },
    ],
  },
];

export function findCampaignDetail(id: number): SampleCampaignDetail | undefined {
  return campaignDetails.find((campaign) => campaign.id === id);
}
