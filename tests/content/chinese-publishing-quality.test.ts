import {readdirSync, readFileSync} from "node:fs";
import path from "node:path";
import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";
import {HOME_CATEGORY_GUIDES, TOP_GUIDE_SLUGS} from "../../src/features/home/home-data";

const criticalAccessSlugs = [
  "wardogs-beta",
  "wardogs-playtest",
  "wardogs-download",
  "wardogs-preload",
  "wardogs-launch-checklist",
  "wardogs-livestream",
] as const;

const coreDecisionSlugs = [
  "wardogs-early-access",
  "wardogs-release-date",
  "wardogs-price",
  "wardogs-system-requirements",
  "wardogs-gameplay",
] as const;

const highTrafficOperationalSlugs = [
  "wardogs-controls",
  "wardogs-towers-guide",
  "wardogs-mortar-guide",
  "wardogs-helicopter-guide",
] as const;

const reviewedStrategySlugs = [
  "wardogs-map",
  "wardogs-money-guide",
  "wardogs-ammo-reload-guide",
  "wardogs-artillery-guide",
  "wardogs-armor-damage-ttk-guide",
  "wardogs-medic-revive-guide",
  "wardogs-squad-guide",
] as const;

const refreshedLongTailSlugs = [
  "wardogs-alpha",
  "wardogs-alpha-key",
  "wardogs-best-settings",
  "wardogs-cargo-guide",
  "wardogs-discord-account-verification",
  "wardogs-equipment-tools-guide",
  "wardogs-factions",
  "wardogs-first-look",
  "wardogs-oil-rig-guide",
  "wardogs-reddit",
  "wardogs-twitch-drops",
  "wardogs-twitter",
] as const;

const brokenTranslationSignals = /官员WARDOGS|什么时候\?WARDOGS|没有WARDOGS|Steam广告|滴滴|揭示的拖车|其他WARDOGS玩家需要先|WARDOGS基本的东西|比赛从8月|没有创建一个活跃的测试|发射平台|发射时间|球员|三支球队|战斗皇家|抽取射击|内存储器|可存储空间|现行预装状态|现在的建构|核实参考价格|首页 首页 首页|没有公众WARDOGS|WARDOGS党派|WARDOGS微信|投降活动|子模式和过度|炼炼炼|大子|油钻和钻钻|为什么位置是无效的|源源发生变化|页面不仅仅是为了/;

describe("Simplified Chinese publishing quality", () => {
  it("keeps the homepage copy natural and deployment-focused", () => {
    const messages = JSON.parse(readFileSync(path.join(process.cwd(), "messages", "zh-cn.json"), "utf8"));
    const homeText = JSON.stringify(messages.home);
    const siteText = JSON.stringify(messages);

    expect(messages.home.status).toBe("Closed Beta 02 正在进行");
    expect(messages.home.priority.title).toBe("这个周末 WARDOGS 玩家最需要的内容");
    expect(messages.home.catalogue.heading).toBe("WARDOGS 图鉴");
    expect(messages.home.catalogue.publishedModels).toBe("已发布的武器与载具条目");
    expect(messages.home.faq.title).toBe("WARDOGS 常见问题");
    expect(homeText).not.toMatch(brokenTranslationSignals);
    expect(siteText).not.toMatch(brokenTranslationSignals);
  });

  it("does not publish broken machine-translated copy on current access pages", async () => {
    for (const slug of criticalAccessSlugs) {
      const guide = await loadGuideDocument("zh-cn", slug);
      const searchable = [
        guide?.frontmatter.title,
        guide?.frontmatter.description,
        ...(guide?.frontmatter.faq.flatMap(({question, answer}) => [question, answer]) ?? []),
        guide?.body,
      ].join("\n");

      expect(searchable, `zh-cn/${slug}`).not.toMatch(brokenTranslationSignals);
      expect(searchable, `zh-cn/${slug}`).toMatch(/[。！？；：]/);
    }
  });

  it("keeps high-traffic decision pages human-readable and source-bounded", async () => {
    for (const slug of coreDecisionSlugs) {
      const guide = await loadGuideDocument("zh-cn", slug);
      const searchable = [
        guide?.frontmatter.title,
        guide?.frontmatter.description,
        ...(guide?.frontmatter.faq.flatMap(({question, answer}) => [question, answer]) ?? []),
        guide?.body,
      ].join("\n");

      expect(guide?.frontmatter.updatedAt, `zh-cn/${slug}`).toBe(
        ["wardogs-release-date", "wardogs-price"].includes(slug) ? "2026-09-04" : "2026-09-01"
      );
      expect(searchable, `zh-cn/${slug}`).not.toMatch(brokenTranslationSignals);
      expect(searchable, `zh-cn/${slug}`).toContain("已确认");
      expect(searchable, `zh-cn/${slug}`).toMatch(/尚未确认|可能调整|版本.*变化|以.*为准/);
      expect(guide?.frontmatter.sources.length, `zh-cn/${slug}`).toBeGreaterThanOrEqual(2);
    }
  });

  it("requires an explicit draft-only override before bulk translation can replace Chinese content", () => {
    const generator = readFileSync(path.join(process.cwd(), "scripts", "generate-zh-cn-content.py"), "utf8");

    expect(generator).toContain("ALLOW_ZH_CN_DRAFT_GENERATION");
    expect(generator).toContain("DRAFT ONLY");
  });

  it("keeps high-traffic operational guides manually reviewed and build-bounded", async () => {
    for (const slug of highTrafficOperationalSlugs) {
      const guide = await loadGuideDocument("zh-cn", slug);
      const searchable = [
        guide?.frontmatter.title,
        guide?.frontmatter.description,
        ...(guide?.frontmatter.faq.flatMap(({question, answer}) => [question, answer]) ?? []),
        guide?.body,
      ].join("\n");

      expect(guide?.frontmatter.updatedAt, `zh-cn/${slug}`).toBe(slug === "wardogs-controls" ? "2026-09-04" : "2026-09-01");
      expect(searchable, `zh-cn/${slug}`).not.toMatch(brokenTranslationSignals);
      expect(searchable, `zh-cn/${slug}`).toContain("版本相关");
      expect(guide?.frontmatter.sources.length, `zh-cn/${slug}`).toBeGreaterThanOrEqual(3);
      expect(guide?.body.length, `zh-cn/${slug}`).toBeGreaterThanOrEqual(2_200);
    }
  });

  it("keeps the refreshed strategy cluster sourced and version-bounded", async () => {
    for (const slug of reviewedStrategySlugs) {
      const guide = await loadGuideDocument("zh-cn", slug);
      const searchable = [
        guide?.frontmatter.title,
        guide?.frontmatter.description,
        ...(guide?.frontmatter.faq.flatMap(({question, answer}) => [question, answer]) ?? []),
        guide?.body,
      ].join("\n");

      expect(guide?.frontmatter.updatedAt, `zh-cn/${slug}`).toBe("2026-09-01");
      expect(searchable, `zh-cn/${slug}`).not.toMatch(brokenTranslationSignals);
      expect(searchable, `zh-cn/${slug}`).toContain("版本相关");
      expect(guide?.frontmatter.sources.length, `zh-cn/${slug}`).toBeGreaterThanOrEqual(2);
      expect(guide?.body.length, `zh-cn/${slug}`).toBeGreaterThanOrEqual(1_700);
    }
  });

  it("keeps refreshed long-tail search pages human-readable and sourced", async () => {
    for (const slug of refreshedLongTailSlugs) {
      const guide = await loadGuideDocument("zh-cn", slug);
      const searchable = [
        guide?.frontmatter.title,
        guide?.frontmatter.description,
        ...(guide?.frontmatter.faq.flatMap(({question, answer}) => [question, answer]) ?? []),
        guide?.body,
      ].join("\n");

      expect(guide?.frontmatter.updatedAt, `zh-cn/${slug}`).toBe(
        [
          "wardogs-alpha",
          "wardogs-alpha-key",
          "wardogs-best-settings",
          "wardogs-discord-account-verification",
          "wardogs-factions",
          "wardogs-twitch-drops",
          "wardogs-twitter",
        ].includes(slug)
          ? "2026-09-04"
          : "2026-09-01"
      );
      expect(searchable, `zh-cn/${slug}`).not.toMatch(brokenTranslationSignals);
      expect(guide?.frontmatter.sources.length, `zh-cn/${slug}`).toBeGreaterThanOrEqual(2);
      expect(guide?.body.length, `zh-cn/${slug}`).toBeGreaterThanOrEqual(1_200);
    }
  });

  it("does not leave known machine-translation failures anywhere in the Chinese guide library", () => {
    const guideDir = path.join(process.cwd(), "content", "zh-cn", "guides");
    for (const filename of readdirSync(guideDir).filter((name) => name.endsWith(".mdx"))) {
      const source = readFileSync(path.join(guideDir, filename), "utf8");
      expect(source, filename).not.toMatch(brokenTranslationSignals);
    }
  });

  it("keeps every homepage-recommended Chinese guide at reviewed publishing quality", async () => {
    const homepageSlugs = new Set([
      ...TOP_GUIDE_SLUGS,
      ...HOME_CATEGORY_GUIDES.map(({slug}) => slug),
    ]);

    for (const slug of homepageSlugs) {
      const guide = await loadGuideDocument("zh-cn", slug);
      const searchable = [
        guide?.frontmatter.title,
        guide?.frontmatter.description,
        ...(guide?.frontmatter.faq.flatMap(({question, answer}) => [question, answer]) ?? []),
        guide?.body,
      ].join("\n");

      expect(searchable, `zh-cn/${slug}`).not.toMatch(brokenTranslationSignals);
      expect(guide?.frontmatter.sources.length, `zh-cn/${slug}`).toBeGreaterThanOrEqual(2);
      expect(guide?.body, `zh-cn/${slug}`).toContain("## 相关攻略");
    }
  });
});
