import {buildToolRelatedLinks, ToolRelatedGuides} from "@/components/tools/tool-related-guides";
import {ToolPageHeader} from "@/components/tools/tool-page-header";
import {getTranslations} from "next-intl/server";
import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {CashXpCalculator} from "@/components/tools/cash-xp-calculator";
import {isLocale, locales, type Locale} from "@/config/site";
import {buildPageMetadata} from "@/lib/metadata";

type PageProps = {params: Promise<{locale: string}>};

const metadataCopy: Record<Locale, {title: string; description: string; keywords: string}> = {
  en: {
    title: "WARDOGS Cash & XP Calculator",
    description: "Estimate WARDOGS cash and XP from observed rewards, repeat loops, multipliers, kit costs, target cash and target XP without hardcoding unverified payouts.",
    keywords: "WARDOGS cash XP calculator, Wardogs rewards, Wardogs XP farm, Wardogs money calculator, Hot Zone rewards",
  },
  ru: {
    title: "WARDOGS калькулятор денег и XP",
    description: "Оцените деньги и XP WARDOGS по наблюдаемым наградам, повторам, множителям, стоимости комплекта и целям без неподтверждённых таблиц выплат.",
    keywords: "WARDOGS калькулятор денег XP, WARDOGS награды, WARDOGS фарм XP, WARDOGS деньги",
  },
  de: {
    title: "WARDOGS Cash- & XP-Rechner",
    description: "Schätze WARDOGS-Cash und XP mit beobachteten Belohnungen, Wiederholungen, Multiplikatoren, Kit-Kosten und Zielen ohne ungeprüfte Auszahlungstabellen.",
    keywords: "WARDOGS Cash XP Rechner, Wardogs Belohnungen, Wardogs XP farmen, Wardogs Geld Rechner",
  },
  "pt-br": {
    title: "Calculadora de dinheiro e XP de WARDOGS",
    description: "Estime dinheiro e XP de WARDOGS com recompensas observadas, repetições, multiplicadores, custo do kit e metas sem tabelas não confirmadas.",
    keywords: "calculadora WARDOGS dinheiro XP, recompensas WARDOGS, farm XP Wardogs, dinheiro Wardogs",
  },
  ja: {
    title: "WARDOGS Cash & XP 計算機",
    description: "現在のクライアントで観測した報酬、回数、倍率、装備費、目標CashとXPから、未確認の固定表に頼らずWARDOGSの収益を見積もります。",
    keywords: "WARDOGS Cash XP 計算, WARDOGS 報酬, Wardogs XP稼ぎ, Wardogs money calculator",
  },
  "zh-cn": {
    title: "WARDOGS 金钱与 XP 计算器",
    description: "用当前客户端观察到的奖励、次数、倍率、配装成本、目标金钱和目标 XP 估算 WARDOGS 收益，不硬写未确认奖励表。",
    keywords: "WARDOGS 金钱 XP 计算器, Wardogs 收益, Wardogs XP farm, Wardogs 赚钱计算器",
  },
  "zh-tw": {
    title: "WARDOGS 金錢與 XP 計算器",
    description: "用當前客戶端觀察到的獎勵、次數、倍率、配裝成本、目標金錢和目標 XP 估算 WARDOGS 收益，不硬寫未確認獎勵表。",
    keywords: "WARDOGS 金錢 XP 計算器, Wardogs 收益, Wardogs XP farm, Wardogs 賺錢計算器",
  },
  pl: {
    title: "WARDOGS kalkulator gotówki i XP",
    description: "Szacuj gotówkę i XP WARDOGS z obserwowanych nagród, powtórzeń, mnożników, kosztów zestawu i celów bez niepotwierdzonych tabel wypłat.",
    keywords: "WARDOGS kalkulator gotówki XP, nagrody Wardogs, farmienie XP Wardogs, pieniądze Wardogs",
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) return {};
  const copy = metadataCopy[locale];
  return buildPageMetadata(locale, "/tools/cash-xp-calculator", copy.title, copy.description, copy.keywords);
}

export default async function CashXpCalculatorPage({params}: PageProps) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();
  const relatedLinks = await buildToolRelatedLinks("cash-xp-calculator", locale);
  const headerT = await getTranslations({locale: locale, namespace: "nav"});
  const copy = metadataCopy[locale];
  return (
    <main className="site-container py-10 md:py-16">
      <ToolPageHeader toolId="cash-xp-calculator" eyebrow={copy.title} title={copy.title} description={copy.description} actions={[{href: `/${locale}/tools`, label: headerT("toolsHome")}]} />
      <CashXpCalculator locale={locale} />
      <ToolRelatedGuides model={relatedLinks} locale={locale} />
    </main>
  );
}
