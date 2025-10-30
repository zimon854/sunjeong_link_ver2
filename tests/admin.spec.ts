import { test, expect } from '@playwright/test';

test.describe('관리자 대시보드 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 관리자로 로그인
    await page.goto('/auth');
    await page.fill('input[placeholder="관리자 ID"]', 'admin');
    await page.fill('input[placeholder="비밀번호"]', 'LinkAdmin2024!@#');
    await page.click('text=관리자 로그인');
    await page.waitForURL('/dashboard');
  });

  test('대시보드 페이지가 올바르게 로드되는가', async ({ page }) => {
    // 페이지 제목 확인
    await expect(page).toHaveTitle(/대시보드/);
    
    // 환영 메시지 확인
    await expect(page.locator('text=환영합니다, 관리자님!')).toBeVisible();
    
    // 프로필 이미지 확인
    const profileImage = page.locator('img[alt="관리자"]');
    await expect(profileImage).toBeVisible();
  });

  test('캠페인 관리 섹션이 표시되는가', async ({ page }) => {
    // 내 캠페인 섹션 확인
    await expect(page.locator('text=내 캠페인')).toBeVisible();
    
    // 참여한 캠페인 섹션 확인
    await expect(page.locator('text=참여한 캠페인')).toBeVisible();
    
    // 캠페인 항목들 확인
    await expect(page.locator('text=비건 뷰티 마스크팩')).toBeVisible();
    await expect(page.locator('text=프리미엄 헤어오일')).toBeVisible();
    await expect(page.locator('text=친환경 주방세제 런칭')).toBeVisible();
  });

  test('빠른 메뉴가 올바르게 작동하는가', async ({ page }) => {
    // 빠른 메뉴 섹션 확인
    await expect(page.locator('text=빠른 메뉴')).toBeVisible();
    
    // 각 메뉴 항목 확인
    await expect(page.locator('text=캠페인 생성')).toBeVisible();
    await expect(page.locator('text=캠페인 목록')).toBeVisible();
    await expect(page.locator('text=내 프로필')).toBeVisible();
    await expect(page.locator('text=메시지')).toBeVisible();
    await expect(page.locator('text=성과 대시보드')).toBeVisible();
    
    // 내 프로필 링크 클릭 테스트
    await page.click('text=내 프로필');
    await expect(page).toHaveURL('/profile');
  });

  test('알림 섹션이 표시되는가', async ({ page }) => {
    // 최근 알림 섹션 확인
    await expect(page.locator('text=최근 알림')).toBeVisible();
    
    // 알림 항목들 확인
    await expect(page.locator('text=캠페인 \'비건 뷰티 마스크팩\'이 승인되었습니다.')).toBeVisible();
    await expect(page.locator('text=새로운 메시지가 도착했습니다.')).toBeVisible();
  });

  test('로그아웃이 올바르게 작동하는가', async ({ page }) => {
    // 로그아웃 버튼 클릭
    await page.click('text=로그아웃');
    
    // 홈페이지로 리디렉션되는지 확인
    await expect(page).toHaveURL('/');
    
    // 관리자 로그인 버튼이 다시 표시되는지 확인
    await expect(page.locator('text=관리자 로그인')).toBeVisible();
  });
});

test.describe('프로필 페이지 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 관리자로 로그인하고 프로필 페이지로 이동
    await page.goto('/auth');
    await page.fill('input[placeholder="관리자 ID"]', 'admin');
    await page.fill('input[placeholder="비밀번호"]', 'LinkAdmin2024!@#');
    await page.click('text=관리자 로그인');
    await page.waitForURL('/dashboard');
    await page.goto('/profile');
  });

  test('프로필 페이지가 올바르게 표시되는가', async ({ page }) => {
    // 페이지 제목 확인
    await expect(page).toHaveTitle(/프로필/);
    
    // 프로필 정보 확인
    await expect(page.locator('text=관리자')).toBeVisible();
    await expect(page.locator('text=admin@linkable.com')).toBeVisible();
    
    // 주요 실적 섹션 확인
    await expect(page.locator('text=주요 실적')).toBeVisible();
    await expect(page.locator('text=진행 캠페인')).toBeVisible();
    await expect(page.locator('text=총 매출')).toBeVisible();
    await expect(page.locator('text=평균 전환율')).toBeVisible();
    await expect(page.locator('text=리뷰 평점')).toBeVisible();
  });

  test('프로필 수정이 올바르게 작동하는가', async ({ page }) => {
    // 프로필 수정 버튼 클릭
    await page.click('text=프로필 수정');
    
    // 수정 모드가 활성화되는지 확인
    await expect(page.locator('text=취소')).toBeVisible();
    await expect(page.locator('text=저장하기')).toBeVisible();
    
    // 입력 필드가 활성화되는지 확인
    const nameInput = page.locator('input').first();
    await expect(nameInput).toBeEditable();
    
    // 취소 버튼 테스트
    await page.click('text=취소');
    await expect(page.locator('text=프로필 수정')).toBeVisible();
  });
});

test.describe('캠페인 페이지 테스트', () => {
  test('캠페인 목록 페이지 접근 테스트', async ({ page }) => {
    await page.goto('/campaigns');
    
    // 로그인하지 않은 상태에서도 접근 가능한지 확인
    await expect(page.locator('text=캠페인')).toBeVisible();
  });
});

test.describe('접근성 테스트', () => {
  test('키보드 네비게이션이 올바르게 작동하는가', async ({ page }) => {
    await page.goto('/');
    
    // 탭 키로 네비게이션 테스트
    await page.keyboard.press('Tab');
    
    // 첫 번째 포커스 가능한 요소가 포커스되는지 확인
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('이미지에 적절한 alt 텍스트가 있는가', async ({ page }) => {
    await page.goto('/');
    
    // 로고 이미지 alt 텍스트 확인
    const logoImage = page.locator('img[alt="선정링크 로고"]');
    await expect(logoImage).toBeVisible();
    
    // 파트너 로고들의 alt 텍스트 확인
    const partnerImages = page.locator('img[alt="Shopify"], img[alt="Q10"], img[alt="TikTok"], img[alt="Instagram"]');
    await expect(partnerImages.first()).toBeVisible();
  });
});