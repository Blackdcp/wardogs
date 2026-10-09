import {describe, expect, it} from "vitest";
import {locales} from "@/config/site";
import {loadGuideDocument} from "@/content/guides";

const feedbackSources = [
  "https://discord.com/channels/1464219389913071646/1551954554579451924/threads/1557797405125251203",
  "https://discord.com/channels/1464219389913071646/1551954554579451924/threads/1557664355057930352"
];
const responseHeadings = {
  en: "Infantry response: anti-helicopter and anti-armor plan", ja: "歩兵の対ヘリ・対装甲対応手順",
  ru: "Пехота против вертолётов и бронетехники: порядок действий", de: "Infanterie gegen Helikopter und Panzer: ein Einsatzplan",
  "pt-br": "Infantaria contra helicópteros e blindados: plano de resposta", "zh-cn": "步兵反直升机与反装甲行动流程",
  "zh-tw": "步兵反直升機與反裝甲行動流程", pl: "Piechota przeciw śmigłowcom i pancerzowi: plan działania"
};

describe("eight-language anti-air task response", () => {
  it.each(locales)("keeps dated community feedback separate and supplies real next steps in %s", async (locale) => {
    const guide = (await loadGuideDocument(locale, "wardogs-helicopter-guide"))!;
    const section = guide.body.split(`## ${responseHeadings[locale]}\n`)[1]?.split(/^## /m)[0];
    expect(section).toBeTruthy();
    for (const url of feedbackSources) {
      expect(guide.frontmatter.sources.find((source) => source.url === url)).toMatchObject({kind: "community", checkedAt: "2026-10-09"});
      expect(section).toContain(url);
    }
    for (const path of ["/items/weapons/9k333-verba", "/items/weapons/rpg-7", "/tools/map", "/tools/loadout-budget", "/guides/wardogs-cargo-guide", "/guides/wardogs-fob-guide"]) expect(section).toContain(`](/${locale}${path})`);
    expect(section?.match(/^\d\. /gm)).toHaveLength(4);
    // $1200 / 800 m / flare immunity were suggestions, not current game values.
    expect(section).not.toMatch(/\$1[,.]?200|800\s*m|800\s*米|800\s*м/);
  });
});
