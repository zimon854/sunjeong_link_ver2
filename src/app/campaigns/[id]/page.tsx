"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import Image from 'next/image';

interface Campaign {
  id: number;
  title: string;
  brand: string;
  image: string;
  price: number;
  participants: number;
  status: string;
  category: string;
  shopify_url: string;
}

// 더미 KPI/콘텐츠/리뷰 데이터 (실제 연동 전 임시)
const dummyKPI = {
  views: 1200,
  clicks: 340,
  conversions: 28,
  sales: 420000,
  roi: 3.2,
};
const dummyContents = [
  { id: 1, media_url: '/campaign_sample/sample1.jpeg', caption: '인플루언서A 콘텐츠', approval_status: 'approved' },
  { id: 2, media_url: '/campaign_sample/sample2.jpeg', caption: '인플루언서B 콘텐츠', approval_status: 'pending' },
];
const dummyReviews = [
  { from: '인플루언서A', rating: 5, comment: '브랜드와 소통이 원활하고, 캠페인 운영이 체계적이에요!' },
  { from: '인플루언서B', rating: 4.5, comment: '정산도 빠르고 피드백이 명확해서 좋았습니다.' },
];

export default function CampaignDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchCampaign = async () => {
      const { data, error } = await supabase.from('campaigns').select('*').eq('id', Number(id)).single();
      if (!error && data) setCampaign(data);
      setLoading(false);
    };
    fetchCampaign();
  }, [id]);

  if (loading) return <div className="max-w-lg mx-auto mt-20 text-blue-200">로딩 중...</div>;
  if (!campaign) return <div className="max-w-lg mx-auto mt-20 text-blue-200">캠페인을 찾을 수 없습니다.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0c23] to-[#181826] py-10 px-2 md:px-0 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white/90 rounded-3xl shadow-2xl border border-blue-900/30 p-8">
        {/* 캠페인 대표 이미지 */}
      {campaign.image && (
          <Image
            src={campaign.image.startsWith('http') ? campaign.image : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/campaigns/${campaign.image}`}
          alt={campaign.title}
            width={600}
            height={224}
            className="w-full h-56 object-cover rounded-xl mb-6 border"
            priority
          />
        )}
        {/* 캠페인 기본 정보 카드 */}
        <h2 className="text-3xl font-extrabold text-blue-700 mb-2 text-center">{campaign.title}</h2>
        <div className="flex flex-wrap gap-2 justify-center mb-2">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">{campaign.brand}</span>
          <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-semibold">{campaign.category}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${campaign.status === '진행중' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-200 text-gray-600 border-gray-400'}`}>{campaign.status}</span>
        </div>
        <div className="flex justify-center gap-6 mb-4 text-blue-900 font-semibold text-base">
          <span>가격 <span className="text-pink-500 font-bold">{campaign.price?.toLocaleString()}원</span></span>
          <span>참여자 <span className="text-blue-600 font-bold">{campaign.participants}명</span></span>
        </div>
        <div className="mb-4 text-blue-200 text-center text-sm">Shopify URL: <a href={campaign.shopify_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">{campaign.shopify_url}</a></div>
        {/* KPI 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          <div className="bg-gradient-to-br from-blue-100 to-blue-300 rounded-xl p-3 text-center shadow">
            <div className="text-xs text-blue-700 font-bold mb-1">조회수</div>
            <div className="text-xl font-extrabold text-blue-900">{dummyKPI.views.toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-blue-300 rounded-xl p-3 text-center shadow">
            <div className="text-xs text-blue-700 font-bold mb-1">클릭수</div>
            <div className="text-xl font-extrabold text-blue-900">{dummyKPI.clicks.toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-blue-300 rounded-xl p-3 text-center shadow">
            <div className="text-xs text-blue-700 font-bold mb-1">전환수</div>
            <div className="text-xl font-extrabold text-blue-900">{dummyKPI.conversions.toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-blue-300 rounded-xl p-3 text-center shadow">
            <div className="text-xs text-blue-700 font-bold mb-1">매출</div>
            <div className="text-xl font-extrabold text-blue-900">{dummyKPI.sales.toLocaleString()}원</div>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-blue-300 rounded-xl p-3 text-center shadow">
            <div className="text-xs text-blue-700 font-bold mb-1">ROI</div>
            <div className="text-xl font-extrabold text-blue-900">{dummyKPI.roi}배</div>
          </div>
        </div>
        {/* 인플루언서 콘텐츠 리스트 */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-blue-800 mb-2">인플루언서 콘텐츠</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dummyContents.map(content => (
              <div key={content.id} className="bg-white rounded-xl border border-blue-100 shadow p-3 flex flex-col">
                <img src={content.media_url} alt="콘텐츠" className="w-full h-32 object-cover rounded mb-2" />
                <div className="text-sm text-gray-700 mb-1">{content.caption}</div>
                <div className={`text-xs font-bold ${content.approval_status === 'approved' ? 'text-green-600' : content.approval_status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>{content.approval_status === 'approved' ? '승인됨' : content.approval_status === 'pending' ? '대기중' : '반려됨'}</div>
              </div>
            ))}
          </div>
        </div>
        {/* 브랜드 리뷰 */}
        <div className="mb-2">
          <h3 className="text-lg font-bold text-blue-800 mb-2">브랜드 리뷰</h3>
          <ul className="space-y-2">
            {dummyReviews.map((r, i) => (
              <li key={i} className="bg-blue-50 rounded-lg px-4 py-3 shadow flex flex-col md:flex-row md:items-center md:justify-between border border-blue-100">
                <div className="font-semibold text-gray-700">{r.from}</div>
                <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">★ {r.rating}</div>
                <div className="text-gray-600 text-sm mt-1 md:mt-0">{r.comment}</div>
              </li>
            ))}
          </ul>
        </div>
        {/* 참여/콘텐츠 업로드 버튼 */}
        <button className="mt-6 w-full bg-green-600 text-white px-4 py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition shadow">콘텐츠 업로드/참여</button>
      </div>
    </div>
  );
} 