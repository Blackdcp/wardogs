import {getTranslations} from "next-intl/server";
import type {GuideSummary} from "@/content/guides";
import type {Locale} from "@/config/site";
import {getGuideHubCopy, groupGuideCollections} from "@/features/guides/guide-collections";
import {Link} from "@/i18n/navigation";

const tools = [
  {href: "/tools/map", key: "interactiveMap", task: "map"},
  {href: "/tools/artillery-calculator", key: "artilleryCalculator", task: "calculator"},
  {href: "/tools/cash-xp-calculator", key: "cashXpCalculator", task: "money"},
  {href: "/tools/loadout-budget", key: "budgetTool", task: "weapons"},
  {href: "/tools/weapon-compare", key: "weaponCompare", task: "weapons"},
  {href: "/tools/ammo-matcher", key: "ammoMatcher", task: "weapons"},
  {href: "/tools/logistics-planner", key: "logisticsPlanner", task: "logistics"},
  {href: "/tools/progression-route", key: "progressionRoute", task: "progression"},
  {href: "/tools/system-check", key: "systemCheck", task: "pcFixes"}
] as const;
const recoverySlugs = ["wardogs-squad-guide", "wardogs-towers-guide", "wardogs-cargo-guide", "wardogs-helicopter-guide", "wardogs-progression-wipes-guide"];
const linkClass = "block rounded border border-[#344039] bg-[#111713] px-3 py-2 text-sm leading-6 text-[#d7ded9] hover:border-[#79d19c] hover:text-[#79d19c]";

export async function HomeGuideHub({guides, locale}: {guides: GuideSummary[]; locale: Locale}) {
  const t = await getTranslations();
  const copy = getGuideHubCopy(locale);
  const bySlug = new Map(guides.map((guide) => [guide.slug, guide]));
  return (
    <section className="border-b border-[#26312c] bg-[#101512] py-8 sm:py-10" data-home-section="guide-hub" aria-labelledby="home-guide-hub-title">
      <div className="site-container space-y-6">
        {locale === "ja" && (
          <div data-home-recovery="ja">
            <h2 className="display-font text-2xl text-white">{copy.recovery}</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {recoverySlugs.flatMap((slug) => {
                const guide = bySlug.get(slug);
                return guide ? [<li key={slug}><Link className={linkClass} href={`/guides/${slug}`} title={guide.title} data-home-task={slug.includes("progression") ? "progression" : "logistics"} data-home-placement="recovery">{guide.title}</Link></li>] : [];
              })}
            </ul>
          </div>
        )}
        <div data-home-tools>
          <h2 className="display-font text-2xl text-white">{copy.tools}</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => {
              const label = t(`nav.${tool.key}`);
              return <li key={tool.key}><Link className={linkClass} href={tool.href} title={label} data-home-task={tool.task} data-home-placement="tools">{label}</Link></li>;
            })}
          </ul>
        </div>
        <div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><h2 id="home-guide-hub-title" className="display-font text-2xl text-white">{copy.title}</h2><p className="mt-2 text-sm text-[#a8b4ae]">{copy.description}</p></div>
            <Link className="text-sm text-[#79d19c]" href="/guides" title={t("nav.allGuides")} data-home-task="guides" data-home-placement="collections">{t("nav.allGuides")} ({guides.length}) →</Link>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {groupGuideCollections(guides).map((collection) => (
              <div className="rounded border border-[#344039] bg-[#111713] p-3" key={collection.key}>
                <Link className="font-semibold text-[#79d19c]" href={`/guides#collection-${collection.key}`} title={copy.collections[collection.key]} data-home-task="guides" data-home-placement="collections">{copy.collections[collection.key]} ({collection.guides.length}) →</Link>
                <ul className="mt-2 space-y-1">
                  {collection.guides.slice(0, 3).map((guide) => <li key={guide.slug}><Link className="block py-1 text-sm leading-5 text-[#d7ded9] hover:text-[#79d19c]" href={`/guides/${guide.slug}`} title={guide.title} data-home-task="guides" data-home-placement="collections">{guide.title}</Link></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#79d19c]">
            <Link href="/videos" title={t("nav.videos")} data-home-task="videos" data-home-placement="collections">{t("nav.videos")} →</Link>
            <Link href="/news" title={t("nav.news")} data-home-task="season2" data-home-placement="collections">{t("nav.news")} →</Link>
            <Link href="/about" title={t("home.aboutTitle")} data-home-task="about" data-home-placement="collections">{t("home.aboutTitle")} →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
