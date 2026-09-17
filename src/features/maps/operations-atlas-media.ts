import type {AtlasVisualState} from "./operations-atlas";

export type OperationsAtlasMediaSource = {
  recordId: string;
  image: string;
  state: Exclude<AtlasVisualState, "pending">;
  sourceUrl: string;
  sourceLabel: string;
  retrievedAt: string;
  usageNote: string;
};

export const operationsAtlasMediaSources: Readonly<Record<string, OperationsAtlasMediaSource>> = {
  "battlefield-control-zone": {
    recordId: "battlefield-control-zone",
    image: "/images/catalogue/banners/map-1280.webp",
    state: "contextual",
    sourceUrl: "https://store.steampowered.com/app/1867240/WARDOGS/",
    sourceLabel: "Official WARDOGS Steam battlefield material",
    retrievedAt: "2026-09-17",
    usageNote: "A category-level battlefield banner used only as orientation context; it is not presented as an object image or fixed tactical map.",
  },
  "fob-network": {
    recordId: "fob-network",
    image: "/images/guide-discovery/equipment-tools.webp",
    state: "contextual",
    sourceUrl: "https://www.team17.com/hubfs/WARDOGS%20-%20Press%20Kit%20%28Aug%2026%29.zip",
    sourceLabel: "Team17 WARDOGS Press Kit (Aug 2026)",
    retrievedAt: "2026-08-30",
    usageNote: "Official field-combat frame used only as context for FOB planning; it does not depict a verified FOB layout.",
  },
  "cargo-route": {
    recordId: "cargo-route",
    image: "/images/catalogue/vehicles/ural.webp",
    state: "contextual",
    sourceUrl: "https://www.youtube.com/watch?v=ZFRrDSru7Kg",
    sourceLabel: "Every WARDOGS Vehicle Explained - approved creator footage",
    retrievedAt: "2026-08-18",
    usageNote: "The Ural is object-matched, but this reuse is contextual for a route workflow and does not verify a particular route or capacity.",
  },
  "mortar-support": {
    recordId: "mortar-support",
    image: "/images/catalogue/vehicles/l81-mortar.webp",
    state: "verified",
    sourceUrl: "https://www.youtube.com/watch?v=kg46BZ1H2W0",
    sourceLabel: "WARDOGS Building 101",
    retrievedAt: "2026-09-01",
    usageNote: "The cited 01:16 frame visibly matches the L81 mortar, sandbag pit, and ENTER Mortar interaction.",
  },
  "helicopter-transport": {
    recordId: "helicopter-transport",
    image: "/images/wardogs-helicopter.jpg",
    state: "contextual",
    sourceUrl: "https://www.youtube.com/watch?v=wcsY2EeIlyc",
    sourceLabel: "WARDOGS helicopter basic guide",
    retrievedAt: "2026-08-29",
    usageNote: "Cockpit frame used only as transport context; it does not verify a route, landing zone, handling value, or current control binding.",
  },
};

export function getOperationsAtlasMediaSource(recordId: string): OperationsAtlasMediaSource | undefined {
  return operationsAtlasMediaSources[recordId];
}
