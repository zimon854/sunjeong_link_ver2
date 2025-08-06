'use client'

import { useState, useEffect } from 'react'
import { getNetworkStatus } from '@/lib/device'

interface NetworkStatusProps {
  className?: string
}

export default function NetworkStatus({ className = '' }: NetworkStatusProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineMessage, setShowOfflineMessage] = useState(false)

  useEffect(() => {
    // 초기 네트워크 상태 확인
    const { online } = getNetworkStatus()
    setIsOnline(online)

    // 네트워크 상태 변경 감지
    const handleOnline = () => {
      setIsOnline(true)
      setShowOfflineMessage(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineMessage(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // 온라인 상태가 되면 잠시 후 메시지 숨기기
  useEffect(() => {
    if (isOnline && showOfflineMessage) {
      const timer = setTimeout(() => {
        setShowOfflineMessage(false)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [isOnline, showOfflineMessage])

  if (!showOfflineMessage && isOnline) return null

  return (
    <>
      {/* 상단 네트워크 상태바 */}
      <div className={`network-status ${isOnline ? 'online' : 'offline'} ${className}`} />
      
      {/* 오프라인 메시지 */}
      {showOfflineMessage && (
        <div className={`fixed top-4 left-4 right-4 z-50 bg-red-500/90 backdrop-blur-sm border border-red-400/30 rounded-xl p-3 transform transition-all duration-300 ${
          isOnline ? 'bg-green-500/90 border-green-400/30' : ''
        }`}>
          <div className="flex items-center gap-3 text-white text-sm">
            {isOnline ? (
              <>
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                <span className="font-medium">인터넷 연결됨</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-red-300 rounded-full" />
                <span className="font-medium">인터넷 연결 없음</span>
                <span className="text-red-200">일부 기능이 제한될 수 있습니다</span>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}