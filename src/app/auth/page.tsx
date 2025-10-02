'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiLogIn } from 'react-icons/fi';

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

// AdminLoginForm 컴포넌트
const AdminLoginForm = ({ username, setUsername, password, setPassword, handleLogin, loading }: {
  username: string;
  setUsername: (username: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleLogin: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
}) => (
  <form onSubmit={handleLogin} className="space-y-6">
    <InputField type="text" placeholder="관리자 ID" value={username} onChange={setUsername} />
    <InputField type="password" placeholder="비밀번호" value={password} onChange={setPassword} />
    <button type="submit" className="w-full btn-primary" disabled={loading}>
      {loading ? '로그인 중...' : '관리자 로그인'}
    </button>
  </form>
);

// Admin Login Component
const AuthPageContent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [loading, setLoading] = useState(false);

  // 리다이렉트 URL 가져오기
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const redirectUrl = searchParams?.get('redirect') || '/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // 입력값 검증
    if (!username || !password) {
      setMessage({ type: 'error', text: '관리자 ID와 비밀번호를 모두 입력해주세요.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // 하드코딩된 admin 계정 검증
      if (username === 'admin' && password === 'LinkAdmin2024!@#') {
        setMessage({ type: 'success', text: '관리자 로그인 성공! 대시보드로 이동합니다.' });

        // sessionStorage와 쿠키에 관리자 세션 저장 (브라우저 종료시 삭제)
        const authData = {
          user: 'admin',
          loginTime: new Date().toISOString()
        };
        sessionStorage.setItem('adminAuth', JSON.stringify(authData));

        // 쿠키에도 저장 (미들웨어에서 사용) - 세션 쿠키로 설정 (브라우저 종료시 삭제)
        document.cookie = `adminAuth=${encodeURIComponent(JSON.stringify(authData))}; path=/; SameSite=Lax`;

        setTimeout(() => {
          router.push(redirectUrl);
          router.refresh();
        }, 1000);
      } else {
        setMessage({ type: 'error', text: '관리자 ID 또는 비밀번호가 올바르지 않습니다.' });
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      setMessage({ type: 'error', text: '예상치 못한 오류가 발생했습니다. 다시 시도해주세요.' });
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold">관리자 로그인</h1>
          <p className="text-secondary mt-2">링커블 관리자 대시보드 접속</p>
        </div>
        <div className="card">
          <div className="flex justify-center mb-6 bg-black/20 p-1 rounded-lg">
            <div className="w-full py-2.5 rounded-md flex items-center justify-center gap-2 font-semibold bg-primary text-white shadow-md">
              <FiLogIn /> 관리자 로그인
            </div>
          </div>

          <AdminLoginForm
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            handleLogin={handleLogin}
            loading={loading}
          />

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
  return <AuthPageContent />;
}