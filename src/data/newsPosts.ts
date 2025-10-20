export interface NewsPost {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
  author: string;
  editor: string;
  source: string;
  readingTime: string;
  categories: string[];
  body: string[];
  highlights?: string[];
  factSources?: { label: string; url: string }[];
  externalUrl?: string;
}

export const newsPosts: NewsPost[] = [
  {
    id: '2025-market-expansion',
    title: '링커블, 동남아 셀러 대상 라이브 커머스 테스트 확대',
    summary:
      '말레이시아와 태국 셀러 30개사가 참여한 실시간 라이브 커머스 테스트가 상시 프로그램으로 전환됩니다. 테스트 기간 평균 전환율은 2.4배, 신규 구매 전환은 35% 증가했습니다.',
    publishedAt: '2025-10-01',
    author: '링커블 미디어팀',
    editor: '박서준 편집장',
    source: 'Lynkable Press',
    readingTime: '3분 소요',
    categories: ['기업 소식', '글로벌 확장'],
    body: [
      '링커블은 10월 1일 동남아시아 셀러 대상 라이브 커머스 테스트를 정식 서비스로 전환한다고 발표했습니다. 지난 6월부터 말레이시아·태국 셀러 30개사를 대상으로 진행한 베타 프로그램에서 캠페인당 평균 전환율이 기존 대비 2.4배 높아졌습니다.',
      '테스트에 참여한 셀러의 78%는 “실시간 방송 후 48시간 내 신규 고객이 유입됐다”고 응답했으며, 평균 객단가 역시 18% 상승했습니다. 라이브 방송에는 현지 인플루언서 54명이 참여했고, 총 노출수는 420만 회를 기록했습니다.',
      '링커블은 11월부터 인도네시아와 베트남으로 확대하고, 셀러 맞춤 번역 스크립트 툴·실시간 주문 추적 기능을 순차적으로 도입할 예정입니다. 신청은 10월 15일부터 뉴스룸의 사전 등록 폼을 통해 받을 계획입니다.',
    ],
    highlights: [
      '테스트 프로그램→상시 서비스로 전환',
      '전환율 2.4배, 신규 구매 35% 증가',
      '11월부터 인도네시아·베트남 확대 예정',
    ],
    factSources: [
      { label: '링커블 라이브 커머스 베타 리포트 (2025.09)', url: 'https://lynkable.co/reports/2025-live-commerce-beta' },
    ],
    externalUrl: 'https://lynkable.co/press/seasia-live-commerce-pilot',
  },
  {
    id: '2025-influencer-safety',
    title: '인플루언서 안전 가이드라인 2.0 공개',
    summary:
      '링커블 정책연구소는 광고 표시, 개인정보 보호, 소아·청소년 보호 기준을 강화한 인플루언서 안전 가이드라인 2.0을 발간했습니다. 신고 대응 SLA와 연 2회 의무 교육이 새롭게 포함됐습니다.',
    publishedAt: '2025-09-18',
    author: '린 시연 정책리드',
    editor: '김지후 책임에디터',
    source: 'Lynkable Policy Lab',
    readingTime: '4분 소요',
    categories: ['정책', '안전'],
    body: [
      '링커블은 9월 18일 브랜드·인플루언서·에이전시가 준수해야 할 윤리 기준을 담은 ‘인플루언서 안전 가이드라인 2.0’을 발표했습니다. 이번 개정판은 광고 표시 의무와 개인정보 최소 수집 원칙을 강화했고, 미성년자 출연 콘텐츠에 대한 명확한 검증 절차를 추가했습니다.',
      '가이드라인 2.0은 캠페인 진행 중 발생하는 신고에 대해 24시간 이내 1차 답변, 72시간 내 조치 계획을 제공하도록 SLA를 규정합니다. 또한 플랫폼 내 모든 인플루언서는 연 2회 안전 교육을 수강해야 하며, 미수료 시 캠페인 참여가 제한됩니다.',
      '링커블은 정책 포털에서 가이드라인 전문과 체크리스트, 신고 채널을 공개했으며 파트너 브랜드를 대상으로 10월 중 온라인 설명회를 진행할 예정입니다.',
    ],
    highlights: [
      '광고 표시·개인정보·청소년 보호 항목 강화',
      '신고 대응 SLA 24시간 응답, 72시간 조치',
      '연 2회 안전 교육 미이수 시 캠페인 참여 제한',
    ],
    factSources: [
      { label: '인플루언서 안전 가이드라인 2.0 전문', url: 'https://lynkable.co/policy/influencer-safety-2' },
      { label: '링커블 신고 처리 프로세스', url: 'https://lynkable.co/policy/reporting-flow' },
    ],
    externalUrl: 'https://lynkable.co/press/influencer-safety-guideline-v2',
  },
  {
    id: '2025-market-report',
    title: '2025 Q3 K-뷰티 글로벌 퍼포먼스 리포트 발간',
    summary:
      '링커블 리서치센터는 2025년 3분기 동남아 3개국에서 진행된 K-뷰티 캠페인 126건을 분석했습니다. 평균 ROAS는 412%, 신규 팔로워 증가는 전년 동기 대비 36%p 상승했습니다.',
    publishedAt: '2025-08-30',
    author: '링커블 리서치센터',
    editor: '박서준 편집장',
    source: 'Lynkable Research',
    readingTime: '5분 소요',
    categories: ['데이터 리포트', 'K-뷰티'],
    body: [
      '링커블 리서치센터는 8월 30일 ‘2025 Q3 K-뷰티 글로벌 퍼포먼스 리포트’를 발간했습니다. 인도네시아·베트남·태국에서 진행한 126개 공동구매 캠페인을 분석한 이번 보고서는 채널별 성과와 소비자 반응 패턴을 정리했습니다.',
      '보고서에 따르면 평균 광고 수익률(ROAS)은 412%로 전년 동기 대비 62%p 상승했습니다. 틱톡·릴스 숏폼을 활용한 캠페인의 ROAS가 487%로 가장 높았으며, 장기 구독형 콘텐츠는 재구매율이 31%p 높았습니다.',
      '리포트는 또한 캠페인별 소비자 리뷰 8,200건을 분석해 피부 타입·관심사별 키워드를 도출했습니다. 링커블은 9월부터 파트너 브랜드를 대상으로 맞춤형 데이터 컨설팅을 제공할 계획이며, 보고서 전문은 로그인 후 다운로드할 수 있습니다.',
    ],
    highlights: [
      'K-뷰티 126개 캠페인 분석, 평균 ROAS 412%',
      '숏폼 채널 ROAS 487%로 최고 기록',
      '맞춤형 데이터 컨설팅 9월부터 제공',
    ],
    factSources: [
      { label: '2025 Q3 Performance Report (요약본)', url: 'https://lynkable.co/insight/q3-report-2025' },
    ],
    externalUrl: 'https://lynkable.co/insight/q3-report-2025',
  },
];

export function getNewsPostById(id: string): NewsPost | undefined {
  return newsPosts.find((post) => post.id === id);
}
