'use client';
import React, { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import AdaptiveLayout from '@/components/AdaptiveLayout';
import Image from 'next/image';

interface Message {
  id: number;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

// 가상 사용자 데이터
const mockUsers: { [key: string]: { name: string; avatar: string } } = {
  'user1': { name: '브랜드 담당자', avatar: '/profile_sample.jpg' },
  'user2': { name: '인플루언서 Mina', avatar: '/campaign_sample/sample2.jpeg' },
};

export default function ChatPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [roomId, setRoomId] = useState<string>('room1'); // 기본 채팅방
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [rooms, setRooms] = useState<string[]>(['room1', 'room2']); // 가상 채팅방 목록
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUser(data.user);
    });
  }, []);

  useEffect(() => {
    if (!roomId) return;
    fetchMessages(roomId);
    const channel = supabase
      .channel(`realtime:messages:${roomId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` }, payload => {
        setMessages(msgs => [...msgs, payload.new as Message]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async (currentRoomId: string) => {
    const { data, error } = await supabase.from('messages').select('*').eq('room_id', currentRoomId).order('created_at', { ascending: true });
    if (!error && data) setMessages(data);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;
    await supabase.from('messages').insert({ room_id: roomId, sender_id: user.id, content: input });
    setInput('');
  };

  const getOtherUserId = (roomId: string) => {
    // 실제 앱에서는 채팅방 ID에서 상대방 ID를 추출하는 로직 필요
    return roomId === 'room1' ? 'user2' : 'user1';
  }

  if (!user) {
    return <AdaptiveLayout title="로그인 필요"><div className="text-center text-blue-300/70 py-20">채팅을 보려면 로그인이 필요합니다.</div></AdaptiveLayout>;
  }

  return (
    <AdaptiveLayout title="실시간 채팅">
      <div className="w-full max-w-5xl mx-auto h-[calc(100vh-200px)] flex gap-6 text-white">
        {/* 채팅방 목록 */}
        <div className="w-1/3 bg-[#181830]/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-blue-500/20 flex flex-col">
          <h2 className="text-xl font-bold mb-4 p-2">대화 목록</h2>
          <ul className="space-y-2 overflow-y-auto">
            {rooms.map(r => {
              const otherUserId = getOtherUserId(r);
              const otherUser = mockUsers[otherUserId];
              return (
                <li key={r} onClick={() => setRoomId(r)} className={`p-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-4 ${roomId === r ? 'bg-blue-600/50' : 'hover:bg-white/10'}`}>
                  <Image src={otherUser.avatar} alt={otherUser.name} width={48} height={48} className="w-12 h-12 rounded-full object-cover"/>
                  <div>
                    <p className="font-semibold">{otherUser.name}</p>
                    <p className="text-sm text-blue-300/70">마지막 메시지...</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        {/* 채팅 화면 */}
        <div className="w-2/3 bg-[#181830]/90 backdrop-blur-md rounded-2xl shadow-lg border border-blue-500/20 flex flex-col">
          <div className="p-4 border-b border-blue-800/50 flex items-center gap-4">
            <Image src={mockUsers[getOtherUserId(roomId)].avatar} alt="avatar" width={40} height={40} className="w-10 h-10 rounded-full object-cover"/>
            <h2 className="font-bold text-lg">{mockUsers[getOtherUserId(roomId)].name}</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map(msg => (
              <div key={msg.id} className={`flex items-end gap-2 ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                {msg.sender_id !== user.id && <Image src={mockUsers[getOtherUserId(roomId)].avatar} alt="avatar" width={32} height={32} className="w-8 h-8 rounded-full object-cover self-start"/>}
                <div>
                  <div className={`px-4 py-3 rounded-2xl max-w-md shadow ${msg.sender_id === user.id ? 'bg-blue-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
                    {msg.content}
                  </div>
                  <p className={`text-xs mt-1 ${msg.sender_id === user.id ? 'text-right' : 'text-left'} text-blue-300/60`}>{new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSend} className="p-4 border-t border-blue-800/50 flex items-center gap-4">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1 bg-blue-950/50 border-2 border-blue-800/70 rounded-full px-5 py-3 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="메시지를 입력하세요..."
            />
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 active:scale-100 shadow-lg">
              전송
            </button>
          </form>
        </div>
      </div>
    </AdaptiveLayout>
  );
}