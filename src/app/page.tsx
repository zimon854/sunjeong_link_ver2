"use client";
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import AdaptiveLayout from '@/components/AdaptiveLayout';
import { useNativeToast } from '@/hooks/useNativeToast';
import { usePWAFeatures } from '@/hooks/usePWAFeatures';
import { useRouter } from "next/navigation";
import { newsPosts } from '@/data/newsPosts';

export default function Home() {
  const [year, setYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const { showSuccess, showInfo } = useNativeToast();
  const { isAppMode, hapticFeedback, useSwipeGesture } = usePWAFeatures();
  const router = useRouter();

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const partnerLogos = [
    { src: "/logo/쇼피파이.svg", alt: "Shopify" },
    { src: "/logo/Q10.svg", alt: "Q10" },
    { src: "/logo/틱톡.svg", alt: "TikTok" },
    { src: "/logo/인스타그램.svg", alt: "Instagram" },
    { src: "/logo/유튜브 쇼츠.svg", alt: "YouTube Shorts" },
    { src: "/logo/페이오니아.svg", alt: "Payoneer" },
    { src: "/logo/아마존.svg", alt: "Amazon" },
  ];

  const featuredNews = [...newsPosts]
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    .slice(0, 3);

  const newsImages = [
    '/news/news1.png',
    '/news/news2.png',
    '/news/news3.png',
  ];

  const renderNewsLink = (post: (typeof newsPosts)[number]) => {
    const linkContent = (
      <>
        기사 보기
        <span aria-hidden>→</span>
      </>
    );

    if (post.externalUrl) {
      return (
        <a
          href={post.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
        >
          {linkContent}
        </a>
      );
    }

    return (
      <Link
        href={`/news/${post.id}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
      >
        {linkContent}
      </Link>
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setSubmitMessage(null);

    const formData = new FormData(event.currentTarget);
    const contactName = formData.get('contactName')?.toString().trim();
    const contactPhone = formData.get('contactPhone')?.toString().trim();
    const contactEmail = formData.get('contactEmail')?.toString().trim();

    if (!contactName || !contactPhone || !contactEmail) {
      const errorMessage = '필수 정보를 모두 입력해주세요.';
      setSubmitMessage(errorMessage);
      showInfo?.(errorMessage);
      setLoading(false);
      return;
    }

    if (isAppMode) {
      hapticFeedback('medium');
    }

    const successMessage = '문의가 접수되었습니다. 빠르게 연락드릴게요.';
    showSuccess?.(successMessage);
    setSubmitMessage(successMessage);
    event.currentTarget.reset();
    setLoading(false);
  };

  // PWA 스와이프 제스처 설정
  useSwipeGesture(
    () => {
      if (isAppMode) {
        showInfo?.("뒤로가기");
        router.back();
      }
    },
    () => {
      if (isAppMode) {
        showInfo?.("캠페인 페이지로 이동");
        router.push('/campaigns');
      }
    }
  );

  return (
    <AdaptiveLayout title="링커블 - 홈">
      <div className="w-full">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center h-[60vh] text-center px-4 w-full overflow-hidden">
        <div className="absolute inset-0 -z-20">
          <Image src="/hero-bg.jpg" alt="hero bg" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-white/85 backdrop-blur-sm -z-10" aria-hidden="true" />
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <span className="inline-flex items-center px-4 py-2 mb-4 text-xs md:text-sm font-semibold text-blue-700 bg-blue-50 rounded-full border border-blue-100">
            인플루언서 마케팅 올인원 플랫폼
          </span>
          <h1 className="text-2xl md:text-5xl font-bold mb-4 text-slate-900 leading-tight">
            터지는 <span className="text-blue-600">쇼핑</span>, 팔리는 <span className="text-blue-600">리뷰</span>,
            <br className="hidden md:block" /> 강력한 <span className="text-blue-600">확산</span>까지 한 번에
          </h1>
          <p className="mb-8 text-sm md:text-xl text-slate-600 px-4">
            SNS와 인플루언서 협업으로 성과를 만드는 쉽고 빠른 마케팅 파트너
          </p>
          <a
            href="#consult"
            className="px-4 md:px-8 py-3 rounded-full text-white bg-blue-500 hover:bg-blue-600 text-sm md:text-lg font-semibold transition transform hover:scale-105 active:scale-95 shadow-sm"
          >
            무료 컨설팅 신청
          </a>
        </div>
      </section>

      {/* Stats Section */}
      <section className="flex flex-wrap justify-center gap-4 md:gap-8 py-8 border-b border-slate-200 bg-white px-4 w-full">
        <Stat label="누적 리뷰" value="20,748+" />
        <Stat label="누적 인플루언서" value="140만+" />
        <Stat label="누적 SNS 도달" value="2.85억+" />
      </section>

      {/* Partner Logos */}
      <section className="overflow-hidden w-full py-8 bg-white">
        <div className="relative w-full">
          <div className="flex items-center gap-6 md:gap-16 animate-logo-slide">
            {[...Array(3)].flatMap(() => partnerLogos).map((logo, i) => (
              <div
                key={logo.alt + i}
                className="transition hover:scale-105 hover:opacity-100 opacity-90 flex items-center justify-center p-1 min-w-[120px] max-w-[160px] h-[60px]"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={160}
                  height={60}
                  className="object-contain w-full h-full transition duration-200"
                  draggable={false}
                  sizes="(min-width: 768px) 160px, 120px"
                />
              </div>
            ))}
          </div>
        </div>
        
      </section>

      {/* Service Cards */}
      <section className="py-8 md:py-12 px-4 max-w-5xl mx-auto w-full">
        <div className="flex justify-center mb-6 md:mb-10">
          <h2 className="inline-flex items-center px-5 md:px-8 py-2 md:py-3 rounded-full bg-white/90 border border-slate-200 shadow-sm text-base md:text-3xl font-bold text-slate-900 text-center">
            마케팅, 0원부터 무제한으로 시작!
          </h2>
        </div>
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
      <section className="py-8 md:py-12 bg-slate-100 w-full">
        <h2 className="text-xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-slate-900">브랜드 맞춤형 추천 플랜</h2>
        <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 mb-8 md:mb-12 px-4">
          <PlanCard title="무료 체험" price="0원" features={["기본 기능 제공", "SNS 리뷰 1회"]} highlight />
          <PlanCard title="성장 플랜" price="30만원" features={["SNS 리뷰 10회", "AI 매칭"]} />
          <PlanCard title="프리미엄" price="75만원" features={["무제한 리뷰", "글로벌 확장"]} />
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-8 md:py-12 max-w-4xl mx-auto px-4 w-full">
        <h2 className="text-lg md:text-xl font-bold mb-4 text-slate-900">플랜별 기능 비교</h2>
        <div className="overflow-x-auto rounded-2xl shadow-sm bg-white border border-slate-200 mb-8 md:mb-12">
          <table className="min-w-full text-center text-slate-700">
            <thead className="bg-blue-50 text-slate-700">
              <tr>
                <th className="p-2 md:p-3 text-xs md:text-sm">기능</th>
                <th className="p-2 md:p-3 text-xs md:text-sm">무료</th>
                <th className="p-2 md:p-3 text-xs md:text-sm">성장</th>
                <th className="p-2 md:p-3 text-xs md:text-sm">프리미엄</th>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              <tr className="border-b border-slate-200">
                <td className="p-2 md:p-3 text-xs md:text-sm">SNS 리뷰</td>
                <td className="text-xs md:text-sm">1회</td>
                <td className="text-xs md:text-sm">10회</td>
                <td className="text-xs md:text-sm">무제한</td>
              </tr>
              <tr className="border-b border-slate-200">
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
      <section className="py-8 md:py-12 bg-white w-full">
        <h2 className="text-lg md:text-2xl font-bold mb-6 md:mb-8 text-center px-4 text-slate-900">이미 이용 중인 브랜드사 2만여 곳, 만족도 89%</h2>
        <div className="flex flex-wrap justify-center gap-3 md:gap-8 px-4">
          {[1,2,3,4].map((n) => (
            <div
              key={n}
              className="relative w-[140px] h-[100px] md:w-[260px] md:h-[180px] rounded-2xl overflow-hidden shadow-sm transition hover:-translate-y-1 hover:shadow-md bg-white border border-slate-200"
            >
              <Image
                src={`/reviews/review${n}.png`}
                alt={`review${n}`}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 260px, 140px"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Partnership */}
      <section className="relative py-12 md:py-20 flex flex-col items-center justify-center text-center w-full min-h-[320px] overflow-hidden bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100">
        <div className="absolute inset-0 -z-10 opacity-20" style={{ backgroundImage: "url('/partnership-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 -z-10 bg-white/70" aria-hidden="true" />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <span className="inline-flex items-center px-4 py-2 mb-4 text-xs md:text-sm font-semibold text-blue-700 bg-white/80 rounded-full border border-blue-200">
            Global Partnership Program
          </span>
          <h2 className="text-2xl md:text-5xl font-bold mb-4 text-slate-900">Partnership</h2>
          <p className="text-sm md:text-lg text-slate-600 mb-2">
            브랜드를 운영하다 보면 예상치 못한 과제와 기회가 찾아옵니다.
          </p>
          <p className="text-xs md:text-lg text-slate-500 mb-6 md:mb-8 leading-relaxed">
            <span className="font-semibold text-blue-700">링커블</span>은 글로벌 파트너와의 협업 경험을 바탕으로
            복잡한 과제를 빠르게 해결할 수 있도록 돕고,
            <br className="hidden md:block" />
            실질적인 성과로 이어지는 전략을 제시합니다.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 px-5 md:px-9 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-sm md:text-lg font-semibold text-white shadow-sm transition mb-6 md:mb-10"
          >
            파트너십 제안하기
            <span aria-hidden>→</span>
          </a>
        </div>
        <div className="relative z-10 w-full flex flex-wrap justify-center items-center gap-5 md:gap-16 px-4">
          {[
            { src: "/logo/Q10.svg", alt: "Qoo10" },
            { src: "/logo/유튜브 쇼츠.svg", alt: "Colosseum" },
            { src: "/logo/인스타그램.svg", alt: "Connect AI" },
            { src: "/logo/쇼피파이.svg", alt: "Shopify" },
            { src: "/logo/아마존.svg", alt: "Amazon" },
            { src: "/logo/페이오니아.svg", alt: "Payoneer" },
          ].map((logo, i) => (
            <Image
              key={logo.alt + i}
              src={logo.src}
              alt={logo.alt}
              width={100}
              height={48}
              className="h-8 md:h-16 object-contain opacity-80 hover:opacity-100 transition max-w-[90px] min-w-[70px]"
              draggable={false}
              sizes="(min-width: 768px) 100px, 80px"
            />
          ))}
        </div>
      </section>

      {/* 1:1 문의 */}
      <section className="py-12 md:py-16 flex flex-col items-center justify-center bg-slate-100 px-4 w-full">
        <div className="text-blue-700 text-sm md:text-lg font-semibold mb-2">Consulting</div>
        <h2 className="text-2xl md:text-5xl font-bold mb-4 text-slate-900 text-center">1:1 무료 컨설팅</h2>
        <div className="text-slate-700 text-base md:text-xl font-semibold mb-1 text-center">특별 기간: 공동구매 연결 무제한 0원 지원!</div>
        <div className="text-slate-600 mb-6 md:mb-8 text-center">지금 바로 문의하세요</div>
        <form
          className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
          onSubmit={handleSubmit}
        >
          {/* 파란 헤더 */}
          <div className="bg-blue-500 text-white text-sm md:text-lg font-semibold py-4 px-6 text-center">
            상담 국가 선택*
          </div>
          <div className="p-4 md:p-6 flex flex-col gap-4 md:gap-6">
            {/* 국가 선택 */}
            <div>
              <div className="mb-2 font-semibold text-slate-800 text-xs md:text-base">상담 국가 선택*</div>
              <div className="flex gap-3 md:gap-6 flex-wrap">
                <label className="flex items-center gap-2 text-slate-700 text-xs md:text-base font-medium">
                  <input type="checkbox" className="accent-blue-500 w-3 h-3 md:w-5 md:h-5" /> 국내
                </label>
                <label className="flex items-center gap-2 text-slate-700 text-xs md:text-base font-medium">
                  <input type="checkbox" className="accent-blue-500 w-3 h-3 md:w-5 md:h-5" /> 해외
                </label>
                <label className="flex items-center gap-2 text-slate-700 text-xs md:text-base font-medium">
                  <input type="checkbox" className="accent-blue-500 w-3 h-3 md:w-5 md:h-5" /> 제휴문의
                </label>
              </div>
            </div>
            {/* 컨설팅 항목 선택 */}
            <div>
              <div className="mb-2 font-semibold text-slate-800 text-xs md:text-base">컨설팅 항목 선택*</div>
              <div className="flex gap-3 md:gap-6 flex-wrap">
                <label className="flex items-center gap-2 text-slate-700 text-xs md:text-base font-medium">
                  <input type="checkbox" className="accent-blue-500 w-3 h-3 md:w-5 md:h-5" /> 쇼츠 체험단(시팅)
                </label>
                <label className="flex items-center gap-2 text-slate-700 text-xs md:text-base font-medium">
                  <input type="checkbox" className="accent-blue-500 w-3 h-3 md:w-5 md:h-5" /> 맞춤 키 인플루언서
                </label>
                <label className="flex items-center gap-2 text-slate-700 text-xs md:text-base font-medium">
                  <input type="checkbox" className="accent-blue-500 w-3 h-3 md:w-5 md:h-5" /> 해외 공동구매
                </label>
              </div>
            </div>
            {/* 담당자명/연락처 */}
            <div className="flex gap-4 flex-col md:flex-row">
              <div className="flex-1">
                <div className="mb-2 font-semibold text-slate-800 text-xs md:text-base">담당자명*</div>
                <input
                  name="contactName"
                  className="w-full p-3 rounded border border-slate-300 bg-white text-slate-700 placeholder-slate-400 text-xs md:text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
                  placeholder="담당자명을 입력해주세요."
                  required
                />
              </div>
              <div className="flex-1">
                <div className="mb-2 font-semibold text-slate-800 text-xs md:text-base">연락처*</div>
                <input
                  name="contactPhone"
                  className="w-full p-3 rounded border border-slate-300 bg-white text-slate-700 placeholder-slate-400 text-xs md:text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
                  placeholder="연락처를 입력해주세요."
                  required
                />
              </div>
            </div>
            {/* 이메일 */}
            <div>
              <div className="mb-2 font-semibold text-slate-800 text-xs md:text-base">이메일*</div>
              <input
                name="contactEmail"
                className="w-full p-3 rounded border border-slate-300 bg-white text-slate-700 placeholder-slate-400 text-xs md:text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
                placeholder="이메일을 입력해주세요."
                required
              />
            </div>
            {/* 개인정보 동의 */}
            <div className="flex items-center gap-2">
              <input type="checkbox" className="accent-blue-500 w-3 h-3 md:w-5 md:h-5" required />
              <span className="text-slate-600 text-xs md:text-sm">개인정보보호정책에 동의합니다.</span>
            </div>
            {/* 제출 버튼 */}
            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-full bg-blue-600 hover:bg-blue-700 font-semibold text-white text-sm md:text-lg flex items-center justify-center gap-2 transition"
              disabled={loading}
            >
              {loading ? "등록 중..." : "제출하기"}
            </button>
            {submitMessage && (
              <p className="text-center text-xs md:text-sm text-blue-600">{submitMessage}</p>
            )}
          </div>
        </form>
      </section>
      {/* Newsroom */}
      <section className="py-8 md:py-12 bg-white w-full">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
            <div>
              <p className="text-xs font-semibold text-blue-600/80">Lynkable Newsroom</p>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-2 md:mt-3">링커블 최신 소식</h2>
              <p className="text-sm md:text-base text-slate-600 mt-2">
                글로벌 커머스 인사이트와 정책 업데이트를 가장 먼저 확인하세요.
              </p>
            </div>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 self-start md:self-auto rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition"
            >
              뉴스룸 전체보기
              <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {featuredNews.map((post, index) => (
              <article
                key={post.id}
                className="flex flex-col overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md hover:border-blue-200 transition"
              >
                <div className="relative h-40 w-full bg-slate-100">
                  <Image
                    src={newsImages[index % newsImages.length]}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                </div>
                <div className="flex flex-col flex-1 p-4 md:p-6 gap-3">
                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
                    <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString('ko-KR')}</time>
                    <span>·</span>
                    <span>{post.source}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 leading-snug">{post.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{post.summary}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-blue-700">
                    {post.categories.slice(0, 2).map((category) => (
                      <span
                        key={category}
                        className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1"
                      >
                        #{category}
                      </span>
                    ))}
                  </div>
                  <div className="pt-2 mt-auto">
                    {renderNewsLink(post)}
                  </div>
                </div>
              </article>
            ))}
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
            <Link
              href="/campaigns/new"
              className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-gray-100 transition transform hover:scale-105"
            >
              캠페인 시작하기
            </Link>
            <Link
              href="/influencers"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition transform hover:scale-105"
            >
              인플루언서 둘러보기
            </Link>
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
      <span className="text-lg md:text-3xl font-bold text-blue-600">{value}</span>
      <span className="text-slate-500 mt-1 text-xs md:text-base">{label}</span>
    </div>
  );
}

function ServiceCard({ title, desc, img }: { title: string; desc: string; img: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col items-center text-center overflow-hidden min-h-[240px] md:min-h-[340px] transition hover:-translate-y-1 hover:shadow-md">
      {/* 이미지 영역: 카드 상단을 꽉 채움 */}
      <div className="relative w-full h-[100px] md:h-[180px] bg-slate-100">
        <Image
          src={img}
          alt={title}
          fill
          className="object-contain"
          sizes="(min-width: 768px) 260px, 100vw"
          draggable={false}
        />
      </div>
      {/* 텍스트 영역 */}
      <div className="flex-1 flex flex-col justify-center px-3 md:px-6 py-3 md:py-6">
        <h3 className="text-base md:text-2xl font-bold mb-2 text-slate-900">{title}</h3>
        <p className="text-slate-500 text-xs md:text-lg">{desc}</p>
      </div>
    </div>
  );
}

function PlanCard({ title, price, features, highlight }: { title: string; price: string; features: string[]; highlight?: boolean }) {
  const baseClass = highlight
    ? 'bg-blue-600 text-white shadow-xl scale-105'
    : 'bg-white border border-slate-200 text-slate-700 shadow-sm';
  return (
    <div className={`rounded-xl p-3 md:p-6 min-w-[140px] md:min-w-[180px] ${baseClass}`}>
      <h3 className="text-sm md:text-lg font-bold mb-2">{title}</h3>
      <div className="text-lg md:text-2xl font-bold mb-2">{price}</div>
      <ul className="mb-2 text-xs md:text-sm space-y-1">
        {features.map((f) => <li key={f}>{f}</li>)}
      </ul>
    </div>
  );
}

function FeatureCard({ title, desc, color }: { title: string; desc: string; color: string }) {
  const colorMap: Record<string, string> = {
    green: 'border-green-200 bg-green-50',
    blue: 'border-blue-200 bg-blue-50',
    orange: 'border-amber-200 bg-amber-50',
  };
  return (
    <div className={`rounded-xl border bg-white shadow-sm p-3 md:p-6 ${colorMap[color] ?? ''}`}>
      <h3 className="text-sm md:text-lg font-bold mb-2 text-slate-900">{title}</h3>
      <p className="text-slate-600 text-xs md:text-sm">{desc}</p>
    </div>
  );
}



