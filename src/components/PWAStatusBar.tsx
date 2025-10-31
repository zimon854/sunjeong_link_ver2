"use client";

import { useMemo } from "react";

export default function PWAStatusBar() {
  const statusText = useMemo(() => {
    const now = new Date();
    return now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-1 text-xs font-semibold text-slate-100"
      aria-hidden="true"
    >
      <span>{statusText}</span>
      <div className="flex items-center gap-2">
        <span className="inline-flex h-2 w-2 items-center justify-center rounded-full bg-emerald-400" />
        <span>5G</span>
        <span className="inline-flex h-2 w-6 items-center justify-center rounded bg-slate-200/60">
          <span className="h-1.5 w-4 rounded bg-slate-100" />
        </span>
      </div>
    </div>
  );
}
