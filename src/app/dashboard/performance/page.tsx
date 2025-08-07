'use client';
import React, { useState } from 'react';
import AdaptiveLayout from '@/components/AdaptiveLayout';
import { FiTrendingUp, FiDollarSign, FiZap, FiCheckCircle, FiUsers, FiList } from 'react-icons/fi';

// --- Dummy data for analytics tab ---
const periodOptions = [
  { value: 'today', label: '오늘' },
  { value: 'week', label: '이번주' },
  { value: 'month', label: '이번달' },
];

const dummyPerformance = [
  {
    campaign: '비건 뷰티 마스크팩', clicks: 1800, conversions: 120, sales: 3200000, roi: 2.1, influencers: 5, contents: 7,
    reviews: [{ from: 'Mina', rating: 5, comment: '협업이 원활하고 결과가 좋아요!' },{ from: 'Somchai', rating: 4.5, comment: '피드백이 빨라서 좋았습니다.' }],
  },
  {
    campaign: '프리미엄 헤어오일', clicks: 950, conversions: 60, sales: 1700000, roi: 1.7, influencers: 3, contents: 4,
    reviews: [{ from: 'Nicha', rating: 4.8, comment: '팔로워 반응이 좋았어요!' }],
  },
];

const dummyInfluencers = [
  { name: 'Mina', campaigns: 2, totalSales: 3500000, avgConversion: 5.2, avgRating: 4.9 },
  { name: 'Nicha', campaigns: 1, totalSales: 1700000, avgConversion: 6.1, avgRating: 4.8 },
];

const dummyAI = {
  bottleneck: '전환율이 2~3일차에 급감, 콘텐츠 포맷 다양화 필요',
  suggestion: '짧은 릴스/숏폼 영상 활용, 인플루언서별 맞춤 피드백 제공',
  reorder: 'ROI 1.8 이상 캠페인은 리오더 추천',
};

const salesTrend = [320000, 410000, 380000, 500000, 470000, 530000, 600000];
const clicksTrend = [200, 350, 300, 400, 380, 420, 500];
const conversionTrend = [3.2, 4.1, 3.8, 5.0, 4.7, 5.3, 6.0];
const trendLabels = Array.from({ length: 7 }, (_, i) => `${i + 1}일`);

function getStats(arr: number[]) {
  const sum = arr.reduce((a, b) => a + b, 0);
  const avg = arr.length ? sum / arr.length : 0;
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const last = arr[arr.length - 1];
  const prev = arr.length > 1 ? arr[arr.length - 2] : last;
  const diff = last - prev;
  const diffRate = prev ? (diff / prev) * 100 : 0;
  return { sum, avg, min, max, last, diff, diffRate };
}

function getYClick(v: number) {
  const minY = 20, maxY = 90;
  const clicksStats = getStats(clicksTrend);
  const min = clicksStats.min, max = clicksStats.max;
  if (max === min) return (minY + maxY) / 2;
  return maxY - ((v - min) / (max - min)) * (maxY - minY);
}

export default function PerformanceDashboardPage() {
  const [period, setPeriod] = useState('today');

  const totalSales = dummyPerformance.reduce((sum, c) => sum + c.sales, 0);
  const totalClicks = dummyPerformance.reduce((sum, c) => sum + c.clicks, 0);
  const totalConversions = dummyPerformance.reduce((sum, c) => sum + c.conversions, 0);
  const totalCampaigns = dummyPerformance.length;
  const totalInfluencers = dummyInfluencers.length;
  const totalContents = dummyPerformance.reduce((sum, c) => sum + c.contents, 0);
  const avgROI = totalCampaigns ? dummyPerformance.reduce((sum, c) => sum + c.roi, 0) / totalCampaigns : 0;

  const salesStats = getStats(salesTrend);
  const clicksStats = getStats(clicksTrend);
  const convStats = getStats(conversionTrend);

  return (
    <AdaptiveLayout title="성과 대시보드">
      <div className="space-y-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">성과 요약</h1>
          <select className="card px-4 py-2 text-sm" value={period} onChange={e => setPeriod(e.target.value)}>
            {periodOptions.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
          </select>
        </div>

        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <KPI_Card icon={<FiDollarSign />} label="총 매출" value={`${totalSales.toLocaleString()}원`} />
            <KPI_Card icon={<FiZap />} label="총 클릭수" value={`${totalClicks.toLocaleString()}회`} />
            <KPI_Card icon={<FiCheckCircle />} label="총 전환수" value={`${totalConversions.toLocaleString()}건`} />
            <KPI_Card icon={<FiTrendingUp />} label="평균 ROI" value={`${avgROI.toFixed(2)}x`} />
            <KPI_Card icon={<FiCheckCircle />} label="캠페인 수" value={`${totalCampaigns}개`} />
            <KPI_Card icon={<FiUsers />} label="인플루언서 수" value={`${totalInfluencers}명`} />
            <KPI_Card icon={<FiList />} label="콘텐츠 수" value={`${totalContents}개`} />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">주요 지표 추이</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TrendCard title="매출 추이" data={salesTrend} labels={trendLabels} stats={salesStats} unit="원" color="#2563eb" />
            <TrendCard title="클릭수 추이" data={clicksTrend} labels={trendLabels} stats={clicksStats} unit="회" color="#3b82f6" />
            <TrendCard title="전환율 추이" data={conversionTrend} labels={trendLabels} stats={convStats} unit="%" color="#22c55e" />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">캠페인별 상세 실적</h2>
          <div className="card overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-4 text-left text-secondary">캠페인명</th>
                  <th className="py-3 px-4 text-right text-secondary">클릭수</th>
                  <th className="py-3 px-4 text-right text-secondary">전환수</th>
                  <th className="py-3 px-4 text-right text-secondary">매출</th>
                  <th className="py-3 px-4 text-right text-secondary">ROI</th>
                  <th className="py-3 px-4 text-right text-secondary">인플루언서</th>
                  <th className="py-3 px-4 text-right text-secondary">콘텐츠</th>
                  <th className="py-3 px-4 text-right text-secondary">리뷰평점</th>
                </tr>
              </thead>
              <tbody>
                {dummyPerformance.map(c => (
                  <tr key={c.campaign} className="border-b border-border/50 hover:bg-white/5">
                    <td className="py-3 px-4 font-semibold text-primary">{c.campaign}</td>
                    <td className="py-3 px-4 text-right text-primary">{c.clicks.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-primary">{c.conversions.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-primary">{c.sales.toLocaleString()}원</td>
                    <td className="py-3 px-4 text-right text-primary">{c.roi.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-primary">{c.influencers}명</td>
                    <td className="py-3 px-4 text-right text-primary">{c.contents}개</td>
                    <td className="py-3 px-4 text-right text-primary">{(c.reviews.reduce((sum, r) => sum + r.rating, 0) / c.reviews.length).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">인플루언서별 실적</h2>
          <div className="card overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-4 text-left text-secondary">이름</th>
                  <th className="py-3 px-4 text-right text-secondary">참여 캠페인</th>
                  <th className="py-3 px-4 text-right text-secondary">총 매출</th>
                  <th className="py-3 px-4 text-right text-secondary">평균 전환율</th>
                  <th className="py-3 px-4 text-right text-secondary">리뷰평점</th>
                </tr>
              </thead>
              <tbody>
                {dummyInfluencers.map(i => (
                  <tr key={i.name} className="border-b border-border/50 hover:bg-white/5">
                    <td className="py-3 px-4 font-semibold text-primary">{i.name}</td>
                    <td className="py-3 px-4 text-right text-primary">{i.campaigns}개</td>
                    <td className="py-3 px-4 text-right text-primary">{i.totalSales.toLocaleString()}원</td>
                    <td className="py-3 px-4 text-right text-primary">{i.avgConversion.toFixed(2)}%</td>
                    <td className="py-3 px-4 text-right text-primary">{i.avgRating.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">AI 성과 분석</h2>
          <div className="card space-y-4">
            <p className="text-primary"><span className="font-bold text-blue-400">병목 구간:</span> {dummyAI.bottleneck}</p>
            <p className="text-primary"><span className="font-bold text-blue-400">추천 포맷:</span> {dummyAI.suggestion}</p>
            <p className="text-primary"><span className="font-bold text-blue-400">리오더 타이밍:</span> {dummyAI.reorder}</p>
          </div>
        </section>
      </div>
    </AdaptiveLayout>
  );
}

// --- Sub-components ---
const KPI_Card = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
  <div className="card flex items-center gap-4 p-4">
    <div className="p-3 bg-blue-500/10 rounded-lg">
      <div className="w-6 h-6 text-blue-400">{icon}</div>
    </div>
    <div>
      <p className="text-secondary text-sm font-semibold">{label}</p>
      <p className="text-2xl font-bold text-primary">{value}</p>
    </div>
  </div>
);

const TrendCard = ({ title, data, labels, stats, unit, color }: {
  title: string;
  data: number[];
  labels: string[];
  stats: { sum: number; avg: number; min: number; max: number; last: number; diff: number; diffRate: number };
  unit: string;
  color: string;
}) => {
  const getY = (v: number) => {
    const minY = 20, maxY = 90;
    const min = stats.min, max = stats.max;
    if (max === min) return (minY + maxY) / 2;
    return maxY - ((v - min) / (max - min)) * (maxY - minY);
  };

  return (
    <div className="card flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-xl text-primary">{title}</h3>
        <span className="text-xs text-secondary">단위: {unit}</span>
      </div>
      <div className="flex justify-between w-full px-1 mb-2">
        <span className="text-xs text-secondary">최소 {stats.min.toLocaleString()}{unit}</span>
        <span className="text-xs text-secondary">최대 {stats.max.toLocaleString()}{unit}</span>
      </div>
      <svg width="100%" height="110" viewBox="0 0 340 110" className="block" style={{ overflow: 'visible' }}>
        <polyline fill="none" stroke={color} strokeWidth="4" points={data.map((v, i) => `${40 + i * 45},${getY(v)}`).join(' ')} />
        {data.map((v, i) => (
          <circle key={i} cx={40 + i * 45} cy={getY(v)} r={i === data.length - 1 ? 7 : 5} fill={color}>
            <title>{`${labels[i]}: ${v.toLocaleString()}${unit}`}</title>
          </circle>
        ))}
        {labels.map((label, i) => (
          <text key={label} x={40 + i * 45} y={105} fontSize="13" fontWeight="bold" textAnchor="middle" fill={color}>
            {label}
          </text>
        ))}
      </svg>
      <div className="flex justify-between text-xs text-secondary mt-auto pt-2 font-semibold border-t border-border/50">
        <span>7일 합계: {stats.sum.toLocaleString()}{unit}</span>
        <span>평균: {Math.round(stats.avg).toLocaleString()}{unit}</span>
        <span>전일 대비: {stats.diff >= 0 ? '+' : ''}{stats.diff.toLocaleString()}{unit} ({stats.diffRate >= 0 ? '+' : ''}{stats.diffRate.toFixed(1)}%)</span>
      </div>
    </div>
  );
};