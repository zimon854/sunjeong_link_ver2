"use client";
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';

export default function ContentUploadPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params?.id;
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    let mediaUrl = '';
    if (file) {
      const { data, error } = await supabase.storage.from('content').upload(`media/${Date.now()}_${file.name}`, file);
      if (error) {
        setMessage('파일 업로드 실패: ' + error.message);
        setLoading(false);
        return;
      }
      mediaUrl = data.path;
    }
    const { error } = await supabase.from('content').insert([
      { campaign_id: campaignId, media_url: mediaUrl, caption, approval_status: 'pending' }
    ]);
    setLoading(false);
    setMessage(error ? error.message : '콘텐츠 업로드 완료!');
    if (!error) {
      setFile(null);
      setCaption('');
      setTimeout(() => router.push(`/campaigns/${campaignId}`), 1500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 flex flex-col gap-3 p-6 border rounded bg-white">
      <h2 className="text-xl font-bold mb-2">콘텐츠 업로드</h2>
      <input
        type="file"
        accept="image/*,video/*"
        onChange={e => setFile(e.target.files?.[0] ?? null)}
        required
      />
      <textarea
        value={caption}
        onChange={e => setCaption(e.target.value)}
        placeholder="캡션(설명) 입력"
        className="border p-2 rounded"
        rows={3}
        required
      />
      <button type="submit" className="bg-green-600 text-white p-2 rounded" disabled={loading}>
        {loading ? '업로드 중...' : '업로드'}
      </button>
      {message && <div className="text-center text-red-500">{message}</div>}
    </form>
  );
} 