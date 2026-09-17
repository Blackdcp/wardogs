import type {CatalogueMediaState, CatalogueRecord} from "./catalogue-types";

export type CatalogueMediaSource = {
  recordKey?: string;
  additionalRecordKeys?: readonly string[];
  image: string;
  approvedState: Exclude<CatalogueMediaState, "pending">;
  assetKind: "object" | "contextual";
  sourceUrl: string;
  sourceLabel: string;
  capturedAt?: string;
  retrievedAt: string;
  usageNote: string;
};

type ObjectSourceBase = Omit<CatalogueMediaSource, "recordKey" | "image" | "approvedState" | "assetKind" | "usageNote">;
type ObjectApproval = readonly [recordKey: string, image: string, objectLabel: string];

const weaponCatalogueSource: ObjectSourceBase = {
  sourceUrl: "https://www.youtube.com/watch?v=9mSvZyAk62E",
  sourceLabel: "Every Weapon Tested in WARDOGS - approved creator catalogue footage",
  capturedAt: "Item-specific catalogue sequence",
  retrievedAt: "2026-08-18",
};

const vehicleCatalogueSource: ObjectSourceBase = {
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


const pressKitUrl = "https://www.team17.com/hubfs/WARDOGS%20-%20Press%20Kit%20%28Aug%2026%29.zip";

function objectOverride(recordKey: string, image: string, sourceUrl: string, sourceLabel: string, capturedAt: string, retrievedAt: string, usageNote: string, additionalRecordKeys?: readonly string[]): CatalogueMediaSource {
  return {recordKey, additionalRecordKeys, image, approvedState: "verified", assetKind: "object", sourceUrl, sourceLabel, capturedAt, retrievedAt, usageNote};
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

function contextualSource(image: string, filename: string, usageNote: string): CatalogueMediaSource {
  return {image, approvedState: "context-only", assetKind: "contextual", sourceUrl: pressKitUrl, sourceLabel: "Team17 WARDOGS Press Kit (Aug 2026)", capturedAt: filename, retrievedAt: "2026-08-30", usageNote};
}

const contextualApprovals = [
  contextualSource("/images/guide-discovery/best-weapons-loadouts.webp", "WD_Screenshot_ResidentialStreet_1_WD2.jpg", "Official street-combat frame used only as contextual discovery art for the weapons and loadouts guide."),
  contextualSource("/images/guide-discovery/armor-damage-ttk.webp", "WD_Screenshot_Tank_1_WD2.jpg", "Official combined-arms frame used only as contextual discovery art for the armor and survivability guide."),
  contextualSource("/images/guide-discovery/medic-revive.webp", "WD_Screenshot_Tank_1_WD2.jpg", "Official frame showing a downed-player interaction, used only as contextual discovery art for the medic guide."),
  contextualSource("/images/guide-discovery/equipment-tools.webp", "WD_Screenshot_Foundry_1_WD2.jpg", "Official indoor-combat frame used only as contextual discovery art for the equipment and tools guide."),
];

const approvedMedia = [...weaponApprovals, ...vehicleApprovals, ...exactObjectOverrides, ...contextualApprovals];

export const catalogueMediaSources: Readonly<Record<string, CatalogueMediaSource>> = Object.fromEntries(
  approvedMedia.map((source) => [source.image, source]),
);

export function isCatalogueMediaSourceApprovedForRecord(
  source: CatalogueMediaSource | undefined,
  recordKey: string,
): boolean {
  return Boolean(
    source
    && !nonObjectSpecificCatalogueSourceUrls.has(source.sourceUrl)
    && (source.recordKey === recordKey || source.additionalRecordKeys?.includes(recordKey))
  );
}

export function getCatalogueMediaSource(record: Pick<CatalogueRecord, "type" | "slug" | "image">): CatalogueMediaSource | undefined {
  if (!record.image) return undefined;
  const source = catalogueMediaSources[record.image];
  const recordKey = `${record.type}/${record.slug}`;
  return isCatalogueMediaSourceApprovedForRecord(source, recordKey) ? source : undefined;
}
