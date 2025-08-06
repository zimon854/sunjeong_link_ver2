'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { isPWA, isAndroid } from '@/lib/device'

interface PWAGestureAreaProps {
  onBackGesture?: () => void
}

export default function PWAGestureArea({ onBackGesture }: PWAGestureAreaProps) {
  const router = useRouter()
  const [isGesturing, setIsGesturing] = useState(false)
  const [gestureProgress, setGestureProgress] = useState(0)
  const gestureAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // PWA가 아니면 렌더링하지 않음
    if (!isPWA() || !isAndroid()) return

    let startX = 0
    let currentX = 0
    let isTracking = false

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      startX = touch.clientX
      
      // 화면 왼쪽 가장자리에서 시작하는 경우만
      if (startX < 20) {
        isTracking = true
        setIsGesturing(true)
        e.preventDefault()
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTracking) return

      const touch = e.touches[0]
      currentX = touch.clientX
      const deltaX = currentX - startX

      if (deltaX > 0) {
        const progress = Math.min(deltaX / 100, 1)
        setGestureProgress(progress)
        
        // 햅틱 피드백 (중간 지점에서)
        if (progress > 0.5 && 'vibrate' in navigator) {
          navigator.vibrate(10)
        }
      }

      e.preventDefault()
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isTracking) return

      const deltaX = currentX - startX
      
      if (deltaX > 80) {
        // 충분히 스와이프한 경우 뒤로가기
        if (onBackGesture) {
          onBackGesture()
        } else {
          router.back()
        }
        
        // 성공 햅틱 피드백
        if ('vibrate' in navigator) {
          navigator.vibrate([50, 10, 50])
        }
      }

      // 상태 초기화
      isTracking = false
      setIsGesturing(false)
      setGestureProgress(0)
      e.preventDefault()
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: false })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [router, onBackGesture])

  // PWA가 아니거나 안드로이드가 아니면 렌더링하지 않음
  if (!isPWA() || !isAndroid()) return null

  return (
    <>
      {/* 제스처 영역 */}
      <div 
        ref={gestureAreaRef}
        className="pwa-gesture-area"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '20px',
          height: '100vh',
          zIndex: 1000,
          background: 'transparent',
          pointerEvents: 'auto'
        }}
      />
      
      {/* 제스처 시각적 피드백 */}
      {isGesturing && (
        <div 
          className="fixed left-0 top-0 bottom-0 bg-gradient-to-r from-blue-500/20 to-transparent transition-all duration-100 pointer-events-none z-50"
          style={{
            width: `${Math.min(gestureProgress * 200, 100)}px`,
            opacity: gestureProgress
          }}
        >
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
            <div 
              className="text-white/80 transition-all duration-100"
              style={{
                fontSize: `${12 + gestureProgress * 8}px`,
                opacity: gestureProgress > 0.3 ? 1 : 0
              }}
            >
              ←
            </div>
          </div>
        </div>
      )}
      
      {/* 제스처 가이드 (첫 방문시 표시) */}
      {typeof window !== 'undefined' && 
       !localStorage.getItem('pwa-gesture-guide-shown') && (
        <div className="fixed left-4 top-1/2 transform -translate-y-1/2 bg-black/80 text-white text-xs px-3 py-2 rounded-full z-50 animate-pulse">
          ← 화면 가장자리에서 스와이프하여 뒤로가기
        </div>
      )}
    </>
  )
}