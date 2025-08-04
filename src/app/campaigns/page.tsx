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
  discount: number; // 할인율
  description: string;
  rating: number; // 평점
  reviewCount: number; // 리뷰수
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
    <div className="min-h-screen bg-gray-50 py-10 px-2 md:px-0">
      <div className="max-w-7xl mx-auto">
        {/* 상단 타이틀 */}
        <div className="text-2xl font-bold text-gray-900 mb-6">검색결과</div>
        {/* 필터/정렬 바 */}
        <div className="flex flex-wrap gap-2 mb-6 items-center">
          {categories.map(cat => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full font-semibold border transition text-sm ${selectedCategory===cat ? 'bg-blue-600 text-white border-blue-400 shadow' : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50'}`}
              onClick={() => setSelectedCategory(cat)}
            >{cat}</button>
          ))}
          <select
            className="border rounded-full px-4 py-2 bg-white text-gray-700 font-semibold focus:ring-2 focus:ring-blue-400 text-sm ml-auto"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {/* 탭 */}
        <div className="flex gap-3 mb-8">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`px-5 py-2 rounded-full font-bold border transition text-sm ${selectedTab===tab ? 'bg-blue-600 text-white border-blue-400 shadow' : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50'}`}
              onClick={() => setSelectedTab(tab)}
            >{tab}</button>
          ))}
        </div>
        {/* 캠페인 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filtered.length === 0 ? (
            <div className="col-span-4 text-center text-gray-400 py-20">조건에 맞는 캠페인이 없습니다.</div>
          ) : (
            filtered.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition cursor-pointer flex flex-col text-gray-900 relative group overflow-hidden">
                <Link href={`/campaigns/${c.id}`} className="block">
                  <Image src={c.image} alt={c.title} width={400} height={192} className="w-full h-44 object-cover rounded-t-2xl" />
                </Link>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500 font-semibold">{c.brand}</span>
                    <button onClick={()=>handleLike(c.id)} className="ml-2">
                      {c.liked ? (
                        <svg width="22" height="22" fill="#ec4899" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                      ) : (
                        <svg width="22" height="22" fill="none" stroke="#ec4899" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                      )}
                    </button>
                  </div>
                  <div className="flex items-end gap-2 mb-1">
                    {c.discount > 0 && <span className="text-pink-600 font-bold text-base">{c.discount}%</span>}
                    <span className="text-teal-700 font-bold text-lg">{c.price.toLocaleString()}원</span>
                  </div>
                  <div className="font-bold text-base mb-1 line-clamp-2 min-h-[2.5rem]">{c.title}</div>
                  <div className="text-xs text-gray-500 mb-2 line-clamp-2">{c.description}</div>
                  <div className="flex items-center gap-2 mt-auto">
                    <span className="text-xs bg-blue-50 text-blue-600 rounded-full px-2 py-1">{c.category}</span>
                    <span className="text-xs text-gray-400">{c.participants}명 참여</span>
                    <span className="flex items-center text-xs text-yellow-500 ml-auto">
                      <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                      {c.rating} ({c.reviewCount})
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ml-2 ${c.status === "진행중" ? "bg-green-100 text-green-600 border border-green-300" : "bg-gray-200 text-gray-500 border border-gray-300"}`}>{c.status}</span>
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
