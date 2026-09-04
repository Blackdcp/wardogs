"use client";

import Image from "next/image";
import {useState} from "react";
import {videoThumbnailUrl} from "@/features/videos/video-thumbnail";

const fallbackThumbnail = "/images/catalogue/banners/thegame-1280.webp";

export function VideoThumbnailImage({alt, eager, youtubeId}: {alt: string; eager: boolean; youtubeId: string}) {
  const [useFallback, setUseFallback] = useState(false);

  return (
    <Image
      alt={alt}
      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
      data-thumbnail-fallback={useFallback ? "local" : "youtube"}
      fill
      loading={eager ? "eager" : "lazy"}
      onError={() => setUseFallback(true)}
      sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
      src={useFallback ? fallbackThumbnail : videoThumbnailUrl(youtubeId)}
      unoptimized
    />
  );
}
