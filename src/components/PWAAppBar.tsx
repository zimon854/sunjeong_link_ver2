"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

interface PWAAppBarProps {
  title: string;
  showBackButton?: boolean;
  rightAction?: ReactNode;
  backHref?: string;
}

export default function PWAAppBar({
  title,
  showBackButton = false,
  rightAction,
  backHref,
}: PWAAppBarProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
      return;
    }
    router.back();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-white/80 px-4 py-3 text-slate-900 shadow-sm backdrop-blur">
      <div className="flex items-center gap-3">
        {showBackButton ? (
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm"
            aria-label="뒤로가기"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
        ) : (
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500">LY</span>
        )}
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold leading-tight truncate">{title}</span>
          <span className="text-[11px] text-slate-400">링커블 PWA</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {rightAction ?? (
          <Link
            href="/campaigns"
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600"
          >
            캠페인
          </Link>
        )}
      </div>
    </header>
  );
}
