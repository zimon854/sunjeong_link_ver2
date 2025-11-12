import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import type { IconType } from 'react-icons';
import {
  FiCheckCircle,
  FiClock,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiMic,
  FiPhone,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi';

export const metadata: Metadata = {
  title: '연락처 | Lynkable',
  description: '링커블 고객지원, 파트너십, 미디어 제휴 연락처 정보를 확인하세요.',
};

type ChannelContact = {
  label: string;
  value: string;
  href?: string;
  icon: IconType;
  helper?: string;
};

type Channel = {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  icon: IconType;
  accent: string;
  contacts: ChannelContact[];
};

const contactChannels: Channel[] = [
  {
    id: 'support',
    title: '고객지원 센터',
    subtitle: '플랫폼 사용, 계정, 기술 이슈를 빠르게 해결합니다.',
    badge: '평균 응답 4시간',
    icon: FiMessageCircle,
    accent: 'from-sky-500/80 via-blue-500/70 to-indigo-500/70',
    contacts: [
      {
        label: '이메일',
        value: 'borrow13@sunjeong.co.kr',
        href: 'mailto:borrow13@sunjeong.co.kr',
        icon: FiMail,
        helper: '평일 08:00 - 18:00 (KST)',
      },
      {
        label: '전화',
        value: '010-2803-5248',
        href: 'tel:+821028035248',
        icon: FiPhone,
        helper: '긴급 문의 전용 라인',
      },
      {
        label: '운영',
        value: 'FAQ · 실시간 헬프센터 제공',
        icon: FiClock,
      },
    ],
  },
  {
    id: 'partnership',
    title: '브랜드 & 파트너십',
    subtitle: '공동구매, 글로벌 론칭, 크리에이터 매칭 전략을 설계합니다.',
    badge: '맞춤 제안 48시간 내',
    icon: FiUsers,
    accent: 'from-emerald-500/80 via-teal-500/75 to-cyan-500/70',
    contacts: [
      {
        label: '담당 조직',
        value: 'Creator Ops · Biz Dev',
        icon: FiTrendingUp,
      },
      {
        label: '이메일',
        value: 'borrow13@sunjeong.co.kr',
        href: 'mailto:borrow13@sunjeong.co.kr',
        icon: FiMail,
        helper: '시장 진출/캠페인 제안',
      },
      {
        label: '전화',
        value: '010-2803-5248',
        href: 'tel:+821028035248',
        icon: FiPhone,
        helper: '상담 예약 시 우선 배정',
      },
    ],
  },
  {
    id: 'press',
    title: '미디어 · PR',
    subtitle: '언론 인터뷰, 자료 요청, 스토리 제안 메일을 확인합니다.',
    badge: 'press@lynkable.co',
    icon: FiMic,
    accent: 'from-rose-500/80 via-pink-500/80 to-amber-400/75',
    contacts: [
      {
        label: '이메일',
        value: 'press@lynkable.co',
        href: 'mailto:press@lynkable.co',
        icon: FiMail,
        helper: '보도자료 · 공식 코멘트',
      },
      {
        label: '자료',
        value: '브랜드 연혁, 캠페인 수치, 로고 키트 제공',
        icon: FiMessageCircle,
      },
    ],
  },
];

const companyHighlights = [
  {
    title: 'Creator-first Growth Studio',
    body: '동남아 현지 크리에이터 네트워크와 브랜드 목표를 연결해\n공동구매와 라이브 커머스를 설계합니다.',
  },
  {
    title: '데이터 기반 풀 퍼널',
    body: '콘텐츠 기획, 퍼포먼스 미디어, 커머스 데이터까지\n하나의 대시보드에서 관리합니다.',
  },
  {
    title: '하이 터치 운영',
    body: '프로젝트 수를 제한하고 전담 스쿼드를 배정해 실행 속도와\n품질을 동시에 확보합니다.',
  },
];

const companyFacts = [
  { label: '법인명', value: '주식회사 선정에이전시' },
  { label: '대표', value: '최성훈' },
  { label: '사업자등록번호', value: '170-88-03245' },
  { label: '주소', value: '서울특별시 성동구 성수일로8길 55, B동 706호' },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 py-12 sm:py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:gap-16 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="space-y-8 p-6 sm:space-y-10 sm:p-8 md:p-12">
            <div className="space-y-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold text-white">
                Lynkable Contact Center
              </span>
              <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-[56px] md:text-[62px] md:leading-[1.05]">
                브랜드와 크리에이터를 잇는 팀과 <br className="hidden sm:block" /> 직접 이야기하세요.
              </h1>
              <p className="max-w-3xl text-base leading-relaxed text-slate-600">
                공동구매 캠페인부터 미디어 제휴까지, 링커블의 전담 운영팀이 필요한 정보를 정리해 빠르게 회신해 드립니다. 아래 채널 중 가장 편한 방법으로 연락해 주세요.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-[1.55fr,1fr] md:gap-10">
              <div className="space-y-6">
                <dl className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <dt className="text-xs font-semibold text-slate-500">크리에이터 네트워크</dt>
                    <dd className="mt-1 text-base font-semibold text-slate-900">동남아 TikTok · Instagram</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-slate-500">핵심 서비스</dt>
                    <dd className="mt-1 text-base font-semibold text-slate-900">UGC · 공동구매</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-slate-500">응답 속도</dt>
                    <dd className="mt-1 text-base font-semibold text-slate-900">평균 4시간 이내</dd>
                  </div>
                </dl>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a
                    href="mailto:borrow13@sunjeong.co.kr"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 sm:w-auto"
                  >
                    <FiMail className="h-4 w-4" /> 이메일 보내기
                  </a>
                  <a
                    href="tel:+821028035248"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-400 sm:w-auto"
                  >
                    <FiPhone className="h-4 w-4" /> 통화 예약하기
                  </a>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-blue-500/15 via-slate-300/30 to-emerald-400/20 blur-2xl" aria-hidden="true" />
                <div className="relative flex h-full flex-col justify-between rounded-[28px] border border-slate-200 bg-white/90 p-8">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                      <Image
                        src="/logo/sunjeong_link_logo.png"
                        alt="링커블 로고"
                        width={48}
                        height={48}
                        className="h-10 w-10 object-contain"
                      />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">Sunjeong Agency</p>
                      <p className="text-sm font-medium text-slate-600">Creator Commerce Studio</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600">
                    "우리는 소비자가 선택하는 순간을 설계합니다. 현지 인사이트와 정교한 퍼포먼스 데이터를 결합해 콘텐츠·커머스 성과를 동시에 만듭니다."
                  </p>
                  <div className="space-y-2 text-xs text-slate-500">
                    <p>· Creator Ops · Growth Lab · Performance</p>
                    <p>· 동남아 TikTok 공동구매 58% 점유</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact channels */}
        <section className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {contactChannels.map(({ id, title, subtitle, badge, icon: Icon, contacts, accent }) => (
            <article
              key={id}
              className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-6"
            >
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-10`} aria-hidden="true" />
              <div className="relative z-10 flex h-full flex-col gap-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">Contact</p>
                    <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">{subtitle}</p>
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white">
                  {badge}
                </span>
                <div className="space-y-4 text-sm">
                  {contacts.map(({ label, value, href, helper, icon: ItemIcon }) => (
                    <div key={`${id}-${label}`} className="flex items-start gap-3">
                      <span className="mt-0.5 text-slate-400">
                        <ItemIcon className="h-4 w-4" />
                      </span>
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">{label}</p>
                        {href ? (
                          <a href={href} className="break-words text-sm font-semibold text-slate-900 hover:text-blue-600">
                            {value}
                          </a>
                        ) : (
                          <p className="break-words text-sm font-semibold text-slate-900">{value}</p>
                        )}
                        {helper && <p className="text-xs text-slate-500">{helper}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Company story */}
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-0 md:grid-cols-[1.15fr,0.85fr]">
            <div className="space-y-8 border-b border-slate-200 p-6 sm:p-8 md:border-b-0 md:border-r md:p-12">
              <div className="space-y-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">About Lynkable</p>
                <h2 className="font-serif text-3xl font-semibold text-slate-900">
                  브랜드와 크리에이터가 만나는 여정을 디자인합니다.
                </h2>
                <p className="text-sm leading-relaxed text-slate-600 md:text-base">
                  링커블은 동남아와 한국을 잇는 공동구매·UGC 스튜디오입니다. 콘텐츠 제작, 인플루언서 매칭, 퍼포먼스 미디어를 하나의 파이프라인으로 묶어 빠른 실행과 성장 지표를 만들어 냅니다.
                </p>
              </div>
              <div className="space-y-4">
                {companyHighlights.map(({ title, body }) => (
                  <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">{body}</p>
                  </div>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {companyFacts.map(({ label, value }) => (
                  <div key={label} className="flex flex-col rounded-2xl border border-slate-100 bg-white p-4">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">{label}</span>
                    <span className="mt-2 text-sm font-semibold text-slate-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative min-h-[320px]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-sky-500 to-emerald-400" aria-hidden="true" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.3),_transparent_65%)]" aria-hidden="true" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(15,23,42,0.35),_transparent_70%)]" aria-hidden="true" />
              <div className="relative flex h-full flex-col justify-between p-6 text-white sm:p-8 md:p-12">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-slate-900 shadow-sm">
                    <FiMapPin className="h-5 w-5" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/80">HQ Office</p>
                    <p className="text-xl font-semibold leading-tight">Seongsu · Seoul</p>
                  </div>
                </div>
                <p className="text-base leading-relaxed text-white/85">
                  성수동 HQ에서 기획·크리에이티브·퍼포먼스 조직이 한 팀으로 움직입니다. 프로젝트별 태스크포스를 구성해 브랜드 페르소나와 로컬 크리에이터 인사이트를 통합합니다.
                </p>
                <div className="rounded-2xl border border-white/25 bg-white/15 p-4 text-sm text-white/90">
                  <p className="text-base font-semibold text-white">서울특별시 성동구 성수일로8길 55</p>
                  <p className="text-sm text-white/90">B동 706호 · Lynkable HQ</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-white">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-3 py-1 text-white">
                      <FiCheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      주차 지원
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-3 py-1 text-white">
                      <FiCheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      4개 미팅룸
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-3 py-1 text-white">
                      <FiCheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      Studio & Creator Lounge
                    </span>
                  </div>
                  <p className="mt-3 text-xs font-semibold text-white/90">성수역(2호선) 도보 5분</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="overflow-hidden rounded-[32px] border border-slate-300 bg-slate-900 p-6 text-white shadow-lg sm:p-8 md:p-12">
          <div className="grid gap-6 md:grid-cols-[1.4fr,0.6fr] md:items-center sm:gap-8">
            <div className="space-y-4">
              <h2 className="font-serif text-3xl font-semibold text-white md:text-[34px]">새로운 협업을 시작할 준비가 되셨나요?</h2>
              <p className="text-sm leading-relaxed text-slate-200 sm:text-base">
                브랜드 목적과 시장 상황을 알려주시면 48시간 이내 맞춤 전략과 예상 타임라인을 보내드립니다. NDA가 필요하면 사전에 요청해 주세요.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <Link
                  href="/campaigns/new"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-2 font-semibold text-slate-900 transition hover:bg-slate-200 sm:w-auto"
                >
                  공동구매 캠페인 문의
                </Link>
                <Link
                  href="/news"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/35 px-5 py-2 font-semibold text-white transition hover:bg-white/10 sm:w-auto"
                >
                  뉴스룸 보기
                </Link>
              </div>
            </div>
            <div className="rounded-[28px] border border-white/20 bg-white/10 p-6 text-sm text-slate-100 backdrop-blur">
              <p className="font-semibold text-white">빠른 진행 프로세스</p>
              <ul className="mt-3 space-y-2">
                <li>· 문의 접수 후 4시간 내 담당자 배정</li>
                <li>· 48시간 내 전략/견적 초안 제공</li>
                <li>· 필요 시 온라인 브리핑 또는 오프라인 미팅 진행</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
