import {readFileSync} from "node:fs";
import {join} from "node:path";
import matter from "gray-matter";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {locales} from "../../src/config/site";
import {guideFrontmatterSchema} from "../../src/content/schema";
import {getGoldBudgetCopy, GoldBudgetPanel} from "../../src/components/markets/gold-budget-panel";
import {getMarketCopy} from "../../src/components/markets/market-guide";

const ids = {infantry: "1557282204361560074", sales: "1557626433667600456", gold: "1556534170799448075", soft: "1557821131019395102"};
describe("Discord economy feedback becomes player decisions", () => {
  it.each(locales)("preserves both routes and adds actionable sourced decisions in %s", locale => {
    for (const slug of ["wardogs-money-guide", "wardogs-what-to-buy-before-wipe"]) {
      const raw = readFileSync(join(process.cwd(), "content", locale, "guides", `${slug}.mdx`), "utf8");
      const {data, content} = matter(raw);
      // Existing CJK meta-description limits differ; exercise every other schema field here.
      expect(guideFrontmatterSchema.omit({description: true}).safeParse(data).success, `${locale}/${slug}`).toBe(true);
      expect(data.slug).toBe(slug);
      expect(data.directAnswer.length).toBeGreaterThan(20);
      expect(content).toContain("| --- | --- | --- |");
      expect(content).toContain(`/${locale}/tools/loadout-budget`);
      const expected = slug === "wardogs-money-guide" ? [ids.infantry, ids.sales] : [ids.gold, ids.soft];
      for (const id of expected) {
        expect(content).toContain(id);
        expect(data.sources).toContainEqual(expect.objectContaining({kind: "community", checkedAt: "2026-10-09", url: expect.stringContaining(id)}));
      }
      expect(content).not.toContain("DISCORD");
      expect(content).not.toContain("/LOCALE/");
      expect(content).not.toMatch(/160k|1\.8m|1835|1535|20–25k/);
    }
  });
  it.each(locales)("renders a localized goal/shortfall/quote/reserve process for Gold in %s", locale => {
    const copy = getGoldBudgetCopy(locale);
    expect(copy.steps).toHaveLength(4);
    expect(copy.rows).toHaveLength(3);
    if (locale !== "en") expect(copy.title).not.toBe(getGoldBudgetCopy("en").title);
    const html = renderToStaticMarkup(<GoldBudgetPanel locale={locale} />);
    expect(html).toContain('id="gold-target-budget"');
    expect(html).toContain(`/${locale}/tools/loadout-budget`);
    expect(html).toContain(`/${locale}/guides/wardogs-what-to-buy-before-wipe`);
    expect(copy.example).toContain("120");
    expect(copy.example).toContain("95");
    expect(copy.example).toContain("25");
  });
  it("keeps the Polish interview correction in Polish and removes it from Traditional Chinese", () => {
    expect(getMarketCopy("pl", "gold").evidence).toContain("Przy 32:38");
    expect(getMarketCopy("pl", "gold").checkedLabel).toContain("9 października");
    expect(getMarketCopy("zh-tw", "gold").evidence).not.toMatch(/Przy|twórcy|kosmetyku/);
    expect(getMarketCopy("zh-tw", "gold").evidence).toContain("32:38");
  });
});
