import {getTranslations} from "next-intl/server";
import {FaqList, type FaqItem} from "@/components/ui/faq-list";
import {HOME_FAQ_KEYS} from "@/features/home/home-data";

export async function HomeFaq() {
  const t = await getTranslations();
  const items: FaqItem[] = HOME_FAQ_KEYS.map((key) => ({
    question: t(`home.faq.items.${key}.question`),
    answer: t(`home.faq.items.${key}.answer`)
  }));

  return (
    <section aria-labelledby="home-faq-title" className="border-b border-[#26312c] bg-[#0d0f0e] py-16 sm:py-20">
      <div className="site-container grid gap-10 lg:grid-cols-[minmax(260px,0.7fr)_minmax(0,1.3fr)] lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase text-[#d9a93a]">{t("home.faq.eyebrow")}</p>
          <h2 id="home-faq-title" className="display-font mt-3 text-3xl leading-tight text-[#f2f5f3] sm:text-4xl">
            {t("home.faq.title")}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-[#a8b4ae] sm:text-base">{t("home.faq.description")}</p>
        </div>
        <FaqList items={items} />
      </div>
    </section>
  );
}
