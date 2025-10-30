"use client";
import AdaptiveLayout from '@/components/AdaptiveLayout';
import { FiBarChart2, FiTrendingUp, FiDollarSign, FiUsers, FiClock } from 'react-icons/fi';

export default function PerformanceDashboardPage() {
  return (
    <AdaptiveLayout title="성과 대시보드">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 mb-4">
              <FiBarChart2 className="h-4 w-4" />
              Performance Analytics
            </div>
            <h1 className="text-4xl font-bold mb-4 text-slate-900">성과 대시보드</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              실시간 성과 분석 기능은 현재 개발 중입니다. 향후 캠페인 매출, 전환, 참여자 통계 등을 여기에서 확인하실 수 있습니다.
            </p>
          </div>

          {/* Preview Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FiDollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">총 매출</h3>
                  <p className="text-sm text-slate-500">캠페인 매출 합계</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-400">데이터 준비 중</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <FiTrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">전환율</h3>
                  <p className="text-sm text-slate-500">평균 전환 성과</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-400">데이터 준비 중</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FiUsers className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">참여자 수</h3>
                  <p className="text-sm text-slate-500">누적 참여 현황</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-400">데이터 준비 중</div>
            </div>
          </div>

          {/* Coming Soon Features */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">곧 제공될 기능들</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <FiBarChart2 className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">실시간 매출 대시보드</h3>
                  <p className="text-sm text-slate-600">캠페인별 매출, ROI, 전환율을 실시간으로 모니터링</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <FiTrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">성과 분석 리포트</h3>
                  <p className="text-sm text-slate-600">인플루언서별, 플랫폼별 상세 성과 분석 및 개선 제안</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <FiClock className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">예측 분석</h3>
                  <p className="text-sm text-slate-600">AI 기반 캠페인 성과 예측 및 최적화 추천</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="text-center mt-12">
            <div className="bg-slate-100 rounded-2xl p-6 max-w-md mx-auto">
              <h3 className="font-semibold text-slate-900 mb-2">성과 데이터가 필요하신가요?</h3>
              <p className="text-sm text-slate-600 mb-4">
                현재는 수동으로 리포트를 제공하고 있습니다. 
                필요한 통계나 분석 자료가 있으시면 관리자에게 문의해주세요.
              </p>
              <button className="btn-primary">
                관리자 문의하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdaptiveLayout>
  );
}
