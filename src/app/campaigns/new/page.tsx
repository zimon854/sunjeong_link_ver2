"use client";
import React, { useState } from 'react';

const categories = ["뷰티", "라이프", "푸드", "패션"];
const statuses = ["진행중", "종료"];

export default function CampaignCreatePage() {
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState(statuses[0]);
  const [desc, setDesc] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제 저장 대신 더미 alert
    alert(`캠페인 생성 완료!\n\n캠페인명: ${title}\n브랜드: ${brand}\n카테고리: ${category}\n가격: ${price}\n상태: ${status}\n설명: ${desc}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0c23] to-[#181826] flex items-center justify-center py-10 px-2 md:px-0">
      <form
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-blue-900/30 p-8"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-2 text-center tracking-tight">캠페인 생성</h1>
        <p className="text-blue-200 text-center mb-8">브랜드와 인플루언서가 함께하는 새로운 캠페인을 시작하세요!</p>
        <div className="mb-4">
          <label className="block font-semibold mb-1 text-gray-800">캠페인명 <span className="text-pink-600">*</span></label>
          <input type="text" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1 text-gray-800">브랜드명 <span className="text-pink-600">*</span></label>
          <input type="text" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400" value={brand} onChange={e => setBrand(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1 text-gray-800">카테고리 <span className="text-pink-600">*</span></label>
          <select className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400" value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1 text-gray-800">가격(원) <span className="text-pink-600">*</span></label>
          <input type="number" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400" value={price} onChange={e => setPrice(e.target.value)} required min={0} />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1 text-gray-800">상태 <span className="text-pink-600">*</span></label>
          <select className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400" value={status} onChange={e => setStatus(e.target.value)}>
            {statuses.map(st => <option key={st} value={st}>{st}</option>)}
          </select>
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-1 text-gray-800">설명</label>
          <textarea className="w-full border rounded-lg px-3 py-2 min-h-[80px] focus:ring-2 focus:ring-blue-400" value={desc} onChange={e => setDesc(e.target.value)} />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition text-lg shadow">캠페인 생성</button>
      </form>
    </div>
  );
}
