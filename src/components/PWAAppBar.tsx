'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getDeviceInfo } from '@/lib/device'

interface PWAAppBarProps {
  title: string
  showBackButton?: boolean
  rightAction?: React.ReactNode
  className?: string
}

export default function PWAAppBar({ 
  title, 
  showBackButton = false, 
  rightAction,
  className = '' 
}: PWAAppBarProps) {
  const router = useRouter()
  const [deviceInfo, setDeviceInfo] = useState<ReturnType<typeof getDeviceInfo> | null>(null)

  useEffect(() => {
    setDeviceInfo(getDeviceInfo())
  }, [])

  const handleBack = () => {
    router.back()
  }

  // PWA에서만 표시
  if (!deviceInfo?.isPWA) return null

  return (
    <>
      {/* PWA 상태바 */}
      <div 
        className="pwa-status-bar bg-blue-600 w-full"
        style={{ 
          height: 'env(safe-area-inset-top)',
          minHeight: '24px'
        }}
      />
      
      {/* 앱바 */}
      <div className={`pwa-app-bar bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow ${className}`}>
        <div className="flex items-center justify-between px-4 py-3 min-h-[56px]">
          {/* 왼쪽 - 뒤로가기 버튼 */}
          {showBackButton ? (
            <button
              onClick={handleBack}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200 active:scale-95"
              aria-label="뒤로가기"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z"/>
              </svg>
            </button>
          ) : (
            <div className="w-10" /> // 공간 확보
          )}
          
          {/* 가운데 - 제목 */}
          <h1 className="text-slate-900 font-semibold text-lg text-center flex-1 px-4 truncate">
            {title}
          </h1>
          
          {/* 오른쪽 - 추가 액션 */}
          <div className="w-10 flex justify-end">
            {rightAction}
          </div>
        </div>
      </div>
    </>
  )
}