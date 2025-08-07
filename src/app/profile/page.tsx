'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import AdaptiveLayout from '@/components/AdaptiveLayout';

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) {
          setProfile(data);
          if (data.image) {
            const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(data.image);
            setImagePreview(publicUrl);
          }
        }
      } else {
        // 로그인 페이지로 리디렉션 또는 메시지 표시
      }
    };
    fetchUserAndProfile();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setMessage('');
    let imageUrl = profile.image;

    if (imageFile) {
      const { data, error } = await supabase.storage.from('profiles').upload(`img/${user.id}_${Date.now()}_${imageFile.name}`, imageFile, { upsert: true });
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
      image: imageUrl,
    });

    setLoading(false);
    if (error) {
      setMessage('프로필 저장 실패: ' + error.message);
    } else {
      setMessage('프로필이 성공적으로 저장되었습니다.');
      setIsEditing(false);
    }
  };

  if (!user) {
    return (
      <AdaptiveLayout title="로그인 필요">
        <div className="text-center text-blue-300/70 py-20">
          <p>프로필을 보려면 로그인이 필요합니다.</p>
          <Link href="/auth" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg">로그인 페이지로</Link>
        </div>
      </AdaptiveLayout>
    );
  }

  return (
    <AdaptiveLayout title="내 프로필">
      <div className="w-full max-w-3xl mx-auto text-white">
        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-[#1e293b] to-[#121826] rounded-3xl p-8 shadow-2xl border border-blue-500/20">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <div className="relative">
              <Image
                src={imagePreview || '/profile_sample.jpg'}
                alt="프로필"
                width={128}
                height={128}
                className="w-32 h-32 rounded-full border-4 border-blue-500/60 object-cover shadow-lg"
              />
              {isEditing && (
                <label htmlFor="profile-image-upload" className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 5.232z"></path></svg>
                  <input id="profile-image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
            <div className="text-center md:text-left flex-1">
              {isEditing ? (
                <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="text-4xl font-bold bg-transparent border-b-2 border-blue-500/50 focus:border-blue-400 outline-none mb-2 w-full" placeholder="이름" />
              ) : (
                <h1 className="text-4xl font-bold mb-2">{profile.name || user.email}</h1>
              )}
              <p className="text-blue-300/80 mb-4">{user.email}</p>
              {isEditing ? (
                <select value={profile.role} onChange={e => setProfile({...profile, role: e.target.value})} className="bg-blue-950/70 border border-blue-700 rounded-lg px-3 py-2 text-white w-full mb-4">
                  <option value="" className="bg-blue-900">역할 선택</option>
                  <option value="brand" className="bg-blue-900">브랜드</option>
                  <option value="influencer" className="bg-blue-900">인플루언서</option>
                </select>
              ) : (
                <p className="text-lg font-semibold text-green-400">{profile.role === 'brand' ? '브랜드' : profile.role === 'influencer' ? '인플루언서' : '역할 미설정'}</p>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">자기소개</h2>
            {isEditing ? (
              <textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="w-full bg-blue-950/70 border border-blue-700 rounded-lg px-4 py-3 text-white min-h-[100px]" placeholder="자신을 소개해주세요."></textarea>
            ) : (
              <p className="text-blue-200/90 leading-relaxed whitespace-pre-line">{profile.bio || '자기소개가 없습니다.'}</p>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">주요 실적</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="진행 캠페인" value={`${dummyStats.campaigns}개`} />
              <StatCard label="총 매출" value={`${dummyStats.totalSales.toLocaleString()}원`} />
              <StatCard label="평균 전환율" value={`${dummyStats.avgConversion.toFixed(1)}%`} />
              <StatCard label="리뷰 평점" value={`${dummyStats.avgRating.toFixed(1)}`} />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            {isEditing ? (
              <>
                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 rounded-lg bg-gray-600 hover:bg-gray-700 transition font-semibold">취소</button>
                <button type="submit" className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold" disabled={loading}>{loading ? '저장 중...' : '저장하기'}</button>
              </>
            ) : (
              <button type="button" onClick={() => setIsEditing(true)} className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold">프로필 수정</button>
            )}
          </div>
          {message && <p className="text-center mt-4 text-green-400">{message}</p>}
        </form>
      </div>
    </AdaptiveLayout>
  );
}

function StatCard({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="bg-blue-950/40 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg border border-blue-800/50">
      <p className="text-sm text-blue-300/70 font-semibold mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}