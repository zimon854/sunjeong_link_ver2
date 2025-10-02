import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '연락처 | Lynkable',
  description: '링커블 고객지원 연락처 및 문의 정보',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0b0c24] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#181b3a]/95 backdrop-blur-xl rounded-lg shadow-2xl border border-[#2d2f5d]/60 p-8">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            연락처
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* 고객지원 연락처 */}
            <div className="bg-blue-800/30 backdrop-blur-sm rounded-lg p-6 border border-blue-600/30">
              <h2 className="text-xl font-semibold text-blue-300 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                </svg>
                고객지원
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-300 mb-1">이메일</p>
                  <a
                    href="mailto:borrow13@sunjeong.co.kr"
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    borrow13@sunjeong.co.kr
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-300 mb-1">전화번호</p>
                  <a
                    href="tel:+821028035248"
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    010-2803-5248
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-300 mb-1">운영시간</p>
                  <p className="text-gray-200">
                    평일 08:00 - 18:00 (KST)<br />
                    주말 및 공휴일 휴무
                  </p>
                </div>
              </div>
            </div>

            {/* 사업 문의 */}
            <div className="bg-green-800/30 backdrop-blur-sm rounded-lg p-6 border border-green-600/30">
              <h2 className="text-xl font-semibold text-green-300 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
                사업 문의
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-300 mb-1">이메일</p>
                  <a
                    href="mailto:borrow13@sunjeong.co.kr"
                    className="text-green-400 hover:text-green-300 font-medium transition-colors"
                  >
                    borrow13@sunjeong.co.kr
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-300 mb-1">전화번호</p>
                  <a
                    href="tel:+821028035248"
                    className="text-green-400 hover:text-green-300 font-medium transition-colors"
                  >
                    010-2803-5248
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-300 mb-1">담당자</p>
                  <p className="text-gray-200">최성훈 대표</p>
                </div>
              </div>
            </div>
          </div>

          {/* 회사 정보 */}
          <div className="mt-8 bg-[#2d2f5d]/30 backdrop-blur-sm rounded-lg p-6 border border-[#2d2f5d]/60">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              회사 정보
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-300 mb-1">회사명</p>
                <p className="text-gray-200">주식회사 선정에이전시</p>
              </div>
              <div>
                <p className="text-sm text-gray-300 mb-1">주소</p>
                <p className="text-gray-200">
                  서울특별시 성동구 성수일로8길 55 B동 706호
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-300 mb-1">사업자등록번호</p>
                <p className="text-gray-200">170-88-03245</p>
              </div>
            </div>
          </div>

          {/* 개인정보 처리방침 및 이용약관 링크 */}
          <div className="mt-8 pt-6 border-t border-[#2d2f5d]/60">
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="/privacy"
                className="text-blue-400 hover:text-blue-300 underline transition-colors"
              >
                개인정보처리방침
              </a>
              <span className="text-gray-500">|</span>
              <a
                href="/terms"
                className="text-blue-400 hover:text-blue-300 underline transition-colors"
              >
                이용약관
              </a>
            </div>
          </div>

          {/* 응답 시간 안내 */}
          <div className="mt-6 bg-yellow-800/20 border-l-4 border-yellow-500 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-300">
                  <strong>응답 시간 안내:</strong> 일반 문의는 24시간 이내, 긴급 사안은 4시간 이내에 답변드립니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}