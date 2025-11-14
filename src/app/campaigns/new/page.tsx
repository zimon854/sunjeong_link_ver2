'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/database.types';
import { useNativeToast } from '@/hooks/useNativeToast';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const categories = [
  '뷰티',
  '라이프',
  '푸드',
  '패션',
  '홈리빙',
  '테크',
];

const statusOptions = ['진행중', '모집중', '종료', '대기'];

type NewCampaignForm = {
  title: string;
  brand: string;
  category: string;
  price: string;
  status: string;
  shopUrl: string;
  imageUrl: string;
  participants: string;
  description: string;
};

const createInitialForm = (): NewCampaignForm => ({
  title: '',
  brand: '',
  category: categories[0],
  price: '',
  status: statusOptions[0],
  shopUrl: '',
  imageUrl: '',
  participants: '',
  description: '',
});

export default function CampaignCreatePage() {
  const { showSuccess, showError } = useNativeToast();
  const { canManage, loading: authLoading } = useAdminAuth();
  const router = useRouter();

  const hasSupabaseConfig = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  const supabase = useMemo(() => {
    if (!hasSupabaseConfig) {
      return null;
    }
    return createClient();
  }, [hasSupabaseConfig]);

  const [form, setForm] = useState<NewCampaignForm>(() => createInitialForm());
  const [submitting, setSubmitting] = useState(false);

  const handleFormChange = <K extends keyof NewCampaignForm,>(field: K, value: NewCampaignForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canManage) {
      showError('관리자만 캠페인을 등록할 수 있습니다.', { position: 'center' });
      return;
    }

    if (!form.title.trim() || !form.brand.trim() || !form.category.trim()) {
      showError('필수 항목을 모두 입력해 주세요.', { position: 'center' });
      return;
    }

    const priceValue = Number(form.price);
    if (!Number.isFinite(priceValue) || priceValue < 0) {
      showError('가격은 0 이상의 숫자로 입력해 주세요.', { position: 'center' });
      return;
    }

    const participantsValue = form.participants.trim() !== '' ? Number(form.participants) : undefined;
    if (participantsValue !== undefined && (!Number.isFinite(participantsValue) || participantsValue < 0)) {
      showError('참여 인원은 0 이상의 숫자로 입력해 주세요.', { position: 'center' });
      return;
    }

    if (!hasSupabaseConfig || !supabase) {
      showError('캠페인 저장을 위한 데이터베이스 구성이 필요합니다.', { position: 'center' });
      return;
    }

    const now = new Date().toISOString();
    const payload: Database['public']['Tables']['campaigns']['Insert'] = {
      title: form.title.trim(),
      brand: form.brand.trim(),
      category: form.category.trim(),
      price: priceValue,
      status: form.status.trim() || undefined,
      shopify_url: form.shopUrl.trim() || undefined,
      image: form.imageUrl.trim() || undefined,
      participants: typeof participantsValue === 'number' ? participantsValue : undefined,
      description: form.description.trim() || undefined,
      created_at: now,
      updated_at: now,
    };

    setSubmitting(true);

    try {
      const { error } = await supabase.from('campaigns').insert(payload);

      if (error) {
        throw error;
      }

      showSuccess('캠페인이 등록되었습니다.', { position: 'center' });
      setForm(createInitialForm());
      setTimeout(() => router.push('/campaigns'), 600);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '캠페인 등록 중 오류가 발생했습니다.';
      showError(message, { position: 'center' });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center text-slate-500 space-y-3">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-300/60 border-t-blue-500" />
          <p>관리자 권한을 확인하는 중입니다.</p>
        </div>
      </div>
    );
  }

  if (!canManage) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">관리자 전용 페이지</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            캠페인 생성은 관리자만 사용할 수 있습니다. 관리자 계정으로 로그인해 주세요.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold shadow-sm transition"
          >
            관리자 로그인
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-3">
          <p className="text-sm font-semibold text-blue-600/80">Campaign Admin</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">새로운 캠페인 등록</h1>
          <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
            Supabase 캠페인 테이블과 연동되어 즉시 리스트에 반영됩니다. 브랜드 정보와 핵심 지표를 입력해 주세요.
          </p>
        </header>

        {!hasSupabaseConfig && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4 text-sm text-amber-700 shadow-sm">
            Supabase 환경 변수가 설정되어 있지 않아 데이터베이스에 저장할 수 없습니다. 환경 변수를 확인해 주세요.
          </div>
        )}

        <section className="rounded-3xl border border-blue-200 bg-blue-50/70 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900">캠페인 기본 정보</h2>
              <p className="text-sm text-slate-600">* 표시는 필수 입력 항목입니다.</p>
            </div>
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition"
            >
              캠페인 목록 보기
              <span aria-hidden>→</span>
            </Link>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-2 text-sm text-slate-600">
                <span className="font-semibold text-slate-800">캠페인명*</span>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  placeholder="예: 여름맞이 쿨링 선크림 체험단"
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  required
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-600">
                <span className="font-semibold text-slate-800">브랜드명*</span>
                <input
                  type="text"
                  value={form.brand}
                  onChange={(e) => handleFormChange('brand', e.target.value)}
                  placeholder="브랜드 이름을 입력하세요"
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  required
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-600">
                <span className="font-semibold text-slate-800">카테고리*</span>
                <select
                  value={form.category}
                  onChange={(e) => handleFormChange('category', e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-600">
                <span className="font-semibold text-slate-800">상태*</span>
                <select
                  value={form.status}
                  onChange={(e) => handleFormChange('status', e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-2 text-sm text-slate-600">
                <span className="font-semibold text-slate-800">제품 가격(원)*</span>
                <input
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => handleFormChange('price', e.target.value)}
                  placeholder="숫자만 입력"
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  required
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-600">
                <span className="font-semibold text-slate-800">예상 참여 인원</span>
                <input
                  type="number"
                  min={0}
                  value={form.participants}
                  onChange={(e) => handleFormChange('participants', e.target.value)}
                  placeholder="숫자만 입력"
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-2 text-sm text-slate-600">
                <span className="font-semibold text-slate-800">대표 이미지 URL</span>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => handleFormChange('imageUrl', e.target.value)}
                  placeholder="https://..."
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-600">
                <span className="font-semibold text-slate-800">상세 페이지(URL)</span>
                <input
                  type="url"
                  value={form.shopUrl}
                  onChange={(e) => handleFormChange('shopUrl', e.target.value)}
                  placeholder="캠페인 상세 페이지 혹은 쇼핑몰 링크"
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </label>
            </div>

            <label className="flex flex-col gap-2 text-sm text-slate-600">
              <span className="font-semibold text-slate-800">캠페인 설명</span>
              <textarea
                value={form.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="캠페인에 대한 상세한 설명을 입력해주세요. (제품 특징, 참여 방법 등)"
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 min-h-[140px]"
              />
            </label>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
              <p className="text-xs text-slate-500">
                저장 즉시 캠페인 리스트에 반영되며, 수정은 추후 관리자 대시보드에서 지원할 예정입니다.
              </p>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={submitting || !hasSupabaseConfig}
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    저장 중...
                  </span>
                ) : (
                  '캠페인 등록하기'
                )}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
