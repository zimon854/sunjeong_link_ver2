'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AdaptiveLayout from '@/components/AdaptiveLayout';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/database.types';
import { useNativeToast } from '@/hooks/useNativeToast';

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
  const { showInfo } = useNativeToast();

  const handleMessageClick = useCallback(() => {
    showInfo('지금 메시지 기능은 준비중입니다.', { position: 'center' });
  }, [showInfo]);

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
  }, [influencer, supabase]);

  return (
    <AdaptiveLayout title={influencer.name} showBackButton={true}>
      <div className="w-full max-w-4xl mx-auto text-slate-800">
        {/* 프로필 헤더 */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center gap-8">
          <div className="relative flex-shrink-0">
            <Image
              src={influencer.avatar}
              alt={influencer.name}
              width={128}
              height={128}
              className="w-32 h-32 rounded-full border-4 border-blue-100 object-cover shadow-sm"
            />
            {influencer.is_online && <div className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white animate-pulse" title="온라인"></div>}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2 text-slate-900">{influencer.name}</h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 mb-4">
              <Image src={`https://flagcdn.com/w20/${influencer.country_code}.png`} alt={influencer.country} width={20} height={15} />
              <span>{influencer.country}</span>
              {influencer.is_online && <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse ml-2" title="온라인"></div>}
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-5">
              {influencer.categories?.map((cat) => (
                <span key={cat} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold border border-blue-100">#{cat}</span>
              ))}
            </div>
            <div className="flex items-center justify-center md:justify-start gap-6 text-center">
              <div>
                <div className="font-extrabold text-2xl text-slate-900">{influencer.follower_count.toLocaleString()}</div>
                <div className="text-sm text-slate-500">팔로워</div>
              </div>
              <div>
                <div className="font-extrabold text-2xl text-slate-900">{campaignData?.participated_campaigns?.length || 0}</div>
                <div className="text-sm text-slate-500">캠페인</div>
              </div>
              <div>
                <div className="font-extrabold text-2xl flex items-center gap-1 text-slate-900">★ {influencer.rating}</div>
                <div className="text-sm text-slate-500">평점</div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-auto flex flex-col gap-3 mt-6 md:mt-0 md:ml-auto">
            <button
              type="button"
              onClick={handleMessageClick}
              className="w-full text-center bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-sm"
            >
              메시지 보내기
            </button>
            <button className="w-full text-center bg-transparent border-2 border-blue-200 text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-blue-50 transition-all duration-200">협업 제안하기</button>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="mb-8 bg-slate-100 p-2 rounded-xl flex justify-center gap-2 border border-slate-200">
          {tabs.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${activeTab === tab.id ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-500 hover:bg-white'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 min-h-[400px]">
          {activeTab === 'bio' && (
            <div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">소개</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line mb-6">{influencer.bio}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">기본 정보</h4>
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-500">국가:</span>
                      <span>{influencer.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">팔로워:</span>
                      <span>{influencer.follower_count.toLocaleString()}명</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">평점:</span>
                      <span>★ {influencer.rating}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">상태:</span>
                      <span className={influencer.is_online ? 'text-emerald-500 font-semibold' : 'text-slate-400'}>
                        {influencer.is_online ? '온라인' : '오프라인'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">관심 카테고리</h4>
                  <div className="flex flex-wrap gap-2">
                    {influencer.categories?.map((cat) => (
                      <span key={cat} className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs border border-blue-100">
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
              <h3 className="text-2xl font-bold mb-6 text-slate-900">참여 캠페인</h3>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-400 rounded-full animate-spin"></div>
                </div>
              ) : campaignData?.participated_campaigns && campaignData.participated_campaigns.length > 0 ? (
                <div className="grid gap-6">
                  {campaignData.participated_campaigns.map((participation) => (
                    <div key={participation.id} className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                      <div className="flex items-center gap-4 mb-4">
                        <Link href={`/campaigns/${participation.campaign.id}`}>
                          <Image
                            src={participation.campaign.image ? 
                              (participation.campaign.image.startsWith('http') ? participation.campaign.image : 
                               `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/campaigns/${participation.campaign.image}`) :
                              '/campaign_sample/kahi.png'
                            }
                            alt={participation.campaign.title}
                            width={80}
                            height={80}
                            className="w-20 h-20 object-cover rounded-lg border-2 border-blue-100 hover:scale-105 transition"
                          />
                        </Link>
                        <div className="flex-1">
                          <Link href={`/campaigns/${participation.campaign.id}`} className="text-lg font-semibold text-slate-900 hover:text-blue-600 transition">
                            {participation.campaign.title}
                          </Link>
                          <p className="text-sm text-slate-500 mb-1">{participation.campaign.brand}</p>
                          <div className="flex gap-2 text-xs">
                            <span className="px-2 py-1 rounded border border-purple-100 bg-purple-50 text-purple-600">{participation.campaign.category}</span>
                            <span className={`px-2 py-1 rounded border ${
                              participation.campaign.status === '진행중' ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : 'border-slate-200 bg-slate-100 text-slate-600'
                            }`}>
                              {participation.campaign.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                            participation.approval_status === 'approved' ? 'border-emerald-200 bg-emerald-50 text-emerald-600' :
                            participation.approval_status === 'pending' ? 'border-amber-200 bg-amber-50 text-amber-600' :
                            'border-slate-200 bg-slate-100 text-slate-500'
                          }`}>
                            {participation.approval_status === 'approved' ? '승인됨' : 
                             participation.approval_status === 'pending' ? '검토중' : '대기'}
                          </div>
                        </div>
                      </div>
                      
                      {participation.content_url && (
                        <div className="bg-white rounded-lg p-4 mt-4 border border-slate-200">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-medium text-slate-900">업로드된 콘텐츠:</span>
                          </div>
                          <p className="text-slate-600 text-sm">{participation.content_caption}</p>
                          {participation.performance_metrics && (
                            <div className="flex gap-4 mt-3 text-xs text-slate-500">
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
                <div className="text-center py-12 text-slate-400">
                  <p className="text-xl mb-2">📋</p>
                  <p>아직 참여한 캠페인이 없습니다.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'social' && (
            <div>
              <h3 className="text-2xl font-bold mb-6 text-slate-900">SNS 정보</h3>
              <div className="grid gap-4">
                {influencer.social_handles && Object.entries(influencer.social_handles).map(([platform, handle]) => (
                  <div key={platform} className="bg-slate-50 rounded-xl p-4 flex items-center gap-4 border border-slate-200">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">
                        {platform === 'instagram' ? '📷' : 
                         platform === 'tiktok' ? '🎵' : 
                         platform === 'youtube' ? '📹' : '🌐'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 capitalize">{platform}</p>
                      <p className="text-slate-500 text-sm">{handle}</p>
                    </div>
                    <a 
                      href={`https://${platform}.com/${handle.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition"
                    >
                      방문
                    </a>
                  </div>
                ))}
                
                {!influencer.social_handles || Object.keys(influencer.social_handles).length === 0 && (
                  <div className="text-center py-12 text-slate-400">
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
