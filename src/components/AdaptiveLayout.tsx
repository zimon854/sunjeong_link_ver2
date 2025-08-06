'use client'

import { useState, useEffect } from 'react'
import { getDeviceInfo } from '@/lib/device'
import PWAAppBar from './PWAAppBar'
import PWAGestureArea from './PWAGestureArea'
import PWAStatusBar from './PWAStatusBar'

interface AdaptiveLayoutProps {
  children: React.ReactNode
  title?: string
  showBackButton?: boolean
  rightAction?: React.ReactNode
  className?: string
}

export default function AdaptiveLayout({
  children,
  title = '',
  showBackButton = false,
  rightAction,
  className = ''
}: AdaptiveLayoutProps) {
  const [deviceInfo, setDeviceInfo] = useState<ReturnType<typeof getDeviceInfo> | null>(null)

  useEffect(() => {
    setDeviceInfo(getDeviceInfo())
  }, [])

  if (!deviceInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#2563eb] flex items-center justify-center">
        <div className="pwa-loading w-12 h-12 border-4 border-blue-300/30 border-t-blue-400 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <>
      {/* PWA 환경에서만 상태바와 앱바 표시 */}
      {deviceInfo.isPWA && <PWAStatusBar />}
      
      {deviceInfo.isPWA && title && (
        <PWAAppBar 
          title={title}
          showBackButton={showBackButton}
          rightAction={rightAction}
        />
      )}
      
      {/* 메인 콘텐츠 */}
      <main 
        className={`${
          deviceInfo.isPWA 
            ? 'pwa-safe-area min-h-screen bg-[#0f172a]' 
            : 'min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#2563eb]'
        } ${className}`}
        style={{
          // PWA에서 safe area 고려
          paddingTop: deviceInfo.isPWA && !title ? 'env(safe-area-inset-top)' : undefined,
          paddingBottom: deviceInfo.isPWA ? 'env(safe-area-inset-bottom)' : undefined,
          // PWA에서 스크롤 최적화
          overscrollBehavior: deviceInfo.isPWA ? 'none' : undefined,
          WebkitOverflowScrolling: deviceInfo.isPWA ? 'touch' : undefined
        }}
      >
        {/* 웹 환경 전용 컨텐츠 */}
        {!deviceInfo.isPWA && (
          <div className="web-only-header p-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-400/30">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-blue-200 text-sm font-medium">웹 버전으로 실행 중</span>
              <span className="text-blue-300/60 text-xs">앱 설치시 더 나은 경험 제공</span>
            </div>
          </div>
        )}
        
        {/* PWA 환경 전용 컨텐츠 */}
        {deviceInfo.isPWA && (
          <div className="pwa-only-indicator fixed top-4 left-4 z-50 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-green-200/80 text-xs font-medium bg-green-500/10 px-2 py-1 rounded-full border border-green-400/20">
              네이티브 앱 모드
            </span>
          </div>
        )}
        
        {/* PWA 제스처 영역 */}
        {deviceInfo.isPWA && <PWAGestureArea />}
        
        {/* 실제 콘텐츠 */}
        <div className={`${
          deviceInfo.isPWA 
            ? 'px-4 py-6' 
            : 'px-4 py-8'
        }`}>
          {children}
        </div>
      </main>
      
      {/* PWA 전용 추가 기능들 */}
      {deviceInfo.isPWA && (
        <>
          {/* 상태 표시바 */}
          <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 z-50"></div>
          
          {/* 네이티브 토스트 컨테이너 */}
          <div id="native-toast-container" className="fixed inset-0 pointer-events-none z-50"></div>
        </>
      )}
    </>
  )
}