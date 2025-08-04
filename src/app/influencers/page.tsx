import React from 'react';
import Link from 'next/link';

// 목업 인플루언서 데이터
type Influencer = {
  id: string;
  name: string;
  avatar: string;
  country: string;
  follower: number;
  categories: string[];
  campaigns: number;
  rating: number;
  bio: string;
};

const mockInfluencers: Influencer[] = [
  {
    id: '1',
    name: 'Nicha',
    avatar: '/logo/유튜브 쇼츠.svg',
    country: 'Thailand',
    follower: 12000,
    categories: ['뷰티', '라이프스타일'],
    campaigns: 8,
    rating: 4.8,
    bio: 'K-뷰티와 라이프스타일을 사랑하는 태국 인플루언서. 다양한 브랜드와 협업 경험 보유.'
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
    bio: '트렌디한 패션과 뷰티 콘텐츠로 팔로워와 소통하는 크리에이터.'
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
    bio: '여행과 음식 리뷰를 전문으로 하는 태국 인플루언서.'
  },
];

export default function InfluencersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#2563eb] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center drop-shadow-lg">인플루언서 리스트</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockInfluencers.map((inf) => (
            <div
              key={inf.id}
              className="bg-white/90 rounded-2xl shadow-xl p-6 flex flex-col items-center hover:scale-105 transition-transform duration-200 border border-blue-100"
            >
              <img
                src={inf.avatar}
                alt={inf.name}
                className="w-20 h-20 rounded-full border-4 border-blue-200 shadow mb-4 bg-white object-contain"
              />
              <div className="text-xl font-semibold text-gray-900 mb-1">{inf.name}</div>
              <div className="text-sm text-blue-700 font-medium mb-2">{inf.country} · 팔로워 {inf.follower.toLocaleString()}명</div>
              <div className="flex flex-wrap gap-2 mb-2">
                {inf.categories.map((cat) => (
                  <span key={cat} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                    #{cat}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                <span>캠페인 {inf.campaigns}회</span>
                <span className="text-yellow-500">★ {inf.rating}</span>
              </div>
              <p className="text-gray-600 text-center text-sm mb-3 line-clamp-2">{inf.bio}</p>
              <Link href={`/influencers/${inf.id}`} className="mt-auto w-full">
                <span className="block bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-lg shadow hover:from-blue-600 hover:to-blue-800 transition-colors font-bold text-center">
                  PR 페이지 보기
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 