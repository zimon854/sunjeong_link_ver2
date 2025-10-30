'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AdaptiveLayout from '@/components/AdaptiveLayout';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface UserProfile {
  name: string;
  role: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  focus: string;
  availability: string;
  timezone: string;
  favoriteQuote: string;
  personalNote: string;
  image: string;
}

const STORAGE_KEY = 'userProfile';

const defaultProfile: UserProfile = {
  name: '홍길동',
  role: '커머스 매니저',
  bio: '브랜드와 파트너가 함께 성장할 수 있는 협업을 기획하고 있습니다. 데이터로 방향을 잡고, 모든 참여자가 성과를 체감할 수 있는 경험을 설계하는 일을 좋아합니다.',
  email: 'you@example.com',
  phone: '',
  location: '서울, 대한민국',
  focus: '브랜드 협업 · 콘텐츠 전략',
  availability: '평일 10:00 ~ 18:00',
  timezone: 'Asia/Seoul (KST)',
  favoriteQuote: '나의 이야기는 내가 직접 만든다.',
  personalNote: '올해는 파트너 온보딩 매뉴얼을 완성하고, 월간 콘텐츠 리포트를 자동화하기.',
  image: '/logo/sunjeong_link_logo.png',
};

const profileStats = {
  campaigns: 12,
  totalSales: 8600000,
  avgConversion: 3.7,
  avgRating: 4.8,
};

export default function ProfilePage() {
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(defaultProfile.image);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const storedProfile = window.localStorage.getItem(STORAGE_KEY);
      const legacyProfile = storedProfile ? null : window.localStorage.getItem('adminProfile');
      const raw = storedProfile ?? legacyProfile;
      if (!raw) return;

      const parsed = JSON.parse(raw) as Partial<UserProfile> & { teamNote?: string };
      const nextProfile: UserProfile = {
        ...defaultProfile,
        ...parsed,
        personalNote: parsed.personalNote ?? parsed.teamNote ?? defaultProfile.personalNote,
      };

      setProfile(nextProfile);
      setImagePreview(nextProfile.image || defaultProfile.image);

      if (!storedProfile) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProfile));
        window.localStorage.removeItem('adminProfile');
      }
    } catch (error) {
  console.error('프로필 로드 실패:', error);
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
  setProfile((prev) => ({ ...prev, image: previewUrl }));
    }
  };

  const handleProfileChange = <K extends keyof UserProfile>(field: K, value: UserProfile[K]) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

  // 개인 프로필 정보는 로컬 스토리지에만 저장
    try {
  const updatedProfile: UserProfile = {
        ...profile,
        image: imageFile ? imagePreview : profile.image || defaultProfile.image,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
      localStorage.removeItem('adminProfile');
      setProfile(updatedProfile);
      setImagePreview(updatedProfile.image || defaultProfile.image);
  setMessage('프로필이 성공적으로 저장되었습니다.');
      setIsEditing(false);
    } catch (error) {
      setMessage('프로필 저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }

    setLoading(false);
  };

  if (authLoading) {
    return (
      <AdaptiveLayout title="프로필">
        <div className="text-center text-slate-500 py-20">
          <p>로딩 중...</p>
        </div>
      </AdaptiveLayout>
    );
  }

  if (!isAdmin) {
    return (
      <AdaptiveLayout title="로그인 필요">
        <div className="text-center text-slate-600 py-20 space-y-4">
          <p>내 프로필을 확인하려면 로그인이 필요합니다.</p>
          <Link
            href="/auth"
            className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold shadow-sm transition"
          >
            로그인하기
          </Link>
        </div>
      </AdaptiveLayout>
    );
  }

  return (
    <AdaptiveLayout title="내 프로필">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8">
        <div className="w-full max-w-3xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 space-y-8">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="relative self-start">
                <Image
                  src={imagePreview || '/logo/sunjeong_link_logo.png'}
                  alt="프로필"
                  width={140}
                  height={140}
                  className="w-28 h-28 md:w-32 md:h-32 rounded-full border border-slate-200 object-cover bg-white"
                />
                {isEditing && (
                  <label
                    htmlFor="profile-image-upload"
                    className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 5.232z"></path></svg>
                    <input id="profile-image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
              <div className="flex-1 space-y-4 text-center md:text-left">
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-3xl md:text-4xl font-bold text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                    placeholder="이름"
                  />
                ) : (
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{profile.name}</h1>
                )}
                <p className="text-sm text-slate-500">내 프로필을 업데이트하고 협업 파트너와 공유할 정보를 관리하세요.</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.role}
                      onChange={(e) => handleProfileChange('role', e.target.value)}
                      className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                      placeholder="역할"
                    />
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1 text-sm font-semibold text-slate-700">
                      <span role="img" aria-hidden>💼</span>
                      {profile.role || '역할을 입력하세요'}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1 text-sm font-semibold text-slate-600">
                    <span role="img" aria-hidden>📍</span>
                    {profile.location || '위치를 입력하세요'}
                  </span>
                </div>
              </div>
              <div className="grid gap-3 text-sm text-slate-600">
                <ProfileHighlight icon="�" label="주요 이용 시간" value={profile.availability} />
                <ProfileHighlight icon="🌏" label="타임존" value={profile.timezone} />
                <ProfileHighlight icon="⭐" label="관심 분야" value={profile.focus} />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span role="img" aria-hidden="true">💬</span>
              자기소개
            </h2>
            {isEditing ? (
              <textarea
                value={profile.bio}
                onChange={(e) => handleProfileChange('bio', e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 min-h-[140px] focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
                placeholder="자신을 소개해주세요. 일을 대할 때의 태도나 소중히 여기는 가치를 적어보세요."
              />
            ) : (
              <p className="text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4">
                {profile.bio || '자기소개가 없습니다.'}
              </p>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <span role="img" aria-hidden="true">📬</span>
                연락처 & 가용성
              </h3>
              <div className="space-y-3 text-sm">
                <EditableField
                  label="이메일"
                  value={profile.email}
                  onChange={(value) => handleProfileChange('email', value)}
                  isEditing={isEditing}
                  placeholder="이메일 주소"
                  type="email"
                />
                <EditableField
                  label="연락처"
                  value={profile.phone}
                  onChange={(value) => handleProfileChange('phone', value)}
                  isEditing={isEditing}
                  placeholder="연락 가능한 번호"
                />
                <EditableField
                  label="위치"
                  value={profile.location}
                  onChange={(value) => handleProfileChange('location', value)}
                  isEditing={isEditing}
                  placeholder="예: 서울, 대한민국"
                />
                <EditableField
                  label="운영 시간"
                  value={profile.availability}
                  onChange={(value) => handleProfileChange('availability', value)}
                  isEditing={isEditing}
                  placeholder="예: 평일 10:00 ~ 18:00"
                />
                <EditableField
                  label="타임존"
                  value={profile.timezone}
                  onChange={(value) => handleProfileChange('timezone', value)}
                  isEditing={isEditing}
                  placeholder="예: Asia/Seoul (KST)"
                />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <span role="img" aria-hidden="true">🧭</span>
                관심 분야 & 메모
              </h3>
              <EditableField
                label="관심 분야"
                value={profile.focus}
                onChange={(value) => handleProfileChange('focus', value)}
                isEditing={isEditing}
                placeholder="현재 집중하고 있는 주제나 관심사를 적어보세요."
              />
              <EditableField
                label="개인 메모"
                value={profile.personalNote}
                onChange={(value) => handleProfileChange('personalNote', value)}
                isEditing={isEditing}
                placeholder="기억하고 싶은 메모나 커리어 목표를 남겨보세요."
                multiline
              />
            </section>
          </div>

          <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6 md:p-8 flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
              <span role="img" aria-hidden="true">💡</span>
              내가 기억하고 싶은 한 문장
            </h3>
            {isEditing ? (
              <textarea
                value={profile.favoriteQuote}
                onChange={(e) => handleProfileChange('favoriteQuote', e.target.value)}
                className="w-full rounded-xl border border-blue-200 bg-white/70 px-4 py-3 text-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
                placeholder="마음에 담아두고 싶은 문장을 적어주세요."
              />
            ) : (
              <blockquote className="text-base italic text-blue-900 border-l-4 border-blue-300 pl-4">
                “{profile.favoriteQuote || '기억하고 싶은 문장을 추가해보세요.'}”
              </blockquote>
            )}
          </section>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">활동 요약</h2>
              <span className="text-xs text-slate-400">데이터는 샘플 값입니다.</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="진행 캠페인" value={profileStats.campaigns} suffix="개" />
              <StatCard label="총 매출" value={profileStats.totalSales} suffix="원" />
              <StatCard label="평균 전환율" value={profileStats.avgConversion} suffix="%" />
              <StatCard label="리뷰 평점" value={profileStats.avgRating} />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-3 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition font-semibold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold transition shadow-sm"
                  disabled={loading}
                >
                  {loading ? '저장 중...' : '저장하기'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-5 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold transition shadow-sm"
              >
                프로필 수정
              </button>
            )}
          </div>
          {message && <p className="text-center mt-2 text-emerald-600">{message}</p>}
        </form>
        </div>
      </div>
    </AdaptiveLayout>
  );
}

function ProfileHighlight({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-lg" aria-hidden>{icon}</span>
      <div>
        <p className="text-xs font-semibold text-slate-500">{label}</p>
  <p className="text-sm font-semibold text-slate-800 whitespace-pre-line">{value || '정보 없음'}</p>
      </div>
    </div>
  );
}

function EditableField({
  label,
  value,
  onChange,
  isEditing,
  placeholder,
  multiline = false,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  placeholder?: string;
  multiline?: boolean;
  type?: string;
}) {
  if (isEditing) {
    if (multiline) {
      return (
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-slate-500">{label}</span>
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition min-h-[90px]"
          />
        </label>
      );
    }

    return (
      <label className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-slate-500">{label}</span>
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
        />
      </label>
    );
  }

  if (!value) {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-slate-500">{label}</span>
        <span className="text-sm text-slate-400">정보가 아직 등록되지 않았습니다.</span>
      </div>
    );
  }

  if (label === '이메일') {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-slate-500">{label}</span>
        <a href={`mailto:${value}`} className="text-sm font-medium text-blue-600 hover:text-blue-700">
          {value}
        </a>
      </div>
    );
  }

  if (label === '연락처') {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-slate-500">{label}</span>
        <a href={`tel:${value}`} className="text-sm font-medium text-slate-700">
          {value}
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-700 whitespace-pre-line">{value}</span>
    </div>
  );
}

function StatCard({ label, value, suffix }: { label: string; value: number | string | null; suffix?: string }) {
  const display = value === null || value === undefined
    ? '데이터 없음'
    : typeof value === 'number'
      ? value.toLocaleString()
      : value;

  return (
    <div className="bg-slate-50 rounded-xl p-4 text-center shadow-sm border border-slate-200">
      <p className="text-sm text-slate-500 font-semibold mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900">
        {display}
        {display !== '데이터 없음' && suffix ? suffix : ''}
      </p>
    </div>
  );
}
