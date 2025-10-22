"use client";

import React, { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { createClient } from '../../../../lib/supabaseClient';

type ApprovalStatus = 'pending' | 'approved' | 'rejected';

interface DemoUpload {
  id: number;
  media_url: string;
  caption: string;
  approval_status: ApprovalStatus;
  feedback: string;
  source: 'demoUpload';
  created_at: string;
  file_name?: string;
}

const STORAGE_KEY = 'demoCampaignUploads';
const hasSupabaseConfig = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
const UPLOAD_DISABLED = true;

function upsertDemoUpload(campaignId: number, upload: DemoUpload) {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Record<string, DemoUpload[]>) : {};
    const existing = parsed[campaignId] ?? [];
    parsed[campaignId] = [...existing, upload];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch (error) {
    console.warn('Unable to persist demo upload:', error);
  }
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = (event) => reject(event);
    reader.readAsDataURL(file);
  });
}

interface UploadPageClientProps {
  campaignId: string | null;
}

export default function UploadPageClient({ campaignId }: UploadPageClientProps) {
  const router = useRouter();
  const numericCampaignId = useMemo(() => {
    if (!campaignId) return null;
    const parsed = Number(campaignId);
    return Number.isNaN(parsed) ? null : parsed;
  }, [campaignId]);

  const supabase = useMemo(() => (hasSupabaseConfig ? createClient() : null), []);

  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (UPLOAD_DISABLED) {
      setMessage('현재 콘텐츠 업로드 기능이 비활성화되었습니다.');
      return;
    }

    if (!campaignId || numericCampaignId === null) {
      setMessage('유효한 캠페인 ID를 찾을 수 없습니다.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      if (!supabase) {
        const mediaUrl = file ? await fileToDataUrl(file) : '';
        const demoPayload: DemoUpload = {
          id: Date.now(),
          media_url: mediaUrl,
          caption,
          approval_status: 'pending',
          feedback: '',
          source: 'demoUpload',
          created_at: new Date().toISOString(),
          file_name: file?.name,
        };
        upsertDemoUpload(numericCampaignId, demoPayload);
        setMessage('샘플 콘텐츠가 업로드되었습니다. (이 브라우저에서만 확인 가능)');
      } else {
        let mediaPath = '';
        if (file) {
          const path = `media/${Date.now()}_${file.name}`;
          const { data, error: uploadError } = await supabase.storage
            .from('content')
            .upload(path, file);
          if (uploadError) {
            throw new Error(uploadError.message);
          }
          mediaPath = data?.path ?? '';
        }

        const { error: insertError } = await supabase.from('content').insert([
          {
            campaign_id: numericCampaignId,
            media_url: mediaPath,
            caption,
            approval_status: 'pending' as ApprovalStatus,
          },
        ]);

        if (insertError) {
          throw new Error(insertError.message);
        }

        setMessage('콘텐츠 업로드가 완료되었습니다.');
      }

      setFile(null);
      setCaption('');
      setTimeout(() => router.push(`/campaigns/${campaignId}`), 1500);
    } catch (err) {
      const fallbackMessage = err instanceof Error ? err.message : '업로드에 실패했습니다.';
      setMessage(fallbackMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 flex flex-col gap-3 p-6 border rounded bg-white">
      <h2 className="text-xl font-bold mb-2">콘텐츠 업로드</h2>
      {UPLOAD_DISABLED && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
          현재 캠페인 콘텐츠 업로드 및 참여하기 기능은 중단되었습니다. 관리자 승인 후 다시 이용 가능합니다.
        </div>
      )}
      {!UPLOAD_DISABLED && !supabase && (
        <div className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded p-3">
          Supabase 환경이 설정되지 않아 샘플 모드로 업로드됩니다. 업로드한 파일은 이 브라우저에서만 확인 가능합니다.
        </div>
      )}
      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        required
        disabled={UPLOAD_DISABLED}
      />
      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="캡션(설명) 입력"
        className="border p-2 rounded"
        rows={3}
        required
        disabled={UPLOAD_DISABLED}
      />
      <button type="submit" className="bg-green-600 text-white p-2 rounded disabled:bg-gray-400" disabled={loading || UPLOAD_DISABLED}>
        {loading ? '업로드 중...' : '업로드'}
      </button>
      {message && <div className="text-center text-sm text-primary">{message}</div>}
    </form>
  );
}
