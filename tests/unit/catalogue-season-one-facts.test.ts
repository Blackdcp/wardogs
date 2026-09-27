import {describe, expect, it} from "vitest";
import {locales} from "../../src/config/site";
import {getLocalizedCatalogueRecords} from "../../src/features/catalogue/catalogue-localization";
import {getCatalogueRecord} from "../../src/features/catalogue/catalogue-records";
import {getItemBySlug} from "../../src/features/items/item-library";

describe("official Season 1 catalogue facts", () => {
  it("uses Team17's 256 km² battlefield figure in every locale", () => {
    const record = getCatalogueRecord("maps", "battlefield-control-zone");
    expect(record).toBeDefined();
    expect(record?.evidence.sourceUrl).toBe("https://www.team17.com/games/wardogs");
    expect(record?.facts[0]?.value).toBe("Three teams fight across a 256 km² battlefield");

    for (const locale of locales) {
      const localized = getLocalizedCatalogueRecords([record!], locale)[0];
      expect(localized.facts[0]?.value, locale).toMatch(/256/);
      expect(localized.facts[0]?.value, locale).not.toMatch(/16\s*(?:km²|平方公里)/);
      if (locale !== "en") {
        expect(localized.facts[0]?.value, locale).not.toBe(record?.facts[0]?.value);
      }
    }
  });

  it("does not claim supplying is a confirmed cash-reward action", () => {
    const record = getCatalogueRecord("mechanics", "support-rewards");
    expect(record).toBeDefined();
    expect(record?.facts.find((fact) => fact.label === "Rewarded support")?.value).toBe("Revive and transport");
    expect(`${record?.summary} ${record?.facts.map((fact) => fact.value).join(" ")}`).not.toMatch(/supply|supplying/i);
    expect(record?.facts.find((fact) => fact.label === "Objective contribution")?.value).toBe("Control Zone presence");
  });

  it("separates current Driver unlocks from old repeat vehicle prices", () => {
    const dune = getItemBySlug("dune-buggy");
    const ural = getItemBySlug("ural");
    expect(dune).toBeDefined();
    expect(ural).toBeDefined();

    const duneCopy = `${dune?.cautions.join(" ")} ${dune?.unconfirmedFacts?.join(" ")}`;
    expect(duneCopy).toMatch(/Season 1.*Driver level 8/i);
    expect(duneCopy).toMatch(/\$25,000.*unlock/i);
    expect(duneCopy).toMatch(/\$1,500.*(?:purchase|vendor) price.*(?:unverified|unconfirmed)/i);
    expect(duneCopy).not.toMatch(/Driver Level 10 and the \$1,500 price remain unconfirmed/i);

    const uralCopy = `${ural?.cautions.join(" ")} ${ural?.unconfirmedFacts?.join(" ")}`;
    expect(uralCopy).toMatch(/Season 1.*Driver level 3/i);
    expect(uralCopy).toMatch(/\$35,000.*unlock/i);
    expect(uralCopy).toMatch(/\$5,000.*(?:purchase|vendor) price.*(?:unverified|unconfirmed)/i);
    expect(uralCopy).not.toMatch(/\$60,000 unlock and \$5,000 purchase price remain unconfirmed/i);
  });

  it("states Deagle's confirmed Career level without inventing a current vendor price", () => {
    const deagle = getItemBySlug("deagle");
    expect(deagle).toBeDefined();
    const copy = `${deagle?.cautions.join(" ")} ${deagle?.unconfirmedFacts?.join(" ")}`;
    expect(copy).toMatch(/Season 1.*Career level 85/i);
    expect(copy).toMatch(/\$900.*Alpha.*(?:purchase|vendor) price.*(?:unverified|unconfirmed)/i);
    expect(copy).not.toMatch(/progression.*remain unconfirmed for Early Access/i);
  });
});
