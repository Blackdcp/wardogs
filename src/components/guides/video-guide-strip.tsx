import {ArrowRight, PlayCircle} from "lucide-react";
import type {Locale} from "@/config/site";
import {getFeaturedVideoArticles} from "@/features/videos/video-library";
import {videoArticleHref} from "@/components/videos/video-article-card";

export function VideoGuideStrip({locale}: {locale: Locale}) {
  const articles = getFeaturedVideoArticles(4);

  return (
    <section className="border-b border-[#26312c] bg-[#0d0f0e] py-10" aria-labelledby="video-guide-strip-title">
      <div className="site-container">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-[#d9a93a]">Video-Based Guides</p>
            <h2 id="video-guide-strip-title" className="display-font mt-2 text-3xl text-white">Standalone YouTube Breakdowns</h2>
          </div>
          <a href={`/${locale}/videos`} className="inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-[#79d19c] hover:text-white">
            Open video hub
            <ArrowRight aria-hidden="true" className="size-4" />
          </a>
        </div>
        <div className="mt-6 grid gap-px bg-[#2c3631] md:grid-cols-2 xl:grid-cols-4">
          {articles.map((article) => (
            <a href={videoArticleHref(locale, article.slug)} className="group min-h-36 bg-[#151b18] p-4 hover:bg-[#1b241f]" key={article.slug}>
              <span className="inline-flex items-center gap-2 text-xs uppercase text-[#d9a93a]">
                <PlayCircle aria-hidden="true" className="size-4" />
                {article.kind === "official" ? "Official" : "Creator"}
              </span>
              <span className="mt-3 block text-sm font-semibold leading-6 text-[#d7ded9] group-hover:text-[#79d19c]">{article.title}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
