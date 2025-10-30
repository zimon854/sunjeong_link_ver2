"use client";
import React, { useEffect, useRef, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import AdaptiveLayout from '@/components/AdaptiveLayout';
import { useNativeToast } from '@/hooks/useNativeToast';
import { usePWAFeatures } from '@/hooks/usePWAFeatures';
import logoInstagram from '@/public/logo/인스타그램.svg';
import logoTiktok from '@/public/logo/틱톡.svg';
import logoYoutubeShorts from '@/public/logo/유튜브 쇼츠.svg';
import logoAmazon from '@/public/logo/아마존.svg';
import logoPayoneer from '@/public/logo/페이오니아.svg';
import logoShopify from '@/public/logo/쇼피파이.svg';
import logoQ10 from '@/public/logo/Q10.svg';
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
import { createClient } from '@/lib/supabaseClient';
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
      <div className="w-full bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[80vh] sm:min-h-[70vh] bg-gradient-to-br from-blue-50 via-white to-blue-50 text-center px-4 sm:px-6 lg:px-8 w-full">
        <div className="absolute inset-0 -z-10 opacity-20">
          <Image src="/hero-bg.jpg" alt="hero bg" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <span className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 mb-4 sm:mb-6 text-xs sm:text-sm md:text-base font-display font-semibold text-blue-700 bg-blue-50 rounded-full border border-blue-100 shadow-sm tracking-wide">
            🚀 인플루언서 마케팅 올인원 플랫폼
          </span>
          <h1 className="font-display font-black text-hero mb-4 sm:mb-6 text-slate-900 leading-none px-2 tracking-tight">
            터지는 <span className="text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text">쇼핑</span>, 팔리는 <span className="text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text">리뷰</span>,
            <br className="hidden sm:block" /> 강력한 <span className="text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text">확산</span>까지 한 번에
          </h1>
          <p className="mb-6 sm:mb-8 font-body text-base sm:text-lg md:text-xl text-slate-600 px-4 leading-relaxed max-w-3xl font-medium">
            SNS와 인플루언서 협업으로 성과를 만드는 쉽고 빠른 마케팅 파트너
          </p>
          <a
            href="#consult"
            className="font-display font-bold px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full text-white bg-blue-600 hover:bg-blue-700 text-base sm:text-lg md:text-xl transition transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl tracking-wide"
          >
            무료 컨설팅 신청
          </a>
        </div>
      </section>

      {/* Stats Section */}
      <section className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-16 py-8 sm:py-12 border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8 w-full">
        <Stat label="누적 리뷰" value="20,748+" />
        <Stat label="누적 인플루언서" value="140만+" />
        <Stat label="누적 SNS 도달" value="2.85억+" />
      </section>

      {/* Partner Logos */}
      <section className="overflow-hidden w-full py-12 bg-white">
        <div className="relative w-full">
          <div className="flex items-center gap-8 md:gap-16 animate-logo-slide">
            {[...Array(3)].flatMap(() => partnerLogos).map((logo, i) => (
              <div
                key={logo.alt + i}
                className="transition hover:scale-105 hover:opacity-100 opacity-80 flex items-center justify-center p-2 min-w-[150px] max-w-[220px] h-[80px]"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={180}
                  height={80}
                  className="object-contain w-full h-full transition duration-200"
                  draggable={false}
                  sizes="(min-width: 768px) 180px, 150px"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Cards */}
      <section className="py-16 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="font-heading text-display font-bold mb-4 text-slate-900 tracking-tight">
            마케팅, 0원부터 무제한으로 시작!
          </h2>
          <p className="font-body text-lg text-slate-600 leading-relaxed">
            브랜드 성장을 위한 모든 마케팅 솔루션을 한 곳에서
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
      <section className="py-16 bg-slate-50 w-full">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-heading text-display font-bold mb-12 text-center text-slate-900 tracking-tight">브랜드 맞춤형 추천 플랜</h2>
          <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-8">
            <PlanCard title="무료 체험" price="0원" features={["기본 기능 제공", "SNS 리뷰 1회"]} highlight />
            <PlanCard title="성장 플랜" price="30만원" features={["SNS 리뷰 10회", "AI 매칭"]} />
            <PlanCard title="프리미엄" price="75만원" features={["무제한 리뷰", "글로벌 확장"]} />
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 max-w-6xl mx-auto px-4 w-full">
        <h2 className="font-heading text-headline font-bold mb-8 text-slate-900 text-center tracking-tight">플랜별 기능 비교</h2>
        <div className="overflow-x-auto rounded-2xl shadow-sm bg-white border border-slate-200">
          <table className="min-w-full text-center text-slate-700">
            <thead className="bg-blue-50 text-slate-700">
              <tr>
                <th className="p-4 md:p-6 text-sm md:text-base font-semibold">기능</th>
                <th className="p-4 md:p-6 text-sm md:text-base font-semibold">무료</th>
                <th className="p-4 md:p-6 text-sm md:text-base font-semibold">성장</th>
                <th className="p-4 md:p-6 text-sm md:text-base font-semibold">프리미엄</th>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              <tr className="border-b border-slate-200">
                <td className="p-4 md:p-6 text-sm md:text-base">SNS 리뷰</td>
                <td className="text-sm md:text-base">1회</td>
                <td className="text-sm md:text-base">10회</td>
                <td className="text-sm md:text-base text-blue-600 font-semibold">무제한</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-4 md:p-6 text-sm md:text-base">AI 매칭</td>
                <td className="text-sm md:text-base">-</td>
                <td className="text-sm md:text-base text-green-600">✓</td>
                <td className="text-sm md:text-base text-green-600">✓</td>
              </tr>
              <tr>
                <td className="p-4 md:p-6 text-sm md:text-base">글로벌 확장</td>
                <td className="text-sm md:text-base">-</td>
                <td className="text-sm md:text-base">-</td>
                <td className="text-sm md:text-base text-green-600">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 px-4 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        <FeatureCard title="경쟁사 리뷰 분석" desc="AI로 경쟁사 리뷰/트렌드 자동 분석" color="green" />
        <FeatureCard title="구매뽑기" desc="SNS 이벤트로 구매자 데이터 수집" color="blue" />
        <FeatureCard title="맞춤형 인플루언서 매칭" desc="브랜드에 최적화된 인플루언서 자동 추천" color="orange" />
      </section>

      {/* 후기/리뷰 */}
      <section className="py-16 bg-slate-50 w-full">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-heading text-headline font-bold mb-12 text-center text-slate-900 tracking-tight">
            이미 이용 중인 브랜드사 2만여 곳, 만족도 89%
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1,2,3,4].map((n) => (
              <div
                key={n}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md transition hover:shadow-lg hover:-translate-y-1 bg-white border border-slate-100"
              >
                <Image
                  src={`/reviews/review${n}.png`}
                  alt={`review${n}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 250px, 150px"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership */}
      <section className="relative py-20 flex flex-col items-center justify-center text-center w-full bg-gradient-to-br from-blue-600 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-cover bg-center opacity-20">
          <Image src="/partnership-bg.jpg" alt="partnership bg" fill className="object-cover" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h2 className="font-display text-5xl md:text-6xl font-black mb-6 text-white tracking-tighter">Partnership</h2>
          <p className="font-body text-lg md:text-xl text-blue-100 mb-4 leading-relaxed">
            브랜드를 운영하면서 다양한 문제에 직면합니다.
          </p>
          <p className="font-body text-base md:text-lg text-blue-200 mb-12 leading-relaxed">
            <span className="font-semibold text-blue-100">링커블</span>은 글로벌 파트너십을 통해 다양한 문제를 쉽고 빠르게 해결하며,
            <br className="hidden md:block" /> 실질적인 성과로 이어지는 전략을 제시합니다.
          </p>
          <a
            href="#"
            className="inline-block px-8 py-4 rounded-full bg-white text-blue-600 hover:bg-blue-50 text-lg font-semibold shadow-lg transition transform hover:scale-105"
          >
            파트너십 제안하기 →
          </a>
          
          {/* 파트너 로고 */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {[
              { src: "/logo/Q10.svg", alt: "Qoo10" },
              { src: "/logo/유튜브 쇼츠.svg", alt: "YouTube Shorts" },
              { src: "/logo/인스타그램.svg", alt: "Instagram" },
              { src: "/logo/쇼피파이.svg", alt: "Shopify" },
              { src: "/logo/아마존.svg", alt: "Amazon" },
              { src: "/logo/페이오니아.svg", alt: "Payoneer" },
            ].map((logo, i) => (
              <div key={logo.alt + i} className="flex items-center justify-center">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={120}
                  height={60}
                  className="h-10 md:h-16 w-auto object-contain opacity-80 hover:opacity-100 transition filter brightness-0 invert"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 1:1 문의 */}
      <section id="consult" className="py-20 flex flex-col items-center justify-center bg-white px-4 w-full">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-blue-600 font-display text-lg font-semibold mb-4 tracking-wider uppercase">Consulting</div>
          <h2 className="font-display text-display font-black mb-6 text-slate-900 tracking-tight">1:1 무료 컨설팅</h2>
          <div className="text-blue-600 font-heading text-xl font-bold mb-2 tracking-tight">7월한정! 공동구매 연결 무제한 0원 지원!</div>
          <div className="font-body text-slate-600 mb-12">지금 바로 문의하세요</div>
          
          <form
            className="w-full bg-slate-50 rounded-3xl shadow-lg overflow-hidden border border-slate-200"
            onSubmit={handleSubmit}
          >
            {/* 헤더 */}
            <div className="bg-blue-600 text-white text-lg font-bold py-6 px-8 text-center">
              상담 신청하기
            </div>
            <div className="p-8 flex flex-col gap-6">
              {/* 국가 선택 */}
              <div>
                <div className="mb-3 font-semibold text-slate-700 text-base">상담 국가 선택*</div>
                <div className="flex gap-6 flex-wrap">
                  <label className="flex items-center gap-2 text-base">
                    <input type="checkbox" className="accent-blue-500 w-4 h-4" /> 국내
                  </label>
                  <label className="flex items-center gap-2 text-base">
                    <input type="checkbox" className="accent-blue-500 w-4 h-4" /> 해외
                  </label>
                  <label className="flex items-center gap-2 text-base">
                    <input type="checkbox" className="accent-blue-500 w-4 h-4" /> 제휴문의
                  </label>
                </div>
              </div>
              
              {/* 컨설팅 항목 선택 */}
              <div>
                <div className="mb-3 font-semibold text-slate-700 text-base">컨설팅 항목 선택*</div>
                <div className="flex gap-6 flex-wrap">
                  <label className="flex items-center gap-2 text-base">
                    <input type="checkbox" className="accent-blue-500 w-4 h-4" /> 쇼츠 체험단(시팅)
                  </label>
                  <label className="flex items-center gap-2 text-base">
                    <input type="checkbox" className="accent-blue-500 w-4 h-4" /> 맞춤 키 인플루언서
                  </label>
                  <label className="flex items-center gap-2 text-base">
                    <input type="checkbox" className="accent-blue-500 w-4 h-4" /> 해외 공동구매
                  </label>
                </div>
              </div>
              
              {/* 담당자명/연락처 */}
              <div className="flex gap-4 flex-col md:flex-row">
                <div className="flex-1">
                  <div className="mb-3 font-semibold text-slate-700 text-base">담당자명*</div>
                  <input
                    className="w-full p-4 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-500 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="담당자명을 입력해주세요."
                    required
                  />
                </div>
                <div className="flex-1">
                  <div className="mb-3 font-semibold text-slate-700 text-base">연락처*</div>
                  <input
                    className="w-full p-4 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-500 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="연락처를 입력해주세요."
                    required
                  />
                </div>
              </div>
              
              {/* 이메일 */}
              <div>
                <div className="mb-3 font-semibold text-slate-700 text-base">이메일*</div>
                <input
                  className="w-full p-4 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-500 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="이메일을 입력해주세요."
                  required
                />
              </div>
              
              {/* 개인정보 동의 */}
              <div className="flex items-center gap-3">
                <input type="checkbox" className="accent-blue-500 w-4 h-4" required />
                <span className="text-slate-600 text-sm">개인정보보호정책에 동의합니다.</span>
              </div>
              
              {/* 제출 버튼 */}
              <button
                type="submit"
                className="w-full py-4 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-white text-lg transition transform hover:scale-105 active:scale-95 shadow-lg"
                disabled={loading}
              >
                {loading ? "등록 중..." : "제출하기"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* News */}
      <section className="py-20 max-w-7xl mx-auto px-4 w-full">
        <h2 className="font-heading text-display font-bold mb-12 text-center text-slate-900 tracking-tight">News</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* 뉴스 카드 1 */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 flex flex-col overflow-hidden hover:shadow-xl hover:-translate-y-1 transition">
            <div className="relative h-48">
              <Image src="/news/news1.png" alt="news1" fill className="object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-between p-6">
              <div className="mb-4 text-sm text-slate-900 font-semibold leading-relaxed">
                선정에이전시, 설립 2년만에 특허-벤처-직무발명보상인증 '트리플크라운'
              </div>
              <div className="text-sm text-slate-600 mb-4">
                "K-브랜드 해외진출의 새로운 솔루션 제시"
              </div>
              <a href="https://m.news.nate.com/view/20250502n13007" className="text-sm text-blue-600 hover:underline font-medium">
                자세히 보기 →
              </a>
            </div>
          </div>
          
          {/* 뉴스 카드 2 */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 flex flex-col overflow-hidden hover:shadow-xl hover:-translate-y-1 transition">
            <div className="relative h-48">
              <Image src="/news/news2.png" alt="news2" fill className="object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-between p-6">
              <div className="mb-4 text-sm text-slate-900 font-semibold leading-relaxed">
                선정에이전시, 기술경영 3관왕…특허·직무발명·벤처 인증 확보
              </div>
              <div className="text-sm text-slate-600 mb-4">
                K-브랜드 해외 진출 결정적 전환점 마련
              </div>
              <a href="https://www.kihoilbo.co.kr/news/articleView.html?idxno=1058413" className="text-sm text-blue-600 hover:underline font-medium">
                자세히 보기 →
              </a>
            </div>
          </div>
          
          {/* 뉴스 카드 3 */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 flex flex-col overflow-hidden hover:shadow-xl hover:-translate-y-1 transition">
            <div className="relative h-48">
              <Image src="/news/news3.png" alt="news3" fill className="object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-between p-6">
              <div className="mb-4 text-sm text-slate-900 font-semibold leading-relaxed">
                선정 에이전시, 브랜드 매출 안정화 위한 마케팅 서비스 실시
              </div>
              <div className="text-sm text-slate-600 mb-4">
                실시간 1위 달성, 글로벌 마케팅 혁신
              </div>
              <a href="https://plus.hankyung.com/apps/newsinside.view?aid=2023111577555&category=&sns=y" className="text-sm text-blue-600 hover:underline font-medium">
                자세히 보기 →
              </a>
            </div>
          </div>
          
          {/* 뉴스 카드 4 */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 flex flex-col overflow-hidden hover:shadow-xl hover:-translate-y-1 transition">
            <div className="relative h-48">
              <Image src="/news/news4.png" alt="news4" fill className="object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-between p-6">
              <div className="mb-4 text-sm text-slate-900 font-semibold leading-relaxed">
                가히로 뜬 코리아테크
              </div>
              <div className="text-sm text-slate-600 mb-4">
                왜 뷰티 플랫폼 '와이레스' 만들었나
              </div>
              <a href="https://zdnet.co.kr/view/?no=20250107151911" className="text-sm text-blue-600 hover:underline font-medium">
                자세히 보기 →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-slate-500 text-sm border-t border-slate-200 bg-slate-50 w-full">
        <div className="max-w-6xl mx-auto px-4">
          <p>&copy; {year ?? ''} 링커블. All rights reserved.</p>
        </div>
      </footer>
      </div>
    </AdaptiveLayout>
  );
}

// --- 컴포넌트 ---
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center text-center min-w-[120px]">
      <span className="font-display font-black text-xl sm:text-2xl md:text-4xl text-blue-600 tracking-tighter">{value}</span>
      <span className="font-body text-slate-600 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base font-medium tracking-wide">{label}</span>
    </div>
  );
}

function ServiceCard({ title, desc, img }: { title: string; desc: string; img: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center text-center overflow-hidden hover:shadow-xl hover:-translate-y-1 transition min-h-[340px] md:min-h-[400px]">
      {/* 이미지 영역 */}
      <div className="w-full h-[160px] md:h-[200px] flex items-center justify-center bg-slate-50">
        <Image
          src={img}
          alt={title}
          width={200}
          height={160}
          className="object-contain w-auto h-full max-h-full"
          draggable={false}
        />
      </div>
      {/* 텍스트 영역 */}
      <div className="flex-1 flex flex-col justify-center px-6 py-6">
        <h3 className="font-heading text-lg md:text-xl font-bold mb-3 text-slate-900 tracking-tight">{title}</h3>
        <p className="font-body text-slate-600 text-sm md:text-base leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function PlanCard({ title, price, features, highlight }: { title: string; price: string; features: string[]; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl p-6 md:p-8 min-w-[280px] ${highlight ? 'bg-blue-600 text-white shadow-xl ring-4 ring-blue-200 scale-105' : 'bg-white text-slate-900 shadow-lg border border-slate-200'}`}>
      <h3 className="font-heading text-lg md:text-xl font-bold mb-3 tracking-tight">{title}</h3>
      <div className="font-display text-3xl md:text-4xl font-black mb-6 tracking-tighter">{price}</div>
      <ul className="space-y-3 font-body text-sm md:text-base">
        {features.map((f) => <li key={f} className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${highlight ? 'bg-white' : 'bg-blue-600'}`}></span>
          {f}
        </li>)}
      </ul>
    </div>
  );
}

function FeatureCard({ title, desc, color }: { title: string; desc: string; color: string }) {
  const colorMap: Record<string, string> = {
    green: 'border-green-400 bg-green-50',
    blue: 'border-blue-400 bg-blue-50',
    orange: 'border-orange-400 bg-orange-50',
  };
  const textColorMap: Record<string, string> = {
    green: 'text-green-700',
    blue: 'text-blue-700',
    orange: 'text-orange-700',
  };
  return (
    <div className={`rounded-2xl border-2 ${colorMap[color]} p-6 md:p-8 shadow-lg hover:shadow-xl transition`}>
      <h3 className={`text-lg md:text-xl font-bold mb-4 ${textColorMap[color]}`}>{title}</h3>
      <p className="text-slate-600 text-sm md:text-base leading-relaxed">{desc}</p>
    </div>
  );
}

function NavMenu({ href, label, desc }: { href: string; label: string; desc: string }) {
  return (
    <Link href={href} className="group flex flex-col items-center justify-center min-w-[90px] px-3 py-1 rounded-xl hover:bg-blue-50 transition text-slate-700 font-semibold relative">
      <span className="text-base whitespace-nowrap">{label}</span>
      <span className="absolute left-1/2 -bottom-2 translate-x-[-50%] translate-y-full opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-xs rounded px-2 py-1 shadow-lg pointer-events-none transition z-20 whitespace-nowrap">
        {desc}
      </span>
    </Link>
  );
}