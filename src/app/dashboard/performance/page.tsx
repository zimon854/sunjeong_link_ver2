"use client";
import AdaptiveLayout from '@/components/AdaptiveLayout';

export default function PerformanceDashboardPage() {
  return (
    <AdaptiveLayout title="성과 대시보드">
      <div className="max-w-3xl mx-auto py-20 text-center text-slate-600">
        <h1 className="text-3xl font-bold mb-4 text-slate-900">성과 데이터 준비 중</h1>
        <p className="text-sm leading-6 text-slate-600">
          실시간 성과 분석 기능은 현재 개발 중입니다. 향후 캠페인 매출, 전환, 참여자 통계 등을 여기에서 확인하실 수 있도록 준비하고 있습니다.
          필요한 통계나 리포트를 확인해야 한다면 관리자에게 문의해주세요.
        </p>
      </div>
    </AdaptiveLayout>
  );
}
