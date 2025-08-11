'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/database.types';

type Influencer = Database['public']['Tables']['influencers']['Row'];

const mockInfluencers: Influencer[] = [
  {
    id: '1',
    name: 'Nicha',
    avatar: '/campaign_sample/sample1.jpeg',
    country: 'Thailand',
    country_code: 'th',
    follower_count: 12000,
    categories: ['뷰티', '라이프스타일'],
    campaigns_count: 8,
    rating: 4.8,
    bio: 'K-뷰티와 라이프스타일을 사랑하는 태국 인플루언서. 다양한 브랜드와 협업 경험 보유.',
    is_online: true,
    social_handles: { instagram: '@nicha_beauty', tiktok: '@nicha_lifestyle' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Mina',
    avatar: '/campaign_sample/sample2.jpeg',
    country: 'Thailand',
    country_code: 'th',
    follower_count: 35000,
    categories: ['패션', '뷰티'],
    campaigns_count: 12,
    rating: 4.9,
    bio: '트렌디한 패션과 뷰티 콘텐츠로 팔로워와 소통하는 크리에이터.',
    is_online: false,
    social_handles: { instagram: '@mina_fashion', tiktok: '@mina_style' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Somchai',
    avatar: '/campaign_sample/sample3.jpeg',
    country: 'Thailand',
    country_code: 'th',
    follower_count: 8000,
    categories: ['푸드', '여행'],
    campaigns_count: 5,
    rating: 4.7,
    bio: '여행과 음식 리뷰를 전문으로 하는 태국 인플루언서.',
    is_online: true,
    social_handles: { instagram: '@somchai_food', youtube: '@somchai_travel' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'John D.',
    avatar: '/campaign_sample/sample4.jpeg',
    country: 'USA',
    country_code: 'us',
    follower_count: 250000,
    categories: ['테크', '게이밍'],
    campaigns_count: 25,
    rating: 4.9,
    bio: 'Latest tech reviews and gameplay streams. Connecting brands with gamers.',
    is_online: true,
    social_handles: { youtube: '@johnd_tech', tiktok: '@johnd_gaming' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function InfluencersPage() {
  const supabase = createClient();
  const [influencers, setInfluencers] = useState<Influencer[]>(mockInfluencers);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfluencers = async () => {
      const { data, error } = await supabase
        .from('influencers')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setInfluencers(data);
      } else {
        // Use mock data as fallback
        setInfluencers(mockInfluencers);
      }
      setLoading(false);
    };

    fetchInfluencers();

    // Set up real-time subscription for new influencers
    const channel = supabase
      .channel('influencers')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'influencers' },
        () => {
          fetchInfluencers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredInfluencers = influencers.filter(inf => 
    inf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inf.categories?.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#2563eb] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">인플루언서 찾기</h1>
          <p className="text-lg text-blue-200/80 max-w-3xl mx-auto">전 세계의 인플루언서와 협업하여 브랜드를 성장시키세요. 국가, 카테고리, 팔로워 수 등 다양한 조건으로 검색할 수 있습니다.</p>
        </div>

        <div className="mb-10">
          <div className="relative max-w-2xl mx-auto">
            <input 
              type="text"
              placeholder="인플루언서 이름 또는 카테고리 검색... (예: 뷰티)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 rounded-full bg-black/30 text-white placeholder-blue-300/50 border-2 border-blue-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 outline-none transition-all duration-300 shadow-lg"
            />
            <svg className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-300/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredInfluencers.map((inf) => (
            <div
              key={inf.id}
              className="bg-gradient-to-br from-[#1e293b] to-[#121826] rounded-2xl shadow-2xl border border-blue-500/20 hover:border-blue-400/70 transition-all duration-300 flex flex-col text-white group transform hover:-translate-y-2 hover:shadow-blue-500/20"
            >
              <div className="p-6">
                <div className="flex items-center gap-5 mb-5">
                  <div className="relative">
                    <Image
                      src={inf.avatar || '/campaign_sample/sample1.jpeg'}
                      alt={inf.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full border-4 border-blue-500/50 object-cover shadow-lg"
                    />
                    {inf.is_online && <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-[#1e293b] animate-pulse" title="온라인"></div>}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{inf.name}</h2>
                    <div className="flex items-center gap-2 text-blue-300/80">
                      <Image src={`https://flagcdn.com/w20/${inf.country_code}.png`} alt={inf.country} width={20} height={15} />
                      <span>{inf.country}</span>
                    </div>
                  </div>
                </div>
                <p className="text-blue-200/90 text-sm mb-5 min-h-[40px] line-clamp-2">{inf.bio}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {inf.categories?.map((cat) => (
                    <span key={cat} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">
                      #{cat}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-center bg-black/20 p-3 rounded-xl mb-6">
                  <div>
                    <div className="font-bold text-lg">{inf.follower_count.toLocaleString()}</div>
                    <div className="text-xs text-blue-300/60">팔로워</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg">{inf.campaigns_count}</div>
                    <div className="text-xs text-blue-300/60">캠페인</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg flex items-center gap-1"> <svg width="16" height="16" fill="#fbbf24" viewBox="0 0 20 20" className="-mt-0.5"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg> {inf.rating}</div>
                    <div className="text-xs text-blue-300/60">평점</div>
                  </div>
                </div>
              </div>
              <div className="bg-black/30 p-4 rounded-b-2xl mt-auto flex gap-3">
                <Link href={`/influencers/${inf.id}`} className="flex-1 text-center bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/40 transform hover:scale-105 active:scale-100">
                  프로필 보기
                </Link>
                <button className="flex-1 text-center bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-green-500/40 transform hover:scale-105 active:scale-100">
                  메시지 보내기
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}