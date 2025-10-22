/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
})

const nextConfig = {
  eslint: {
    // 프로덕션 빌드에서 ESLint 오류 무시
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost', 'sunjeong-link-ver2.vercel.app', 'flagcdn.com', 'images.unsplash.com'],
  },
  // PWA에서 파일 캐싱 최적화
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/logo/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
if (supabaseUrl) {
  try {
    const { hostname } = new URL(supabaseUrl)
    if (!nextConfig.images.domains.includes(hostname)) {
      nextConfig.images.domains.push(hostname)
    }
  } catch (error) {
    console.warn('Invalid NEXT_PUBLIC_SUPABASE_URL, skipping image domain config:', error)
  }
}

module.exports = withPWA(nextConfig)
