import type {WardogsItem} from "./item-library";
import {
  artilleryGuideVideo,
  gameplayVideo,
  officialSteam,
  officialTeam17,
  sevenThingsVideo,
  vehiclesExplainedVideo
} from "./item-sources";

export const vehicleItems: readonly WardogsItem[] = [
  {
    slug: "ah-6m-miniguns",
    name: "AH-6M Miniguns",
    type: "vehicles",
    subtype: "Combat helicopter",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The AH-6M Miniguns appeared as a $7,000 combat helicopter in Alpha 1, but its purchase gate could not be read.",
    description:
      "The AH-6M Miniguns is the armed member of the light AH-6 family captured in the Alpha 1 vendor. Its combat-helicopter label and $7,000 listing separate it from the transport-focused MH-6, while the unread gate and unrecorded weapon behavior keep this a role guide rather than a final performance sheet.",
    role: "Treat the AH-6M as a light aerial pressure option for short attack passes, then preserve the airframe between engagements because every replacement draws from the observed Alpha economy.",
    strengths: [
      "Its observed $7,000 Alpha 1 price was lower than the AH-6R Rockets and Havoc listings.",
      "The combat-helicopter role distinguishes it from the open-purchase MH-6 transport.",
      "The Miniguns designation gives squads a clear reason to compare it with the rocket-equipped AH-6R before buying."
    ],
    cautions: [
      "The Alpha 1 purchase gate was unreadable, so availability cannot be inferred from price alone.",
      "Minigun damage, ammunition, convergence, and effective range were not captured.",
      "Durability, crew requirements, handling, and countermeasures remain unknown."
    ],
    facts: [
      {label: "Role", value: "Combat helicopter", evidence: ["Pre-release Build"]},
      {label: "Alpha price", value: "$7,000", evidence: ["Pre-release Build"]},
      {label: "Observed gate", value: "Gate unread", evidence: ["Pre-release Build"]},
      {label: "Track", value: "-", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-price", "wardogs-alpha"],
    relatedItems: ["ah-6r-rockets", "mh-6"],
    sources: [officialSteam, officialTeam17, gameplayVideo],
    detailImage: "/images/catalogue/vehicles/ah-6m-miniguns.webp",
    detailImageAlt: "AH-6M Miniguns combat helicopter",
    observedPrice: "$7,000",
    observedProgressionOrGate: "Gate unread",
    observedAmmoOrVehicleClass: "Combat helicopter",
    confirmedFacts: [
      "Observed in Alpha 1: Role: Combat helicopter",
      "Observed in Alpha 1: Alpha price: $7,000"
    ],
    unconfirmedFacts: [
      "The unread Alpha 1 gate remains unconfirmed for Early Access or final release.",
      "Minigun performance, flight handling, durability, and the $7,000 price may change before Early Access or final release."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 200,
    indexLocales: ["en"]
  },
  {
    slug: "ah-6r-rockets",
    name: "AH-6R Rockets",
    type: "vehicles",
    subtype: "Rocket helicopter",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The AH-6R Rockets was listed as a $12,500 rocket helicopter in Alpha 1 with an unreadable gate.",
    description:
      "The AH-6R Rockets trades the light family's minigun identity for a rocket-helicopter role and a much higher captured price. That $12,500 Alpha 1 listing suggests a more deliberate purchase decision than the AH-6M, but no rocket payload, blast, reload, or lock condition was readable enough to treat as settled.",
    role: "Reserve the AH-6R for planned aerial strike windows where a squad can identify a valuable target and support a safe exit instead of exposing an expensive helicopter without coordination.",
    strengths: [
      "Its rocket-helicopter label identifies a different attack role from the AH-6M Miniguns.",
      "The observed family naming makes the AH-6M a direct cost-and-role comparison.",
      "At $12,500 in Alpha 1, it sat below the Havoc while remaining a dedicated combat aircraft."
    ],
    cautions: [
      "The purchase gate was unreadable in the Alpha 1 capture.",
      "Rocket count, splash damage, accuracy, and replenishment were not captured.",
      "The high observed replacement price increases the risk of unsupported attack runs."
    ],
    facts: [
      {label: "Role", value: "Rocket helicopter", evidence: ["Pre-release Build"]},
      {label: "Alpha price", value: "$12,500", evidence: ["Pre-release Build"]},
      {label: "Observed gate", value: "Gate unread", evidence: ["Pre-release Build"]},
      {label: "Track", value: "-", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-price", "wardogs-playtest"],
    relatedItems: ["ah-6m-miniguns", "havoc"],
    sources: [officialSteam, officialTeam17, sevenThingsVideo],
    detailImage: "/images/catalogue/vehicles/ah-6r-rockets.webp",
    detailImageAlt: "AH-6R Rockets helicopter",
    observedPrice: "$12,500",
    observedProgressionOrGate: "Gate unread",
    observedAmmoOrVehicleClass: "Rocket helicopter",
    confirmedFacts: [
      "Observed in Alpha 1: Role: Rocket helicopter",
      "Observed in Alpha 1: Alpha price: $12,500"
    ],
    unconfirmedFacts: [
      "The unread Alpha 1 gate remains unconfirmed for Early Access or final release.",
      "Rocket payload, damage, replenishment, handling, and price may change before Early Access or final release."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 201,
    indexLocales: ["en"]
  },
  {
    slug: "bobcat",
    name: "Bobcat",
    type: "vehicles",
    subtype: "Light transport",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The Bobcat was a $500 light transport with open purchase observed in the Alpha 1 vehicle vendor.",
    description:
      "The Bobcat occupied the lowest-priced end of the captured vehicle catalogue. Its light-transport role and observed open purchase make it the clearest Alpha 1 reference point for basic mobility, but the record does not establish seats, cargo room, protection, speed, or whether the same access survives into release builds.",
    role: "Use the Bobcat as a low-commitment movement purchase for short rotations and recovery trips when the squad needs mobility more than weapons, protection, or freight capacity.",
    strengths: [
      "The observed $500 price was the lowest among the 20 captured vehicle models.",
      "Open purchase was visible in Alpha 1, with no level track shown in the record.",
      "Its light-transport label keeps the purchase decision focused on movement rather than combat equipment."
    ],
    cautions: [
      "Open purchase was only observed in Alpha 1 and is not a final access promise.",
      "Seat count, storage, speed, durability, and terrain handling were not captured.",
      "A low vendor price does not establish low fuel, repair, or replacement pressure."
    ],
    facts: [
      {label: "Role", value: "Light transport", evidence: ["Pre-release Build"]},
      {label: "Alpha price", value: "$500", evidence: ["Pre-release Build"]},
      {label: "Observed gate", value: "Open purchase", evidence: ["Pre-release Build"]},
      {label: "Track", value: "-", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-price", "wardogs-early-access"],
    relatedItems: ["dune-buggy", "kodiak"],
    sources: [officialSteam, officialTeam17, sevenThingsVideo],
    detailImage: "/images/catalogue/vehicles/bobcat.webp",
    detailImageAlt: "Bobcat light transport",
    observedPrice: "$500",
    observedProgressionOrGate: "Open purchase",
    observedAmmoOrVehicleClass: "Light transport",
    confirmedFacts: [
      "Observed in Alpha 1: Role: Light transport",
      "Observed in Alpha 1: Alpha price: $500",
      "Observed in Alpha 1: Observed gate: Open purchase"
    ],
    unconfirmedFacts: [
      "Open purchase and the $500 price are Alpha 1 observations, not confirmed Early Access or final release rules.",
      "Capacity, protection, handling, storage, and operating costs remain unconfirmed for Early Access or final release."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 202,
    indexLocales: ["en"]
  },
  {
    slug: "dune-buggy",
    name: "Dune Buggy",
    type: "vehicles",
    subtype: "Fast transport",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The Dune Buggy appeared as a $1,500 fast transport behind Driver Level 10 in Alpha 1.",
    description:
      "The Dune Buggy was the captured catalogue's explicitly speed-oriented ground transport. Its Driver Level 10 gate and $1,500 Alpha 1 price place it above the Bobcat's entry mobility, but the word fast is a vendor role label rather than proof of final top speed, acceleration, grip, or crash tolerance.",
    role: "Choose the Dune Buggy for rapid scouting and route changes where arrival time matters more than protection, while avoiding plans that assume unverified passenger or cargo capacity.",
    strengths: [
      "Fast transport was the model's explicit Alpha 1 role label.",
      "The observed $1,500 price kept it below the larger Kodiak and Humvee families.",
      "Driver Level 10 made its captured progression requirement clear instead of unreadable."
    ],
    cautions: [
      "Final speed, acceleration, traction, and rollover behavior were not captured.",
      "The Driver Level 10 gate and $1,500 price may not survive beyond Alpha 1.",
      "No protection, seat count, or cargo specification was recorded."
    ],
    facts: [
      {label: "Role", value: "Fast transport", evidence: ["Pre-release Build"]},
      {label: "Alpha price", value: "$1,500", evidence: ["Pre-release Build"]},
      {label: "Observed gate", value: "Driver Level 10", evidence: ["Pre-release Build"]},
      {label: "Track", value: "Driver", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-alpha", "wardogs-price"],
    relatedItems: ["bobcat", "humvee"],
    sources: [officialSteam, officialTeam17, gameplayVideo],
    detailImage: "/images/catalogue/vehicles/dune-buggy.webp",
    detailImageAlt: "Dune Buggy fast transport",
    observedPrice: "$1,500",
    observedProgressionOrGate: "Driver Level 10",
    observedAmmoOrVehicleClass: "Fast transport",
    confirmedFacts: [
      "Observed in Alpha 1: Role: Fast transport",
      "Observed in Alpha 1: Alpha price: $1,500",
      "Observed in Alpha 1: Observed gate: Driver Level 10",
      "Observed in Alpha 1: Track: Driver"
    ],
    unconfirmedFacts: [
      "Driver Level 10 and the $1,500 price remain unconfirmed for Early Access or final release.",
      "Speed, handling, durability, seats, and cargo behavior may change before Early Access or final release."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 203,
    indexLocales: ["en"]
  },
  {
    slug: "flakpanzer-gepard",
    name: "Flakpanzer Gepard",
    type: "vehicles",
    subtype: "Anti-air armor",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The Flakpanzer Gepard was listed as $8,000 anti-air armor at Wardog Level 45 in Alpha 1.",
    description:
      "The Flakpanzer Gepard is the captured roster's dedicated anti-air armored model, pairing a Wardog progression gate with a price below the L2A6 and SPH-2. Its catalogue role supports an aircraft-denial reading, but target detection, gun behavior, armor, crew needs, and effective coverage were not documented as final systems.",
    role: "Position the Gepard to protect valuable ground assets and likely air approaches, keeping ground support nearby rather than treating an anti-air role as proof of safety against every threat.",
    strengths: [
      "Anti-air armor was a unique role among the 20 observed vehicle records.",
      "Its $8,000 Alpha 1 listing was cheaper than both other Wardog-track heavy assets.",
      "Wardog Level 45 provided a readable progression target in the captured vendor."
    ],
    cautions: [
      "Detection range, ammunition, gun damage, elevation, and target tracking were not captured.",
      "The anti-air label does not establish protection against tanks, artillery, or infantry.",
      "Wardog Level 45 and the $8,000 price are pre-release observations only."
    ],
    facts: [
      {label: "Role", value: "Anti-air armor", evidence: ["Pre-release Build"]},
      {label: "Alpha price", value: "$8,000", evidence: ["Pre-release Build"]},
      {label: "Observed gate", value: "Wardog Level 45", evidence: ["Pre-release Build"]},
      {label: "Track", value: "Wardog", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-factions", "wardogs-price"],
    relatedItems: ["l2a6", "sph-2", "havoc"],
    sources: [officialSteam, officialTeam17, sevenThingsVideo],
    detailImage: "/images/catalogue/vehicles/flakpanzer-gepard.webp",
    detailImageAlt: "Flakpanzer Gepard anti-air armor",
    observedPrice: "$8,000",
    observedProgressionOrGate: "Wardog Level 45",
    observedAmmoOrVehicleClass: "Anti-air armor",
    confirmedFacts: [
      "Observed in Alpha 1: Role: Anti-air armor",
      "Observed in Alpha 1: Alpha price: $8,000",
      "Observed in Alpha 1: Observed gate: Wardog Level 45",
      "Observed in Alpha 1: Track: Wardog"
    ],
    unconfirmedFacts: [
      "Wardog Level 45 and the $8,000 price remain unconfirmed for Early Access or final release.",
      "Armor, anti-air detection, weapon performance, crew needs, and ammunition may change before Early Access or final release."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 204,
    indexLocales: ["en"]
  },
  {
    slug: "havoc",
    name: "Havoc",
    type: "vehicles",
    subtype: "Attack helicopter",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The Havoc was the $18,000 attack helicopter in Alpha 1 and the captured vendor did not reveal its gate.",
    description:
      "The Havoc sat at the top of the observed vehicle price list and carried the broad attack-helicopter role rather than an AH-6 weapon-specific label. That makes it the heaviest economic air commitment in the Alpha 1 snapshot, while its loadout, armor, crew arrangement, and access condition remain unavailable for a final comparison.",
    role: "Commit the Havoc only when the team can support a high-value attack-aircraft purchase with target information, airspace awareness, and a route away from concentrated return fire.",
    strengths: [
      "Attack helicopter was its explicit Alpha 1 role, separating it from transport aircraft.",
      "Its $18,000 listing marks the clearest high-investment aircraft choice in the observed vendor.",
      "The role offers a useful comparison point for the cheaper AH-6M and AH-6R attack variants."
    ],
    cautions: [
      "The purchase gate was unreadable, so the path to access was not captured.",
      "Weapons, armor, sensors, countermeasures, and crew requirements were not recorded.",
      "The highest observed vehicle price makes any unsupported purchase especially consequential in the Alpha economy."
    ],
    facts: [
      {label: "Role", value: "Attack helicopter", evidence: ["Pre-release Build"]},
      {label: "Alpha price", value: "$18,000", evidence: ["Pre-release Build"]},
      {label: "Observed gate", value: "Gate unread", evidence: ["Pre-release Build"]},
      {label: "Track", value: "-", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-price", "wardogs-playtest"],
    relatedItems: ["ah-6r-rockets", "flakpanzer-gepard"],
    sources: [officialSteam, officialTeam17, gameplayVideo],
    detailImage: "/images/catalogue/vehicles/havoc.webp",
    detailImageAlt: "Havoc attack helicopter",
    observedPrice: "$18,000",
    observedProgressionOrGate: "Gate unread",
    observedAmmoOrVehicleClass: "Attack helicopter",
    confirmedFacts: [
      "Observed in Alpha 1: Role: Attack helicopter",
      "Observed in Alpha 1: Alpha price: $18,000"
    ],
    unconfirmedFacts: [
      "The unread Alpha 1 gate remains unconfirmed for Early Access or final release.",
      "Loadout, armor, crew arrangement, flight model, countermeasures, and price may change before Early Access or final release."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 205,
    indexLocales: ["en"]
  },
  {
    slug: "humvee-m249",
    name: "Humvee M249",
    type: "vehicles",
    subtype: "Armed transport",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The Humvee M249 combined an armed-transport role, a $3,750 Alpha 1 price, and a Driver Level 25 gate.",
    description:
      "The Humvee M249 adds a named support weapon to the protected Humvee platform without reaching the Minigun variant's captured price. Its Driver Level 25 gate was much later than the Kodiak M249's, so the two $3,750 armed transports represented different progression decisions even though weapon performance and mounting details were not recorded.",
    role: "Use the Humvee M249 to move a small team while giving a passenger or gunner a defensive firing role, and plan routes that do not depend on the unconfirmed protection of the mount or cabin.",
    strengths: [
      "The observed armed-transport role combines movement and a named M249 mount.",
      "Its $3,750 Alpha 1 price was $750 above the unarmed Humvee and below the Minigun model.",
      "Driver Level 25 clearly distinguished its progression from the Driver Level 8 Kodiak M249."
    ],
    cautions: [
      "M249 ammunition, traverse, protection, accuracy, and gunner exposure were not captured.",
      "The Driver Level 25 gate is an Alpha 1 observation, not a final unlock requirement.",
      "Seat count, cabin protection, cargo capacity, and repair behavior remain unknown."
    ],
    facts: [
      {label: "Role", value: "Armed transport", evidence: ["Pre-release Build"]},
      {label: "Alpha price", value: "$3,750", evidence: ["Pre-release Build"]},
      {label: "Observed gate", value: "Driver Level 25", evidence: ["Pre-release Build"]},
      {label: "Track", value: "Driver", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-alpha", "wardogs-price"],
    relatedItems: ["humvee", "humvee-minigun", "kodiak-m249"],
    sources: [officialSteam, officialTeam17, sevenThingsVideo],
    detailImage: "/images/catalogue/vehicles/humvee-m249.webp",
    detailImageAlt: "Humvee M249 armed transport",
    observedPrice: "$3,750",
    observedProgressionOrGate: "Driver Level 25",
    observedAmmoOrVehicleClass: "Armed transport",
    confirmedFacts: [
      "Observed in Alpha 1: Role: Armed transport",
      "Observed in Alpha 1: Alpha price: $3,750",
      "Observed in Alpha 1: Observed gate: Driver Level 25",
      "Observed in Alpha 1: Track: Driver"
    ],
    unconfirmedFacts: [
      "Driver Level 25 and the $3,750 price remain unconfirmed for Early Access or final release.",
      "M249 behavior, protection, seats, cargo capacity, and handling may change before Early Access or final release."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 206,
    indexLocales: ["en"]
  },
  {
    slug: "humvee-minigun",
    name: "Humvee Minigun",
    type: "vehicles",
    subtype: "Heavy armed transport",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The Humvee Minigun was a $4,500 heavy armed transport in Alpha 1, with its gate unread in the vendor capture.",
    description:
      "The Humvee Minigun was the most expensive captured Humvee and the only one labeled heavy armed transport. The extra $1,500 over the base model identifies a distinct Alpha 1 purchase tier, but the unread gate and missing weapon data prevent claims about fire rate, ammunition supply, armor, or value relative to the M249 variant.",
    role: "Treat the Humvee Minigun as a mobile heavy-fire platform that still needs a protected route, a coordinated gunner, and a disengagement plan rather than using it as unverified frontline armor.",
    strengths: [
      "Heavy armed transport was a distinct observed role within the Humvee family.",
      "The Minigun name separates its intended weapon identity from the cheaper M249 variant.",
      "Its $4,500 Alpha 1 price remained below the larger armed Ural Defender M249."
    ],
    cautions: [
      "The Alpha 1 gate was unreadable, leaving its access path unknown.",
      "Minigun ammunition, spool behavior, traverse, damage, and gunner exposure were not captured.",
      "Heavy armed transport is a role label and does not confirm tank-like protection."
    ],
    facts: [
      {label: "Role", value: "Heavy armed transport", evidence: ["Pre-release Build"]},
      {label: "Alpha price", value: "$4,500", evidence: ["Pre-release Build"]},
      {label: "Observed gate", value: "Gate unread", evidence: ["Pre-release Build"]},
      {label: "Track", value: "-", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-playtest", "wardogs-price"],
    relatedItems: ["humvee", "humvee-m249"],
    sources: [officialSteam, officialTeam17, gameplayVideo],
    detailImage: "/images/catalogue/vehicles/humvee-minigun.webp",
    detailImageAlt: "Humvee Minigun heavy armed transport",
    observedPrice: "$4,500",
    observedProgressionOrGate: "Gate unread",
    observedAmmoOrVehicleClass: "Heavy armed transport",
    confirmedFacts: [
      "Observed in Alpha 1: Role: Heavy armed transport",
      "Observed in Alpha 1: Alpha price: $4,500"
    ],
    unconfirmedFacts: [
      "The unread Alpha 1 gate remains unconfirmed for Early Access or final release.",
      "Minigun performance, vehicle protection, capacity, handling, and price may change before Early Access or final release."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 207,
    indexLocales: ["en"]
  },
  {
    slug: "humvee",
    name: "Humvee",
    type: "vehicles",
    subtype: "Protected transport",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The base Humvee was a $3,000 protected transport unlocked at Driver Level 15 in the Alpha 1 vendor.",
    description:
      "The unarmed Humvee defined the protected-transport baseline for its family in Alpha 1. It cost the same as the cargo-focused Kodiak Pickup and sat below both armed Humvees, but protected remains a class label: no armor threshold, seat layout, storage limit, or survivability comparison was captured.",
    role: "Use the base Humvee for protected personnel movement and contested-road rotations when a mounted weapon is less important than keeping the observed purchase cost below the armed variants.",
    strengths: [
      "Protected transport was its explicit Alpha 1 role rather than an inferred armor claim.",
      "The observed $3,000 price was lower than both weapon-equipped Humvee variants.",
      "Driver Level 15 placed it between the Dune Buggy and Humvee M249 on the captured Driver track."
    ],
    cautions: [
      "No armor value, damage model, seat count, or cargo limit was captured.",
      "Protected transport does not guarantee safety against mines, heavy weapons, or ambushes.",
      "Driver Level 15 and the $3,000 price may change after Alpha 1."
    ],
    facts: [
      {label: "Role", value: "Protected transport", evidence: ["Pre-release Build"]},
      {label: "Alpha price", value: "$3,000", evidence: ["Pre-release Build"]},
      {label: "Observed gate", value: "Driver Level 15", evidence: ["Pre-release Build"]},
      {label: "Track", value: "Driver", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-alpha", "wardogs-early-access"],
    relatedItems: ["humvee-m249", "humvee-minigun", "ural-defender"],
    sources: [officialSteam, officialTeam17, sevenThingsVideo],
    detailImage: "/images/catalogue/vehicles/humvee.webp",
    detailImageAlt: "Humvee protected transport",
    observedPrice: "$3,000",
    observedProgressionOrGate: "Driver Level 15",
    observedAmmoOrVehicleClass: "Protected transport",
    confirmedFacts: [
      "Observed in Alpha 1: Role: Protected transport",
      "Observed in Alpha 1: Alpha price: $3,000",
      "Observed in Alpha 1: Observed gate: Driver Level 15",
      "Observed in Alpha 1: Track: Driver"
    ],
    unconfirmedFacts: [
      "Driver Level 15 and the $3,000 price remain unconfirmed for Early Access or final release.",
      "Protection, seats, storage, mobility, fuel, and repair behavior may change before Early Access or final release."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 208,
    indexLocales: ["en"]
  },
  {
    slug: "kodiak-m249",
    name: "Kodiak M249",
    type: "vehicles",
    subtype: "Armed transport",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The Kodiak M249 was a $3,750 armed transport with a Driver Level 8 gate in Alpha 1.",
    description:
      "The Kodiak M249 was the earliest readable Driver-gated armed transport in the captured catalogue. It shared the Humvee M249's $3,750 price and role but appeared at Driver Level 8 instead of Level 25, making chassis choice and progression timing separate questions even before unrecorded handling, protection, and mount behavior are considered.",
    role: "Choose the Kodiak M249 when an early Driver-track squad wants mobile weapon support without stepping up to the protected Ural Defender family, while treating chassis performance as unconfirmed.",
    strengths: [
      "Driver Level 8 was the lowest observed level gate among armed ground vehicles.",
      "Its armed-transport role combines the Kodiak utility family with a named M249 mount.",
      "The $3,750 Alpha 1 price matched the later-gated Humvee M249 for a direct progression comparison."
    ],
    cautions: [
      "The record did not capture weapon ammunition, traverse, protection, or gunner exposure.",
      "Driver Level 8 does not prove the model will remain an early unlock.",
      "Its seating, cargo trade-off, handling, durability, and repair costs were not recorded."
    ],
    facts: [
      {label: "Role", value: "Armed transport", evidence: ["Pre-release Build"]},
      {label: "Alpha price", value: "$3,750", evidence: ["Pre-release Build"]},
      {label: "Observed gate", value: "Driver Level 8", evidence: ["Pre-release Build"]},
      {label: "Track", value: "Driver", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-alpha", "wardogs-price"],
    relatedItems: ["kodiak", "kodiak-pickup", "humvee-m249"],
    sources: [officialSteam, officialTeam17, gameplayVideo],
    detailImage: "/images/catalogue/vehicles/kodiak-m249.webp",
    detailImageAlt: "Kodiak M249 armed transport",
    observedPrice: "$3,750",
    observedProgressionOrGate: "Driver Level 8",
    observedAmmoOrVehicleClass: "Armed transport",
    confirmedFacts: [
      "Observed in Alpha 1: Role: Armed transport",
      "Observed in Alpha 1: Alpha price: $3,750",
      "Observed in Alpha 1: Observed gate: Driver Level 8",
      "Observed in Alpha 1: Track: Driver"
    ],
    unconfirmedFacts: [
      "Driver Level 8 and the $3,750 price remain unconfirmed for Early Access or final release.",
      "M249 behavior, seating, cargo, protection, handling, and durability may change before Early Access or final release."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 209,
    indexLocales: ["en"]
  },
  {
    slug: "kodiak-pickup",
    name: "Kodiak Pickup",
    type: "vehicles",
    subtype: "Cargo transport",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The Kodiak Pickup was listed as $3,000 cargo transport behind a $15,000 unlock in Alpha 1.",
    description:
      "The Kodiak Pickup is the only captured vehicle explicitly labeled cargo transport. Its vendor showed both a $3,000 purchase price and a separate $15,000 unlock, creating a two-stage Alpha 1 cost picture that differs from level-gated models; cargo volume, loading rules, and whether the unlock is permanent were not captured.",
    role: "Use the Kodiak Pickup for supply-oriented trips where a cargo role matters more than the base Kodiak's lower observed price or the M249 variant's weapon mount.",
    strengths: [
      "Cargo transport was a unique role in the observed vehicle list.",
      "The $3,000 Alpha 1 purchase price matched the base Humvee while serving a different logistics purpose.",
      "Its separate $15,000 unlock was readable, allowing the full observed entry cost to be discussed explicitly."
    ],
    cautions: [
      "The record does not explain whether the $15,000 unlock was permanent, repeatable, or account-bound.",
      "Cargo slots, loading interaction, item restrictions, and loss behavior were not captured.",
      "No protection, seats, speed, terrain handling, or fuel behavior was recorded."
    ],
    facts: [
      {label: "Role", value: "Cargo transport", evidence: ["Pre-release Build"]},
      {label: "Alpha price", value: "$3,000", evidence: ["Pre-release Build"]},
      {label: "Observed gate", value: "$15,000 unlock", evidence: ["Pre-release Build"]},
      {label: "Track", value: "-", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-price", "wardogs-early-access"],
    relatedItems: ["kodiak", "ural"],
    sources: [officialSteam, officialTeam17, sevenThingsVideo],
    detailImage: "/images/catalogue/vehicles/kodiak-pickup.webp",
    detailImageAlt: "Kodiak Pickup cargo transport",
    observedPrice: "$3,000",
    observedProgressionOrGate: "$15,000 unlock",
    observedAmmoOrVehicleClass: "Cargo transport",
    confirmedFacts: [
      "Observed in Alpha 1: Role: Cargo transport",
      "Observed in Alpha 1: Alpha price: $3,000",
      "Observed in Alpha 1: Observed gate: $15,000 unlock"
    ],
    unconfirmedFacts: [
      "The $15,000 unlock and $3,000 purchase price remain unconfirmed for Early Access or final release.",
      "Unlock persistence, cargo rules, capacity, seats, protection, and handling may change before Early Access or final release."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 210,
    indexLocales: ["en"]
  },
  {
    slug: "kodiak",
    name: "Kodiak",
    type: "vehicles",
    subtype: "Utility transport",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The base Kodiak appeared as a $2,500 utility transport with open purchase in Alpha 1.",
    description:
      "The base Kodiak sat between the Bobcat and specialized Kodiak variants in the observed vendor. Its utility-transport label and open-purchase state make it the family's general-purpose Alpha 1 entry, while the record leaves the exact utility - passenger space, storage, towing, or off-road behavior - undefined.",
    role: "Use the Kodiak as a general movement option when the squad does not need the Pickup's explicit cargo role or the M249 model's weapon mount, and verify practical capacity in the active build.",
    strengths: [
      "Open purchase was observed in Alpha 1 without a listed Driver or cash unlock track.",
      "Its $2,500 listing was cheaper than both specialized Kodiak variants.",
      "Utility transport gives it a broader observed role than the speed-focused Dune Buggy."
    ],
    cautions: [
      "Open purchase was an Alpha 1 state and may not remain available.",
      "The utility label does not specify seats, cargo, towing, protection, or terrain performance.",
      "The base model's differences from the Pickup beyond role and price were not captured."
    ],
    facts: [
      {label: "Role", value: "Utility transport", evidence: ["Pre-release Build"]},
      {label: "Alpha price", value: "$2,500", evidence: ["Pre-release Build"]},
      {label: "Observed gate", value: "Open purchase", evidence: ["Pre-release Build"]},
      {label: "Track", value: "-", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-price", "wardogs-early-access"],
    relatedItems: ["kodiak-pickup", "kodiak-m249", "bobcat"],
    sources: [officialSteam, officialTeam17, gameplayVideo],
    detailImage: "/images/catalogue/vehicles/kodiak.webp",
    detailImageAlt: "Kodiak utility transport",
    observedPrice: "$2,500",
    observedProgressionOrGate: "Open purchase",
    observedAmmoOrVehicleClass: "Utility transport",
    confirmedFacts: [
      "Observed in Alpha 1: Role: Utility transport",
      "Observed in Alpha 1: Alpha price: $2,500",
      "Observed in Alpha 1: Observed gate: Open purchase"
    ],
    unconfirmedFacts: [
      "Open purchase and the $2,500 price are not confirmed Early Access or final release rules.",
      "Seats, cargo, towing, protection, handling, fuel, and repair behavior remain unconfirmed for Early Access or final release."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 211,
    indexLocales: ["en"]
  },
  {
    slug: "l2a6",
    name: "L2A6",
    type: "vehicles",
    subtype: "Main battle tank",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The L2A6 was the $14,000 main battle tank gated at Wardog Level 35 in the Alpha 1 catalogue.",
    description:
      "The L2A6 carried the roster's only main-battle-tank label and the second-highest captured vehicle price. Its Wardog Level 35 gate arrived earlier than the Gepard and SPH-2 gates, but the Alpha 1 record did not establish armor zones, armament, crew positions, ammunition, mobility, or the support needed to keep it operational.",
    role: "Use the L2A6 as a team-supported heavy pressure asset for exposed lanes, pairing it with infantry awareness and logistics rather than assuming the main battle tank label removes positional risk.",
    strengths: [
      "Main battle tank was a unique observed class in the 20-model catalogue.",
      "Wardog Level 35 was the earliest readable gate among the three armor-and-artillery records.",
      "The $14,000 Alpha 1 price clearly separated it from transport and lighter anti-air armor."
    ],
    cautions: [
      "Armor values, weak points, weapons, ammunition, crew count, and repair systems were not captured.",
      "Its main battle tank role does not prove immunity to infantry, aircraft, or artillery threats.",
      "Wardog Level 35 and the $14,000 purchase price are not final progression or economy claims."
    ],
    facts: [
      {label: "Role", value: "Main battle tank", evidence: ["Pre-release Build"]},
      {label: "Alpha price", value: "$14,000", evidence: ["Pre-release Build"]},
      {label: "Observed gate", value: "Wardog Level 35", evidence: ["Pre-release Build"]},
      {label: "Track", value: "Wardog", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-factions", "wardogs-price"],
    relatedItems: ["flakpanzer-gepard", "sph-2"],
    sources: [officialSteam, officialTeam17, sevenThingsVideo],
    detailImage: "/images/catalogue/vehicles/l2a6.webp",
    detailImageAlt: "L2A6 main battle tank",
    observedPrice: "$14,000",
    observedProgressionOrGate: "Wardog Level 35",
    observedAmmoOrVehicleClass: "Main battle tank",
    confirmedFacts: [
      "Observed in Alpha 1: Role: Main battle tank",
      "Observed in Alpha 1: Alpha price: $14,000",
      "Observed in Alpha 1: Observed gate: Wardog Level 35",
      "Observed in Alpha 1: Track: Wardog"
    ],
    unconfirmedFacts: [
      "Wardog Level 35 and the $14,000 price remain unconfirmed for Early Access or final release.",
      "Armor, armament, ammunition, crew roles, mobility, fuel, and repairs may change before Early Access or final release."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 212,
    indexLocales: ["en"]
  },
  {
    slug: "mh-6",
    name: "MH-6",
    type: "vehicles",
    subtype: "Light air transport",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The MH-6 was a $6,250 light air transport with open purchase observed in Alpha 1.",
    description:
      "The MH-6 was the least expensive helicopter in the captured catalogue and the only aircraft with both a transport role and observed open purchase. It provides the non-combat comparison for the AH-6 family, but passenger positions, landing behavior, payload, survivability, and any pilot requirement outside the vendor gate were not recorded.",
    role: "Use the MH-6 for light aerial insertion, pickup, and fast repositioning when transport matters more than an onboard weapon label, keeping landing zones and return routes conservative.",
    strengths: [
      "Its $6,250 Alpha 1 price was the lowest observed aircraft listing.",
      "Open purchase was visible in the captured vendor instead of an unread or level gate.",
      "Light air transport gives it a distinct mobility role beside the armed AH-6 variants."
    ],
    cautions: [
      "Open purchase was only observed in Alpha 1 and is not a final availability promise.",
      "Seat count, passenger exposure, flight handling, durability, and landing tolerance were not captured.",
      "The transport label does not establish cargo capability or an unarmed final loadout."
    ],
    facts: [
      {label: "Role", value: "Light air transport", evidence: ["Pre-release Build"]},
      {label: "Alpha price", value: "$6,250", evidence: ["Pre-release Build"]},
      {label: "Observed gate", value: "Open purchase", evidence: ["Pre-release Build"]},
      {label: "Track", value: "-", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-first-look", "wardogs-early-access"],
    relatedItems: ["ah-6m-miniguns", "uh-1y"],
    sources: [officialSteam, officialTeam17, gameplayVideo],
    detailImage: "/images/catalogue/vehicles/mh-6.webp",
    detailImageAlt: "MH-6 light air transport",
    observedPrice: "$6,250",
    observedProgressionOrGate: "Open purchase",
    observedAmmoOrVehicleClass: "Light air transport",
    confirmedFacts: [
      "Observed in Alpha 1: Role: Light air transport",
      "Observed in Alpha 1: Alpha price: $6,250",
      "Observed in Alpha 1: Observed gate: Open purchase"
    ],
    unconfirmedFacts: [
      "Open purchase and the $6,250 price are not confirmed Early Access or final release rules.",
      "Seats, loadout, flight handling, durability, cargo behavior, and pilot requirements remain unconfirmed for Early Access or final release."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 213,
    indexLocales: ["en"]
  },
  {
    slug: "sph-2",
    name: "SPH-2",
    type: "vehicles",
    subtype: "Self-propelled artillery",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 and Closed Beta footage checked 2026-08-28",
    summary: "The SPH-2 is late-track self-propelled artillery whose crew, stabilization, aiming and reload flow were observed across Alpha and Closed Beta footage.",
    description:
      "The SPH-2 was the only self-propelled-artillery model in the captured vendor and carried a Wardog Level 55 gate. Later Closed Beta footage showed a three-position crew, a stabilization step, indirect range setting, 155 mm ammunition and a manual reload sequence. The Alpha capture listed a $10,000 purchase, while a later creator guide showed an $8,000 repeat purchase after a separate $400,000 unlock; that conflict is preserved as build evidence rather than flattened into a final price.",
    role: "Use the SPH-2 as a coordinated indirect-fire asset that depends on target information, protected firing positions, and logistics, then relocate when its position becomes predictable.",
    strengths: [
      "Stabilization keeps the sight picture usable for repeated indirect-fire corrections.",
      "Observed crew positions separate driving, the main 155 mm gun and top-cover defense.",
      "The manual reload input sequence can shorten the delay when completed correctly."
    ],
    cautions: [
      "The driver cannot fire while driving; a solo operator must stop and change seats.",
      "A predictable firing position is vulnerable to drones, aircraft, counter-battery fire and infantry hunters.",
      "Alpha and Beta footage disagree on purchase economics, so every price, gate, range and shell value must be checked in the current build."
    ],
    facts: [
      {label: "Role", value: "Self-propelled artillery", evidence: ["Pre-release Build"]},
      {label: "Alpha price", value: "$10,000", evidence: ["Pre-release Build"]},
      {label: "Observed gate", value: "Wardog Level 55", evidence: ["Pre-release Build"]},
      {label: "Track", value: "Wardog", evidence: ["Pre-release Build"]},
      {label: "Observed crew", value: "Driver / gunner / top gunner", evidence: ["Creator Footage"]},
      {label: "Observed shell", value: "155 mm high explosive", evidence: ["Creator Footage"]},
      {label: "Observed setup", value: "Stabilize before firing", evidence: ["Creator Footage"]}
    ],
    relatedGuides: ["wardogs-artillery-guide", "wardogs-gameplay", "wardogs-factions"],
    relatedItems: ["l2a6", "flakpanzer-gepard", "ural-defender"],
    sources: [officialSteam, officialTeam17, artilleryGuideVideo, vehiclesExplainedVideo],
    detailImage: "/images/catalogue/vehicles/sph-2.webp",
    detailImageAlt: "SPH-2 self-propelled artillery",
    observedPrice: "$10,000",
    observedProgressionOrGate: "Wardog Level 55",
    observedAmmoOrVehicleClass: "Self-propelled artillery",
    confirmedFacts: [
      "Observed in Alpha 1: Role: Self-propelled artillery",
      "Observed in Alpha 1: Alpha price: $10,000",
      "Observed in Alpha 1: Observed gate: Wardog Level 55",
      "Observed across creator footage: stabilize the platform before firing and use a manual reload sequence",
      "Observed across creator footage: driver, main-gun and top-gunner positions"
    ],
    unconfirmedFacts: [
      "The Alpha $10,000 purchase and later Beta $8,000 repeat purchase conflict; neither is confirmed for Early Access.",
      "The reported $400,000 unlock, Wardog Level 55 gate, effective range, blast, armor and ammunition economy may change before or during Early Access."
    ],
    detailUpdatedAt: "2026-08-28",
    priority: 214,
    indexLocales: ["en"]
  },
  {
    slug: "uh-1y-miniguns",
    name: "UH-1Y Miniguns",
    type: "vehicles",
    subtype: "Armed utility helicopter",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The UH-1Y Miniguns was an $8,000 armed utility helicopter in Alpha 1 with an unreadable gate.",
    description:
      "The UH-1Y Miniguns adds an armed-utility role to the larger UH-1Y family for only $600 above the base transport's captured price. That narrow Alpha 1 price gap makes the unread gate especially important: without access, weapon, seating, or payload details, the armed variant cannot be treated as a universally better transport.",
    role: "Use the UH-1Y Miniguns for escorted insertions and extraction routes where onboard covering fire may matter, while preserving the transport mission instead of chasing unverified weapon output.",
    strengths: [
      "Armed utility helicopter combines a transport-family identity with a named weapon fit.",
      "Its observed $8,000 price was only $600 above the base UH-1Y listing.",
      "The family pairing supports a clear armed-versus-transport purchase comparison."
    ],
    cautions: [
      "The Alpha 1 gate was unreadable, so access cannot be compared directly with the base model's Pilot gate.",
      "Minigun count, arcs, ammunition, damage, and gunner exposure were not captured.",
      "Passenger capacity, cargo behavior, durability, and handling differences remain unknown."
    ],
    facts: [
      {label: "Role", value: "Armed utility helicopter", evidence: ["Pre-release Build"]},
      {label: "Alpha price", value: "$8,000", evidence: ["Pre-release Build"]},
      {label: "Observed gate", value: "Gate unread", evidence: ["Pre-release Build"]},
      {label: "Track", value: "-", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-price", "wardogs-playtest"],
    relatedItems: ["uh-1y", "ah-6m-miniguns"],
    sources: [officialSteam, officialTeam17, gameplayVideo],
    detailImage: "/images/catalogue/vehicles/uh-1y-miniguns.webp",
    detailImageAlt: "UH-1Y Miniguns armed utility helicopter",
    observedPrice: "$8,000",
    observedProgressionOrGate: "Gate unread",
    observedAmmoOrVehicleClass: "Armed utility helicopter",
    confirmedFacts: [
      "Observed in Alpha 1: Role: Armed utility helicopter",
      "Observed in Alpha 1: Alpha price: $8,000"
    ],
    unconfirmedFacts: [
      "The unread Alpha 1 gate remains unconfirmed for Early Access or final release.",
      "Minigun behavior, seats, payload, durability, flight handling, and price may change before Early Access or final release."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 215,
    indexLocales: ["en"]
  },
  {
    slug: "uh-1y",
    name: "UH-1Y",
    type: "vehicles",
    subtype: "Air transport",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The base UH-1Y was a $7,400 air transport gated at Pilot Level 10 in Alpha 1.",
    description:
      "The base UH-1Y was the captured catalogue's progression-gated air transport, sitting above the open-purchase MH-6 and just below the armed UH-1Y Miniguns on price. Pilot Level 10 was readable in Alpha 1, but the model's seats, cargo, flight characteristics, protection, and exact differences from the armed variant were not documented.",
    role: "Use the UH-1Y for planned squad movement and repeated air logistics once the observed Pilot gate is met, choosing landing zones around transport safety rather than an absent weapon label.",
    strengths: [
      "Air transport was its explicit Alpha 1 role, distinct from light and armed helicopter classes.",
      "Pilot Level 10 provided the only readable Pilot-track gate in the captured vehicle set.",
      "The $7,400 observed price placed it between the MH-6 and UH-1Y Miniguns for family comparison."
    ],
    cautions: [
      "Pilot Level 10 and the $7,400 price are not confirmed final access rules.",
      "Passenger seats, cargo capacity, flight model, durability, and countermeasures were not captured.",
      "The air-transport label does not prove the model is unarmed or protected in later builds."
    ],
    facts: [
      {label: "Role", value: "Air transport", evidence: ["Pre-release Build"]},
      {label: "Alpha price", value: "$7,400", evidence: ["Pre-release Build"]},
      {label: "Observed gate", value: "Pilot Level 10", evidence: ["Pre-release Build"]},
      {label: "Track", value: "Pilot", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-first-look", "wardogs-alpha"],
    relatedItems: ["uh-1y-miniguns", "mh-6"],
    sources: [officialSteam, officialTeam17, sevenThingsVideo],
    detailImage: "/images/catalogue/vehicles/uh-1y.webp",
    detailImageAlt: "UH-1Y air transport",
    observedPrice: "$7,400",
    observedProgressionOrGate: "Pilot Level 10",
    observedAmmoOrVehicleClass: "Air transport",
    confirmedFacts: [
      "Observed in Alpha 1: Role: Air transport",
      "Observed in Alpha 1: Alpha price: $7,400",
      "Observed in Alpha 1: Observed gate: Pilot Level 10",
      "Observed in Alpha 1: Track: Pilot"
    ],
    unconfirmedFacts: [
      "Pilot Level 10 and the $7,400 price remain unconfirmed for Early Access or final release.",
      "Seats, cargo, loadout, protection, flight handling, and countermeasures may change before Early Access or final release."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 216,
    indexLocales: ["en"]
  },
  {
    slug: "ural-defender-m249",
    name: "Ural Defender M249",
    type: "vehicles",
    subtype: "Armed logistics",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The Ural Defender M249 was $6,750 armed logistics gated at Driver Level 40 in Alpha 1.",
    description:
      "The Ural Defender M249 was the peak of the captured Ural family: an armed-logistics role, a Driver Level 40 gate, and a $6,750 Alpha 1 price. It adds a named weapon to the protected Defender concept, but no record established how much cargo, protection, or mobility it gives up for the M249 mount.",
    role: "Use the Ural Defender M249 to escort valuable supply movement with an onboard defensive role, keeping route security and unloading priorities ahead of unsupported combat detours.",
    strengths: [
      "Armed logistics was a unique role among the observed vehicle models.",
      "The M249 designation separates it from both the base Ural and protected Defender.",
      "Driver Level 40 and $6,750 made its captured progression and purchase steps readable."
    ],
    cautions: [
      "M249 ammunition, arcs, protection, accuracy, and gunner exposure were not captured.",
      "Cargo capacity and the trade-off between logistics space and armament remain unknown.",
      "Driver Level 40 and the $6,750 price may change after Alpha 1."
    ],
    facts: [
      {label: "Role", value: "Armed logistics", evidence: ["Pre-release Build"]},
      {label: "Alpha price", value: "$6,750", evidence: ["Pre-release Build"]},
      {label: "Observed gate", value: "Driver Level 40", evidence: ["Pre-release Build"]},
      {label: "Track", value: "Driver", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-price", "wardogs-factions"],
    relatedItems: ["ural-defender", "ural", "kodiak-m249"],
    sources: [officialSteam, officialTeam17, sevenThingsVideo],
    detailImage: "/images/catalogue/vehicles/ural-defender-m249.webp",
    detailImageAlt: "Ural Defender M249 armed logistics truck",
    observedPrice: "$6,750",
    observedProgressionOrGate: "Driver Level 40",
    observedAmmoOrVehicleClass: "Armed logistics",
    confirmedFacts: [
      "Observed in Alpha 1: Role: Armed logistics",
      "Observed in Alpha 1: Alpha price: $6,750",
      "Observed in Alpha 1: Observed gate: Driver Level 40",
      "Observed in Alpha 1: Track: Driver"
    ],
    unconfirmedFacts: [
      "Driver Level 40 and the $6,750 price remain unconfirmed for Early Access or final release.",
      "Weapon behavior, cargo, protection, seating, mobility, and operating costs may change before Early Access or final release."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 217,
    indexLocales: ["en"]
  },
  {
    slug: "ural-defender",
    name: "Ural Defender",
    type: "vehicles",
    subtype: "Protected logistics",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The Ural Defender appeared as $6,000 protected logistics at Driver Level 30 in Alpha 1.",
    description:
      "The Ural Defender inserted a protected-logistics step between the base truck and armed M249 model. Its Driver Level 30 gate and $6,000 Alpha 1 price were readable, but protected is not a measured armor claim and the record does not define cargo volume, passenger seats, route performance, or the protection gained over the Ural.",
    role: "Use the Ural Defender for higher-risk supply routes where the observed protected-logistics role matters more than the base Ural's lower purchase price or the armed model's covering weapon.",
    strengths: [
      "Protected logistics was a distinct observed role rather than generic transport.",
      "The $6,000 Alpha 1 price placed it exactly between the Ural and Ural Defender M249.",
      "Driver Level 30 provided a readable progression step for the middle Ural variant."
    ],
    cautions: [
      "No armor rating, damage model, cargo capacity, or seat count was captured.",
      "Protected logistics does not confirm protection against every ambush or weapon type.",
      "Driver Level 30 and the $6,000 price remain pre-release observations."
    ],
    facts: [
      {label: "Role", value: "Protected logistics", evidence: ["Pre-release Build"]},
      {label: "Alpha price", value: "$6,000", evidence: ["Pre-release Build"]},
      {label: "Observed gate", value: "Driver Level 30", evidence: ["Pre-release Build"]},
      {label: "Track", value: "Driver", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-price", "wardogs-early-access"],
    relatedItems: ["ural", "ural-defender-m249", "humvee"],
    sources: [officialSteam, officialTeam17, gameplayVideo],
    detailImage: "/images/catalogue/vehicles/ural-defender.webp",
    detailImageAlt: "Ural Defender protected logistics truck",
    observedPrice: "$6,000",
    observedProgressionOrGate: "Driver Level 30",
    observedAmmoOrVehicleClass: "Protected logistics",
    confirmedFacts: [
      "Observed in Alpha 1: Role: Protected logistics",
      "Observed in Alpha 1: Alpha price: $6,000",
      "Observed in Alpha 1: Observed gate: Driver Level 30",
      "Observed in Alpha 1: Track: Driver"
    ],
    unconfirmedFacts: [
      "Driver Level 30 and the $6,000 price remain unconfirmed for Early Access or final release.",
      "Protection, cargo, seats, handling, fuel, repair, and loss behavior may change before Early Access or final release."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 218,
    indexLocales: ["en"]
  },
  {
    slug: "ural",
    name: "Ural",
    type: "vehicles",
    subtype: "Logistics truck",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The base Ural was a $5,000 logistics truck behind a $60,000 unlock in the Alpha 1 vendor.",
    description:
      "The base Ural anchored the dedicated logistics family with a $5,000 purchase price and the largest cash unlock visible in the captured vehicle catalogue. The separate $60,000 Alpha 1 unlock dominates its entry-cost discussion, yet the record does not explain unlock persistence or quantify cargo, passengers, protection, speed, or supply interactions.",
    role: "Use the Ural for planned bulk logistics and repeat supply routes after accounting for both observed cost layers, with escort and route discipline compensating for unrecorded protection.",
    strengths: [
      "Logistics truck was its explicit Alpha 1 role, separating it from ordinary personnel transport.",
      "Its $5,000 observed purchase price was lower than both Ural Defender variants.",
      "The $60,000 unlock was readable, exposing an important second cost instead of hiding it behind a level label."
    ],
    cautions: [
      "The record does not explain whether the $60,000 unlock was permanent, repeatable, shared, or refundable.",
      "Cargo capacity, loading rules, supply types, passenger seats, and loss behavior were not captured.",
      "No protection, handling, fuel, repair, or off-road specification was recorded."
    ],
    facts: [
      {label: "Role", value: "Logistics truck", evidence: ["Pre-release Build"]},
      {label: "Alpha price", value: "$5,000", evidence: ["Pre-release Build"]},
      {label: "Observed gate", value: "$60,000 unlock", evidence: ["Pre-release Build"]},
      {label: "Track", value: "-", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-price", "wardogs-early-access"],
    relatedItems: ["ural-defender", "ural-defender-m249", "kodiak-pickup"],
    sources: [officialSteam, officialTeam17, sevenThingsVideo],
    detailImage: "/images/catalogue/vehicles/ural.webp",
    detailImageAlt: "Ural logistics truck",
    observedPrice: "$5,000",
    observedProgressionOrGate: "$60,000 unlock",
    observedAmmoOrVehicleClass: "Logistics truck",
    confirmedFacts: [
      "Observed in Alpha 1: Role: Logistics truck",
      "Observed in Alpha 1: Alpha price: $5,000",
      "Observed in Alpha 1: Observed gate: $60,000 unlock"
    ],
    unconfirmedFacts: [
      "The $60,000 unlock and $5,000 purchase price remain unconfirmed for Early Access or final release.",
      "Unlock persistence, cargo rules, supply interactions, protection, seats, and handling may change before Early Access or final release."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 219,
    indexLocales: ["en"]
  }
];
