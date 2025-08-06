import { notFound } from 'next/navigation';
import React from 'react';
import InfluencerDetailClient from './InfluencerDetailClient';

type Influencer = {
  id: string;
  name: string;
  avatar: string;
  country: string;
  countryCode: string;
  follower: number;
  categories: string[];
  campaigns: number;
  rating: number;
  bio: string;
  isOnline: boolean;
  history: { title: string; result: string; year: number }[];
  reviews: { from: string; rating: number; comment: string }[];
};

const mockInfluencers: Influencer[] = [
  {
    id: '1',
    name: 'Nicha',
    avatar: '/campaign_sample/sample1.jpeg',
    country: 'Thailand',
    countryCode: 'th',
    follower: 12000,
    categories: ['뷰티', '라이프스타일'],
    campaigns: 8,
    rating: 4.8,
    bio: 'K-뷰티와 라이프스타일을 사랑하는 태국 인플루언서. 다양한 브랜드와 협업 경험 보유. 맑고 투명한 피부 표현과 감성적인 영상미로 많은 사랑을 받고 있습니다.',
    isOnline: true,
    history: [
      { title: '코스메틱 브랜드 A 런칭 캠페인', result: '판매 120건', year: 2024 },
      { title: '라이프스타일 브랜드 B 콜라보', result: '클릭 2,000회', year: 2023 },
    ],
    reviews: [
      { from: 'BrandA', rating: 5, comment: '콘텐츠 퀄리티가 매우 높고, 팔로워 반응이 폭발적이었습니다.' },
      { from: 'BrandB', rating: 4.5, comment: '소통이 빠르고 결과가 좋았습니다. 다음에 또 함께하고 싶네요.' },
    ],
  },
  // ... 다른 인플루언서 데이터 추가 ...
];

export async function generateStaticParams(): Promise<{ params: { id: string } }[]> {
  return mockInfluencers.map((inf) => ({ params: { id: inf.id } }));
}

export default function InfluencerDetailPage({ params }: any) {
  const influencer = mockInfluencers.find((inf) => inf.id === params.id);

  if (!influencer) return notFound();

  return <InfluencerDetailClient influencer={influencer} />;
}
