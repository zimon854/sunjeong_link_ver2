export type Platform = {
  platform: string;
  handle: string;
  followers: number;
  url: string;
};

export type HighlightVideo = {
  url: string;
  thumbnail?: string | null;
};

export type VietnamInfluencer = {
  id: string;
  name: string;
  city: string;
  niches: string[];
  languages: string[];
  avatar: string;
  bio: string;
  platforms: Platform[];
  highlightVideo?: HighlightVideo | null;
};

export const vietnamInfluencers: VietnamInfluencer[] = [];
