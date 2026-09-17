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

const loadoutCatalogueSource: ObjectSourceBase = {
  sourceUrl: "https://www.youtube.com/watch?v=-k6IV0ITLDo",
  sourceLabel: "WARDOGS pre-match catalogue walkthrough",
  capturedAt: "Item-specific ammunition, attachment, or gear sequence",
  retrievedAt: "2026-08-18",
};

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

const loadoutApprovals = approveObjects(loadoutCatalogueSource, [
  ["ammo/45-acp", "/images/catalogue/ammo/45-acp.webp", ".45 ACP ammunition"],
  ["ammo/9x19mm", "/images/catalogue/ammo/9mm-fmj.webp", "9x19mm ammunition"],
  ["ammo/5-45x39mm", "/images/catalogue/ammo/5-45x39mm-fmj.webp", "5.45x39mm ammunition"],
  ["ammo/5-56x45mm", "/images/catalogue/ammo/556x45mm.webp", "5.56x45mm ammunition"],
  ["ammo/50-ae", "/images/catalogue/ammo/50-ae.webp", ".50 AE ammunition"],
  ["ammo/7-62x54mmr", "/images/catalogue/ammo/762x54mm.webp", "7.62x54mmR ammunition"],
  ["ammo/45-colt", "/images/catalogue/ammo/45-colt.webp", ".45 Colt ammunition"],
  ["ammo/7-62x39mm", "/images/catalogue/ammo/762x39mm.webp", "7.62x39mm ammunition"],
  ["ammo/308-winchester", "/images/catalogue/ammo/308.webp", ".308 Winchester ammunition"],
  ["ammo/50-cal", "/images/catalogue/ammo/50-cal.webp", ".50 Cal ammunition"],
  ["ammo/338-norma-magnum", "/images/catalogue/ammo/338-norma-magnum-fmj.webp", ".338 Norma Magnum ammunition"],
  ["ammo/12-gauge", "/images/catalogue/ammo/12g-buck.webp", "12 Gauge ammunition"],
  ["ammo/12-7x55mm", "/images/catalogue/ammo/12-7x55mm.webp", "12.7x55mm ammunition"],
  ["ammo/9x39mm", "/images/catalogue/ammo/9x39mm.webp", "9x39mm ammunition"],
  ["attachments/vektor-frenix-x-micro-reflex-sight", "/images/catalogue/attachments/vektor-frenix-x-micro-reflex-sight.webp", "Vektor Frenix-X Micro Reflex Sight"],
  ["attachments/four-reticle-reflex", "/images/catalogue/attachments/four-reticle-reflex.webp", "Four Reticle Reflex"],
  ["attachments/compact-t-2-red-dot", "/images/catalogue/attachments/compact-t-2-red-dot.webp", "Compact T-2 Red Dot"],
  ["attachments/holographic-sight", "/images/catalogue/attachments/holographic-sight.webp", "Holographic Sight"],
  ["attachments/kobra-reflex", "/images/catalogue/attachments/kobra-reflex.webp", "Kobra Reflex"],
  ["attachments/okp-7-reflex", "/images/catalogue/attachments/okp-7-reflex.webp", "OKP 7 Reflex"],
  ["attachments/tricon-1-5x-compact-prism-scope", "/images/catalogue/attachments/tricon-1-5x-compact-prism-scope.webp", "Tricon 1.5x Compact Prism Scope"],
  ["attachments/cq-2x-prism-combat-scope", "/images/catalogue/attachments/cq-2x-prism-combat-scope.webp", "CQ 2x Prism Combat Scope"],
  ["attachments/2-5x-combat-optic", "/images/catalogue/attachments/2-5x-combat-optic.webp", "2.5x Combat Optic"],
  ["attachments/spitfire-3x", "/images/catalogue/attachments/spitfire-3x.webp", "Spitfire 3x"],
  ["attachments/3x-tactical-prism-scope", "/images/catalogue/attachments/3x-tactical-prism-scope.webp", "3x Tactical Prism Scope"],
  ["attachments/4x-combat-prism-scope-with-reflex", "/images/catalogue/attachments/4x-combat-prism-scope-with-reflex.webp", "4x Combat Prism Scope with Reflex"],
  ["attachments/spectr-4x", "/images/catalogue/attachments/spectr-4x.webp", "Spectr 4x"],
  ["attachments/amp-9-15-rnd-magazine", "/images/catalogue/attachments/amp-9-15-rnd-magazine.webp", "AMP-9 15 Round Magazine"],
  ["attachments/amp-9-20-rnd-magazine", "/images/catalogue/attachments/amp-9-20-rnd-magazine.webp", "AMP-9 20 Round Magazine"],
  ["attachments/amp-9-30-rnd-magazine", "/images/catalogue/attachments/amp-9-30-rnd-magazine.webp", "AMP-9 30 Round Magazine"],
  ["attachments/amp-9-50-rnd-magazine", "/images/catalogue/attachments/amp-9-50-rnd-magazine.webp", "AMP-9 50 Round Magazine"],
  ["attachments/amr-50-10-rnd-magazine", "/images/catalogue/attachments/amr-50-10-rnd-magazine.webp", "AMR 50 10 Round Magazine"],
  ["attachments/deagle-7-rnd-magazine", "/images/catalogue/attachments/deagle-7-rnd-magazine.webp", "Deagle 7 Round Magazine"],
  ["attachments/fal-bmr-308-20-rnd-magazine", "/images/catalogue/attachments/fal-bmr-308-20-rnd-magazine.webp", "FAL and BMR-308 20 Round Magazine"],
  ["attachments/fal-30-rnd-magazine", "/images/catalogue/attachments/fal-30-rnd-magazine.webp", "FAL 30 Round Magazine"],
  ["attachments/galil-35-rnd-magazine", "/images/catalogue/attachments/galil-35-rnd-magazine.webp", "Galil 35 Round Magazine"],
  ["attachments/galil-50-rnd-magazine", "/images/catalogue/attachments/galil-50-rnd-magazine.webp", "Galil 50 Round Magazine"],
  ["attachments/ggx-50-rnd-drum-magazine", "/images/catalogue/attachments/ggx-50-rnd-drum-magazine.webp", "GGX 50 Round Drum Magazine"],
  ["attachments/m1911-7-rnd-magazine", "/images/catalogue/attachments/m1911-7-rnd-magazine.webp", "M1911 7 Round Magazine"],
  ["attachments/m1911-10-rnd-magazine", "/images/catalogue/attachments/m1911-10-rnd-magazine.webp", "M1911 10 Round Magazine"],
  ["attachments/m249-100-rnd-fabric-magazine", "/images/catalogue/attachments/m249-100-rnd-fabric-magazine.webp", "M249 100 Round Fabric Magazine"],
  ["attachments/mk22-5-rnd-magazine", "/images/catalogue/attachments/mk22-5-rnd-magazine.webp", "MK22 5 Round Magazine"],
  ["attachments/mp5-20-rnd-magazine", "/images/catalogue/attachments/mp5-20-rnd-magazine.webp", "MP5 20 Round Magazine"],
  ["attachments/mp5-30-rnd-magazine", "/images/catalogue/attachments/mp5-30-rnd-magazine.webp", "MP5 30 Round Magazine"],
  ["attachments/mp5-50-rnd-magazine", "/images/catalogue/attachments/mp5-50-rnd-magazine.webp", "MP5 50 Round Magazine"],
  ["attachments/pp-19-vityaz-10-rnd-magazine", "/images/catalogue/attachments/pp-19-vityaz-10-rnd-magazine.webp", "PP-19 Vityaz 10 Round Magazine"],
  ["attachments/pp-19-vityaz-30-rnd-magazine", "/images/catalogue/attachments/pp-19-vityaz-30-rnd-magazine.webp", "PP-19 Vityaz 30 Round Magazine"],
  ["attachments/pp-19-50-rnd-magazine", "/images/catalogue/attachments/pp-19-50-rnd-magazine.webp", "PP-19 50 Round Magazine"],
  ["attachments/stanag-20-rnd-magazine", "/images/catalogue/attachments/stanag-20-rnd-magazine.webp", "STANAG 20 Round Magazine"],
  ["attachments/stanag-60-rnd-magazine", "/images/catalogue/attachments/stanag-60-rnd-magazine.webp", "STANAG 60 Round Magazine"],
  ["attachments/super-45-13-rnd-magazine", "/images/catalogue/attachments/super-45-13-rnd-magazine.webp", "Super-45 13 Round Magazine"],
  ["attachments/super-45-30-rnd-magazine", "/images/catalogue/attachments/super-45-30-rnd-magazine.webp", "Super-45 30 Round Magazine"],
  ["attachments/super-45-40-rnd-drum-magazine", "/images/catalogue/attachments/super-45-40-rnd-drum-magazine.webp", "Super-45 40 Round Drum Magazine"],
  ["attachments/svd-5-rnd-magazine", "/images/catalogue/attachments/svd-5-rnd-magazine.webp", "SVD 5 Round Magazine"],
  ["gear/light-helmet", "/images/catalogue/gear/light-helmet.webp", "Light Helmet"],
  ["gear/medium-helmet", "/images/catalogue/gear/medium-helmet.webp", "Medium Helmet"],
  ["gear/heavy-helmet", "/images/catalogue/gear/heavy-helmet.webp", "Heavy Helmet"],
  ["gear/super-heavy-helmet", "/images/catalogue/gear/super-heavy-helmet.webp", "Super Heavy Helmet"],
  ["gear/ghillie-helmet", "/images/catalogue/gear/ghillie-helmet.webp", "Ghillie Helmet"],
  ["gear/light-armor", "/images/catalogue/gear/light-armor.webp", "Light Armor"],
  ["gear/medium-armor", "/images/catalogue/gear/medium-armor.webp", "Medium Armor"],
  ["gear/heavy-armor", "/images/catalogue/gear/heavy-armor.webp", "Heavy Armor"],
  ["gear/super-heavy-armor", "/images/catalogue/gear/super-heavy-armor.webp", "Super Heavy Armor"],
  ["gear/ghillie-armor", "/images/catalogue/gear/ghillie-armor.webp", "Ghillie Armor"],
  ["gear/scout-backpack", "/images/catalogue/gear/scout-backpack.webp", "Scout Backpack"],
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

const approvedMedia = [...weaponApprovals, ...vehicleApprovals, ...loadoutApprovals, ...exactObjectOverrides, ...contextualApprovals];

export const catalogueMediaSources: Readonly<Record<string, CatalogueMediaSource>> = Object.fromEntries(
  approvedMedia.map((source) => [source.image, source]),
);

export function getCatalogueMediaSource(record: Pick<CatalogueRecord, "type" | "slug" | "image">): CatalogueMediaSource | undefined {
  if (!record.image) return undefined;
  const source = catalogueMediaSources[record.image];
  const recordKey = `${record.type}/${record.slug}`;
  return source?.recordKey === recordKey || source?.additionalRecordKeys?.includes(recordKey) ? source : undefined;
}
