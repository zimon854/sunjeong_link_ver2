"use client";

export default function PWAGestureArea() {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center pb-2"
      aria-hidden="true"
    >
      <span className="h-1.5 w-28 rounded-full bg-slate-300/70" />
    </div>
  );
}
