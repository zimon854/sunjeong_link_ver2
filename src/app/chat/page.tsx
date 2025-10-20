import AdaptiveLayout from '@/components/AdaptiveLayout';

export default function ChatPage() {
  return (
    <AdaptiveLayout title="실시간 채팅">
      <div className="max-w-xl mx-auto py-20 text-center text-blue-200">
        <p className="text-2xl font-semibold mb-4">실시간 채팅 기능은 현재 비활성화되어 있습니다.</p>
        <p className="text-base text-blue-300/80">빠른 시일 내에 다시 오픈될 예정이니 조금만 기다려 주세요.</p>
        <p className="mt-6 text-sm text-blue-300/60">긴급 문의가 필요하면 연락처 페이지를 이용해 주세요.</p>
      </div>
    </AdaptiveLayout>
  );
}
