'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AdaptiveLayout from '@/components/AdaptiveLayout';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/database.types';

type Influencer = Database['public']['Tables']['influencers']['Row'];
type Campaign = Database['public']['Tables']['campaigns']['Row'];
type CampaignParticipant = Database['public']['Tables']['campaign_participants']['Row'];

interface InfluencerWithCampaigns extends Influencer {
  participated_campaigns: (CampaignParticipant & {
    campaign: Campaign;
  })[];
}

interface InfluencerDetailClientProps {
  influencer: Influencer;
}

export default function InfluencerDetailClient({ influencer }: InfluencerDetailClientProps) {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState('bio');
  const [campaignData, setCampaignData] = useState<InfluencerWithCampaigns | null>(null);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'bio', label: '소개' },
    { id: 'campaigns', label: '참여 캠페인' },
    { id: 'social', label: 'SNS 정보' },
  ];

  useEffect(() => {
    const fetchCampaignData = async () => {
      // Fetch campaigns that this influencer participated in
      const { data: participantsData, error } = await supabase
        .from('campaign_participants')
        .select(`
          *,
          campaign:campaigns(*)
        `)
        .eq('influencer_id', influencer.id);

      if (!error && participantsData) {
        setCampaignData({
          ...influencer,
          participated_campaigns: participantsData || []
        });
      } else {
        setCampaignData({
          ...influencer,
          participated_campaigns: []
        });
      }
      setLoading(false);
    };

    fetchCampaignData();

    // Set up real-time subscription for campaign participation changes
    const channel = supabase
      .channel(`influencer-${influencer.id}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'campaign_participants',
          filter: `influencer_id=eq.${influencer.id}`
        },
        () => {
          fetchCampaignData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [influencer.id]);

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
            {influencer.is_online && <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-400 rounded-full border-2 border-[#1e293b] animate-pulse" title="온라인"></div>}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">{influencer.name}</h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-blue-300/80 mb-4">
              <Image src={`https://flagcdn.com/w20/${influencer.country_code}.png`} alt={influencer.country} width={20} height={15} />
              <span>{influencer.country}</span>
              {influencer.is_online && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-2" title="온라인"></div>}
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-5">
              {influencer.categories?.map((cat) => (
                <span key={cat} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">#{cat}</span>
              ))}
            </div>
            <div className="flex items-center justify-center md:justify-start gap-6 text-center">
              <div>
                <div className="font-extrabold text-2xl">{influencer.follower_count.toLocaleString()}</div>
                <div className="text-sm text-blue-300/60">팔로워</div>
              </div>
              <div>
                <div className="font-extrabold text-2xl">{campaignData?.participated_campaigns?.length || 0}</div>
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
        <div className="bg-[#181830]/90 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-blue-500/20 min-h-[400px]">
          {activeTab === 'bio' && (
            <div>
              <h3 className="text-2xl font-bold mb-4">소개</h3>
              <p className="text-blue-200/90 leading-relaxed whitespace-pre-line mb-6">{influencer.bio}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-950/30 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-200 mb-2">기본 정보</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-300/70">국가:</span>
                      <span>{influencer.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-300/70">팔로워:</span>
                      <span>{influencer.follower_count.toLocaleString()}명</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-300/70">평점:</span>
                      <span>★ {influencer.rating}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-300/70">상태:</span>
                      <span className={influencer.is_online ? 'text-green-400' : 'text-gray-400'}>
                        {influencer.is_online ? '온라인' : '오프라인'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-950/30 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-200 mb-2">관심 카테고리</h4>
                  <div className="flex flex-wrap gap-2">
                    {influencer.categories?.map((cat) => (
                      <span key={cat} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'campaigns' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">참여 캠페인</h3>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-2 border-blue-300/30 border-t-blue-400 rounded-full animate-spin"></div>
                </div>
              ) : campaignData?.participated_campaigns && campaignData.participated_campaigns.length > 0 ? (
                <div className="grid gap-6">
                  {campaignData.participated_campaigns.map((participation) => (
                    <div key={participation.id} className="bg-blue-950/30 rounded-xl p-6 border border-blue-500/20">
                      <div className="flex items-center gap-4 mb-4">
                        <Link href={`/campaigns/${participation.campaign.id}`}>
                          <Image
                            src={participation.campaign.image ? 
                              (participation.campaign.image.startsWith('http') ? participation.campaign.image : 
                               `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/campaigns/${participation.campaign.image}`) :
                              '/campaign_sample/sample1.jpeg'
                            }
                            alt={participation.campaign.title}
                            width={80}
                            height={80}
                            className="w-20 h-20 object-cover rounded-lg border-2 border-blue-500/60 hover:scale-105 transition"
                          />
                        </Link>
                        <div className="flex-1">
                          <Link href={`/campaigns/${participation.campaign.id}`} className="text-lg font-semibold text-blue-200 hover:text-blue-100 transition">
                            {participation.campaign.title}
                          </Link>
                          <p className="text-sm text-blue-300/70 mb-1">{participation.campaign.brand}</p>
                          <div className="flex gap-2 text-xs">
                            <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded">{participation.campaign.category}</span>
                            <span className={`px-2 py-1 rounded ${
                              participation.campaign.status === '진행중' ? 'bg-green-500/30 text-green-300' : 'bg-gray-500/30 text-gray-300'
                            }`}>
                              {participation.campaign.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            participation.approval_status === 'approved' ? 'bg-green-500/30 text-green-300' :
                            participation.approval_status === 'pending' ? 'bg-yellow-500/30 text-yellow-300' :
                            'bg-gray-500/30 text-gray-300'
                          }`}>
                            {participation.approval_status === 'approved' ? '승인됨' : 
                             participation.approval_status === 'pending' ? '검토중' : '대기'}
                          </div>
                        </div>
                      </div>
                      
                      {participation.content_url && (
                        <div className="bg-blue-950/40 rounded-lg p-4 mt-4">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-medium text-blue-200">업로드된 콘텐츠:</span>
                          </div>
                          <p className="text-blue-300/80 text-sm">{participation.content_caption}</p>
                          {participation.performance_metrics && (
                            <div className="flex gap-4 mt-3 text-xs text-blue-300/70">
                              <span>조회: {participation.performance_metrics.views || 0}</span>
                              <span>좋아요: {participation.performance_metrics.likes || 0}</span>
                              <span>댓글: {participation.performance_metrics.comments || 0}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-blue-300/50">
                  <p className="text-xl mb-2">📋</p>
                  <p>아직 참여한 캠페인이 없습니다.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'social' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">SNS 정보</h3>
              <div className="grid gap-4">
                {influencer.social_handles && Object.entries(influencer.social_handles).map(([platform, handle]) => (
                  <div key={platform} className="bg-blue-950/30 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-blue-300 font-bold text-lg">
                        {platform === 'instagram' ? '📷' : 
                         platform === 'tiktok' ? '🎵' : 
                         platform === 'youtube' ? '📹' : '🌐'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-blue-200 capitalize">{platform}</p>
                      <p className="text-blue-300/70 text-sm">{handle}</p>
                    </div>
                    <a 
                      href={`https://${platform}.com/${handle.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition"
                    >
                      방문
                    </a>
                  </div>
                ))}
                
                {!influencer.social_handles || Object.keys(influencer.social_handles).length === 0 && (
                  <div className="text-center py-12 text-blue-300/50">
                    <p className="text-xl mb-2">🔗</p>
                    <p>등록된 SNS 정보가 없습니다.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdaptiveLayout>
  );
}
