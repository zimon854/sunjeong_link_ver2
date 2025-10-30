export const partners = [
  { name: 'ShopStory', logo: '/home/partners/shopstory.svg' },
  { name: 'PayFlow', logo: '/home/partners/payflow.svg' },
  { name: 'GlowHub', logo: '/home/partners/glowhub.svg' },
  { name: 'CreatorOne', logo: '/home/partners/creatorone.svg' },
  { name: 'MarketBridge', logo: '/home/partners/marketbridge.svg' },
];

export const services = [
  {
    title: '숏폼 시딩 자동화',
    description: '국가별 선호도를 반영한 AI 큐레이션으로 숏폼 콘텐츠 제작과 배포를 빠르게 반복합니다.',
    features: ['현지 크리에이터 매칭', '캠페인 자동화', '숏폼 리포트'],
    image: '/home/services/shortform.jpg',
  },
  {
    title: '리뷰 자산 확장',
    description: '구매 전환을 높이는 리뷰 소재를 확보하고 온·오프라인 채널에 재활용하도록 템플릿을 제공합니다.',
    features: ['사용 후기 수집', '멀티 채널 배포', '리뷰 템플릿'],
    image: '/home/services/reviews.jpg',
  },
  {
    title: '맞춤형 공동구매 운영',
    description: '셀러 목표에 맞는 상품 번들, 가격 정책, 인플루언서를 설계해 공동구매 수익을 극대화합니다.',
    features: ['판매 전략 설계', '정산 자동화', '라이브 커머스'],
    image: '/home/services/sell.jpg',
  },
  {
    title: '데이터 기반 성장 전략',
    description: '인사이트 대시보드와 코호트 분석으로 채널별 효율을 추적하고 캠페인 최적화를 제안합니다.',
    features: ['성과 대시보드', '코호트 분석', 'AI 추천'],
    image: '/home/services/analytics.jpg',
  },
];

export const plans = [
  {
    id: 'starter',
    name: 'Starter',
    summary: '숏폼 제작과 리뷰 확보를 시작하는 브랜드를 위한 구성입니다.',
    price: '월 29만원',
    benefits: [
      '숏폼 시딩 10건',
      '리뷰 수집 템플릿 제공',
      '캠페인 성과 대시보드 기본형',
      '담당 매니저 월 1회 리포트',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    summary: '다수의 국가로 확장하며 공동구매를 운영하는 셀러에게 적합합니다.',
    price: '월 89만원',
    benefits: [
      '숏폼 시딩 35건',
      '국가별 크리에이터 타게팅',
      '공동구매 스토어 세팅',
      '광고 전환 측정 & 픽셀 연동',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    summary: '다양한 브랜드 포트폴리오를 운영하는 기업을 위한 커스텀 플랜입니다.',
    price: '맞춤 견적',
    benefits: [
      '숏폼 시딩 무제한',
      '글로벌 인플루언서 풀 우선 배정',
      '전담 전략 컨설턴트 배치',
      'BI 연동 커스텀 리포트',
    ],
  },
];

export const successStories = [
  {
    client: 'VitaLeaf',
    region: '동남아 4개국',
    summary: '숏폼 콘텐츠와 공동 라이브를 결합해 월 매출 420% 성장을 달성했습니다.',
    metrics: ['구매전환율 3.2배 상승', '공동구매 매출 2.4억원', '콘텐츠 재활용률 78%'],
    logo: '/home/success/vitaleaf.png',
  },
  {
    client: 'ARU Beauty',
    region: '북미 TikTok Shop',
    summary: '현지 크리에이터 기반 리뷰 캠페인으로 신규 팔로워 30만 명을 확보했습니다.',
    metrics: ['제품 리뷰 1,200건 확보', 'ROI 540%', '재구매율 2.1배'],
    logo: '/home/success/arubeauty.png',
  },
  {
    client: 'MOCO Living',
    region: '일본 & 한국',
    summary: '캠페인 데이터 분석을 통해 스토어 방문당 매출을 65% 향상시켰습니다.',
    metrics: ['세션당 매출 +65%', '부정 리뷰 42% 감소', '콘텐츠 제작 리드타임 40% 단축'],
    logo: '/home/success/mocoliving.png',
  },
  {
    client: 'WaveFit',
    region: '미국 DTC',
    summary: 'AI로 맞춤 큐레이션한 크리에이터 세트로 론칭 6주 만에 월 1만 건 판매를 돌파했습니다.',
    metrics: ['숏폼 조회수 9,200만 회', '이탈률 32% 감소', '비용 대비 매출 7.1배'],
    logo: '/home/success/wavefit.png',
  },
];
