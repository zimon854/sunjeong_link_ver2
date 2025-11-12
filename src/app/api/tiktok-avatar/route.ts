import { NextRequest, NextResponse } from 'next/server';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36';
const REFERER = 'https://www.tiktok.com/';
const DETAIL_ENDPOINT = 'https://www.tiktok.com/api/user/detail/?aid=1988&uniqueId=';
const CACHE_CONTROL_HEADER = 's-maxage=43200, stale-while-revalidate=604800';
const FALLBACK_BASE = 'https://unavatar.io/tiktok/';

type TikTokDetailResponse = {
  userInfo?: {
    user?: {
      avatarLarger?: string;
      avatarMedium?: string;
      avatarThumb?: string;
    };
  };
};

function extractTikTokUsernameFromUrl(profileUrl: string | null): string | null {
  if (!profileUrl) {
    return null;
  }

  try {
    const parsed = new URL(profileUrl);
    const match = parsed.pathname.match(/@([^/]+)/);
    if (match && match[1]) {
      return match[1];
    }
  } catch {
    return null;
  }

  return null;
}

function sanitizeTikTokUsername(raw: string | null): string | null {
  if (!raw) {
    return null;
  }

  const normalized = raw.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  const safe = normalized.replace(/[^a-z0-9._]/g, '');
  return safe.length > 0 ? safe : null;
}

async function resolveAvatarUrl(username: string): Promise<string | null> {
  const detailUrl = DETAIL_ENDPOINT + encodeURIComponent(username);

  try {
    const response = await fetch(detailUrl, {
      headers: {
        'User-Agent': USER_AGENT,
        Referer: REFERER,
        Accept: 'application/json, text/plain, */*',
      },
      next: {
        revalidate: 60 * 60 * 6,
      },
    });

    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';
    if (!contentType.includes('application/json')) {
      return null;
    }

    const rawPayload = await response.text();
    if (!rawPayload || rawPayload.trim().length === 0) {
      return null;
    }

    let parsed: TikTokDetailResponse | null = null;

    try {
      parsed = JSON.parse(rawPayload) as TikTokDetailResponse;
    } catch (parseError) {
      console.error('Failed to parse TikTok avatar payload', parseError);
      return null;
    }

    const { avatarLarger, avatarMedium, avatarThumb } = parsed?.userInfo?.user ?? {};

    return avatarLarger ?? avatarMedium ?? avatarThumb ?? null;
  } catch (error) {
    console.error('Failed to fetch TikTok avatar details', error);
    return null;
  }
}

function buildRedirectResponse(location: string, status: number): NextResponse {
  return new NextResponse(null, {
    status,
    headers: {
      Location: location,
      'Cache-Control': CACHE_CONTROL_HEADER,
    },
  });
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const usernameParam = searchParams.get('username');
  const profileUrlParam = searchParams.get('profileUrl');

  const username = sanitizeTikTokUsername(
    usernameParam ?? extractTikTokUsernameFromUrl(profileUrlParam),
  );

  if (!username) {
    return NextResponse.json({ error: 'Missing or invalid TikTok username.' }, { status: 400 });
  }

  const avatarUrl = await resolveAvatarUrl(username);

  if (avatarUrl) {
    return buildRedirectResponse(avatarUrl, 302);
  }

  const fallbackUrl = FALLBACK_BASE + encodeURIComponent(username);
  return buildRedirectResponse(fallbackUrl, 302);
}
