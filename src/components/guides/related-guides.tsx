import {ArrowRight} from "lucide-react";
import type {Locale} from "@/config/site";
import type {GuideSummary} from "@/content/guides";
import {buildRelatedGuideHref, getGuideRelatedVideoLinks} from "@/features/guides/related";
import {SeasonTaskPath} from "@/components/releases/season-task-path";
import {TaskLink} from "@/components/ui/task-link";
import {getVideoUi} from "@/features/videos/video-ui";

export function RelatedGuides({guides, locale, title, path}: {guides: GuideSummary[]; locale: Locale; title: string; path?: string}) {
  const videos = path?.startsWith("/guides/") ? getGuideRelatedVideoLinks(locale, path.slice("/guides/".length)) : [];
  return (
    <section className="site-container py-14" aria-labelledby="related-title">
      {path && <SeasonTaskPath locale={locale} path={path} />}
      <h2 className="display-font text-3xl text-white" id="related-title">{title}</h2>
      <div className="mt-6 grid gap-px bg-[#2c3631] md:grid-cols-3">
        {guides.map((guide) => (
          <a className="group min-h-40 bg-[#171d1a] p-5 hover:bg-[#1d2722]" href={buildRelatedGuideHref(locale, guide.slug)} key={guide.slug} title={guide.title}>
            <span className="text-xs uppercase text-[#68bd8d]">{guide.category}</span>
            <span className="display-font mt-3 block text-xl leading-tight text-white">{guide.title}</span>
            <ArrowRight aria-hidden="true" className="mt-5 text-[#68bd8d] transition group-hover:translate-x-1" size={18} />
          </a>
        ))}
      </div>
      {videos.length ? <nav className="mt-6 border-t border-[#344039] pt-5" aria-label={getVideoUi(locale).readBreakdown} data-guide-related-videos>
        <p className="text-sm font-semibold text-white">{getVideoUi(locale).readBreakdown}</p>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {videos.map((video) => <li className="min-w-0" key={video.slug}><TaskLink href={`/${locale}/videos/${video.slug}`} label={video.title} variant="text" /></li>)}
        </ul>
      </nav> : null}
    </section>
  );
}
