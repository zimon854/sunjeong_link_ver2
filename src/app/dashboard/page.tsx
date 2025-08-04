"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

// --- 더미 데이터 (생략: 기존과 동일) ---
const user = {
  name: "홍길동",
  email: "hong@brand.com",
  type: "브랜드",
  profileImg: "/sunjeong_link_logo.png",
};
const myCampaigns = [
  { id: 1, title: "비건 뷰티 마스크팩 공동구매", status: "진행중" },
  { id: 2, title: "프리미엄 헤어오일 체험단", status: "종료" },
];
const joinedCampaigns = [
  { id: 3, title: "친환경 주방세제 런칭 캠페인", status: "진행중" },
];
const notifications = [
  { id: 1, text: "[알림] 캠페인 '비건 뷰티 마스크팩'이 승인되었습니다.", date: "2024-06-01" },
  { id: 2, text: "[알림] 새로운 메시지가 도착했습니다.", date: "2024-06-02" },
];
const messages = [
  { id: 1, from: "인플루언서A", text: "참여 문의드립니다!", date: "2024-06-02" },
];
// --- 성과 대시보드용 더미 데이터 ---
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomFloat(min: number, max: number, fixed = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(fixed));
}
const periodOptions = [
  { value: 'today', label: '오늘' },
  { value: 'week', label: '이번주' },
  { value: 'month', label: '이번달' },
];
const dummyCampaigns = [
  {
    id: 1,
    title: '비건 뷰티 마스크팩',
    status: '진행중',
    participants: randomInt(50, 200),
    sales: randomInt(1000000, 5000000),
    clicks: randomInt(500, 2000),
    conversion: randomFloat(2, 10),
  },
  {
    id: 2,
    title: '프리미엄 헤어오일',
    status: '종료',
    participants: randomInt(20, 100),
    sales: randomInt(500000, 2000000),
    clicks: randomInt(200, 1000),
    conversion: randomFloat(1, 8),
  },
  {
    id: 3,
    title: '친환경 주방세제',
    status: '진행중',
    participants: randomInt(30, 150),
    sales: randomInt(800000, 3000000),
    clicks: randomInt(300, 1500),
    conversion: randomFloat(2, 12),
  },
];
const trendLabels = Array.from({ length: 7 }, (_, i) => `${i + 1}일`);
const trendData = {
  sales: Array.from({ length: 7 }, () => randomInt(500000, 2000000)),
  participants: Array.from({ length: 7 }, () => randomInt(10, 80)),
  clicks: Array.from({ length: 7 }, () => randomInt(100, 500)),
};

// --- 추가 더미 데이터 (PRD 기반) ---
const dummyPerformance = [
  {
    campaign: '비건 뷰티 마스크팩',
    clicks: 1800,
    conversions: 120,
    sales: 3200000,
    roi: 2.1,
    influencers: 5,
    contents: 7,
    reviews: [
      { from: 'Mina', rating: 5, comment: '협업이 원활하고 결과가 좋아요!' },
      { from: 'Somchai', rating: 4.5, comment: '피드백이 빨라서 좋았습니다.' },
    ],
  },
  {
    campaign: '프리미엄 헤어오일',
    clicks: 950,
    conversions: 60,
    sales: 1700000,
    roi: 1.7,
    influencers: 3,
    contents: 4,
    reviews: [
      { from: 'Nicha', rating: 4.8, comment: '팔로워 반응이 좋았어요.' },
    ],
  },
  {
    campaign: '친환경 주방세제',
    clicks: 1200,
    conversions: 80,
    sales: 2100000,
    roi: 1.9,
    influencers: 4,
    contents: 5,
    reviews: [
      { from: 'Mina', rating: 5, comment: '지속적으로 판매가 일어나요.' },
    ],
  },
];
const dummyInfluencers = [
  {
    name: 'Mina',
    campaigns: 2,
    totalSales: 3500000,
    avgConversion: 5.2,
    avgRating: 4.9,
  },
  {
    name: 'Nicha',
    campaigns: 1,
    totalSales: 1700000,
    avgConversion: 6.1,
    avgRating: 4.8,
  },
  {
    name: 'Somchai',
    campaigns: 1,
    totalSales: 2100000,
    avgConversion: 6.7,
    avgRating: 4.7,
  },
];
const dummyAI = {
  bottleneck: '전환율이 2~3일차에 급감, 콘텐츠 포맷 다양화 필요',
  suggestion: '짧은 릴스/숏폼 영상 활용, 인플루언서별 맞춤 피드백 제공',
  reorder: 'ROI 1.8 이상 캠페인은 리오더 추천',
};
// --- 기존 KPI 집계 확장 ---
const totalSales = dummyCampaigns.reduce((sum, c) => sum + c.sales, 0);
const totalParticipants = dummyCampaigns.reduce((sum, c) => sum + c.participants, 0);
const totalClicks = dummyCampaigns.reduce((sum, c) => sum + c.clicks, 0);
const totalConversions = dummyPerformance.reduce((sum, c) => sum + c.conversions, 0);
const totalROI = dummyPerformance.reduce((sum, c) => sum + c.roi, 0);
const totalCampaigns = dummyPerformance.length;
const totalInfluencers = dummyInfluencers.length;
const totalContents = dummyPerformance.reduce((sum, c) => sum + c.contents, 0);
const avgConversion = dummyCampaigns.length ? (
  dummyCampaigns.reduce((sum, c) => sum + c.conversion, 0) / dummyCampaigns.length
) : 0;
const avgROI = totalCampaigns ? (totalROI / totalCampaigns) : 0;

// --- 그래프용 더미 데이터 ---
const salesTrend = [320000, 410000, 380000, 500000, 470000, 530000, 600000];
const clicksTrend = [200, 350, 300, 400, 380, 420, 500];
const conversionTrend = [3.2, 4.1, 3.8, 5.0, 4.7, 5.3, 6.0];

// --- 그래프 통계 계산 함수 ---
function getStats(arr: number[]) {
  const sum = arr.reduce((a, b) => a + b, 0);
  const avg = arr.length ? sum / arr.length : 0;
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const last = arr[arr.length - 1];
  const prev = arr.length > 1 ? arr[arr.length - 2] : last;
  const diff = last - prev;
  const diffRate = prev ? (diff / prev) * 100 : 0;
  return { sum, avg, min, max, last, diff, diffRate };
}
const salesStats = getStats(salesTrend);
const clicksStats = getStats(clicksTrend);
const convStats = getStats(conversionTrend);

// 클릭수 그래프 y축 스케일링 함수
function getYClick(v: number) {
  const minY = 20, maxY = 90;
  const min = clicksStats.min, max = clicksStats.max;
  if (max === min) return (minY + maxY) / 2;
  // 값이 클수록 y가 작아야 위로 올라감
  return maxY - ((v - min) / (max - min)) * (maxY - minY);
}

export default function DashboardPage() {
  const [mainTab, setMainTab] = useState<'service'|'analytics'>('service');
  const [tab, setTab] = useState<'my'|'joined'>('my');
  const [period, setPeriod] = useState('today');
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        fetchProfile(data.user.id);
      }
    });
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (!error && data) setProfile(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#2563eb] flex flex-col md:flex-row">
      {/* 좌측 사이드바 - 데스크톱에서만 표시 */}
      <aside className="hidden md:flex md:w-64 w-full md:h-auto h-20 md:rounded-tr-3xl md:rounded-br-3xl bg-white/20 backdrop-blur-md shadow-2xl border-r border-blue-100 flex-col items-center py-8 md:py-12 mb-6 md:mb-0">
        <h2 className="text-white font-bold text-xl mb-8 drop-shadow">내 대시보드</h2>
        <ul className="space-y-4 w-full text-center">
          <li>
            <button 
              className={mainTab==='service' ? 'font-bold text-blue-700 bg-white/80 rounded-xl px-4 py-2 shadow' : 'text-white/80 hover:bg-blue-100/30 rounded-xl px-4 py-2'} 
              onClick={()=>setMainTab('service')}
            >
              대시보드 홈
            </button>
          </li>
          <li>
            <button 
              className={mainTab==='analytics' ? 'font-bold text-blue-700 bg-white/80 rounded-xl px-4 py-2 shadow' : 'text-white/80 hover:bg-blue-100/30 rounded-xl px-4 py-2'} 
              onClick={()=>setMainTab('analytics')}
            >
              성과 대시보드
            </button>
          </li>
          <li>
            <Link href="/profile" className="text-white/80 hover:text-blue-200 block py-2">
              내 프로필
            </Link>
          </li>
          <li>
            <Link href="/campaigns" className="text-white/80 hover:text-blue-200 block py-2">
              캠페인 관리
            </Link>
          </li>
          <li>
            <Link href="/chat" className="text-white/80 hover:text-blue-200 block py-2">
              메시지
            </Link>
          </li>
        </ul>
      </aside>
      <main className="flex-1 p-4 md:p-12 bg-transparent">
        {/* 모바일 상단 탭 UI */}
        <div className="md:hidden flex gap-2 mb-6">
          <button 
            onClick={()=>setMainTab('service')} 
            className={mainTab==='service' ? 'font-bold bg-white/80 text-blue-700 rounded-xl px-4 py-2 shadow text-sm' : 'text-white/80 hover:bg-blue-100/30 rounded-xl px-4 py-2 text-sm'}
          >
            내 서비스
          </button>
          <button 
            onClick={()=>setMainTab('analytics')} 
            className={mainTab==='analytics' ? 'font-bold bg-white/80 text-blue-700 rounded-xl px-4 py-2 shadow text-sm' : 'text-white/80 hover:bg-blue-100/30 rounded-xl px-4 py-2 text-sm'}
          >
            성과 대시보드
          </button>
        </div>
        
        {/* 데스크톱 상단 탭 UI */}
        <div className="hidden md:flex gap-4 mb-8">
          <button 
            onClick={()=>setMainTab('service')} 
            className={mainTab==='service' ? 'font-bold bg-white/80 text-blue-700 rounded-xl px-6 py-2 shadow' : 'text-white/80 hover:bg-blue-100/30 rounded-xl px-6 py-2'}
          >
            내 서비스
          </button>
          <button 
            onClick={()=>setMainTab('analytics')} 
            className={mainTab==='analytics' ? 'font-bold bg-white/80 text-blue-700 rounded-xl px-6 py-2 shadow' : 'text-white/80 hover:bg-blue-100/30 rounded-xl px-6 py-2'}
          >
            성과 대시보드
          </button>
        </div>
        
        {/* 내 서비스 탭 */}
        {mainTab === 'service' && (
          <>
            {/* 상단 사용자 정보 */}
            {!user ? (
              <div className="text-center text-white/60 py-12">로그인이 필요합니다.</div>
            ) : (
              <div className="bg-white/90 rounded-2xl shadow-xl p-6 md:p-8 flex items-center gap-4 md:gap-6 mb-8 border border-blue-100">
                <img 
                  src={profile?.image ? supabase.storage.from('profiles').getPublicUrl(profile.image).data.publicUrl : '/logo/sunjeong_link_logo.png'} 
                  alt="프로필" 
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-blue-200 shadow bg-white object-contain p-2"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-lg md:text-xl font-bold text-gray-900 truncate">
                    {profile?.name || user.email}
                  </div>
                  <div className="text-sm md:text-base text-blue-700 truncate">
                    {user.email}
                  </div>
                  <div className="text-sm text-blue-600">
                    ({profile?.role || '미설정'})
                  </div>
                </div>
              </div>
            )}
            {/* 주요 메뉴 카드 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
              <Link href="/campaigns/new">
                <div className="bg-white/90 rounded-2xl shadow-xl p-4 md:p-6 flex flex-col items-center hover:scale-105 transition cursor-pointer border border-blue-100">
                  <div className="font-bold text-blue-900 text-sm md:text-base text-center">캠페인 생성</div>
                </div>
              </Link>
              <Link href="/campaigns">
                <div className="bg-white/90 rounded-2xl shadow-xl p-4 md:p-6 flex flex-col items-center hover:scale-105 transition cursor-pointer border border-blue-100">
                  <div className="font-bold text-blue-900 text-sm md:text-base text-center">캠페인 목록</div>
                </div>
              </Link>
              <Link href="/chat">
                <div className="bg-white/90 rounded-2xl shadow-xl p-4 md:p-6 flex flex-col items-center hover:scale-105 transition cursor-pointer border border-blue-100">
                  <div className="font-bold text-blue-900 text-sm md:text-base text-center">메시지</div>
                </div>
              </Link>
              <Link href="/profile">
                <div className="bg-white/90 rounded-2xl shadow-xl p-4 md:p-6 flex flex-col items-center hover:scale-105 transition cursor-pointer border border-blue-100">
                  <div className="font-bold text-blue-900 text-sm md:text-base text-center">내 프로필</div>
                </div>
              </Link>
            </div>
            {/* 내 캠페인/참여 캠페인 탭 */}
            <div className="mb-8">
              <div className="flex gap-4 mb-4">
                <button onClick={()=>setTab('my')} className={tab==='my' ? 'font-bold text-blue-700 border-b-2 border-blue-500' : 'text-white/80'}>내가 만든 캠페인</button>
                <button onClick={()=>setTab('joined')} className={tab==='joined' ? 'font-bold text-blue-700 border-b-2 border-blue-500' : 'text-white/80'}>참여한 캠페인</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(tab==='my'?myCampaigns:joinedCampaigns).length === 0 ? (
                  <div className="col-span-2 text-white/60 py-8 text-center">캠페인이 없습니다.</div>
                ) : (
                  (tab==='my'?myCampaigns:joinedCampaigns).map(c => (
                    <Link href={`/campaigns/${c.id}`} key={c.id}>
                      <div className="bg-white/90 rounded-2xl shadow-xl p-4 hover:scale-105 transition cursor-pointer flex items-center gap-4 border border-blue-100">
                        <div className={`text-xs px-2 py-1 rounded ${c.status==='진행중'?'bg-green-100 text-green-700':'bg-gray-200 text-gray-500'}`}>{c.status}</div>
                        <div className="font-semibold ml-2 text-blue-900 text-sm md:text-base">{c.title}</div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
            {/* 최근 알림/메시지 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-white/90 rounded-2xl shadow-xl p-4 md:p-6 border border-blue-100">
                <div className="font-bold text-blue-900 mb-2 text-sm md:text-base">최근 알림</div>
                {notifications.length === 0 ? (
                  <div className="text-white/60 text-sm">알림이 없습니다.</div>
                ) : notifications.map(n => (
                  <div key={n.id} className="text-xs md:text-sm mb-1 flex justify-between items-center">
                    <span className="text-blue-900 flex-1 mr-2">{n.text}</span>
                    <span className="text-xs text-blue-400 whitespace-nowrap">{n.date}</span>
                  </div>
                ))}
              </div>
              <div className="bg-white/90 rounded-2xl shadow-xl p-4 md:p-6 border border-blue-100">
                <div className="font-bold text-blue-900 mb-2 text-sm md:text-base">최근 메시지</div>
                {messages.length === 0 ? (
                  <div className="text-white/60 text-sm">메시지가 없습니다.</div>
                ) : messages.map(m => (
                  <div key={m.id} className="text-xs md:text-sm mb-1 flex justify-between items-center">
                    <span className="text-blue-900 flex-1 mr-2"><span className="font-semibold">{m.from}</span>: {m.text}</span>
                    <span className="text-xs text-blue-400 whitespace-nowrap">{m.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {/* 성과 대시보드 탭 */}
        {mainTab === 'analytics' && (
          <>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 drop-shadow">실시간 성과 대시보드</h1>
            {/* 기간 필터 */}
            <div className="flex justify-end mb-6">
              <select
                className="border rounded px-3 py-2 bg-white/80 text-blue-900 text-base md:text-lg font-semibold"
                value={period}
                onChange={e => setPeriod(e.target.value)}
              >
                {periodOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            {/* KPI 카드 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
              <div className="bg-white/90 rounded-2xl shadow-xl p-4 md:p-6 flex flex-col items-center border border-blue-100">
                <div className="text-blue-700 mb-1 text-sm md:text-base">총 매출</div>
                <div className="text-lg md:text-2xl font-bold text-pink-600">{totalSales.toLocaleString()}원</div>
              </div>
              <div className="bg-white/90 rounded-2xl shadow-xl p-4 md:p-6 flex flex-col items-center border border-blue-100">
                <div className="text-blue-700 mb-1 text-sm md:text-base">클릭수</div>
                <div className="text-lg md:text-2xl font-bold text-blue-600">{totalClicks.toLocaleString()}회</div>
              </div>
              <div className="bg-white/90 rounded-2xl shadow-xl p-4 md:p-6 flex flex-col items-center border border-blue-100">
                <div className="text-blue-700 mb-1 text-sm md:text-base">전환수</div>
                <div className="text-lg md:text-2xl font-bold text-green-600">{totalConversions.toLocaleString()}건</div>
              </div>
              <div className="bg-white/90 rounded-2xl shadow-xl p-4 md:p-6 flex flex-col items-center border border-blue-100">
                <div className="text-blue-700 mb-1 text-sm md:text-base">평균 ROI</div>
                <div className="text-lg md:text-2xl font-bold text-purple-600">{avgROI.toFixed(2)}</div>
              </div>
              <div className="bg-white/90 rounded-2xl shadow-xl p-4 md:p-6 flex flex-col items-center border border-blue-100">
                <div className="text-blue-700 mb-1 text-sm md:text-base">캠페인 수</div>
                <div className="text-lg md:text-2xl font-bold text-blue-900">{totalCampaigns}개</div>
              </div>
              <div className="bg-white/90 rounded-2xl shadow-xl p-4 md:p-6 flex flex-col items-center border border-blue-100">
                <div className="text-blue-700 mb-1 text-sm md:text-base">인플루언서 수</div>
                <div className="text-lg md:text-2xl font-bold text-blue-900">{totalInfluencers}명</div>
              </div>
              <div className="bg-white/90 rounded-2xl shadow-xl p-4 md:p-6 flex flex-col items-center border border-blue-100">
                <div className="text-blue-700 mb-1 text-sm md:text-base">콘텐츠 수</div>
                <div className="text-lg md:text-2xl font-bold text-blue-900">{totalContents}개</div>
              </div>
            </div>
            {/* 그래프 카드 3개 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* 매출 추이 그래프 */}
              <div className="bg-white/90 rounded-2xl shadow-xl px-4 pt-3 pb-2 border border-blue-100 flex flex-col min-h-[220px]">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-bold text-blue-900 text-base md:text-xl">최근 7일 매출 추이</div>
                  <div className="text-xs text-gray-500">단위: 원</div>
                </div>
                <div className="flex justify-between w-full px-1">
                  <span className="text-xs text-blue-700">최소 {salesStats.min.toLocaleString()}원</span>
                  <span className="text-xs text-blue-700">최대 {salesStats.max.toLocaleString()}원</span>
                </div>
                <svg width="100%" height="110" viewBox="0 0 340 110" className="block">
                  <polyline
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="4"
                    points={salesTrend.map((v, i) => `${40 + i * 45},${90 - (v - 300000) / 4000}`).join(' ')}
                  />
                  {salesTrend.map((v, i) => (
                    <circle key={i} cx={40 + i * 45} cy={90 - (v - 300000) / 4000} r={i === salesTrend.length - 1 ? 7 : 5} fill={i === salesTrend.length - 1 ? '#f472b6' : '#2563eb'}>
                      <title>{`${trendLabels[i]}: ${v.toLocaleString()}원`}</title>
                    </circle>
                  ))}
                  {trendLabels.map((label, i) => (
                    <text key={label} x={40 + i * 45} y={105} fontSize="13" fontWeight="bold" textAnchor="middle" fill="#2563eb">{label}</text>
                  ))}
                </svg>
                <div className="flex justify-between text-xs text-blue-900 mt-1 font-semibold">
                  <span>7일 합계: {salesStats.sum.toLocaleString()}원</span>
                  <span>평균: {Math.round(salesStats.avg).toLocaleString()}원</span>
                  <span>전일 대비: {salesStats.diff >= 0 ? '+' : ''}{salesStats.diff.toLocaleString()}원 ({salesStats.diffRate >= 0 ? '+' : ''}{salesStats.diffRate.toFixed(1)}%)</span>
                </div>
              </div>
              {/* 클릭수 추이 그래프 */}
              <div className="bg-white/90 rounded-2xl shadow-xl px-4 pt-3 pb-2 border border-blue-100 flex flex-col min-h-[220px]">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-bold text-blue-900 text-base md:text-xl">최근 7일 클릭수 추이</div>
                  <div className="text-xs text-gray-500">단위: 회</div>
                </div>
                <div className="flex justify-between w-full px-1">
                  <span className="text-xs text-blue-700">최소 {clicksStats.min.toLocaleString()}회</span>
                  <span className="text-xs text-blue-700">최대 {clicksStats.max.toLocaleString()}회</span>
                </div>
                <svg width="100%" height="110" viewBox="0 0 340 110" className="block" style={{ overflow: 'visible' }}>
                  <polyline
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="4"
                    points={clicksTrend.map((v, i) => `${40 + i * 45},${getYClick(v)}`).join(' ')}
                  />
                  {clicksTrend.map((v, i) => (
                    <circle key={i} cx={40 + i * 45} cy={getYClick(v)} r={i === clicksTrend.length - 1 ? 7 : 5} fill={i === clicksTrend.length - 1 ? '#f472b6' : '#3b82f6'}>
                      <title>{`${trendLabels[i]}: ${v.toLocaleString()}회`}</title>
                    </circle>
                  ))}
                  {trendLabels.map((label, i) => (
                    <text key={label} x={40 + i * 45} y={105} fontSize="13" fontWeight="bold" textAnchor="middle" fill="#3b82f6">{label}</text>
                  ))}
                </svg>
                <div className="flex justify-between text-xs text-blue-900 mt-1 font-semibold">
                  <span>7일 합계: {clicksStats.sum.toLocaleString()}회</span>
                  <span>평균: {Math.round(clicksStats.avg).toLocaleString()}회</span>
                  <span>전일 대비: {clicksStats.diff >= 0 ? '+' : ''}{clicksStats.diff.toLocaleString()}회 ({clicksStats.diffRate >= 0 ? '+' : ''}{clicksStats.diffRate.toFixed(1)}%)</span>
                </div>
              </div>
              {/* 전환율 추이 그래프 */}
              <div className="bg-white/90 rounded-2xl shadow-xl px-4 pt-3 pb-2 border border-blue-100 flex flex-col min-h-[220px]">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-bold text-blue-900 text-base md:text-xl">최근 7일 전환율 추이</div>
                  <div className="text-xs text-gray-500">단위: %</div>
                </div>
                <div className="flex justify-between w-full px-1">
                  <span className="text-xs text-green-600">최소 {convStats.min.toFixed(2)}%</span>
                  <span className="text-xs text-green-600">최대 {convStats.max.toFixed(2)}%</span>
                </div>
                <svg width="100%" height="110" viewBox="0 0 340 110" className="block">
                  <polyline
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="4"
                    points={conversionTrend.map((v, i) => `${40 + i * 45},${90 - (v - 3) * 20}`).join(' ')}
                  />
                  {conversionTrend.map((v, i) => (
                    <circle key={i} cx={40 + i * 45} cy={90 - (v - 3) * 20} r={i === conversionTrend.length - 1 ? 7 : 5} fill={i === conversionTrend.length - 1 ? '#f472b6' : '#22c55e'}>
                      <title>{`${trendLabels[i]}: ${v.toFixed(2)}%`}</title>
                    </circle>
                  ))}
                  {trendLabels.map((label, i) => (
                    <text key={label} x={40 + i * 45} y={105} fontSize="13" fontWeight="bold" textAnchor="middle" fill="#22c55e">{label}</text>
                  ))}
                </svg>
                <div className="flex justify-between text-xs text-blue-900 mt-1 font-semibold">
                  <span>7일 합계: {convStats.sum.toFixed(2)}%</span>
                  <span>평균: {convStats.avg.toFixed(2)}%</span>
                  <span>전일 대비: {convStats.diff >= 0 ? '+' : ''}{convStats.diff.toFixed(2)}% ({convStats.diffRate >= 0 ? '+' : ''}{convStats.diffRate.toFixed(1)}%)</span>
                </div>
              </div>
            </div>
            {/* 캠페인별 상세 테이블 */}
            <div className="bg-white/90 rounded-2xl shadow-xl p-4 md:p-6 mb-8 md:mb-10 border border-blue-100">
              <div className="font-bold text-blue-900 mb-4 text-base md:text-lg">캠페인별 상세 실적</div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-2 text-left text-blue-700">캠페인명</th>
                      <th className="py-2 px-2 text-right text-blue-700">클릭수</th>
                      <th className="py-2 px-2 text-right text-blue-700">전환수</th>
                      <th className="py-2 px-2 text-right text-blue-700">매출</th>
                      <th className="py-2 px-2 text-right text-blue-700">ROI</th>
                      <th className="py-2 px-2 text-right text-blue-700">인플루언서</th>
                      <th className="py-2 px-2 text-right text-blue-700">콘텐츠</th>
                      <th className="py-2 px-2 text-right text-blue-700">리뷰평점</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dummyPerformance.map(c => (
                      <tr key={c.campaign} className="border-b hover:bg-blue-50/40">
                        <td className="py-2 px-2 font-semibold text-blue-900">{c.campaign}</td>
                        <td className="py-2 px-2 text-right text-blue-900">{c.clicks.toLocaleString()}</td>
                        <td className="py-2 px-2 text-right text-blue-900">{c.conversions.toLocaleString()}</td>
                        <td className="py-2 px-2 text-right text-blue-900">{c.sales.toLocaleString()}원</td>
                        <td className="py-2 px-2 text-right text-blue-900">{c.roi.toFixed(2)}</td>
                        <td className="py-2 px-2 text-right text-blue-900">{c.influencers}명</td>
                        <td className="py-2 px-2 text-right text-blue-900">{c.contents}개</td>
                        <td className="py-2 px-2 text-right text-blue-900">{(c.reviews.reduce((sum, r) => sum + r.rating, 0) / c.reviews.length).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* 인플루언서별 실적 */}
            <div className="bg-white/90 rounded-2xl shadow-xl p-4 md:p-6 mb-8 md:mb-10 border border-blue-100">
              <div className="font-bold text-blue-900 mb-4 text-base md:text-lg">인플루언서별 실적</div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-2 text-left text-blue-700">이름</th>
                      <th className="py-2 px-2 text-right text-blue-700">참여 캠페인</th>
                      <th className="py-2 px-2 text-right text-blue-700">총 매출</th>
                      <th className="py-2 px-2 text-right text-blue-700">평균 전환율</th>
                      <th className="py-2 px-2 text-right text-blue-700">리뷰평점</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dummyInfluencers.map(i => (
                      <tr key={i.name} className="border-b hover:bg-blue-50/40">
                        <td className="py-2 px-2 font-semibold text-blue-900">{i.name}</td>
                        <td className="py-2 px-2 text-right text-blue-900">{i.campaigns}개</td>
                        <td className="py-2 px-2 text-right text-blue-900">{i.totalSales.toLocaleString()}원</td>
                        <td className="py-2 px-2 text-right text-blue-900">{i.avgConversion.toFixed(2)}%</td>
                        <td className="py-2 px-2 text-right text-blue-900">{i.avgRating.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* 최근 리뷰 */}
            <div className="bg-white/90 rounded-2xl shadow-xl p-4 md:p-6 mb-8 md:mb-10 border border-blue-100">
              <div className="font-bold text-blue-900 mb-4 text-base md:text-lg">최근 리뷰</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dummyPerformance.flatMap(c => c.reviews.map(r => ({...r, campaign: c.campaign}))).slice(0,6).map((r, i) => (
                  <div key={i} className="bg-blue-50 rounded-xl p-4 flex flex-col gap-2 shadow">
                    <div className="font-semibold text-blue-900">{r.from} <span className="text-xs text-blue-500">({r.campaign})</span></div>
                    <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">★ {r.rating}</div>
                    <div className="text-blue-800 text-sm">{r.comment}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* AI 분석 카드 */}
            <div className="bg-white/90 rounded-2xl shadow-xl p-4 md:p-6 border border-blue-100 mb-8 md:mb-10">
              <div className="font-bold text-blue-900 mb-2 text-base md:text-lg">AI 성과 분석 (예시)</div>
              <ul className="list-disc pl-6 text-blue-900 text-sm">
                <li><b>병목 구간:</b> {dummyAI.bottleneck}</li>
                <li><b>추천 포맷:</b> {dummyAI.suggestion}</li>
                <li><b>리오더 타이밍:</b> {dummyAI.reorder}</li>
              </ul>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
