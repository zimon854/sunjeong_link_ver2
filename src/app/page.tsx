"use client";
import React, { useEffect, useRef, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import AdaptiveLayout from '@/components/AdaptiveLayout';
import { useNativeToast } from '@/hooks/useNativeToast';
import { usePWAFeatures } from '@/hooks/usePWAFeatures';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from "next/navigation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

interface Message {
  id: number;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

const MY_USER_ID = '내_유저_UUID'; // 실제 로그인 유저의 UUID로 대체 필요
const OTHER_USER_ID = '상대_유저_UUID'; // 상대방 UUID

const categories = ["뷰티", "라이프", "푸드", "패션"];

export default function Home() {
  const supabase = createClient();
  // Hydration mismatch 방지: 클라이언트에서만 연도 렌더링
  const [year, setYear] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [price, setPrice] = useState("");
  const [shopifyUrl, setShopifyUrl] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  // PWA 기능들 추가
  const { showSuccess, showError, showInfo } = useNativeToast();
  const { deviceInfo, isAppMode, hapticFeedback, useSwipeGesture } = usePWAFeatures();

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  // 메시지 불러오기
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${MY_USER_ID},receiver_id.eq.${OTHER_USER_ID}),and(sender_id.eq.${OTHER_USER_ID},receiver_id.eq.${MY_USER_ID})`)
        .order('created_at', { ascending: true });
      if (data) setMessages(data);
    };
    fetchMessages();
  }, []);

  // 실시간 구독
  useEffect(() => {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload: any) => {
          const msg = payload.new as Message;
          // 내 채팅방에 해당하는 메시지만 추가
          if (
            (msg.sender_id === MY_USER_ID && msg.receiver_id === OTHER_USER_ID) ||
            (msg.sender_id === OTHER_USER_ID && msg.receiver_id === MY_USER_ID)
          ) {
            setMessages((prev) => [...prev, msg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 스크롤 아래로
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 메시지 전송
  const sendMessage = async () => {
    if (!input.trim()) return;
    await supabase.from('messages').insert([
      {
        sender_id: MY_USER_ID,
        receiver_id: OTHER_USER_ID,
        content: input,
      },
    ]);
    setInput('');
  };

  const partnerLogos = [
    { src: "/logo/쇼피파이.svg", alt: "Shopify" },
    { src: "/logo/Q10.svg", alt: "Q10" },
    { src: "/logo/틱톡.svg", alt: "TikTok" },
    { src: "/logo/인스타그램.svg", alt: "Instagram" },
    { src: "/logo/유튜브 쇼츠.svg", alt: "YouTube Shorts" },
    { src: "/logo/페이오니아.svg", alt: "Payoneer" },
    { src: "/logo/아마존.svg", alt: "Amazon" },
  ];

  // 예시 데이터
  const kpis = [
    { icon: '👁️', label: '총 클릭수', value: '28,500', diff: 12 },
    { icon: '🛒', label: '전환수', value: '1,240', diff: -3 },
    { icon: '💰', label: '총 매출', value: '₩38,200,000', diff: 8 },
    { icon: '📈', label: 'ROI', value: '412%', diff: 2 },
    { icon: '📝', label: '리뷰 수', value: '1,120', diff: 5 },
  ];

  // 차트 데이터 예시
  const trendData = {
    labels: ['6/1', '6/2', '6/3', '6/4', '6/5', '6/6', '6/7'],
    datasets: [
      {
        label: '클릭수',
        data: [3200, 4100, 3900, 5000, 4800, 5300, 5200],
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96,165,250,0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        label: '전환수',
        data: [120, 140, 130, 180, 170, 200, 200],
        borderColor: '#34d399',
        backgroundColor: 'rgba(52,211,153,0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const channelData = {
    labels: ['인스타그램', '틱톡', '유튜브', '기타'],
    datasets: [
      {
        data: [52, 28, 15, 5],
        backgroundColor: ['#60a5fa', '#f472b6', '#fbbf24', '#a3a3a3'],
      },
    ],
  };

  // 캠페인별 테이블 예시
  const campaigns = [
    { name: '여름 뷰티 특가', period: '6/1~6/7', click: 8200, conv: 320, sales: 12000000, review: 120, status: '진행중' },
    { name: '동남아 K-뷰티', period: '6/1~6/7', click: 5400, conv: 180, sales: 8200000, review: 80, status: '종료' },
    { name: '글로벌 체험단', period: '6/1~6/7', click: 9600, conv: 410, sales: 15200000, review: 210, status: '진행중' },
  ];

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    // PWA에서 햅틱 피드백
    if (isAppMode) {
      hapticFeedback('light');
    }
    
    let imagePath = "";
    if (image) {
      const { data, error } = await supabase.storage
        .from("campaigns")
        .upload(`thumbnails/${Date.now()}_${image.name}`, image);
      if (error) {
        const errorMsg = "이미지 업로드 실패: " + error.message;
        setMessage(errorMsg);
        showError?.(errorMsg);
        setLoading(false);
        return;
      }
      imagePath = data.path;
    }
    const { data, error } = await supabase.from("campaigns").insert([
      {
        title,
        brand,
        category,
        price: Number(price),
        image: imagePath,
        shopify_url: shopifyUrl,
        status: "진행중",
        participants: 0,
        description: desc,
      },
    ]);
    setLoading(false);
    if (error) {
      const errorMsg = "캠페인 등록 실패: " + error.message;
      setMessage(errorMsg);
      showError?.(errorMsg);
    } else {
      const successMsg = "캠페인 등록 완료!";
      setMessage(successMsg);
      showSuccess?.(successMsg);
      
      // PWA에서 성공 햅틱 피드백
      if (isAppMode) {
        hapticFeedback('medium');
      }
      
      // 등록된 캠페인 상세페이지로 이동
      setTimeout(() => {
        router.push("/campaigns");
      }, 1000);
    }
  };

  // PWA 스와이프 제스처 설정
  useSwipeGesture(
    () => {
      // 오른쪽 스와이프 - 뒤로가기
      if (isAppMode) {
        showInfo?.("뒤로가기");
        router.back();
      }
    },
    () => {
      // 왼쪽 스와이프 - 캠페인 페이지로
      if (isAppMode) {
        showInfo?.("캠페인 페이지로 이동");
        router.push('/campaigns');
      }
    }
  );

  return (
    <AdaptiveLayout title="링커블 - 홈">
      <div className="w-full text-white">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center h-[60vh] text-center px-4 w-full">
        <div className="absolute inset-0 -z-10">
          <Image src="/hero-bg.jpg" alt="hero bg" fill sizes="100vw" className="object-cover opacity-60" />
        </div>
        <h1 className="text-2xl md:text-6xl font-bold mb-4 drop-shadow-lg leading-tight">
          터지는 <span className="text-blue-400">쇼핑!</span> 팔리는 <span className="text-blue-400">리뷰!</span> <br className="hidden md:block" />
          강력한 <span className="text-blue-400">확산!</span>
        </h1>
        <p className="mb-8 text-sm md:text-2xl text-gray-200 px-4">SNS와 인플루언서로 만드는 새로운 마케팅 성공 공식</p>
        <a href="#consult" className="px-4 md:px-8 py-3 rounded-full text-white bg-blue-500 hover:bg-white-600 text-sm md:text-lg font-semibold transition transform hover:scale-105 active:scale-95">
          무료 컨설팅 신청
        </a>
      </section>

      {/* Stats Section */}
      <section className="flex flex-wrap justify-center gap-4 md:gap-8 py-8 border-b border-gray-800 px-4 w-full">
        <Stat label="누적 리뷰" value="20,748+" />
        <Stat label="누적 인플루언서" value="140만+" />
        <Stat label="누적 SNS 도달" value="2.85억+" />
      </section>

      {/* Partner Logos */}
      <section className="overflow-hidden w-full py-8 bg-transparent">
        <div className="relative w-full">
          <div className="flex items-center gap-6 md:gap-16 animate-logo-slide">
            {[...Array(3)].flatMap(() => partnerLogos).map((logo, i) => (
              <div
                key={logo.alt + i}
                className="transition hover:scale-110 hover:opacity-100 opacity-90 grayscale hover:grayscale-0 flex items-center justify-center p-1 min-w-[120px] max-w-[160px] h-[60px]"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  width={60}
                  height={30}
                  className="object-contain w-full h-full filter brightness-200 invert hover:filter-none transition-filter duration-200"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
        
      </section>

      {/* Service Cards */}
      <section className="py-8 md:py-12 px-4 max-w-5xl mx-auto w-full">
        <h2 className="text-xl md:text-4xl font-bold mb-6 md:mb-10 text-center">마케팅, 0원부터 무제한으로 시작!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <ServiceCard
            title="0원으로 구매평 만들기"
            desc="SNS 인플루언서와 함께 무료로 제품을 알리고 판매까지!"
            img="/menu1/구매평.png"
          />
          <ServiceCard
            title="무제한 쇼핑체험단"
            desc="브랜드/셀러 누구나, 원하는 만큼 리뷰/체험단 모집 가능"
            img="/menu1/인플루언서.png"
          />
          <ServiceCard
            title="맞춤형 인플루언서 매칭"
            desc="AI 기반으로 우리 브랜드에 딱 맞는 인플루언서 자동 추천"
            img="/menu1/해외인플루언서.png"
          />
          <ServiceCard
            title="글로벌 인플루언서 셀링"
            desc="동남아, 글로벌까지 확장되는 해외 마케팅 지원"
            img="/menu1/셀링인플루언서.png"
          />
        </div>
      </section>

      {/* Membership Plan */}
      <section className="py-8 md:py-12 bg-[#181830] w-full">
        <h2 className="text-xl md:text-3xl font-bold mb-6 md:mb-8 text-center">브랜드 맞춤형 추천 플랜</h2>
        <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 mb-8 md:mb-12 px-4">
          <PlanCard title="무료 체험" price="0원" features={["기본 기능 제공", "SNS 리뷰 1회"]} highlight />
          <PlanCard title="성장 플랜" price="30만원" features={["SNS 리뷰 10회", "AI 매칭"]} />
          <PlanCard title="프리미엄" price="75만원" features={["무제한 리뷰", "글로벌 확장"]} />
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-8 md:py-12 max-w-4xl mx-auto px-4 w-full">
        <h2 className="text-lg md:text-xl font-bold mb-4">플랜별 기능 비교</h2>
        <div className="overflow-x-auto rounded-2xl shadow-lg bg-[#181830] mb-8 md:mb-12">
          <table className="min-w-full text-center">
            <thead className="bg-blue-900/80 text-white">
              <tr>
                <th className="p-2 md:p-3 text-xs md:text-sm">기능</th>
                <th className="p-2 md:p-3 text-xs md:text-sm">무료</th>
                <th className="p-2 md:p-3 text-xs md:text-sm">성장</th>
                <th className="p-2 md:p-3 text-xs md:text-sm">프리미엄</th>
              </tr>
            </thead>
            <tbody className="text-blue-100">
              <tr className="border-b border-blue-800">
                <td className="p-2 md:p-3 text-xs md:text-sm">SNS 리뷰</td>
                <td className="text-xs md:text-sm">1회</td>
                <td className="text-xs md:text-sm">10회</td>
                <td className="text-xs md:text-sm">무제한</td>
              </tr>
              <tr className="border-b border-blue-800">
                <td className="p-2 md:p-3 text-xs md:text-sm">AI 매칭</td>
                <td className="text-xs md:text-sm">-</td>
                <td className="text-xs md:text-sm">O</td>
                <td className="text-xs md:text-sm">O</td>
              </tr>
              <tr>
                <td className="p-2 md:p-3 text-xs md:text-sm">글로벌 확장</td>
                <td className="text-xs md:text-sm">-</td>
                <td className="text-xs md:text-sm">-</td>
                <td className="text-xs md:text-sm">O</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-8 md:py-12 px-4 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16 w-full">
        <FeatureCard title="경쟁사 리뷰 분석" desc="AI로 경쟁사 리뷰/트렌드 자동 분석" color="green" />
        <FeatureCard title="구매뽑기" desc="SNS 이벤트로 구매자 데이터 수집" color="blue" />
        <FeatureCard title="맞춤형 인플루언서 매칭" desc="브랜드에 최적화된 인플루언서 자동 추천" color="orange" />
      </section>

      {/* 후기/리뷰 */}
      <section className="py-8 md:py-12 bg-[#181830] w-full">
        <h2 className="text-lg md:text-2xl font-bold mb-6 md:mb-8 text-center px-4">이미 이용 중인 브랜드사 2만여 곳, 만족도 89%</h2>
        <div className="flex flex-wrap justify-center gap-3 md:gap-8 px-4">
          {[1,2,3,4].map((n) => (
            <img
              key={n}
              src={`/reviews/review${n}.png`}
              alt={`review${n}`}
              className="w-[140px] h-[100px] md:w-[260px] md:h-[180px] rounded-2xl object-cover shadow-xl transition hover:scale-105 bg-[#10112a] object-cover"
              draggable={false}
            />
          ))}
        </div>
      </section>

      {/* Partnership */}
      <section
        className="relative py-12 md:py-24 flex flex-col items-center justify-center text-center w-full min-h-[300px] bg-gradient-to-r from-blue-900 to-purple-900 overflow-hidden"
      >
        {/* 배경 블러/이미지 효과 */}
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center opacity-70 filter blur-sm brightness-90"
          style={{ backgroundImage: "url('/partnership-bg.jpg')" }}
        />
        <h2 className="text-2xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">Partnership</h2>
        <p className="text-sm md:text-xl text-blue-100 mb-2 px-4">브랜드를 운영하면서 다양한 문제에 직면합니다.</p>
        <p className="text-xs md:text-lg text-blue-200 mb-6 md:mb-8 px-4">
          <span className="font-bold text-blue-300">링커블</span>은 글로벌 파트너십을 통해 다양한 문제를 쉽고 빠르게 해결하며,<br className="hidden md:block" />
          앞선 해결책을 제시합니다.
        </p>
        <a
          href="#"
          className="inline-block px-4 md:px-8 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-sm md:text-lg font-semibold text-white shadow-lg transition mb-6 md:mb-12 transform hover:scale-105 active:scale-95"
        >
          파트너십 제안하기 &rarr;
        </a>
        {/* 파트너 로고 슬라이드/배치 */}
        <div className="w-full flex flex-wrap justify-center items-center gap-4 md:gap-16 px-4">
          {[
            { src: "/logo/Q10.svg", alt: "Qoo10" },
            { src: "/logo/유튜브 쇼츠.svg", alt: "Colosseum" },
            { src: "/logo/인스타그램.svg", alt: "Connect AI" },
            { src: "/logo/쇼피파이.svg", alt: "Shopify" },
            { src: "/logo/아마존.svg", alt: "Amazon" },
            { src: "/logo/페이오니아.svg", alt: "Payoneer" },
          ].map((logo, i) => (
            <img
              key={logo.alt + i}
              src={logo.src}
              alt={logo.alt}
              className="h-8 md:h-24 object-contain opacity-80 hover:opacity-100 transition max-w-[80px] min-w-[60px]"
              draggable={false}
            />
          ))}
        </div>
      </section>

      {/* 1:1 문의 */}
      <section className="py-12 md:py-16 flex flex-col items-center justify-center bg-transparent px-4 w-full">
        <div className="text-blue-400 text-sm md:text-lg font-semibold mb-2">Consulting</div>
        <h2 className="text-2xl md:text-5xl font-bold mb-4 text-white text-center">1:1 무료 컨설팅</h2>
        <div className="text-blue-300 text-base md:text-xl font-bold mb-1 text-center">7월한정! 공동구매 연결 무제한 0원 지원!</div>
        <div className="text-blue-100 mb-6 md:mb-8 text-center">지금 바로 문의하세요</div>
        <form
          className="w-full max-w-xl bg-[#23232b] rounded-2xl shadow-2xl overflow-hidden rounded-[24px]"
          onSubmit={handleSubmit}
        >
          {/* 파란 헤더 */}
          <div className="bg-blue-600 text-white text-sm md:text-lg font-bold py-4 px-6 text-center">
            상담 국가 선택*
          </div>
          <div className="p-4 md:p-6 flex flex-col gap-4 md:gap-6">
            {/* 국가 선택 */}
            <div>
              <div className="mb-2 font-semibold text-gray-200 text-xs md:text-base">상담 국가 선택*</div>
              <div className="flex gap-3 md:gap-6 flex-wrap">
                <label className="flex items-center gap-2 text-xs md:text-base">
                  <input type="checkbox" className="accent-blue-500 w-3 h-3 md:w-5 md:h-5" /> 국내
                </label>
                <label className="flex items-center gap-2 text-xs md:text-base">
                  <input type="checkbox" className="accent-blue-500 w-3 h-3 md:w-5 md:h-5" /> 해외
                </label>
                <label className="flex items-center gap-2 text-xs md:text-base">
                  <input type="checkbox" className="accent-blue-500 w-3 h-3 md:w-5 md:h-5" /> 제휴문의
                </label>
              </div>
            </div>
            {/* 컨설팅 항목 선택 */}
            <div>
              <div className="mb-2 font-semibold text-gray-200 text-xs md:text-base">컨설팅 항목 선택*</div>
              <div className="flex gap-3 md:gap-6 flex-wrap">
                <label className="flex items-center gap-2 text-xs md:text-base">
                  <input type="checkbox" className="accent-blue-500 w-3 h-3 md:w-5 md:h-5" /> 쇼츠 체험단(시팅)
                </label>
                <label className="flex items-center gap-2 text-xs md:text-base">
                  <input type="checkbox" className="accent-blue-500 w-3 h-3 md:w-5 md:h-5" /> 맞춤 키 인플루언서
                </label>
                <label className="flex items-center gap-2 text-xs md:text-base">
                  <input type="checkbox" className="accent-blue-500 w-3 h-3 md:w-5 md:h-5" /> 해외 공동구매
                </label>
              </div>
            </div>
            {/* 담당자명/연락처 */}
            <div className="flex gap-4 flex-col md:flex-row">
              <div className="flex-1">
                <div className="mb-2 font-semibold text-gray-200 text-xs md:text-base">담당자명*</div>
                <input
                  className="w-full p-3 rounded bg-[#181820] text-black placeholder-gray-500 text-xs md:text-base"
                  placeholder="담당자명을 입력해주세요."
                  required
                />
              </div>
              <div className="flex-1">
                <div className="mb-2 font-semibold text-gray-200 text-xs md:text-base">연락처*</div>
                <input
                  className="w-full p-3 rounded bg-[#181820] text-black placeholder-gray-500 text-xs md:text-base"
                  placeholder="연락처를 입력해주세요."
                  required
                />
              </div>
            </div>
            {/* 이메일 */}
            <div>
              <div className="mb-2 font-semibold text-gray-200 text-xs md:text-base">이메일*</div>
              <input
                className="w-full p-3 rounded bg-[#181820] text-black placeholder-gray-500 text-xs md:text-base"
                placeholder="이메일을 입력해주세요."
                required
              />
            </div>
            {/* 개인정보 동의 */}
            <div className="flex items-center gap-2">
              <input type="checkbox" className="accent-blue-500 w-3 h-3 md:w-5 md:h-5" required />
              <span className="text-gray-300 text-xs md:text-sm">개인정보보호정책에 동의합니다.</span>
            </div>
            {/* 제출 버튼 */}
            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-full bg-blue-500 hover:bg-blue-600 font-semibold text-white text-sm md:text-lg flex items-center justify-center gap-2 transition transform hover:scale-105 active:scale-95"
              disabled={loading}
              onClick={() => hapticFeedback('medium')}
            >
              {loading ? "등록 중..." : "제출하기"}
            </button>
          </div>
        </form>
      </section>

      {/* Success Stories */}
      <section className="py-8 md:py-12 max-w-5xl mx-auto px-4 w-full">
        <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center">성공 사례</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-[#181830] rounded-2xl shadow-xl p-6 hover:scale-105 transition">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">K-뷰티 브랜드 A사</h3>
                <p className="text-sm text-gray-400">동남아 진출 성공</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              링커블을 통해 태국 인플루언서 50명과 협업하여 3개월 만에 현지 매출 300% 증가
            </p>
            <div className="flex items-center text-xs text-blue-400">
              <span className="font-semibold">매출 증가률: +300%</span>
              <span className="ml-4">참여 인플루언서: 50명</span>
            </div>
          </div>

          <div className="bg-[#181830] rounded-2xl shadow-xl p-6 hover:scale-105 transition">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">패션 브랜드 B사</h3>
                <p className="text-sm text-gray-400">인플루언서 마케팅 대성공</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              링커블 AI 매칭을 통해 브랜드에 최적화된 인플루언서 발굴, 월 평균 ROI 450% 달성
            </p>
            <div className="flex items-center text-xs text-green-400">
              <span className="font-semibold">ROI: +450%</span>
              <span className="ml-4">캠페인 성공률: 95%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Benefits */}
      <section className="py-8 md:py-12 bg-[#181830]/50 w-full">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center">링커블이 특별한 이유</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI 기반 매칭</h3>
              <p className="text-gray-300 text-sm">브랜드와 인플루언서의 완벽한 매칭을 위한 AI 알고리즘</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">글로벌 네트워크</h3>
              <p className="text-gray-300 text-sm">동남아시아 140만+ 검증된 인플루언서 네트워크</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">실시간 분석</h3>
              <p className="text-gray-300 text-sm">캠페인 성과를 실시간으로 모니터링하고 최적화</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-blue-600 to-purple-600 w-full">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">
            지금 시작하세요!
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-8">
            링커블과 함께 글로벌 마케팅의 새로운 차원을 경험해보세요
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a
              href="/campaigns/new"
              className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-gray-100 transition transform hover:scale-105"
            >
              캠페인 시작하기
            </a>
            <a
              href="/influencers"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition transform hover:scale-105"
            >
              인플루언서 둘러보기
            </a>
          </div>
        </div>
      </section>

     
        {/* Footer */}
        <footer className="py-6 md:py-8 text-center text-gray-400 text-xs md:text-sm border-t border-gray-800 mt-6 md:mt-8 w-full">
          &copy; {year ?? ''} 링커블. All rights reserved.
        </footer>
      </div>
    </AdaptiveLayout>
  );
}

// --- 컴포넌트 ---
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-lg md:text-3xl font-bold text-blue-400">{value}</span>
      <span className="text-gray-300 mt-1 text-xs md:text-base">{label}</span>
    </div>
  );
}

function ServiceCard({ title, desc, img }: { title: string; desc: string; img: string }) {
  return (
    <div className="bg-[#181830] rounded-2xl shadow-2xl flex flex-col items-center text-center overflow-hidden min-h-[240px] md:min-h-[340px] transition hover:scale-105 hover:shadow-blue-700/30">
      {/* 이미지 영역: 카드 상단을 꽉 채움 */}
      <div className="w-full h-[100px] md:h-[180px] flex items-center justify-center bg-[#10112a]">
        <img
          src={img}
          alt={title}
          className="object-contain w-full h-full max-h-full max-w-full"
          draggable={false}
        />
      </div>
      {/* 텍스트 영역 */}
      <div className="flex-1 flex flex-col justify-center px-3 md:px-6 py-3 md:py-6">
        <h3 className="text-base md:text-2xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-gray-300 text-xs md:text-lg">{desc}</p>
      </div>
    </div>
  );
}

function PlanCard({ title, price, features, highlight }: { title: string; price: string; features: string[]; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-3 md:p-6 min-w-[140px] md:min-w-[180px] ${highlight ? 'bg-blue-600 text-white shadow-xl scale-105' : 'bg-gray-900 text-gray-100'}`}>
      <h3 className="text-sm md:text-lg font-bold mb-2">{title}</h3>
      <div className="text-lg md:text-2xl font-bold mb-2">{price}</div>
      <ul className="mb-2 text-xs md:text-sm">
        {features.map((f) => <li key={f}>• {f}</li>)}
      </ul>
    </div>
  );
}

function FeatureCard({ title, desc, color }: { title: string; desc: string; color: string }) {
  const colorMap: Record<string, string> = {
    green: 'border-green-400',
    blue: 'border-blue-400',
    orange: 'border-orange-400',
  };
  return (
    <div className={`rounded-xl border-2 ${colorMap[color]} p-3 md:p-6 bg-[#181830] shadow-lg`}>
      <h3 className="text-sm md:text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-300 text-xs md:text-sm">{desc}</p>
    </div>
  );
}



