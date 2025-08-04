"use client";

import { useState, useEffect } from 'react';

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if already installed as PWA
    const standalone = (window.navigator as any).standalone || 
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
    setIsStandalone(standalone);

    // Show prompt if iOS and not standalone
    if (iOS && !standalone) {
      // Delay showing prompt to avoid immediate popup
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleInstall = () => {
    // For iOS, we can only guide users to the share menu
    if (isIOS) {
      // Show instructions for iOS
      alert('iOS에서 앱 설치 방법:\n\n1. Safari 브라우저에서 이 페이지를 열어주세요\n2. 하단의 공유 버튼을 탭하세요\n3. "홈 화면에 추가"를 선택하세요\n4. "추가"를 탭하여 설치를 완료하세요');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Remember user's choice for 7 days
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  if (!showPrompt || isStandalone) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <img 
            src="/logo/sunjeong_link_logo.png" 
            alt="링커블" 
            className="w-12 h-12 rounded-lg"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900">
            링커블 앱 설치
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            더 빠른 접근을 위해 홈 화면에 앱을 추가하세요
          </p>
          <div className="mt-3 flex space-x-2">
            <button
              onClick={handleInstall}
              className="flex-1 bg-blue-600 text-white text-xs px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              설치하기
            </button>
            <button
              onClick={handleDismiss}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              나중에
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
} 