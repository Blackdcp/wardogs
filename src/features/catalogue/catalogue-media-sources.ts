import {catalogueRecords} from "./catalogue-records";
import type {CatalogueRecordType} from "./catalogue-types";

export type CatalogueMediaSource = {
  sourceUrl: string;
  sourceLabel: string;
  capturedAt?: string;
  retrievedAt: string;
  usageNote: string;
};

const sourceByType: Record<CatalogueRecordType, CatalogueMediaSource> = {
  weapons: {
    sourceUrl: "https://www.youtube.com/watch?v=9mSvZyAk62E",
    sourceLabel: "Every Weapon Tested in WARDOGS - source-linked catalogue footage",
    capturedAt: "Item-specific catalogue frames from the source video and approved Alpha capture set",
    retrievedAt: "2026-08-18",
    usageNote: "Existing local cutout approved for the catalogue after matching the visible weapon name and build capture.",
  },
  vehicles: {
    sourceUrl: "https://www.youtube.com/watch?v=ZFRrDSru7Kg",
    sourceLabel: "Every WARDOGS Vehicle Explained - source-linked catalogue footage",
    capturedAt: "Item-specific catalogue frames from the source video and approved Alpha capture set",
    retrievedAt: "2026-08-18",
    usageNote: "Existing local vehicle art approved after matching the visible model or vendor identifier in source-linked footage.",
  },
  ammo: {
    sourceUrl: "https://www.youtube.com/watch?v=-k6IV0ITLDo",
    sourceLabel: "WARDOGS pre-match catalogue walkthrough",
    capturedAt: "Ammunition catalogue segment",
    retrievedAt: "2026-08-18",
    usageNote: "Existing ammunition artwork belongs to the approved Alpha catalogue capture inventory and is used as build evidence.",
  },
  attachments: {
    sourceUrl: "https://www.youtube.com/watch?v=-k6IV0ITLDo",
    sourceLabel: "WARDOGS pre-match catalogue walkthrough",
    capturedAt: "Optics and magazine catalogue segments",
    retrievedAt: "2026-08-18",
    usageNote: "Existing attachment artwork belongs to the approved Alpha catalogue capture inventory and is used as build evidence.",
  },
  gear: {
    sourceUrl: "https://www.youtube.com/watch?v=-k6IV0ITLDo",
    sourceLabel: "WARDOGS pre-match catalogue walkthrough",
    capturedAt: "Armor, helmet, and backpack catalogue segments",
    retrievedAt: "2026-08-18",
    usageNote: "Existing gear artwork belongs to the approved Alpha catalogue capture inventory and is used as build evidence.",
  },
};

const pressKitUrl = "https://www.team17.com/hubfs/WARDOGS%20-%20Press%20Kit%20%28Aug%2026%29.zip";

const pressKitSource = (filename: string, usageNote: string): CatalogueMediaSource => ({
  sourceUrl: pressKitUrl,
  sourceLabel: "Team17 WARDOGS Press Kit (Aug 2026)",
  capturedAt: filename,
  retrievedAt: "2026-08-30",
  usageNote,
});

const creatorCaptureSource = (
  sourceUrl: string,
  sourceLabel: string,
  capturedAt: string,
  usageNote: string,
): CatalogueMediaSource => ({
  sourceUrl,
  sourceLabel,
  capturedAt,
  retrievedAt: "2026-09-01",
  usageNote,
});

const weaponCaptureSource = (capturedAt: string, itemName: string) =>
  creatorCaptureSource(
    "https://www.youtube.com/watch?v=9mSvZyAk62E",
    "Every Weapon Tested in WARDOGS - creator catalogue footage",
    capturedAt,
    `Source-linked gameplay frame used after the visible weapon model and sequence were matched to ${itemName}.`,
  );

const explicitMediaSources: Record<string, CatalogueMediaSource> = {
  "/images/catalogue/weapons/t-21.webp": weaponCaptureSource("00:24", "T-21"),
  "/images/catalogue/weapons/pp-19-vityaz.webp": weaponCaptureSource("05:25", "PP-19 Vityaz"),
  "/images/catalogue/weapons/mp5.webp": weaponCaptureSource("05:59", "MP5"),
  "/images/catalogue/weapons/mp43.webp": weaponCaptureSource("07:07", "MP43"),
  "/images/catalogue/weapons/m500.webp": weaponCaptureSource("07:31", "M500"),
  "/images/catalogue/weapons/m249-saw.webp": weaponCaptureSource("07:57", "M249 SAW"),
  "/images/catalogue/weapons/pkm.webp": weaponCaptureSource("08:57", "PKM"),
  "/images/catalogue/weapons/sks.webp": weaponCaptureSource("09:48", "SKS"),
  "/images/catalogue/weapons/svd.webp": weaponCaptureSource("10:27", "SVD"),
  "/images/catalogue/weapons/scout-rifle-td.webp": weaponCaptureSource("11:43", "Scout Rifle TD"),
  "/images/catalogue/weapons/mosin-nagant.webp": weaponCaptureSource("12:22", "Mosin Nagant"),
  "/images/catalogue/weapons/sv98.webp": weaponCaptureSource("12:56", "SV98"),
  "/images/catalogue/weapons/mk22.webp": weaponCaptureSource("13:37", "MK22"),
  "/images/catalogue/weapons/m1911.webp": weaponCaptureSource("16:29", "M1911"),
  "/images/catalogue/weapons/rpg-7.webp": weaponCaptureSource("18:00", "RPG-7"),
  "/images/catalogue/weapons/maaws.webp": weaponCaptureSource("18:24", "MAAWS"),
  "/images/catalogue/weapons/mgl-40.webp": weaponCaptureSource("19:12", "MGL-40"),
  "/images/catalogue/weapons/9k333-verba.webp": creatorCaptureSource(
    "https://www.youtube.com/watch?v=i9Oulhtinpk",
    "WARDOGS all-weapons vendor walkthrough",
    "01:06",
    "Vendor frame used because the 9K333 VERBA name is visibly selected beside the launcher model.",
  ),
  "/images/catalogue/vehicles/loudspeaker.webp": creatorCaptureSource(
    "https://www.youtube.com/watch?v=sgGTHYJIgAo",
    "WARDOGS Beta live gameplay",
    "01:39:26",
    "Gameplay frame used because the full climbable loudspeaker tower is visible immediately after the creator identifies it by name.",
  ),
  "/images/catalogue/vehicles/talon-9k-sam.webp": creatorCaptureSource(
    "https://www.youtube.com/watch?v=kg46BZ1H2W0",
    "WARDOGS Building 101",
    "15:30",
    "Gameplay frame used because the stationary SAM model and its operator interaction are both visible.",
  ),
  "/images/catalogue/vehicles/l81-mortar.webp": creatorCaptureSource(
    "https://www.youtube.com/watch?v=kg46BZ1H2W0",
    "WARDOGS Building 101",
    "01:16",
    "Gameplay frame used because the complete mortar, sandbag pit, and in-game ENTER Mortar interaction are visible together.",
  ),
  "/images/catalogue/vehicles/vanguard-ciws.webp": creatorCaptureSource(
    "https://www.youtube.com/watch?v=kg46BZ1H2W0",
    "WARDOGS Building 101",
    "09:50",
    "Operator-view frame used because the in-game HUD visibly identifies VANGUARD CIWS.",
  ),
  "/images/catalogue/vehicles/stingray.webp": creatorCaptureSource(
    "https://www.youtube.com/watch?v=kg46BZ1H2W0",
    "WARDOGS Building 101",
    "03:56",
    "Gameplay frame used because the Stingray launcher tube and handheld control unit are clearly visible in the emplacement.",
  ),
  "/images/catalogue/weapons/m4.webp": pressKitSource(
    "WD_Screenshot_Destruction_1_WD2.jpg",
    "Official gameplay frame used because the HUD visibly identifies the equipped weapon as M4 and the ammunition as 5.56mm.",
  ),
  "/images/catalogue/weapons/super-45.webp": pressKitSource(
    "WD_Screenshot_ResidentialStreet_1_WD2.jpg",
    "Official gameplay frame used because the HUD visibly identifies the equipped weapon as Super-45 and the ammunition as .45 ACP.",
  ),
  "/images/guide-discovery/best-weapons-loadouts.webp": pressKitSource(
    "WD_Screenshot_ResidentialStreet_1_WD2.jpg",
    "Official street-combat frame used as contextual discovery art for the build-sensitive weapons and loadouts guide.",
  ),
  "/images/guide-discovery/armor-damage-ttk.webp": pressKitSource(
    "WD_Screenshot_Tank_1_WD2.jpg",
    "Official combined-arms frame used as contextual discovery art for the armor, damage, and survivability guide.",
  ),
  "/images/guide-discovery/medic-revive.webp": pressKitSource(
    "WD_Screenshot_Tank_1_WD2.jpg",
    "Official gameplay frame visibly showing a downed-player interaction, used as contextual discovery art for the medic guide.",
  ),
  "/images/guide-discovery/equipment-tools.webp": pressKitSource(
    "WD_Screenshot_Foundry_1_WD2.jpg",
    "Official indoor-combat frame used as contextual discovery art for the equipment and tools guide.",
  ),
};

export const catalogueMediaSources: Readonly<Record<string, CatalogueMediaSource>> = {
  ...Object.fromEntries(
    catalogueRecords
      .filter((record) => record.mediaState !== "pending")
      .map((record) => [record.image, sourceByType[record.type]]),
  ),
  ...explicitMediaSources,
};
