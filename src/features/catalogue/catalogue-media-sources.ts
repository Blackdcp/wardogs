import type {CatalogueMediaState, CatalogueRecord} from "./catalogue-types";
import type {ItemTypeId} from "@/features/items/item-library";

export type CatalogueCategoryMediaKey = ItemTypeId | "hub";

type CatalogueMediaSourceBase = {
  recordKey?: string;
  additionalRecordKeys?: readonly string[];
  image: string;
  approvedState: Exclude<CatalogueMediaState, "pending">;
  assetKind: "object" | "contextual";
  sourceLabel: string;
  capturedAt?: string;
  retrievedAt: string;
  usageNote: string;
  categoryKeys?: readonly CatalogueCategoryMediaKey[];
};

export type CatalogueMediaSource = CatalogueMediaSourceBase & (
  | {origin: "external-capture"; sourceUrl: string}
  | {origin: "owner-asset-pack"; sourceUrl?: never}
);

type ObjectSourceBase = Omit<Extract<CatalogueMediaSource, {origin: "external-capture"}>, "recordKey" | "image" | "approvedState" | "assetKind" | "usageNote">;
type ObjectApproval = readonly [recordKey: string, image: string, objectLabel: string];

const weaponCatalogueSource: ObjectSourceBase = {
  origin: "external-capture",
  sourceUrl: "https://www.youtube.com/watch?v=9mSvZyAk62E",
  sourceLabel: "Every Weapon Tested in WARDOGS - approved creator catalogue footage",
  capturedAt: "Item-specific catalogue sequence",
  retrievedAt: "2026-08-18",
};

const vehicleCatalogueSource: ObjectSourceBase = {
  origin: "external-capture",
  sourceUrl: "https://www.youtube.com/watch?v=ZFRrDSru7Kg",
  sourceLabel: "Every WARDOGS Vehicle Explained - approved creator catalogue footage",
  capturedAt: "Item-specific vehicle sequence",
  retrievedAt: "2026-08-18",
};

const nonObjectSpecificCatalogueSourceUrls = new Set([
  "https://www.youtube.com/watch?v=-k6IV0ITLDo",
]);

function approveObjects(base: ObjectSourceBase, approvals: readonly ObjectApproval[]): CatalogueMediaSource[] {
  return approvals.map(([recordKey, image, objectLabel]) => ({
    ...base,
    recordKey,
    image,
    approvedState: "verified",
    assetKind: "object",
    usageNote: `The local image is approved only for ${recordKey}; the visible object was matched to ${objectLabel} in the cited source.`,
  }));
}

const weaponApprovals = approveObjects(weaponCatalogueSource, [
  ["weapons/a-91", "/images/catalogue/weapons/a-91.webp", "A-91"],
  ["weapons/ak74", "/images/catalogue/weapons/ak74.webp", "AK74"],
  ["weapons/amp-9", "/images/catalogue/weapons/amp-9.webp", "AMP-9"],
  ["weapons/amr-50", "/images/catalogue/weapons/amr-50.webp", "AMR 50"],
  ["weapons/bmr-308", "/images/catalogue/weapons/bmr-308.webp", "BMR-308"],
  ["weapons/bushmaster-m17s", "/images/catalogue/weapons/bushmaster-m17s.webp", "Bushmaster M17S"],
  ["weapons/compound-bow", "/images/catalogue/weapons/compound-bow.webp", "Compound Bow"],
  ["weapons/deagle", "/images/catalogue/weapons/deagle.webp", "Deagle"],
  ["weapons/fal", "/images/catalogue/weapons/fal.webp", "FAL"],
  ["weapons/galil", "/images/catalogue/weapons/galil.webp", "Galil"],
  ["weapons/ggx-17", "/images/catalogue/weapons/ggx-17.webp", "GGX 17"],
  ["weapons/ggx-18", "/images/catalogue/weapons/ggx-18.webp", "GGX 18"],
  ["weapons/judge", "/images/catalogue/weapons/judge.webp", "Judge"],
  ["weapons/kh-2002", "/images/catalogue/weapons/kh-2002.webp", "KH-2002"],
  ["weapons/m4", "/images/catalogue/weapons/m4.webp", "M4"],
  ["weapons/t-21", "/images/catalogue/weapons/t-21.webp", "T-21"],
  ["weapons/m249-saw", "/images/catalogue/weapons/m249-saw.webp", "M249 SAW"],
  ["weapons/pkm", "/images/catalogue/weapons/pkm.webp", "PKM"],
  ["weapons/sks", "/images/catalogue/weapons/sks.webp", "SKS"],
  ["weapons/svd", "/images/catalogue/weapons/svd.webp", "SVD"],
  ["weapons/m1911", "/images/catalogue/weapons/m1911.webp", "M1911"],
  ["weapons/m500", "/images/catalogue/weapons/m500.webp", "M500"],
  ["weapons/mp43", "/images/catalogue/weapons/mp43.webp", "MP43"],
  ["weapons/mp5", "/images/catalogue/weapons/mp5.webp", "MP5"],
  ["weapons/pp-19-vityaz", "/images/catalogue/weapons/pp-19-vityaz.webp", "PP-19 Vityaz"],
  ["weapons/super-45", "/images/catalogue/weapons/super-45.webp", "Super-45"],
  ["weapons/mk22", "/images/catalogue/weapons/mk22.webp", "MK22"],
  ["weapons/mosin-nagant", "/images/catalogue/weapons/mosin-nagant.webp", "Mosin Nagant"],
  ["weapons/scout-rifle-td", "/images/catalogue/weapons/scout-rifle-td.webp", "Scout Rifle TD"],
  ["weapons/sv98", "/images/catalogue/weapons/sv98.webp", "SV98"],
  ["weapons/9k333-verba", "/images/catalogue/weapons/9k333-verba.webp", "9K333 VERBA"],
  ["weapons/maaws", "/images/catalogue/weapons/maaws.webp", "MAAWS"],
  ["weapons/mgl-40", "/images/catalogue/weapons/mgl-40.webp", "MGL-40"],
  ["weapons/rpg-7", "/images/catalogue/weapons/rpg-7.webp", "RPG-7"],
]);

const vehicleApprovals = approveObjects(vehicleCatalogueSource, [
  ["vehicles/ah-6m-miniguns", "/images/catalogue/vehicles/ah-6m-miniguns.webp", "AH-6M Miniguns"],
  ["vehicles/ah-6r-rockets", "/images/catalogue/vehicles/ah-6r-rockets.webp", "AH-6R Rockets"],
  ["vehicles/bobcat", "/images/catalogue/vehicles/bobcat.webp", "Bobcat"],
  ["vehicles/dune-buggy", "/images/catalogue/vehicles/dune-buggy.webp", "Dune Buggy"],
  ["vehicles/flakpanzer-gepard", "/images/catalogue/vehicles/flakpanzer-gepard.webp", "Flakpanzer Gepard"],
  ["vehicles/havoc", "/images/catalogue/vehicles/havoc.webp", "Havoc"],
  ["vehicles/humvee-m249", "/images/catalogue/vehicles/humvee-m249.webp", "Humvee M249"],
  ["vehicles/humvee-minigun", "/images/catalogue/vehicles/humvee-minigun.webp", "Humvee Minigun"],
  ["vehicles/humvee", "/images/catalogue/vehicles/humvee.webp", "Humvee"],
  ["vehicles/kodiak-m249", "/images/catalogue/vehicles/kodiak-m249.webp", "Kodiak M249"],
  ["vehicles/kodiak-pickup", "/images/catalogue/vehicles/kodiak-pickup.webp", "Kodiak Pickup"],
  ["vehicles/kodiak", "/images/catalogue/vehicles/kodiak.webp", "Kodiak"],
  ["vehicles/l2a6", "/images/catalogue/vehicles/l2a6.webp", "L2A6"],
  ["vehicles/mh-6", "/images/catalogue/vehicles/mh-6.webp", "MH-6"],
  ["vehicles/sph-2", "/images/catalogue/vehicles/sph-2.webp", "SPH-2"],
  ["vehicles/uh-1y-miniguns", "/images/catalogue/vehicles/uh-1y-miniguns.webp", "UH-1Y Miniguns"],
  ["vehicles/uh-1y", "/images/catalogue/vehicles/uh-1y.webp", "UH-1Y"],
  ["vehicles/ural-defender-m249", "/images/catalogue/vehicles/ural-defender-m249.webp", "Ural Defender M249"],
  ["vehicles/ural-defender", "/images/catalogue/vehicles/ural-defender.webp", "Ural Defender"],
  ["vehicles/ural", "/images/catalogue/vehicles/ural.webp", "Ural"],
  ["vehicles/loudspeaker", "/images/catalogue/vehicles/loudspeaker.webp", "Loudspeaker tower"],
  ["vehicles/talon-9k-sam", "/images/catalogue/vehicles/talon-9k-sam.webp", "Talon 9K SAM"],
  ["vehicles/l81-mortar", "/images/catalogue/vehicles/l81-mortar.webp", "L81 Mortar"],
  ["vehicles/vanguard-ciws", "/images/catalogue/vehicles/vanguard-ciws.webp", "Vanguard CIWS"],
  ["vehicles/stingray", "/images/catalogue/vehicles/stingray.webp", "Stingray"],
]);

const ownerPackAcquiredAt = "2026-08-17";

function approveOwnerPack(group: "attachments" | "gear", slugs: readonly string[]): CatalogueMediaSource[] {
  return slugs.map((slug) => ({
    origin: "owner-asset-pack",
    recordKey: `${group}/${slug}`,
    image: `/images/catalogue/${group}/${slug}.webp`,
    approvedState: "verified",
    assetKind: "object",
    sourceLabel: "Owner-provided WARDOGS catalogue asset pack (Aug 2026)",
    capturedAt: "Historical Alpha-era item artwork; current build not verified",
    retrievedAt: ownerPackAcquiredAt,
    usageNote: `Owner-provided historical item artwork approved only for ${group}/${slug}; it does not verify current-build stats or availability.`,
  }));
}

const ownerAmmoApprovals: CatalogueMediaSource[] = [
  ["45-acp", "45-acp"],
  ["9x19mm", "9mm-fmj"],
  ["5-45x39mm", "5-45x39mm-fmj"],
  ["5-56x45mm", "556x45mm"],
  ["50-ae", "50-ae"],
  ["7-62x54mmr", "762x54mm"],
  ["45-colt", "45-colt"],
  ["7-62x39mm", "762x39mm"],
  ["308-winchester", "308"],
  ["50-cal", "50-cal"],
  ["338-norma-magnum", "338-norma-magnum-fmj"],
  ["12-gauge", "12g-buck"],
  ["12-7x55mm", "12-7x55mm"],
  ["9x39mm", "9x39mm"],
].map(([slug, filename]) => ({
  origin: "owner-asset-pack",
  recordKey: `ammo/${slug}`,
  image: `/images/catalogue/ammo/${filename}.webp`,
  approvedState: "verified",
  assetKind: "object",
  sourceLabel: "Owner-provided WARDOGS catalogue asset pack (Aug 2026)",
  capturedAt: "Historical Alpha-era ammunition artwork; current build not verified",
  retrievedAt: ownerPackAcquiredAt,
  usageNote: `Owner-provided historical ammunition artwork approved only for ammo/${slug}; it does not verify current-build damage or pricing.`,
}));

const ownerAttachmentApprovals = approveOwnerPack("attachments", [
  "vektor-frenix-x-micro-reflex-sight", "four-reticle-reflex", "compact-t-2-red-dot", "holographic-sight",
  "kobra-reflex", "okp-7-reflex", "tricon-1-5x-compact-prism-scope", "cq-2x-prism-combat-scope",
  "2-5x-combat-optic", "spitfire-3x", "3x-tactical-prism-scope", "4x-combat-prism-scope-with-reflex",
  "spectr-4x", "amp-9-15-rnd-magazine", "amp-9-20-rnd-magazine", "amp-9-30-rnd-magazine",
  "amp-9-50-rnd-magazine", "amr-50-10-rnd-magazine", "deagle-7-rnd-magazine",
  "fal-bmr-308-20-rnd-magazine", "fal-30-rnd-magazine", "galil-35-rnd-magazine",
  "galil-50-rnd-magazine", "ggx-50-rnd-drum-magazine", "m1911-7-rnd-magazine",
  "m1911-10-rnd-magazine", "m249-100-rnd-fabric-magazine", "mk22-5-rnd-magazine",
  "mp5-20-rnd-magazine", "mp5-30-rnd-magazine", "mp5-50-rnd-magazine",
  "pp-19-vityaz-10-rnd-magazine", "pp-19-vityaz-30-rnd-magazine", "pp-19-50-rnd-magazine",
  "stanag-20-rnd-magazine", "stanag-60-rnd-magazine", "super-45-13-rnd-magazine",
  "super-45-30-rnd-magazine", "super-45-40-rnd-drum-magazine", "svd-5-rnd-magazine",
]);

const ownerGearApprovals = approveOwnerPack("gear", [
  "light-helmet", "medium-helmet", "heavy-helmet", "super-heavy-helmet", "ghillie-helmet",
  "light-armor", "medium-armor", "heavy-armor", "super-heavy-armor", "ghillie-armor", "scout-backpack",
]);


const pressKitUrl = "https://www.team17.com/hubfs/WARDOGS%20-%20Press%20Kit%20%28Aug%2026%29.zip";

function objectOverride(recordKey: string, image: string, sourceUrl: string, sourceLabel: string, capturedAt: string, retrievedAt: string, usageNote: string, additionalRecordKeys?: readonly string[]): CatalogueMediaSource {
  return {origin: "external-capture", recordKey, additionalRecordKeys, image, approvedState: "verified", assetKind: "object", sourceUrl, sourceLabel, capturedAt, retrievedAt, usageNote};
}

const exactObjectOverrides: CatalogueMediaSource[] = [
  objectOverride("weapons/m4", "/images/catalogue/weapons/m4.webp", pressKitUrl, "Team17 WARDOGS Press Kit (Aug 2026)", "WD_Screenshot_Destruction_1_WD2.jpg", "2026-08-30", "Official HUD frame visibly identifies the equipped M4 and 5.56mm ammunition."),
  objectOverride("weapons/super-45", "/images/catalogue/weapons/super-45.webp", pressKitUrl, "Team17 WARDOGS Press Kit (Aug 2026)", "WD_Screenshot_ResidentialStreet_1_WD2.jpg", "2026-08-30", "Official HUD frame visibly identifies the equipped Super-45 and .45 ACP ammunition."),
  objectOverride("weapons/9k333-verba", "/images/catalogue/weapons/9k333-verba.webp", "https://www.youtube.com/watch?v=i9Oulhtinpk", "WARDOGS all-weapons vendor walkthrough", "01:06", "2026-09-01", "Vendor frame visibly selects the 9K333 VERBA beside the matching launcher model."),
  objectOverride("vehicles/loudspeaker", "/images/catalogue/vehicles/loudspeaker.webp", "https://www.youtube.com/watch?v=sgGTHYJIgAo", "WARDOGS Beta live gameplay", "01:39:26", "2026-09-01", "The complete climbable loudspeaker tower is visible immediately after the creator identifies it by name."),
  objectOverride("vehicles/talon-9k-sam", "/images/catalogue/vehicles/talon-9k-sam.webp", "https://www.youtube.com/watch?v=kg46BZ1H2W0", "WARDOGS Building 101", "15:30", "2026-09-01", "The stationary SAM model and operator interaction are both visible."),
  objectOverride("vehicles/l81-mortar", "/images/catalogue/vehicles/l81-mortar.webp", "https://www.youtube.com/watch?v=kg46BZ1H2W0", "WARDOGS Building 101", "01:16", "2026-09-01", "The complete mortar, sandbag pit, and in-game ENTER Mortar interaction are visible together.", ["weapons/mortar"]),
  objectOverride("vehicles/vanguard-ciws", "/images/catalogue/vehicles/vanguard-ciws.webp", "https://www.youtube.com/watch?v=kg46BZ1H2W0", "WARDOGS Building 101", "09:50", "2026-09-01", "The operator HUD visibly identifies VANGUARD CIWS."),
  objectOverride("vehicles/stingray", "/images/catalogue/vehicles/stingray.webp", "https://www.youtube.com/watch?v=kg46BZ1H2W0", "WARDOGS Building 101", "03:56", "2026-09-01", "The Stingray launcher tube and handheld control unit are clearly visible."),
];

function contextualSource(image: string, filename: string, usageNote: string, categoryKeys: readonly CatalogueCategoryMediaKey[]): CatalogueMediaSource {
  return {origin: "external-capture", image, approvedState: "context-only", assetKind: "contextual", sourceUrl: pressKitUrl, sourceLabel: "Team17 WARDOGS Press Kit (Aug 2026)", capturedAt: filename, retrievedAt: "2026-08-30", usageNote, categoryKeys};
}

const contextualApprovals = [
  contextualSource("/images/guide-discovery/best-weapons-loadouts.webp", "WD_Screenshot_ResidentialStreet_1_WD2.jpg", "Official street-combat frame approved only as contextual category and guide art; it does not verify any weapon, ammunition, attachment, or loadout object.", ["weapons", "ammo", "attachments", "loadouts"]),
  contextualSource("/images/guide-discovery/armor-damage-ttk.webp", "WD_Screenshot_Tank_1_WD2.jpg", "Official combined-arms frame approved only as contextual category and guide art; it does not verify a vehicle, armor object, or mechanic.", ["hub", "vehicles", "gear", "mechanics"]),
  contextualSource("/images/guide-discovery/medic-revive.webp", "WD_Screenshot_Tank_1_WD2.jpg", "Official downed-player interaction frame approved only as medical context; it does not verify a specific medical object or effect.", ["medical"]),
  contextualSource("/images/guide-discovery/equipment-tools.webp", "WD_Screenshot_Foundry_1_WD2.jpg", "Official indoor-combat frame approved only as equipment, supply, and deployable context; it does not verify a specific object.", ["equipment", "supplies", "deployables"]),
];

const approvedMedia = [...weaponApprovals, ...vehicleApprovals, ...ownerAmmoApprovals, ...ownerAttachmentApprovals, ...ownerGearApprovals, ...exactObjectOverrides, ...contextualApprovals];

export const catalogueMediaSources: Readonly<Record<string, CatalogueMediaSource>> = Object.fromEntries(
  approvedMedia.map((source) => [source.image, source]),
);

export function isCatalogueMediaSourceApprovedForRecord(
  source: CatalogueMediaSource | undefined,
  recordKey: string,
): boolean {
  return Boolean(
    source
    && (source.origin === "owner-asset-pack" || !nonObjectSpecificCatalogueSourceUrls.has(source.sourceUrl))
    && (source.recordKey === recordKey || source.additionalRecordKeys?.includes(recordKey))
  );
}

export function getCatalogueMediaSource(record: Pick<CatalogueRecord, "type" | "slug" | "image">): CatalogueMediaSource | undefined {
  if (!record.image) return undefined;
  const source = catalogueMediaSources[record.image];
  const recordKey = `${record.type}/${record.slug}`;
  return isCatalogueMediaSourceApprovedForRecord(source, recordKey) ? source : undefined;
}

export function getCatalogueCategoryMediaSource(category: CatalogueCategoryMediaKey): CatalogueMediaSource | undefined {
  return Object.values(catalogueMediaSources).find((source) =>
    source.assetKind === "contextual" && source.categoryKeys?.includes(category)
  );
}
