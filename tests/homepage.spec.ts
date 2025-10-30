import { test, expect } from '@playwright/test';

test.describe('홈페이지 디자인 및 기능 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('페이지 제목과 헤딩이 올바르게 표시되는가', async ({ page }) => {
    // 페이지 제목 확인
    await expect(page).toHaveTitle(/링커블/);
    
    // 메인 헤딩 확인
    const mainHeading = page.locator('h1').first();
    await expect(mainHeading).toBeVisible();
    await expect(mainHeading).toContainText('터지는');
    await expect(mainHeading).toContainText('쇼핑');
    await expect(mainHeading).toContainText('리뷰');
    await expect(mainHeading).toContainText('확산');
  });

  test('네비게이션 바가 올바르게 동작하는가', async ({ page }) => {
    // 로고 확인
    const logo = page.locator('img[alt="선정링크 로고"]');
    await expect(logo).toBeVisible();
    
    // 네비게이션 메뉴 확인
    await expect(page.locator('text=캠페인')).toBeVisible();
    await expect(page.locator('text=인플루언서')).toBeVisible();
    await expect(page.locator('text=뉴스룸')).toBeVisible();
    await expect(page.locator('text=대시보드')).toBeVisible();
    
    // 관리자 로그인 버튼 확인
    const authButton = page.locator('text=관리자 로그인');
    await expect(authButton).toBeVisible();
  });

  test('메인 CTA 버튼이 작동하는가', async ({ page }) => {
    const ctaButton = page.locator('text=무료 컨설팅 신청').first();
    await expect(ctaButton).toBeVisible();
    
    // 버튼 클릭 시 폼 섹션으로 스크롤되는지 확인
    await ctaButton.click();
    
    // 폼이 보이는지 확인
    const consultForm = page.locator('text=상담 신청하기');
    await expect(consultForm).toBeVisible();
  });

  test('통계 섹션이 올바르게 표시되는가', async ({ page }) => {
    // 통계 항목들 확인
    await expect(page.locator('text=누적 리뷰')).toBeVisible();
    await expect(page.locator('text=20,748+')).toBeVisible();
    
    await expect(page.locator('text=누적 인플루언서')).toBeVisible();
    await expect(page.locator('text=140만+')).toBeVisible();
    
    await expect(page.locator('text=누적 SNS 도달')).toBeVisible();
    await expect(page.locator('text=2.85억+')).toBeVisible();
  });

  test('파트너 로고들이 표시되는가', async ({ page }) => {
    // 파트너 로고 컨테이너가 있는지 확인
    const logoContainer = page.locator('.animate-logo-slide').first();
    await expect(logoContainer).toBeVisible();
    
    // 주요 파트너 로고들 확인
    await expect(page.locator('img[alt="Shopify"]').first()).toBeVisible();
    await expect(page.locator('img[alt="Q10"]').first()).toBeVisible();
    await expect(page.locator('img[alt="TikTok"]').first()).toBeVisible();
    await expect(page.locator('img[alt="Instagram"]').first()).toBeVisible();
  });

  test('서비스 카드들이 올바르게 표시되는가', async ({ page }) => {
    // 서비스 섹션 헤딩 확인
    await expect(page.locator('text=마케팅, 0원부터 무제한으로 시작!')).toBeVisible();
    
    // 각 서비스 카드 확인
    await expect(page.locator('text=0원으로 구매평 만들기')).toBeVisible();
    await expect(page.locator('text=무제한 쇼핑체험단')).toBeVisible();
    await expect(page.locator('text=맞춤형 인플루언서 매칭')).toBeVisible();
    await expect(page.locator('text=글로벌 인플루언서 셀링')).toBeVisible();
  });

  test('요금제 섹션이 올바르게 표시되는가', async ({ page }) => {
    // 요금제 섹션 헤딩 확인
    await expect(page.locator('text=브랜드 맞춤형 추천 플랜')).toBeVisible();
    
    // 각 요금제 확인
    await expect(page.locator('text=무료 체험')).toBeVisible();
    await expect(page.locator('text=0원')).toBeVisible();
    
    await expect(page.locator('text=성장 플랜')).toBeVisible();
    await expect(page.locator('text=30만원')).toBeVisible();
    
    await expect(page.locator('text=프리미엄')).toBeVisible();
    await expect(page.locator('text=75만원')).toBeVisible();
  });

  test('컨설팅 폼이 올바르게 작동하는가', async ({ page }) => {
    // 폼 섹션으로 스크롤
    await page.locator('#consult').scrollIntoViewIfNeeded();
    
    // 폼 요소들 확인
    await expect(page.locator('text=상담 국가 선택*')).toBeVisible();
    await expect(page.locator('text=컨설팅 항목 선택*')).toBeVisible();
    await expect(page.locator('text=담당자명*')).toBeVisible();
    await expect(page.locator('text=연락처*')).toBeVisible();
    await expect(page.locator('text=이메일*')).toBeVisible();
    
    // 체크박스들 확인
    const countryCheckboxes = page.locator('input[type="checkbox"]').first();
    await expect(countryCheckboxes).toBeVisible();
    
    // 입력 필드들 확인
    const nameInput = page.locator('input[placeholder="담당자명을 입력해주세요."]');
    await expect(nameInput).toBeVisible();
    
    const phoneInput = page.locator('input[placeholder="연락처를 입력해주세요."]');
    await expect(phoneInput).toBeVisible();
    
    const emailInput = page.locator('input[placeholder="이메일을 입력해주세요."]');
    await expect(emailInput).toBeVisible();
    
    // 제출 버튼 확인
    const submitButton = page.locator('text=제출하기');
    await expect(submitButton).toBeVisible();
  });

  test('뉴스 섹션이 올바르게 표시되는가', async ({ page }) => {
    // 뉴스 섹션 헤딩 확인
    await expect(page.locator('text=News')).toBeVisible();
    
    // 뉴스 카드들 확인 (4개)
    const newsCards = page.locator('img[alt^="news"]');
    await expect(newsCards).toHaveCount(4);
    
    // 첫 번째 뉴스 카드의 링크 확인
    const firstNewsLink = page.locator('text=자세히 보기 →').first();
    await expect(firstNewsLink).toBeVisible();
  });

  test('푸터가 올바르게 표시되는가', async ({ page }) => {
    // 푸터로 스크롤
    await page.locator('footer').scrollIntoViewIfNeeded();
    
    // 저작권 표시 확인
    await expect(page.locator('text=링커블. All rights reserved.')).toBeVisible();
  });
});

test.describe('반응형 디자인 테스트', () => {
  test('모바일 환경에서 네비게이션이 올바르게 작동하는가', async ({ page }) => {
    // 모바일 뷰포트로 설정
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // 모바일 메뉴 버튼이 보이는지 확인
    const mobileMenuButton = page.locator('button').filter({ hasText: /^$/ }).first();
    await expect(mobileMenuButton).toBeVisible();
    
    // 데스크톱 메뉴는 숨겨져야 함
    const desktopMenu = page.locator('.hidden.md\\:flex');
    await expect(desktopMenu).toBeHidden();
  });

  test('태블릿 환경에서 레이아웃이 올바르게 표시되는가', async ({ page }) => {
    // 태블릿 뷰포트로 설정
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // 메인 헤딩이 적절한 크기로 표시되는지 확인
    const mainHeading = page.locator('h1').first();
    await expect(mainHeading).toBeVisible();
    
    // 서비스 카드들이 적절히 배치되는지 확인
    const serviceCards = page.locator('text=0원으로 구매평 만들기').locator('..');
    await expect(serviceCards).toBeVisible();
  });
});

test.describe('관리자 로그인 테스트', () => {
  test('관리자 로그인 페이지로 이동할 수 있는가', async ({ page }) => {
    await page.goto('/');
    
    // 관리자 로그인 버튼 클릭
    await page.click('text=관리자 로그인');
    
    // 로그인 페이지로 이동했는지 확인
    await expect(page).toHaveURL('/auth');
    
    // 로그인 폼이 표시되는지 확인
    await expect(page.locator('text=관리자 로그인')).toBeVisible();
    await expect(page.locator('input[placeholder="관리자 ID"]')).toBeVisible();
    await expect(page.locator('input[placeholder="비밀번호"]')).toBeVisible();
  });

  test('관리자 로그인이 올바르게 작동하는가', async ({ page }) => {
    await page.goto('/auth');
    
    // 로그인 정보 입력
    await page.fill('input[placeholder="관리자 ID"]', 'admin');
    await page.fill('input[placeholder="비밀번호"]', 'LinkAdmin2024!@#');
    
    // 로그인 버튼 클릭
    await page.click('text=관리자 로그인');
    
    // 성공 메시지 확인
    await expect(page.locator('text=관리자 로그인 성공!')).toBeVisible();
    
    // 대시보드로 리디렉션 되는지 확인 (1초 후)
    await page.waitForTimeout(1100);
    await expect(page).toHaveURL('/dashboard');
  });
});