'use client'

import { useState, useEffect } from 'react'
import { PWAInstallManager, isPWA, isAndroid } from '@/lib/device'

interface PWAInstallPromptProps {
  className?: string
}

export default function PWAInstallPrompt({ className = '' }: PWAInstallPromptProps) {
  const [showPrompt, setShowPrompt] = useState(false)
  const [installManager] = useState(() => new PWAInstallManager())

  useEffect(() => {
    // PWA가 이미 설치되어 있다면 프롬프트를 표시하지 않음
    if (isPWA()) {
      setShowPrompt(false)
      return
    }

    // 안드로이드에서만 표시하고, 설치 가능할 때만 표시
    const timer = setTimeout(() => {
      if (isAndroid() && installManager.canPromptInstall()) {
        setShowPrompt(true)
      }
    }, 3000) // 3초 후에 표시

    return () => clearTimeout(timer)
  }, [installManager])

  const handleInstall = async () => {
    const installed = await installManager.promptInstall()
    if (installed) {
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // 24시간 동안 다시 표시하지 않음
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  // 이미 해제한 상태라면 24시간 동안 표시하지 않음
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
      const dismissedTime = parseInt(dismissed)
      const now = Date.now()
      const dayInMs = 24 * 60 * 60 * 1000
      
      if (now - dismissedTime < dayInMs) {
        setShowPrompt(false)
        return
      }
    }
  }, [])

  if (!showPrompt) return null

  return (
    <div className={`pwa-install-prompt ${showPrompt ? 'show' : ''} ${className}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <div className="text-white font-bold text-lg">L</div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm mb-1">
            링커블 앱 설치
          </h3>
          <p className="text-blue-200/80 text-xs mb-3">
            더 빠르고 편리한 앱 경험을 위해 홈 화면에 추가하세요
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs font-medium py-2 px-4 rounded-lg transition-all duration-200 active:scale-95"
            >
              설치하기
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-2 text-blue-200/80 hover:text-white text-xs font-medium transition-colors duration-200"
            >
              나중에
            </button>
          </div>
        </div>
        
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 text-blue-200/60 hover:text-white transition-colors duration-200"
          aria-label="닫기"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}