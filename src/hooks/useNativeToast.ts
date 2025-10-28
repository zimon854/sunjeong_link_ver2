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
      position = 'center'
    } = options

    // 토스트 컨테이너 찾기 또는 생성
    let container = document.getElementById('native-toast-container')
    if (!container) {
      container = document.createElement('div')
      container.id = 'native-toast-container'
      container.className = 'fixed inset-0 pointer-events-none z-[10000]'
      document.body.appendChild(container)
    }

    const typeConfigs = {
      success: { icon: '✓', label: '완료' },
      error: { icon: '✕', label: '오류' },
      warning: { icon: '⚠', label: '주의' },
      info: { icon: 'ℹ', label: '안내' }
    } as const

    const positionClasses = {
      top: '',
      center: 'native-toast--center',
      bottom: 'native-toast--bottom'
    } as const

    const toast = document.createElement('div')
    toast.setAttribute('role', 'status')
    toast.setAttribute('aria-live', 'polite')

    const typeClass = `native-toast--${type}`
    const positionClass = positionClasses[position]
    toast.className = ['native-toast', typeClass, positionClass].filter(Boolean).join(' ')

    toast.innerHTML = `
      <div class="native-toast__content">
        <div class="native-toast__icon">${typeConfigs[type].icon}</div>
        <div class="native-toast__text">
          <span class="native-toast__title">${typeConfigs[type].label}</span>
          <p class="native-toast__message">${message}</p>
        </div>
        <button type="button" class="native-toast__close" aria-label="알림 닫기">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div class="native-toast__progress">
        <div class="native-toast__progress-bar"></div>
      </div>
    `

    container.appendChild(toast)

    const closeButton = toast.querySelector<HTMLButtonElement>('.native-toast__close')
    const progressBar = toast.querySelector<HTMLDivElement>('.native-toast__progress-bar')

    if (!closeButton || !progressBar) {
      return
    }

    // 애니메이션 시작
    requestAnimationFrame(() => {
      toast.classList.add('show')
      progressBar.style.transitionDuration = `${duration}ms`
      progressBar.style.transform = 'scaleX(0)'
    })

    const removeToast = () => {
      toast.classList.remove('show')
      window.setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast)
        }
      }, 400)
    }

    const hideTimer = window.setTimeout(removeToast, duration)

    closeButton.addEventListener('click', () => {
      window.clearTimeout(hideTimer)
      removeToast()
    })

    // 진동 피드백 (PWA 환경에서만 동작)
    if (isPWA() && 'vibrate' in navigator) {
      const vibrationPatterns = {
        success: [50],
        error: [100, 50, 100],
        warning: [50, 50, 50],
        info: [30]
      } as const
      navigator.vibrate(vibrationPatterns[type])
    }

  }, [])

  const showSuccess = useCallback((message: string, options: Omit<ToastOptions, 'type'> = {}) => {
    showToast(message, { ...options, type: 'success' })
  }, [showToast])

  const showError = useCallback((message: string, options: Omit<ToastOptions, 'type'> = {}) => {
    showToast(message, { ...options, type: 'error' })
  }, [showToast])

  const showWarning = useCallback((message: string, options: Omit<ToastOptions, 'type'> = {}) => {
    showToast(message, { ...options, type: 'warning' })
  }, [showToast])

  const showInfo = useCallback((message: string, options: Omit<ToastOptions, 'type'> = {}) => {
    showToast(message, { ...options, type: 'info' })
  }, [showToast])

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}
