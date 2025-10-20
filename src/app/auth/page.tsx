'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiLogIn } from 'react-icons/fi';

const CREDENTIALS = {
  admin: { password: 'LinkAdmin2024!@#', role: 'admin' as const, label: '관리자 계정' },
  playreview: { password: 'LinkReview2024!@#', role: 'reviewer' as const, label: 'Play Console 검수 계정' },
} as const;

type CredentialKey = keyof typeof CREDENTIALS;

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
      const matchedCredential = CREDENTIALS[username as CredentialKey];

      if (!matchedCredential || matchedCredential.password !== password) {
        setMessage({ type: 'error', text: '관리자 ID 또는 비밀번호가 올바르지 않습니다.' });
        return;
      }

      const successLabel = matchedCredential.label;
      setMessage({ type: 'success', text: `${successLabel}으로 로그인했습니다. 대시보드로 이동합니다.` });

      const authData = {
        user: username,
        role: matchedCredential.role,
        loginTime: new Date().toISOString()
      };
      sessionStorage.setItem('adminAuth', JSON.stringify(authData));
      try {
        localStorage.setItem('adminAuth', JSON.stringify(authData));
      } catch (storageError) {
        console.warn('Unable to persist admin session to localStorage:', storageError);
      }

      document.cookie = `adminAuth=${encodeURIComponent(JSON.stringify(authData))}; path=/; SameSite=Lax`;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('adminAuth:changed'));
      }

      setTimeout(() => {
        router.push(redirectUrl);
        router.refresh();
      }, 1000);
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

          <div className="mt-8 space-y-2 text-center text-sm text-secondary">
            <p className="font-semibold text-primary">관리자/검수 계정 안내</p>
            <div className="rounded-lg border border-border bg-black/30 px-4 py-3 text-white">
              <p className="font-mono">ID : playreview</p>
              <p className="font-mono">PW : {CREDENTIALS.playreview.password}</p>
            </div>
            <p className="text-xs text-secondary/80">Play Console 검수 전용 계정으로 앱 기능만 확인 가능합니다.</p>
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
};

export default function AuthPage() {
  return <AuthPageContent />;
}