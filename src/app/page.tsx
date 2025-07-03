"use client";
import React, { useEffect, useRef, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import logoInstagram from '@/logo/인스타그램.svg';
import logoTiktok from '@/logo/틱톡.svg';
import logoYoutubeShorts from '@/logo/유튜브 쇼츠.svg';
import logoAmazon from '@/logo/아마존.svg';
import logoPayoneer from '@/logo/페이오니아.svg';
import logoShopify from '@/logo/쇼피파이.svg';
import logoQ10 from '@/logo/Q10.svg';
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
import { supabase } from '@/lib/supabaseClient';
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
    let imagePath = "";
    if (image) {
      const { data, error } = await supabase.storage
        .from("campaigns")
        .upload(`thumbnails/${Date.now()}_${image.name}`, image);
      if (error) {
        setMessage("이미지 업로드 실패: " + error.message);
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
      setMessage("캠페인 등록 실패: " + error.message);
    } else {
      setMessage("캠페인 등록 완료!");
      // 등록된 캠페인 상세페이지로 이동
      setTimeout(() => {
        router.push("/campaigns");
      }, 1000);
    }
  };

  return (
  <main className="bg-gradient-to-b from-[#0a0a23] to-[#181826] min-h-screen text-white">
  {/* --- 네비게이션 메뉴바 --- */}
  {/* nav 영역 전체 삭제 */}

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <div className="absolute inset-0 -z-10">
          <Image src="/hero-bg.jpg" alt="hero bg" fill sizes="100vw" className="object-cover opacity-60" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          터지는 <span className="text-blue-400">쇼핑!</span> 팔리는 <span className="text-blue-400">리뷰!</span> <br />강력한 <span className="text-blue-400">확산!</span>
        </h1>
        <p className="mb-8 text-lg md:text-2xl text-gray-200">SNS와 인플루언서로 만드는 새로운 마케팅 성공 공식</p>
        <a href="#consult" className="px-8 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-lg font-semibold transition">무료 컨설팅 신청</a>
      </section>

      {/* Stats Section */}
      <section className="flex flex-wrap justify-center gap-8 py-8 border-b border-gray-800">
        <Stat label="누적 리뷰" value="20,748+" />
        <Stat label="누적 인플루언서" value="140만+" />
        <Stat label="누적 SNS 도달" value="2.85억+" />
      </section>

      {/* Partner Logos */}
      <section className="overflow-hidden w-full py-8 bg-transparent">
        <div className="relative w-full">
          <div
            className="flex items-center gap-12 md:gap-16 logo-slider"
            style={{
              width: 'max-content',
              animation: 'logo-slide 20s linear infinite',
            }}
          >
            {[...Array(3)].flatMap(() => partnerLogos).map((logo, i) => (
              <div
                key={logo.alt + i}
                className="transition hover:scale-110 hover:opacity-100 opacity-90 grayscale hover:grayscale-0"
                style={{
                  minWidth: 120,
                  maxWidth: 140,
                  height: 60,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 16px",
                }}
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  width={120}
                  height={60}
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "100%",
                    filter: "brightness(2) invert(1)",
                    transition: "filter 0.2s",
                  }}
                  className="hover:filter-none"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
        <style jsx global>{`
          @keyframes logo-slide {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }
          .logo-slider {
            /* gap은 tailwind로, width는 max-content로 */
          }
          @media (max-width: 768px) {
            .logo-slider {
              gap: 2rem !important;
            }
          }
        `}</style>
      </section>

      {/* Service Cards */}
      <section className="py-12 px-4 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">마케팅, 0원부터 무제한으로 시작!</h2>
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
      <section className="py-12 bg-[#181830]">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">브랜드 맞춤형 추천 플랜</h2>
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <PlanCard title="무료 체험" price="0원" features={["기본 기능 제공", "SNS 리뷰 1회"]} highlight />
          <PlanCard title="성장 플랜" price="30만원" features={["SNS 리뷰 10회", "AI 매칭"]} />
          <PlanCard title="프리미엄" price="75만원" features={["무제한 리뷰", "글로벌 확장"]} />
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-12 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-4">플랜별 기능 비교</h2>
        <div className="overflow-x-auto rounded-2xl shadow-lg bg-[#181830] mb-12">
          <table className="min-w-full text-center">
            <thead className="bg-blue-900/80 text-white">
              <tr>
                <th className="p-3">기능</th>
                <th className="p-3">무료</th>
                <th className="p-3">성장</th>
                <th className="p-3">프리미엄</th>
              </tr>
            </thead>
            <tbody className="text-blue-100">
              <tr className="border-b border-blue-800">
                <td className="p-3">SNS 리뷰</td>
                <td>1회</td>
                <td>10회</td>
                <td>무제한</td>
              </tr>
              <tr className="border-b border-blue-800">
                <td className="p-3">AI 매칭</td>
                <td>-</td>
                <td>O</td>
                <td>O</td>
              </tr>
              <tr>
                <td className="p-3">글로벌 확장</td>
                <td>-</td>
                <td>-</td>
                <td>O</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-12 px-4 max-w-5xl mx-auto grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
        <FeatureCard title="경쟁사 리뷰 분석" desc="AI로 경쟁사 리뷰/트렌드 자동 분석" color="green" />
        <FeatureCard title="구매뽑기" desc="SNS 이벤트로 구매자 데이터 수집" color="blue" />
        <FeatureCard title="맞춤형 인플루언서 매칭" desc="브랜드에 최적화된 인플루언서 자동 추천" color="orange" />
      </section>

      {/* 후기/리뷰 */}
      <section className="py-12 bg-[#181830]">
        <h2 className="text-2xl font-bold mb-8 text-center">이미 이용 중인 브랜드사 2만여 곳, 만족도 89%</h2>
        <div className="flex flex-wrap justify-center gap-8 md:gap-10">
          {[1,2,3,4].map((n) => (
            <img
              key={n}
              src={`/reviews/review${n}.png`}
              alt={`review${n}`}
              className="w-[220px] h-[160px] md:w-[260px] md:h-[180px] rounded-2xl object-cover shadow-xl transition hover:scale-105 bg-[#10112a]"
              style={{ objectFit: 'cover' }}
              draggable={false}
            />
          ))}
        </div>
      </section>

      {/* Partnership */}
      <section
        className="relative py-24 flex flex-col items-center justify-center text-center"
        style={{
          minHeight: "480px",
          background: "linear-gradient(120deg, #0a1a2f 0%, #1e3c72 50%, #2a5298 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 배경 블러/이미지 효과 */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: "url('/partnership-bg.jpg'), linear-gradient(120deg, #0a1a2f 0%, #1e3c72 50%, #2a5298 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.7,
            filter: "blur(2px) brightness(0.9)",
          }}
        />
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">Partnership</h2>
        <p className="text-lg md:text-xl text-blue-100 mb-2">브랜드를 운영하면서 다양한 문제에 직면합니다.</p>
        <p className="text-base md:text-lg text-blue-200 mb-8">
          <span className="font-bold text-blue-300">선정링크</span>는 글로벌 파트너십을 통해 다양한 문제를 쉽고 빠르게 해결하며,<br />
          앞선 해결책을 제시합니다.
        </p>
        <a
          href="#"
          className="inline-block px-8 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-lg font-semibold text-white shadow-lg transition mb-12"
        >
          파트너십 제안하기 &rarr;
        </a>
        {/* 파트너 로고 슬라이드/배치 */}
        <div className="w-full flex flex-wrap justify-center items-center gap-10 md:gap-16 px-4">
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
              className="h-16 md:h-24 object-contain opacity-80 hover:opacity-100 transition"
              style={{ maxWidth: 180, minWidth: 120 }}
              draggable={false}
            />
          ))}
        </div>
      </section>

      {/* 1:1 문의 */}
      <section className="py-16 flex flex-col items-center justify-center bg-transparent">
        <div className="text-blue-400 text-lg font-semibold mb-2">Consulting</div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white text-center">1:1 무료 컨설팅</h2>
        <div className="text-blue-300 text-xl font-bold mb-1 text-center">7월한정! 공동구매 연결 무제한 0원 지원!</div>
        <div className="text-blue-100 mb-8 text-center">지금 바로 문의하세요</div>
        <form
          className="w-full max-w-xl bg-[#23232b] rounded-2xl shadow-2xl overflow-hidden"
          style={{ borderRadius: 24 }}
          onSubmit={handleSubmit}
        >
          {/* 파란 헤더 */}
          <div className="bg-blue-600 text-white text-lg font-bold py-4 px-6 text-center">
            상담 국가 선택*
          </div>
          <div className="p-6 flex flex-col gap-6">
            {/* 국가 선택 */}
            <div>
              <div className="mb-2 font-semibold text-gray-200">상담 국가 선택*</div>
              <div className="flex gap-6 flex-wrap">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-blue-500 w-5 h-5" /> 국내
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-blue-500 w-5 h-5" /> 해외
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-blue-500 w-5 h-5" /> 제휴문의
                </label>
              </div>
            </div>
            {/* 컨설팅 항목 선택 */}
            <div>
              <div className="mb-2 font-semibold text-gray-200">컨설팅 항목 선택*</div>
              <div className="flex gap-6 flex-wrap">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-blue-500 w-5 h-5" /> 쇼츠 체험단(시팅)
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-blue-500 w-5 h-5" /> 맞춤 키 인플루언서
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-blue-500 w-5 h-5" /> 해외 공동구매
                </label>
              </div>
            </div>
            {/* 담당자명/연락처 */}
            <div className="flex gap-4 flex-col md:flex-row">
              <div className="flex-1">
                <div className="mb-2 font-semibold text-gray-200">담당자명*</div>
                <input
                  className="w-full p-3 rounded bg-[#181820] text-white placeholder-gray-400"
                  placeholder="담당자명을 입력해주세요."
                  required
                />
              </div>
              <div className="flex-1">
                <div className="mb-2 font-semibold text-gray-200">연락처*</div>
                <input
                  className="w-full p-3 rounded bg-[#181820] text-white placeholder-gray-400"
                  placeholder="연락처를 입력해주세요."
                  required
                />
              </div>
            </div>
            {/* 이메일 */}
            <div>
              <div className="mb-2 font-semibold text-gray-200">이메일*</div>
              <input
                className="w-full p-3 rounded bg-[#181820] text-white placeholder-gray-400"
                placeholder="이메일을 입력해주세요."
                required
              />
            </div>
            {/* 개인정보 동의 */}
            <div className="flex items-center gap-2">
              <input type="checkbox" className="accent-blue-500 w-5 h-5" required />
              <span className="text-gray-300 text-sm">개인정보보호정책에 동의합니다.</span>
            </div>
            {/* 제출 버튼 */}
            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-full bg-blue-500 hover:bg-blue-600 font-semibold text-white text-lg flex items-center justify-center gap-2 transition"
              disabled={loading}
            >
              {loading ? "등록 중..." : "제출하기"}
            </button>
          </div>
        </form>
      </section>

      {/* News */}
      <section className="py-12 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center">News</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* 뉴스 카드 1 */}
          <div className="bg-[#181830] rounded-2xl shadow-xl flex flex-col overflow-hidden hover:scale-105 transition">
            <img src="/news/news1.png" alt="news1" className="w-full h-[180px] object-cover" />
            <div className="flex-1 flex flex-col justify-between p-4">
              <div className="mb-2 text-sm text-gray-100 font-semibold">선정에이전시, 설립 2년만에 특허-벤처-직무발명보상인증 '트리플크라운'</div>
              <div className="text-xs text-gray-400 mb-4">"K-브랜드 해외진출의 새로운 솔루션 제시"</div>
              <a href="https://m.news.nate.com/view/20250502n13007" className="text-xs text-blue-400 hover:underline mt-auto">자세히 보기 &rarr;</a>
            </div>
          </div>
          {/* 뉴스 카드 2 */}
          <div className="bg-[#181830] rounded-2xl shadow-xl flex flex-col overflow-hidden hover:scale-105 transition">
            <img src="/news/news2.png" alt="news2" className="w-full h-[180px] object-cover" />
            <div className="flex-1 flex flex-col justify-between p-4">
              <div className="mb-2 text-sm text-gray-100 font-semibold">선정에이전시, 기술경영 3관왕…특허·직무발명·벤처 인증 확보</div>
              <div className="text-xs text-gray-400 mb-4">K-브랜드 해외 진출 결정적 전환점 마련</div>
              <a href="https://www.kihoilbo.co.kr/news/articleView.html?idxno=1058413" className="text-xs text-blue-400 hover:underline mt-auto">자세히 보기 &rarr;</a>
            </div>
          </div>
          {/* 뉴스 카드 3 */}
          <div className="bg-[#181830] rounded-2xl shadow-xl flex flex-col overflow-hidden hover:scale-105 transition">
            <img src="/news/news3.png" alt="news3" className="w-full h-[180px] object-cover" />
            <div className="flex-1 flex flex-col justify-between p-4">
              <div className="mb-2 text-sm text-gray-100 font-semibold">선정 에이전시, 브랜드 매출 안정화 위한 마케팅 서비스 실시</div>
              <div className="text-xs text-gray-400 mb-4">실시간 1위 달성, 글로벌 마케팅 혁신</div>
              <a href="https://plus.hankyung.com/apps/newsinside.view?aid=2023111577555&category=&sns=y" className="text-xs text-blue-400 hover:underline mt-auto">자세히 보기 &rarr;</a>
            </div>
          </div>
          {/* 뉴스 카드 4 */}
          <div className="bg-[#181830] rounded-2xl shadow-xl flex flex-col overflow-hidden hover:scale-105 transition">
            <img src="/news/news4.png" alt="news4" className="w-full h-[180px] object-cover" />
            <div className="flex-1 flex flex-col justify-between p-4">
              <div className="mb-2 text-sm text-gray-100 font-semibold">가히로 뜬 코리아테크 </div>
              <div className="text-xs text-gray-400 mb-4">왜 뷰티 플랫폼 '와이레스' 만들었나</div>
              <a href="https://zdnet.co.kr/view/?no=20250107151911" className="text-xs text-blue-400 hover:underline mt-auto">자세히 보기 &rarr;</a>
            </div>
          </div>
        </div>
      </section>

     
      {/* Footer */}
      <footer className="py-8 text-center text-gray-400 text-sm border-t border-gray-800 mt-8">
        &copy; {year ?? ''} 선정링크. All rights reserved.
      </footer>
    </main>
  );
}

// --- 컴포넌트 ---
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl md:text-3xl font-bold text-blue-400">{value}</span>
      <span className="text-gray-300 mt-1">{label}</span>
    </div>
  );
}

function ServiceCard({ title, desc, img }: { title: string; desc: string; img: string }) {
  return (
    <div className="bg-[#181830] rounded-2xl shadow-2xl flex flex-col items-center text-center overflow-hidden min-h-[340px] transition hover:scale-105 hover:shadow-blue-700/30">
      {/* 이미지 영역: 카드 상단을 꽉 채움 */}
      <div className="w-full h-[160px] md:h-[180px] flex items-center justify-center bg-[#10112a]">
        <img
          src={img}
          alt={title}
          className="object-contain w-full h-full"
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
          }}
          draggable={false}
        />
      </div>
      {/* 텍스트 영역 */}
      <div className="flex-1 flex flex-col justify-center px-6 py-6">
        <h3 className="text-xl md:text-2xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-gray-300 text-base md:text-lg">{desc}</p>
      </div>
    </div>
  );
}

function PlanCard({ title, price, features, highlight }: { title: string; price: string; features: string[]; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-6 min-w-[180px] ${highlight ? 'bg-blue-600 text-white shadow-xl scale-105' : 'bg-gray-900 text-gray-100'}`}>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <div className="text-2xl font-bold mb-2">{price}</div>
      <ul className="mb-2 text-sm">
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
    <div className={`rounded-xl border-2 ${colorMap[color]} p-6 bg-[#181830] shadow-lg`}>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-300 text-sm">{desc}</p>
    </div>
  );
}

function NavMenu({ href, label, desc }: { href: string; label: string; desc: string }) {
  return (
    <Link href={href} className="group flex flex-col items-center justify-center min-w-[90px] px-3 py-1 rounded-xl hover:bg-blue-800/70 transition text-white font-semibold relative">
      <span className="text-base whitespace-nowrap">{label}</span>
      <span className="absolute left-1/2 -bottom-2 translate-x-[-50%] translate-y-full opacity-0 group-hover:opacity-100 bg-[#181830] text-blue-200 text-xs rounded px-2 py-1 shadow-lg pointer-events-none transition z-20 whitespace-nowrap">
        {desc}
      </span>
    </Link>
  );
}


