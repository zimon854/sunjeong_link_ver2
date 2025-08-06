'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';
import Link from 'next/link';
import { FiLogIn, FiUserPlus, FiGithub, FiMessageCircle } from 'react-icons/fi';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const router = useRouter();
  const supabase = createClient();
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setMessage({ type: 'error', text: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    } else {
      setMessage({ type: 'success', text: '로그인 성공! 대시보드로 이동합니다.' });
      router.push('/dashboard');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: '비밀번호가 일치하지 않습니다.' });
      return;
    }
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { username } } });
    setLoading(false);
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: '회원가입 성공! 확인 메일을 발송했습니다.' });
      setAuthMode('login');
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github' | 'facebook') => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/dashboard` } });
    // setLoading(false) is not called here as the page will redirect.
  };

  const AuthForm = ({ isLogin }: { isLogin: boolean }) => (
    <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-6">
      {!isLogin && (
        <InputField type="text" placeholder="사용자 이름" value={username} onChange={setUsername} />
      )}
      <InputField type="email" placeholder="이메일" value={email} onChange={setEmail} />
      <InputField type="password" placeholder="비밀번호" value={password} onChange={setPassword} />
      {!isLogin && (
        <InputField type="password" placeholder="비밀번호 확인" value={confirmPassword} onChange={setConfirmPassword} />
      )}
      <button type="submit" className="w-full btn-primary" disabled={loading}>
        {loading ? '처리 중...' : (isLogin ? '로그인' : '회원가입')}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold">환영합니다</h1>
          <p className="text-secondary mt-2">링커블과 함께 성장을 시작하세요.</p>
        </div>
        <div className="card">
          <div className="flex justify-center mb-6 bg-black/20 p-1 rounded-lg">
            <TabButton icon={<FiLogIn />} label="로그인" isActive={authMode === 'login'} onClick={() => setAuthMode('login')} />
            <TabButton icon={<FiUserPlus />} label="회원가입" isActive={authMode === 'signup'} onClick={() => setAuthMode('signup')} />
          </div>
          
          {authMode === 'login' ? <AuthForm isLogin /> : <AuthForm isLogin={false} />}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-secondary">또는</span>
            </div>
          </div>

          <div className="space-y-3">
            <SocialButton icon={<FaGoogle />} label="Google로 계속하기" onClick={() => handleSocialLogin('google')} provider="google" />
            <SocialButton icon={<FiGithub />} label="GitHub으로 계속하기" onClick={() => handleSocialLogin('github')} provider="github" />
            <SocialButton icon={<FaFacebook />} label="Facebook으로 계속하기" onClick={() => handleSocialLogin('facebook')} provider="facebook" />
          </div>

          {message && (
            <div className={`mt-6 p-3 rounded-lg text-center text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---
const InputField = ({ type, placeholder, value, onChange }: { type: string, placeholder: string, value: string, onChange: (val: string) => void }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    required
    className="w-full px-4 py-3 bg-black/20 rounded-lg border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition"
  />
);

const TabButton = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`w-1/2 py-2.5 rounded-md flex items-center justify-center gap-2 font-semibold transition-all duration-200 ${isActive ? 'bg-primary text-white shadow-md' : 'text-secondary hover:bg-white/5'}`}>
    {icon} {label}
  </button>
);

const SocialButton = ({ icon, label, onClick, provider }: { icon: React.ReactNode, label: string, onClick: () => void, provider: string }) => {
  const baseStyle = "w-full flex items-center justify-center gap-3 py-3 rounded-lg font-semibold transition-all duration-200";
  const providerStyles: { [key: string]: string } = {
    google: "bg-white/90 hover:bg-white text-gray-800",
    github: "bg-gray-800 hover:bg-gray-700 text-white",
    facebook: "bg-blue-600 hover:bg-blue-700 text-white",
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${providerStyles[provider]}`}>
      {icon} {label}
    </button>
  );
};
