import type { Metadata } from 'next';

import InfluencerShowcase from './_components/InfluencerShowcase';
import { getVietnamInfluencers } from '@/data/vietnamInfluencers.server';

export const metadata: Metadata = {
  title: '베트남 인플루언서 리스트',
  description: '틱톡 중심으로 활약하는 베트남 인플루언서 포트폴리오를 한눈에 확인하세요.',
};

export default async function VietnamInfluencersPage() {
  const influencers = await getVietnamInfluencers();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-3">
        <p className="text-sm font-semibold text-emerald-600">Influencer Directory</p>
        <h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl">인플루언서 리스트 (베트남)</h1>
        <p className="max-w-3xl text-sm text-gray-600">
          베트남 MZ 세대는 틱톡을 중심으로 콘텐츠를 소비하며 브랜드를 발견합니다. 아래 리스트는 현지에서
          높은 도달률과 팬 참여도를 기록 중인 크리에이터로 구성되어 있으며, 대표 영상을 바로 확인할 수
          있도록 구성했습니다.
        </p>
      </div>
      <InfluencerShowcase influencers={influencers} />
    </div>
  );
}
