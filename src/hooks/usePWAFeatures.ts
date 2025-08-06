'use client'

import { useState, useEffect, useCallback } from 'react'
import { isPWA, isAndroid, getDeviceInfo } from '@/lib/device'

export function usePWAFeatures() {
  const [deviceInfo, setDeviceInfo] = useState<ReturnType<typeof getDeviceInfo> | null>(null)
  const [isAppMode, setIsAppMode] = useState(false)
  const [statusBarHeight, setStatusBarHeight] = useState(0)

  useEffect(() => {
    const info = getDeviceInfo()
    setDeviceInfo(info)
    setIsAppMode(info.isPWA)
    
    // 상태바 높이 감지
    if (info.isPWA && info.isAndroid) {
      const updateStatusBarHeight = () => {
        const safeAreaTop = getComputedStyle(document.documentElement)
          .getPropertyValue('--safe-area-inset-top')
        const height = safeAreaTop ? parseInt(safeAreaTop.replace('px', '')) : 24
        setStatusBarHeight(height)
      }
      
      updateStatusBarHeight()
      window.addEventListener('resize', updateStatusBarHeight)
      return () => window.removeEventListener('resize', updateStatusBarHeight)
    }
  }, [])

  // PWA 설치 상태 확인
  const checkInstallStatus = useCallback(() => {
    return isPWA()
  }, [])

  // 상태바 색상 변경 (Android PWA)
  const setStatusBarColor = useCallback((color: string) => {
    if (isAppMode && isAndroid()) {
      const metaTag = document.querySelector('meta[name="theme-color"]')
      if (metaTag) {
        metaTag.setAttribute('content', color)
      }
    }
  }, [isAppMode])

  // 햅틱 피드백 (진동)
  const hapticFeedback = useCallback((pattern: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!deviceInfo?.isTouchDevice) return

    const vibrationPatterns = {
      light: 10,
      medium: 20,
      heavy: 50
    }

    if ('vibrate' in navigator) {
      navigator.vibrate(vibrationPatterns[pattern])
    }
  }, [deviceInfo])

  // 화면 전체 모드 토글
  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen()
      } catch (error) {
        console.log('풀스크린 지원되지 않음:', error)
      }
    } else {
      try {
        await document.exitFullscreen()
      } catch (error) {
        console.log('풀스크린 해제 오류:', error)
      }
    }
  }, [])

  // 화면 밝기 제어 (PWA에서 지원되는 경우)
  const setScreenBrightness = useCallback(async (_level: number) => {
    if ('wakeLock' in navigator && isAppMode) {
      try {
        // Wake Lock API를 사용하여 화면이 꺼지지 않도록 함
        await (navigator as any).wakeLock.request('screen')
      } catch (error) {
        console.log('Wake Lock 지원되지 않음:', error)
      }
    }
  }, [isAppMode])

  // 스와이프 제스처 감지
  const useSwipeGesture = useCallback((
    onSwipeLeft?: () => void,
    onSwipeRight?: () => void,
    onSwipeUp?: () => void,
    onSwipeDown?: () => void
  ) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (!deviceInfo?.isTouchDevice) return

      let startX = 0
      let startY = 0
      let endX = 0
      let endY = 0

      const handleTouchStart = (e: TouchEvent) => {
        startX = e.touches[0].clientX
        startY = e.touches[0].clientY
      }

      const handleTouchEnd = (e: TouchEvent) => {
        endX = e.changedTouches[0].clientX
        endY = e.changedTouches[0].clientY
        
        const deltaX = endX - startX
        const deltaY = endY - startY
        const threshold = 50 // 최소 스와이프 거리

        if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // 가로 스와이프
            if (deltaX > 0 && onSwipeRight) {
              onSwipeRight()
              hapticFeedback('light')
            } else if (deltaX < 0 && onSwipeLeft) {
              onSwipeLeft()
              hapticFeedback('light')
            }
          } else {
            // 세로 스와이프
            if (deltaY > 0 && onSwipeDown) {
              onSwipeDown()
              hapticFeedback('light')
            } else if (deltaY < 0 && onSwipeUp) {
              onSwipeUp()
              hapticFeedback('light')
            }
          }
        }
      }

      document.addEventListener('touchstart', handleTouchStart)
      document.addEventListener('touchend', handleTouchEnd)

      return () => {
        document.removeEventListener('touchstart', handleTouchStart)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown])
  }, [deviceInfo, hapticFeedback])

  return {
    deviceInfo,
    isAppMode,
    statusBarHeight,
    checkInstallStatus,
    setStatusBarColor,
    hapticFeedback,
    toggleFullscreen,
    setScreenBrightness,
    useSwipeGesture
  }
}