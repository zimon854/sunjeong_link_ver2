import { notFound } from 'next/navigation';
import React from 'react';

// 목업 인플루언서 데이터
const mockInfluencers = [
  {
    id: '1',
    name: 'Nicha',
    avatar: '/logo/유튜브 쇼츠.svg',
    country: 'Thailand',
    follower: 12000,
    categories: ['뷰티', '라이프스타일'],
    campaigns: 8,
    rating: 4.8,
    bio: 'K-뷰티와 라이프스타일을 사랑하는 태국 인플루언서. 다양한 브랜드와 협업 경험 보유.',
    history: [
      { title: '뷰티 브랜드 A 캠페인', result: '판매 120건', year: 2024 },
      { title: '라이프스타일 브랜드 B', result: '클릭 2,000회', year: 2023 },
    ],
    reviews: [
      { from: 'BrandA', rating: 5, comment: '콘텐츠 퀄리티가 매우 높아요!' },
      { from: 'BrandB', rating: 4.5, comment: '소통이 빠르고 결과가 좋았습니다.' },
    ],
  },
  {
    id: '2',
    name: 'Mina',
    avatar: '/logo/인스타그램.svg',
    country: 'Thailand',
    follower: 35000,
    categories: ['패션', '뷰티'],
    campaigns: 12,
    rating: 4.9,
    bio: '트렌디한 패션과 뷰티 콘텐츠로 팔로워와 소통하는 크리에이터.',
    history: [{ title: '패션 브랜드 C', result: '판매 300건', year: 2024 }],
    reviews: [{ from: 'BrandC', rating: 5, comment: '팔로워 반응이 정말 좋아요.' }],
  },
  {
    id: '3',
    name: 'Somchai',
    avatar: '/logo/틱톡.svg',
    country: 'Thailand',
    follower: 8000,
    categories: ['푸드', '여행'],
    campaigns: 5,
    rating: 4.7,
    bio: '여행과 음식 리뷰를 전문으로 하는 태국 인플루언서.',
    history: [{ title: '푸드 브랜드 D', result: '클릭 1,500회', year: 2023 }],
    reviews: [{ from: 'BrandD', rating: 4.7, comment: '진정성 있는 리뷰 감사합니다.' }],
  },
];

// ✅ generateStaticParams: 각 인플루언서의 id를 포함한 params 리턴
export async function generateStaticParams(): Promise<{ params: { id: string } }[]> {
  return mockInfluencers.map((inf) => ({
    params: { id: inf.id },
  }));
}

// ✅ Page 컴포넌트: 타입 any로 선언 (빌드 에러 완전 해결)
export default function Page({ params }: any) {
  const influencer = mockInfluencers.find((inf) => inf.id === params.id);
  if (!influencer) return notFound();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0c23] to-[#181826] py-12 px-2">
      <div className="max-w-2xl mx-auto bg-white/90 rounded-3xl shadow-2xl border border-blue-900/30 p-8 flex flex-col items-center">
        <div className="w-full flex flex-col items-center mb-6">
          <img
            src={influencer.avatar}
            alt={influencer.name}
            className="w-28 h-28 rounded-full border-4 border-blue-200 shadow mb-3 bg-white object-contain"
          />
          <h2 className="text-3xl font-extrabold text-blue-700 mb-1">{influencer.name}</h2>
          <div className="text-blue-500 font-semibold mb-1">
            {influencer.country} · 팔로워 {influencer.follower.toLocaleString()}명
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {influencer.categories.map((cat) => (
              <span key={cat} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">#{cat}</span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-gray-700 mb-2">
            <span>캠페인 {influencer.campaigns}회</span>
            <span className="text-yellow-500">★ {influencer.rating}</span>
          </div>
          <p className="text-gray-600 text-center text-base mb-2 max-w-xl">{influencer.bio}</p>
        </div>

        <div className="w-full mt-2">
          <h3 className="text-lg font-bold text-blue-800 mb-2">캠페인 이력</h3>
          <ul className="space-y-2">
            {influencer.history.map((h, i) => (
              <li key={i} className="bg-blue-50 rounded-lg px-4 py-2 flex justify-between items-center shadow-sm">
                <span className="font-medium text-gray-800">{h.title}</span>
                <span className="text-sm text-gray-500">{h.result} · {h.year}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full mt-8">
          <h3 className="text-lg font-bold text-blue-800 mb-2">브랜드 리뷰</h3>
          <ul className="space-y-2">
            {influencer.reviews.map((r, i) => (
              <li key={i} className="bg-white rounded-lg px-4 py-3 shadow flex flex-col md:flex-row md:items-center md:justify-between border border-blue-50">
                <div className="font-semibold text-gray-700">{r.from}</div>
                <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">★ {r.rating}</div>
                <div className="text-gray-600 text-sm mt-1 md:mt-0">{r.comment}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
