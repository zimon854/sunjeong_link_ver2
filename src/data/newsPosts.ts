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
  imageUrl?: string;
  imageAlt?: string;
}

export const newsPosts: NewsPost[] = [
  {
    id: '2025-koreatech-kahi-award',
    title: "와이레스(YLESS), 추석 황금연휴 외국인 관광객 위한 K-뷰티 '글로우업(glow up)' 체험 제공",
    summary:
      '비즈월드뉴스는 YLESS가 추석 황금연휴 기간 외국인 관광객에게 K-뷰티 글로우업 체험존을 열고 퍼스널 컬러·메이크업 서비스를 무료로 선보였다고 전했습니다.',
    publishedAt: '2024-09-16',
    author: '비즈월드뉴스 취재팀',
    editor: '비즈월드뉴스 편집국',
    source: '비즈월드뉴스',
    readingTime: '3분 소요',
    categories: ['K-뷰티', '관광', '체험 프로모션'],
    body: [
      '보도에 따르면 YLESS는 서울 도심 주요 관광지와 연계해 외국인 방문객이 K-뷰티 루틴을 직접 경험할 수 있도록 “글로우업(glow up)” 체험존을 운영했습니다.',
      '현장에서는 전문 뷰티 디렉터가 무료 퍼스널 컬러 진단과 맞춤형 메이크업 시연을 제공하며, 참가자들이 즉시 활용할 수 있는 색조·스킨케어 제품 샘플을 지원했습니다.',
      'YLESS는 이번 체험을 계기로 다국어 뷰티 큐레이션 콘텐츠와 글로벌 공동구매 프로그램을 연계해 해외 관광객의 재방문과 온라인 구매를 동시에 이끌겠다는 계획을 밝혔습니다.',
    ],
    highlights: [
      '추석 연휴 기간 외국인 대상 K-뷰티 “글로우업” 체험존 운영',
      '무료 퍼스널 컬러 진단·메이크업 시연으로 현장 만족도 제고',
    ],
    externalUrl: 'https://www.bizwnews.com/news/articleView.html?idxno=114838',
    imageUrl: '/news/news4.png',
    imageAlt: 'YLESS K-뷰티 글로우업 체험 현장 이미지',
  },
  {
    id: '2023-kihoilbo-stable-revenue',
    title: '기호일보: 매출 안정을 겨냥한 선정 에이전시의 통합 마케팅',
    summary:
      '기호일보는 선정 에이전시가 퍼포먼스·바이럴·브랜딩을 결합해 브랜드 매출을 안정화하는 다섯 가지 운영 원칙을 소개했습니다.',
    publishedAt: '2023-11-16',
    author: '디지털뉴스부',
    editor: '기호일보 편집국',
    source: '기호일보',
    readingTime: '2분 소요',
    categories: ['브랜드 전략', '마케팅'],
    body: [
      '기사에 따르면 선정 에이전시는 퍼포먼스, 바이럴, 브랜딩 세 축으로 서비스를 묶어 고객사의 매출 흐름을 설계합니다.',
      '인하우스 조직처럼 밀착 대응하고, 기획자·디자이너·마케터가 협업해 자사몰 전환과 신규 고객 확보를 동시에 챙기고 있습니다.',
      'SNS 후킹 포인트를 통해 이탈률을 낮추고, 광고 성과를 수익으로 연결하는 구조가 핵심 강점으로 소개됐습니다.',
    ],
    highlights: [
      '3축 통합 서비스로 매출 안정화 지원',
      '인하우스형 협업과 후킹 콘텐츠 전략',
    ],
    externalUrl: 'https://www.kihoilbo.co.kr/news/articleView.html?idxno=1058413',
    imageUrl: '/news/news1.png',
    imageAlt: '기호일보 기사 대표 이미지',
  },
  {
    id: '2025-sentv-triple-crown',
    title: '서울경제TV: 특허·벤처·직무발명 인증 3관왕 달성',
    summary:
      '서울경제TV는 선정 에이전시가 설립 2년 만에 세 가지 기술·경영 인증을 확보하며 하이 터치 운영 철학을 강화했다고 보도했습니다.',
    publishedAt: '2025-05-01',
    author: '김수윤 기자',
    editor: '서울경제TV 보도국',
    source: '서울경제TV',
    readingTime: '3분 소요',
    categories: ['기업 인증', '테크'],
    body: [
      '보도는 전략 광고, SNS 바이럴, 브랜드 컨설팅을 결합한 통합 서비스가 1,600건 이상의 캠페인 실적을 만들었다고 전했습니다.',
      '자체 매칭 플랫폼 ‘선정 LINK’와 직무발명 보상 제도를 통해 특허와 중기부·벤처협회 인증을 연이어 획득한 점이 강조됐습니다.',
      '고객사별 프로젝트 수를 제한하고 맞춤 전략에 집중하는 하이 터치 방식이 성장 동력으로 소개됐습니다.',
    ],
    highlights: [
      '설립 2년 만에 기술·벤처 3관왕 확보',
      '인플루언서 매칭 플랫폼 특허 출원',
    ],
    externalUrl: 'https://www.sentv.co.kr/article/view/sentv202504300099',
    imageUrl: '/news/news2.png',
    imageAlt: '서울경제TV 기사 대표 이미지',
  },
  {
    id: '2025-kdpress-triple-crown',
    title: '데일리경제: 선정 에이전시, 기술경영 트리플 크라운',
    summary:
      '데일리경제는 선정 에이전시가 특허 출원과 직무발명·성과공유 인증으로 기술 역량과 조직 문화를 동시에 강화했다고 분석했습니다.',
    publishedAt: '2025-04-30',
    author: '오한준 기자',
    editor: '데일리경제 편집국',
    source: '데일리경제',
    readingTime: '3분 소요',
    categories: ['기업 인증', 'R&D'],
    body: [
      '기사에서는 선정 LINK 알고리즘이 특허 출원 번호(10-2024-0149526)로 지식재산을 확보했다고 소개했습니다.',
      '직무발명 우수기업과 성과공유기업 인증을 통해 보상 체계를 제도화하며 인재 육성 기반을 다졌다는 평가가 이어졌습니다.',
      'SEO·AI 광고 자동화를 연구하는 내부 연구소와 프로젝트 선별 정책이 고객 ROI에 집중하게 만든다고 전했습니다.',
    ],
    highlights: [
      '특허·직무발명·성과공유 인증 확보',
      '데이터 기반 연구조직 운영',
    ],
    externalUrl: 'https://www.kdpress.co.kr/news/articleView.html?idxno=137556',
    imageUrl: '/news/news3.png',
    imageAlt: '데일리경제 기사 대표 이미지',
  },
  {
    id: '2025-newseconomy-interview',
    title: '경제인뉴스 인터뷰: “선택받는 구조를 설계하는 에이전시”',
    summary:
      '경제인뉴스는 최성훈 대표 인터뷰를 통해 풀 퍼널 전략과 글로벌 공동구매 플랫폼 확장 계획을 다뤘습니다.',
    publishedAt: '2025-07-16',
    author: '조재윤 기자',
    editor: '경제인뉴스 편집국',
    source: '경제인뉴스',
    readingTime: '4분 소요',
    categories: ['인터뷰', '글로벌'],
    body: [
      '인터뷰에서 선정 에이전시는 구매 여정 전반을 분석하는 풀 퍼널 전략으로 “선택받는 브랜드” 구조를 설계한다고 설명했습니다.',
      '브랜드 기획, 퍼포먼스, 바이럴, 영상 조직이 협업해 스타터·부스터·마스터 패키지를 제공하며 성장 단계별 솔루션을 제시합니다.',
      '올해 하반기 글로벌 공동구매 플랫폼 ‘링커블’ 론칭을 준비하며 동남아 인플루언서와의 파트너십을 확대 중이라고 밝혔습니다.',
    ],
    highlights: [
      '풀 퍼널 기반의 선택받는 브랜드 전략',
      '링커블 글로벌 공동구매 플랫폼 론칭 계획',
    ],
    externalUrl: 'https://www.newseconomy.kr/news/articleView.html?idxno=18032',
    imageUrl: '/news/news5.png',
    imageAlt: '경제인뉴스 인터뷰 대표 이미지',
  },
];

export function getNewsPostById(id: string): NewsPost | undefined {
  return newsPosts.find((post) => post.id === id);
}
