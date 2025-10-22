import { cache } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

import { vietnamInfluencers as fallback } from './vietnamInfluencers';
import type { Platform, VietnamInfluencer } from './vietnamInfluencers';
import { createClient } from '@/lib/supabase/server';
import { hasSupabaseConfig } from '@/lib/supabase/env';
import type { Database } from '@/lib/database.types';

type VietnamInfluencersTable = Database['public']['Tables']['vietnam_influencers']['Row'];

type PlatformPayload = {
  platform?: string | null;
  handle?: string | null;
  followers?: number | null;
  url?: string | null;
};

type MappedInfluencer = VietnamInfluencer;

function isPlatformArray(value: unknown): value is PlatformPayload[] {
  if (!Array.isArray(value)) return false;
  return value.every((item) => typeof item === 'object' && item !== null);
}

function normalize(row: VietnamInfluencersTable): MappedInfluencer | null {
  if (!row.name || !row.id) {
    return null;
  }

  const platformsRaw = row.platforms ?? [];
  const platforms: Platform[] = isPlatformArray(platformsRaw)
    ? platformsRaw.map((platform) => ({
        platform: typeof platform.platform === 'string' ? platform.platform : 'Channel',
        handle: platform.handle ?? '',
        followers: typeof platform.followers === 'number' ? platform.followers : 0,
        url: platform.url ?? '#',
      }))
    : [];

  return {
    id: row.id,
    name: row.name,
    city: row.city ?? 'Vietnam',
    niches: row.niches ?? [],
    languages: row.languages ?? ['Vietnamese'],
    avatar:
      row.avatar_url ??
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
    bio: row.bio ?? '',
    platforms,
    highlightVideo: row.highlight_video_url
      ? {
          url: row.highlight_video_url,
          thumbnail: row.highlight_video_thumbnail,
        }
      : null,
  };
}

async function fetchFromSupabase(): Promise<MappedInfluencer[]> {
  if (!hasSupabaseConfig) {
    return fallback;
  }

  try {
    const supabase = (await createClient()) as SupabaseClient<Database>;
    const { data, error } = await supabase
      .from('vietnam_influencers')
      .select(
        'id, name, city, niches, languages, avatar_url, bio, platforms, highlight_video_url, highlight_video_thumbnail, display_order',
      );

    if (error) {
      console.warn('베트남 인플루언서 데이터를 불러오지 못했습니다. 로컬 데이터를 사용합니다.', error.message);
      return fallback;
    }

    if (!data || data.length === 0) {
      return fallback;
    }

    const sorted = [...data].sort((a, b) => {
      const orderA = a.display_order ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.display_order ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });

    const normalized = sorted
      .map((row) => normalize(row))
      .filter((item): item is MappedInfluencer => Boolean(item));

    return normalized.length > 0 ? normalized : fallback;
  } catch (error) {
    console.warn('Supabase 연결 중 오류가 발생해 로컬 데이터를 사용합니다.', error);
    return fallback;
  }
}

export const getVietnamInfluencers = cache(async () => {
  const dataset = await fetchFromSupabase();
  return dataset;
});
