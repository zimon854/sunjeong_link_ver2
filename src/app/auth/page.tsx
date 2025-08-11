'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { FiLogIn, FiUserPlus } from 'react-icons/fi';

// InputField 컴포넌트를 AuthPage 밖으로 분리
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

// TabButton 컴포넌트를 AuthPage 밖으로 분리
const TabButton = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`w-1/2 py-2.5 rounded-md flex items-center justify-center gap-2 font-semibold transition-all duration-200 ${isActive ? 'bg-primary text-white shadow-md' : 'text-secondary hover:bg-white/5'}`}>
    {icon} {label}
  </button>
);


// AuthForm 컴포넌트를 AuthPage 밖으로 분리하고 필요한 props를 받도록 수정
const AuthForm = ({ isLogin, email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, username, setUsername, handleLogin, handleSignUp, loading }: {
  isLogin: boolean;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  username: string;
  setUsername: (username: string) => void;
  handleLogin: (e: React.FormEvent) => Promise<void>;
  handleSignUp: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
}) => (
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

// SearchParams를 사용하는 컴포넌트를 별도로 분리
const AuthPageContent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    const messageParam = searchParams.get('message');
    if (messageParam) {
      setMessage({ type: 'error', text: messageParam });
    }
  }, [searchParams]);

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
      console.error('Supabase SignUp Error:', error);
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: '회원가입 성공! 확인 메일을 발송했습니다.' });
      setAuthMode('login');
    }
  };


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
          
          {authMode === 'login' ? 
            <AuthForm 
              isLogin={true} 
              email={email} setEmail={setEmail} 
              password={password} setPassword={setPassword} 
              confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} 
              username={username} setUsername={setUsername} 
              handleLogin={handleLogin} handleSignUp={handleSignUp} 
              loading={loading} 
            /> 
            : 
            <AuthForm 
              isLogin={false} 
              email={email} setEmail={setEmail} 
              password={password} setPassword={setPassword} 
              confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} 
              username={username} setUsername={setUsername} 
              handleLogin={handleLogin} handleSignUp={handleSignUp} 
              loading={loading} 
            />
          }


          {message && (
            <div className={`mt-6 p-3 rounded-lg text-center text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-secondary">로딩 중...</p>
        </div>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}