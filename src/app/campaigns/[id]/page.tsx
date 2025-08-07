'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import AdaptiveLayout from '@/components/AdaptiveLayout';

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
  description: string;
}

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

export default function CampaignDetailPage({ params }: any) {
  const supabase = createClient();
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

  if (loading) {
    return (
      <AdaptiveLayout title="로딩 중...">
        <div className="flex justify-center items-center h-screen">
          <div className="w-12 h-12 border-4 border-blue-300/30 border-t-blue-400 rounded-full animate-spin"></div>
        </div>
      </AdaptiveLayout>
    );
  }

  if (!campaign) {
    return (
      <AdaptiveLayout title="오류">
        <div className="text-center text-blue-300/70 py-20">
          <p className="text-2xl mb-2">🚫</p>
          <p>캠페인을 찾을 수 없습니다.</p>
          <Link href="/campaigns" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg">캠페인 목록으로</Link>
        </div>
      </AdaptiveLayout>
    );
  }

  return (
    <AdaptiveLayout title={campaign.title} showBackButton={true}>
      <div className="w-full max-w-4xl mx-auto text-white">
        {campaign.image && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl border border-blue-500/20">
            <Image
              src={campaign.image.startsWith('http') ? campaign.image : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/campaigns/${campaign.image}`}
              alt={campaign.title}
              width={800}
              height={400}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        )}

        <div className="bg-[#181830]/90 backdrop-blur-md rounded-2xl p-6 mb-8 shadow-lg border border-blue-500/20">
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-semibold">{campaign.brand}</span>
            <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-semibold">{campaign.category}</span>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${campaign.status === '진행중' ? 'bg-green-500/30 text-green-300' : 'bg-gray-500/30 text-gray-300'}`}>{campaign.status}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{campaign.title}</h1>
          <p className="text-blue-200/80 mb-6">{campaign.description}</p>
          <div className="flex items-center justify-between bg-blue-950/30 p-4 rounded-xl">
            <div>
              <p className="text-sm text-blue-300/70">제품 가격</p>
              <p className="text-2xl font-bold text-white">{campaign.price?.toLocaleString()}원</p>
            </div>
            <div>
              <p className="text-sm text-blue-300/70">총 참여자</p>
              <p className="text-2xl font-bold text-white">{campaign.participants}명</p>
            </div>
            <a href={campaign.shopify_url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Shopify 스토어</a>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">캠페인 성과 (KPI)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <KPI_Card label="조회수" value={dummyKPI.views.toLocaleString()} />
            <KPI_Card label="클릭수" value={dummyKPI.clicks.toLocaleString()} />
            <KPI_Card label="전환수" value={dummyKPI.conversions.toLocaleString()} />
            <KPI_Card label="매출" value={`${dummyKPI.sales.toLocaleString()}원`} />
            <KPI_Card label="ROI" value={`${dummyKPI.roi}배`} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#181830]/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-blue-500/20">
            <h3 className="text-xl font-bold mb-4">인플루언서 콘텐츠</h3>
            <div className="space-y-4">
              {dummyContents.map(content => (
                <div key={content.id} className="bg-blue-950/30 rounded-xl p-4 flex items-center gap-4">
                  <Image src={content.media_url} alt="콘텐츠" width={80} height={80} className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <p className="text-blue-200/90">{content.caption}</p>
                    <p className={`text-sm font-bold ${content.approval_status === 'approved' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {content.approval_status === 'approved' ? '승인됨' : '대기중'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#181830]/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-blue-500/20">
            <h3 className="text-xl font-bold mb-4">브랜드 리뷰</h3>
            <ul className="space-y-4">
              {dummyReviews.map((r, i) => (
                <li key={i} className="bg-blue-950/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-blue-200/90">{r.from}</p>
                    <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">★ {r.rating}</div>
                  </div>
                  <p className="text-blue-300/80 text-sm">{r.comment}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href={`/campaigns/${id}/upload`} className="w-full max-w-md inline-block px-6 py-4 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 text-lg">
            콘텐츠 업로드 / 참여하기
          </Link>
        </div>
      </div>
    </AdaptiveLayout>
  );
}

function KPI_Card({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="bg-blue-950/40 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg border border-blue-800/50">
      <p className="text-sm text-blue-300/70 font-semibold mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}