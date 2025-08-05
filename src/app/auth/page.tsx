"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const supabase = createClient();
  const [tab, setTab] = useState<'login'|'signup'>('login');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const router = useRouter();

  // 로그인
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    setLoading(false);
    if (error) {
      if (error.message === 'Invalid login credentials') {
        setMsg('이메일 인증이 완료되지 않았거나, 이메일/비밀번호가 잘못되었습니다. 회원가입 후 인증 메일을 꼭 확인해 주세요.');
      } else {
        setMsg(error.message);
      }
    } else {
      setMsg('로그인 성공!');
      setTimeout(()=>router.push('/profile'), 800);
    }
  };

  // 회원가입
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    if (!email || !pw || !pw2) {
      setMsg('모든 항목을 입력해 주세요.');
      return;
    }
    if (pw !== pw2) {
      setMsg('비밀번호가 일치하지 않습니다.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password: pw });
    setLoading(false);
    if (error) setMsg(error.message);
    else setMsg('가입 인증 메일이 발송되었습니다. 메일함을 확인해 주세요!');
  };

  // 소셜 로그인(Google)
  const handleSocial = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({ provider: 'google' });
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo/sunjeong_link_logo.png" alt="SunjeongLink" className="h-12 mb-2" />
          <div className="flex gap-4 mb-2">
            <button onClick={()=>setTab('login')} className={`px-4 py-2 rounded-t-lg font-bold ${tab==='login' ? 'bg-blue-100 text-blue-700' : 'text-gray-400'}`}>로그인</button>
            <button onClick={()=>setTab('signup')} className={`px-4 py-2 rounded-t-lg font-bold ${tab==='signup' ? 'bg-blue-100 text-blue-700' : 'text-gray-400'}`}>회원가입</button>
          </div>
          <h2 className="text-2xl font-bold text-blue-600">{tab==='login' ? '로그인' : '회원가입'}</h2>
          <p className="text-gray-500 text-sm mt-1">글로벌 마케팅의 시작, 선정링크</p>
        </div>
        {tab==='login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">이메일</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-500"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">비밀번호</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-500"
                value={pw}
                onChange={e => setPw(e.target.value)}
                placeholder="비밀번호"
                required
              />
            </div>
            {msg && (
              <div className="text-center text-sm py-2 rounded bg-blue-50 text-blue-600">{msg}</div>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
            <button
              type="button"
              onClick={handleSocial}
              className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2 mt-2"
              disabled={loading}
            >
              <svg width="20" height="20" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M43.611 20.083H42V20H24v8h11.303C33.962 32.833 29.418 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c2.69 0 5.164.957 7.104 2.527l6.062-6.062C33.527 5.345 28.977 3 24 3 12.954 3 4 11.954 4 23s8.954 20 20 20c11.045 0 19.824-7.977 19.824-19.023 0-1.273-.138-2.243-.213-2.894z"/><path fill="#34A853" d="M6.306 14.691l6.571 4.819C14.54 16.207 18.885 13 24 13c2.69 0 5.164.957 7.104 2.527l6.062-6.062C33.527 5.345 28.977 3 24 3c-7.797 0-14.44 4.418-17.694 10.691z"/><path fill="#FBBC05" d="M24 43c5.356 0 9.865-1.77 13.153-4.805l-6.066-4.995C29.418 36 24 36 24 36c-5.418 0-9.962-3.167-11.303-8.083l-6.571 5.081C9.56 40.582 16.203 45 24 45z"/><path fill="#EA4335" d="M43.611 20.083H42V20H24v8h11.303C34.418 32.833 29.418 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c2.69 0 5.164.957 7.104 2.527l6.062-6.062C33.527 5.345 28.977 3 24 3c-7.797 0-14.44 4.418-17.694 10.691z"/></g></svg>
              Google로 로그인
            </button>
            <div className="mt-6 text-center text-gray-500 text-sm">
              계정이 없으신가요?{' '}
              <button type="button" className="text-blue-600 hover:underline font-medium" onClick={()=>setTab('signup')}>회원가입</button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">이메일</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-500"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">비밀번호</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-500"
                value={pw}
                onChange={e => setPw(e.target.value)}
                placeholder="비밀번호 (6자 이상)"
                minLength={6}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">비밀번호 확인</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-500"
                value={pw2}
                onChange={e => setPw2(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
                minLength={6}
                required
              />
            </div>
            {msg && (
              <div className="text-center text-sm py-2 rounded bg-blue-50 text-blue-600">{msg}</div>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? '가입 중...' : '회원가입'}
            </button>
            <div className="mt-6 text-center text-gray-500 text-sm">
              이미 계정이 있으신가요?{' '}
              <button type="button" className="text-blue-600 hover:underline font-medium" onClick={()=>setTab('login')}>로그인</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 