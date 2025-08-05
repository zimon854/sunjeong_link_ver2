"use client";
import React, { useEffect, useRef, useState } from 'react';
import { createClient } from '../../lib/supabaseClient';

interface Message {
  id: number;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export default function ChatPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [roomId, setRoomId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [rooms, setRooms] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        fetchRooms(data.user.id);
      }
    });
  }, []);

  useEffect(() => {
    if (!roomId) return;
    fetchMessages(roomId);
    const channel = supabase
      .channel('realtime:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` }, payload => {
        setMessages(msgs => [...msgs, payload.new as Message]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchRooms = async (userId: string) => {
    // 단순히 참여한 채팅방(room_id) 목록 조회 (MVP)
    const { data, error } = await supabase.from('messages').select('room_id').or(`sender_id.eq.${userId}`);
    if (!error && data) {
      const uniqueRooms = Array.from(new Set((data as { room_id: string }[]).map((d) => d.room_id)));
      setRooms(uniqueRooms);
      if (uniqueRooms.length > 0) setRoomId(uniqueRooms[0]);
    }
  };

  const fetchMessages = async (roomId: string) => {
    const { data, error } = await supabase.from('messages').select('*').eq('room_id', roomId).order('created_at', { ascending: true });
    if (!error && data) setMessages(data);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;
    await supabase.from('messages').insert({
      room_id: roomId,
      sender_id: user.id,
      content: input
    });
    setInput('');
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center text-blue-200">로그인이 필요합니다.</div>;
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0c23] to-[#181826] flex flex-col items-center justify-center py-10 px-2">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-blue-900/30 flex flex-col h-[70vh]">
        <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-blue-700 to-blue-400 rounded-t-2xl">
          <div className="font-bold text-white text-lg">실시간 채팅</div>
        </div>
        <div className="flex border-b bg-blue-50 rounded-b-none rounded-t-none">
          {rooms.map(r => (
            <button
              key={r}
              onClick={() => setRoomId(r)}
              className={`flex-1 p-2 rounded-t-lg font-bold transition ${roomId === r ? 'bg-blue-600 text-white shadow' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
            >
              채팅방 {r.slice(0, 6)}...
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-blue-50">
          {messages.map(msg => (
            <div key={msg.id} className={`mb-2 flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}> 
              <div className={`px-4 py-2 rounded-2xl max-w-xs shadow ${msg.sender_id === user.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border'}`}>{msg.content}</div>
              <div className={`text-xs mt-1 ${msg.sender_id === user.id ? 'text-right text-blue-200 ml-2' : 'text-left text-gray-400 mr-2'}`}>{new Date(msg.created_at).toLocaleTimeString()}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSend} className="p-3 border-t flex bg-white rounded-b-2xl">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 border rounded-full px-4 py-2 mr-2 focus:ring-2 focus:ring-blue-400"
            placeholder="메시지 입력"
          />
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition">전송</button>
        </form>
      </div>
    </div>
  );
} 