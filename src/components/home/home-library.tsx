import {getTranslations} from "next-intl/server";
import type {Locale} from "@/config/site";
import type {DiscoveryDestination} from "@/features/discovery/discovery-types";
import {GUIDE_ROUTES} from "@/features/guides/guide-routes";
import {HomeSectionSentinel} from "@/components/seo/home-section-analytics";
import {SectionHeading} from "@/components/ui/section-heading";
import {Link} from "@/i18n/navigation";

export async function HomeLibrary({locale, destinations}: {locale: Locale; destinations: readonly DiscoveryDestination[]}) {
  const t = await getTranslations({locale});
  return (
    <section data-home-section="library" aria-labelledby="home-library-title" className="border-b border-[#26312c] bg-[#101512] py-8 sm:py-10">
      <HomeSectionSentinel section="library" />
      <div className="site-container">
        <SectionHeading id="home-library-title" title={t("home.discovery.sections.library.title")} description={t("home.discovery.sections.library.description")} />
        <ul className="grid gap-3 md:grid-cols-3">{destinations.filter((destination) => destination.id.startsWith("route-")).map((destination) => {
          const route = GUIDE_ROUTES.find((entry) => destination.id === `route-${entry.key}`)!;
          return <li key={destination.id} data-home-route={route.key}>
            <Link className="block h-full rounded-[6px] border border-[#344039] bg-[#111713] p-4 hover:border-[#79d19c]" href={destination.href} data-home-task={destination.task} data-home-placement="library" title={t(destination.labelKey)}>
              <span className="display-font block text-lg text-white">{t(destination.labelKey)}</span>
              <span className="mt-2 block text-sm leading-6 text-[#a8b4ae]">{t(route.descriptionKey)}</span>
            </Link>
          </li>;
        })}</ul>
        <nav className="mt-4 flex flex-wrap gap-x-5" aria-label={t("home.discovery.sections.library.title")}>{destinations.filter((destination) => !destination.id.startsWith("route-")).map((destination) => (
          <Link className="task-link task-link--text" key={destination.id} href={destination.href} data-home-task={destination.task} data-home-placement="library" title={t(destination.labelKey)}>{t(destination.labelKey)} →</Link>
        ))}</nav>
      </div>
    </section>
  );
}
