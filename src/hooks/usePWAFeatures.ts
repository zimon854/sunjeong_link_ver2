'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDeviceInfo, isAndroid, isPWA } from '@/lib/device';

export function usePWAFeatures() {
  const [deviceInfo, setDeviceInfo] = useState<ReturnType<typeof getDeviceInfo> | null>(null);
  const [isAppMode, setIsAppMode] = useState(false);
  const [statusBarHeight, setStatusBarHeight] = useState(0);

  useEffect(() => {
    const info = getDeviceInfo();
    setDeviceInfo(info);
    setIsAppMode(info.isPWA);

    if (info.isPWA && info.isAndroid) {
      const updateStatusBarHeight = () => {
        const safeAreaTop = getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top');
        const height = safeAreaTop ? parseInt(safeAreaTop.replace('px', ''), 10) : 24;
        setStatusBarHeight(height);
      };

      updateStatusBarHeight();
      window.addEventListener('resize', updateStatusBarHeight);
      return () => window.removeEventListener('resize', updateStatusBarHeight);
    }

    return undefined;
  }, []);

  const checkInstallStatus = useCallback(() => isPWA(), []);

  const setStatusBarColor = useCallback(
    (color: string) => {
      if (!isAppMode || !isAndroid()) return;
      const metaTag = document.querySelector('meta[name="theme-color"]');
      if (metaTag) {
        metaTag.setAttribute('content', color);
      }
    },
    [isAppMode],
  );

  const hapticFeedback = useCallback(
    (pattern: 'light' | 'medium' | 'heavy' = 'light') => {
      if (!deviceInfo?.isTouchDevice) return;

      const vibrationPatterns: Record<typeof pattern, number> = {
        light: 10,
        medium: 20,
        heavy: 50,
      };

      if ('vibrate' in navigator) {
        navigator.vibrate(vibrationPatterns[pattern]);
      }
    },
    [deviceInfo],
  );

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.log('풀스크린 전환 실패:', error);
    }
  }, []);

  const setScreenBrightness = useCallback(
    async (_level: number) => {
      if ('wakeLock' in navigator && isAppMode) {
        try {
          await (navigator as any).wakeLock.request('screen');
        } catch (error) {
          console.log('Wake Lock 사용 불가:', error);
        }
      }
    },
    [isAppMode],
  );

  const useSwipeGesture = useCallback(
    (
      onSwipeLeft?: () => void,
      onSwipeRight?: () => void,
      onSwipeUp?: () => void,
      onSwipeDown?: () => void,
    ) => {
      useEffect(() => {
        if (!deviceInfo?.isTouchDevice) return;

        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        const handleTouchStart = (event: TouchEvent) => {
          startX = event.touches[0].clientX;
          startY = event.touches[0].clientY;
        };

        const handleTouchEnd = (event: TouchEvent) => {
          endX = event.changedTouches[0].clientX;
          endY = event.changedTouches[0].clientY;

          const deltaX = endX - startX;
          const deltaY = endY - startY;
          const threshold = 50;

          if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
              if (deltaX > 0) {
                onSwipeRight?.();
              } else {
                onSwipeLeft?.();
              }
            } else if (deltaY > 0) {
              onSwipeDown?.();
            } else {
              onSwipeUp?.();
            }
            hapticFeedback('light');
          }
        };

        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchend', handleTouchEnd);

        return () => {
          document.removeEventListener('touchstart', handleTouchStart);
          document.removeEventListener('touchend', handleTouchEnd);
        };
      }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);
    },
    [deviceInfo, hapticFeedback],
  );

  return {
    deviceInfo,
    isAppMode,
    statusBarHeight,
    checkInstallStatus,
    setStatusBarColor,
    hapticFeedback,
    toggleFullscreen,
    setScreenBrightness,
    useSwipeGesture,
  };
}
