import type {Locale} from "@/config/site";
import {getCatalogueRecords} from "@/features/catalogue/catalogue-records";
import type {CatalogueRecord} from "@/features/catalogue/catalogue-types";
import {
  gameplayVideo,
  mortarsVideo,
  officialSteam,
  officialTeam17,
  sevenThingsVideo,
  vehiclesCatalogueVideo,
  weaponsCatalogueVideo,
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
  image?: string;
  imageAlt?: string;
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
  image?: string;
  imageAlt?: string;
  priority: number;
  indexLocales: readonly Locale[];
};

export type IndexableItemPath = {
  locale: Locale;
  type: ItemTypeId;
  slug: string;
};

export const itemTypes: readonly ItemType[] = [
  {
    id: "weapons",
    label: "Weapons",
    description: "Firearms and indirect-fire tools observed in official or creator WARDOGS material.",
    href: "/items/weapons",
    image: "/images/items/catalog-weapons.jpg",
    imageAlt: "WARDOGS weapons"
  },
  {
    id: "vehicles",
    label: "Vehicles",
    description: "Transport, armor, and air assets that shape movement and battlefield pressure.",
    href: "/items/vehicles",
    image: "/images/items/catalog-vehicles.jpg",
    imageAlt: "WARDOGS vehicles"
  },
  {
    id: "ammo",
    label: "Ammo",
    description: "Calibres, load types, Alpha prices, and the weapons associated with each round.",
    href: "/items/ammo",
    image: "/images/items/catalog-ammo.jpg",
    imageAlt: "WARDOGS ammo"
  },
  {
    id: "attachments",
    label: "Attachments",
    description: "Optics and magazines with observed magnification, weight, capacity, and price data.",
    href: "/items/attachments",
    image: "/images/items/catalog-attachments.jpg",
    imageAlt: "WARDOGS optics and magazines"
  },
  {
    id: "gear",
    label: "Gear",
    description: "Helmet, armor, backpack, and wearable-slot choices recorded from the Alpha build.",
    href: "/items/gear",
    image: "/images/items/catalog-gear.jpg",
    imageAlt: "WARDOGS gear"
  },
  {
    id: "equipment",
    label: "Equipment",
    description: "Deployable support tools and tactical systems that affect logistics and objectives.",
    href: "/items/equipment",
    image: "/images/items/catalog-equipment.jpg",
    imageAlt: "WARDOGS support equipment"
  },
  {
    id: "loadouts",
    label: "Loadouts",
    description: "Budget-first kit planning for a persistent balance that does not simply reset after a loss.",
    href: "/items/loadouts",
    image: "/images/items/catalog-loadouts.jpg",
    imageAlt: "WARDOGS loadout planning"
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
    build: "Creator footage checked 2026-08-25",
    detailUpdatedAt: "2026-08-25",
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
    relatedGuides: ["wardogs-fob-guide", "wardogs-mortar-guide", "wardogs-helicopter-guide"],
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

const detailedCatalogueItems: readonly WardogsItem[] = [...weaponItems, ...vehicleItems];
const detailedCatalogueSlugs = new Set(detailedCatalogueItems.map((item) => `${item.type}/${item.slug}`));

const statusByEvidenceTier: Record<CatalogueRecord["evidenceTier"], ItemStatus> = {
  official: "official",
  "build-capture": "verified-in-game",
  "corroborated-community": "community-report",
  "identifier-only": "community-report",
};

const evidenceByTier: Record<CatalogueRecord["evidenceTier"], EvidenceLevel[]> = {
  official: ["Official"],
  "build-capture": ["Pre-release Build"],
  "corroborated-community": ["Creator Footage", "Pre-release Build"],
  "identifier-only": ["Pre-release Build"],
};

function catalogueRecordToItem(record: CatalogueRecord, priority: number): WardogsItem {
  const facts = record.facts.map((fact) => ({...fact, evidence: evidenceByTier[record.evidenceTier]}));
  const knownFacts = record.facts.filter((fact) => !/Not captured|Identifier only/.test(fact.value));
  const relatedItems = getCatalogueRecords(record.type)
    .filter((candidate) => candidate.slug !== record.slug && candidate.subtype === record.subtype && candidate.detailStatus === "published")
    .slice(0, 3)
    .map((candidate) => candidate.slug);

  return {
    slug: record.slug,
    name: record.name,
    type: record.type,
    subtype: record.subtype,
    status: statusByEvidenceTier[record.evidenceTier],
    statusLabel: record.evidenceTier.split("-").map((part) => `${part[0].toUpperCase()}${part.slice(1)}`).join(" "),
    build: record.dataAsOf,
    summary: record.summary,
    description: `${record.summary} This record separates observed pre-release facts from unknown Early Access balance and will be updated when a newer first-party or directly visible build confirms changes.`,
    role: `Use the ${record.name} for its observed ${record.subtype.toLowerCase()} role only when the squad can support its ammunition, replacement cost, and current objective.`,
    strengths: [
      `${record.name} has a documented place in the pre-release catalogue rather than an inferred real-world role.`,
      `Its visible ${record.subtype.toLowerCase()} classification makes it comparable with records in the same catalogue filter.`,
      "Unknown fields remain visible, which prevents an old test-build value from becoming a permanent recommendation.",
    ],
    cautions: [
      "Pre-release price, handling, damage, availability, and unlock conditions can change before or during Early Access.",
      "A catalogue identifier does not prove final attachment, ammunition, or progression compatibility.",
      "Use the Build label on every fact before comparing this record with newer footage.",
    ],
    facts,
    relatedGuides: record.type === "weapons"
      ? ["wardogs-gameplay", "wardogs-money-guide", "wardogs-ammo-reload-guide"]
      : ["wardogs-gameplay", "wardogs-cargo-guide", "wardogs-beginner-guide"],
    relatedItems,
    sources: [
      officialSteam,
      officialTeam17,
      record.type === "weapons" ? weaponsCatalogueVideo : vehiclesCatalogueVideo,
    ],
    detailImage: record.mediaState === "pending" ? undefined : record.image,
    detailImageAlt: record.mediaState === "pending" ? undefined : record.imageAlt,
    observedPrice: record.facts.find((fact) => /price/.test(fact.label.toLowerCase()))?.value,
    observedProgressionOrGate: record.facts.find((fact) => fact.label === "Progression" || fact.label === "Observed gate")?.value,
    observedAmmoOrVehicleClass: record.facts.find((fact) => fact.label === "Ammunition" || fact.label === "Role")?.value,
    confirmedFacts: [
      `Evidence tier: ${record.evidenceTier}.`,
      ...record.sourceNotes,
      ...knownFacts.map((fact) => `Observed in ${record.dataAsOf}: ${fact.label}: ${fact.value}`),
    ],
    unconfirmedFacts: [
      `Final Early Access and release values for ${record.name} remain unconfirmed.`,
      "Damage, handling, price, availability, and compatibility can change with a new Build.",
    ],
    detailUpdatedAt: "2026-08-30",
    priority,
    indexLocales: ["en", "ru", "de", "pt-br", "ja", "zh-cn"],
  };
}

const generatedCatalogueItems = (["weapons", "vehicles"] as const)
  .flatMap((type) => getCatalogueRecords(type))
  .filter((record) => record.detailStatus === "published" && !detailedCatalogueSlugs.has(`${record.type}/${record.slug}`))
  .map((record, index) => catalogueRecordToItem(record, 500 + index));

export const itemLibrary: readonly WardogsItem[] = [
  ...legacyItemLibrary,
  ...detailedCatalogueItems,
  ...generatedCatalogueItems,
].map((item) => ({
  ...item,
  indexLocales: ["en", "ru", "de", "pt-br", "ja", "zh-cn"] as const,
  relatedGuides: [...new Set([
    ...(item.type === "weapons" ? ["wardogs-best-weapons-loadouts", "wardogs-armor-damage-ttk-guide"] : []),
    ...(item.type === "vehicles" ? ["wardogs-equipment-tools-guide"] : []),
    ...(item.type === "ammo" ? ["wardogs-armor-damage-ttk-guide", "wardogs-best-weapons-loadouts"] : []),
    ...(item.type === "attachments" ? ["wardogs-best-weapons-loadouts", "wardogs-equipment-tools-guide"] : []),
    ...(item.type === "gear" ? ["wardogs-armor-damage-ttk-guide", "wardogs-medic-revive-guide"] : []),
    ...(item.type === "equipment" ? ["wardogs-equipment-tools-guide"] : []),
    ...(item.type === "loadouts" ? ["wardogs-best-weapons-loadouts"] : []),
    ...item.relatedGuides,
  ])].slice(0, 5),
}));

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

export function getRelatedItems(item: WardogsItem, locale: Locale): WardogsItem[] {
  return item.relatedItems
    .map((slug) => getItemBySlug(slug))
    .filter((related): related is WardogsItem => related !== undefined && related.indexLocales.includes(locale));
}

export function getIndexableItemPaths(): IndexableItemPath[] {
  return itemLibrary.flatMap((item) => item.indexLocales.map((locale) => ({locale, type: item.type, slug: item.slug})));
}
