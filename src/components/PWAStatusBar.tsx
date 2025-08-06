'use client'

import { useState, useEffect } from 'react'
import { isPWA, isAndroid, getNetworkStatus } from '@/lib/device'

interface PWAStatusBarProps {
  backgroundColor?: string
  textColor?: string
  showTime?: boolean
  showBattery?: boolean
  showNetwork?: boolean
}

export default function PWAStatusBar({ 
  backgroundColor = '#0f172a',
  textColor = '#ffffff',
  showTime = true,
  showBattery = true,
  showNetwork = true
}: PWAStatusBarProps) {
  const [currentTime, setCurrentTime] = useState<string>('')
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null)
  const [isCharging, setIsCharging] = useState<boolean>(false)
  const [networkInfo, setNetworkInfo] = useState<{ online: boolean; effectiveType?: string }>({ online: true })

  useEffect(() => {
    // PWA 환경이 아니면 렌더링하지 않음
    if (!isPWA() || !isAndroid()) return

    // 시간 업데이트
    if (showTime) {
      const updateTime = () => {
        const now = new Date()
        setCurrentTime(now.toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }))
      }
      updateTime()
      const timeInterval = setInterval(updateTime, 1000)
      
      return () => clearInterval(timeInterval)
    }
  }, [showTime])

  useEffect(() => {
    // 배터리 정보 (지원되는 브라우저에서만)
    if (showBattery && 'getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBatteryInfo = () => {
          setBatteryLevel(Math.round(battery.level * 100))
          setIsCharging(battery.charging)
        }
        
        updateBatteryInfo()
        
        battery.addEventListener('levelchange', updateBatteryInfo)
        battery.addEventListener('chargingchange', updateBatteryInfo)
        
        return () => {
          battery.removeEventListener('levelchange', updateBatteryInfo)
          battery.removeEventListener('chargingchange', updateBatteryInfo)
        }
      })
    }
  }, [showBattery])

  useEffect(() => {
    // 네트워크 정보
    if (showNetwork) {
      const updateNetworkInfo = () => {
        const info = getNetworkStatus()
        setNetworkInfo(info)
      }
      
      updateNetworkInfo()
      
      window.addEventListener('online', updateNetworkInfo)
      window.addEventListener('offline', updateNetworkInfo)
      
      return () => {
        window.removeEventListener('online', updateNetworkInfo)
        window.removeEventListener('offline', updateNetworkInfo)
      }
    }
  }, [showNetwork])

  // PWA가 아니거나 안드로이드가 아니면 렌더링하지 않음
  if (!isPWA() || !isAndroid()) return null

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 text-sm font-medium pwa-status-bar"
      style={{ 
        backgroundColor,
        color: textColor,
        height: 'env(safe-area-inset-top, 24px)',
        minHeight: '24px',
        paddingTop: '4px',
        paddingBottom: '4px'
      }}
    >
      {/* 왼쪽: 시간 */}
      <div className="flex items-center gap-2">
        {showTime && currentTime && (
          <span className="font-mono text-xs">
            {currentTime}
          </span>
        )}
        
        {showNetwork && (
          <div className="flex items-center gap-1">
            {networkInfo.online ? (
              <div className="flex gap-1">
                {/* 신호 강도 표시 (가상) */}
                <div className="flex items-end gap-0.5">
                  <div className="w-1 h-2 bg-current opacity-100 rounded-sm"></div>
                  <div className="w-1 h-3 bg-current opacity-80 rounded-sm"></div>
                  <div className="w-1 h-4 bg-current opacity-60 rounded-sm"></div>
                  <div className="w-1 h-5 bg-current opacity-40 rounded-sm"></div>
                </div>
                {networkInfo.effectiveType && (
                  <span className="text-xs opacity-80">
                    {networkInfo.effectiveType.toUpperCase()}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs opacity-60">오프라인</span>
            )}
          </div>
        )}
      </div>

      {/* 가운데: 앱 제목 또는 빈 공간 */}
      <div className="flex-1 text-center">
        <span className="text-xs opacity-80">링커블</span>
      </div>

      {/* 오른쪽: 배터리, 기타 상태 */}
      <div className="flex items-center gap-2">
        {showBattery && batteryLevel !== null && (
          <div className="flex items-center gap-1">
            {isCharging && (
              <div className="text-xs">⚡</div>
            )}
            <div className="relative">
              <div className="w-6 h-3 border border-current rounded-sm opacity-60">
                <div 
                  className="h-full bg-current rounded-sm transition-all duration-300"
                  style={{ 
                    width: `${batteryLevel}%`,
                    backgroundColor: batteryLevel > 20 ? 'currentColor' : '#ef4444'
                  }}
                />
              </div>
              <div className="w-1 h-1 bg-current rounded-r-sm absolute -right-0.5 top-1 opacity-60"></div>
            </div>
            <span className="text-xs font-mono">
              {batteryLevel}%
            </span>
          </div>
        )}
        
        {/* PWA 표시 */}
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="PWA 모드"></div>
      </div>
    </div>
  )
}