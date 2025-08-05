"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '../../../../lib/supabaseClient';

interface Content {
  id: number;
  media_url: string;
  caption: string;
  approval_status: string;
  feedback: string;
}

export default function AdminPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const params = useParams();
  const campaignId = params?.id;
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<{[key:number]: string}>({});

  useEffect(() => {
    if (!campaignId) return;
    const fetchContents = async () => {
      const { data, error } = await supabase.from('content').select('*').eq('campaign_id', campaignId);
      if (!error && data) setContents(data);
      setLoading(false);
    };
    fetchContents();
  }, [campaignId]);

  const handleApprove = async (id: number) => {
    await supabase.from('content').update({ approval_status: 'approved' }).eq('id', id);
    setContents(contents => contents.map(c => c.id === id ? { ...c, approval_status: 'approved' } : c));
  };
  const handleReject = async (id: number) => {
    await supabase.from('content').update({ approval_status: 'rejected' }).eq('id', id);
    setContents(contents => contents.map(c => c.id === id ? { ...c, approval_status: 'rejected' } : c));
  };
  const handleFeedback = async (id: number) => {
    const feedback = feedbacks[id] || '';
    await supabase.from('content').update({ feedback }).eq('id', id);
    setContents(contents => contents.map(c => c.id === id ? { ...c, feedback } : c));
  };

  if (loading) return <div className="mt-10 text-center">로딩 중...</div>;
  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">콘텐츠 승인/피드백</h2>
      {contents.length === 0 && <div>업로드된 콘텐츠가 없습니다.</div>}
      {contents.map(content => (
        <div key={content.id} className="border rounded p-4 mb-4 bg-white">
          {content.media_url && (
            content.media_url.match(/\.(mp4|webm)$/i)
              ? <video src={supabase.storage.from('content').getPublicUrl(content.media_url).data.publicUrl} controls className="w-full max-h-60 mb-2" />
              : <img src={supabase.storage.from('content').getPublicUrl(content.media_url).data.publicUrl} alt="콘텐츠" className="w-full max-h-60 mb-2 object-contain" />
          )}
          <div className="mb-2">캡션: {content.caption}</div>
          <div className="mb-2">상태: <span className={
            content.approval_status === 'approved' ? 'text-green-600' :
            content.approval_status === 'rejected' ? 'text-red-600' : 'text-gray-600'}>
            {content.approval_status === 'approved' ? '승인됨' : content.approval_status === 'rejected' ? '반려됨' : '대기중'}
          </span></div>
          <div className="flex gap-2 mb-2">
            <button onClick={() => handleApprove(content.id)} className="bg-green-500 text-white px-3 py-1 rounded">승인</button>
            <button onClick={() => handleReject(content.id)} className="bg-red-500 text-white px-3 py-1 rounded">반려</button>
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={feedbacks[content.id] ?? content.feedback ?? ''}
              onChange={e => setFeedbacks(f => ({ ...f, [content.id]: e.target.value }))}
              placeholder="피드백 입력"
              className="border p-1 rounded flex-1"
            />
            <button onClick={() => handleFeedback(content.id)} className="bg-blue-500 text-white px-2 py-1 rounded">피드백 저장</button>
          </div>
          {content.feedback && <div className="mt-1 text-sm text-blue-700">피드백: {content.feedback}</div>}
        </div>
      ))}
    </div>
  );
} 