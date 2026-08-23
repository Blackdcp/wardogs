export type VideoArticle = {
  slug: string;
  title: string;
  description: string;
  youtubeId: string;
  sourceLabel: string;
  sourceUrl: string;
  publishedDate: string;
  updatedDate: string;
  kind: "official" | "creator";
  priority: number;
  internalGuideSlug: string;
  clips?: readonly {name: string; startOffset: number; endOffset?: number}[];
  quickAnswer: string;
  takeaways: string[];
  sections: {heading: string; body: string[]}[];
};

export const videoArticles: readonly VideoArticle[] = [
  {
    slug: "wardogs-10-reasons-not-to-buy",
    title: "WARDOGS 10 Reasons Not to Buy: Official Developer Breakdown",
    description:
      "A full WARDOGS buyer-intent article based on the official 10 Reasons Not to Buy footage, covering Early Access risk, scale, economy, teamwork, and performance expectations.",
    youtubeId: "ugkuP4a3xk4",
    sourceLabel: "WARDOGS: 10 Reasons NOT to Buy",
    sourceUrl: "https://www.youtube.com/watch?v=ugkuP4a3xk4",
    publishedDate: "2026-08-13",
    updatedDate: "2026-08-16",
    kind: "official",
    priority: 1,
    internalGuideSlug: "wardogs-early-access",
    quickAnswer:
      "This is the best WARDOGS video page for players who are close to buying but still uncertain. The useful answer is not simply yes or no: WARDOGS looks built for players who want large-scale tactical chaos, persistent cash pressure, vehicles, logistics, and unfinished Early Access risk in the same package.",
    takeaways: [
      "Treat the video as a buyer checklist before paying for Early Access.",
      "WARDOGS is aimed at players who enjoy team logistics, not only gunfights.",
      "Persistent cash makes deaths and loadout choices more serious than in a normal class shooter.",
      "Large matches, vehicles, FOBs, and destruction are the selling point and the main technical risk.",
      "Solo players can still have fun, but the footage strongly favors people who communicate and move with a group.",
      "The article should be read together with the Early Access, price, gameplay, and system requirement pages."
    ],
    sections: [
      {
        heading: "What this video is really answering",
        body: [
          "A title like 10 Reasons Not to Buy works because it matches a real WARDOGS search intent. Players are not only looking for hype; they want to know whether a huge tactical FPS can actually hold together when 100 players, vehicles, squad play, cash, and construction all collide in one match.",
          "That makes this page different from a trailer recap. The goal is to help a reader decide whether the rough edges are acceptable, whether the core loop fits their taste, and which parts of the game need more proof before launch."
        ]
      },
      {
        heading: "Reason one: the game asks for teamwork",
        body: [
          "WARDOGS does not look like a shooter where every player can ignore the team and still get the full experience. The strongest footage and official messaging keep returning to group movement, supply, transport, revives, and objective pressure.",
          "That is exciting if you like squad-based decisions. It is less ideal if you want a pure solo aim duel every life. A buyer should expect the game to reward people who can listen to callouts, share vehicles, protect supply routes, and retreat when the team needs to reset."
        ]
      },
      {
        heading: "Reason two: persistent cash adds pressure",
        body: [
          "The cash system is one of the most important WARDOGS ideas because it changes how players think about death. Instead of treating each spawn as disposable, players have to care about what they bought, what they can afford next, and whether a risky push is worth the cost.",
          "That can create memorable tension, but it also means some players may feel punished if they repeatedly rush alone. The right way to read the system is simple: cash is not just a shop currency. It is a pacing tool that pushes players toward smarter movement and useful team roles."
        ]
      },
      {
        heading: "Reason three: scale can become noise",
        body: [
          "The biggest WARDOGS promise is also the easiest place for the game to stumble. A 100-player battlefield with helicopters, armor, indirect fire, FOBs, and three-team pressure can produce moments that feel impossible in smaller shooters.",
          "The same scale can also overwhelm new players. The site should therefore prepare readers for controlled chaos rather than clean lanes. If WARDOGS succeeds, the appeal will be learning how to create order inside the mess: where to spawn, where to build, when to resupply, and when to stop chasing kills."
        ]
      },
      {
        heading: "Reason four: Early Access means uncertainty",
        body: [
          "Even official footage cannot prove launch stability, final balancing, queue health, long-term progression, or how quickly the team will patch problems. A player buying early is buying into a live development period, not a locked final product.",
          "That does not make WARDOGS a bad purchase. It means the honest recommendation is conditional. Buy early if the large-scale concept excites you enough to tolerate change. Wait if you need polished onboarding, stable balance, and mature content depth from day one."
        ]
      },
      {
        heading: "Who should buy, wait, or skip",
        body: [
          "Buy if you want an ambitious tactical shooter where support jobs, logistics, vehicles, and objectives can matter as much as raw kills. The concept is strongest for groups that enjoy experimenting and turning messy fights into team stories.",
          "Wait if your main question is performance, controller support, console timing, or how punishing the economy becomes after more players arrive. Skip for now if you dislike pre-release games, dislike communication-heavy matches, or only want a polished small-team competitive shooter."
        ]
      }
    ]
  },
  {
    slug: "wardogs-7-things-you-need-to-know",
    title: "WARDOGS 7 Things You Need to Know: Scale, Cash, FOBs, and Release",
    description:
      "A complete WARDOGS guide article based on the 7 Things You Need to Know video, covering 100-player matches, three-team warfare, persistent cash, mobile FOBs, Potato Mode, and Early Access timing.",
    youtubeId: "-k6IV0ITLDo",
    sourceLabel: "FGS: 7 Things You Need to Know About WARDOGS",
    sourceUrl: "https://www.youtube.com/watch?v=-k6IV0ITLDo",
    publishedDate: "2026-08-13",
    updatedDate: "2026-08-16",
    kind: "creator",
    priority: 2,
    internalGuideSlug: "wardogs-gameplay",
    clips: [
      {name: "100-player three-team warfare", startOffset: 0, endOffset: 66},
      {name: "Why the third team changes every fight", startOffset: 66, endOffset: 132},
      {name: "Persistent cash and loadout loss", startOffset: 132, endOffset: 199},
      {name: "Mobile FOBs and Hot Zones", startOffset: 199, endOffset: 262},
      {name: "Support roles and supply work", startOffset: 262, endOffset: 334},
      {name: "Potato Mode and Overkill Mode", startOffset: 334, endOffset: 408},
      {name: "Early Access timing", startOffset: 408}
    ],
    quickAnswer:
      "The FGS video is the broadest WARDOGS primer we have: it explains why the game is being searched so heavily, from 100-player three-team warfare to persistent cash, mobile FOBs, support roles, performance modes, and the current Early Access window.",
    takeaways: [
      "This is the best starting video page for players who only know the WARDOGS name.",
      "The biggest hook is scale: 100-player battles with vehicles and three teams instead of simple red-versus-blue lanes.",
      "Persistent cash changes how players buy gear, die, recover, and save for stronger loadouts.",
      "Mobile FOBs are not decoration; they shape spawn pressure, supplies, defenses, Hot Zone control, and team movement.",
      "Support play can matter because hauling supplies, reviving teammates, and transporting players all connect to progression.",
      "Performance expectations matter early because WARDOGS is an Unreal Engine 5 shooter with a promised low-end mode and a high-end mode."
    ],
    sections: [
      {
        heading: "The fast answer for new players",
        body: [
          "WARDOGS is not just another military shooter with a larger lobby number attached. The video presents it as a tactical FPS where scale, economy, logistics, and map control overlap. That is why a simple trailer page is not enough for this search term.",
          "The best way to understand the game is to think of each match as a moving operation. Infantry fights decide space, vehicles break stalemates, cash affects risk, FOBs keep teams alive, and the third faction makes every confident push less predictable."
        ]
      },
      {
        heading: "100 players and three teams",
        body: [
          "The first major idea is size. WARDOGS is built around 100-player battles where helicopters, armored transports, tanks, infantry groups, and objective fights can all appear in the same match. That creates the kind of footage that looks closer to a battlefield story than a short arena round.",
          "The second twist is the third team. Instead of only asking whether your side is beating the other side, WARDOGS can create fights where two teams are both exposed to a third. That matters because a winning push can suddenly become the weak side of a new triangle."
        ]
      },
      {
        heading: "Persistent cash and why deaths matter",
        body: [
          "The video's cash explanation is one of the most important beginner lessons. Players begin with money to buy armor, weapons, and gadgets, but the point is not only shopping. Money represents future options.",
          "If you die with purchased gear, that gear can be lost. If you earn through objectives, resources, support actions, and kills, cash can persist across rounds or matches. That turns survival into an economic decision and makes reckless solo rushing much less attractive."
        ]
      },
      {
        heading: "Mobile FOBs are the strategy layer",
        body: [
          "Forward Operating Bases give WARDOGS its clearest identity beyond scale. Players can deploy mobile FOBs, use them for supplies, and upgrade them into stronger positions with defensive tools and logistical value.",
          "The key is placement. A strong FOB needs useful terrain, access routes, room for deliveries, and enough protection to survive enemy attention. A bad FOB can become a cash sink. A good one can pull pressure toward your team and keep a fight alive."
        ]
      },
      {
        heading: "Support roles are not filler",
        body: [
          "One of the most useful details from the video is that WARDOGS can reward more than shooting. A player may earn value by reviving, supplying FOBs, transporting teammates, disrupting enemy resources, or using tools to damage bases and supply chains.",
          "That matters for a guide site because it creates multiple content angles. A beginner guide should not only teach aim and loadouts; it should explain how a player can contribute when they are broke, under-equipped, or not confident in direct fights."
        ]
      },
      {
        heading: "Performance modes and release expectations",
        body: [
          "The video also highlights WARDOGS as an Unreal Engine 5 project with different performance targets. Potato Mode is presented as the accessibility path for lower-end PCs, while Overkill Mode is positioned for stronger machines.",
          "For now, the practical advice is to separate confirmed platform timing from full-release assumptions. PC Early Access is the near-term focus, while console timing, final launch shape, and long-term balance need ongoing confirmation from official channels."
        ]
      }
    ]
  },
  {
    slug: "wardogs-loadout-gear-guide",
    title: "WARDOGS Loadout and Gear Guide: Weapons, Armor, Backpacks, and FOBs",
    description:
      "A complete WARDOGS loadout guide based on creator footage, covering starter gear, medical tools, armor tiers, tactical vests, backpacks, launchers, FOB kits, and spawn vehicles.",
    youtubeId: "J5QZXLENLgQ",
    sourceLabel: "WARDOGS All You Need To Know",
    sourceUrl: "https://www.youtube.com/watch?v=J5QZXLENLgQ",
    publishedDate: "2026-08-20",
    updatedDate: "2026-08-20",
    kind: "creator",
    priority: 2,
    internalGuideSlug: "wardogs-gameplay",
    clips: [
      {name: "Starter weapons and free resources", startOffset: 0, endOffset: 63},
      {name: "Explosives and breaching tools", startOffset: 63, endOffset: 136},
      {name: "Medical equipment and armor", startOffset: 136, endOffset: 203},
      {name: "Tactical vests and quick slots", startOffset: 203, endOffset: 267},
      {name: "Backpacks and weapon storage", startOffset: 267, endOffset: 343},
      {name: "Parachutes and specialist launchers", startOffset: 343, endOffset: 408},
      {name: "FOB kits and construction hammers", startOffset: 408, endOffset: 474},
      {name: "Mobile spawn vehicles", startOffset: 474}
    ],
    quickAnswer:
      "This creator walkthrough is a practical tour of the WARDOGS pre-match catalogue. It shows how free starter options, paid consumables, medical equipment, armor, storage, specialist launchers, FOB construction kits, and mobile spawn vehicles fit together. Prices, unlock levels, and capacities shown here come from the recorded test build and may change before Early Access.",
    takeaways: [
      "A basic rifle and limited resources can get a new player into the match without requiring an expensive first loadout.",
      "Consumables, explosives, medical tools, armor, storage, and specialist weapons compete for both cash and inventory space.",
      "Tactical vests primarily improve quick-slot access and handling, while backpacks determine the shapes and quantity of equipment a player can carry.",
      "Revive tools range from a limited starter option to defibrillators that require batteries, making medical preparation a real loadout decision.",
      "Anti-armor and anti-air launchers can create strong earning opportunities, but their unlock cost and ammunition model differ.",
      "The FOB starter kit and upgraded construction hammer connect inventory choices directly to team spawning, defenses, and logistics.",
      "Every price, level, stack size, and slot layout in the footage should be treated as build-specific rather than final launch documentation."
    ],
    sections: [
      {
        heading: "What the catalogue walkthrough actually shows",
        body: [
          "The video opens inside the pre-match catalogue, which makes it more useful than a normal combat montage for anyone trying to understand WARDOGS progression. Instead of only showing what a weapon looks like in a firefight, it follows the decisions that happen before deployment: what can be taken for free, which consumables cost cash, what must be unlocked, and how much space each tool occupies.",
          "The most important lesson is that a loadout is a budget and logistics plan, not simply a favorite gun. A player has to balance protection, healing, explosives, ammunition, carrying capacity, and specialist equipment. The footage comes from a test build, so the exact prices and level gates may change, but the relationships between those systems explain how WARDOGS wants players to prepare."
        ]
      },
      {
        heading: "Starter weapons, ammunition, and tactical consumables",
        body: [
          "The recorded build shows a zero-cost assault-rifle option, while magazines and ammunition add smaller expenses. It also shows a limited free resource selection and bandages that can be stacked. This gives a new or cash-poor player a way back into the match without forcing an all-or-nothing purchase, but a bare-minimum kit still has less staying power than a carefully supplied one.",
          "The tactical category includes colored smoke, fragmentation grenades, C4, an expensive remote detonator, breaching equipment, improvised explosives, anti-tank mines, and Claymore-style mines. The creator notes that players may sometimes bypass a formal breach with movement or parkour, so explosives are partly a question of speed and certainty. Smoke is the more universal tool because it can protect a revive, crossing, supply action, or retreat without requiring a kill."
        ]
      },
      {
        heading: "Medical gear and the cost of keeping a squad alive",
        body: [
          "The medical catalogue begins with bandages and a limited single-use revive resource. The walkthrough then shows a paid resuscitation unlock, personal medical supplies, defibrillators, batteries, adrenaline tools, and a larger medical kit. That progression suggests a medic loadout is built in layers: immediate self-care, the ability to recover another player, and enough supporting resources to keep doing the job through a longer fight.",
          "Defibrillators are especially important because the footage says they need batteries. Carrying the tool without its power supply can waste both money and inventory space. The creator also describes a teammate earning substantial cash through medical play, which reinforces the wider WARDOGS idea that useful support actions can fund future equipment. Exact payouts are not final, but the role clearly has an economic purpose as well as a tactical one."
        ]
      },
      {
        heading: "Armor tiers, helmets, and tactical vests",
        body: [
          "The video moves through several helmet and armor tiers, with stronger protection tied to progression and larger unlock costs. The visible sequence is useful for understanding direction rather than publishing a permanent price table: early protection is accessible, while later tiers ask for more playtime and investment. Players should therefore buy armor according to the job they expect to perform instead of assuming the most expensive set is always affordable or necessary.",
          "Tactical vests solve a different problem. In the footage, moving from small to medium and large vests opens more quick-access slots and improves actions such as reloading, equipping, and holstering. A vest does not replace backpack storage. Its value is access and handling under pressure, which means a support player carrying several tools may value a larger vest even when the raw armor increase is not the main reason for the purchase."
        ]
      },
      {
        heading: "Backpacks, grid shapes, and weapon storage",
        body: [
          "Backpacks use a grid-based inventory, and the walkthrough makes clear that total capacity is only half the problem. A divided bag can have enough empty squares overall but still reject a large item because the available spaces do not form the required shape. Players planning to carry FOB equipment, medical kits, explosives, or recovered weapons need to look at the layout as well as the advertised size.",
          "The creator compares starter and scout bags with larger options, then highlights high-level packs that include external weapon slots. Those weapon straps could be valuable for bringing an alternate gun into battle or extracting equipment without consuming the central grid. The practical beginner rule is simple: choose the smallest bag that safely carries the mission equipment, because paying for capacity that remains empty adds risk without improving the squad."
        ]
      },
      {
        heading: "Parachutes and specialist anti-vehicle weapons",
        body: [
          "Two parachute styles appear in the catalogue. The basic option is described as less controllable, while the sport version costs more to unlock and gives the player greater steering control. That difference can matter when deploying near an objective, rooftop, or friendly position: a cheaper entry tool gets a player down, while better control may reduce the risk of landing exposed or separated from the squad.",
          "The specialist section includes anti-tank equipment, a grenade launcher, an RPG, and a single-use anti-air missile. The anti-air option is presented as self-contained, while the RPG can be reloaded with separate ammunition. That distinction changes both inventory planning and cash exposure. A disposable launcher is easy to understand and carry for one decisive shot; a reloadable system can support repeated pressure but needs ammunition and a player willing to protect the investment."
        ]
      },
      {
        heading: "FOB kits, construction hammers, and team infrastructure",
        body: [
          "The FOB starter item is one of the largest pieces of equipment shown. The creator describes placing it directly from a quick slot without needing a hammer or construction material for the initial deployment. Once the base exists, construction tools become more important. An upgraded hammer can open access to stronger structures and defenses, including platforms and anti-air options shown in the build.",
          "This is where the catalogue connects to the larger match. Spending cash and backpack space on a FOB kit may reduce an individual player's combat load, but it can create a spawn and supply position for the entire team. The correct location still matters: a base that cannot be supplied or defended becomes an expensive target, while a well-placed one can shorten travel, support a Hot Zone push, and give a team somewhere to recover."
        ]
      },
      {
        heading: "Mobile spawn vehicles and the best beginner buying order",
        body: [
          "The final part of the transcript shows a deployable spawn vehicle. In the recorded rules, players need enough match score before using its spawn function, someone must drive the vehicle into position, and deaths around the active fight can trigger a respawn cooldown. That makes the vehicle more than transportation: it is mobile team infrastructure whose value depends on placement and survival.",
          "For a new player, the footage supports a conservative buying order. Start with the free or low-cost primary weapon, enough ammunition, bandages, and one role-defining tool. Add armor and storage only when the mission requires them, then invest in specialist launchers, advanced medical equipment, or FOB construction after learning how the team uses those systems. This preserves cash while giving every purchased slot a clear purpose."
        ]
      },
      {
        heading: "Build-specific numbers and what may change",
        body: [
          "The video mentions many exact values, including item prices, unlock costs, stack sizes, armor levels, bag dimensions, and progression requirements. Those numbers are valuable evidence of how the tested build was tuned, but they should not be treated as a final database. Economy and unlock pacing are among the easiest systems for a developer to adjust during testing and Early Access.",
          "Use this page to understand categories, tradeoffs, and preparation logic. Before making an expensive purchase in a live build, check the current in-game catalogue. That keeps the guide useful even after balance changes: free recovery options, role-based inventory planning, storage geometry, supply requirements, and the difference between personal gear and team infrastructure remain the durable lessons from the footage."
        ]
      }
    ]
  },
  {
    slug: "wardogs-gameplay-impressions",
    title: "WARDOGS Gameplay Impressions: What the First Creator Footage Shows",
    description:
      "A full WARDOGS gameplay impressions article based on creator footage, covering squad flow, marked pushes, tower fights, vehicles, revives, objective pressure, and pre-release caveats.",
    youtubeId: "eAE9LOV-p3s",
    sourceLabel: "jackfrags: WARDOGS Gameplay and Impressions",
    sourceUrl: "https://www.youtube.com/watch?v=eAE9LOV-p3s",
    publishedDate: "2026-08-13",
    updatedDate: "2026-08-16",
    kind: "creator",
    priority: 3,
    internalGuideSlug: "wardogs-gameplay",
    clips: [
      {name: "Capturing a tower and reading the zone", startOffset: 0, endOffset: 68},
      {name: "Hot Zones and healing", startOffset: 68, endOffset: 133},
      {name: "Building a first paid loadout", startOffset: 133, endOffset: 200},
      {name: "Dragging and reviving teammates", startOffset: 200, endOffset: 330},
      {name: "Helicopter pressure and squad recovery", startOffset: 330, endOffset: 724},
      {name: "FOB construction and defenses", startOffset: 724, endOffset: 927},
      {name: "Anti-air emplacements", startOffset: 927, endOffset: 1192},
      {name: "Finding enemy artillery", startOffset: 1192}
    ],
    quickAnswer:
      "The first gameplay impressions footage is useful because it shows WARDOGS as a communication-heavy battlefield: players mark pushes, fight over towers, react to vehicle pressure, regroup after chaos, and learn that staying with the team matters more than chasing isolated highlights.",
    takeaways: [
      "This page is the best match for users searching WARDOGS gameplay rather than release news.",
      "The footage shows objective movement and squad communication more clearly than official marketing copy.",
      "Tower pushes, markers, and callouts suggest that map awareness will be a real beginner skill.",
      "Vehicles and explosions make open movement risky, so players need to think about cover and routes.",
      "The article should keep final balance claims cautious because creator footage is still build-specific.",
      "Internal links should point readers to gameplay basics, factions, playtest access, and trailer context."
    ],
    sections: [
      {
        heading: "Why this footage matters",
        body: [
          "A store page can describe WARDOGS, but gameplay footage shows whether the concept has readable moment-to-moment flow. This video is valuable because it captures players moving through the map, reacting to markers, taking positions, and trying to keep a push from falling apart.",
          "That is exactly what searchers want from a gameplay page. They are trying to answer a feel question: does WARDOGS look like a real tactical shooter, a chaotic sandbox, or something in between?"
        ]
      },
      {
        heading: "Marked pushes and tower fights",
        body: [
          "The transcript repeatedly points toward basic squad coordination: players calling a marker, pushing toward a tower, checking danger around water or open ground, and trying to move as a group. Those details are small, but they are more useful than a highlight montage.",
          "For beginners, the lesson is direct. Do not treat the map as empty travel space. Towers, rooftops, roads, and approach lanes all become pressure points. If your squad is calling a marker, the marker is not flavor; it is the shared plan that keeps everyone from drifting into separate deaths."
        ]
      },
      {
        heading: "How the match rhythm appears",
        body: [
          "WARDOGS gameplay looks less like a clean sequence of small duels and more like a repeated cycle of push, contact, disruption, regroup, and push again. That rhythm is important because it explains why players can enjoy the game even when they are not winning every gunfight.",
          "The footage suggests that surviving long enough to keep pressure on the objective may matter as much as getting one flashy kill. Moving with teammates, staying supplied, and understanding when to slow down are all part of the practical loop."
        ]
      },
      {
        heading: "Vehicles and sudden chaos",
        body: [
          "Creator footage is especially good at showing how quickly a stable fight can become unstable. A squad can be moving toward a known target, then a vehicle, explosion, or angle from another team changes the entire situation.",
          "That does not make the game random. It means new players need habits that work under pressure: avoid bunching in obvious lanes, keep mental notes of nearby cover, and assume that a quiet approach can become loud without warning."
        ]
      },
      {
        heading: "What this video does not prove",
        body: [
          "The footage cannot prove final recoil, final time-to-kill, final vehicle balance, final server performance, or how launch matchmaking will feel. Any guide based on it needs to say that clearly.",
          "What it can prove is search-value: players can see WARDOGS creating readable battlefield stories. That is enough to make this page useful, as long as the article labels observations as footage-based instead of confirmed final rules."
        ]
      },
      {
        heading: "Best next pages after watching",
        body: [
          "After this gameplay page, readers should move into the main WARDOGS gameplay guide for confirmed systems, then the factions page for team structure, and the playtest page if they are trying to get hands-on access.",
          "That internal path turns a video visitor into a guide reader. It also helps Google understand that the video article is part of a wider WARDOGS knowledge base, not an isolated embed page."
        ]
      }
    ]
  },
  {
    slug: "wardogs-alpha-gameplay-impressions",
    title: "WARDOGS Alpha Gameplay Impressions: Early Build Combat Notes",
    description:
      "A complete WARDOGS alpha gameplay article summarizing early footage around explosions, infantry pushes, dragging and revives, vehicles, squad recovery, and build-sensitive rough edges.",
    youtubeId: "83AVH6FtemY",
    sourceLabel: "FRANKIEonPC: WARDOGS Alpha Gameplay and Impressions",
    sourceUrl: "https://www.youtube.com/watch?v=83AVH6FtemY",
    publishedDate: "2026-08-13",
    updatedDate: "2026-08-16",
    kind: "creator",
    priority: 4,
    internalGuideSlug: "wardogs-alpha",
    clips: [
      {name: "Alpha firefight opening", startOffset: 0, endOffset: 67},
      {name: "Heavy fire and battlefield pressure", startOffset: 67, endOffset: 135},
      {name: "Squad movement and recovery", startOffset: 135, endOffset: 199},
      {name: "Vehicles changing the fight", startOffset: 199, endOffset: 264},
      {name: "Revives and team spacing", startOffset: 264, endOffset: 331},
      {name: "Early-build combat flow", startOffset: 331, endOffset: 401},
      {name: "What the alpha does not prove", startOffset: 401}
    ],
    quickAnswer:
      "The alpha gameplay footage is valuable because it shows WARDOGS at its messiest and most useful stage for analysis: explosions interrupt movement, players drag and recover teammates, vehicles reshape fights, and the build shows promise without proving final polish.",
    takeaways: [
      "This page should satisfy searches for WARDOGS alpha footage and early gameplay impressions.",
      "Alpha clips are useful for combat feel, not for final balance or launch performance promises.",
      "Dragging, reviving, and recovery moments show why staying near teammates matters.",
      "Heavy weapons and vehicles can change a fight instantly, so positioning and spacing are beginner fundamentals.",
      "The article should highlight both the excitement and the uncertainty of a pre-release build.",
      "Readers should be routed toward alpha access, playtest dates, gameplay, and confirmed release pages."
    ],
    sections: [
      {
        heading: "How to read alpha gameplay",
        body: [
          "Alpha gameplay should not be treated like a final review. It is better understood as a field report from an early build: enough to judge direction, not enough to lock in final balance.",
          "That is why this article focuses on patterns from the footage. The question is not whether every weapon, animation, or vehicle interaction will remain unchanged. The question is what kind of battlefield WARDOGS is already trying to create."
        ]
      },
      {
        heading: "Explosions and battlefield pressure",
        body: [
          "One of the clearest impressions from the transcript is sudden violence: players reacting to heavy fire, artillery-like impacts, and chaotic moments where someone is knocked into danger before the squad fully understands what happened.",
          "For a beginner, the lesson is not simply that explosions look dramatic. It is that WARDOGS punishes players who stand still, group too tightly, or forget that vertical and indirect threats can reach them even when the immediate gunfight looks manageable."
        ]
      },
      {
        heading: "Dragging and reviving teammates",
        body: [
          "The recovery moments are some of the most important alpha signals. A teammate going down does not always mean the story ends; another player can move in, drag them away, and try to turn a bad position into a reset.",
          "That supports one of the site's core beginner messages: stay close enough to be helped, but not so close that one blast removes the whole group. Good spacing lets a squad rescue people without handing the enemy a cluster of easy targets."
        ]
      },
      {
        heading: "Vehicles make infantry think differently",
        body: [
          "Alpha footage also makes vehicles feel less like background props and more like match-shaping threats. Even when infantry players are focused on a nearby fight, a vehicle or heavy weapon can suddenly change what cover is safe.",
          "This is why a WARDOGS guide should teach route choice early. Cross open ground with a reason, check likely vehicle approaches, and avoid assuming that a building or ridge protects you from every angle."
        ]
      },
      {
        heading: "What feels promising",
        body: [
          "The promising part of this alpha footage is that WARDOGS already creates memorable squad stories: chaotic arrivals, panicked saves, confusing impacts, and moments where players have to improvise together.",
          "Those are exactly the moments that can make a large tactical shooter sticky. A player may forget an exact scoreline, but they remember the rescue, the failed push, or the vehicle that forced everyone to scatter."
        ]
      },
      {
        heading: "What remains uncertain",
        body: [
          "The alpha label matters. The footage cannot prove final netcode, final UI clarity, final economy tuning, final vehicle counterplay, or how well new players will understand the map.",
          "The correct conclusion is balanced: WARDOGS alpha footage is strong enough to deserve its own guide article, but every practical claim should be framed as observed early-build behavior until official pages or later tests confirm it."
        ]
      }
    ]
  },
  {
    slug: "wardogs-mortars-indirect-fire",
    title: "WARDOGS Mortars and Indirect Fire: Are They Overpowered?",
    description:
      "A complete WARDOGS mortars guide based on creator footage, explaining indirect fire value, spotting, rooftop pressure, supply limits, counterplay, and why final balance is not confirmed.",
    youtubeId: "utnQT_Jmd5w",
    sourceLabel: "Are WARDOGS Mortars OP or just loads of fun?",
    sourceUrl: "https://www.youtube.com/watch?v=utnQT_Jmd5w",
    publishedDate: "2026-08-13",
    updatedDate: "2026-08-16",
    kind: "creator",
    priority: 5,
    internalGuideSlug: "wardogs-gameplay",
    clips: [
      {name: "Finding an enemy mortar position", startOffset: 0, endOffset: 78},
      {name: "Capturing the mortar and learning the controls", startOffset: 78, endOffset: 151},
      {name: "Calling range to Tower 4", startOffset: 151, endOffset: 226},
      {name: "Using spotters for indirect fire", startOffset: 226, endOffset: 299},
      {name: "Helicopters, towers, and target priorities", startOffset: 299, endOffset: 440},
      {name: "Reading the mortar trajectory", startOffset: 440, endOffset: 583},
      {name: "Base pressure and direct hits", startOffset: 583, endOffset: 735},
      {name: "Mortar earnings and balance verdict", startOffset: 735}
    ],
    quickAnswer:
      "Mortars look dangerous in WARDOGS footage because they punish clustered fights, rooftops, towers, and predictable objective pressure. That does not prove they are overpowered; it proves indirect fire will depend heavily on spotting, distance reading, supply, and whether enemies can locate the firing position.",
    takeaways: [
      "This page targets players searching WARDOGS mortars, indirect fire, OP weapons, and balance.",
      "Mortars are strongest when a team provides callouts, marks targets, and keeps the shooter supplied.",
      "The main counterplay is movement, spacing, pressure, and forcing the mortar crew to relocate.",
      "Rooftops, towers, clustered control fights, and static FOB defenses are natural mortar targets.",
      "One creator video cannot prove launch balance, cooldowns, damage values, or ammo limits.",
      "The best internal links are gameplay, FOB strategy, factions, and beginner guide pages."
    ],
    sections: [
      {
        heading: "Why mortars deserve a separate article",
        body: [
          "Mortars are exactly the kind of WARDOGS mechanic that can generate search traffic because they are easy to understand from footage and hard to judge without context. A single clip can make them look unstoppable, especially when shells land on a rooftop or clustered fight.",
          "A useful guide has to slow that reaction down. The right question is not only are mortars OP? The better question is what conditions make mortars strong, what they cost a team, and what opponents can do before assuming the balance is broken."
        ]
      },
      {
        heading: "What the footage suggests",
        body: [
          "The creator footage makes mortars look strongest against players who stay predictable. Towers, rooftops, static lanes, and dense objective groups are ideal targets because indirect fire does not need to win a fair rifle duel.",
          "That is why mortars feel different from normal weapons. They convert information into pressure. If a teammate can call out a position and the mortar user can read distance well enough, the enemy may be forced to move before the infantry push even arrives."
        ]
      },
      {
        heading: "Spotting is the real weapon",
        body: [
          "A mortar user without information is mostly guessing. The more important team skill is spotting: marking where enemies are grouped, describing distance, warning when targets move, and telling the mortar player whether shots are landing short or long.",
          "This makes mortars a teamwork mechanic, not only a damage mechanic. A solo player may create noise, but a squad that communicates can turn indirect fire into a tool for clearing rooftops, softening FOB defenses, or breaking a stalled push."
        ]
      },
      {
        heading: "How to counter mortars",
        body: [
          "The first answer is movement. Do not stack on one roof, one tower, one doorway, or one obvious supply pile after shells begin landing. Spread out, change levels, and assume the next shot will follow the last known cluster.",
          "The second answer is pressure. If your team can infer where the mortar fire is coming from, send a small group, vehicle, or long-range player to make that position unsafe. Mortars are terrifying when protected and supplied; they are much weaker when the crew has to pack up."
        ]
      },
      {
        heading: "Supply and economy limits",
        body: [
          "WARDOGS is not presented as a game where every powerful tool is free forever. The broader economy and logistics systems matter. Ammunition, transport, FOB support, and cash risk can all affect how long an indirect-fire position stays useful.",
          "That is the missing context in many OP discussions. A weapon that looks dominant in a highlight may still be balanced by setup time, resource flow, vulnerability, or the need for teammates to keep feeding information."
        ]
      },
      {
        heading: "Confirmed vs footage-only",
        body: [
          "Confirmed from the broader WARDOGS pitch is that large battles, vehicles, support roles, and tactical systems are central to the game. Footage strongly suggests mortars can become a major pressure tool in that environment.",
          "Not confirmed are final damage numbers, reload timing, ammo economy, exact counters, unlock requirements, and whether launch balance will match the creator build. This article should therefore teach principles, not pretend to publish final mortar stats."
        ]
      }
    ]
  },
  {
    slug: "wardogs-20-hours-gameplay",
    title: "WARDOGS 20 Hours Gameplay: Long Session Lessons",
    description:
      "A complete WARDOGS long-session gameplay article summarizing lessons from extended creator play, including squad movement, Hot Zone pressure, support roles, cash risk, repeated loops, and caveats.",
    youtubeId: "3EynP3GjopE",
    sourceLabel: "I Played WARDOGS for 20+ Hours",
    sourceUrl: "https://www.youtube.com/watch?v=3EynP3GjopE",
    publishedDate: "2026-08-13",
    updatedDate: "2026-08-16",
    kind: "creator",
    priority: 6,
    internalGuideSlug: "wardogs-gameplay",
    quickAnswer:
      "The 20+ hours gameplay angle matters because it looks past the first exciting match. It helps players judge whether WARDOGS has repeatable depth: squad momentum, Hot Zone pressure, support jobs, cash decisions, transport value, and the friction that only appears after many rounds.",
    takeaways: [
      "This page is for players who want deeper impressions than a trailer or first-look highlight.",
      "Long-session footage is useful because repeated patterns reveal more than one spectacular battle.",
      "The strongest lessons are about staying useful between fights, not only winning gunfights.",
      "Cash risk and support play can keep non-top-fragging players involved in the match.",
      "Extended play still cannot prove final launch balance, content depth, or population health.",
      "The article should connect readers to gameplay basics, Early Access, price, and playtest pages."
    ],
    sections: [
      {
        heading: "Why 20 hours is a different kind of source",
        body: [
          "Short WARDOGS videos are good at showing spectacle. A long-session video is useful for a different reason: it exposes what keeps happening after the surprise wears off.",
          "That makes this page a better fit for players who already understand the pitch and now want to know whether the game has legs. The core question becomes whether the loop remains interesting when battles repeat, teams reorganize, and players start learning the map."
        ]
      },
      {
        heading: "The repeated loop",
        body: [
          "The long-session value is in repetition. WARDOGS appears to cycle through staging, movement, contact, recovery, resupply, and another push. That rhythm is what separates a tactical sandbox from a random explosion reel.",
          "If the loop works, a player can have a useful life without topping the scoreboard. Delivering supplies, moving teammates, holding a line, protecting a FOB, or reviving at the right moment can all matter because the match is bigger than one duel."
        ]
      },
      {
        heading: "Hot Zone pressure over time",
        body: [
          "Hot Zone pressure becomes more interesting in long footage because players are not only reacting to the first objective. They have to keep deciding whether to commit, rotate, reinforce, or abandon a fight that has become too expensive.",
          "That is where WARDOGS can feel strategic. A squad that always runs toward noise may burn cash and lose map influence. A squad that thinks about timing and support can arrive with enough force to matter."
        ]
      },
      {
        heading: "Support jobs need endurance",
        body: [
          "Support roles often look boring in short clips because they do not always create the biggest visual moment. Over many hours, they become easier to appreciate. A truck run, a revive, or a resupply can keep the next fight alive.",
          "This is important for content planning. WARDOGS guide pages should not only rank weapons. They should explain how players can stay valuable when they are under-geared, when their team is losing, or when the fight needs logistics more than another rifle."
        ]
      },
      {
        heading: "What long play can reveal",
        body: [
          "Extended footage can reveal friction: travel downtime, unclear objectives, repeated deaths, squad confusion, or moments where the map feels too big for the current group. Those are not automatically failures, but they are the things serious players care about before buying.",
          "The article should be honest about that. A game can be promising and still rough. Long-session analysis is strongest when it highlights both the fun patterns and the places where WARDOGS needs tuning."
        ]
      },
      {
        heading: "What it still cannot prove",
        body: [
          "Twenty hours in a pre-release environment is still not the same as launch. It cannot prove server stability under public demand, final economy balance, final onboarding, final map rotation, or whether casual players will stay after the first week.",
          "The best conclusion is practical: use long-session footage to understand the loop, then use official pages for confirmed dates, price, system requirements, and access rules."
        ]
      }
    ]
  },
  {
    slug: "wardogs-sniping-long-range-combat",
    title: "WARDOGS Sniping and Long-Range Combat: 30 Hours of Testing",
    description:
      "A complete WARDOGS sniping article based on long-range creator testing, covering sightlines, positioning, map scale, spotter value, relocation, counters, and alpha-build uncertainty.",
    youtubeId: "3Jwi15nA-gg",
    sourceLabel: "I Tested Sniping in WARDOGS for 30+ Hours",
    sourceUrl: "https://www.youtube.com/watch?v=3Jwi15nA-gg",
    publishedDate: "2026-08-13",
    updatedDate: "2026-08-16",
    kind: "creator",
    priority: 7,
    internalGuideSlug: "wardogs-gameplay",
    quickAnswer:
      "The sniping footage is useful because it shows what WARDOGS map scale means for long-range players. Sniping is not only about landing shots; it depends on sightlines, objective relevance, communication, relocation, and whether the marksman is helping the team instead of hiding from the match.",
    takeaways: [
      "This page targets searches for WARDOGS sniping, rifles, long-range combat, and map sightlines.",
      "Long-range play should be explained through positioning, not invented final damage values.",
      "A sniper can help by spotting, suppressing rooftops, covering roads, and punishing exposed rotations.",
      "The main risks are tunnel vision, being too far from objectives, and failing to relocate after firing.",
      "Final rifle balance, bullet behavior, and unlocks are not confirmed by creator footage alone.",
      "The page should link back to gameplay, factions, beginner guide, and map-related content."
    ],
    sections: [
      {
        heading: "What sniping reveals about WARDOGS",
        body: [
          "Sniping is a useful lens for WARDOGS because it makes map scale visible. Long sightlines, rooftops, towers, open roads, ridges, and vehicle routes all matter more when a player is watching from distance.",
          "A good sniping article should therefore be about battlefield awareness, not only weapon hype. The value comes from teaching where long-range players fit into a team-based match."
        ]
      },
      {
        heading: "Positioning before mechanics",
        body: [
          "The safest lesson from long-range footage is that position matters before stats. A sniper needs elevation, cover, escape routes, and a reason to watch a lane that actually affects the objective.",
          "A player who sits far away from every meaningful fight may survive, but survival alone is not contribution. The better position is close enough to provide information and pressure while still far enough to use range as an advantage."
        ]
      },
      {
        heading: "Spotting and information value",
        body: [
          "Long-range players can be valuable even between shots. Calling vehicle movement, marking rooftop threats, warning teammates about rotations, and watching supply approaches can all shape the fight.",
          "This matters because WARDOGS seems designed around shared battlefield information. A sniper who communicates turns one viewpoint into a team asset. A silent sniper is only playing a private minigame."
        ]
      },
      {
        heading: "When to relocate",
        body: [
          "The most common long-range mistake is staying in a good position after it stops being good. Once enemies know where shots are coming from, the position becomes a target for counter-sniping, vehicles, mortars, or a flank.",
          "A beginner-friendly rule is to move after pressure builds, after the objective shifts, or after your angle no longer helps teammates. In WARDOGS, map scale rewards patience, but it also punishes players who confuse patience with staying frozen."
        ]
      },
      {
        heading: "Counterplay against snipers",
        body: [
          "Players fighting snipers should avoid predictable open crossings, use terrain changes, smoke or cover when available, and send pressure toward the firing angle instead of repeatedly peeking the same lane.",
          "Vehicles and indirect fire may also matter depending on the build. The key is to deny the sniper stable information. If a long-range player cannot see where your squad will be next, their advantage shrinks."
        ]
      },
      {
        heading: "Confirmed vs alpha uncertainty",
        body: [
          "Creator footage can show that long-range combat exists and that large WARDOGS maps create meaningful sightline play. It cannot publish final rifle damage, exact bullet drop, final optics, unlock paths, or balance tiers.",
          "That is why this page should remain a positioning guide. It can rank habits before it ranks weapons, which makes the article useful even if final numbers change."
        ]
      }
    ]
  },
  {
    slug: "wardogs-first-look-gameplay",
    title: "WARDOGS First Look Gameplay: Large Squad Alpha Footage",
    description:
      "A complete WARDOGS first look gameplay article based on recent creator footage, covering large-party movement, Hot Zone fights, squad support, vehicles, early roughness, and what new players should watch.",
    youtubeId: "UKL0hwMRT9s",
    sourceLabel: "I can FINALLY show off WARDOGS Gameplay",
    sourceUrl: "https://www.youtube.com/watch?v=UKL0hwMRT9s",
    publishedDate: "2026-08-13",
    updatedDate: "2026-08-16",
    kind: "creator",
    priority: 8,
    internalGuideSlug: "wardogs-first-look",
    clips: [
      {name: "Large-scale firefight opening", startOffset: 0, endOffset: 78},
      {name: "Movement and weapon feel", startOffset: 78, endOffset: 154},
      {name: "Progression and distinct weapons", startOffset: 154, endOffset: 321},
      {name: "Map scale and loadout flow", startOffset: 321, endOffset: 390},
      {name: "Medic progression and class unlocks", startOffset: 390, endOffset: 463},
      {name: "Objective flow and team contribution", startOffset: 463, endOffset: 547},
      {name: "Three-team scoring and persistent cash", startOffset: 547, endOffset: 715},
      {name: "FOB building and logistics", startOffset: 715}
    ],
    quickAnswer:
      "This first-look gameplay page is useful because it shows how WARDOGS feels when a larger group moves together: players chase the Hot Zone, recover from chaotic fights, use support actions, and expose both the promise and roughness of an alpha-scale tactical shooter.",
    takeaways: [
      "This page targets latest WARDOGS first look gameplay searches.",
      "The footage is strongest for understanding squad flow, not for final review scores.",
      "Large groups can make WARDOGS feel more coherent because players share objectives, callouts, and rescue moments.",
      "Hot Zone movement gives the match a practical compass when the battlefield becomes noisy.",
      "Alpha roughness should be explained plainly so readers know what is footage-based and what is confirmed.",
      "The page should point toward first look, gameplay, playtest, Early Access, and system requirement guides."
    ],
    sections: [
      {
        heading: "What this first look adds",
        body: [
          "The value of this first-look footage is that it shows WARDOGS as a group experience rather than a sequence of isolated kills. Players move together, react together, and make the battlefield easier to read by following shared pressure.",
          "That matters because many WARDOGS questions are really about coherence. People want to know whether a 100-player tactical shooter can feel directed enough to play, or whether the scale turns everything into noise."
        ]
      },
      {
        heading: "Large squad movement",
        body: [
          "The footage suggests WARDOGS is at its clearest when a group moves with a shared destination. A lone player may experience confusion, but a coordinated group can turn markers, vehicles, and objective calls into a plan.",
          "For new players, this means the first lesson is social and practical: follow the push, stay close enough to trade or revive, and do not wander so far from the group that your death becomes unrecoverable."
        ]
      },
      {
        heading: "Hot Zone as the match compass",
        body: [
          "In a large battlefield, players need a reason to move. Hot Zone pressure gives WARDOGS that reason by concentrating value and forcing teams to decide whether they want to contest, reinforce, or rotate.",
          "A guide article should explain that the Hot Zone is not just a UI label. It is the place where cash, XP, risk, and team attention can converge. Understanding when to go there is a major beginner skill."
        ]
      },
      {
        heading: "Support moments create the story",
        body: [
          "The most memorable first-look moments are often not only kills. They are rescues, messy regrouping, supply decisions, vehicle rides, and players trying to keep the operation alive after something goes wrong.",
          "That is useful for the site because it supports a broader guide structure. WARDOGS content should teach players how to contribute as drivers, medics, suppliers, builders, and scouts, not only as top fraggers."
        ]
      },
      {
        heading: "Alpha roughness and honest expectations",
        body: [
          "A first look should not be mistaken for a final verdict. Alpha footage can include unclear onboarding, balance oddities, technical roughness, and moments that may change before Early Access or full release.",
          "The article should be honest about that without becoming negative. The strongest message is that WARDOGS looks ambitious and watchable, but players should keep checking official updates for dates, pricing, system requirements, and confirmed mechanics."
        ]
      },
      {
        heading: "What to watch after this video",
        body: [
          "After watching a first look, readers usually need three next steps: the gameplay guide to understand systems, the playtest guide to understand access, and the Early Access guide to understand what is confirmed before spending money.",
          "That is why this video article should not end as a dead page. It should function as a gateway into the main guide cluster and help search visitors move toward the pages with the strongest confirmed information."
        ]
      }
    ]
  },
  {
    slug: "wardogs-everything-before-playing",
    title: "WARDOGS Everything to Know Before Playing",
    description:
      "A complete pre-match WARDOGS briefing covering the objective, persistent cash, progression, classes, FOBs, loadouts, vehicles, and practical first-match priorities.",
    youtubeId: "tF4-GnGlo4I",
    sourceLabel: "WARDOGS - Everything You Need to Know",
    sourceUrl: "https://www.youtube.com/watch?v=tF4-GnGlo4I",
    publishedDate: "2026-08-22",
    updatedDate: "2026-08-22",
    kind: "creator",
    priority: -10,
    internalGuideSlug: "wardogs-beginner-guide",
    quickAnswer:
      "This is the strongest single starting point for a new WARDOGS player because it connects the parts that short clips often separate. The match objective, persistent cash, progression, role choice, FOB construction, transport, and loadout risk all influence one another, so learning the whole loop is more useful than memorizing one weapon or one route.",
    takeaways: [
      "Begin with the active objective and team movement instead of chasing distant gunfire.",
      "Persistent cash makes every purchase and death part of a longer account economy.",
      "Progression unlocks options, but a basic useful role can contribute immediately.",
      "FOBs need builders, supplies, transport access, and defense to remain valuable.",
      "A first loadout should cover weapon, ammunition, healing, and one clear job.",
      "Creator footage reflects a test build, so exact prices and unlock levels can change."
    ],
    sections: [
      {
        heading: "The match in one mental model",
        body: [
          "WARDOGS becomes easier to understand when the battlefield is treated as one connected operation. Three teams are trying to influence the active Control Zone, but they reach it through transport, spawn support, supply routes, infantry pressure, vehicles, and player-built positions. A kill matters most when it changes one of those flows.",
          "For a first match, read the map before buying an elaborate kit. Identify the current objective, the nearest useful team movement, and whether the squad needs another rifle, a medic, a driver, a supplier, or a builder. That choice prevents the common mistake of spending money before knowing what the life is meant to accomplish."
        ]
      },
      {
        heading: "Cash changes the meaning of a loadout",
        body: [
          "Cash persists beyond a single disposable spawn, which gives equipment a real opportunity cost. A powerful backpack full of gadgets may look efficient in the menu, yet it is poor value if the player walks alone into a contested road and loses everything before helping the team. Survival, positioning, and restraint become economic skills.",
          "The practical beginner rule is to buy from the center outward: a controllable primary weapon, compatible ammunition, basic healing, then only the storage or specialist tool required for the planned role. Keep a reserve for recovery. Exact values shown in creator footage are snapshots, but the decision order remains useful when balance changes."
        ]
      },
      {
        heading: "Progression and roles without tunnel vision",
        body: [
          "Progression can open armor, specialist weapons, medical tools, construction equipment, and larger storage. That does not mean a new account must grind in isolation before joining meaningful fights. Transporting teammates, reviving safely, moving supplies, spotting threats, defending assets, and contesting objectives can all create value with modest equipment.",
          "Choose one job per life and let progression support it. A player carrying medical tools should remain close enough to recover teammates. A supplier should know the FOB route. A pilot should have passengers or a logistics task. A specialist launcher should answer an actual vehicle threat instead of consuming cash as a fashion choice."
        ]
      },
      {
        heading: "FOBs, supplies, and the moving front",
        body: [
          "A Forward Operating Base is a strategic position, not a decorative construction project. It needs a reachable site, room for delivery vehicles, enough protection to survive discovery, and a reason to influence the current or likely objective. Building far from every useful route wastes time; building directly under enemy observation wastes supplies.",
          "Teams should establish the smallest useful base first, protect spawn and logistics assets, then add specialist defenses when the threat justifies them. Because the active fight moves, good commanders also know when to reduce investment, relocate mobile assets, or stop defending a base whose location no longer helps scoring."
        ]
      },
      {
        heading: "What to do during the first ten minutes",
        body: [
          "Spawn, check the map, find organized transport, and stay close enough to the group to trade, revive, or be revived. At the objective, avoid stacking the entire squad in one exposed patch. Use cover, watch the third-team approach, and keep an exit route for vehicles or infantry when the fight turns against you.",
          "If the battlefield feels confusing, follow a useful asset rather than random sound. Escort a supply truck, protect a medic, screen a vehicle, or help a builder. These jobs naturally lead toward the places that matter and teach the map faster than repeated solo runs from main base."
        ]
      },
      {
        heading: "What the video can and cannot confirm",
        body: [
          "The video is valuable for showing relationships among systems and for explaining the vocabulary a new player will see. It is not a permanent database of final prices, class caps, item sizes, damage values, or unlock levels. WARDOGS is moving through test and Early Access builds, so menu numbers can age quickly.",
          "Use this article for durable priorities and use the linked beginner guide for a maintained checklist. Before spending real money or relying on a precise mechanic, compare the current Steam information and in-game interface with the date shown on the article."
        ]
      }
    ]
  },
  {
    slug: "wardogs-40-tips",
    title: "40 WARDOGS Tips for Your First Weekend",
    description:
      "A practical WARDOGS tips guide distilled from a 40-tip creator video, covering movement, voice chat, revives, vehicles, spotting, Hot Zones, armor, FOBs, and survival.",
    youtubeId: "Msg78ysR_hQ",
    sourceLabel: "40 WARDOGS Tips and Tricks",
    sourceUrl: "https://www.youtube.com/watch?v=Msg78ysR_hQ",
    publishedDate: "2026-08-22",
    updatedDate: "2026-08-22",
    kind: "creator",
    priority: -9,
    internalGuideSlug: "wardogs-beginner-guide",
    quickAnswer:
      "The useful lesson behind forty separate tips is that WARDOGS rewards preparation and information. Map awareness, squad voice, spotting, sensible purchases, safe revives, transport discipline, armor choices, parachute timing, and FOB knowledge save more lives than one hidden trick. Learn the systems in groups instead of trying to remember forty isolated buttons.",
    takeaways: [
      "Use squad communication and spotting to turn personal information into team value.",
      "Check purchases, ammunition compatibility, armor, and quick slots before deployment.",
      "Revive only after creating safety; one exposed rescue can become two lost kits.",
      "Treat aircraft, free team vehicles, parachutes, and spawn assets as shared resources.",
      "Hot Zone and Control Zone awareness should determine where the squad spends time.",
      "Zeroing, sprint modes, hammer tools, and explosives are situational skills, not a substitute for positioning."
    ],
    sections: [
      {
        heading: "Turn forty tips into five habits",
        body: [
          "Long tip videos can feel useful while playing and impossible to recall once a firefight starts. The better approach is to group the advice into five habits: prepare the kit, read the objective, communicate information, protect shared assets, and preserve the next life. Every individual keybind or gadget fits under one of those habits.",
          "This structure also survives patches. A button may move and an item may be rebalanced, but checking the route before departure, confirming compatible supplies, warning the squad about a vehicle, and refusing an exposed revive will remain strong decisions."
        ]
      },
      {
        heading: "Preparation tips before spawning",
        body: [
          "Confirm that the weapon has compatible magazines or ammunition, that healing is reachable, and that the vest or backpack actually supports the planned inventory. Rebuy and quick-slot conveniences can reduce menu time, but players should still inspect the cost before repeating an expensive loadout after a bad death.",
          "Armor and storage are not automatically better because the tier or size is larger. Weight, access, cash risk, and the job for that life matter. Take specialist explosives, a hammer, anti-vehicle equipment, or parachute gear only when the route and squad plan make the tool useful."
        ]
      },
      {
        heading: "Information, voice, and spotting",
        body: [
          "Squad voice is most effective when callouts are short and actionable. Name the threat, direction, landmark, and movement: armor crossing the north road is useful; shouting that someone is over there is not. Spotting can reinforce the call, especially for pilots, vehicle crews, and long-range teammates who cannot see the same angle.",
          "Do not fill the channel with a running diary. Report a new threat, confirm a task, and leave room for replies. WARDOGS has enough simultaneous action that disciplined communication is a performance advantage for the whole team."
        ]
      },
      {
        heading: "Movement, revives, and combat survival",
        body: [
          "Use terrain and spacing rather than moving as one dense target. Combat sprint can help cross a short dangerous gap, while ordinary movement preserves control and awareness. If a teammate falls, suppress or remove the threat before starting the revive and be ready to cancel when the area is still exposed.",
          "Weapon zeroing and stance can matter at range, but players should first solve the larger error: firing from an obvious position without cover or an exit. Relocate after drawing attention, avoid repeating the same peek, and remember that the third team may be watching both sides of an apparently simple fight."
        ]
      },
      {
        heading: "Vehicles, aircraft, and shared assets",
        body: [
          "A free or available team vehicle is still a shared resource. Do not abandon transport in a kill zone, steal an aircraft from an organized crew, or drive valuable armor into a narrow route without infantry information. Pilots should announce pickups and landings; passengers should board promptly and avoid forcing a hover over exposed ground.",
          "Parachutes, vehicle seats, fuel, ammunition, and repair needs vary by build and asset. The durable tip is to learn the current controls in a low-pressure area, know how the vehicle returns to service, and choose a mission before leaving base."
        ]
      },
      {
        heading: "Objectives, FOBs, and build-sensitive details",
        body: [
          "Hot Zone and Control Zone markers explain where team attention can produce score, cash, or pressure. FOBs and mobile spawn support shorten the route, but only while players supply and defend them. Builders should leave delivery access, and attackers should look for logistics and spawn dependencies instead of feeding a fortified wall.",
          "The creator video records a particular test build, so exact keybinds, costs, free-vehicle rules, armor behavior, IED interactions, and reward values may change. Check settings and current UI first, then use the linked maintained guides for the systems that receive patches."
        ]
      }
    ]
  },
  {
    slug: "wardogs-fob-building-supply",
    title: "WARDOGS FOB Building and Supply Guide",
    description:
      "A full WARDOGS FOB and logistics breakdown covering site selection, build order, supply runs, spawn support, defenses, resource structures, and enemy counterplay.",
    youtubeId: "F5YU7eaQHBU",
    sourceLabel: "WARDOGS FOB, Building and Supply Guide",
    sourceUrl: "https://www.youtube.com/watch?v=F5YU7eaQHBU",
    publishedDate: "2026-08-22",
    updatedDate: "2026-08-22",
    kind: "creator",
    priority: -5,
    internalGuideSlug: "wardogs-fob-guide",
    quickAnswer:
      "A useful WARDOGS FOB is a logistics loop rather than a pile of structures. Choose a defensible site that trucks or aircraft can actually reach, establish the minimum foundation and spawn support, keep supplies moving, and add walls, weapons, or resource systems only when they solve a real battlefield problem.",
    takeaways: [
      "Site access for deliveries matters as much as concealment and cover.",
      "Build the smallest operational base before purchasing specialist defenses.",
      "A FOB and a player spawn asset may be separate systems in observed builds.",
      "Supply runners need clear requests, protected routes, and an unloading area.",
      "Mortars and anti-air are strongest when spotters and defenders support them.",
      "Attackers should cut logistics and spawn flow before fighting every wall."
    ],
    sections: [
      {
        heading: "Why many FOBs fail before contact",
        body: [
          "The first failure is often geographic. A dramatic hilltop may have visibility but no safe truck approach, no landing area, and no concealment from aircraft or indirect fire. A deep forest may hide the foundation while blocking every vehicle and slowing the team that is supposed to use it.",
          "Before deploying, inspect the objective, roads, terrain folds, likely enemy approach, and room for turning or unloading. The position should influence a useful route without sitting directly inside the first obvious line of fire."
        ]
      },
      {
        heading: "A disciplined build order",
        body: [
          "Start with the required deployment or foundation item, then establish only what makes the position operational. Depending on the current build, that can include supply handling, a separately deployed spawn vehicle, protected access, and basic fortification. Expensive weapons should wait until the base has operators and a supply plan.",
          "Walls should shape enemy movement and protect critical assets, not trap friendly vehicles or advertise a perfect artillery target. Leave deliberate lanes for logistics, emergency exits, and repair access. A compact useful position is easier to defend than an empty compound that consumed every material."
        ]
      },
      {
        heading: "How supply runs should work",
        body: [
          "Builders need to tell drivers what the next trip is supporting. General supplies may be consumed by construction, ammunition, repairs, or specialist systems, and a truck arriving with the wrong expectation can leave the important asset idle. Agree on the route, cargo priority, and handoff before departure.",
          "Protect predictable choke points and vary the route after contact. Keep the unloading zone clear so one parked vehicle does not stop the loop. Pilots and drivers should report delays, while the FOB team should report whether the site is still worth reinforcing."
        ]
      },
      {
        heading: "Spawn support, resources, and defenses",
        body: [
          "Observed footage shows that building a FOB does not always create a direct clickable infantry spawn. A mobile or deployed team spawn vehicle may provide that function, so it must be positioned, activated, and protected separately. Hiding it beside the most visible structure defeats the point.",
          "Resource structures, mortars, anti-air, trenches, and static defenses can expand the position. Each also attracts attention and consumes support. Add anti-air when aircraft are repeatedly threatening deliveries, add a mortar when a spotter has targets, and add resource production only when the team can hold the site long enough to benefit."
        ]
      },
      {
        heading: "Defending and relocating",
        body: [
          "Defense needs observation outside the perimeter, infantry covering likely breaches, anti-vehicle tools watching roads, and someone responsible for logistics. Static weapons without information are easy to bypass. A reserve group should be ready to repair, counterattack, or move the spawn asset when the position is compromised.",
          "The active front changes. A base that was excellent twenty minutes ago may become a long detour with no scoring influence. Preserve mobile assets and stop feeding supplies when the strategic value disappears; rebuilding in a better location can be cheaper than defending architecture for emotional reasons."
        ]
      },
      {
        heading: "How to dismantle an enemy FOB",
        body: [
          "Reconnaissance comes first. Follow supply vehicles, locate the spawn asset, identify defensive weapons, and find the least observed approach. Interdicting deliveries reduces the base's ability to replace structures, ammunition, or repairs before the main assault begins.",
          "Then coordinate suppression, smoke, vehicles, explosives, or construction-destruction tools according to the current build. Remove the assets that sustain the position instead of attacking every wall. Exact demolition values may change, but isolation, breach, spawn denial, and controlled destruction remain the reliable sequence."
        ]
      }
    ]
  },
  {
    slug: "wardogs-best-settings",
    title: "WARDOGS Settings Video Breakdown: Test-Build FPS Tips",
    description:
      "A source-specific creator-video breakdown of WARDOGS test-build settings, covering FPS, visibility, audio, keybinds, stutter diagnosis, and safe comparisons.",
    youtubeId: "fupZGU7LJaU",
    sourceLabel: "WARDOGS Best Settings Guide",
    sourceUrl: "https://www.youtube.com/watch?v=fupZGU7LJaU",
    publishedDate: "2026-08-22",
    updatedDate: "2026-08-22",
    kind: "creator",
    priority: -6,
    internalGuideSlug: "wardogs-best-settings",
    quickAnswer:
      "This page breaks down one creator settings video as source material rather than replacing the maintained WARDOGS settings guide. Its useful method is to target stable frame times in busy vehicle and objective fights, preserve battlefield readability, change settings in small groups, and treat hard crashes separately from ordinary low FPS.",
    takeaways: [
      "Choose a stable frame-time target before maximizing visual quality.",
      "Test settings in a busy match area, not only in an empty menu or base.",
      "Reduce the heaviest effects first while preserving useful view distance and clarity.",
      "Use audio and keybinds to shorten reactions for spotting, voice, healing, and vehicle control.",
      "Shader compilation and first-launch work can look like temporary stutter or delay.",
      "A hard reboot or startup crash needs troubleshooting, not another graphics preset."
    ],
    sections: [
      {
        heading: "How to use this creator video",
        body: [
          "Treat this creator video as a test-build demonstration, then use the linked maintained guide for current official requirements and source checks. Decide whether the system is trying to hold 60, 90, 120, or another realistic frame rate during active combat, then cap or tune around that target. An uncapped high number in an empty area says little about stability when vehicles, destruction, smoke, construction, and many players arrive.",
          "Use the same repeatable scenario after each change and watch frame-time consistency, not only the average counter. A slightly lower stable output usually feels better for aiming and vehicle control than a higher number that repeatedly drops during the moments that decide a fight."
        ]
      },
      {
        heading: "Graphics settings in a sensible order",
        body: [
          "Begin with the preset closest to the hardware class, then reduce expensive effects such as shadows, reflections, volumetric detail, or dense post-processing one step at a time. Preserve enough view distance and texture clarity to identify infantry, vehicles, terrain, and objectives. Do not assume the lowest value always creates the best competitive image.",
          "Resolution scaling or upscaling can create a large performance change, but an overly aggressive setting may blur distant movement and optics. Compare a fixed sightline and moving target after every adjustment. The creator's exact recommendation is a test-build snapshot, so trust the measured result on the current client."
        ]
      },
      {
        heading: "Visibility, motion, and interface clarity",
        body: [
          "Motion blur, camera effects, film grain, sharpening, field of view, and brightness can affect comfort and target recognition. Reduce effects that obscure fast movement, but avoid pushing brightness or sharpening so far that terrain detail disappears. A clear image should make friend, enemy, cover, and route information easier to parse.",
          "Keep objective markers and team information readable without letting the interface cover the center of the fight. UI scale and color options should be tested at the player's actual monitor distance, especially on ultrawide or high-resolution displays."
        ]
      },
      {
        heading: "Audio and keybind priorities",
        body: [
          "WARDOGS produces layered sound from infantry weapons, engines, aircraft, explosions, voice chat, and interface alerts. Balance the mix so squad communication and immediate threats remain intelligible. Louder is not automatically clearer, and hearing protection matters during long sessions.",
          "Bind squad voice, spotting, healing, map, stance, sprint modes, and the most common equipment where they can be reached without abandoning movement. Vehicle and aircraft users should review those controls separately before entering a crowded transport or taking an expensive asset."
        ]
      },
      {
        heading: "Stutter, shader work, and clean comparisons",
        body: [
          "First launch, a new driver, or a major patch can trigger shader compilation or caching behavior. Allow that work to finish and compare a second run before concluding that every hitch is permanent. Close unnecessary overlays and background capture tools, verify game files, and update the graphics driver through the vendor's normal channel.",
          "Change one variable group at a time and record the result. Randomly editing ten settings, Windows options, and driver controls together makes it impossible to identify the improvement or undo the setting that caused a new problem."
        ]
      },
      {
        heading: "When settings are not the problem",
        body: [
          "A login queue, server disconnect, desktop crash, frozen startup, and full PC reboot are different failures. Graphics tuning may help low FPS or GPU pressure, but it is not the correct first response to every crash. Use the linked crash guide for a safe diagnostic order and current Windows caveats.",
          "Do not download mystery optimizers, disable security broadly, or remove a Windows update only because one comment claims a universal fix. Preserve account and system safety, document the error and time, then compare official notices with carefully labeled community reports."
        ]
      }
    ]
  },
  {
    slug: "wardogs-first-10000",
    title: "How to Earn Your First $10,000 in WARDOGS",
    description:
      "A beginner WARDOGS money route covering low-risk kits, Control Zone income, revives, transport, supply work, survival, spending discipline, and cash recovery.",
    youtubeId: "2E-KNIugA2M",
    sourceLabel: "How to Make Your First $10,000 in WARDOGS",
    sourceUrl: "https://www.youtube.com/watch?v=2E-KNIugA2M",
    publishedDate: "2026-08-22",
    updatedDate: "2026-08-22",
    kind: "creator",
    priority: -8,
    internalGuideSlug: "wardogs-money-guide",
    quickAnswer:
      "The safest path to a first or replacement $10,000 is not an expensive kill streak. Use a cheap functional kit, stay with the active team push, survive long enough to receive objective value, and add repeatable support actions such as safe revives, transport, supply deliveries, spotting, or asset defense. Protect the balance by keeping money for another life.",
    takeaways: [
      "Separate the opening account balance from money earned during later play.",
      "Use a low-risk kit until the income loop is consistent.",
      "Objective participation and survival make support actions easier to stack.",
      "Revives, transport, supply work, and defense can contribute without elite aim.",
      "An expensive specialist purchase should answer a visible team need.",
      "Build-specific rewards and prices must be rechecked after every major update."
    ],
    sections: [
      {
        heading: "Why the first $10,000 matters",
        body: [
          "WARDOGS uses persistent cash to connect one life with the next. The opening balance gives a new player choices, but it is not a refill button that erases every bad purchase. Learning to preserve and rebuild money early prevents a losing streak from turning into increasingly desperate loadouts.",
          "The objective is therefore a repeatable income routine, not a single lucky match. A player should be able to enter cheaply, reach useful team activity, perform several paid or strategically valuable actions, and leave enough reserve to repeat the process after a death."
        ]
      },
      {
        heading: "Start with a recovery loadout",
        body: [
          "Take a controllable basic weapon, compatible ammunition, simple healing, and only the storage required to carry them. Skip premium armor, a bag full of grenades, and specialist launchers until the role has a target. The cheaper the life, the fewer actions are needed to move the account forward.",
          "This is not a permanent poverty build. It is a recovery tool. Once the player understands the route, survives consistently, and has a cash reserve, additional protection or utility can be added one decision at a time."
        ]
      },
      {
        heading: "Stack objective and support value",
        body: [
          "Move with teammates toward the Control Zone or the logistics network that supports it. Objective presence creates a place where spotting, covering, reviving, resupplying, driving, or defending assets naturally matter. Wandering the edge of the map may be safer, but it often produces fewer useful interactions and a slower learning loop.",
          "Safe revives are especially efficient when the threat has been suppressed. Transport can move several players into useful range. Supply work can sustain a FOB or specialist system. None requires the player to win every direct duel, yet each depends on communication and survival."
        ]
      },
      {
        heading: "Transport and logistics as income routes",
        body: [
          "A driver should choose a task before leaving base: deliver infantry, move supplies, recover a stranded group, or support a changing objective. Avoid idling in exposed roads or abandoning the vehicle after one drop. A reliable shuttle creates more team value than a dramatic one-way charge.",
          "Supply runs work best when builders specify what is needed and the route has protection. The player earns more consistently by completing repeated useful deliveries than by carrying an expensive load into an unsupplied position that is already lost."
        ]
      },
      {
        heading: "When to spend the reserve",
        body: [
          "Spend more when the purchase has a defined return: armor for an objective push, medical capacity for an organized squad, anti-air for a repeated aircraft threat, or construction equipment for a planned FOB. The purchase should unlock an action the team is ready to perform.",
          "Do not treat a visible high-tier item as an automatic investment. If the player cannot operate it, cannot supply it, or has no teammate supporting it, the item increases the amount at risk without increasing the chance of a useful life."
        ]
      },
      {
        heading: "Build-specific numbers and honest tracking",
        body: [
          "The creator video provides a useful route and a snapshot of rewards, but beta prices, payout values, progression speed, and loss rules can change. This article deliberately avoids turning one recorded session into a permanent profit table.",
          "Track the current build in simple terms: starting balance, kit cost, actions completed, cash after the life, and reason for death. After a few matches, that personal record shows which role is reliably profitable and which purchase is quietly draining the account."
        ]
      }
    ]
  },
  {
    slug: "wardogs-helicopter-flight-guide",
    title: "WARDOGS Helicopter Flight Guide for New Pilots",
    description:
      "Learn WARDOGS helicopter basics with a low-risk practice plan for controls, takeoff, landing, transport, terrain masking, fuel, ammunition, HOTAS, and anti-air.",
    youtubeId: "wcsY2EeIlyc",
    sourceLabel: "WARDOGS Helicopter Basic Guide",
    sourceUrl: "https://www.youtube.com/watch?v=wcsY2EeIlyc",
    publishedDate: "2026-08-22",
    updatedDate: "2026-08-22",
    kind: "creator",
    priority: -7,
    internalGuideSlug: "wardogs-helicopter-guide",
    quickAnswer:
      "New WARDOGS pilots should practice away from a full passenger load: verify aircraft controls, make small collective and attitude inputs, hover briefly, fly a short circuit, and complete several controlled landings before attempting a hot insertion. Transport value comes from predictable pickups, safe approaches, and returning the aircraft for another task.",
    takeaways: [
      "Review aircraft binds and input mode before taking a team helicopter.",
      "Use small corrections and a stable hover instead of fighting every movement.",
      "Plan takeoff, cruise, approach, landing, and escape as one route.",
      "Tell passengers where and when the aircraft will land.",
      "Use terrain and route variation to reduce exposure to anti-air and small arms.",
      "HOTAS behavior and automatic input switching may change between builds."
    ],
    sections: [
      {
        heading: "Practice without spending a squad's match",
        body: [
          "A helicopter is a shared asset and a moving spawn of expectations: passengers assume the pilot can take off, navigate, land, and avoid obvious threats. Learn the controls in the lowest-pressure environment available before loading a full team. Even a few empty circuits reveal reversed axes, excessive sensitivity, or a missing bind.",
          "The first drill is simple: lift into a low stable hover, hold position, move forward gently, make a wide turn, return to the same area, and land under control. Repeat until the sequence feels boring. Boring practice is what makes a combat pickup look calm."
        ]
      },
      {
        heading: "Inputs, sensitivity, and HOTAS",
        body: [
          "Mouse and keyboard, controller, and HOTAS users need to inspect the current aircraft settings separately from infantry controls. Confirm pitch, roll, yaw, throttle or collective behavior, view controls, freelook, countermeasures if present, and the action used to enter or leave seats. Do not discover an inverted axis over passengers.",
          "Creator and community reports can describe automatic switching or device detection in a particular build, but that behavior is build-sensitive. If the game changes input mode unexpectedly, disconnect unused devices, verify binds, and test again before treating the workaround as permanent documentation."
        ]
      },
      {
        heading: "Takeoff and stable forward flight",
        body: [
          "Clear the rotor area, announce departure, and raise power smoothly. Large abrupt corrections create oscillation that the next correction makes worse. Establish forward movement gradually, keep a visual reference on the horizon and terrain, and avoid climbing higher than the route requires.",
          "In transit, scan for wires, trees, ridges, towers, other aircraft, and likely anti-air positions. Terrain masking can reduce exposure, but flying too low without route knowledge trades enemy fire for a collision. Use a height and speed the pilot can actually control."
        ]
      },
      {
        heading: "Approach, landing, and passenger flow",
        body: [
          "Choose the landing zone before the final approach. Look for slope, obstacles, enemy sightlines, departure direction, and enough room to abort. Reduce speed early rather than arriving fast and trying to stop directly over the zone. A shallow predictable approach is easier for both pilot and passengers to understand.",
          "Tell the squad which side to exit and do not remain stationary longer than necessary. If the zone becomes unsafe, wave off and try another angle. Preserving the helicopter and passengers is more valuable than forcing the exact marker while fire is converging on it."
        ]
      },
      {
        heading: "Transport, resupply, and earning value",
        body: [
          "A transport pilot creates value by shortening the team's route and repeating the service. Coordinate pickups from main base or a safe rally, deliver players near rather than directly inside concentrated fire, and return for another task. Supply delivery may require a different approach and more room around a FOB.",
          "Monitor fuel, ammunition, damage, and the route back to service according to the aircraft and current build. A pilot who leaves before the aircraft is trapped preserves future transport. A pilot who waits for one late passenger under heavy fire can lose the entire next cycle."
        ]
      },
      {
        heading: "Anti-air, emergency decisions, and uncertainty",
        body: [
          "Vary routes, avoid repeated straight approaches, use terrain, and react early to anti-air pressure. When the aircraft is damaged, prioritize a controlled retreat or survivable landing over completing the original plan. Passengers should receive a short warning so they can prepare rather than discovering the emergency at impact.",
          "Exact flight physics, durability, countermeasure behavior, rewards, control options, and HOTAS support can change. This page teaches a safe operating method and links to the maintained helicopter guide; it does not declare one test-build sensitivity value or exploit to be final."
        ]
      }
    ]
  },
  {
    slug: "wardogs-vehicles-explained",
    title: "WARDOGS Vehicles Explained: Roles and Crew Basics",
    description:
      "A practical WARDOGS vehicle guide covering transport, light vehicles, armor, helicopters, crew coordination, resupply, route planning, survival, and counterplay.",
    youtubeId: "ZFRrDSru7Kg",
    sourceLabel: "Every WARDOGS Vehicle Explained",
    sourceUrl: "https://www.youtube.com/watch?v=ZFRrDSru7Kg",
    publishedDate: "2026-08-22",
    updatedDate: "2026-08-22",
    kind: "creator",
    priority: -3,
    internalGuideSlug: "wardogs-gameplay",
    quickAnswer:
      "WARDOGS vehicles are best understood by battlefield job rather than by a temporary tier list. Transport assets move infantry and supplies, light vehicles trade protection for speed, armored vehicles pressure routes and objectives, and helicopters add rapid movement or fire support. Every asset becomes stronger when a crew communicates and weaker when taken alone without a route or resupply plan.",
    takeaways: [
      "Choose the vehicle for a mission before leaving the main base.",
      "Drivers, gunners, commanders, passengers, and repair support need clear roles.",
      "Transport and logistics can create as much team value as direct firepower.",
      "Armor needs infantry information and safe routes rather than blind objective dives.",
      "Aircraft require practiced pilots, landing plans, and awareness of anti-air.",
      "Vehicle availability, costs, seats, weapons, and balance remain build-sensitive."
    ],
    sections: [
      {
        heading: "Classify the mission before the model",
        body: [
          "A catalogue can name vehicles, but a guide must explain why a player would take one. The useful categories are personnel transport, supply movement, reconnaissance, protected fire support, heavy route control, and air mobility. The same model may perform more than one job, yet a crew should agree on the primary task.",
          "Without that agreement, drivers chase kills, gunners watch the wrong sector, passengers jump out early, and the asset is abandoned far from service. A thirty-second briefing at base prevents several minutes of expensive confusion."
        ]
      },
      {
        heading: "Transport and light vehicles",
        body: [
          "Fast vehicles shorten the distance between main base, FOBs, and the active objective. They are especially useful for reinforcing a flank, moving a small squad, scouting a route, or keeping a supply cycle alive. Their speed does not make them invulnerable; predictable roads and exposed stops invite mines, launchers, and concentrated small arms.",
          "Drop passengers behind cover with a route to the fight rather than directly on the marker. Keep the vehicle oriented for departure and decide whether the driver is staying with the squad or returning for another run."
        ]
      },
      {
        heading: "Armored vehicle crew discipline",
        body: [
          "Armor needs information. Infantry can identify launchers, mines, concealed routes, and threats outside the gunner's current view. The driver manages exposure and retreat, the gunner manages target priority, and any commander or additional crew should scan and communicate instead of duplicating the same narrow angle.",
          "Avoid entering terrain where the vehicle cannot turn, reverse, or receive support. Heavy firepower is most useful when it can pressure an objective and still disengage for ammunition, repairs, or a changing front."
        ]
      },
      {
        heading: "Helicopters and air roles",
        body: [
          "Transport helicopters create rapid reinforcement and supply possibilities, while armed variants can pressure exposed movement. Both require a pilot who has practiced controls and understands landing zones. A full passenger load should not be the pilot's first control test.",
          "Aircraft should vary routes, use terrain where practical, and avoid hovering over a known threat. Passengers and ground teams can help by marking anti-air, clearing a landing zone, and being ready when the aircraft arrives."
        ]
      },
      {
        heading: "Fuel, ammunition, repair, and recovery",
        body: [
          "Every sortie should include a way home. Check the current interface for fuel, ammunition, damage, repair, or resupply behavior before committing to a long operation. Leaving the front slightly early is better than becoming an immobile target after the last useful shot.",
          "When an asset is disabled or abandoned, decide whether recovery is possible without sacrificing more players. A rescue can be valuable, but repeatedly feeding the same exposed wreck is not logistics."
        ]
      },
      {
        heading: "How infantry should counter vehicles",
        body: [
          "Spot and communicate first. Use terrain, mines, specialist launchers, indirect fire, friendly vehicles, or air support according to the current threat and available tools. Attack from more than one angle so the crew cannot face every danger at once, and target the route that connects the asset to ammunition or repair.",
          "The creator video shows a test-build vehicle set, not a permanent balance chart. Exact armor, damage, seat layouts, spawn rules, and prices can change, so this article focuses on crew behavior and counterplay that remain useful across updates."
        ]
      }
    ]
  },
  {
    slug: "wardogs-weapons-tested",
    title: "Every WARDOGS Weapon Tested: Practical Selection Guide",
    description:
      "A practical reading of WARDOGS weapon test footage, covering role, range, recoil, ammunition, attachments, loadout cost, specialist tools, and patch-sensitive limits.",
    youtubeId: "9mSvZyAk62E",
    sourceLabel: "Every Weapon Tested in WARDOGS",
    sourceUrl: "https://www.youtube.com/watch?v=9mSvZyAk62E",
    publishedDate: "2026-08-22",
    updatedDate: "2026-08-22",
    kind: "creator",
    priority: -2,
    internalGuideSlug: "wardogs-gameplay",
    quickAnswer:
      "Weapon test footage is most useful for comparing handling and intended role, not declaring a permanent best gun. Pick a controllable weapon for the distance and job the squad expects, bring compatible ammunition, test optics and recoil in the current build, and include the full loadout cost before deciding that a stronger-looking weapon is efficient.",
    takeaways: [
      "Choose by role and expected distance before reading any temporary tier list.",
      "Recoil, sight picture, handling, and ammunition access matter together.",
      "Attachments can improve one use case while adding cost or changing feel.",
      "Sidearms and specialist weapons solve different problems from a primary rifle.",
      "A weapon is only useful when the player can fund and resupply its complete kit.",
      "Damage, recoil, unlocks, prices, and the available roster may change by patch."
    ],
    sections: [
      {
        heading: "How to read an every-weapon video",
        body: [
          "A broad test video creates a useful visual comparison, but each clip happens in a specific build, range, stance, and attachment setup. It can reveal handling character and category differences without proving a universal winner for every player or objective.",
          "Use the footage to build a shortlist, then test that shortlist with the current client. Record whether the sight stays readable, follow-up shots remain controllable, ammunition is easy to carry, and the complete kit fits the account's budget."
        ]
      },
      {
        heading: "Assault rifles and general-purpose choices",
        body: [
          "A general-purpose rifle should be controllable in common objective ranges and flexible enough for movement between cover, buildings, roads, and open terrain. The most impressive raw output does not help if the player misses follow-up shots or cannot keep the optic on target.",
          "For a beginner, familiarity and ammunition planning can outweigh a marginal stat advantage. Use short controlled bursts at range, reposition after drawing attention, and let teammates cover distances the current setup handles poorly."
        ]
      },
      {
        heading: "Close range, long range, and specialist roles",
        body: [
          "Compact weapons can be easier in vehicles, buildings, and tight FOB fights but lose comfort or effectiveness across open ground. Marksman and sniper options reward position, spotting, and patience, yet a distant player still needs to influence the objective rather than watching an irrelevant lane.",
          "Launchers, anti-air weapons, explosives, and other specialist tools answer vehicles, structures, or grouped positions. Carrying one should follow a visible threat and a resupply plan, because the cash and inventory cost can make the rest of the life less flexible."
        ]
      },
      {
        heading: "Attachments and sight picture",
        body: [
          "An optic should make the expected engagement easier without hiding too much peripheral information. Muzzle, grip, magazine, or other attachment choices can change recoil, handling, capacity, or visibility, but those effects and names must be checked in the current build.",
          "Do not copy a creator setup blindly. Reproduce the conditions, compare an unmodified baseline, and decide whether the improvement is worth the cash and inventory consequence for the role being played."
        ]
      },
      {
        heading: "Ammunition and total loadout cost",
        body: [
          "The weapon icon is not the whole purchase. Magazines or ammunition, optic, medical supplies, armor, vest, backpack, and specialist utility all compete for cash. A rifle that is affordable only when the rest of the kit is neglected may be a poor everyday choice.",
          "Bring enough ammunition for the planned route and know how the squad will resupply. Carrying excessive magazines increases risk, while carrying too little can turn a successful position into an empty weapon before transport or logistics arrives."
        ]
      },
      {
        heading: "Why this is not a permanent tier list",
        body: [
          "WARDOGS is moving through balance and content changes. Damage, recoil, range behavior, attachments, unlock requirements, prices, and even the weapon roster can shift. A definitive ranking built from one test would age faster than a guide about selection and testing.",
          "Use the video for discovery, the site catalogue for identifiable models and source notes, and the gameplay guide for role context. Recheck patch notes and the live interface before making an expensive loadout around a precise number."
        ]
      }
    ]
  },
  {
    slug: "wardogs-game-mode-explained",
    title: "WARDOGS Game Mode Explained: Towers and Control Zone",
    description:
      "An official-footage WARDOGS objective guide explaining three-team warfare, tower terminals, Control Zone and Hot Zone flow, scoring pressure, rotations, and team roles.",
    youtubeId: "cSn5IGknapM",
    sourceLabel: "WARDOGS Game Mode Explained",
    sourceUrl: "https://www.youtube.com/watch?v=cSn5IGknapM",
    publishedDate: "2026-08-22",
    updatedDate: "2026-08-22",
    kind: "official",
    priority: -4,
    internalGuideSlug: "wardogs-towers-guide",
    quickAnswer:
      "WARDOGS is a three-team objective war, not a simple two-side ticket race. Teams use battlefield towers and their terminals to interact with the wider Control Zone flow, then move infantry, vehicles, logistics, and spawn support toward the active scoring pressure. The third faction can attack either side of an apparently settled fight.",
    takeaways: [
      "Read the active objective before committing the squad to a distant fight.",
      "Tower terminals are interaction points, so clearing and holding the area matters.",
      "Control Zone and Hot Zone terms describe related but distinct battlefield pressure.",
      "Three teams make every rotation vulnerable to a third-party attack.",
      "Transport, FOBs, spotting, and supply determine how long a team can contest.",
      "Exact terminal prompts, codes, timing, and scoring values remain build-sensitive."
    ],
    sections: [
      {
        heading: "The objective layer behind the firefights",
        body: [
          "Large battles become meaningful only when players know why they are in a location. Official game-mode footage frames WARDOGS around three teams competing for control, with battlefield systems that direct movement rather than one permanent central arena.",
          "A squad should therefore ask what the current fight changes. Capturing or defending a tower, reinforcing the Control Zone, protecting transport, or removing an enemy spawn route affects the match. Chasing a retreating player away from all scoring pressure often does not."
        ]
      },
      {
        heading: "How to approach a tower terminal",
        body: [
          "Treat the terminal as the final step, not the first. Scout the tower, identify defenders and vehicle sightlines, clear immediate threats, then establish cover while one player interacts. Teammates should watch likely entrances and the third-team route instead of stacking around the same console.",
          "The interface may require an interaction sequence or code in a particular build. Read the current prompt and protect the player completing it. Do not publish one recorded code or timer as universal, because those details can change or vary with the live objective state."
        ]
      },
      {
        heading: "Control Zone and Hot Zone flow",
        body: [
          "The Control Zone is the central scoring idea described by official material: presence and control inside the active area create team progress. Hot Zone language in footage and player discussion points to concentrated opportunity or pressure within the wider battle, where teams may receive stronger reasons to contest.",
          "Use the map and live interface to distinguish them in the current build. The durable lesson is that objectives move attention. A good squad rotates before the old fight becomes irrelevant and brings transport, ammunition, and spawn support for the next contest."
        ]
      },
      {
        heading: "Why three teams change every capture",
        body: [
          "In a two-team game, winning the immediate duel often creates safety. In WARDOGS, the third team may have watched both groups spend ammunition, vehicles, and revives. A successful capture can become the moment the squad is weakest.",
          "Keep observation on the unused approach, preserve a small reserve, and avoid putting every player on the terminal or scoring point. When two opponents are fighting, decide whether to intervene immediately, cut reinforcements, or arrive after both have exposed their assets."
        ]
      },
      {
        heading: "Roles that make control possible",
        body: [
          "Infantry clears and occupies space, but transport gets them there, medics preserve presence, vehicles control approaches, scouts provide warning, and logistics keeps the position supplied. Builders and spawn support reduce the cost of returning after losses.",
          "This is why a player with few eliminations can still be central to a win. The relevant question is whether the action keeps friendly players in useful space or prevents an opponent from doing the same."
        ]
      },
      {
        heading: "What official footage confirms and leaves open",
        body: [
          "Official footage is the strongest source for the intended objective structure and three-team identity. It does not freeze every scoring rate, tower location, terminal prompt, Hot Zone reward, or map flow for every future build.",
          "Use this page to understand the objective language, then use the linked towers guide for a maintained step-by-step field checklist. When the live UI differs from old footage, the current interface and official update notes take priority."
        ]
      }
    ]
  },
  {
    slug: "wardogs-is-it-worth-it",
    title: "Is WARDOGS Worth It? Early Access Buyer Guide",
    description:
      "A balanced WARDOGS buyer guide using recent gameplay and official caveats to weigh scale, teamwork, cash, vehicles, performance, rough edges, price, and Early Access risk.",
    youtubeId: "Em9HAhrZFeI",
    sourceLabel: "Is WARDOGS Worth It?",
    sourceUrl: "https://www.youtube.com/watch?v=Em9HAhrZFeI",
    publishedDate: "2026-08-22",
    updatedDate: "2026-08-22",
    kind: "creator",
    priority: -1,
    internalGuideSlug: "wardogs-price",
    quickAnswer:
      "WARDOGS is most likely worth considering for players who actively want a large, communication-heavy tactical FPS with three teams, persistent cash, vehicles, construction, logistics, and the uncertainty of Early Access. Players who need polished onboarding, proven long-term server health, console support, or final balance should wait for current reviews and patches rather than buying from hype alone.",
    takeaways: [
      "The central value proposition is scale combined with meaningful support and logistics roles.",
      "Persistent cash can create tension, but repeated losses may frustrate reckless or solo play.",
      "Three-team battles produce memorable uncertainty and less predictable fronts.",
      "Performance, queues, crashes, balance, and onboarding deserve current-build evidence.",
      "Price should be compared with the hours and group experience the buyer actually expects.",
      "Early Access buyers should accept change; cautious buyers can wait for patches and reviews."
    ],
    sections: [
      {
        heading: "What the buyer is really choosing",
        body: [
          "The decision is not simply whether WARDOGS has impressive footage. A buyer is choosing an ambitious Early Access battlefield where 100-player scale, three-team pressure, vehicles, destruction, FOBs, supply work, and a persistent economy all need to function together under live conditions.",
          "That combination creates the game's strongest identity and its largest risk. When the systems align, players get stories that a smaller arena shooter cannot create. When performance, population, balance, or coordination fails, the same scale can feel like travel and noise."
        ]
      },
      {
        heading: "Reasons to buy now",
        body: [
          "Buyers who enjoy squad communication, combined arms, logistics, support roles, and learning an evolving game have the clearest fit. WARDOGS lets a player contribute through transport, revives, supply, construction, spotting, vehicle crews, or objective pressure rather than measuring every useful minute only through eliminations.",
          "The three-team structure and persistent cash also create consequences. A route can be interrupted by an unexpected faction, and a lost loadout affects future options. Players who enjoy planning around risk may find that more engaging than a free reset every spawn."
        ]
      },
      {
        heading: "Reasons to wait",
        body: [
          "Wait if stable performance, short queues, mature tutorials, final balance, controller or HOTAS behavior, and a proven patch cadence are required before purchase. Recent footage can show promise, but it cannot guarantee how every region, hardware configuration, or weekend population behaves.",
          "Waiting is also sensible for solo players who dislike voice coordination or for buyers who expect a finished content library on day one. Early Access is a development phase, and systems, prices, progression, maps, items, and user experience may change."
        ]
      },
      {
        heading: "How to judge price fairly",
        body: [
          "Compare the current official Steam price in the buyer's region with the experience actually desired. A group planning repeated tactical sessions may receive more value than a player seeking a short polished campaign or a small-team ranked ladder. Edition extras should be evaluated separately from access to the base game.",
          "Do not use an old screenshot or third-party table as the final checkout value. Currency, tax, regional pricing, discounts, and editions can differ. The Steam checkout shown to the account is the authoritative price before payment."
        ]
      },
      {
        heading: "A two-hour evaluation checklist",
        body: [
          "During the first sessions, check whether the client runs consistently during busy fights, whether the server and queue experience is acceptable, whether the player can understand objectives, and whether team communication creates enjoyable moments. Try at least one support or transport task before judging the game only from an isolated infantry death.",
          "Also inspect settings, keybinds, readability, cash recovery, and the route back into combat. A refund window should not be treated casually, so review the current Steam refund terms and make the decision from direct experience rather than leaving the client idle in a queue."
        ]
      },
      {
        heading: "Verdict by player type",
        body: [
          "Buy now if the concept itself is exciting enough that participating in an evolving tactical shooter is part of the value. Wait if the concept sounds good but technical stability, balance, or onboarding will determine enjoyment. Skip for now if communication-heavy objectives, persistent loss pressure, large travel distances, or unfinished systems are immediate deal breakers.",
          "This verdict is intentionally conditional and dated. Use the linked price and Early Access guides for official purchase facts, and use current player reports as build-specific evidence rather than assuming one launch-week opinion remains true after updates."
        ]
      }
    ]
  }
] as const;

export function getFeaturedVideoArticles(limit = 6): VideoArticle[] {
  return [...videoArticles].sort((a, b) => a.priority - b.priority).slice(0, limit);
}

export function getVideoArticle(slug: string): VideoArticle | undefined {
  return videoArticles.find((article) => article.slug === slug);
}
