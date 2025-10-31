import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ❗ ESLint 에러가 있어도 빌드 실패하지 않도록 설정
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
