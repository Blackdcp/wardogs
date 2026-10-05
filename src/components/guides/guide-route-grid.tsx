import {TaskLink} from "@/components/ui/task-link";
import {SectionHeading} from "@/components/ui/section-heading";
import type {ResolvedGuideRoute} from "@/features/guides/guide-routes";

export function GuideRouteGrid({routes, t}: {routes: readonly ResolvedGuideRoute[]; t: (key: string) => string}) {
  return (
    <section className="site-container py-10 md:py-12" aria-labelledby="guide-routes-title">
      <SectionHeading id="guide-routes-title" title={t("guides.routes.title")} />
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {routes.map((route) => (
          <article className="scroll-mt-24 border border-[#344039] bg-[#111713] p-5" id={`route-${route.key}`} data-guide-route={route.key} key={route.key}>
            <h3 className="display-font text-2xl text-white">{t(route.titleKey)}</h3>
            <p className="mt-3 text-sm leading-6 text-[#a8b4ae]">{t(route.descriptionKey)}</p>
            <ol className="mt-5 list-decimal space-y-1 pl-5 text-[#79d19c]">
              {route.guides.map(({guide, href}) => <li key={guide.slug}><TaskLink href={href} label={guide.title} variant="text" hub="guides" task="guides" target={`/guides/${guide.slug}`} /></li>)}
            </ol>
            <h4 className="mt-5 text-sm font-semibold text-white">{t("guides.routes.relatedTools")}</h4>
            <ul className="mt-2 space-y-1">
              {route.tools.map(({tool, href}) => <li key={tool.id}><TaskLink href={href} label={t(tool.labelKey)} variant="text" hub="guides" task={tool.task} target={tool.href} /></li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
