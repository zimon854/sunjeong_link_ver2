'use client'

import { useCallback } from 'react'
import { isPWA } from '@/lib/device'

interface ToastOptions {
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  position?: 'top' | 'bottom' | 'center'
}

export function useNativeToast() {
  const showToast = useCallback((message: string, options: ToastOptions = {}) => {
    const {
      type = 'info',
      duration = 3000,
      position = 'top'
    } = options

    // PWA에서만 네이티브 토스트 사용
    if (!isPWA()) {
      // 웹에서는 기본 alert 또는 다른 토스트 라이브러리 사용
      alert(message)
      return
    }

    // 토스트 컨테이너 찾기 또는 생성
    let container = document.getElementById('native-toast-container')
    if (!container) {
      container = document.createElement('div')
      container.id = 'native-toast-container'
      container.className = 'fixed inset-0 pointer-events-none z-50'
      document.body.appendChild(container)
    }

    // 토스트 엘리먼트 생성
    const toast = document.createElement('div')
    const toastId = `toast-${Date.now()}`
    toast.id = toastId
    
    // 타입별 스타일 설정
    const typeStyles = {
      success: 'border-green-400/30 bg-green-500/10 text-green-200',
      error: 'border-red-400/30 bg-red-500/10 text-red-200',
      warning: 'border-yellow-400/30 bg-yellow-500/10 text-yellow-200',
      info: 'border-blue-400/30 bg-blue-500/10 text-blue-200'
    }

    // 아이콘 설정
    const typeIcons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    }

    // 포지션별 클래스 설정
    const positionClasses = {
      top: 'top-16',
      center: 'top-1/2 -translate-y-1/2',
      bottom: 'bottom-16'
    }

    toast.className = `native-toast pointer-events-auto ${typeStyles[type]} ${positionClasses[position]}`
    
    toast.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-white/10 rounded-full">
          <span class="text-sm">${typeIcons[type]}</span>
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium">${message}</p>
        </div>
        <button class="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors" onclick="document.getElementById('${toastId}').remove()">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
    `

    // 컨테이너에 추가
    container.appendChild(toast)

    // 애니메이션 시작
    setTimeout(() => {
      toast.classList.add('show')
    }, 10)

    // 자동 제거
    setTimeout(() => {
      toast.classList.remove('show')
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast)
        }
      }, 300)
    }, duration)

    // 진동 피드백 (타입에 따라)
    if ('vibrate' in navigator) {
      const vibrationPatterns = {
        success: [50],
        error: [100, 50, 100],
        warning: [50, 50, 50],
        info: [30]
      }
      navigator.vibrate(vibrationPatterns[type])
    }

  }, [])

  const showSuccess = useCallback((message: string, duration?: number) => {
    showToast(message, { type: 'success', duration })
  }, [showToast])

  const showError = useCallback((message: string, duration?: number) => {
    showToast(message, { type: 'error', duration })
  }, [showToast])

  const showWarning = useCallback((message: string, duration?: number) => {
    showToast(message, { type: 'warning', duration })
  }, [showToast])

  const showInfo = useCallback((message: string, duration?: number) => {
    showToast(message, { type: 'info', duration })
  }, [showToast])

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}