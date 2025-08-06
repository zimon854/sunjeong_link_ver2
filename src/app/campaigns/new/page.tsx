'use client';
import React, { useState } from 'react';

const categories = ["뷰티", "라이프", "푸드", "패션"];

export default function CampaignCreatePage() {
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // 실제 저장 대신 더미 alert
    setTimeout(() => {
      setLoading(false);
      alert(`캠페인 생성 완료!\n\n캠페인명: ${title}\n브랜드: ${brand}\n카테고리: ${category}\n가격: ${price}\n설명: ${desc}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#2563eb] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">새로운 캠페인 생성</h1>
          <p className="text-blue-200/80 text-lg">브랜드와 인플루언서를 연결할 멋진 캠페인을 만들어보세요.</p>
        </div>
        <form
          className="bg-[#181830]/90 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-2xl border border-blue-500/20 space-y-6"
          onSubmit={handleSubmit}
        >
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-blue-200/90 mb-2">캠페인명 <span className="text-red-400">*</span></label>
            <input 
              id="title" 
              type="text" 
              className="w-full px-4 py-3 bg-blue-950/30 border border-blue-400/30 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="예: 여름맞이 쿨링 선크림 체험단"
              required 
            />
          </div>

          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-blue-200/90 mb-2">브랜드명 <span className="text-red-400">*</span></label>
            <input 
              id="brand" 
              type="text" 
              className="w-full px-4 py-3 bg-blue-950/30 border border-blue-400/30 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={brand} 
              onChange={e => setBrand(e.target.value)} 
              placeholder="브랜드 이름을 입력하세요"
              required 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-blue-200/90 mb-2">카테고리 <span className="text-red-400">*</span></label>
              <select 
                id="category" 
                className="w-full px-4 py-3 bg-blue-950/30 border border-blue-400/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={category} 
                onChange={e => setCategory(e.target.value)}
              >
                {categories.map(cat => <option key={cat} value={cat} className="bg-blue-900">{cat}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-blue-200/90 mb-2">제품 가격(원) <span className="text-red-400">*</span></label>
              <input 
                id="price" 
                type="number" 
                className="w-full px-4 py-3 bg-blue-950/30 border border-blue-400/30 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={price} 
                onChange={e => setPrice(e.target.value)} 
                placeholder="숫자만 입력"
                required 
                min={0} 
              />
            </div>
          </div>

          <div>
            <label htmlFor="desc" className="block text-sm font-medium text-blue-200/90 mb-2">캠페인 설명</label>
            <textarea 
              id="desc" 
              className="w-full px-4 py-3 bg-blue-950/30 border border-blue-400/30 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition min-h-[120px]"
              value={desc} 
              onChange={e => setDesc(e.target.value)} 
              placeholder="캠페인에 대한 상세한 설명을 입력해주세요. (제품 특징, 참여 방법 등)"
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-lg"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>생성 중...</span>
                </div>
              ) : '캠페인 등록하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}