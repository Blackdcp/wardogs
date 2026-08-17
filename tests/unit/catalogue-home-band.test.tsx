import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {CatalogueHomeBandView, type CatalogueHomeBandEntry} from "../../src/components/catalogue/catalogue-home-band";

const entries: CatalogueHomeBandEntry[] = [
  {key: "weapons", title: "Weapons", count: "14 illustrated models", href: "/items/weapons", image: "/images/catalogue/banners/weapons-1280.webp", imageAlt: "WARDOGS weapons catalogue", layout: "feature", imageFit: "cover"},
  {key: "vehicles", title: "Vehicles", count: "20 illustrated vehicles", href: "/items/vehicles", image: "/images/catalogue/banners/vehicles-1280.webp", imageAlt: "WARDOGS vehicles catalogue", layout: "feature", imageFit: "cover"},
  {key: "ammo", title: "Ammo", count: "14 calibres", href: "/items/ammo", image: "/images/catalogue/ammo/556x45mm.webp", imageAlt: "5.56x45mm ammunition box", layout: "compact", imageFit: "contain"},
  {key: "attachments", title: "Attachments", count: "40 illustrated attachments", href: "/items/attachments", image: "/images/catalogue/banners/attachments-1280.webp", imageAlt: "WARDOGS weapon attachments catalogue", layout: "compact", imageFit: "cover"},
  {key: "gear", title: "Gear", count: "11 gear records", href: "/items/gear", image: "/images/catalogue/gear/heavy-armor.webp", imageAlt: "WARDOGS heavy armor", layout: "compact", imageFit: "contain"},
  {key: "loadouts", title: "Loadouts", count: "3 budget bands", href: "/items/loadouts", image: "/images/catalogue/banners/loadouts-1280.webp", imageAlt: "WARDOGS loadout catalogue", layout: "compact", imageFit: "cover"}
];

describe("CatalogueHomeBandView", () => {
  it("renders the six image-backed promoted catalogue links without Equipment", () => {
    const html = renderToStaticMarkup(<CatalogueHomeBandView heading="WARDOGS Catalogue" entries={entries} />);

    expect(html).toContain("WARDOGS Catalogue");
    expect(html.match(/<img/g)).toHaveLength(6);
    for (const entry of entries) {
      expect(html).toContain(`href="${entry.href}"`);
      expect(html).toContain(encodeURIComponent(entry.image));
      expect(html).toContain(entry.title);
      expect(html).toContain(entry.count);
    }
    expect(html).not.toContain("Equipment");
  });
});
