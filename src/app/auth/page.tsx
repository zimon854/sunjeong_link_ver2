'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiActivity, FiBarChart2, FiLogIn, FiShield } from 'react-icons/fi';

const CREDENTIALS = {
  borrow13: { password: 'Tjswjd5248!', role: 'admin' as const, label: '관리자 계정' },
  guest01: { password: 'GuestLink24!', role: 'reviewer' as const, label: '게스트 계정' },
} as const;

type CredentialKey = keyof typeof CREDENTIALS;

const SECURITY_FEATURES = [
  {
    title: '다중 승인 절차',
    description: '주요 설정 변경은 2인 승인 후 적용됩니다.',
    icon: FiShield,
  },
  {
    title: '실시간 감사 로그',
    description: '로그인과 데이터 접근 히스토리를 상시 추적합니다.',
    icon: FiActivity,
  },
  {
    title: '성과 대시보드',
    description: '캠페인 KPI와 운영 지표를 한눈에 확인할 수 있습니다.',
    icon: FiBarChart2,
  },
] as const;

const OPERATIONS_METRICS = [
  { label: '평균 응답', value: '4시간 이내' },
  { label: '진행 중 캠페인', value: '27개' },
  { label: 'Creator Network', value: '1,000+ 명' },
  { label: '지원 채널', value: 'Email · Phone' },
] as const;

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

  // 리다이렉트 URL 가져오기
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const redirectUrl = searchParams?.get('redirect') || '/dashboard';

  const performCredentialLogin = async (credential: CredentialKey) => {
    const matchedCredential = CREDENTIALS[credential];
    if (!matchedCredential) {
      throw new Error('등록되지 않은 계정입니다.');
    }

    const successLabel = matchedCredential.label;
    setMessage({ type: 'success', text: `${successLabel}으로 로그인했습니다. 대시보드로 이동합니다.` });

    const authData = {
      user: credential,
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
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage({ type: 'error', text: '관리자 ID와 비밀번호를 모두 입력해주세요.' });
      return;
    }

    if (username === 'guest01') {
      setMessage({ type: 'error', text: '게스트 계정은 전용 버튼을 통해서만 로그인할 수 있습니다.' });
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

      await performCredentialLogin(username as CredentialKey);
    } catch (error) {
      console.error('Unexpected login error:', error);
      setMessage({ type: 'error', text: '예상치 못한 오류가 발생했습니다. 다시 시도해주세요.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    if (!username || !password) {
      setMessage({ type: 'error', text: '게스트 ID와 비밀번호를 입력한 뒤 버튼을 눌러주세요.' });
      return;
    }

    if (username !== 'guest01') {
      setMessage({ type: 'error', text: '게스트 전용 ID는 guest01 입니다.' });
      return;
    }

    const guestCredential = CREDENTIALS['guest01'];
    if (password !== guestCredential.password) {
      setMessage({ type: 'error', text: '게스트 비밀번호가 올바르지 않습니다.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await performCredentialLogin('guest01');
    } catch (error) {
      console.error('Unexpected guest login error:', error);
      setMessage({ type: 'error', text: '게스트 로그인에 실패했습니다. 다시 시도해 주세요.' });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 py-16 px-4 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl md:flex-row">
        <section className="flex flex-1 items-center justify-center bg-white px-6 py-12 sm:px-10 lg:px-12">
          <div className="w-full max-w-sm space-y-8">
            <div className="space-y-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-4 py-1 text-xs font-semibold tracking-[0.3em] text-blue-700">
                ADMIN ACCESS
              </span>
              <h1 className="text-3xl font-bold text-slate-900 sm:text-[34px]">Lynkable 관리자 로그인</h1>
              <p className="text-sm leading-relaxed text-slate-500">
                승인된 운영 계정으로 접속해 대시보드, 캠페인, 인플루언서 데이터를 안전하게 확인하세요.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-4 text-sm text-blue-800">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <FiLogIn className="h-5 w-5" />
                </span>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-500">Secure Sign-In</p>
                  <p className="font-semibold">세션은 24시간 후 자동으로 만료됩니다.</p>
                  <p className="text-xs text-blue-600/80">출근 시 1일 1회 로그인을 권장합니다.</p>
                </div>
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

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                <span className="h-px flex-1 bg-slate-200" aria-hidden="true" />
                <span>또는</span>
                <span className="h-px flex-1 bg-slate-200" aria-hidden="true" />
              </div>
              <button
                type="button"
                onClick={handleGuestLogin}
                disabled={loading}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600 disabled:opacity-50"
              >
                게스트로 둘러보기
              </button>
              <p className="text-center text-[11px] text-slate-400">
                게스트 ID/비밀번호를 입력한 뒤 버튼을 눌러야만 열람 전용 권한이 부여됩니다.
              </p>
            </div>

            {message && (
              <div
                className={`rounded-xl px-4 py-3 text-center text-sm font-medium ${
                  message.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}
              >
                <span className="whitespace-nowrap">{message.text}</span>
              </div>
            )}

            <p className="text-center text-xs text-slate-400">
              계정이 필요하면 보안 담당자에게 발급을 요청하세요.
            </p>
          </div>
        </section>

        <aside className="flex flex-1 flex-col justify-between border-t border-slate-200 bg-slate-50 px-6 py-12 text-slate-700 sm:px-10 lg:px-12 md:border-l md:border-t-0">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-blue-600">
                운영 브리프
              </span>
              <h2 className="text-2xl font-semibold text-slate-900 sm:text-[28px]">
                운영팀이 즉시 확인해야 할
                <br /> 핵심 지표 요약판
              </h2>
              <p className="text-sm leading-relaxed text-slate-500">
                핵심 캠페인 진행률, 계약 단계, 고객 문의 로그를 한 화면에서 정리해 신속한 의사결정을 돕습니다.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {SECURITY_FEATURES.map(({ title, description, icon: Icon }) => (
                <div key={title} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                    <p className="text-xs leading-relaxed text-slate-500">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <dl className="mt-10 grid grid-cols-1 gap-3 text-xs text-slate-500">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">운영 공지</dt>
              <dd className="mt-2 text-sm font-semibold text-slate-900">계정 발급 및 접근 권한 변경은 보안팀을 통해 요청해 주세요</dd>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">지원 채널</dt>
              <dd className="mt-2 text-sm font-semibold text-slate-900">press@lynkable.co / 010-2803-5248</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
};

export default function AuthPage() {
  return <AuthPageContent />;
}
