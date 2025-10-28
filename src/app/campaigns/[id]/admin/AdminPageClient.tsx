"use client";
import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

import { createClient } from '../../../../lib/supabaseClient';

type ApprovalStatus = 'pending' | 'approved' | 'rejected';
type ContentSource = 'supabase' | 'sample' | 'demoUpload';

interface Content {
  id: number;
  media_url: string;
  caption: string;
  approval_status: ApprovalStatus;
  feedback: string;
  source: ContentSource;
  created_at?: string;
  file_name?: string;
}

const STORAGE_KEY = 'demoCampaignUploads';
const hasSupabaseConfig = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

function readDemoUploads(campaignId: number): Content[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Record<string, Content[]>;
    return (parsed[campaignId] ?? []).map((item) => ({
      ...item,
      source: 'demoUpload',
    }));
  } catch (error) {
    console.warn('Unable to read demo uploads:', error);
    return [];
  }
}

function persistDemoUploads(campaignId: number, items: Content[]) {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Record<string, Content[]>) : {};
    parsed[campaignId] = items.map((item) => ({
      ...item,
      source: 'demoUpload',
    }));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch (error) {
    console.warn('Unable to store demo uploads:', error);
  }
}

interface AdminPageClientProps {
  campaignId?: string | null;
}

export default function AdminPageClient({ campaignId }: AdminPageClientProps) {
  const numericCampaignId = useMemo(() => {
    if (!campaignId) return null;
    const parsed = Number(campaignId);
    return Number.isNaN(parsed) ? null : parsed;
  }, [campaignId]);

  const supabase = useMemo(() => (hasSupabaseConfig ? createClient() : null), []);

  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<Record<number, string>>({});
  const [dataSource, setDataSource] = useState<'supabase' | 'demo'>('supabase');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!numericCampaignId) {
      setError('유효한 캠페인 ID가 아닙니다.');
      setContents([]);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const loadDemoData = () => {
      const demoUploads = readDemoUploads(numericCampaignId);
      if (!isMounted) return;
      setContents(demoUploads);
      setDataSource('demo');
      setError(demoUploads.length === 0 ? '콘텐츠 데이터가 아직 등록되지 않았습니다.' : null);
      setLoading(false);
    };

    if (!hasSupabaseConfig || !supabase) {
      loadDemoData();
      return;
    }

    const fetchContents = async () => {
      const { data, error: fetchError } = await supabase
        .from('content')
        .select('*')
        .eq('campaign_id', numericCampaignId);

      if (!isMounted) return;

      if (fetchError) {
        console.warn('콘텐츠 조회 실패, 로컬 데모 데이터를 사용합니다:', fetchError);
        loadDemoData();
        return;
      }

      const normalized: Content[] = (data ?? []).map((item) => ({
        id: item.id,
        media_url: item.media_url ?? '',
        caption: item.caption ?? '',
        approval_status: (item.approval_status as ApprovalStatus) ?? 'pending',
        feedback: item.feedback ?? '',
        source: 'supabase',
        created_at: item.created_at ?? undefined,
      }));

      setContents(normalized);
      setDataSource('supabase');
      setError(normalized.length === 0 ? '등록된 콘텐츠가 없습니다.' : null);
      setLoading(false);
    };

    fetchContents();

    return () => {
      isMounted = false;
    };
  }, [numericCampaignId, supabase]);

  const persistIfDemo = (nextContents: Content[]) => {
    if (dataSource !== 'demo' || numericCampaignId === null) return;
    const demoItems = nextContents.filter((item) => item.source === 'demoUpload');
    persistDemoUploads(numericCampaignId, demoItems);
  };

  const resolveMediaUrl = (content: Content) => {
    if (content.source !== 'supabase' || !supabase) {
      return content.media_url;
    }

    const { data } = supabase.storage.from('content').getPublicUrl(content.media_url);
    return data?.publicUrl ?? '';
  };

  const patchStatus = (id: number, status: ApprovalStatus) => {
    setContents((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, approval_status: status } : item,
      );
      persistIfDemo(next);
      return next;
    });
  };

  const handleApprove = async (id: number) => {
    if (!supabase || dataSource !== 'supabase') {
      patchStatus(id, 'approved');
      return;
    }

    await supabase.from('content').update({ approval_status: 'approved' }).eq('id', id);
    patchStatus(id, 'approved');
  };

  const handleReject = async (id: number) => {
    if (!supabase || dataSource !== 'supabase') {
      patchStatus(id, 'rejected');
      return;
    }

    await supabase.from('content').update({ approval_status: 'rejected' }).eq('id', id);
    patchStatus(id, 'rejected');
  };

  const handleFeedback = async (id: number) => {
    const feedback = feedbacks[id] || '';

    if (!supabase || dataSource !== 'supabase') {
      setContents((prev) => {
        const next = prev.map((item) => (item.id === id ? { ...item, feedback } : item));
        persistIfDemo(next);
        return next;
      });
      setFeedbacks((prev) => ({ ...prev, [id]: '' }));
      return;
    }

    await supabase.from('content').update({ feedback }).eq('id', id);
    setContents((prev) =>
      prev.map((item) => (item.id === id ? { ...item, feedback } : item)),
    );
    setFeedbacks((prev) => ({ ...prev, [id]: '' }));
  };

  if (loading) {
    return <div className="mt-10 text-center">로딩 중...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">콘텐츠 승인/피드백</h2>
      {dataSource === 'demo' && (
        <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
          Supabase 환경이 설정되지 않아 로컬 데모 데이터로 동작 중입니다. 업로드한 샘플 콘텐츠는 이 브라우저에만 저장됩니다.
        </div>
      )}
      {error && !contents.length && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {!error && contents.length === 0 && (
        <div className="rounded-md border border-border bg-white p-6 text-center text-sm text-gray-600">
          업로드된 콘텐츠가 없습니다.
        </div>
      )}
      {contents.map((content) => {
        const mediaUrl = resolveMediaUrl(content);
        const isVideo = mediaUrl?.match(/\.(mp4|webm)$/i);
        return (
          <div key={content.id} className="border rounded p-4 mb-4 bg-white">
            {mediaUrl ? (
              isVideo ? (
                <video src={mediaUrl} controls className="w-full max-h-60 mb-2" />
              ) : (
                <div className="relative mb-2 h-60 w-full">
                  <Image
                    src={mediaUrl}
                    alt={content.file_name ? `업로드된 파일 ${content.file_name}` : '업로드된 콘텐츠'}
                    fill
                    sizes="(max-width: 768px) 100vw, 640px"
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )
            ) : (
              <div className="mb-2 rounded bg-gray-100 p-4 text-center text-sm text-gray-500">
                미리보기를 제공할 수 없는 콘텐츠입니다.
              </div>
            )}
            <div className="mb-2">캡션: {content.caption || '캡션이 없습니다.'}</div>
            <div className="mb-2">
              상태:{' '}
              <span
                className={
                  content.approval_status === 'approved'
                    ? 'text-green-600'
                    : content.approval_status === 'rejected'
                    ? 'text-red-600'
                    : 'text-gray-600'
                }
              >
                {content.approval_status === 'approved'
                  ? '승인됨'
                  : content.approval_status === 'rejected'
                  ? '반려됨'
                  : '대기중'}
              </span>
            </div>
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => handleApprove(content.id)}
                className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-40"
              >
                승인
              </button>
              <button
                onClick={() => handleReject(content.id)}
                className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-40"
              >
                반려
              </button>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={feedbacks[content.id] ?? content.feedback ?? ''}
                onChange={(e) => setFeedbacks((f) => ({ ...f, [content.id]: e.target.value }))}
                placeholder="피드백 입력"
                className="border p-1 rounded flex-1"
              />
              <button
                onClick={() => handleFeedback(content.id)}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                피드백 저장
              </button>
            </div>
            {content.feedback && (
              <div className="mt-1 text-sm text-blue-700">피드백: {content.feedback}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
