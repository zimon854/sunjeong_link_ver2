'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import AdaptiveLayout from '@/components/AdaptiveLayout';

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

interface InfluencerDetailClientProps {
  influencer: Influencer;
}

export default function InfluencerDetailClient({ influencer }: InfluencerDetailClientProps) {
  const [activeTab, setActiveTab] = useState('bio');

  const tabs = [
    { id: 'bio', label: '소개' },
    { id: 'history', label: '캠페인 이력' },
    { id: 'reviews', label: '브랜드 리뷰' },
  ];

  return (
    <AdaptiveLayout title={influencer.name} showBackButton={true}>
      <div className="w-full max-w-4xl mx-auto text-white">
        {/* 프로필 헤더 */}
        <div className="bg-gradient-to-br from-[#1e293b] to-[#121826] rounded-3xl p-8 mb-8 shadow-2xl border border-blue-500/20 flex flex-col md:flex-row items-center gap-8">
          <div className="relative flex-shrink-0">
            <Image
              src={influencer.avatar}
              alt={influencer.name}
              width={128}
              height={128}
              className="w-32 h-32 rounded-full border-4 border-blue-500/60 object-cover shadow-lg"
            />
            {influencer.isOnline && <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-400 rounded-full border-2 border-[#1e293b] animate-pulse" title="온라인"></div>}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">{influencer.name}</h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-blue-300/80 mb-4">
              <Image src={`https://flagcdn.com/w20/${influencer.countryCode}.png`} alt={influencer.country} width={20} height={15} />
              <span>{influencer.country}</span>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-5">
              {influencer.categories.map((cat) => (
                <span key={cat} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">#{cat}</span>
              ))}
            </div>
            <div className="flex items-center justify-center md:justify-start gap-6 text-center">
              <div>
                <div className="font-extrabold text-2xl">{influencer.follower.toLocaleString()}</div>
                <div className="text-sm text-blue-300/60">팔로워</div>
              </div>
              <div>
                <div className="font-extrabold text-2xl">{influencer.campaigns}</div>
                <div className="text-sm text-blue-300/60">캠페인</div>
              </div>
              <div>
                <div className="font-extrabold text-2xl flex items-center gap-1">★ {influencer.rating}</div>
                <div className="text-sm text-blue-300/60">평점</div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-auto flex flex-col gap-3 mt-6 md:mt-0 md:ml-auto">
            <button className="w-full text-center bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg">메시지 보내기</button>
            <button className="w-full text-center bg-transparent border-2 border-blue-500 text-blue-300 font-bold py-3 px-6 rounded-lg hover:bg-blue-500/20 transition-all duration-200">협업 제안하기</button>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="mb-8 bg-black/20 p-2 rounded-xl flex justify-center gap-2">
          {tabs.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-blue-300/70 hover:bg-white/10'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        <div className="bg-[#181830]/90 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-blue-500/20 min-h-[300px]">
          {activeTab === 'bio' && (
            <div>
              <h3 className="text-2xl font-bold mb-4">소개</h3>
              <p className="text-blue-200/90 leading-relaxed whitespace-pre-line">{influencer.bio}</p>
            </div>
          )}
          {activeTab === 'history' && (
            <div>
              <h3 className="text-2xl font-bold mb-4">캠페인 이력</h3>
              <ul className="space-y-4">
                {influencer.history.map((h, i) => (
                  <li key={i} className="bg-blue-950/40 rounded-xl p-4 flex justify-between items-center transition hover:bg-blue-950/70">
                    <div>
                      <p className="font-semibold text-blue-200/90">{h.title}</p>
                      <p className="text-sm text-green-400">결과: {h.result}</p>
                    </div>
                    <span className="text-sm text-blue-300/60 font-medium">{h.year}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div>
              <h3 className="text-2xl font-bold mb-4">브랜드 리뷰</h3>
              <ul className="space-y-4">
                {influencer.reviews.map((r, i) => (
                  <li key={i} className="bg-blue-950/40 rounded-xl p-4 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-blue-200/90">{r.from}</p>
                      <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">{'★'.repeat(Math.floor(r.rating))}{r.rating % 1 !== 0 ? '☆' : ''} {r.rating}</div>
                    </div>
                    <p className="text-blue-300/80 text-sm italic">"{r.comment}"</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </AdaptiveLayout>
  );
}
