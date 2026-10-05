import {getTranslations} from "next-intl/server";
import type {Locale} from "@/config/site";
import type {ToolDefinition} from "@/features/tools/tool-registry";
import {HomeSectionSentinel} from "@/components/seo/home-section-analytics";
import {SectionHeading} from "@/components/ui/section-heading";
import {Link} from "@/i18n/navigation";

export async function HomeToolWorkbench({locale, tools}: {locale: Locale; tools: readonly ToolDefinition[]}) {
  const t = await getTranslations({locale});
  return (
    <section data-home-section="workbench" aria-labelledby="home-tools-title" className="border-b border-[#26312c] bg-[#0b0e0c] py-8 sm:py-10">
      <HomeSectionSentinel section="workbench" />
      <div className="site-container">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionHeading id="home-tools-title" title={t("home.discovery.sections.workbench.title")} description={t("home.discovery.sections.workbench.description")} />
          <Link className="task-link task-link--text mb-6" href="/tools" data-home-task="tools" data-home-placement="workbench" title={t("home.discovery.actions.allTools")}>{t("home.discovery.actions.allTools")} →</Link>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{tools.slice(0, 4).map((tool) => (
          <li key={tool.id} data-featured-tool={tool.id}>
            <Link className="block h-full rounded-[6px] border border-[#344039] bg-[#111713] p-4 hover:border-[#79d19c]" href={tool.href} data-home-task={tool.task} data-home-placement="workbench" title={t(tool.labelKey)}>
              <span className="display-font block text-lg leading-6 text-white">{t(tool.labelKey)}</span>
              <span className="mt-2 block text-sm leading-6 text-[#a8b4ae]">{t(tool.descriptionKey)}</span>
            </Link>
          </li>
        ))}</ul>
      </div>
    </section>
  );
}
