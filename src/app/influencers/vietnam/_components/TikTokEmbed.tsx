"use client";

import React, { useMemo } from 'react';

interface TikTokEmbedProps {
  url: string;
  title: string;
}

function extractVideoId(url: string): string | null {
  const videoMatch = url.match(/video\/([0-9]+)/);
  return videoMatch ? videoMatch[1] : null;
}

export default function TikTokEmbed({ url, title }: TikTokEmbedProps) {
  const videoId = useMemo(() => extractVideoId(url), [url]);

  if (!videoId) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-900 text-sm text-white">
        영상을 불러오지 못했습니다.
      </div>
    );
  }

  const embedUrl = `https://www.tiktok.com/embed/v2/${videoId}`;

  return (
    <iframe
      title={title}
      src={embedUrl}
      allow="autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
      className="h-full w-full rounded-lg border border-gray-200"
    />
  );
}
