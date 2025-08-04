export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0b0c24] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">개인정보처리방침</h1>
        
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. 개인정보의 처리 목적</h2>
            <p className="mb-4">
              링커블(Lynkable)은 다음의 목적을 위하여 개인정보를 처리하고 있으며, 
              다음의 목적 이외의 용도로는 이용하지 않습니다.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>회원 가입 및 관리</li>
              <li>서비스 제공 및 운영</li>
              <li>고객 상담 및 문의 응대</li>
              <li>마케팅 및 광고 활용</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. 개인정보의 처리 및 보유기간</h2>
            <p className="mb-4">
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>회원 탈퇴 시까지 (단, 관계법령에 따라 보존이 필요한 경우 해당 기간까지)</li>
              <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
              <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
              <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. 개인정보의 제3자 제공</h2>
            <p className="mb-4">
              회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 
              정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. 개인정보처리의 위탁</h2>
            <p className="mb-4">
              회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>위탁받는 자: Supabase</li>
              <li>위탁하는 업무의 내용: 데이터베이스 관리 및 호스팅</li>
              <li>위탁기간: 회원 탈퇴 시까지</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. 정보주체의 권리·의무 및 그 행사방법</h2>
            <p className="mb-4">
              정보주체는 회사에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. 개인정보의 파기</h2>
            <p className="mb-4">
              회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 
              지체없이 해당 개인정보를 파기합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. 개인정보의 안전성 확보 조치</h2>
            <p className="mb-4">
              회사는 개인정보보호법 제29조에 따라 다음과 같은 안전성 확보 조치를 취하고 있습니다.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>개인정보의 암호화</li>
              <li>해킹 등에 대비한 기술적 대책</li>
              <li>개인정보에 대한 접근 제한</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">8. 개인정보 보호책임자</h2>
            <p className="mb-4">
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 
              개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p><strong>개인정보 보호책임자</strong></p>
              <p>성명: 링커블 관리팀</p>
              <p>연락처: support@lynkable.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">9. 개인정보 처리방침의 변경</h2>
            <p className="mb-4">
              이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">10. 개인정보의 안전성 확보 조치</h2>
            <p className="mb-4">
              본 방침은 2024년 8월 4일부터 적용됩니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 