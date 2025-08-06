/**
 * Device detection utilities for PWA optimization
 */

// PWA 설치 감지
export const isPWA = (): boolean => {
  if (typeof window === 'undefined') return false
  
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any)?.standalone === true ||
         document.referrer.includes('android-app://')
}

// 모바일 디바이스 감지
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false
  
  return window.matchMedia('(max-width: 768px)').matches ||
         /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
           window.navigator.userAgent
         )
}

// 안드로이드 감지
export const isAndroid = (): boolean => {
  if (typeof window === 'undefined') return false
  
  return /Android/i.test(window.navigator.userAgent)
}

// iOS 감지
export const isIOS = (): boolean => {
  if (typeof window === 'undefined') return false
  
  return /iPad|iPhone|iPod/.test(window.navigator.userAgent)
}

// 터치 디바이스 감지
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  
  return 'ontouchstart' in window ||
         navigator.maxTouchPoints > 0 ||
         (navigator as any).msMaxTouchPoints > 0
}

// PWA 설치 가능 여부 확인
export const canInstallPWA = (): boolean => {
  if (typeof window === 'undefined') return false
  
  return 'beforeinstallprompt' in window && !isPWA()
}

// 네트워크 상태 확인
export const getNetworkStatus = () => {
  if (typeof window === 'undefined' || !('navigator' in window)) {
    return { online: true, effectiveType: 'unknown' }
  }
  
  const connection = (navigator as any).connection || 
                     (navigator as any).mozConnection || 
                     (navigator as any).webkitConnection
  
  return {
    online: navigator.onLine,
    effectiveType: connection?.effectiveType || 'unknown',
    downlink: connection?.downlink,
    rtt: connection?.rtt
  }
}

// 화면 방향 감지
export const getScreenOrientation = (): 'portrait' | 'landscape' => {
  if (typeof window === 'undefined') return 'portrait'
  
  const orientation = window.screen?.orientation?.type || 
                      (window.screen as any)?.mozOrientation ||
                      (window.screen as any)?.msOrientation
  
  if (orientation) {
    return orientation.includes('portrait') ? 'portrait' : 'landscape'
  }
  
  return window.innerWidth < window.innerHeight ? 'portrait' : 'landscape'
}

// Safe Area 감지 (노치, 상태바 등)
export const getSafeAreaInsets = () => {
  if (typeof window === 'undefined') return { top: 0, right: 0, bottom: 0, left: 0 }
  
  const computedStyle = getComputedStyle(document.documentElement)
  
  return {
    top: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)') || '0'),
    right: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)') || '0'),
    bottom: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
    left: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)') || '0')
  }
}

// 디바이스 정보 객체
export const getDeviceInfo = () => {
  return {
    isPWA: isPWA(),
    isMobile: isMobile(),
    isAndroid: isAndroid(),
    isIOS: isIOS(),
    isTouchDevice: isTouchDevice(),
    canInstallPWA: canInstallPWA(),
    networkStatus: getNetworkStatus(),
    orientation: getScreenOrientation(),
    safeAreaInsets: getSafeAreaInsets(),
    viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
    viewportWidth: typeof window !== 'undefined' ? window.innerWidth : 0
  }
}

// PWA 설치 프롬프트 관리
export class PWAInstallManager {
  private deferredPrompt: any = null
  
  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault()
        this.deferredPrompt = e
      })
    }
  }
  
  canPromptInstall(): boolean {
    return this.deferredPrompt !== null
  }
  
  async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) return false
    
    try {
      this.deferredPrompt.prompt()
      const { outcome } = await this.deferredPrompt.userChoice
      this.deferredPrompt = null
      return outcome === 'accepted'
    } catch (error) {
      console.error('PWA install prompt failed:', error)
      return false
    }
  }
}

// 반응형 브레이크포인트
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const

export type Breakpoint = keyof typeof breakpoints

// 현재 브레이크포인트 감지
export const getCurrentBreakpoint = (): Breakpoint => {
  if (typeof window === 'undefined') return 'md'
  
  const width = window.innerWidth
  
  if (width >= breakpoints['2xl']) return '2xl'
  if (width >= breakpoints.xl) return 'xl'
  if (width >= breakpoints.lg) return 'lg'
  if (width >= breakpoints.md) return 'md'
  if (width >= breakpoints.sm) return 'sm'
  return 'xs'
}