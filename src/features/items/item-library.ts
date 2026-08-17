import type {Locale} from "@/config/site";
import {getCatalogueRecords} from "@/features/catalogue/catalogue-records";
import {
  gameplayVideo,
  mortarsVideo,
  officialSteam,
  officialTeam17,
  sevenThingsVideo,
  type ItemSource
} from "./item-sources";
import {vehicleItems} from "./vehicle-items";
import {weaponItems} from "./weapon-items";

export type ItemTypeId = "weapons" | "vehicles" | "ammo" | "attachments" | "gear" | "equipment" | "loadouts";
export type ItemStatus = "official" | "verified-in-game" | "pre-release-build" | "community-report";
export type EvidenceLevel = "Official" | "Creator Footage" | "Pre-release Build";

export type ItemType = {
  id: ItemTypeId;
  label: string;
  description: string;
  href: `/items/${ItemTypeId}`;
};

export type ItemFact = {
  label: string;
  value: string;
  evidence: EvidenceLevel[];
};

export type WardogsItem = {
  slug: string;
  name: string;
  type: ItemTypeId;
  subtype: string;
  status: ItemStatus;
  statusLabel: string;
  build: string;
  summary: string;
  description: string;
  role: string;
  strengths: string[];
  cautions: string[];
  facts: ItemFact[];
  relatedGuides: string[];
  relatedItems: string[];
  sources: ItemSource[];
  detailImage?: string;
  detailImageAlt?: string;
  observedPrice?: string;
  observedProgressionOrGate?: string;
  observedAmmoOrVehicleClass?: string;
  confirmedFacts?: readonly string[];
  unconfirmedFacts?: readonly string[];
  detailUpdatedAt?: string;
  priority: number;
  indexLocales: readonly Extract<Locale, "en" | "ru">[];
};

export type IndexableItemPath = {
  locale: Extract<Locale, "en" | "ru">;
  type: ItemTypeId;
  slug: string;
};

export const itemTypes: readonly ItemType[] = [
  {
    id: "weapons",
    label: "Weapons",
    description: "Firearms and indirect-fire tools observed in official or creator WARDOGS material.",
    href: "/items/weapons"
  },
  {
    id: "vehicles",
    label: "Vehicles",
    description: "Transport, armor, and air assets that shape movement and battlefield pressure.",
    href: "/items/vehicles"
  },
  {
    id: "ammo",
    label: "Ammo",
    description: "Calibres, load types, Alpha prices, and the weapons associated with each round.",
    href: "/items/ammo"
  },
  {
    id: "attachments",
    label: "Attachments",
    description: "Optics and magazines with observed magnification, weight, capacity, and price data.",
    href: "/items/attachments"
  },
  {
    id: "gear",
    label: "Gear",
    description: "Helmet, armor, backpack, and wearable-slot choices recorded from the Alpha build.",
    href: "/items/gear"
  },
  {
    id: "equipment",
    label: "Equipment",
    description: "Deployable support tools and tactical systems that affect logistics and objectives.",
    href: "/items/equipment"
  },
  {
    id: "loadouts",
    label: "Loadouts",
    description: "Budget-first kit planning for a persistent balance that does not simply reset after a loss.",
    href: "/items/loadouts"
  }
] as const;

const legacyItemLibrary: readonly WardogsItem[] = [
  {
    slug: "mortar",
    name: "Mortar",
    type: "weapons",
    subtype: "Indirect fire",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Creator footage checked 2026-08-16",
    summary: "Indirect-fire pressure tool for clustered rooftops, towers, FOB defenses, and static objective fights.",
    description:
      "The Mortar is the first WARDOGS weapon-style item worth a standalone page because footage shows it creating real search interest. Treat the page as a tactical guide to conditions, counters, and evidence rather than a final stat sheet.",
    role: "Use Mortars to convert teammate callouts into pressure and force enemies off predictable positions.",
    strengths: [
      "Punishes clustered players on rooftops, towers, and obvious objective lanes.",
      "Can soften FOB defenses before infantry or vehicle pressure arrives.",
      "Rewards squads that communicate target marks and correction calls."
    ],
    cautions: [
      "Final damage, reload timing, ammo limits, and unlock rules are not confirmed.",
      "A Mortar crew can be pressured if enemies locate the firing position.",
      "Weak information makes shots speculative instead of reliable."
    ],
    facts: [
      {label: "Combat role", value: "Indirect fire pressure", evidence: ["Creator Footage", "Pre-release Build"]},
      {label: "Best targets", value: "Static clusters, rooftops, towers, FOB defenses", evidence: ["Creator Footage"]},
      {label: "Key support", value: "Spotting, distance correction, supply", evidence: ["Creator Footage", "Pre-release Build"]},
      {label: "Final balance", value: "Not confirmed", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-factions", "wardogs-playtest"],
    relatedItems: ["mobile-fob", "tank"],
    sources: [mortarsVideo, sevenThingsVideo, officialSteam],
    priority: 1,
    indexLocales: ["en", "ru"]
  },
  {
    slug: "mobile-fob",
    name: "Mobile FOB",
    type: "equipment",
    subtype: "Deployable base",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Creator footage checked 2026-08-16",
    summary: "Deployable Forward Operating Base that anchors supplies, spawn pressure, defenses, and Hot Zone control.",
    description:
      "Mobile FOBs are WARDOGS' clearest strategy-layer item. They connect logistics, terrain, supply runs, defenses, and objective pressure, which makes them stronger content than a thin equipment stub.",
    role: "Place FOBs where teammates can resupply, defend, receive deliveries, and contest nearby pressure.",
    strengths: [
      "Creates a forward point for ammo, bandages, materials, and team momentum.",
      "Can support defensive upgrades such as walls, trenches, mortars, and anti-air tools in pre-release footage.",
      "Turns terrain and delivery access into meaningful strategy decisions."
    ],
    cautions: [
      "FOBs need teammate supply and maintenance instead of self-sustaining forever.",
      "Bad placement can expose deliveries and make the FOB expensive to defend.",
      "Exact build menu, upgrade costs, and final rules are not confirmed."
    ],
    facts: [
      {label: "System role", value: "Forward logistics and defense point", evidence: ["Creator Footage", "Pre-release Build"]},
      {label: "Placement needs", value: "Terrain, cover, delivery room, route access", evidence: ["Creator Footage"]},
      {label: "Team dependency", value: "Requires supplies and defense", evidence: ["Creator Footage"]},
      {label: "Final upgrade list", value: "Not confirmed", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-first-look", "wardogs-playtest"],
    relatedItems: ["mortar", "armored-transport"],
    sources: [sevenThingsVideo, officialSteam, officialTeam17],
    priority: 2,
    indexLocales: ["en", "ru"]
  },
  {
    slug: "littlebird",
    name: "Littlebird",
    type: "vehicles",
    subtype: "Light helicopter",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Creator footage checked 2026-08-16",
    summary: "Fast helicopter-style vehicle for scouting, insertion, repositioning, and sudden pressure.",
    description:
      "Littlebird-style helicopter footage gives players a practical vehicle page before the full vehicle database is ready. The useful angle is mobility and risk, not final armor or weapon statistics.",
    role: "Move squads, scout pressure, and reposition quickly when ground routes are too slow or contested.",
    strengths: [
      "Fast repositioning across large battle spaces.",
      "Useful for scouting and inserting teammates near pressure points.",
      "Creates vertical awareness demands for both pilots and ground squads."
    ],
    cautions: [
      "Final handling, durability, seat count, and weapon fit are not confirmed.",
      "Air vehicles can draw attention quickly in large fights.",
      "Bad landings can turn transport value into a squad wipe."
    ],
    facts: [
      {label: "Vehicle role", value: "Light air mobility", evidence: ["Creator Footage", "Pre-release Build"]},
      {label: "Best use", value: "Scouting, insertion, fast rotation", evidence: ["Creator Footage"]},
      {label: "Main risk", value: "Exposure during approach and landing", evidence: ["Creator Footage"]},
      {label: "Final loadout", value: "Not confirmed", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-first-look", "wardogs-steam"],
    relatedItems: ["attack-helicopter", "armored-transport"],
    sources: [gameplayVideo, sevenThingsVideo, officialSteam],
    priority: 3,
    indexLocales: ["en", "ru"]
  },
  {
    slug: "tank",
    name: "Tank",
    type: "vehicles",
    subtype: "Heavy armor",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Creator footage checked 2026-08-16",
    summary: "Heavy vehicle pressure source for breaking lanes, threatening clustered positions, and forcing infantry to respect armor.",
    description:
      "The Tank page should teach how heavy armor changes a WARDOGS fight without inventing final armor values. It is a battlefield-role page first and a stat page later.",
    role: "Use tanks to pressure exposed lanes and support objective pushes where infantry alone cannot hold ground.",
    strengths: [
      "Forces enemy infantry to change routes or commit counter-pressure.",
      "Can shape open-ground fights and support a push into contested space.",
      "Pairs naturally with supply and infantry screens."
    ],
    cautions: [
      "Final armor, damage, crew count, and economy costs are not confirmed.",
      "A tank without infantry support can become isolated.",
      "Terrain and anti-vehicle pressure may limit safe routes."
    ],
    facts: [
      {label: "Vehicle role", value: "Heavy armor pressure", evidence: ["Creator Footage", "Pre-release Build"]},
      {label: "Best support", value: "Infantry screen and logistics", evidence: ["Creator Footage"]},
      {label: "Main risk", value: "Isolation from the team", evidence: ["Pre-release Build"]},
      {label: "Final stats", value: "Not confirmed", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-price", "wardogs-early-access"],
    relatedItems: ["mortar", "armored-transport"],
    sources: [sevenThingsVideo, officialSteam, officialTeam17],
    priority: 4,
    indexLocales: ["en", "ru"]
  },
  {
    slug: "attack-helicopter",
    name: "Attack Helicopter",
    type: "vehicles",
    subtype: "Air support",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Creator footage checked 2026-08-16",
    summary: "Air-support vehicle that can turn open movement, rooftop pressure, and objective pushes into high-risk moments.",
    description:
      "Attack helicopter coverage should stay focused on battlefield impact and counterplay until official launch data confirms exact weapons and durability.",
    role: "Create pressure from above, punish exposed movement, and force enemies to think about anti-air defense.",
    strengths: [
      "Controls sightlines that ground squads may ignore.",
      "Can punish grouped movement and exposed vehicles.",
      "Makes anti-air planning more valuable around FOBs."
    ],
    cautions: [
      "Final weapon systems, health, and countermeasure details are not confirmed.",
      "Air support depends on pilot skill and battlefield awareness.",
      "Anti-air tools may quickly change the value of aggressive flight paths."
    ],
    facts: [
      {label: "Vehicle role", value: "Air support pressure", evidence: ["Creator Footage", "Pre-release Build"]},
      {label: "Natural counter", value: "Anti-air coverage and pressure", evidence: ["Creator Footage"]},
      {label: "Best targets", value: "Exposed movement and clustered fights", evidence: ["Creator Footage"]},
      {label: "Final weapons", value: "Not confirmed", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-first-look", "wardogs-playtest"],
    relatedItems: ["littlebird", "mobile-fob"],
    sources: [sevenThingsVideo, gameplayVideo, officialSteam],
    priority: 5,
    indexLocales: ["en", "ru"]
  },
  {
    slug: "armored-transport",
    name: "Armored Transport",
    type: "vehicles",
    subtype: "Protected transport",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Creator footage checked 2026-08-16",
    summary: "Protected movement option for carrying players and supplies through dangerous routes.",
    description:
      "Armored transport is a good early vehicle item because it links WARDOGS' logistics pitch with real match needs: moving bodies, supplies, and pressure without relying on foot travel.",
    role: "Move teammates and supplies toward contested areas while reducing open-road exposure.",
    strengths: [
      "Supports squad rotations and frontline reinforcement.",
      "Can make supply runs safer than exposed foot movement.",
      "Fits WARDOGS' support-role and logistics-heavy identity."
    ],
    cautions: [
      "Final seat count, armor, cargo behavior, and price are not confirmed.",
      "Predictable road travel can still be ambushed.",
      "Transport only matters if the squad arrives where it is needed."
    ],
    facts: [
      {label: "Vehicle role", value: "Protected transport", evidence: ["Creator Footage", "Pre-release Build"]},
      {label: "Best use", value: "Squad movement and supply support", evidence: ["Creator Footage"]},
      {label: "Main risk", value: "Predictable routes", evidence: ["Pre-release Build"]},
      {label: "Final capacity", value: "Not confirmed", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-early-access", "wardogs-steam"],
    relatedItems: ["mobile-fob", "tank"],
    sources: [sevenThingsVideo, officialSteam, officialTeam17],
    priority: 6,
    indexLocales: ["en", "ru"]
  }
] as const;

export const itemLibrary: readonly WardogsItem[] = [...legacyItemLibrary, ...weaponItems, ...vehicleItems];

export function getItemType(type: string): ItemType | undefined {
  return itemTypes.find((itemType) => itemType.id === type);
}

export function getItemsByType(type: ItemTypeId): WardogsItem[] {
  return itemLibrary.filter((item) => item.type === type && item.indexLocales.length > 0).sort((a, b) => a.priority - b.priority);
}

export function getStandaloneItemsByType(type: ItemTypeId): WardogsItem[] {
  if (type === "equipment" || type === "loadouts") return getItemsByType(type);

  const publishedSlugs = new Set(
    getCatalogueRecords(type)
      .filter((record) => record.detailStatus === "published")
      .map((record) => record.slug)
  );

  return getItemsByType(type).filter((item) => !publishedSlugs.has(item.slug));
}

export function getItemBySlug(slug: string): WardogsItem | undefined {
  return itemLibrary.find((item) => item.slug === slug);
}

export function getItemByTypeAndSlug(type: string, slug: string): WardogsItem | undefined {
  const itemType = getItemType(type);
  if (!itemType) return undefined;
  return itemLibrary.find((item) => item.type === itemType.id && item.slug === slug);
}

export function getFeaturedItems(limit = 6): WardogsItem[] {
  return itemLibrary.filter((item) => item.indexLocales.length > 0).sort((a, b) => a.priority - b.priority).slice(0, limit);
}

export function getRelatedItems(item: WardogsItem, locale: Extract<Locale, "en" | "ru">): WardogsItem[] {
  return item.relatedItems
    .map((slug) => getItemBySlug(slug))
    .filter((related): related is WardogsItem => related !== undefined && related.indexLocales.includes(locale));
}

export function getIndexableItemPaths(): IndexableItemPath[] {
  return itemLibrary.flatMap((item) => item.indexLocales.map((locale) => ({locale, type: item.type, slug: item.slug})));
}
