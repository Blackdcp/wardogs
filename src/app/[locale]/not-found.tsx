import {getTranslations} from "next-intl/server";
import {ButtonLink} from "@/components/ui/button-link";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <main className="site-container flex min-h-[70vh] max-w-3xl flex-col justify-center py-16">
      <p className="font-mono text-sm text-[#d9a93a]">404 / ROUTE NOT FOUND</p>
      <h1 className="display-font mt-4 text-6xl text-white">{t("title")}</h1>
      <p className="mt-6 max-w-xl text-lg leading-8 text-[#a8b4ae]">{t("description")}</p>
      <div className="mt-8 flex flex-wrap gap-3"><ButtonLink href="/">{t("home")}</ButtonLink><ButtonLink href="/guides" variant="secondary">{t("guides")}</ButtonLink></div>
    </main>
  );
}
