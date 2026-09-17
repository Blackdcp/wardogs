import type {CatalogueGroup, CatalogueRecordType} from "./catalogue-types";

export const catalogueGroups: readonly CatalogueGroup[] = [
  {
    type: "weapons",
    label: "Weapons",
    filters: [
      {label: "Assault rifle", value: "assault-rifle"},
      {label: "SMG", value: "smg"},
      {label: "LMG", value: "lmg"},
      {label: "Shotgun", value: "shotgun"},
      {label: "Launcher", value: "launcher"},
      {label: "Marksman rifle", value: "marksman-rifle"},
      {label: "Sidearm", value: "sidearm"},
      {label: "Recon XP", value: "recon-xp"},
      {label: "Identifier only", value: "identifier-only"}
    ]
  },
  {
    type: "vehicles",
    label: "Vehicles",
    filters: [
      {label: "Land transport", value: "land-transport"},
      {label: "Armor and artillery", value: "armor-and-artillery"},
      {label: "Aircraft", value: "aircraft"},
      {label: "Stationary system", value: "stationary-system"},
      {label: "Driver", value: "driver"},
      {label: "Pilot", value: "pilot"},
      {label: "Identifier only", value: "identifier-only"}
    ]
  },
  {
    type: "ammo",
    label: "Ammo",
    filters: [
      {label: "Three loads", value: "three-loads"},
      {label: "Two loads", value: "two-loads"},
      {label: "Base damage observed", value: "base-damage-observed"}
    ]
  },
  {
    type: "attachments",
    label: "Attachments",
    filters: [
      {label: "Optic", value: "optic"},
      {label: "Magazine", value: "magazine"}
    ]
  },
  {
    type: "gear",
    label: "Gear",
    filters: [
      {label: "Helmet", value: "helmet"},
      {label: "Armor", value: "armor"},
      {label: "Backpack", value: "backpack"}
    ]
  },
  {
    type: "equipment",
    label: "Field Equipment",
    filters: [
      {label: "Recon", value: "recon"},
      {label: "Vehicle support", value: "vehicle-support"},
      {label: "Utility", value: "utility"}
    ]
  },
  {
    type: "medical",
    label: "Medical",
    filters: [
      {label: "Personal recovery", value: "personal-recovery"},
      {label: "Squad recovery", value: "squad-recovery"}
    ]
  },
  {
    type: "supplies",
    label: "Supplies",
    filters: [
      {label: "Build", value: "build"},
      {label: "Ammo", value: "ammo"},
      {label: "Fuel", value: "fuel"},
      {label: "Mechanical", value: "mechanical"}
    ]
  },
  {
    type: "deployables",
    label: "Deployables",
    filters: [
      {label: "Route denial", value: "route-denial"},
      {label: "FOB asset", value: "fob-asset"},
      {label: "Objective support", value: "objective-support"}
    ]
  },
  {
    type: "mechanics",
    label: "Mechanics",
    filters: [
      {label: "Objective", value: "objective"},
      {label: "Economy", value: "economy"},
      {label: "Support", value: "support"}
    ]
  },
  {
    type: "maps",
    label: "Operations Atlas",
    filters: [
      {label: "Orientation", value: "orientation"},
      {label: "Objective", value: "objective"},
      {label: "Construction", value: "construction"},
      {label: "Logistics", value: "logistics"},
      {label: "Fire support", value: "fire-support"},
      {label: "Air operations", value: "air-operations"}
    ]
  }
];

export function getCatalogueGroup(type: CatalogueRecordType): CatalogueGroup | undefined {
  return catalogueGroups.find((group) => group.type === type);
}
