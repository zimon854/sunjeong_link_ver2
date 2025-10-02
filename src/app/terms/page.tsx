import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '이용약관 | Lynkable',
  description: '링커블 서비스 이용약관',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0b0c24] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#181b3a]/95 backdrop-blur-xl rounded-lg shadow-2xl border border-[#2d2f5d]/60 p-8">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            이용약관
          </h1>

          <div className="prose max-w-none text-gray-300">
            <div className="mb-8 p-4 bg-blue-800/30 backdrop-blur-sm rounded-lg border border-blue-600/30">
              <p className="text-sm text-blue-300">
                <strong>시행일자:</strong> 2024년 1월 1일<br />
                <strong>최종 개정일:</strong> 2024년 10월 2일
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">제1조 (목적)</h2>
              <p className="mb-4">
                이 약관은 주식회사 선정에이전시(이하 "회사")가 제공하는 링커블(Lynkable) 서비스(이하 "서비스")의
                이용과 관련하여 회사와 이용자와의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">제2조 (정의)</h2>
              <p className="mb-4">이 약관에서 사용하는 용어의 정의는 다음과 같습니다:</p>

              <div className="bg-[#2d2f5d]/30 backdrop-blur-sm p-4 rounded-lg border border-[#2d2f5d]/60">
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-gray-200">"서비스"</strong>란 회사가 제공하는 인플루언서 마케팅 플랫폼을 의미합니다.</li>
                  <li><strong className="text-gray-200">"이용자"</strong>란 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</li>
                  <li><strong className="text-gray-200">"회원"</strong>이란 회사와 서비스 이용계약을 체결하고 이용자 아이디(ID)를 부여받은 자를 의미합니다.</li>
                  <li><strong className="text-gray-200">"브랜드"</strong>란 마케팅 캠페인을 의뢰하는 기업 또는 개인을 의미합니다.</li>
                  <li><strong className="text-gray-200">"인플루언서"</strong>란 소셜미디어를 통해 마케팅 활동을 수행하는 개인을 의미합니다.</li>
                  <li><strong className="text-gray-200">"캠페인"</strong>이란 브랜드와 인플루언서 간의 마케팅 프로젝트를 의미합니다.</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">제3조 (약관의 효력 및 변경)</h2>
              <p className="mb-4">
                ① 이 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력을 발생합니다.
              </p>
              <p className="mb-4">
                ② 회사는 합리적인 사유가 발생할 경우에는 관련 법령에 위배되지 않는 범위에서 이 약관을 변경할 수 있으며,
                약관이 변경되는 경우에는 변경된 약관의 내용과 시행일을 정하여, 그 시행일로부터 최소 7일 이전에
                서비스 내 공지사항을 통해 예고합니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">제4조 (서비스의 제공)</h2>
              <p className="mb-4">회사가 제공하는 서비스는 다음과 같습니다:</p>

              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>인플루언서 마케팅 매칭 플랫폼 서비스</li>
                <li>캠페인 관리 및 모니터링 서비스</li>
                <li>성과 분석 및 리포팅 서비스</li>
                <li>결제 및 정산 서비스</li>
                <li>고객지원 서비스</li>
                <li>기타 회사가 정하는 서비스</li>
              </ul>

              <div className="bg-yellow-800/20 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                <p className="text-sm text-yellow-300">
                  <strong>서비스 제공 시간:</strong> 연중무휴 24시간 제공을 원칙으로 하나,
                  시스템 점검 등 운영상 필요한 경우 서비스를 일시 중단할 수 있습니다.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">제5조 (회원가입)</h2>
              <p className="mb-4">
                ① 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로써
                회원가입을 신청합니다.
              </p>
              <p className="mb-4">
                ② 회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한
                회원으로 등록합니다.
              </p>

              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
                <li>허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우</li>
                <li>이용자의 귀책사유로 인하여 승인이 불가능하거나 기타 규정한 제반 사항을 위반하며 신청하는 경우</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">제6조 (회원 정보의 변경)</h2>
              <p className="mb-4">
                ① 회원은 개인정보관리화면을 통하여 언제든지 본인의 개인정보를 열람하고 수정할 수 있습니다.
              </p>
              <p className="mb-4">
                ② 회원은 회원가입시 기재한 사항이 변경되었을 경우 온라인으로 수정을 하거나 전자우편 기타 방법으로
                회사에 그 변경사항을 알려야 합니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">제7조 (개인정보보호)</h2>
              <p className="mb-4">
                ① 회사는 이용자의 개인정보를 보호하기 위해 개인정보보호법 등 관련 법령에 따라 별도의
                개인정보처리방침을 정하여 준수합니다.
              </p>
              <p className="mb-4">
                ② 회사의 개인정보처리방침은 서비스 화면에 공개되어 있으며, 이용자는 언제든지 이를 확인할 수 있습니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">제8조 (이용자의 의무)</h2>
              <p className="mb-4">이용자는 다음 행위를 하여서는 안 됩니다:</p>

              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>신청 또는 변경시 허위내용의 등록</li>
                <li>타인의 정보도용</li>
                <li>회사가 게시한 정보의 변경</li>
                <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                <li>회사 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                <li>회사 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
                <li>기타 불법적이거나 부당한 행위</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">제9조 (서비스 이용료)</h2>
              <div className="bg-green-800/30 backdrop-blur-sm p-4 rounded-lg border border-green-600/30">
                <p className="mb-4 text-green-300">
                  ① 회사의 서비스는 기본적으로 무료로 제공됩니다. 단, 유료 서비스의 경우 해당 서비스의
                  이용료를 지불하여야 서비스를 이용할 수 있습니다.
                </p>
                <p className="mb-4 text-green-300">
                  ② 유료 서비스의 요금, 결제방법, 결제일 등은 각 서비스별로 안내되며, 회원은 이에 동의한 후
                  유료 서비스를 이용할 수 있습니다.
                </p>
                <p className="text-green-300">
                  ③ 캠페인 성사시 회사는 거래 금액의 일정 비율을 수수료로 부과할 수 있습니다.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">제10조 (저작권의 귀속 및 이용제한)</h2>
              <p className="mb-4">
                ① 회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에 귀속합니다.
              </p>
              <p className="mb-4">
                ② 이용자는 서비스를 이용함으로써 얻은 정보 중 회사에게 지적재산권이 귀속된 정보를
                회사의 사전 승낙없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나
                제3자에게 이용하게 하여서는 안됩니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">제11조 (계약해지 및 이용제한)</h2>
              <p className="mb-4">
                ① 회원이 이용계약을 해지하고자 하는 때에는 회원 본인이 온라인을 통하여
                회사에 해지신청을 하여야 합니다.
              </p>
              <p className="mb-4">
                ② 회사는 회원이 다음 각호의 사유에 해당하는 경우, 사전통지 없이 이용계약을 해지하거나
                또는 기간을 정하여 서비스 이용을 정지할 수 있습니다.
              </p>

              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>가입 신청시에 허위 내용을 등록한 경우</li>
                <li>다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우</li>
                <li>서비스를 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우</li>
                <li>기타 회사가 정한 이용조건에 위반한 경우</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">제12조 (손해배상)</h2>
              <p className="mb-4">
                ① 회사는 무료로 제공되는 서비스와 관련하여 회원에게 어떠한 손해가 발생하더라도
                동 손해가 회사의 고의 또는 중대한 과실에 기인한 경우를 제외하고는 이에 대하여 책임을 부담하지 아니합니다.
              </p>
              <p className="mb-4">
                ② 회사가 제공하는 서비스로 인하여 회원에게 손해가 발생한 경우,
                회사의 책임은 해당 서비스의 이용료 범위 내로 제한됩니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">제13조 (면책조항)</h2>
              <p className="mb-4">
                ① 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는
                서비스 제공에 관한 책임이 면제됩니다.
              </p>
              <p className="mb-4">
                ② 회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.
              </p>
              <p className="mb-4">
                ③ 회사는 회원이 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며,
                그 밖의 서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">제14조 (분쟁해결)</h2>
              <p className="mb-4">
                ① 회사는 이용자로부터 제출되는 불만사항 및 의견은 우선적으로 그 사항을 처리합니다.
                다만, 신속한 처리가 곤란한 경우에는 이용자에게 그 사유와 처리일정을 통보해 드립니다.
              </p>
              <p className="mb-4">
                ② 회사와 이용자 간에 발생한 전자상거래 분쟁에 관하여는 소비자분쟁조정위원회의 조정에 따를 수 있습니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">제15조 (재판권 및 준거법)</h2>
              <p className="mb-4">
                ① 회사와 이용자 간에 발생한 분쟁에 관한 소송은 대한민국 법을 준거법으로 하며,
                회사의 본사 소재지를 관할하는 법원에 제기합니다.
              </p>
              <p className="mb-4">
                ② 이 약관은 대한민국 법령에 의하여 규정되고 이행됩니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">부칙</h2>
              <div className="bg-blue-800/30 backdrop-blur-sm p-4 rounded-lg border border-blue-600/30">
                <p className="mb-2 text-blue-300">
                  <strong>제1조 (시행일)</strong><br />
                  이 약관은 2024년 1월 1일부터 적용됩니다.
                </p>
                <p className="text-blue-300">
                  <strong>제2조 (경과조치)</strong><br />
                  이 약관 시행 이전에 가입한 회원에 대해서는 개정된 약관을 적용합니다.
                </p>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-[#2d2f5d]/60 text-center">
              <p className="text-gray-400">
                <strong className="text-white">주식회사 선정에이전시</strong><br />
                서울특별시 성동구 성수일로8길 55 B동 706호<br />
                사업자등록번호: 170-88-03245<br />
                대표: 최성훈<br />
                연락처: 010-2803-5248<br />
                이메일: borrow13@sunjeong.co.kr
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}