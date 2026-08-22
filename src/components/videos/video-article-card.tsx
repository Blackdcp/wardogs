import {ArrowRight, PlayCircle} from "lucide-react";
import Image from "next/image";
import type {Locale} from "@/config/site";
import type {VideoArticle} from "@/features/videos/video-library";
import {videoThumbnailUrl} from "@/features/videos/video-thumbnail";

export function videoArticleHref(locale: Locale, slug: string) {
  return `/${locale}/videos/${slug}`;
}

export {videoThumbnailUrl};

export function VideoArticleCard({article, locale, eager = false}: {article: VideoArticle; locale: Locale; eager?: boolean}) {
  return (
    <a
      href={videoArticleHref(locale, article.slug)}
      className="group flex min-h-64 flex-col overflow-hidden border border-[#2c3631] bg-[#151b18] transition-colors hover:border-[#4d946d] hover:bg-[#1b241f]"
    >
      <span className="relative block aspect-video overflow-hidden border-b border-[#2c3631] bg-[#0d100e]">
        <Image
          alt={`${article.sourceLabel} thumbnail`}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          fill
          loading={eager ? "eager" : "lazy"}
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          src={videoThumbnailUrl(article.youtubeId)}
          unoptimized
        />
        <span className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
        <span className="absolute bottom-3 left-3 inline-flex size-10 items-center justify-center bg-[#d9a93a] text-[#111512]" aria-hidden="true">
          <PlayCircle className="size-5" />
        </span>
      </span>
      <span className="flex flex-1 flex-col justify-between p-5">
        <span>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-[#d9a93a]">
            <PlayCircle aria-hidden="true" className="size-4" />
            {article.kind === "official" ? "Official video" : "Creator footage"}
          </span>
          <span className="display-font mt-4 block text-2xl leading-tight text-white">{article.title}</span>
          <span className="mt-4 block text-sm leading-6 text-[#a8b4ae]">{article.quickAnswer}</span>
        </span>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#79d19c]">
          Read video breakdown
          <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </span>
    </a>
  );
}
