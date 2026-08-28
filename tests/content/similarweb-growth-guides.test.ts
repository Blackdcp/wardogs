import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";
import {TOP_GUIDE_SLUGS} from "../../src/features/home/home-data";
import {videoArticles} from "../../src/features/videos/video-library";
import sitemap from "../../src/app/sitemap";

const locales = ["en", "de", "ru", "pt-br", "ja"] as const;
const newGuideSlugs = [
  "wardogs-map",
  "wardogs-best-settings",
  "wardogs-system-requirements",
  "wardogs-controls"
] as const;
const requiredHeadings = {
  en: ["Quick Answer", "Confirmed Facts", "What Players Search For", "How to Use This Guide", "FAQ", "Sources and Last Checked", "Related Guides"],
  ru: ["Краткий ответ", "Подтверждённые факты", "Что ищут игроки", "Как пользоваться этим руководством", "Частые вопросы", "Источники и последняя проверка", "Связанные руководства"],
  de: ["Kurzantwort", "Bestätigte Fakten", "Wonach Spieler suchen", "So nutzt du diesen Guide", "Häufige Fragen", "Quellen und letzte Prüfung", "Verwandte Guides"],
  "pt-br": ["Resposta rápida", "Fatos confirmados", "O que os jogadores pesquisam", "Como usar este guia", "Perguntas frequentes", "Fontes e última verificação", "Guias relacionados"]
} as const;

describe("Similarweb growth guide cluster", () => {
  it("publishes four substantial, sourced guides in every supported locale", async () => {
    for (const locale of locales) {
      for (const slug of newGuideSlugs) {
        const guide = await loadGuideDocument(locale, slug);

        expect(guide, `${locale}/${slug} should exist`).not.toBeNull();
        expect(guide?.frontmatter.updatedAt).toBe(slug === "wardogs-controls" ? "2026-08-26" : "2026-08-23");
        expect(guide?.frontmatter.faq.length).toBeGreaterThanOrEqual(3);
        expect(guide?.frontmatter.faq.length).toBeLessThanOrEqual(5);
        expect(guide?.frontmatter.sources.length).toBeGreaterThan(0);
        expect(guide?.body.length).toBeGreaterThanOrEqual(locale === "ja" ? 1_200 : 1_800);

        if (locale === "ja") {
          expect(guide?.body.match(/^## /gm)?.length, `${locale}/${slug}`).toBeGreaterThanOrEqual(6);
        } else {
          for (const heading of requiredHeadings[locale]) {
            expect(guide?.body, `${locale}/${slug} missing ${heading}`).toContain(`## ${heading}`);
          }
        }
      }
    }
  });

  it("answers the high-intent English questions with verified facts", async () => {
    const requirements = await loadGuideDocument("en", "wardogs-system-requirements");
    const settings = await loadGuideDocument("en", "wardogs-best-settings");
    const controls = await loadGuideDocument("en", "wardogs-controls");
    const map = await loadGuideDocument("en", "wardogs-map");

    expect(requirements).not.toBeNull();
    expect(settings).not.toBeNull();
    expect(controls).not.toBeNull();
    expect(map).not.toBeNull();

    for (const fact of ["Windows 10", "16 GB RAM", "GTX 1660", "RTX 3070", "50 GB", "60fps"]) {
      expect(requirements?.body).toContain(fact);
    }
    for (const fact of ["Potato Mode", "Overkill Mode", "60 FPS", "official requirements", "official performance devlog"]) {
      expect(settings?.body).toContain(fact);
    }
    for (const topic of ["controller", "keyboard", "keybinds", "HOTAS", "parachute"]) {
      expect(controls?.body.toLowerCase()).toContain(topic.toLowerCase());
    }
    for (const fact of ["Control Zone", "2x2km", "tower terminal", "Hot Zone", "FOB"]) {
      expect(map?.body).toContain(fact);
    }
  });

  it("uses the official beta server hours in every localized playtest and beta guide", async () => {
    for (const locale of locales) {
      for (const slug of ["wardogs-playtest", "wardogs-beta"] as const) {
        const guide = await loadGuideDocument(locale, slug);
        const searchable = `${guide?.frontmatter.faq.map(({question, answer}) => `${question} ${answer}`).join("\n")}\n${guide?.body}`;

        expect(searchable, `${locale}/${slug} missing opening time`).toContain("17:00 UTC");
        expect(searchable, `${locale}/${slug} missing closing time`).toContain("02:00 UTC");
        expect(guide?.frontmatter.sources).toContainEqual(expect.objectContaining({
          url: "https://steamcommunity.com/app/1867240/announcements/",
          kind: "official"
        }));
      }
    }
  });

  it("attributes the performance modes to the official BULKHEAD devlog", async () => {
    for (const locale of locales) {
      const guide = await loadGuideDocument(locale, "wardogs-best-settings");

      expect(guide?.frontmatter.sources).toContainEqual(expect.objectContaining({
        url: "https://www.linkedin.com/posts/bulkhead_new-devlog-level-design-performance-activity-7483535791831478273-9DOJ",
        kind: "official"
      }));
      expect(guide?.body).toContain("Potato Mode");
      expect(guide?.body).toContain("Overkill Mode");
      expect(guide?.body).toMatch(/60\+? FPS/i);
    }
  });

  it("keeps the settings video page distinct from the maintained settings guide", async () => {
    const guide = await loadGuideDocument("en", "wardogs-best-settings");
    const video = videoArticles.find(({slug}) => slug === "wardogs-best-settings");

    expect(video).toBeDefined();
    expect(video?.internalGuideSlug).toBe("wardogs-best-settings");
    expect(video?.title).not.toBe(guide?.frontmatter.title);
    expect(video?.description).toMatch(/video|creator|source-specific/i);
    expect(video?.quickAnswer).toMatch(/video|creator|source/i);
  });

  it("documents the official gamepad mention without inventing a fixed layout", async () => {
    const supportPhrases = {
      en: /official[^.]*gamepad support|gamepad support[^.]*official/i,
      de: /offiziell[^.]*Gamepad|Gamepad[^.]*offiziell/i,
      ru: /официальн[^.]*геймпад|геймпад[^.]*официальн/i,
      "pt-br": /oficial[^.]*gamepad|gamepad[^.]*oficial/i,
      ja: /公式[^。]*ゲームパッド|ゲームパッド[^。]*公式/i
    } as const;

    for (const locale of locales) {
      const guide = await loadGuideDocument(locale, "wardogs-controls");

      expect(guide?.frontmatter.sources).toContainEqual(expect.objectContaining({
        url: "https://steamcommunity.com/app/1867240/announcements/",
        kind: "official"
      }));
      expect(guide?.body).toMatch(supportPhrases[locale]);
    }
  });

  it("upgrades existing ranking pages around the exact player questions", async () => {
    const expectations = new Map([
      ["wardogs-playtest", ["When is the next WARDOGS playtest?", "How long does the WARDOGS playtest last?", "How do I get WARDOGS playtest access?"]],
      ["wardogs-beta", ["When is the next WARDOGS beta?", "Is WARDOGS open beta or closed beta?"]],
      ["wardogs-release-date", ["When does WARDOGS come out?", "When is WARDOGS releasing?"]],
      ["wardogs-steam", ["/guides/wardogs-system-requirements", "/guides/wardogs-best-settings"]]
    ]);

    for (const [slug, phrases] of expectations) {
      const guide = await loadGuideDocument("en", slug);
      expect(["2026-08-23", "2026-08-24", "2026-08-25", "2026-08-26", "2026-08-28"]).toContain(guide?.frontmatter.updatedAt);
      for (const phrase of phrases) expect(guide?.body).toContain(phrase);
    }

    const ps5 = await loadGuideDocument("en", "wardogs-ps5");
    expect(ps5?.frontmatter.updatedAt).toBe("2026-08-23");
    expect(ps5?.frontmatter.title).toBe("WARDOGS PS5 & Xbox Release: Console Status");
    expect(ps5?.body).toContain("not confirmed");
  });

  it("promotes the strongest commercial and growth pages without expanding the block", () => {
    expect(TOP_GUIDE_SLUGS).toHaveLength(12);
    expect(TOP_GUIDE_SLUGS).toEqual(expect.arrayContaining([
      "wardogs-release-date",
      "wardogs-steam",
      "wardogs-best-settings"
    ]));
  });

  it("includes every new localized route in the sitemap", () => {
    const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
    const paths = new Set(sitemap().map(({url}) => {
      const pathname = new URL(url).pathname;
      const routePath = basePath && pathname.startsWith(`${basePath}/`)
        ? pathname.slice(basePath.length)
        : pathname;
      return routePath.length > 1 ? routePath.replace(/\/$/, "") : routePath;
    }));

    for (const locale of locales) {
      for (const slug of newGuideSlugs) {
        expect(paths).toContain(`/${locale}/guides/${slug}`);
      }
    }
  });
});
