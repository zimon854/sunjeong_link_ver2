'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Campaign {
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

const initialCampaigns: Campaign[] = [
  {
    id: 1,
    title: "비건 뷰티 마스크팩 공동구매",
    brand: "그린코스",
    image: "/campaign_sample/sample1.jpeg",
    price: 34000,
    discount: 11,
    description: "맑고 뽀얀 피부를 위해, 짜서쓰는 백담고",
    rating: 3.8,
    reviewCount: 7,
    participants: 57,
    liked: true,
    status: "진행중",
    category: "뷰티",
    mine: true,
  },
  {
    id: 2,
    title: "가방에서 립스틱 찾지 마세요!",
    brand: "yyeon",
    image: "/campaign_sample/sample2.jpeg",
    price: 135000,
    discount: 34,
    description: "더 이상 가방에서 립스틱 찾지 마세요. [가방+파우치]",
    rating: 4.5,
    reviewCount: 3,
    participants: 34,
    liked: false,
    status: "진행중",
    category: "패션",
    mine: false,
  },
  {
    id: 3,
    title: "피부 노화의 원인, 줄어드는 EGF는 이렇게 채우는 것입니다.",
    brand: "스킨케어",
    image: "/campaign_sample/sample3.jpeg",
    price: 48900,
    discount: 25,
    description: "[크림]피부 노화의 원인, 줄어드는 'EGF'는 이렇게 채우는 것입니다.",
    rating: 4.7,
    reviewCount: 19,
    participants: 21,
    liked: false,
    status: "종료",
    category: "뷰티",
    mine: false,
  },
  {
    id: 4,
    title: "노벨상 받은 바로 그 EGF, 메디비티 노벨상 앰플",
    brand: "다이애저스메디(주)",
    image: "/campaign_sample/sample4.jpeg",
    price: 49000,
    discount: 0,
    description: "[앰플] 노벨상 받은 바로 그 EGF, 메디비티 노벨상 앰플",
    rating: 4.6,
    reviewCount: 21,
    participants: 42,
    liked: true,
    status: "진행중",
    category: "뷰티",
    mine: false,
  },
];

const categories = ["전체", "뷰티", "라이프", "푸드", "패션"];
const sortOptions = [
  { value: "recommend", label: "추천순" },
  { value: "latest", label: "최신순" },
  { value: "participants", label: "참여자 많은순" },
];

export default function CampaignListPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [sort, setSort] = useState("recommend");

  const handleLike = (id: number) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, liked: !c.liked } : c));
  };

  let filtered = campaigns;
  if (selectedCategory !== "전체") {
    filtered = filtered.filter(c => c.category === selectedCategory);
  }

  if (sort === "latest") {
    filtered = [...filtered].sort((a, b) => b.id - a.id);
  } else if (sort === "participants") {
    filtered = [...filtered].sort((a, b) => b.participants - a.participants);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#2563eb] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">모든 캠페인</h1>
          <p className="text-lg text-blue-200/80">당신에게 맞는 캠페인을 발견하고 참여해보세요.</p>
        </div>

        <div className="bg-[#181830]/80 backdrop-blur-md rounded-2xl p-6 mb-10 shadow-2xl border border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap gap-3 items-center">
            {categories.map(cat => (
              <button
                key={cat}
                className={`px-5 py-2 rounded-full font-bold border-2 transition-all duration-200 text-sm ${selectedCategory === cat ? 'bg-blue-500 text-white border-blue-500 scale-105 shadow-lg' : 'bg-transparent text-blue-200 border-blue-700 hover:bg-blue-800/60 hover:border-blue-600'}`}
                onClick={() => setSelectedCategory(cat)}
              >{cat}</button>
            ))}
          </div>
          <div className="w-full md:w-auto">
            <select
              className="w-full md:w-auto border-2 border-blue-700 rounded-full px-4 py-2 bg-transparent text-blue-200 font-semibold focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm appearance-none"
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-blue-900">{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center text-blue-300/70 py-24">
              <p className="text-3xl mb-4">😢</p>
              <p className="text-xl">아쉽지만, 조건에 맞는 캠페인이 없네요.</p>
            </div>
          ) : (
            filtered.map((c) => (
              <div key={c.id} className="bg-gradient-to-br from-[#1e293b] to-[#121826] rounded-2xl shadow-2xl border border-blue-500/20 hover:border-blue-400/70 transition-all duration-300 flex flex-col text-white group transform hover:-translate-y-2 hover:shadow-blue-500/20">
                <div className="relative">
                  <Link href={`/campaigns/${c.id}`} className="block h-52 overflow-hidden rounded-t-2xl">
                    <Image src={c.image} alt={c.title} width={400} height={225} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </Link>
                  <button onClick={() => handleLike(c.id)} className="absolute top-4 right-4 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-pink-500/80 transition-colors duration-200 z-10">
                    <svg width="20" height="20" fill={c.liked ? '#ec4899' : '#ffffff'} viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  </button>
                  <div className={`absolute top-4 left-4 text-xs px-3 py-1 rounded-full font-bold ${c.status === "진행중" ? "bg-green-500/80 text-white border border-green-400/50" : "bg-gray-500/80 text-white border border-gray-400/50"}`}>{c.status}</div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <span className="text-sm text-blue-300/80 font-semibold mb-1">{c.brand}</span>
                  <h3 className="font-bold text-xl mb-3 line-clamp-2 min-h-[3.5rem]">{c.title}</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    {c.discount > 0 && <span className="text-pink-400 font-extrabold text-2xl">{c.discount}%</span>}
                    <span className="text-white font-bold text-3xl">{c.price.toLocaleString()}</span>
                    <span className="text-lg font-medium">원</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-blue-300/70 mt-auto pt-4 border-t border-blue-800/50">
                    <span><span className="font-bold">{c.participants}</span>명 참여중</span>
                    <span className="flex items-center gap-1">
                      <svg width="16" height="16" fill="#fbbf24" viewBox="0 0 20 20" className="-mt-0.5"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                      <span className="font-bold">{c.rating}</span>
                      <span>({c.reviewCount})</span>
                    </span>
                  </div>
                  <Link href={`/campaigns/${c.id}`} className="mt-5 w-full block text-center bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/40 transform hover:scale-105 active:scale-100">
                    상세보기
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
