import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // 보호된 경로 목록
  const protectedPaths = ['/dashboard', '/campaigns', '/influencers', '/chat', '/profile']

  // 현재 경로가 보호된 경로인지 확인
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  // 보호된 경로에 접근하려는 경우
  if (isProtectedPath) {
    // 서버에서는 sessionStorage에 접근할 수 없으므로
    // 쿠키를 통해 인증 상태를 확인해야 합니다
    const adminAuth = request.cookies.get('adminAuth')?.value

    if (!adminAuth) {
      // 인증되지 않은 경우 auth 페이지로 리다이렉트
      const url = request.nextUrl.clone()
      url.pathname = '/auth'
      url.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    try {
      // URL 디코딩 후 JSON 파싱
      const decodedAuth = decodeURIComponent(adminAuth)
      const authData = JSON.parse(decodedAuth)
      if (authData.user !== 'admin') {
        // 잘못된 인증 정보인 경우 auth 페이지로 리다이렉트
        const url = request.nextUrl.clone()
        url.pathname = '/auth'
        url.searchParams.set('redirect', request.nextUrl.pathname)
        return NextResponse.redirect(url)
      }
    } catch {
      // JSON 파싱 실패 시 auth 페이지로 리다이렉트
      const url = request.nextUrl.clone()
      url.pathname = '/auth'
      url.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - *.svg, *.png, *.jpg, *.jpeg, *.gif, *.webp (image files)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}