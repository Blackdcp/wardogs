import type {WardogsItem} from "./item-library";
import {gameplayVideo, officialSteam, officialTeam17, sevenThingsVideo} from "./item-sources";

export const weaponItems = [
  {
    slug: "a-91",
    name: "A-91",
    type: "weapons",
    subtype: "Assault rifle",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The A-91 was an Assault XP rifle in Alpha 1, pairing 5.56x45mm ammunition with semi and burst fire in a 3.17 kg package.",
    description:
      "WARDOGS' A-91 occupied the controlled-burst side of the Alpha 1 assault-rifle roster. Its price was not captured, but the observed calibre, two fire settings, weight, and Assault XP track make it a model for deliberate lane pressure rather than assumptions about launch balance.",
    role: "Use the A-91 to place measured semi-automatic shots at distance and short bursts when a target crosses a busier lane; budget around the still-unknown purchase price before treating it as a default rifle.",
    strengths: [
      "Semi and burst settings give the Alpha 1 model two deliberate engagement rhythms.",
      "Its observed 5.56x45mm calibre sits in the catalogue's broadest weapon family.",
      "The 3.17 kg observed weight is lighter than the Alpha FAL and Galil records."
    ],
    cautions: [
      "The Alpha 1 purchase price was not captured, so a complete economy comparison is not possible.",
      "No full-auto setting appeared in the observed record; close pressure may demand disciplined bursts.",
      "STANAG magazines were catalogued separately, but model-specific A-91 compatibility was not confirmed."
    ],
    facts: [
      {label: "Alpha price", value: "Not captured", evidence: ["Pre-release Build"]},
      {label: "Ammunition", value: "5.56x45mm", evidence: ["Pre-release Build"]},
      {label: "Fire modes", value: "Semi / Burst", evidence: ["Pre-release Build"]},
      {label: "Weight", value: "3.17 kg", evidence: ["Pre-release Build"]},
      {label: "Progression", value: "Assault XP", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-playtest", "wardogs-early-access"],
    relatedItems: ["kh-2002", "bushmaster-m17s", "galil"],
    sources: [officialSteam, officialTeam17, gameplayVideo],
    detailImage: "/images/catalogue/weapons/a-91.webp",
    detailImageAlt: "A-91 assault rifle",
    observedPrice: "Not captured",
    observedProgressionOrGate: "Assault XP",
    observedAmmoOrVehicleClass: "5.56x45mm",
    confirmedFacts: [
      "Observed in Alpha 1: Ammunition: 5.56x45mm",
      "Observed in Alpha 1: Fire modes: Semi / Burst",
      "Observed in Alpha 1: Weight: 3.17 kg",
      "Observed in Alpha 1: Progression: Assault XP"
    ],
    unconfirmedFacts: [
      "The Alpha 1 price was not captured; Early Access and final release pricing remain unconfirmed.",
      "Damage, recoil, attachment compatibility, and balance may change for Early Access or final release."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 100,
    indexLocales: ["en"]
  },
  {
    slug: "ak74",
    name: "AK74",
    type: "weapons",
    subtype: "Assault rifle",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The Alpha 1 AK74 was a 3 kg Assault XP rifle using 5.45x39mm ammunition with semi and full-auto fire.",
    description:
      "The AK74 stood alone in the captured Alpha 1 roster as the only model tied to 5.45x39mm. That distinct ammunition economy, a semi/full-auto selector, and a recorded 3 kg weight define its pre-release identity even though its vendor price was not captured.",
    role: "Keep semi fire for ammunition control and switch to full auto for close pushes, while remembering that the AK74 commits the loadout to the less-shared 5.45x39mm supply line.",
    strengths: [
      "Semi and full-auto settings cover paced shots and immediate close-range pressure.",
      "At 3 kg in Alpha 1, it was lighter than the other captured assault-rifle records.",
      "A recorded 75-round AK74 drum offers a high-capacity context for loadout planning."
    ],
    cautions: [
      "The vendor price was not captured in Alpha 1.",
      "Only one captured weapon used 5.45x39mm, so ammunition sharing was narrower than 5.56x45mm.",
      "The 75-round drum's price, handling cost, and final availability were not captured."
    ],
    facts: [
      {label: "Alpha price", value: "Not captured", evidence: ["Pre-release Build"]},
      {label: "Ammunition", value: "5.45x39mm", evidence: ["Pre-release Build"]},
      {label: "Fire modes", value: "Semi / Full Auto", evidence: ["Pre-release Build"]},
      {label: "Weight", value: "3 kg", evidence: ["Pre-release Build"]},
      {label: "Progression", value: "Assault XP", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-price", "wardogs-playtest"],
    relatedItems: ["galil", "fal", "a-91"],
    sources: [officialSteam, officialTeam17, sevenThingsVideo],
    detailImage: "/images/catalogue/weapons/ak74.webp",
    detailImageAlt: "AK74 assault rifle",
    observedPrice: "Not captured",
    observedProgressionOrGate: "Assault XP",
    observedAmmoOrVehicleClass: "5.45x39mm",
    confirmedFacts: [
      "Observed in Alpha 1: Ammunition: 5.45x39mm",
      "Observed in Alpha 1: Fire modes: Semi / Full Auto",
      "Observed in Alpha 1: Weight: 3 kg",
      "Observed in Alpha 1: Progression: Assault XP"
    ],
    unconfirmedFacts: [
      "The Alpha 1 price was not captured; Early Access and final release pricing remain unconfirmed.",
      "The drum price, final recoil, damage, and progression tuning remain unconfirmed for Early Access or final release."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 101,
    indexLocales: ["en"]
  },
  {
    slug: "amp-9",
    name: "AMP-9",
    type: "weapons",
    subtype: "SMG",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The AMP-9 was a $900 Medic XP SMG in Alpha 1, using 9x19mm with semi and full-auto fire at an observed 1.4 kg.",
    description:
      "The AMP-9 combined the lowest captured firearm weight among these 14 model records with a Medic XP gate and a documented family of four magazine sizes. Its Alpha 1 evidence points to a mobile support weapon whose total cost depends on magazine choice and 9x19mm supply, not just the $900 base price.",
    role: "Carry the AMP-9 when a medic needs a light primary for close protection, using semi fire to conserve 9x19mm and full auto when revives or objectives draw immediate pressure.",
    strengths: [
      "The 1.4 kg Alpha 1 weight leaves more room for medical tools and protection.",
      "Semi and full-auto fire let a support player choose economy or close-range output.",
      "Observed 15, 20, 30, and 50-round AMP-9 magazines support several capacity budgets."
    ],
    cautions: [
      "The $900 Alpha 1 price excludes ammunition and replacement magazine costs.",
      "The observed 50-round magazine cost $180, adding a meaningful premium to a budget SMG.",
      "Range performance, recoil, and damage falloff were not captured in the catalogue evidence."
    ],
    facts: [
      {label: "Alpha price", value: "$900", evidence: ["Pre-release Build"]},
      {label: "Ammunition", value: "9x19mm", evidence: ["Pre-release Build"]},
      {label: "Fire modes", value: "Semi / Full Auto", evidence: ["Pre-release Build"]},
      {label: "Weight", value: "1.4 kg", evidence: ["Pre-release Build"]},
      {label: "Progression", value: "Medic XP", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-price", "wardogs-alpha"],
    relatedItems: ["ggx-18", "ggx-17", "deagle"],
    sources: [officialSteam, officialTeam17, gameplayVideo],
    detailImage: "/images/catalogue/weapons/amp-9.webp",
    detailImageAlt: "AMP-9 submachine gun",
    observedPrice: "$900",
    observedProgressionOrGate: "Medic XP",
    observedAmmoOrVehicleClass: "9x19mm",
    confirmedFacts: [
      "Observed in Alpha 1: Alpha price: $900",
      "Observed in Alpha 1: Ammunition: 9x19mm",
      "Observed in Alpha 1: Fire modes: Semi / Full Auto",
      "Observed in Alpha 1: Weight: 1.4 kg",
      "Observed in Alpha 1: Progression: Medic XP"
    ],
    unconfirmedFacts: [
      "Damage, recoil, range behavior, and Medic XP requirements may change for Early Access or final release.",
      "Alpha 1 magazine prices and compatibility are not confirmed as final release values."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 102,
    indexLocales: ["en"]
  },
  {
    slug: "amr-50",
    name: "AMR 50",
    type: "weapons",
    subtype: "Sniper rifle",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The AMR 50 was an $8,800 Recon XP sniper rifle in Alpha 1, firing .50 Cal through a bolt-action, magazine-fed system at 12.5 kg.",
    description:
      "The AMR 50 sat at the extreme end of the captured weapon economy: it was the most expensive and heaviest of these 14 models. Its .50 Cal ammunition was also listed at $50 per round and $250 per box, making each deployment a specialist Recon commitment in Alpha 1.",
    role: "Deploy the AMR 50 from a prepared overwatch position where its replacement cost, 12.5 kg weight, and expensive ammunition are justified by targets that a lighter rifle cannot address as confidently.",
    strengths: [
      "The .50 Cal chambering gives the model a distinct heavy-rifle role in the Alpha catalogue.",
      "Bolt-action and magazine feeding support deliberate follow-up shots without a single-shot reload cycle.",
      "A recorded 10-round AMR 50 magazine cost $30, providing a concrete capacity option."
    ],
    cautions: [
      "The $8,800 Alpha 1 purchase price exposes a large part of a persistent balance.",
      "At 12.5 kg, the observed rifle was dramatically heavier than the BMR-308 and assault rifles.",
      ".50 Cal ammunition carried the highest captured per-round cost at $50 before any final balance changes."
    ],
    facts: [
      {label: "Alpha price", value: "$8,800", evidence: ["Pre-release Build"]},
      {label: "Ammunition", value: ".50 Cal", evidence: ["Pre-release Build"]},
      {label: "Fire modes", value: "Bolt-action / Magazine", evidence: ["Pre-release Build"]},
      {label: "Weight", value: "12.5 kg", evidence: ["Pre-release Build"]},
      {label: "Progression", value: "Recon XP", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-price", "wardogs-early-access"],
    relatedItems: ["bmr-308", "compound-bow", "fal"],
    sources: [officialSteam, officialTeam17, sevenThingsVideo],
    detailImage: "/images/catalogue/weapons/amr-50.webp",
    detailImageAlt: "AMR 50 sniper rifle",
    observedPrice: "$8,800",
    observedProgressionOrGate: "Recon XP",
    observedAmmoOrVehicleClass: ".50 Cal",
    confirmedFacts: [
      "Observed in Alpha 1: Alpha price: $8,800",
      "Observed in Alpha 1: Ammunition: .50 Cal",
      "Observed in Alpha 1: Fire modes: Bolt-action / Magazine",
      "Observed in Alpha 1: Weight: 12.5 kg",
      "Observed in Alpha 1: Progression: Recon XP"
    ],
    unconfirmedFacts: [
      "Damage against infantry, armor interaction, sway, and handling may change for Early Access or final release.",
      "The $8,800 rifle price and .50 Cal ammunition costs are Alpha 1 observations, not confirmed final release economy values."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 103,
    indexLocales: ["en"]
  },
  {
    slug: "bmr-308",
    name: "BMR-308",
    type: "weapons",
    subtype: "Marksman rifle",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The BMR-308 was a $6,000 semi-automatic Recon XP marksman rifle in Alpha 1, using .308 Winchester at 3.9 kg.",
    description:
      "The BMR-308 offered the Alpha 1 Recon track a semi-automatic middle ground between the massive AMR 50 and unconventional Compound Bow. Its .308 Winchester calibre also connected it to the FAL and a shared 20-round magazine record, although final compatibility cannot be assumed.",
    role: "Use the BMR-308 for repeated precision fire from medium and long sightlines, keeping enough cash for .308 Winchester and avoiding the close-range ammunition burn of an assault-rifle approach.",
    strengths: [
      "Semi-automatic fire allows faster correction than the AMR 50's observed bolt action.",
      "The 3.9 kg Alpha 1 weight was manageable beside the 12.5 kg heavy sniper record.",
      "A $150 20-round magazine was recorded for the FAL and BMR-308 family."
    ],
    cautions: [
      "The $6,000 Alpha 1 price makes a lost rifle expensive to replace.",
      ".308 Winchester standard ammunition was observed at $4 per round and $40 per box.",
      "Optic fit, magazine handling, damage, and effective range were not captured as final specifications."
    ],
    facts: [
      {label: "Alpha price", value: "$6,000", evidence: ["Pre-release Build"]},
      {label: "Ammunition", value: ".308 Winchester", evidence: ["Pre-release Build"]},
      {label: "Fire modes", value: "Semi automatic", evidence: ["Pre-release Build"]},
      {label: "Weight", value: "3.9 kg", evidence: ["Pre-release Build"]},
      {label: "Progression", value: "Recon XP", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-price", "wardogs-playtest"],
    relatedItems: ["amr-50", "fal", "compound-bow"],
    sources: [officialSteam, officialTeam17, gameplayVideo],
    detailImage: "/images/catalogue/weapons/bmr-308.webp",
    detailImageAlt: "BMR-308 marksman rifle",
    observedPrice: "$6,000",
    observedProgressionOrGate: "Recon XP",
    observedAmmoOrVehicleClass: ".308 Winchester",
    confirmedFacts: [
      "Observed in Alpha 1: Alpha price: $6,000",
      "Observed in Alpha 1: Ammunition: .308 Winchester",
      "Observed in Alpha 1: Fire modes: Semi automatic",
      "Observed in Alpha 1: Weight: 3.9 kg",
      "Observed in Alpha 1: Progression: Recon XP"
    ],
    unconfirmedFacts: [
      "Optic compatibility, recoil, damage, and range tuning remain unconfirmed for Early Access or final release.",
      "The observed $6,000 price and magazine economy may change before Early Access or final release."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 104,
    indexLocales: ["en"]
  },
  {
    slug: "bushmaster-m17s",
    name: "Bushmaster M17S",
    type: "weapons",
    subtype: "Assault rifle",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The Bushmaster M17S appeared at $0 in Alpha 1 as a 3.17 kg Assault XP rifle using 5.56x45mm with semi and burst fire.",
    description:
      "The Bushmaster M17S shared the A-91 and KH-2002's captured 5.56x45mm, semi/burst, 3.17 kg profile, but its vendor record displayed $0. That value must be read as an Alpha 1 observation rather than proof of a permanently free launch weapon.",
    role: "Treat the M17S as a controlled-burst assault option in the Alpha evidence, using the displayed $0 value only for historical loadout comparison until later builds confirm how it is acquired.",
    strengths: [
      "The displayed $0 Alpha 1 value reduced the captured base-weapon cost to zero.",
      "Semi and burst modes support measured fire instead of forcing full-auto expenditure.",
      "Its 5.56x45mm calibre belonged to the most widely represented ammunition family in the catalogue."
    ],
    cautions: [
      "A $0 pre-release vendor display may reflect starter access, placeholder data, or temporary tuning.",
      "The observed record did not include full-auto fire.",
      "Separate STANAG magazine records do not prove every capacity fits the M17S."
    ],
    facts: [
      {label: "Alpha price", value: "$0", evidence: ["Pre-release Build"]},
      {label: "Ammunition", value: "5.56x45mm", evidence: ["Pre-release Build"]},
      {label: "Fire modes", value: "Semi / Burst", evidence: ["Pre-release Build"]},
      {label: "Weight", value: "3.17 kg", evidence: ["Pre-release Build"]},
      {label: "Progression", value: "Assault XP", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-alpha", "wardogs-price", "wardogs-early-access"],
    relatedItems: ["a-91", "kh-2002", "galil"],
    sources: [officialSteam, officialTeam17, gameplayVideo],
    detailImage: "/images/catalogue/weapons/bushmaster-m17s.webp",
    detailImageAlt: "Bushmaster M17S assault rifle",
    observedPrice: "$0",
    observedProgressionOrGate: "Assault XP",
    observedAmmoOrVehicleClass: "5.56x45mm",
    confirmedFacts: [
      "Observed in Alpha 1: Alpha price: $0",
      "Observed in Alpha 1: Ammunition: 5.56x45mm",
      "Observed in Alpha 1: Fire modes: Semi / Burst",
      "Observed in Alpha 1: Weight: 3.17 kg",
      "Observed in Alpha 1: Progression: Assault XP"
    ],
    unconfirmedFacts: [
      "The displayed $0 Alpha 1 price is not confirmed for Early Access or final release.",
      "Acquisition rules, damage, recoil, and attachment compatibility may change for Early Access or final release."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 105,
    indexLocales: ["en"]
  },
  {
    slug: "compound-bow",
    name: "Compound Bow",
    type: "weapons",
    subtype: "Bow",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The Compound Bow was an $800, 1.3 kg Recon XP weapon in Alpha 1, using Standard Arrows with pull-and-release fire.",
    description:
      "The Compound Bow was the lightest captured model and the only weapon here built around Standard Arrows and pull-and-release timing. Its $800 Alpha 1 price made it inexpensive beside Recon rifles, but no arrow damage, recovery, velocity, or capacity values were captured.",
    role: "Use the bow as a lightweight Recon choice for players comfortable timing a draw and release, while carrying a sidearm for situations where a conventional magazine is more forgiving.",
    strengths: [
      "At 1.3 kg, it was the lightest of the 14 captured weapon models.",
      "The $800 Alpha 1 price was far below the BMR-308 and AMR 50 Recon options.",
      "Standard Arrows create a distinct supply choice outside firearm calibre families."
    ],
    cautions: [
      "Pull-and-release fire provides no observed semi or automatic fallback.",
      "Arrow damage, velocity, drop, recovery, and carried quantity were not captured.",
      "The catalogue has no standalone arrow item route or confirmed attachment matrix."
    ],
    facts: [
      {label: "Alpha price", value: "$800", evidence: ["Pre-release Build"]},
      {label: "Ammunition", value: "Standard Arrows", evidence: ["Pre-release Build"]},
      {label: "Fire modes", value: "Pull and Release", evidence: ["Pre-release Build"]},
      {label: "Weight", value: "1.3 kg", evidence: ["Pre-release Build"]},
      {label: "Progression", value: "Recon XP", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-price", "wardogs-playtest"],
    relatedItems: ["bmr-308", "amr-50", "ggx-17"],
    sources: [officialSteam, officialTeam17, sevenThingsVideo],
    detailImage: "/images/catalogue/weapons/compound-bow.webp",
    detailImageAlt: "Compound bow",
    observedPrice: "$800",
    observedProgressionOrGate: "Recon XP",
    observedAmmoOrVehicleClass: "Standard Arrows",
    confirmedFacts: [
      "Observed in Alpha 1: Alpha price: $800",
      "Observed in Alpha 1: Ammunition: Standard Arrows",
      "Observed in Alpha 1: Fire modes: Pull and Release",
      "Observed in Alpha 1: Weight: 1.3 kg",
      "Observed in Alpha 1: Progression: Recon XP"
    ],
    unconfirmedFacts: [
      "Arrow damage, velocity, recovery, and capacity remain unconfirmed for Early Access or final release.",
      "The $800 price and Recon XP requirements may change before Early Access or final release."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 106,
    indexLocales: ["en"]
  },
  {
    slug: "deagle",
    name: "Deagle",
    type: "weapons",
    subtype: "Sidearm",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The Deagle was a $900 .50 AE sidearm with semi-automatic fire in Alpha 1; its weight and progression were not captured.",
    description:
      "The Deagle carried a primary-weapon-sized $900 price in the Alpha 1 sidearm list and used the uncommon .50 AE calibre. A seven-round magazine was recorded at $50, but the missing weight and progression fields leave important loadout questions open.",
    role: "Choose the Deagle when a costly, low-capacity semi-automatic backup fits the plan, and account for .50 AE ammunition plus magazines before comparing it with cheaper sidearms.",
    strengths: [
      "Its .50 AE calibre was unique among the 14 captured weapon models.",
      "Semi-automatic operation avoids the slower pull-and-release or bolt-action cycles of specialist weapons.",
      "A specific seven-round Deagle magazine was captured, giving the sidearm a documented capacity context."
    ],
    cautions: [
      "The $900 Alpha 1 price matched the AMP-9 before ammunition or magazine costs.",
      "The recorded seven-round magazine cost $50 and limits error tolerance.",
      "Weight and progression were not captured, so the full acquisition and carry burden is unknown."
    ],
    facts: [
      {label: "Alpha price", value: "$900", evidence: ["Pre-release Build"]},
      {label: "Ammunition", value: ".50 AE", evidence: ["Pre-release Build"]},
      {label: "Fire modes", value: "Semi automatic", evidence: ["Pre-release Build"]},
      {label: "Weight", value: "Not captured", evidence: ["Pre-release Build"]},
      {label: "Progression", value: "Not captured", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-price", "wardogs-gameplay", "wardogs-alpha"],
    relatedItems: ["judge", "ggx-17", "ggx-18"],
    sources: [officialSteam, officialTeam17, gameplayVideo],
    detailImage: "/images/catalogue/weapons/deagle.webp",
    detailImageAlt: "Deagle sidearm",
    observedPrice: "$900",
    observedProgressionOrGate: "Not captured",
    observedAmmoOrVehicleClass: ".50 AE",
    confirmedFacts: [
      "Observed in Alpha 1: Alpha price: $900",
      "Observed in Alpha 1: Ammunition: .50 AE",
      "Observed in Alpha 1: Fire modes: Semi automatic"
    ],
    unconfirmedFacts: [
      "Weight and progression were not captured in Alpha 1 and remain unconfirmed for Early Access or final release.",
      "Damage, recoil, magazine behavior, and the $900 price may change before Early Access or final release."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 107,
    indexLocales: ["en"]
  },
  {
    slug: "fal",
    name: "FAL",
    type: "weapons",
    subtype: "Assault rifle",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The FAL was a $5,500 Assault XP rifle in Alpha 1, firing .308 Winchester in semi or full auto at an observed 4.25 kg.",
    description:
      "The FAL was the heaviest and most expensive captured assault rifle, exchanging the common 5.56x45mm economy for .308 Winchester and full-auto capability. Its recorded 20 and 30-round magazine options also carried higher prices than many smaller-calibre magazines.",
    role: "Use semi fire for controlled .308 Winchester expenditure and reserve full auto for short, decisive pressure, because the rifle, ammunition, and magazines all carried substantial Alpha 1 costs.",
    strengths: [
      "Semi and full-auto settings let the FAL shift between precision and close pressure.",
      "The .308 Winchester chambering distinguishes it from lighter 5.56x45mm assault rifles.",
      "Observed 20 and 30-round magazine records provide two concrete capacity choices."
    ],
    cautions: [
      "At $5,500 in Alpha 1, it cost far more than the captured Galil and AMP-9.",
      "The 4.25 kg observed weight was the highest among the Alpha assault-rifle records.",
      "A 30-round FAL magazine was listed at $250, and .308 standard rounds were $4 each."
    ],
    facts: [
      {label: "Alpha price", value: "$5,500", evidence: ["Pre-release Build"]},
      {label: "Ammunition", value: ".308 Winchester", evidence: ["Pre-release Build"]},
      {label: "Fire modes", value: "Semi / Full Auto", evidence: ["Pre-release Build"]},
      {label: "Weight", value: "4.25 kg", evidence: ["Pre-release Build"]},
      {label: "Progression", value: "Assault XP", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-price", "wardogs-early-access"],
    relatedItems: ["bmr-308", "galil", "ak74"],
    sources: [officialSteam, officialTeam17, sevenThingsVideo],
    detailImage: "/images/catalogue/weapons/fal.webp",
    detailImageAlt: "FAL assault rifle",
    observedPrice: "$5,500",
    observedProgressionOrGate: "Assault XP",
    observedAmmoOrVehicleClass: ".308 Winchester",
    confirmedFacts: [
      "Observed in Alpha 1: Alpha price: $5,500",
      "Observed in Alpha 1: Ammunition: .308 Winchester",
      "Observed in Alpha 1: Fire modes: Semi / Full Auto",
      "Observed in Alpha 1: Weight: 4.25 kg",
      "Observed in Alpha 1: Progression: Assault XP"
    ],
    unconfirmedFacts: [
      "Damage, recoil, full-auto control, and Assault XP requirements may change for Early Access or final release.",
      "The $5,500 price and recorded magazine costs are Alpha 1 observations, not confirmed final release values."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 108,
    indexLocales: ["en"]
  },
  {
    slug: "galil",
    name: "Galil",
    type: "weapons",
    subtype: "Assault rifle",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The Galil was a $2,200, 3.95 kg Assault XP rifle in Alpha 1, using 5.56x45mm with semi and full-auto fire.",
    description:
      "The Galil filled a mid-priced Alpha 1 assault role: more expensive and heavier than the burst-fire 5.56x45mm records, but cheaper than the .308 FAL and equipped with full auto. Dedicated 35 and 50-round magazine records add useful capacity context.",
    role: "Run the Galil as a flexible assault primary, pacing 5.56x45mm in semi fire across open ground and using full auto when the squad closes distance or clears a defended position.",
    strengths: [
      "Semi and full-auto modes support both conservation and close-range pressure.",
      "Dedicated 35 and 50-round Galil magazines were recorded in the Alpha catalogue.",
      "Its $2,200 Alpha 1 price sat well below the FAL while retaining automatic fire."
    ],
    cautions: [
      "The 3.95 kg observed weight was heavier than the A-91, AK74, M17S, and KH-2002.",
      "The 50-round magazine cost $110 in Alpha 1 before ammunition was added.",
      "Recoil, reload timing, damage, and attachment effects were not captured as final values."
    ],
    facts: [
      {label: "Alpha price", value: "$2,200", evidence: ["Pre-release Build"]},
      {label: "Ammunition", value: "5.56x45mm", evidence: ["Pre-release Build"]},
      {label: "Fire modes", value: "Semi / Full Auto", evidence: ["Pre-release Build"]},
      {label: "Weight", value: "3.95 kg", evidence: ["Pre-release Build"]},
      {label: "Progression", value: "Assault XP", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-price", "wardogs-playtest"],
    relatedItems: ["fal", "a-91", "ak74"],
    sources: [officialSteam, officialTeam17, gameplayVideo],
    detailImage: "/images/catalogue/weapons/galil.webp",
    detailImageAlt: "Galil assault rifle",
    observedPrice: "$2,200",
    observedProgressionOrGate: "Assault XP",
    observedAmmoOrVehicleClass: "5.56x45mm",
    confirmedFacts: [
      "Observed in Alpha 1: Alpha price: $2,200",
      "Observed in Alpha 1: Ammunition: 5.56x45mm",
      "Observed in Alpha 1: Fire modes: Semi / Full Auto",
      "Observed in Alpha 1: Weight: 3.95 kg",
      "Observed in Alpha 1: Progression: Assault XP"
    ],
    unconfirmedFacts: [
      "Recoil, damage, attachment fit, and Assault XP tuning remain unconfirmed for Early Access or final release.",
      "The Alpha 1 rifle and magazine prices may change before Early Access or final release."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 109,
    indexLocales: ["en"]
  },
  {
    slug: "ggx-17",
    name: "GGX 17",
    type: "weapons",
    subtype: "Sidearm",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The GGX 17 was a semi-automatic 9x19mm sidearm in Alpha 1; its price, weight, and progression were not captured.",
    description:
      "The GGX 17 represented the conventional semi-automatic half of the captured GGX sidearm pair. Its 9x19mm calibre connects it to the cheapest observed ammunition box, but three missing vendor fields prevent a reliable total-cost or carry-weight comparison.",
    role: "Use the GGX 17 as a paced 9x19mm backup rather than a substitute for the GGX 18's observed full auto, and leave budget room until its acquisition price is confirmed in a later build.",
    strengths: [
      "Semi-automatic fire encourages controlled backup shots and ammunition conservation.",
      "9x19mm standard ammunition was observed at $1 per round and $10 per box.",
      "Its shared calibre can simplify resupply beside the AMP-9 and GGX 18."
    ],
    cautions: [
      "Price, weight, and progression were all missing from the Alpha 1 record.",
      "GGX-branded 33 and 50-round magazines were captured, but model-specific compatibility was not proven.",
      "Damage, recoil, capacity, and handling were not included in the weapon record."
    ],
    facts: [
      {label: "Alpha price", value: "Not captured", evidence: ["Pre-release Build"]},
      {label: "Ammunition", value: "9x19mm", evidence: ["Pre-release Build"]},
      {label: "Fire modes", value: "Semi automatic", evidence: ["Pre-release Build"]},
      {label: "Weight", value: "Not captured", evidence: ["Pre-release Build"]},
      {label: "Progression", value: "Not captured", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-price", "wardogs-alpha"],
    relatedItems: ["ggx-18", "amp-9", "deagle"],
    sources: [officialSteam, officialTeam17, gameplayVideo],
    detailImage: "/images/catalogue/weapons/ggx-17.webp",
    detailImageAlt: "GGX 17 sidearm",
    observedPrice: "Not captured",
    observedProgressionOrGate: "Not captured",
    observedAmmoOrVehicleClass: "9x19mm",
    confirmedFacts: [
      "Observed in Alpha 1: Ammunition: 9x19mm",
      "Observed in Alpha 1: Fire modes: Semi automatic"
    ],
    unconfirmedFacts: [
      "Price, weight, and progression were not captured in Alpha 1 and remain unconfirmed for Early Access or final release.",
      "Magazine compatibility, damage, recoil, and capacity may change before Early Access or final release."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 110,
    indexLocales: ["en"]
  },
  {
    slug: "ggx-18",
    name: "GGX 18",
    type: "weapons",
    subtype: "Sidearm",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The GGX 18 was a 9x19mm sidearm with semi and full-auto fire in Alpha 1; price, weight, and progression were not captured.",
    description:
      "The GGX 18 differed from the GGX 17 through its observed full-auto option, giving the Alpha 1 sidearm roster a compact automatic role. That capability is clear in the record, but absent price, weight, progression, and confirmed magazine fit make any launch-value claim premature.",
    role: "Keep the GGX 18 on semi for ordinary backup use and reserve full auto for urgent close pressure, where rapid 9x19mm expenditure is worth the loss of ammunition control.",
    strengths: [
      "Semi and full-auto settings make it the more flexible captured GGX sidearm.",
      "9x19mm had a low observed standard cost of $1 per round and $10 per box.",
      "The shared calibre can align with an AMP-9-focused squad supply plan."
    ],
    cautions: [
      "The Alpha 1 record did not capture price, weight, or progression.",
      "Full-auto sidearm fire can consume a magazine rapidly even when ammunition is inexpensive.",
      "The $70 GGX 33-round and $110 50-round drum records do not prove final GGX 18 compatibility."
    ],
    facts: [
      {label: "Alpha price", value: "Not captured", evidence: ["Pre-release Build"]},
      {label: "Ammunition", value: "9x19mm", evidence: ["Pre-release Build"]},
      {label: "Fire modes", value: "Semi / Full Auto", evidence: ["Pre-release Build"]},
      {label: "Weight", value: "Not captured", evidence: ["Pre-release Build"]},
      {label: "Progression", value: "Not captured", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-price", "wardogs-alpha"],
    relatedItems: ["ggx-17", "amp-9", "deagle"],
    sources: [officialSteam, officialTeam17, sevenThingsVideo],
    detailImage: "/images/catalogue/weapons/ggx-18.webp",
    detailImageAlt: "GGX 18 sidearm",
    observedPrice: "Not captured",
    observedProgressionOrGate: "Not captured",
    observedAmmoOrVehicleClass: "9x19mm",
    confirmedFacts: [
      "Observed in Alpha 1: Ammunition: 9x19mm",
      "Observed in Alpha 1: Fire modes: Semi / Full Auto"
    ],
    unconfirmedFacts: [
      "Price, weight, and progression were not captured in Alpha 1 and remain unconfirmed for Early Access or final release.",
      "Full-auto tuning, magazine compatibility, recoil, and damage may change before Early Access or final release."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 111,
    indexLocales: ["en"]
  },
  {
    slug: "judge",
    name: "Judge",
    type: "weapons",
    subtype: "Sidearm",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The Judge was a $250 .45 Colt sidearm in Alpha 1, while its fire mode, weight, and progression were not captured.",
    description:
      "The Judge had the lowest non-zero captured weapon price at $250 and was the only listed model using .45 Colt. The ammunition catalogue showed a $33 box, but the missing fire mode, weight, and progression make its practical behavior less certain than its price.",
    role: "Treat the Judge as a low-base-cost sidearm candidate whose real combat rhythm still needs in-game confirmation, and include the comparatively expensive .45 Colt box when planning replacements.",
    strengths: [
      "The $250 Alpha 1 price was the lowest captured non-zero weapon purchase among these models.",
      "Its .45 Colt chambering gives it a distinct sidearm supply identity.",
      "A $33 .45 Colt ammunition box was observed, so at least part of the replacement economy is documented."
    ],
    cautions: [
      "Fire mode, weight, and progression were not captured in the Alpha 1 weapon record.",
      "No model-specific magazine or capacity record was available for the Judge.",
      "The $250 base price does not establish damage, reload speed, effective range, or final value."
    ],
    facts: [
      {label: "Alpha price", value: "$250", evidence: ["Pre-release Build"]},
      {label: "Ammunition", value: ".45 Colt", evidence: ["Pre-release Build"]},
      {label: "Fire modes", value: "Not captured", evidence: ["Pre-release Build"]},
      {label: "Weight", value: "Not captured", evidence: ["Pre-release Build"]},
      {label: "Progression", value: "Not captured", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-price", "wardogs-gameplay", "wardogs-playtest"],
    relatedItems: ["deagle", "ggx-17", "ggx-18"],
    sources: [officialSteam, officialTeam17, sevenThingsVideo],
    detailImage: "/images/catalogue/weapons/judge.webp",
    detailImageAlt: "Judge sidearm",
    observedPrice: "$250",
    observedProgressionOrGate: "Not captured",
    observedAmmoOrVehicleClass: ".45 Colt",
    confirmedFacts: [
      "Observed in Alpha 1: Alpha price: $250",
      "Observed in Alpha 1: Ammunition: .45 Colt"
    ],
    unconfirmedFacts: [
      "Fire mode, weight, and progression were not captured in Alpha 1 and remain unconfirmed for Early Access or final release.",
      "Capacity, reload behavior, damage, and the $250 price may change before Early Access or final release."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 112,
    indexLocales: ["en"]
  },
  {
    slug: "kh-2002",
    name: "KH-2002",
    type: "weapons",
    subtype: "Assault rifle",
    status: "pre-release-build",
    statusLabel: "Pre-release build",
    build: "Alpha 1 - 7 Aug 2026",
    summary: "The KH-2002 was a 3.17 kg Assault XP rifle in Alpha 1, using 5.56x45mm with semi and burst fire; its price was not captured.",
    description:
      "The KH-2002 completed the captured trio of 3.17 kg, 5.56x45mm burst-fire assault rifles. Unlike the M17S's displayed $0, its own Alpha 1 price was not captured, so model choice cannot be reduced to cost even where the headline facts overlap.",
    role: "Use the KH-2002 for controlled assault fire, choosing semi across longer lanes and burst for short exposure windows while later-build evidence is still needed to distinguish its economy and handling.",
    strengths: [
      "Semi and burst settings provide two controlled ammunition-use patterns.",
      "The 3.17 kg Alpha 1 weight was lighter than the Galil and FAL records.",
      "5.56x45mm was the most widely shared captured calibre, supporting broader squad resupply context."
    ],
    cautions: [
      "The Alpha 1 purchase price was not captured.",
      "The observed record does not establish how its handling differs from the A-91 or M17S.",
      "STANAG capacities and optic records exist, but KH-2002 compatibility was not confirmed."
    ],
    facts: [
      {label: "Alpha price", value: "Not captured", evidence: ["Pre-release Build"]},
      {label: "Ammunition", value: "5.56x45mm", evidence: ["Pre-release Build"]},
      {label: "Fire modes", value: "Semi / Burst", evidence: ["Pre-release Build"]},
      {label: "Weight", value: "3.17 kg", evidence: ["Pre-release Build"]},
      {label: "Progression", value: "Assault XP", evidence: ["Pre-release Build"]}
    ],
    relatedGuides: ["wardogs-gameplay", "wardogs-alpha", "wardogs-early-access"],
    relatedItems: ["a-91", "bushmaster-m17s", "galil"],
    sources: [officialSteam, officialTeam17, gameplayVideo],
    detailImage: "/images/catalogue/weapons/kh-2002.webp",
    detailImageAlt: "KH-2002 assault rifle",
    observedPrice: "Not captured",
    observedProgressionOrGate: "Assault XP",
    observedAmmoOrVehicleClass: "5.56x45mm",
    confirmedFacts: [
      "Observed in Alpha 1: Ammunition: 5.56x45mm",
      "Observed in Alpha 1: Fire modes: Semi / Burst",
      "Observed in Alpha 1: Weight: 3.17 kg",
      "Observed in Alpha 1: Progression: Assault XP"
    ],
    unconfirmedFacts: [
      "The Alpha 1 price was not captured; Early Access and final release pricing remain unconfirmed.",
      "Model-specific handling, damage, recoil, and attachment fit may change for Early Access or final release."
    ],
    detailUpdatedAt: "2026-08-18",
    priority: 113,
    indexLocales: ["en"]
  }
] satisfies readonly WardogsItem[];
