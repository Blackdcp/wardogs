import type {ItemTypeId} from "./item-library";

export type CatalogRow = {
  cells: string[];
};

export type CatalogSection = {
  title: string;
  description: string;
  rows: CatalogRow[];
};

export type CatalogGuide = {
  id: ItemTypeId;
  title: string;
  description: string;
  countLabel: string;
  dataAsOf: string;
  heroImage?: string;
  heroImageAlt?: string;
  disclaimer: string;
  columns: string[];
  sections: CatalogSection[];
  insights: string[];
  unknowns: string[];
  officialSources: {label: string; url: string}[];
};

const officialSources = [
  {label: "WARDOGS on Steam", url: "https://store.steampowered.com/app/1867240/WARDOGS/"},
  {label: "Team17 WARDOGS page", url: "https://www.team17.com/games/wardogs"},
  {label: "BULKHEAD WARDOGS page", url: "https://bulkhead.com/games/wardogs/"}
];

const row = (...cells: string[]): CatalogRow => ({cells});

export const catalogGuides: readonly CatalogGuide[] = [
  {
    id: "weapons",
      title: "WARDOGS Weapons List: All 33 Weapons",
      description: "Browse all 33 WARDOGS Alpha 1 weapons, including rifles, SMGs, shotguns, launchers and the Compound Bow, with roles, evidence notes and item guides.",
    countLabel: "33 weapons",
    dataAsOf: "Alpha 1 - 7 Aug 2026",
    heroImage: "/images/items/catalog-weapons.jpg",
    heroImageAlt: "WARDOGS weapons from a large battlefield match",
    disclaimer: "Community-observed pre-release data. Prices, unlocks, balance, and availability may change before Early Access.",
    columns: ["Weapon", "Alpha price", "Ammunition", "Fire modes", "Weight", "Progression"],
    sections: [
      {
        title: "Assault Rifles",
        description: "General-purpose rifles for the mid-range fights that form most Control Zone pushes.",
        rows: [
          row("Bushmaster M17S", "$0", "5.56x45mm", "Semi / Burst", "3.17 kg", "Assault XP"),
          row("T-21", "$600", "5.56x45mm", "Semi / Full Auto", "3.27 kg", "Assault XP"),
          row("Galil", "$2,200", "5.56x45mm", "Semi / Full Auto", "3.95 kg", "Assault XP"),
          row("M4", "$2,800", "5.56x45mm", "Semi / Full Auto", "2.92 kg", "Assault XP"),
          row("FAL", "$5,500", ".308 Winchester", "Semi / Full Auto", "4.25 kg", "Assault XP"),
          row("A-91", "Not captured", "5.56x45mm", "Semi / Burst", "3.17 kg", "Assault XP"),
          row("AK74", "Not captured", "5.45x39mm", "Semi / Full Auto", "3 kg", "Assault XP"),
          row("KH-2002", "Not captured", "5.56x45mm", "Semi / Burst", "3.17 kg", "Assault XP")
        ]
      },
      {
        title: "SMGs",
        description: "Low-weight close-range options associated with Medic progression in the Alpha build.",
        rows: [
          row("AMP-9", "$900", "9x19mm", "Semi / Full Auto", "1.4 kg", "Medic XP"),
          row("PP-19 Vityaz", "$1,200", "9x19mm", "Semi / Full Auto", "2.9 kg", "Medic XP"),
          row("MP5", "$1,500", "9x19mm", "Semi / Full Auto", "2.54 kg", "Medic XP"),
          row("Super-45", "Not captured", ".45 ACP", "Semi / Full Auto", "3 kg", "Medic XP")
        ]
      },
      {
        title: "Shotguns and LMGs",
        description: "Support-track weapons for room clearing, suppression, and defensive lanes.",
        rows: [
          row("MP43", "$400", "12 Gauge", "Break-action", "3.2 kg", "Support XP"),
          row("M500", "Not captured", "12 Gauge", "Semi automatic", "3.52 kg", "Support XP"),
          row("PKM", "$4,500", "7.62x54mmR", "Semi / Full Auto", "7.5 kg", "Support XP"),
          row("M249 SAW", "Not captured", "5.56x45mm", "Semi / Full Auto", "7.5 kg", "Support XP")
        ]
      },
      {
        title: "Marksman and Sniper Rifles",
        description: "Recon-track rifles ranging from semi-automatic marksman weapons to heavy bolt-action rifles.",
        rows: [
          row("SKS", "$2,400", "7.62x39mm", "Semi automatic", "3.85 kg", "Recon XP"),
          row("SVD", "$4,800", "7.62x54mmR", "Semi automatic", "5.3 kg", "Recon XP"),
          row("BMR-308", "$6,000", ".308 Winchester", "Semi automatic", "3.9 kg", "Recon XP"),
          row("Scout Rifle TD", "$1,100", "5.56x45mm", "Break-action", "2.95 kg", "Recon XP"),
          row("Mosin Nagant", "$4,500", "7.62x54mmR", "Bolt-action", "4.1 kg", "Recon XP"),
          row("SV98", "$5,200", "7.62x54mmR", "Bolt-action / Magazine", "5.8 kg", "Recon XP"),
          row("MK22", "$6,400", ".308 Winchester", "Bolt-action / Magazine", "6.3 kg", "Recon XP"),
          row("AMR 50", "$8,800", ".50 Cal", "Bolt-action / Magazine", "12.5 kg", "Recon XP")
        ]
      },
      {
        title: "Bow, Sidearms, and Launchers",
        description: "Specialist fallback and anti-vehicle choices whose value depends heavily on the rest of the loadout.",
        rows: [
          row("Compound Bow", "$800", "Standard Arrows", "Pull and Release", "1.3 kg", "Recon XP"),
          row("Judge", "$250", ".45 Colt", "Not captured", "Not captured", "Not captured"),
          row("M1911", "$300", ".45 ACP", "Semi automatic", "Not captured", "Not captured"),
          row("Deagle", "$900", ".50 AE", "Semi automatic", "Not captured", "Not captured"),
          row("GGX 17", "Not captured", "9x19mm", "Semi automatic", "Not captured", "Not captured"),
          row("GGX 18", "Not captured", "9x19mm", "Semi / Full Auto", "Not captured", "Not captured"),
          row("RPG7", "$2,000", "93mm", "Not captured", "Not captured", "Not captured"),
          row("MAWS", "Not captured", "84mm", "Not captured", "Not captured", "Not captured"),
          row("MGL40", "Not captured", "40mm", "Not captured", "Not captured", "Not captured")
        ]
      }
    ],
    insights: [
      "A weapon choice also selects a progression track: Assault, Medic, Support, or Recon XP.",
      "The one-time starting balance makes ammunition, magazines, armor, and replacement cost part of weapon value.",
      "A lower-price weapon can be the better progression tool when it leaves enough cash for repeated deaths."
    ],
    unknowns: [
      "The Alpha 1 roster is not the promised final Early Access roster.",
      "Several vendor prices, attachment effects, and unlock gates were not readable in the captured build.",
      "Damage and handling can change between the Alpha, Closed Beta, and Early Access builds."
    ],
    officialSources
  },
  {
    id: "vehicles",
    title: "WARDOGS Vehicles Catalogue",
    description: "The observed Alpha 1 vehicle vendor, separated into transport, armor, artillery, and aircraft with price and unlock context.",
    countLabel: "20 vehicles",
    dataAsOf: "Alpha 1 - 7 Aug 2026",
    heroImage: "/images/items/catalog-vehicles.jpg",
    heroImageAlt: "WARDOGS armored and air vehicles in intense combat",
    disclaimer: "Community-observed pre-release vendor data. Prices and progression gates are not final launch specifications.",
    columns: ["Vehicle", "Role", "Alpha price", "Observed gate", "Track"],
    sections: [
      {
        title: "Land Transport",
        description: "Mobility and logistics vehicles for moving players and supplies across the large map.",
        rows: [
          row("Bobcat", "Light transport", "$500", "Open purchase", "-"),
          row("Dune Buggy", "Fast transport", "$1,500", "Driver Level 10", "Driver"),
          row("Kodiak", "Utility transport", "$2,500", "Open purchase", "-"),
          row("Kodiak Pickup", "Cargo transport", "$3,000", "$15,000 unlock", "-"),
          row("Humvee", "Protected transport", "$3,000", "Driver Level 15", "Driver"),
          row("Kodiak M249", "Armed transport", "$3,750", "Driver Level 8", "Driver"),
          row("Humvee M249", "Armed transport", "$3,750", "Driver Level 25", "Driver"),
          row("Humvee Minigun", "Heavy armed transport", "$4,500", "Gate unread", "-"),
          row("Ural", "Logistics truck", "$5,000", "$60,000 unlock", "-"),
          row("Ural Defender", "Protected logistics", "$6,000", "Driver Level 30", "Driver"),
          row("Ural Defender M249", "Armed logistics", "$6,750", "Driver Level 40", "Driver")
        ]
      },
      {
        title: "Armor and Artillery",
        description: "High-cost battlefield assets that need infantry, supply, and route planning.",
        rows: [
          row("Flakpanzer Gepard", "Anti-air armor", "$8,000", "Wardog Level 45", "Wardog"),
          row("L2A6", "Main battle tank", "$14,000", "Wardog Level 35", "Wardog"),
          row("SPH-2", "Self-propelled artillery", "$10,000", "Wardog Level 55", "Wardog")
        ]
      },
      {
        title: "Aircraft",
        description: "Combat and transport helicopters with the steepest observed replacement costs.",
        rows: [
          row("AH-6M Miniguns", "Combat helicopter", "$7,000", "Gate unread", "-"),
          row("UH-1Y Miniguns", "Armed utility helicopter", "$8,000", "Gate unread", "-"),
          row("AH-6R Rockets", "Rocket helicopter", "$12,500", "Gate unread", "-"),
          row("Havoc", "Attack helicopter", "$18,000", "Gate unread", "-"),
          row("MH-6", "Light air transport", "$6,250", "Open purchase", "-"),
          row("UH-1Y", "Air transport", "$7,400", "Pilot Level 10", "Pilot")
        ]
      }
    ],
    insights: [
      "Vehicles are purchases from a persistent balance, so losing one matters after the match ends.",
      "Driver, Pilot, and Wardog gates create separate progression decisions instead of one universal vehicle level.",
      "The cheapest transport can generate more team value than armor when the real need is resupply or rotation."
    ],
    unknowns: [
      "Final durability, seat counts, fuel use, and weapon damage were not confirmed.",
      "Some lock conditions were unreadable in the Alpha vendor capture.",
      "Vehicle pricing and gates can change before Early Access."
    ],
    officialSources
  },
  {
    id: "ammo",
    title: "WARDOGS Ammunition Guide",
    description: "Every observed calibre, its available load families, Alpha pricing, and the weapon count associated with it.",
    countLabel: "14 calibres",
    dataAsOf: "Alpha 1 - 7 Aug 2026",
    heroImage: "/images/items/catalog-ammo.jpg",
    heroImageAlt: "WARDOGS ammunition details with battlefield context",
    disclaimer: "Community-observed pre-release ammunition data. Damage is a base input, not guaranteed player damage after range, armor, and hit location.",
    columns: ["Calibre", "Base damage", "Loads", "Standard per round", "Box price", "Weapons"],
    sections: [
      {
        title: "Every Calibre",
        description: "Observed ammunition records from the Alpha build, including incomplete entries that still identify a calibre family.",
        rows: [
          row(".45 ACP", "30", "3", "$1", "$10", "2"),
          row("9x19mm", "22", "3", "$1", "$10", "5"),
          row("5.45x39mm", "26", "3", "Not captured", "$15", "1"),
          row("5.56x45mm", "28", "3", "$1.50", "$15", "8"),
          row(".50 AE", "49", "3", "$4", "$20", "1"),
          row("7.62x54mmR", "55", "3", "$6", "$30", "4"),
          row(".45 Colt", "Not captured", "3", "Not captured", "$33", "1"),
          row("7.62x39mm", "42", "3", "Not captured", "$40", "1"),
          row(".308 Winchester", "60", "3", "$4", "$40", "3"),
          row(".50 Cal", "Not captured", "3", "$50", "$250", "1"),
          row(".338 Norma Magnum", "Not captured", "3", "Not captured", "Not captured", "Not captured"),
          row("12 Gauge", "Not captured", "2", "Not captured", "Not captured", "2"),
          row("12.7x55mm", "Not captured", "Not captured", "Not captured", "Not captured", "Not captured"),
          row("9x39mm", "Not captured", "Not captured", "Not captured", "Not captured", "Not captured")
        ]
      }
    ],
    insights: [
      "Full Metal Jacket, Hollow Point, and Armor Piercing are separate economic choices, not free damage toggles.",
      "Tracer variants were observed at the same price, making visibility the main trade rather than cash.",
      "Calibre cost changes the real lifetime cost of a weapon and should be considered before buying a large magazine."
    ],
    unknowns: [
      "Published base damage does not reveal final damage through armor or at range.",
      "Several calibre rows were present without complete vendor price data.",
      "Box size and load multipliers were not officially confirmed as final."
    ],
    officialSources
  },
  {
    id: "attachments",
    title: "WARDOGS Attachments Guide",
    description: "An Alpha 1 reference for 21 optics and 34 magazines, including magnification, zeroing, weight, capacity, and observed price.",
    countLabel: "21 optics + 34 magazines",
    dataAsOf: "Alpha 1 - 7 Aug 2026",
    heroImage: "/images/items/catalog-attachments.jpg",
    heroImageAlt: "WARDOGS weapon optics and magazine details in a close-up",
    disclaimer: "Community-observed pre-release attachment data. A listed attachment is not guaranteed to fit every weapon or retain the same tuning at launch.",
    columns: ["Attachment", "Kind", "Alpha price", "Zoom or capacity", "Weight or calibre"],
    sections: [
      {
        title: "Short Optics",
        description: "Close-range sights with fixed zeroing and low magnification.",
        rows: [
          row("Vektor Frenix-X Micro Reflex Sight", "Optic", "$820", "1.2x / fixed", "0.03 kg"),
          row("Four Reticle Reflex", "Optic", "$580", "1.2x / fixed", "0.12 kg"),
          row("Compact T-2 Red Dot", "Optic", "$340", "1.2x / fixed", "0.13 kg"),
          row("Holographic Sight", "Optic", "Not captured", "1.2x / fixed", "0.25 kg"),
          row("Kobra Reflex", "Optic", "$520", "1.2x / fixed", "0.41 kg"),
          row("OKP 7 Reflex", "Optic", "$840", "1.2x / fixed", "0.48 kg")
        ]
      },
      {
        title: "Medium Optics",
        description: "Prism and combat optics that trade more weight or ADS speed for range and zeroing options.",
        rows: [
          row("Tricon 1.5x Compact Prism Scope", "Optic", "$650", "1.5x / 100-200m", "0.2 kg"),
          row("CQ-2x Prism Combat Scope", "Optic", "$640", "2x / 100-300m", "0.31 kg"),
          row("2.5x Combat Optic", "Optic", "Not captured", "2.5x / 100-300m", "0.4 kg"),
          row("Spitfire 3x", "Optic", "$790", "3x / 100-300m", "0.26 kg"),
          row("3x Tactical Prism Scope", "Optic", "$740", "3x / 100-300m", "0.43 kg"),
          row("4x Combat Prism Scope with Reflex", "Optic", "$880", "4x / 100-400m", "0.42 kg"),
          row("Spectr 4x", "Optic", "Not captured", "4x / 100-400m", "0.66 kg")
        ]
      },
      {
        title: "Captured Optics With Incomplete Tooltips",
        description: "Named optic records whose complete Alpha tooltip values were not available.",
        rows: [
          row("3x-6x LPVO Short Dot", "Optic", "Not captured", "Variable", "Not captured"),
          row("6x Marksman Scope + Reflex", "Optic", "Not captured", "6x", "Not captured"),
          row("6x Precision Rifle Scope", "Optic", "Not captured", "6x", "Not captured"),
          row("CGM4 Scope", "Optic", "Not captured", "Not captured", "Not captured"),
          row("Frontier 2.5x-10x Precision Scope", "Optic", "Not captured", "2.5x-10x", "Not captured"),
          row("Mini Reflex Sight", "Optic", "Not captured", "Not captured", "Not captured"),
          row("MMGL Sight", "Optic", "Not captured", "Not captured", "Not captured"),
          row("PGO-7", "Optic", "Not captured", "Not captured", "Not captured")
        ]
      },
      {
        title: "Magazines",
        description: "Observed weapon-specific and shared magazine records. Prices marked as not captured should not be treated as free.",
        rows: [
          row("AK74 75 Round Drum Magazine", "Magazine", "Not captured", "75 rounds", "5.45x39mm"),
          row("AMP-9 15 Round Magazine", "Magazine", "$30", "15 rounds", "9x19mm"),
          row("AMP-9 30 Round Magazine", "Magazine", "$100", "30 rounds", "9x19mm"),
          row("AMP-9 50 Round Magazine", "Magazine", "$180", "50 rounds", "9x19mm"),
          row("AMR 50 10 Round Magazine", "Magazine", "$30", "10 rounds", ".50 Cal"),
          row("Deagle 7 Round Magazine", "Magazine", "$50", "7 rounds", ".50 AE"),
          row("FAL and BMR-308 20 Round Magazine", "Magazine", "$150", "20 rounds", ".308 Winchester"),
          row("Galil 35 Round Magazine", "Magazine", "$60", "35 rounds", "5.56x45mm"),
          row("Galil 50 Round Magazine", "Magazine", "$110", "50 rounds", "5.56x45mm"),
          row("GGX 33 Round Magazine", "Magazine", "$70", "33 rounds", "9x19mm"),
          row("GGX 50 Round Drum Magazine", "Magazine", "$110", "50 rounds", "9x19mm"),
          row("M1911 7 Round Magazine", "Magazine", "$20", "7 rounds", ".45 ACP"),
          row("M1911 10 Round Magazine", "Magazine", "$35", "10 rounds", ".45 ACP"),
          row("M249 100 Round Fabric Magazine", "Magazine", "$200", "100 rounds", "5.56x45mm"),
          row("MK22 5 Round Magazine", "Magazine", "$30", "5 rounds", ".308 Winchester"),
          row("MP5 20 Round Magazine", "Magazine", "$70", "20 rounds", "9x19mm"),
          row("MP5 30 Round Magazine", "Magazine", "$100", "30 rounds", "9x19mm"),
          row("MP5 50 Round Magazine", "Magazine", "$230", "50 rounds", "9x19mm"),
          row("PP-19 Vityaz 10 Round Magazine", "Magazine", "$25", "10 rounds", "9x19mm"),
          row("PP-19 Vityaz 30 Round Magazine", "Magazine", "Not captured", "30 rounds", "9x19mm"),
          row("PP-19 50 Round Magazine", "Magazine", "$200", "50 rounds", "9x19mm"),
          row("Super-45 13 Round Magazine", "Magazine", "$30", "13 rounds", ".45 ACP"),
          row("Super-45 30 Round Magazine", "Magazine", "$80", "30 rounds", ".45 ACP"),
          row("Super-45 40 Round Drum Magazine", "Magazine", "$280", "40 rounds", ".45 ACP"),
          row("SVD 5 Round Magazine", "Magazine", "$20", "5 rounds", "7.62x54mmR"),
          row("STANAG 20 Round Magazine", "Magazine", "Not captured", "20 rounds", "5.56x45mm"),
          row("STANAG 60 Round Magazine", "Magazine", "$420", "60 rounds", "5.56x45mm"),
          row("Mosin Standard Magazine", "Magazine", "Not captured", "Not captured", "7.62x54mmR"),
          row("MP43 Internal Magazine", "Magazine", "Not captured", "Not captured", "12 Gauge"),
          row("SV98 10 Round Magazine", "Magazine", "Not captured", "10 rounds", "7.62x54mmR"),
          row("SVD 10 Round Magazine", "Magazine", "Not captured", "10 rounds", "7.62x54mmR"),
          row("AMP-9 20 Round Magazine", "Magazine", "$70", "20 rounds", "9x19mm"),
          row("FAL 30 Round Magazine", "Magazine", "$250", "30 rounds", ".308 Winchester"),
          row("PKM 100 Round Box", "Magazine", "Not captured", "100 rounds", "7.62x54mmR")
        ]
      }
    ],
    insights: [
      "Optic weight and the direction of the ADS trade matter even when the game does not publish exact percentages.",
      "Magazine capacity adds purchase cost and can change handling, so the largest magazine is not automatically the best.",
      "Compatibility should be checked per weapon because the Alpha capture did not prove every attachment transfers across the roster."
    ],
    unknowns: [
      "Several optic prices displayed as zero or were missing and are listed here as not captured.",
      "Exact recoil and ADS modifiers were described qualitatively rather than numerically.",
      "The complete compatibility matrix can change before Early Access."
    ],
    officialSources
  },
  {
    id: "gear",
    title: "WARDOGS Gear Guide",
    description: "The observed wearable progression ladder for helmets, armor, and the first recorded backpack.",
    countLabel: "11 gear records",
    dataAsOf: "Alpha 1 - 7 Aug 2026",
    heroImage: "/images/items/catalog-gear.jpg",
    heroImageAlt: "WARDOGS helmets and armor options in an action setting",
    disclaimer: "Community-observed pre-release gear data. Protection values and movement penalties were not published as final numbers.",
    columns: ["Gear", "Slot", "Tier", "Alpha price"],
    sections: [
      {
        title: "Helmets",
        description: "Head protection and camouflage options observed in the gear vendor.",
        rows: [
          row("Light Helmet", "Helmet", "L1", "$200"),
          row("Medium Helmet", "Helmet", "L2", "$500"),
          row("Heavy Helmet", "Helmet", "L3", "$1,500"),
          row("Super Heavy Helmet", "Helmet", "L4", "$3,000"),
          row("Ghillie Helmet", "Helmet", "Special", "$2,500")
        ]
      },
      {
        title: "Armor",
        description: "Body armor tiers with rising replacement cost.",
        rows: [
          row("Light Armor", "Armor", "L1", "$400"),
          row("Medium Armor", "Armor", "L2", "$1,000"),
          row("Heavy Armor", "Armor", "L3", "$2,000"),
          row("Super Heavy Armor", "Armor", "L4", "$4,000"),
          row("Ghillie Armor", "Armor", "Special", "$3,000")
        ]
      },
      {
        title: "Backpacks",
        description: "Carry capacity competes with weight and the amount of cash exposed on death.",
        rows: [row("Scout Backpack", "Backpack", "Lightest", "$350")]
      }
    ],
    insights: [
      "Armor is a replacement-cost decision because purchased gear can be lost with the loadout.",
      "A heavier protection tier may reduce the cash left for ammunition, support tools, and repeated lives.",
      "Backpack capacity matters most for logistics and support roles that need to carry more than a primary weapon."
    ],
    unknowns: [
      "Exact protection, stamina, and movement modifiers were not captured.",
      "Vest and traversal slots were visible as categories but lacked complete item records.",
      "The recruit discount and level gates may change before Early Access."
    ],
    officialSources
  },
  {
    id: "equipment",
    title: "WARDOGS Equipment Guide",
    description: "Observed offensive, medical, recon, vehicle, building, and utility equipment from the Alpha build.",
    countLabel: "13 equipment items",
    dataAsOf: "Alpha 1 - 7 Aug 2026",
    heroImage: "/images/items/catalog-equipment.jpg",
    heroImageAlt: "WARDOGS tactical equipment and support tools",
    disclaimer: "Community-observed pre-release equipment data. Reconstructed names and vendor prices are clearly identified and may change.",
    columns: ["Equipment", "Role", "Alpha price", "Recorded identifier"],
    sections: [
      {
        title: "Offensive",
        description: "Deployable explosives for route denial and vehicle pressure.",
        rows: [
          row("Improvised Explosive Device", "Offensive", "$300", "IED"),
          row("AT Mine", "Offensive", "$650", "ATMine"),
          row("Claymore", "Offensive", "$900", "Claymore")
        ]
      },
      {
        title: "Medical",
        description: "Personal recovery and squad support tools.",
        rows: [
          row("Stimpen", "Medical", "$250", "StimPen"),
          row("Enox", "Medical", "$450", "Enox"),
          row("Defibrillator", "Medical", "$1,600", "Defibrillator"),
          row("Medical Bag", "Medical", "$2,000", "MedKit")
        ]
      },
      {
        title: "Recon and Vehicle Support",
        description: "Observation, ranging, fueling, and repair tools that create non-fragging roles.",
        rows: [
          row("Binoculars", "Recon", "$75", "Binoculars"),
          row("Rangefinder", "Recon", "$150", "RangeFinder"),
          row("Fuel Can", "Vehicle", "$150", "FuelCan"),
          row("Repair Tool", "Vehicle", "$150", "RepairTool")
        ]
      },
      {
        title: "Building and Utility",
        description: "Low-cost tools that support construction, concealment, and field systems.",
        rows: [
          row("M18 Smoke Grenade: White", "Building / Offensive", "$100", "SmokeGrenade"),
          row("Battery", "Utility", "$150", "Battery")
        ]
      }
    ],
    insights: [
      "Medical, repair, and logistics equipment lets a player earn value without focusing only on kills.",
      "Mines and explosives are most useful when paired with scouting and predictable vehicle routes.",
      "Low-cost recon and support tools can protect a persistent balance better than an expensive all-purpose kit."
    ],
    unknowns: [
      "Several display names were reconstructed from identifiers and need in-game confirmation.",
      "Charges, cooldowns, placement limits, and final effects were not confirmed.",
      "Mobile FOB upgrades and deployable defenses are covered separately because they were not all visible in the vendor table."
    ],
    officialSources
  },
  {
    id: "loadouts",
    title: "WARDOGS Loadout Guide",
    description: "A budget-first way to plan kits when weapons, ammunition, protection, tools, and vehicles all compete for persistent cash.",
    countLabel: "3 budget bands",
    dataAsOf: "Alpha 1 - 7 Aug 2026",
    heroImage: "/images/items/catalog-loadouts.jpg",
    heroImageAlt: "WARDOGS squad loadout planning and role balance",
    disclaimer: "Community-observed pre-release planning framework, not a final meta tier list. Build prices and balance can change before Early Access.",
    columns: ["Band", "Spending rule", "Best use", "Main risk"],
    sections: [
      {
        title: "Budget Bands",
        description: "Use the bands to control replacement cost before optimizing individual weapons.",
        rows: [
          row("Budget", "Protect most of the $10,000 starting balance", "Learning routes, support play, repeated lives", "Low armor and limited specialist tools"),
          row("Standard", "Balance weapon, ammunition, protection, and one job", "Regular squad play and objective pushes", "Can become unfocused if every slot is upgraded"),
          row("Full Budget", "Commit heavily to a specialist role or vehicle", "Coordinated armor, air, sniper, or demolition play", "One bad loss can remove multiple future options")
        ]
      }
    ],
    insights: [
      "The best loadout is the cheapest kit that can reliably perform one clear job for the squad.",
      "A complete build includes replacement ammunition and equipment, not only the weapon purchase.",
      "Persistent cash rewards disciplined support play and punishes buying an expensive kit without a plan."
    ],
    unknowns: [
      "Final death refunds, insurance behavior, and economy tuning were not confirmed.",
      "A stable meta cannot exist until the Closed Beta and Early Access balance are measured.",
      "Exact role builds should be treated as snapshots rather than permanent recommendations."
    ],
    officialSources
  }
] as const;

export function getCatalogGuide(id: string): CatalogGuide | undefined {
  return catalogGuides.find((guide) => guide.id === id);
}

export function getCatalogEntryCount(id: string): number {
  const guide = getCatalogGuide(id);
  return guide ? guide.sections.reduce((total, section) => total + section.rows.length, 0) : 0;
}
