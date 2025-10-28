"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { createClient } from '../../../../lib/supabaseClient';
import type { User } from '@supabase/auth-js';

interface Profile {
  id: string;
  role: string;
}

interface Match {
  id: number;
  campaign_id: number;
  influencer_id: string;
  status: string;
}

interface MatchPageClientProps {
  campaignId: string | null;
}

export default function MatchPageClient({ campaignId }: MatchPageClientProps) {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchMatches = useCallback(async () => {
    if (!campaignId) return;
    const { data, error } = await supabase.from('matches').select('*').eq('campaign_id', campaignId);
    if (!error && data) setMatches(data);
    setLoading(false);
  }, [campaignId, supabase]);

  const fetchProfile = useCallback(
    async (userId: string) => {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (!error && data) setProfile(data);
    },
    [supabase]
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        fetchProfile(data.user.id);
      }
    });
  }, [fetchProfile, supabase]);

  useEffect(() => {
    if (!campaignId) return;
    fetchMatches();
  }, [campaignId, fetchMatches]);

  const handleApply = async () => {
    setMessage('');
    if (!user) {
      setMessage('로그인이 필요합니다.');
      return;
    }
    const { error } = await supabase.from('matches').insert({
      campaign_id: campaignId,
      influencer_id: user.id,
      status: 'pending',
    });
    if (!error) {
      setMessage('참여 신청 완료!');
      fetchMatches();
    } else {
      setMessage(error.message);
    }
  };

  const handleAccept = async (id: number) => {
    await supabase.from('matches').update({ status: 'accepted' }).eq('id', id);
    fetchMatches();
  };
  const handleReject = async (id: number) => {
    await supabase.from('matches').update({ status: 'rejected' }).eq('id', id);
    fetchMatches();
  };

  if (!campaignId) {
    return <div className="mt-10 text-center">캠페인 정보를 찾을 수 없습니다.</div>;
  }

  if (!user || !profile) return <div className="mt-10 text-center">로그인이 필요합니다.</div>;
  if (loading) return <div className="mt-10 text-center">로딩 중...</div>;

  // 인플루언서: 참여 신청/상태 확인
  if (profile.role === 'influencer') {
    const myMatch = matches.find((m) => m.influencer_id === user.id);
    return (
      <div className="max-w-md mx-auto mt-10 p-6 border rounded bg-white text-center">
        <h2 className="text-xl font-bold mb-4">캠페인 참여 신청</h2>
        {myMatch ? (
          <div>
            <div>
              신청 상태:{' '}
              <span
                className={
                  myMatch.status === 'accepted'
                    ? 'text-green-600'
                    : myMatch.status === 'rejected'
                      ? 'text-red-600'
                      : 'text-gray-600'
                }
              >
                {myMatch.status === 'accepted'
                  ? '수락됨'
                  : myMatch.status === 'rejected'
                    ? '거절됨'
                    : '대기중'}
              </span>
            </div>
          </div>
        ) : (
          <button onClick={handleApply} className="bg-blue-600 text-white px-4 py-2 rounded">
            참여 신청
          </button>
        )}
        {message && <div className="mt-2 text-green-600">{message}</div>}
      </div>
    );
  }

  // 브랜드: 신청자 목록/수락/거절
  if (profile.role === 'brand') {
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 border rounded bg-white">
        <h2 className="text-xl font-bold mb-4">참여 신청자 관리</h2>
        {matches.length === 0 && <div>신청자가 없습니다.</div>}
        {matches.map((m) => (
          <div key={m.id} className="flex items-center justify-between border-b py-2">
            <div>
              <span className="font-bold">{m.influencer_id}</span>
              <span
                className={
                  m.status === 'accepted'
                    ? 'text-green-600 ml-2'
                    : m.status === 'rejected'
                      ? 'text-red-600 ml-2'
                      : 'text-gray-600 ml-2'
                }
              >
                {m.status === 'accepted'
                  ? '수락됨'
                  : m.status === 'rejected'
                    ? '거절됨'
                    : '대기중'}
              </span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleAccept(m.id)} className="bg-green-500 text-white px-3 py-1 rounded">
                수락
              </button>
              <button onClick={() => handleReject(m.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                거절
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
