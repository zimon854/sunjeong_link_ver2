'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import AdaptiveLayout from '@/components/AdaptiveLayout';
import { Database } from '@/lib/database.types';

type Campaign = Database['public']['Tables']['campaigns']['Row'];
type Influencer = Database['public']['Tables']['influencers']['Row'];
type CampaignParticipant = Database['public']['Tables']['campaign_participants']['Row'];
type CampaignReview = Database['public']['Tables']['campaign_reviews']['Row'];

interface CampaignWithParticipants extends Campaign {
  participants_data: (CampaignParticipant & {
    influencer: Influencer;
  })[];
  reviews_data: CampaignReview[];
}

const dummyKPI = {
  views: 1200,
  clicks: 340,
  conversions: 28,
  sales: 420000,
  roi: 3.2,
};

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = createClient();
  const [id, setId] = useState<string | null>(null);
  const [campaign, setCampaign] = useState<CampaignWithParticipants | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;
    
    const fetchCampaignData = async () => {
      // Fetch campaign with participants and reviews
      const { data: campaignData, error: campaignError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', Number(id))
        .single();

      if (campaignError || !campaignData) {
        setLoading(false);
        return;
      }

      // Fetch participants with influencer data
      const { data: participantsData, error: participantsError } = await supabase
        .from('campaign_participants')
        .select(`
          *,
          influencer:influencers(*)
        `)
        .eq('campaign_id', Number(id));

      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('campaign_reviews')
        .select('*')
        .eq('campaign_id', Number(id));

      if (!participantsError && !reviewsError) {
        setCampaign({
          ...campaignData,
          participants_data: participantsData || [],
          reviews_data: reviewsData || []
        });
      }
      
      setLoading(false);
    };

    fetchCampaignData();

    // Set up real-time subscription for campaign updates
    const channel = supabase
      .channel(`campaign-${id}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'campaign_participants',
          filter: `campaign_id=eq.${id}`
        },
        () => {
          // Refetch data when participants change
          fetchCampaignData();
        }
      )
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'campaign_reviews',
          filter: `campaign_id=eq.${id}`
        },
        () => {
          // Refetch data when reviews change
          fetchCampaignData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, supabase]);

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
              <p className="text-2xl font-bold text-white">{campaign.participants_data?.length || 0}명</p>
            </div>
            {campaign.shopify_url && (
              <a href={campaign.shopify_url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Shopify 스토어</a>
            )}
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="mb-8 bg-black/20 p-2 rounded-xl flex justify-center gap-2">
          {[
            { id: 'overview', label: '개요' },
            { id: 'participants', label: '참여 인플루언서' },
            { id: 'reviews', label: '리뷰' },
            { id: 'performance', label: '성과' }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-blue-300/70 hover:bg-white/10'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        <div className="bg-[#181830]/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-blue-500/20 min-h-[400px]">
          {activeTab === 'overview' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">캠페인 개요</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                <KPI_Card label="조회수" value={dummyKPI.views.toLocaleString()} />
                <KPI_Card label="클릭수" value={dummyKPI.clicks.toLocaleString()} />
                <KPI_Card label="전환수" value={dummyKPI.conversions.toLocaleString()} />
                <KPI_Card label="매출" value={`${dummyKPI.sales.toLocaleString()}원`} />
                <KPI_Card label="ROI" value={`${dummyKPI.roi}배`} />
              </div>
              <div className="bg-blue-950/30 rounded-xl p-6">
                <h4 className="text-lg font-semibold mb-3">상세 설명</h4>
                <p className="text-blue-200/90 leading-relaxed">{campaign.description}</p>
              </div>
            </div>
          )}

          {activeTab === 'participants' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">참여 인플루언서 ({campaign.participants_data?.length || 0}명)</h3>
              {campaign.participants_data && campaign.participants_data.length > 0 ? (
                <div className="grid gap-6">
                  {campaign.participants_data.map((participant) => (
                    <div key={participant.id} className="bg-blue-950/30 rounded-xl p-6 border border-blue-500/20">
                      <div className="flex items-center gap-4 mb-4">
                        <Link href={`/influencers/${participant.influencer.id}`}>
                          <Image
                            src={participant.influencer.avatar || '/campaign_sample/sample1.jpeg'}
                            alt={participant.influencer.name}
                            width={60}
                            height={60}
                            className="w-15 h-15 rounded-full object-cover border-2 border-blue-500/60 hover:scale-105 transition"
                          />
                        </Link>
                        <div className="flex-1">
                          <Link href={`/influencers/${participant.influencer.id}`} className="text-lg font-semibold text-blue-200 hover:text-blue-100 transition">
                            {participant.influencer.name}
                          </Link>
                          <div className="flex items-center gap-2 text-sm text-blue-300/70">
                            <Image src={`https://flagcdn.com/w20/${participant.influencer.country_code}.png`} alt={participant.influencer.country} width={16} height={12} />
                            <span>{participant.influencer.country}</span>
                            <span>•</span>
                            <span>{participant.influencer.follower_count.toLocaleString()} 팔로워</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            participant.approval_status === 'approved' ? 'bg-green-500/30 text-green-300' :
                            participant.approval_status === 'pending' ? 'bg-yellow-500/30 text-yellow-300' :
                            'bg-gray-500/30 text-gray-300'
                          }`}>
                            {participant.approval_status === 'approved' ? '승인됨' : 
                             participant.approval_status === 'pending' ? '검토중' : '대기'}
                          </div>
                        </div>
                      </div>
                      
                      {participant.content_url && (
                        <div className="flex items-center gap-4 bg-blue-950/40 rounded-lg p-4">
                          <Image 
                            src={participant.content_url} 
                            alt="콘텐츠" 
                            width={80} 
                            height={80} 
                            className="w-20 h-20 object-cover rounded-lg" 
                          />
                          <div className="flex-1">
                            <p className="text-blue-200/90 text-sm">{participant.content_caption}</p>
                            {participant.performance_metrics && (
                              <div className="flex gap-4 mt-2 text-xs text-blue-300/70">
                                <span>조회: {participant.performance_metrics.views || 0}</span>
                                <span>좋아요: {participant.performance_metrics.likes || 0}</span>
                                <span>댓글: {participant.performance_metrics.comments || 0}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-blue-300/50">
                  <p className="text-xl mb-2">👥</p>
                  <p>아직 참여한 인플루언서가 없습니다.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">브랜드 리뷰</h3>
              {campaign.reviews_data && campaign.reviews_data.length > 0 ? (
                <div className="space-y-4">
                  {campaign.reviews_data.map((review) => (
                    <div key={review.id} className="bg-blue-950/30 rounded-xl p-4 border-l-4 border-blue-500">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-blue-200/90">{review.reviewer_name}</p>
                        <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                          {'★'.repeat(Math.floor(review.rating))} {review.rating}
                        </div>
                      </div>
                      <p className="text-blue-300/80 text-sm italic">&ldquo;{review.comment}&rdquo;</p>
                      <p className="text-xs text-blue-300/50 mt-2">
                        {new Date(review.created_at).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-blue-300/50">
                  <p className="text-xl mb-2">💬</p>
                  <p>아직 작성된 리뷰가 없습니다.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'performance' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">성과 분석</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                <KPI_Card label="조회수" value={dummyKPI.views.toLocaleString()} />
                <KPI_Card label="클릭수" value={dummyKPI.clicks.toLocaleString()} />
                <KPI_Card label="전환수" value={dummyKPI.conversions.toLocaleString()} />
                <KPI_Card label="매출" value={`${dummyKPI.sales.toLocaleString()}원`} />
                <KPI_Card label="ROI" value={`${dummyKPI.roi}배`} />
              </div>
              
              {/* 인플루언서별 성과 */}
              <div className="bg-blue-950/30 rounded-xl p-6">
                <h4 className="text-lg font-semibold mb-4">인플루언서별 성과</h4>
                {campaign.participants_data && campaign.participants_data.length > 0 ? (
                  <div className="space-y-3">
                    {campaign.participants_data.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between bg-blue-950/50 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={participant.influencer.avatar || '/campaign_sample/sample1.jpeg'}
                            alt={participant.influencer.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <span className="font-medium">{participant.influencer.name}</span>
                        </div>
                        <div className="flex gap-4 text-sm text-blue-300/70">
                          <span>조회: {participant.performance_metrics?.views || 0}</span>
                          <span>좋아요: {participant.performance_metrics?.likes || 0}</span>
                          <span>댓글: {participant.performance_metrics?.comments || 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-blue-300/50 text-center py-4">성과 데이터가 없습니다.</p>
                )}
              </div>
            </div>
          )}
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