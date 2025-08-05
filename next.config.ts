import type { NextConfig } from "next";
import withPWA from "next-pwa";

const isDevelopment = process.env.NODE_ENV === 'development';

const pwaConfig = {
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: isDevelopment, // 개발 모드에서 PWA 비활성화
  buildExcludes: [/middleware-manifest\.json$/],
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst' as const, // 타입스크립트가 핸들러 문자열을 추론할 수 있도록 const 추가
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
};

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // ❗ ESLint 에러가 있어도 빌드 실패하지 않도록 설정
    ignoreDuringBuilds: true,
  },
  ...(withPWA(pwaConfig) as object), // withPWA를 별도 설정으로 분리하고 타입 단언 사용
};

export default nextConfig;
