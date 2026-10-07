export const INVENTORY_PAGE_TEMPLATES = [
  "home",
  "guides-index",
  "items-index",
  "item-type-index",
  "videos-index",
  "guide-detail",
  "video-detail",
  "item-detail"
] as const;

export const INVENTORY_VIEWPORTS = ["mobile", "tablet", "desktop", "wide"] as const;

export const DISABLED_AD_FORMATS = ["smartlink", "popunder", "social-bar"] as const;

type InventoryPageTemplate = (typeof INVENTORY_PAGE_TEMPLATES)[number];
type InventoryViewport = (typeof INVENTORY_VIEWPORTS)[number];

export type AdInventorySlot = {
  pageTemplate: InventoryPageTemplate;
  viewport: InventoryViewport;
  placement: "inline-primary" | "global-top" | "mobile-sticky" | "left-rail" | "right-rail";
  format: "display" | "native";
  zone: string;
  count: 1;
  section?: "proven-demand" | "database";
};

const ZONES = {
  native: "481d6501bcd0c27b98bc3c4776a26f6e",
  rectangle: "3342dc928824e6ed5c01555e7f9e9e0f",
  horizontal: "c6d1a3e01dc90e01385598a3c84dcaea",
  leaderboard: "035c3a3eb2cdc2bcb65b641e981d4874",
  mobileSticky: "174695845dde18793bf09d3361f8af30",
  leftRail: "f6fc5667adc4cb97634312e962c199c5",
  rightRail: "b2a91c3759bccd2386763c1c71b7d7ad"
} as const;

function slotsFor(pageTemplate: InventoryPageTemplate, viewport: InventoryViewport): AdInventorySlot[] {
  const slots: AdInventorySlot[] = [
    {
      pageTemplate,
      viewport,
      placement: "inline-primary",
      format: "display",
      zone: ZONES.rectangle,
      count: 1,
      ...(pageTemplate === "home" ? {section: "database" as const} : {})
    },
    {
      pageTemplate,
      viewport,
      placement: "inline-primary",
      format: "native",
      zone: ZONES.native,
      count: 1,
      ...(pageTemplate === "home" ? {section: "proven-demand" as const} : {})
    }
  ];

  if (viewport === "mobile") {
    slots.push({
      pageTemplate,
      viewport,
      placement: "mobile-sticky",
      format: "display",
      zone: ZONES.mobileSticky,
      count: 1
    });
  }

  if (pageTemplate !== "home" && viewport === "tablet") {
    slots.push({
      pageTemplate,
      viewport,
      placement: "global-top",
      format: "display",
      zone: ZONES.horizontal,
      count: 1
    });
  }

  if (pageTemplate !== "home" && (viewport === "desktop" || viewport === "wide")) {
    slots.push({
      pageTemplate,
      viewport,
      placement: "global-top",
      format: "display",
      zone: ZONES.leaderboard,
      count: 1
    });
  }

  if (viewport === "wide") {
    slots.push(
      {
        pageTemplate,
        viewport,
        placement: "left-rail",
        format: "display",
        zone: ZONES.leftRail,
        count: 1
      },
      {
        pageTemplate,
        viewport,
        placement: "right-rail",
        format: "display",
        zone: ZONES.rightRail,
        count: 1
      }
    );
  }

  return slots;
}

export const AD_INVENTORY_CONTRACT: readonly AdInventorySlot[] = INVENTORY_PAGE_TEMPLATES.flatMap((pageTemplate) =>
  INVENTORY_VIEWPORTS.flatMap((viewport) => slotsFor(pageTemplate, viewport))
);
