"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Campaign {
  id: number;
  title: string;
  brand: string;
  image: string;
  price: number;
  participants: number;
  liked: boolean;
  status: string;
  category: string;
  mine?: boolean; // 내 캠페인 여부(더미)
}

const initialCampaigns: Campaign[] = [
  {
    id: 1,
    title: "비건 뷰티 마스크팩 공동구매",
    brand: "그린코스",
    image: "/campaign_sample/sample1.jpeg",
    price: 12000,
    participants: 57,
    liked: true,
    status: "진행중",
    category: "뷰티",
    mine: true,
  },
  {
    id: 2,
    title: "친환경 주방세제 런칭 캠페인",
    brand: "에코홈",
    image: "/campaign_sample/sample2.jpeg",
    price: 8900,
    participants: 34,
    liked: false,
    status: "진행중",
    category: "라이프",
    mine: false,
  },
  {
    id: 3,
    title: "프리미엄 헤어오일 체험단",
    brand: "뷰티랩",
    image: "/campaign_sample/sample3.jpeg",
    price: 15000,
    participants: 21,
    liked: false,
    status: "종료",
    category: "뷰티",
    mine: false,
  },
  {
    id: 4,
    title: "비타민C 앰플 공동구매",
    brand: "헬씨코스",
    image: "/campaign_sample/sample4.jpeg",
    price: 9900,
    participants: 42,
    liked: true,
    status: "진행중",
    category: "푸드",
    mine: false,
  },
  // ... 더미 데이터 추가 가능 ...
];

const categories = ["전체", "뷰티", "라이프", "푸드", "패션"];
const statuses = ["전체", "진행중", "종료"];
const tabs = ["전체", "진행중", "종료", "내 캠페인"];
const sortOptions = [
  { value: "recommend", label: "추천순" },
  { value: "latest", label: "최신순" },
  { value: "participants", label: "참여자 많은순" },
];

export default function CampaignListPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [selectedTab, setSelectedTab] = useState("전체");
  const [sort, setSort] = useState("recommend");

  // 좋아요 토글
  const handleLike = (id: number) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, liked: !c.liked } : c));
  };

  // 필터링
  let filtered = campaigns;
  if (selectedCategory !== "전체") {
    filtered = filtered.filter(c => c.category === selectedCategory);
  }
  if (selectedStatus !== "전체") {
    filtered = filtered.filter(c => c.status === selectedStatus);
  }
  if (selectedTab === "진행중" || selectedTab === "종료") {
    filtered = filtered.filter(c => c.status === selectedTab);
  } else if (selectedTab === "내 캠페인") {
    filtered = filtered.filter(c => c.mine);
  }

  // 정렬
  if (sort === "latest") {
    filtered = [...filtered].sort((a, b) => b.id - a.id);
  } else if (sort === "participants") {
    filtered = [...filtered].sort((a, b) => b.participants - a.participants);
  } // 추천순은 기본(변경 없음)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0c23] to-[#181826] py-10 px-2 md:px-0">
      <div className="max-w-6xl mx-auto">
        {/* 상단 타이틀 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">캠페인 리스트</h1>
          <p className="text-blue-200 text-lg md:text-xl">브랜드와 인플루언서가 함께하는 다양한 캠페인을 만나보세요!</p>
        </div>
        {/* 필터/정렬 바 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 bg-white/10 backdrop-blur rounded-xl p-4 shadow border border-blue-900/30">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full font-semibold transition border-2 ${selectedCategory===cat ? 'bg-blue-600 text-white border-blue-400 shadow' : 'bg-transparent text-blue-200 border-blue-800 hover:bg-blue-900/40'}`}
                onClick={() => setSelectedCategory(cat)}
              >{cat}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {statuses.map(st => (
              <button
                key={st}
                className={`px-4 py-2 rounded-full font-semibold transition border-2 ${selectedStatus===st ? 'bg-pink-600 text-white border-pink-400 shadow' : 'bg-transparent text-pink-200 border-pink-800 hover:bg-pink-900/40'}`}
                onClick={() => setSelectedStatus(st)}
              >{st}</button>
            ))}
          </div>
          <select
            className="border rounded-full px-4 py-2 bg-blue-950/60 text-blue-100 font-semibold focus:ring-2 focus:ring-blue-400"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {/* 탭 */}
        <div className="flex gap-4 mb-8 justify-center">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`px-5 py-2 rounded-full font-bold transition border-2 ${selectedTab===tab ? 'bg-gradient-to-r from-blue-500 to-pink-500 text-white border-blue-300 shadow-lg' : 'bg-transparent text-blue-200 border-blue-800 hover:bg-blue-900/40'}`}
              onClick={() => setSelectedTab(tab)}
            >{tab}</button>
          ))}
        </div>
        {/* 캠페인 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filtered.length === 0 ? (
            <div className="col-span-4 text-center text-blue-200 py-20">조건에 맞는 캠페인이 없습니다.</div>
          ) : (
            filtered.map((c) => (
              <div key={c.id} className="bg-gradient-to-br from-[#1a237e]/80 to-[#0a0c23]/90 rounded-2xl shadow-2xl border border-blue-900/30 hover:scale-[1.03] transition cursor-pointer flex flex-col">
                <Link href={`/campaigns/${c.id}`} className="block">
                  <Image src={c.image} alt={c.title} width={400} height={192} className="w-full h-48 object-cover rounded-t-2xl" />
                </Link>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="text-xs text-blue-200 mb-1 font-semibold">{c.brand}</div>
                  <div className="font-bold text-lg text-white mb-2 line-clamp-2 min-h-[2.5rem]">{c.title}</div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-pink-400 font-bold text-base">{c.price.toLocaleString()}원</span>
                    <span className="text-xs text-blue-100">{c.participants}명 참여</span>
                  </div>
                  <div className="flex items-center gap-2 mt-auto">
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${c.status === "진행중" ? "bg-green-500/20 text-green-300 border border-green-400" : "bg-gray-700/40 text-gray-300 border border-gray-500"}`}>{c.status}</span>
                    <span className="text-xs px-2 py-1 rounded-full font-bold bg-blue-900/40 text-blue-200 border border-blue-700">{c.category}</span>
                    <button onClick={()=>handleLike(c.id)} className="ml-auto">
                      {c.liked ? (
                        <svg width="22" height="22" fill="#ec4899" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                      ) : (
                        <svg width="22" height="22" fill="none" stroke="#ec4899" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
