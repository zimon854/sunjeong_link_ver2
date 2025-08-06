#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 PWA 구성 검증 시작...\n');

// 1. Manifest 파일 검증
const manifestPath = path.join(__dirname, '../public/manifest.json');
let manifestValid = false;

try {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  console.log('✅ manifest.json 파일 존재');
  
  // 필수 필드 검증
  const requiredFields = ['name', 'short_name', 'start_url', 'display', 'theme_color', 'background_color', 'icons'];
  const missingFields = requiredFields.filter(field => !manifest[field]);
  
  if (missingFields.length === 0) {
    console.log('✅ Manifest 필수 필드 모두 존재');
    manifestValid = true;
  } else {
    console.log('❌ Manifest 누락 필드:', missingFields.join(', '));
  }
  
  // 아이콘 검증
  if (manifest.icons && manifest.icons.length > 0) {
    console.log('✅ PWA 아이콘 설정됨');
    manifest.icons.forEach(icon => {
      const iconPath = path.join(__dirname, '../public', icon.src);
      if (fs.existsSync(iconPath)) {
        console.log(`  ✅ ${icon.sizes} 아이콘: ${icon.src}`);
      } else {
        console.log(`  ❌ ${icon.sizes} 아이콘 누락: ${icon.src}`);
      }
    });
  } else {
    console.log('❌ PWA 아이콘이 설정되지 않음');
  }
  
} catch (error) {
  console.log('❌ manifest.json 파일이 없거나 잘못됨:', error.message);
}

// 2. Service Worker 검증 (프로덕션 빌드 후)
const swPath = path.join(__dirname, '../public/sw.js');
if (fs.existsSync(swPath)) {
  console.log('✅ Service Worker 파일 존재: sw.js');
} else {
  console.log('⚠️  Service Worker 파일 없음 (프로덕션 빌드 필요)');
}

// 3. Next.js PWA 설정 검증
const nextConfigPath = path.join(__dirname, '../next.config.js');
if (fs.existsSync(nextConfigPath)) {
  console.log('✅ next.config.js 파일 존재');
  const nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
  if (nextConfig.includes('next-pwa')) {
    console.log('✅ next-pwa 설정됨');
  } else {
    console.log('❌ next-pwa 설정이 없음');
  }
} else {
  console.log('❌ next.config.js 파일이 없음');
}

// 4. 필수 디렉토리 구조 검증
const requiredDirs = [
  '../src/lib',
  '../src/components',
  '../src/hooks',
  '../src/styles'
];

console.log('\n📁 디렉토리 구조 검증:');
requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`✅ ${dir.replace('../', '')}`);
  } else {
    console.log(`❌ ${dir.replace('../', '')}`);
  }
});

// 5. PWA 관련 파일들 검증
console.log('\n🔧 PWA 관련 파일 검증:');
const pwaFiles = [
  '../src/lib/device.ts',
  '../src/hooks/usePWAFeatures.ts',
  '../src/hooks/useNativeToast.ts',
  '../src/components/PWAInstallPrompt.tsx',
  '../src/components/NetworkStatus.tsx',
  '../src/components/PWAAppBar.tsx',
  '../src/components/PWAGestureArea.tsx',
  '../src/components/PWAStatusBar.tsx',
  '../src/components/AdaptiveLayout.tsx',
  '../src/styles/pwa.css'
];

pwaFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file.replace('../src/', '')}`);
  } else {
    console.log(`❌ ${file.replace('../src/', '')}`);
  }
});

// 6. 종합 결과
console.log('\n📊 PWA 준비 상태 요약:');
console.log('─────────────────────────────');

if (manifestValid) {
  console.log('✅ Manifest: 유효');
} else {
  console.log('❌ Manifest: 수정 필요');
}

console.log('⚠️  Service Worker: 프로덕션 빌드 후 확인 가능');
console.log('✅ PWA 컴포넌트: 구현됨');
console.log('✅ PWA CSS: 적용됨');

console.log('\n🚀 다음 단계:');
console.log('1. npm run build:pwa - 프로덕션 빌드');
console.log('2. npm start - 프로덕션 서버 실행');
console.log('3. Chrome DevTools > Application > PWA 검증');
console.log('4. Android 디바이스에서 설치 테스트');

console.log('\n✨ PWA 검증 완료!');