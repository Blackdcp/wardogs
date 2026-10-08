import {TaskLink} from "@/components/ui/task-link";
import {HubHeader} from "@/components/ui/hub-header";
import {SectionHeading} from "@/components/ui/section-heading";
import {MessageSquareWarning, Rss} from "lucide-react";
import {publicRoutePath} from "@/lib/public-url";
import type {Locale} from "@/config/site";
import type {GuideSummary} from "@/content/guides";
import {TOOL_GROUPS, TOOL_REGISTRY} from "@/features/tools/tool-registry";

type ToolHubProps = {locale: Locale; guides: readonly GuideSummary[]; t: (key: string) => string};

export function ToolHubView({locale, guides, t}: ToolHubProps) {
  const bySlug = new Map(guides.map((guide) => [guide.slug, guide]));
  return (
    <main>
      <HubHeader title={t("toolsHub.title")} description={t("toolsHub.description")}>
          <nav className="mt-6 flex flex-wrap gap-3" aria-label={t("toolsHub.title")}>
            {TOOL_GROUPS.map((group) => <TaskLink href={`#tools-${group}`} label={t(`toolsHub.groups.${group}`)} key={group} />)}
          </nav>
          <nav className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-[#7fd0a1]" aria-label={t("toolsHub.communityLinks")}>
            <a className="inline-flex min-h-11 min-w-0 items-center gap-2 hover:text-white" href={publicRoutePath(`/${locale}/contact`)} title={t("toolsHub.feedback")}><MessageSquareWarning aria-hidden="true" className="size-4 shrink-0" /><span className="break-words">{t("toolsHub.feedback")}</span></a>
            <a className="inline-flex min-h-11 min-w-0 items-center gap-2 hover:text-white" href={publicRoutePath("/feed.xml")} type="application/rss+xml" hrefLang="en" title={t("toolsHub.rss")}><Rss aria-hidden="true" className="size-4 shrink-0" /><span className="break-words">{t("toolsHub.rss")}</span></a>
          </nav>
      </HubHeader>
      <div className="site-container py-10">
        <aside className="border border-[#344039] bg-[#111713] p-5">
          <h2 className="font-semibold text-[#d9a93a]">{t("toolsHub.evidenceTitle")}</h2>
          <p className="mt-2 text-sm leading-6 text-[#a8b4ae]">{t("toolsHub.evidenceDescription")}</p>
        </aside>
        {TOOL_GROUPS.map((group) => (
          <section className="scroll-mt-24 py-8" data-tool-group={group} id={`tools-${group}`} key={group} aria-labelledby={`tools-${group}-title`}>
            <SectionHeading id={`tools-${group}-title`} title={t(`toolsHub.groups.${group}`)} />
            <ul className="mt-5 grid gap-4 md:grid-cols-2">
              {TOOL_REGISTRY.filter((tool) => tool.group === group).map((tool) => (
                <li className="border border-[#344039] bg-[#111713] p-5" data-tool-entry={tool.id} key={tool.id}>
                  <h3 className="display-font text-2xl text-white">{t(tool.labelKey)}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#a8b4ae]">{t(tool.descriptionKey)}</p>
                  <div className="mt-4"><TaskLink href={`/${locale}${tool.href}`} label={`${t("toolsHub.openTool")}: ${t(tool.labelKey)}`} variant="primary" hub="tools" task={tool.task} target={tool.href} /></div>
                  <h4 className="mt-5 text-sm font-semibold text-[#d4ddd8]">{t("toolsHub.relatedGuides")}</h4>
                  <ul className="mt-2 space-y-1">
                    {tool.relatedGuideSlugs.map((slug) => {
                      const guide = bySlug.get(slug);
                      if (!guide) throw new Error(`Missing related tool guide: ${slug}`);
                      const href = `/guides/${slug}`;
                      return <li key={slug}><TaskLink href={`/${locale}${href}`} label={guide.title} variant="text" hub="tools" task="guides" target={href} /></li>;
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}

export const ToolHub = ToolHubView;
