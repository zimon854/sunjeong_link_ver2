'use client';

import AdaptiveLayout from '@/components/AdaptiveLayout';

const editorialPrinciples = [
  {
    title: '독립성과 정확성',
    bullets: [
      '모든 뉴스룸 콘텐츠는 링커블 미디어팀이 직접 취재·검증하며, 광고나 제휴와 구분해 표기합니다.',
      '숫자·지표는 2개의 독립된 데이터 소스(내부 데이터베이스, 파트너 리포트)를 교차 검증한 뒤 인용합니다.',
      '사실관계가 변경되면 24시간 이내 기사 하단에 정정 라벨과 변경 내역을 공개합니다.'
    ]
  },
  {
    title: '공정성과 균형',
    bullets: [
      '주요 이해관계자(브랜드, 인플루언서, 이용자)가 상이한 입장을 제시할 경우 최소 2측 이상의 코멘트를 반영합니다.',
      '리서치 보고서에는 조사 방법, 표본, 기간을 명시해 독자가 수치를 재검증할 수 있도록 합니다.',
      '캠페인 성공 사례는 동일 카테고리 평균과 비교해 상대적 성과를 설명합니다.'
    ]
  },
  {
    title: '책임성과 투명성',
    bullets: [
      '기사 작성자·편집자는 실명 또는 직함을 표기하며, 문의 및 정정 채널(press@lynkable.co)을 상시 운영합니다.',
      '이용자로부터 제보·신고가 접수되면 24시간 내 1차 회신, 72시간 내 조치 계획을 안내합니다.',
      '외부 보도자료 또는 파트너 콘텐츠를 활용하는 경우 출처와 원문 링크를 본문 하단에 제공합니다.'
    ]
  },
];

const contactInfo = [
  { label: '제보 및 정정', value: 'press@lynkable.co' },
  { label: '편집 책임자', value: '박서준 편집장 (editor@lynkable.co)' },
  { label: '정책 문의', value: 'policy@lynkable.co' },
];

export default function EditorialPolicyPage() {
  return (
    <AdaptiveLayout title="뉴스룸 편집 기준" showBackButton>
      <div className="mx-auto w-full max-w-3xl py-12 text-white space-y-10">
        <header className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-300/80">Editorial Guidelines</p>
          <h1 className="text-4xl font-extrabold">링커블 뉴스룸 편집 기준</h1>
          <p className="text-secondary text-sm md:text-base">
            링커블 뉴스룸은 신뢰할 수 있는 커머스 정보를 제공하기 위해 아래 원칙을 따릅니다. 모든 기사는
            내부 편집위원회의 검토를 거치며, 제보·정정 요청을 투명하게 처리합니다.
          </p>
        </header>

        <section className="space-y-6">
          {editorialPrinciples.map((section) => (
            <div key={section.title} className="rounded-2xl border border-blue-500/20 bg-blue-900/20 p-6">
              <h2 className="text-xl font-bold text-white mb-4">{section.title}</h2>
              <ul className="space-y-3 text-sm text-blue-100/90 list-disc pl-5">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-blue-500/20 bg-black/30 p-6 text-sm text-blue-100/90 space-y-3">
          <h2 className="text-lg font-semibold text-white">문의 및 제보 채널</h2>
          <p>뉴스룸 관련 문의는 아래 경로로 접수해주세요. 모든 메일에는 24시간 내 1차 회신을 드립니다.</p>
          <ul className="space-y-2">
            {contactInfo.map((item) => (
              <li key={item.label} className="flex justify-between border-b border-blue-900/40 pb-2 text-sm">
                <span className="text-blue-300/70">{item.label}</span>
                <span>{item.value}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-blue-500/10 bg-blue-950/20 p-6 text-xs text-blue-200 space-y-2">
          <h2 className="text-sm font-semibold text-white">업데이트 이력</h2>
          <p>본 편집 기준은 2025년 9월 30일에 제정되었으며, 2025년 10월 1일 최신 개정이 적용되었습니다.</p>
          <p>추가 개정이 발생하면 뉴스룸 및 Google Play 콘솔에 동일하게 공지합니다.</p>
        </section>
      </div>
    </AdaptiveLayout>
  );
}
