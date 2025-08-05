"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '../../lib/supabaseClient';

// 더미 실적 데이터 (실제 연동 시 DB에서 fetch)
const dummyStats = {
  campaigns: 3,
  totalSales: 5400000,
  avgConversion: 5.2,
  avgRating: 4.8,
};

export default function ProfilePage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>({ name: '', role: '', bio: '', image: '' });
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    let imageUrl = profile.image;
    if (image) {
      const { data, error } = await supabase.storage.from('profiles').upload(`img/${user.id}_${Date.now()}_${image.name}`, image, { upsert: true });
      if (error) {
        setMessage('이미지 업로드 실패: ' + error.message);
        setLoading(false);
        return;
      }
      imageUrl = data.path;
    }
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      name: profile.name,
      role: profile.role,
      bio: profile.bio,
      image: imageUrl
    });
    setLoading(false);
    setMessage(error ? error.message : '프로필 저장 완료!');
  };

  if (!user) return <div className="mt-10 text-center text-white/80">로그인이 필요합니다.</div>;
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#2563eb] py-12 px-4 flex flex-col items-center">
      {/* 프로필 카드 */}
      <div className="w-full max-w-xl bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col items-center border border-blue-100 mb-10">
        <img
          src={profile.image ? supabase.storage.from('profiles').getPublicUrl(profile.image).data.publicUrl : '/profile_sample.jpg'}
          alt="프로필"
          className="w-28 h-28 rounded-full border-4 border-blue-200 shadow mb-4 bg-white object-cover"
        />
        <div className="text-2xl font-bold text-gray-900 mb-1">{profile.name || user.email}</div>
        <div className="text-blue-700 font-medium mb-1">{profile.role === 'brand' ? '브랜드' : profile.role === 'influencer' ? '인플루언서' : '역할 미설정'}</div>
        <div className="text-blue-700 text-sm mb-2">{user.email}</div>
        <p className="text-gray-600 text-center text-base mb-4 max-w-xl">{profile.bio}</p>
        {/* 주요 지표 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-2">
          <div className="bg-blue-50 rounded-xl p-3 flex flex-col items-center">
            <div className="text-xs text-blue-700 mb-1">캠페인</div>
            <div className="font-bold text-blue-900">{dummyStats.campaigns}개</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 flex flex-col items-center">
            <div className="text-xs text-blue-700 mb-1">총 매출</div>
            <div className="font-bold text-blue-900">{dummyStats.totalSales.toLocaleString()}원</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 flex flex-col items-center">
            <div className="text-xs text-blue-700 mb-1">평균 전환율</div>
            <div className="font-bold text-blue-900">{dummyStats.avgConversion.toFixed(2)}%</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 flex flex-col items-center">
            <div className="text-xs text-blue-700 mb-1">리뷰평점</div>
            <div className="font-bold text-blue-900">{dummyStats.avgRating.toFixed(2)}</div>
          </div>
        </div>
      </div>
      {/* 프로필 수정 폼 */}
      <form onSubmit={handleSubmit} className="w-full max-w-xl flex flex-col gap-3 p-8 border border-blue-100 rounded-2xl bg-white/90 shadow-xl">
        <h2 className="text-xl font-bold mb-2 text-blue-900">프로필 수정</h2>
      <input
        type="text"
        value={profile.name}
          onChange={e => setProfile((p: any) => ({ ...p, name: e.target.value }))}
        placeholder="이름"
        className="border p-2 rounded"
        required
      />
      <select
        value={profile.role}
          onChange={e => setProfile((p: any) => ({ ...p, role: e.target.value }))}
        className="border p-2 rounded"
        required
      >
        <option value="">역할 선택</option>
        <option value="brand">브랜드</option>
        <option value="influencer">인플루언서</option>
      </select>
      <textarea
        value={profile.bio}
          onChange={e => setProfile((p: any) => ({ ...p, bio: e.target.value }))}
        placeholder="자기소개"
        className="border p-2 rounded"
        rows={3}
      />
      <input
        type="file"
        accept="image/*"
        onChange={e => setImage(e.target.files?.[0] ?? null)}
      />
        <button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-2 rounded font-bold shadow hover:from-blue-600 hover:to-blue-800 transition-colors" disabled={loading}>
        {loading ? '저장 중...' : '저장'}
      </button>
      {message && <div className="text-center text-green-600">{message}</div>}
    </form>
    </div>
  );
} 