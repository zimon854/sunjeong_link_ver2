'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiLogIn } from 'react-icons/fi';

const CREDENTIALS = {
  admin: { password: 'LinkAdmin2024!@#', role: 'admin' as const, label: '관리자 계정' },
  playreview: { password: 'LinkReview2024!@#', role: 'reviewer' as const, label: 'Play Console 관리자 계정' },
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
    className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 shadow-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
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
  const [showReviewHelp, setShowReviewHelp] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
            링커블 운영 전용 채널
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900">관리자 로그인</h1>
          <p className="text-slate-500">안전한 운영을 위해 관리자 전용 계정으로 접속해주세요.</p>
        </div>
        <div className="card">
          <div className="flex justify-center mb-6">
            <div className="w-full rounded-2xl bg-blue-500/10 px-4 py-3 text-blue-700 font-semibold flex items-center justify-center gap-2">
              <FiLogIn className="text-blue-600" />
              관리자 로그인
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

          <div className="mt-8 space-y-3 text-center text-sm text-slate-500">
            <button
              type="button"
              onClick={() => setShowReviewHelp((prev) => !prev)}
              className="w-full rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 font-semibold text-blue-700 hover:bg-blue-100 transition"
            >
              {showReviewHelp ? '관리자 계정 안내 닫기' : '관리자 전용 계정 안내 보기'}
            </button>
            {showReviewHelp && (
              <div className="rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-4 text-left space-y-2">
                <p className="text-sm font-semibold text-blue-800">Play Console 관리자 계정</p>
                <div className="rounded-xl bg-white px-3 py-2 text-sm text-slate-700">
                  <p className="font-mono">ID : playreview</p>
                  <p className="font-mono">PW : {CREDENTIALS.playreview.password}</p>
                </div>
                <p className="text-xs text-slate-500">
                  관리자 운영 목적의 계정이며 일반 사용자에게 공유되지 않습니다. <br />
                  로그인 후 대시보드, 인플루언서 리스트 등 주요 화면만 확인 가능합니다.
                </p>
              </div>
            )}
          </div>

          {message && (
            <div className={`mt-6 rounded-xl px-4 py-3 text-center text-sm font-medium ${message.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
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
