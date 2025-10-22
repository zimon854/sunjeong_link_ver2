export type Platform = {
  platform: string;
  handle: string;
  followers: number;
  url: string;
};

export type HighlightVideo = {
  url: string;
  thumbnail?: string | null;
};

export type VietnamInfluencer = {
  id: string;
  name: string;
  city: string;
  niches: string[];
  languages: string[];
  avatar: string;
  bio: string;
  platforms: Platform[];
  highlightVideo?: HighlightVideo | null;
};

export const vietnamInfluencers: VietnamInfluencer[] = [
  {
    id: 'linh-nguyen',
    name: 'Linh Nguyen',
    city: 'Ho Chi Minh City',
    niches: ['뷰티', '라이프스타일'],
    languages: ['Vietnamese', 'English'],
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
    bio: '글로벌 뷰티 브랜드와 협업하며 K-뷰티 트렌드를 현지에 소개하는 라이프스타일 크리에이터.',
    platforms: [
      {
        platform: 'TikTok',
        handle: '@linh.belle',
        followers: 1350000,
        url: 'https://www.tiktok.com/@linh.belle',
      },
      {
        platform: 'Instagram',
        handle: '@linh.belle',
        followers: 620000,
        url: 'https://www.instagram.com/linh.belle',
      },
    ],
    highlightVideo: {
      url: 'https://www.tiktok.com/@linh.belle/video/7326819236452396331',
      thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
    },
  },
  {
    id: 'vu-minh',
    name: 'Vu Minh',
    city: 'Hanoi',
    niches: ['푸드', '여행'],
    languages: ['Vietnamese'],
    avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=300&q=80',
    bio: '베트남 길거리 음식과 숨은 맛집을 소개하는 푸드 투어 전문가.',
    platforms: [
      {
        platform: 'TikTok',
        handle: '@vu.foodtour',
        followers: 980000,
        url: 'https://www.tiktok.com/@vu.foodtour',
      },
      {
        platform: 'YouTube',
        handle: 'Vu Food Tour',
        followers: 410000,
        url: 'https://www.youtube.com/@vufoodtour',
      },
    ],
    highlightVideo: {
      url: 'https://www.tiktok.com/@vu.foodtour/video/7319872365124010012',
      thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
    },
  },
  {
    id: 'mai-anh',
    name: 'Mai Anh',
    city: 'Da Nang',
    niches: ['피트니스', '웰니스'],
    languages: ['Vietnamese', 'English'],
    avatar: 'https://images.unsplash.com/photo-1551310414-6d1b2270f80f?auto=format&fit=crop&w=300&q=80',
    bio: '러닝과 요가를 중심으로 홈트 챌린지를 이끄는 웰니스 크리에이터.',
    platforms: [
      {
        platform: 'TikTok',
        handle: '@maianh.fit',
        followers: 720000,
        url: 'https://www.tiktok.com/@maianh.fit',
      },
      {
        platform: 'Instagram',
        handle: '@maianh.fit',
        followers: 280000,
        url: 'https://www.instagram.com/maianh.fit',
      },
    ],
    highlightVideo: {
      url: 'https://www.tiktok.com/@maianh.fit/video/7331238719235013926',
      thumbnail: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=600&q=80',
    },
  },
  {
    id: 'tran-minh-hoa',
    name: 'Tran Minh Hoa',
    city: 'Ho Chi Minh City',
    niches: ['패션', '라이프스타일'],
    languages: ['Vietnamese'],
    avatar: 'https://images.unsplash.com/photo-1542060748-10c28b62716f?auto=format&fit=crop&w=300&q=80',
    bio: '하이엔드 브랜드와 협업하며 베트남 MZ 세대 패션을 이끄는 스타일 아이콘.',
    platforms: [
      {
        platform: 'TikTok',
        handle: '@hoa.tran',
        followers: 1680000,
        url: 'https://www.tiktok.com/@hoa.tran',
      },
      {
        platform: 'Instagram',
        handle: '@hoa.tran',
        followers: 910000,
        url: 'https://www.instagram.com/hoa.tran',
      },
    ],
    highlightVideo: {
      url: 'https://www.tiktok.com/@hoa.tran/video/7322211876079316226',
      thumbnail: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80',
    },
  },
  {
    id: 'ngoc-pham',
    name: 'Ngoc Pham',
    city: 'Ho Chi Minh City',
    niches: ['테크', '비즈니스'],
    languages: ['Vietnamese', 'English'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    bio: '여성 창업가 커뮤니티를 이끄는 테크·비즈니스 인플루언서.',
    platforms: [
      {
        platform: 'TikTok',
        handle: '@ngoc.tech',
        followers: 540000,
        url: 'https://www.tiktok.com/@ngoc.tech',
      },
      {
        platform: 'YouTube',
        handle: 'Ngoc Tech',
        followers: 220000,
        url: 'https://www.youtube.com/@ngoctech',
      },
    ],
    highlightVideo: {
      url: 'https://www.tiktok.com/@ngoc.tech/video/7317789013459928321',
      thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    },
  },
  {
    id: 'bao-tran',
    name: 'Bao Tran',
    city: 'Hue',
    niches: ['여행', '문화'],
    languages: ['Vietnamese', 'English'],
    avatar: 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?auto=format&fit=crop&w=300&q=80',
    bio: '베트남 전통 문화와 숨은 명소를 소개하는 감성 여행 크리에이터.',
    platforms: [
      {
        platform: 'TikTok',
        handle: '@bao.diary',
        followers: 810000,
        url: 'https://www.tiktok.com/@bao.diary',
      },
      {
        platform: 'Instagram',
        handle: '@bao.diary',
        followers: 340000,
        url: 'https://www.instagram.com/bao.diary',
      },
    ],
    highlightVideo: {
      url: 'https://www.tiktok.com/@bao.diary/video/7330024876448974122',
      thumbnail: 'https://images.unsplash.com/photo-1491975748861-76e84f0ee525?auto=format&fit=crop&w=600&q=80',
    },
  },
];
