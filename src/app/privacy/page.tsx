import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '개인정보처리방침 | Lynkable',
  description: '링커블 개인정보처리방침',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0b0c24] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#181b3a]/95 backdrop-blur-xl rounded-lg shadow-2xl border border-[#2d2f5d]/60 p-8">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            개인정보처리방침
          </h1>

          <div className="prose max-w-none text-gray-300">
            <div className="mb-8 p-4 bg-blue-800/30 backdrop-blur-sm rounded-lg border border-blue-600/30">
              <p className="text-sm text-blue-300">
                <strong>시행일자:</strong> 2024년 1월 1일<br />
                <strong>최종 개정일:</strong> 2024년 10월 2일
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">1. 개인정보의 처리목적</h2>
              <p className="mb-4">
                주식회사 선정에이전시(이하 "회사")는 다음의 목적을 위하여 개인정보를 처리하고 있으며,
                다음의 목적 이외의 용도로는 이용하지 않습니다.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>인플루언서 마케팅 플랫폼 서비스 제공</li>
                <li>회원 가입 의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증</li>
                <li>회원에 대한 서비스 이용기록과 접속빈도 분석, 서비스 이용에 대한 통계</li>
                <li>고객지원 및 문의사항 응답</li>
                <li>캠페인 매칭 및 관리</li>
                <li>결제 및 정산 처리</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">2. 개인정보의 처리 및 보유기간</h2>
              <p className="mb-4">
                회사는 정보주체로부터 개인정보를 수집할 때 동의받은 개인정보 보유·이용기간 또는
                법령에 따른 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
              </p>

              <div className="bg-[#2d2f5d]/30 backdrop-blur-sm p-4 rounded-lg border border-[#2d2f5d]/60">
                <h3 className="text-lg font-semibold text-white mb-3">각호의 개인정보 처리 및 보유기간은 다음과 같습니다:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-gray-200">회원 정보:</strong> 회원 탈퇴 시까지</li>
                  <li><strong className="text-gray-200">캠페인 정보:</strong> 캠페인 종료 후 3년</li>
                  <li><strong className="text-gray-200">결제 정보:</strong> 전자상거래 등에서의 소비자 보호에 관한 법률에 따라 5년</li>
                  <li><strong className="text-gray-200">접속 로그:</strong> 통신비밀보호법에 따라 3개월</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">3. 처리하는 개인정보의 항목</h2>
              <p className="mb-4">회사는 다음의 개인정보 항목을 처리하고 있습니다:</p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-800/30 backdrop-blur-sm p-4 rounded-lg border border-blue-600/30">
                  <h3 className="text-lg font-semibold text-blue-300 mb-3">필수항목</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>이메일 주소</li>
                    <li>비밀번호</li>
                    <li>닉네임</li>
                    <li>휴대전화번호</li>
                    <li>서비스 이용기록</li>
                    <li>접속 로그</li>
                  </ul>
                </div>

                <div className="bg-green-800/30 backdrop-blur-sm p-4 rounded-lg border border-green-600/30">
                  <h3 className="text-lg font-semibold text-green-300 mb-3">선택항목</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>프로필 사진</li>
                    <li>소셜미디어 계정</li>
                    <li>관심분야</li>
                    <li>마케팅 수신 동의</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">4. 개인정보의 제3자 제공</h2>
              <p className="mb-4">
                회사는 정보주체의 개인정보를 제1조의 처리목적 범위 내에서만 처리하며,
                정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조에 해당하는 경우에만
                개인정보를 제3자에게 제공합니다.
              </p>

              <div className="bg-yellow-800/20 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                <h3 className="text-lg font-semibold text-yellow-300 mb-2">제3자 제공 현황</h3>
                <p className="text-sm text-yellow-300">
                  현재 회사는 개인정보를 제3자에게 정기적으로 제공하지 않습니다.
                  다만, 서비스 제공을 위해 필요한 경우 개별 동의를 받아 최소한의 정보만을 제공합니다.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">5. 개인정보처리의 위탁</h2>
              <p className="mb-4">회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:</p>

              <div className="overflow-x-auto">
                <table className="min-w-full border border-[#2d2f5d]/60 bg-[#2d2f5d]/20 backdrop-blur-sm rounded-lg">
                  <thead className="bg-[#2d2f5d]/40">
                    <tr>
                      <th className="px-4 py-2 border border-[#2d2f5d]/60 text-left text-white">수탁업체</th>
                      <th className="px-4 py-2 border border-[#2d2f5d]/60 text-left text-white">위탁업무</th>
                      <th className="px-4 py-2 border border-[#2d2f5d]/60 text-left text-white">보유기간</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 border border-[#2d2f5d]/60 text-gray-300">Supabase Inc.</td>
                      <td className="px-4 py-2 border border-[#2d2f5d]/60 text-gray-300">데이터베이스 호스팅 및 관리</td>
                      <td className="px-4 py-2 border border-[#2d2f5d]/60 text-gray-300">서비스 이용기간</td>
                    </tr>
                    <tr className="bg-[#2d2f5d]/20">
                      <td className="px-4 py-2 border border-[#2d2f5d]/60 text-gray-300">Vercel Inc.</td>
                      <td className="px-4 py-2 border border-[#2d2f5d]/60 text-gray-300">웹 호스팅 서비스</td>
                      <td className="px-4 py-2 border border-[#2d2f5d]/60 text-gray-300">서비스 이용기간</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">6. 정보주체의 권리·의무 및 행사방법</h2>
              <p className="mb-4">정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:</p>

              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>개인정보 처리현황 통지요구</li>
                <li>개인정보 열람요구</li>
                <li>개인정보 정정·삭제요구</li>
                <li>개인정보 처리정지요구</li>
              </ul>

              <div className="bg-blue-800/30 backdrop-blur-sm p-4 rounded-lg border border-blue-600/30">
                <p className="text-sm text-blue-300">
                  <strong>권리 행사 방법:</strong> 개인정보보호법 시행령 제41조에 따라 서면, 전화, 전자우편,
                  모사전송(FAX) 등을 통하여 하실 수 있으며 회사는 이에 대해 지체없이 조치하겠습니다.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">7. 개인정보의 안전성 확보조치</h2>
              <p className="mb-4">회사는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적 및 물리적 조치를 하고 있습니다:</p>

              <ul className="list-disc pl-6 space-y-2">
                <li>개인정보 취급 직원의 최소화 및 교육</li>
                <li>개인정보에 대한 접근 제한</li>
                <li>개인정보를 처리하는 데이터베이스시스템에 대한 접근권한의 제한</li>
                <li>접속기록의 보관 및 위변조 방지</li>
                <li>개인정보의 암호화</li>
                <li>해킹 등에 대비한 기술적 대책</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">8. 개인정보보호책임자</h2>
              <div className="bg-[#2d2f5d]/30 backdrop-blur-sm p-6 rounded-lg border border-[#2d2f5d]/60">
                <p className="mb-4">
                  회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한
                  정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보보호책임자를 지정하고 있습니다.
                </p>

                <div className="space-y-2">
                  <p><strong className="text-white">▶ 개인정보보호책임자</strong></p>
                  <p className="text-gray-300">성명: 최성훈</p>
                  <p className="text-gray-300">직책: 대표이사</p>
                  <p className="text-gray-300">연락처: 010-2803-5248, borrow13@sunjeong.co.kr</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">9. 개인정보처리방침의 변경</h2>
              <p className="mb-4">
                이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는
                변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">10. 개인정보의 열람청구</h2>
              <p className="mb-4">
                정보주체는 개인정보보호법 제35조에 따른 개인정보의 열람 청구를 아래의 부서에 할 수 있습니다.
                회사는 정보주체의 개인정보 열람청구가 신속하게 처리되도록 노력하겠습니다.
              </p>

              <div className="bg-blue-800/30 backdrop-blur-sm p-4 rounded-lg border border-blue-600/30">
                <p className="text-sm text-blue-300">
                  <strong>▶ 개인정보 열람청구 접수·처리 부서</strong><br />
                  부서명: 개발팀<br />
                  담당자: 박경록<br />
                  연락처: 010-4320-0523, borrow13@sunjeong.co.kr
                </p>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-[#2d2f5d]/60 text-center">
              <p className="text-gray-400">
                <strong className="text-white">주식회사 선정에이전시</strong><br />
                서울특별시 성동구 성수일로8길 55 B동 706호<br />
                사업자등록번호: 170-88-03245<br />
                대표: 최성훈<br />
                연락처: 010-2803-5248
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}