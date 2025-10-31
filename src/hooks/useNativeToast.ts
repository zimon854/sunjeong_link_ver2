'use client'

import { useCallback, useEffect, useRef } from 'react'

type ToastType = 'success' | 'error' | 'info'

type ToastPosition = 'top' | 'center' | 'bottom'

export interface ToastOptions {
  /** Toast will disappear after this many milliseconds */
  duration?: number
  /** Where the toast should appear vertically */
  position?: ToastPosition
}

const DEFAULT_OPTIONS: Required<ToastOptions> = {
  duration: 2600,
  position: 'bottom'
}

const CONTAINER_ID = 'native-toast-container'

const POSITION_STYLES: Record<ToastPosition, Pick<CSSStyleDeclaration, 'justifyContent' | 'paddingTop' | 'paddingBottom'>> = {
  top: {
    justifyContent: 'flex-start',
    paddingTop: 'calc(env(safe-area-inset-top, 0px) + 24px)',
    paddingBottom: '24px'
  },
  center: {
    justifyContent: 'center',
    paddingTop: '24px',
    paddingBottom: '24px'
  },
  bottom: {
    justifyContent: 'flex-end',
    paddingTop: '24px',
    paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)'
  }
}

const TYPE_CLASSES: Record<ToastType, string> = {
  success: 'bg-emerald-500/95 text-white border border-emerald-400/70 shadow-emerald-500/30',
  error: 'bg-rose-500/95 text-white border border-rose-400/60 shadow-rose-500/30',
  info: 'bg-blue-500/95 text-white border border-blue-400/60 shadow-blue-500/20'
}

const ensureContainer = (position: ToastPosition): HTMLDivElement | null => {
  if (typeof window === 'undefined') {
    return null
  }

  let container = document.getElementById(CONTAINER_ID) as HTMLDivElement | null

  if (!container) {
    container = document.createElement('div')
    container.id = CONTAINER_ID
    container.className = 'fixed inset-0 pointer-events-none z-[9999]'
    document.body.appendChild(container)
  }

  container.style.display = 'flex'
  container.style.flexDirection = 'column'
  container.style.alignItems = 'center'
  container.style.gap = '12px'
  container.style.left = '0'
  container.style.right = '0'
  container.style.top = '0'
  container.style.bottom = '0'
  container.style.position = 'fixed'
  container.style.pointerEvents = 'none'
  container.style.paddingLeft = '16px'
  container.style.paddingRight = '16px'

  const positionStyle = POSITION_STYLES[position]
  container.style.justifyContent = positionStyle.justifyContent
  container.style.paddingTop = positionStyle.paddingTop
  container.style.paddingBottom = positionStyle.paddingBottom

  return container
}

const createToastElement = (message: string, type: ToastType): HTMLDivElement => {
  const toast = document.createElement('div')
  toast.setAttribute('role', 'status')
  toast.setAttribute('aria-live', 'polite')
  toast.className = [
    'native-toast',
    'pointer-events-auto w-full max-w-sm rounded-2xl px-4 py-3 text-sm font-semibold text-white',
    'shadow-lg shadow-black/10 border backdrop-blur-md transition-all duration-300 ease-out',
    'opacity-0 translate-y-3 scale-[0.97]',
    TYPE_CLASSES[type]
  ].join(' ')
  toast.textContent = message

  return toast
}

const animateIn = (toast: HTMLDivElement) => {
  requestAnimationFrame(() => {
    toast.style.opacity = '1'
    toast.style.transform = 'translateY(0) scale(1)'
  })
}

const animateOutAndRemove = (toast: HTMLDivElement) => {
  toast.style.opacity = '0'
  toast.style.transform = 'translateY(6px) scale(0.97)'
  toast.addEventListener(
    'transitionend',
    () => {
      toast.remove()
    },
    { once: true }
  )
}

const showToast = (
  message: string,
  type: ToastType,
  options: ToastOptions | undefined,
  registerCleanup: (timeoutId: number) => void
) => {
  if (typeof window === 'undefined') {
    return
  }

  const { duration, position } = { ...DEFAULT_OPTIONS, ...options }

  const container = ensureContainer(position)
  if (!container) {
    return
  }

  const toast = createToastElement(message, type)
  container.appendChild(toast)
  animateIn(toast)

  const timeoutId = window.setTimeout(() => {
    animateOutAndRemove(toast)
  }, duration)

  registerCleanup(timeoutId)
}

export const useNativeToast = () => {
  const timeoutsRef = useRef<number[]>([])

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId)
      })
      timeoutsRef.current = []
    }
  }, [])

  const registerTimeout = useCallback((timeoutId: number) => {
    timeoutsRef.current.push(timeoutId)
  }, [])

  const show = useCallback(
    (message: string, type: ToastType, options?: ToastOptions) => {
      const text = typeof message === 'string' ? message : String(message)
      if (!text) {
        return
      }

      if (typeof window === 'undefined') {
        return
      }

      showToast(text, type, options, registerTimeout)
    },
    [registerTimeout]
  )

  const showSuccess = useCallback((message: string, options?: ToastOptions) => {
    show(message, 'success', options)
  }, [show])

  const showError = useCallback((message: string, options?: ToastOptions) => {
    show(message, 'error', options)
  }, [show])

  const showInfo = useCallback((message: string, options?: ToastOptions) => {
    show(message, 'info', options)
  }, [show])

  return {
    showSuccess,
    showError,
    showInfo
  }
}

export type UseNativeToastReturn = ReturnType<typeof useNativeToast>
