import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";
import {guideManifest} from "../../src/content/manifest";

const locales = ["en", "de", "ru", "pt-br", "ja", "zh-cn"] as const;

describe("weekend current-build accuracy", () => {
  it("uses the anti-cheat name shown on the current Steam listing", async () => {
    for (const locale of locales) {
      const steamGuide = await loadGuideDocument(locale, "wardogs-steam");
      expect(`${steamGuide?.frontmatter.description} ${steamGuide?.body}`, locale).toContain("Elytra");

      for (const {slug} of guideManifest) {
        const guide = await loadGuideDocument(locale, slug);
        if (!guide) continue;
        const published = `${guide.frontmatter.description} ${guide.frontmatter.faq.map(({answer}) => answer).join(" ")} ${guide.body}`;
        expect(published, `${locale}/${slug}`).not.toContain("Easy Anti-Cheat");
      }
    }
  });

  it("routes download readers to the main Early Access app in every language", async () => {
    const staleInstallInstructions = [
      /Während der Closed Beta installieren eingeladene Konten/,
      /Во время Closed Beta приглашённые аккаунты устанавливают/,
      /Durante o Closed Beta, contas convidadas instalam/,
      /Closed Betaではストアではなくライブラリで「WARDOGS Playtest」を検索します/
    ];

    for (const locale of locales) {
      const guide = await loadGuideDocument(locale, "wardogs-download");
      expect(guide, locale).not.toBeNull();
      expect(guide?.body, locale).toContain("1867240");
      for (const staleInstruction of staleInstallInstructions) {
        expect(guide?.body, locale).not.toMatch(staleInstruction);
      }
    }
  });

  it("tests settings against live Early Access combat instead of an ended beta", async () => {
    for (const locale of locales) {
      const guide = await loadGuideDocument(locale, "wardogs-best-settings");
      expect(guide?.body, locale).not.toMatch(/^## .*Beta 02.*$/m);
      expect(guide?.body, locale).toMatch(/Early Access|抢先体验/);
    }
  });

  it("answers the page question before discussing patch history", async () => {
    for (const [slug, answerSignal] of [
      ["wardogs-download", /Steam|install/i],
      ["wardogs-early-access", /Early Access|playable/i],
      ["wardogs-price", /\$39\.99|price/i],
      ["wardogs-release-date", /September 10|release/i],
      ["wardogs-steam", /App(?: ID)? 1867240|Steam app/i],
      ["wardogs-preload", /preload|install/i],
      ["wardogs-known-issues", /crash|server|voice/i],
      ["wardogs-launch-checklist", /launch|install|Steam/i]
    ] as const) {
      const guide = await loadGuideDocument("en", slug);
      const quickAnswer = guide?.body.match(/## Quick Answer\s+([\s\S]*?)(?=\n## |$)/)?.[1] ?? "";
      expect(quickAnswer, slug).toMatch(answerSignal);
      expect(quickAnswer, slug).not.toContain("Patch 0.11 is the latest official patch announcement");
    }
  });
});
