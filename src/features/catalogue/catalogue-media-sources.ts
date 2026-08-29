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

const explicitMediaSources: Record<string, CatalogueMediaSource> = {
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
