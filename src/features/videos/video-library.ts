export type VideoArticle = {
  slug: string;
  title: string;
  description: string;
  youtubeId: string;
  sourceLabel: string;
  sourceUrl: string;
  kind: "official" | "creator";
  priority: number;
  internalGuideSlug: string;
  quickAnswer: string;
  takeaways: string[];
  sections: {heading: string; body: string[]}[];
};

export const videoArticles: readonly VideoArticle[] = [
  {
    slug: "wardogs-10-reasons-not-to-buy",
    title: "WARDOGS 10 Reasons Not to Buy: Official Developer Breakdown",
    description: "A focused WARDOGS video breakdown of the official 10 Reasons Not to Buy footage, covering scale, risk, economy, rough edges, and Early Access expectations.",
    youtubeId: "ugkuP4a3xk4",
    sourceLabel: "WARDOGS: 10 Reasons NOT to Buy",
    sourceUrl: "https://www.youtube.com/watch?v=ugkuP4a3xk4",
    kind: "official",
    priority: 1,
    internalGuideSlug: "wardogs-early-access",
    quickAnswer: "This official-style WARDOGS video is useful because it frames the game honestly: huge matches, team logistics, cash risk, vehicles, destruction, and Early Access roughness are all part of the pitch.",
    takeaways: [
      "Use it as an expectation-setting page before buying or pre-ordering.",
      "The strongest SEO angle is buyer intent: whether WARDOGS is worth it.",
      "It supports internal links to Early Access, price, gameplay, and performance notes."
    ],
    sections: [
      {
        heading: "Why this video deserves its own page",
        body: [
          "A negative or caution-framed WARDOGS title catches high-intent players who are close to buying but still worried about bugs, balance, and whether the game is too ambitious. That makes it different from a normal trailer recap.",
          "The useful content is not the video title alone. The page should explain what concerns are real, what is still build-sensitive, and which confirmed systems matter before a player spends money."
        ]
      },
      {
        heading: "What players should learn",
        body: [
          "The main lesson is that WARDOGS is not a small arena shooter. It asks players to think about squads, transport, cash, vehicles, objectives, and logistics at the same time.",
          "That ambition is the selling point and the risk. A polished player guide should therefore connect the video to practical questions: what to buy first, how to avoid wasting cash, when to support the team, and what still needs verification."
        ]
      }
    ]
  },
  {
    slug: "wardogs-7-things-you-need-to-know",
    title: "WARDOGS 7 Things You Need to Know: Scale, Cash, FOBs, and Release",
    description: "A WARDOGS guide article based on the 7 Things You Need to Know video, covering 100-player matches, persistent cash, FOBs, Potato Mode, and timing.",
    youtubeId: "-k6IV0ITLDo",
    sourceLabel: "FGS: 7 Things You Need to Know About WARDOGS",
    sourceUrl: "https://www.youtube.com/watch?v=-k6IV0ITLDo",
    kind: "creator",
    priority: 2,
    internalGuideSlug: "wardogs-gameplay",
    quickAnswer: "The FGS video is the broadest WARDOGS primer: it explains 100-player chaos, three teams, persistent cash, mobile FOBs, non-combat roles, performance modes, and Early Access timing.",
    takeaways: [
      "Best entry page for players who have only heard the game name.",
      "Strong sections include persistent cash, mobile FOBs, and three-team warfare.",
      "The article should link to gameplay, release date, playtest, and price pages."
    ],
    sections: [
      {
        heading: "The biggest confirmed ideas",
        body: [
          "The video presents WARDOGS as a large tactical FPS built around 100-player lobbies, a third team in the fight, and a battlefield where vehicles, infantry, and logistics all matter.",
          "Persistent cash is the most important system for beginners. It means deaths, vehicles, weapons, revives, support actions, and supply runs all connect to a longer economy loop instead of resetting like a simple class shooter."
        ]
      },
      {
        heading: "Why FOBs are the strategic hook",
        body: [
          "Mobile Forward Operating Bases turn the map into something players actively shape. A well-placed FOB can support ammunition, supplies, defenses, and pressure around valuable zones.",
          "The page should make clear that FOB placement is not just construction flair. It affects travel, resupply, team survival, and whether a squad can keep fighting in the right part of the map."
        ]
      }
    ]
  },
  {
    slug: "wardogs-gameplay-impressions",
    title: "WARDOGS Gameplay Impressions: What the First Creator Footage Shows",
    description: "A WARDOGS gameplay impressions article based on creator footage, summarizing squad flow, vehicles, gunfights, revives, movement, and pre-release caveats.",
    youtubeId: "eAE9LOV-p3s",
    sourceLabel: "jackfrags: WARDOGS Gameplay and Impressions",
    sourceUrl: "https://www.youtube.com/watch?v=eAE9LOV-p3s",
    kind: "creator",
    priority: 3,
    internalGuideSlug: "wardogs-gameplay",
    quickAnswer: "The gameplay impressions footage is best used to understand the feel of WARDOGS: messy fronts, frequent repositioning, vehicle pressure, team revives, and objective chaos.",
    takeaways: [
      "Best target for players searching WARDOGS gameplay.",
      "The article should separate observed gameplay feel from final mechanics.",
      "Useful internal links include gameplay, factions, trailer, and playtest."
    ],
    sections: [
      {
        heading: "What the footage shows clearly",
        body: [
          "Creator gameplay footage makes WARDOGS easier to understand than store copy alone. Players can see firefights stretch across buildings, roads, and open terrain rather than staying inside a small lane.",
          "The most important takeaway is pacing. WARDOGS looks less like a pure twitch arena shooter and more like a match where travel, pressure, revives, and communication decide whether a squad keeps influence."
        ]
      },
      {
        heading: "What still needs caution",
        body: [
          "A creator build cannot confirm final balance, final prices, final weapon handling, or launch performance. It is still useful, but the page should label every observation as footage-based unless official sources confirm it.",
          "That wording helps readers trust the site and helps the page rank for gameplay queries without overstating what one video can prove."
        ]
      }
    ]
  },
  {
    slug: "wardogs-alpha-gameplay-impressions",
    title: "WARDOGS Alpha Gameplay Impressions: Early Build Combat Notes",
    description: "A WARDOGS alpha gameplay article summarizing early footage around infantry pushes, vehicles, destruction, squad rescue, and build-sensitive rough edges.",
    youtubeId: "83AVH6FtemY",
    sourceLabel: "FRANKIEonPC: WARDOGS Alpha Gameplay and Impressions",
    sourceUrl: "https://www.youtube.com/watch?v=83AVH6FtemY",
    kind: "creator",
    priority: 4,
    internalGuideSlug: "wardogs-alpha",
    quickAnswer: "The alpha gameplay footage is valuable because it shows early combat rhythm, squad recovery, vehicle threat, and the rough edges players should expect from a pre-release build.",
    takeaways: [
      "Best target for searches about WARDOGS alpha footage.",
      "The page should keep every claim build-sensitive.",
      "Internal links should point to alpha, playtest, gameplay, and factions."
    ],
    sections: [
      {
        heading: "How to read alpha footage",
        body: [
          "Alpha footage is not a final review. It is a snapshot of how the game felt inside one pre-release build, which makes it strong for player curiosity but weak for permanent conclusions.",
          "The right article structure is therefore practical: what looked promising, what looked unstable, and what a new player should watch again when the next test opens."
        ]
      },
      {
        heading: "Combat and recovery signals",
        body: [
          "The footage suggests WARDOGS creates stories through messy recoveries, rescue attempts, sudden explosions, and changing front lines. Those moments are exactly what players search for before requesting access.",
          "A good page should turn those moments into beginner lessons: do not travel alone, keep cash risk in mind, revive when possible, and expect vehicles or indirect fire to break static fights."
        ]
      }
    ]
  },
  {
    slug: "wardogs-mortars-indirect-fire",
    title: "WARDOGS Mortars and Indirect Fire: Are They Overpowered?",
    description: "A WARDOGS mortars guide based on creator footage, explaining indirect fire value, counterplay, rooftop pressure, supply limits, and why balance is not final.",
    youtubeId: "utnQT_Jmd5w",
    sourceLabel: "Are WARDOGS Mortars OP or just loads of fun?",
    sourceUrl: "https://www.youtube.com/watch?v=utnQT_Jmd5w",
    kind: "creator",
    priority: 5,
    internalGuideSlug: "wardogs-gameplay",
    quickAnswer: "Mortars look dangerous in WARDOGS footage, especially against clustered fights and rooftops, but one creator video cannot prove final balance or whether they are overpowered.",
    takeaways: [
      "Best target for WARDOGS mortars and OP/balance searches.",
      "Useful content angle: indirect fire is strong only when teams provide spotting and supply.",
      "Counterplay should mention movement, pressure, locating the firing position, and not stacking."
    ],
    sections: [
      {
        heading: "Why mortars get attention",
        body: [
          "Mortars create memorable footage because they punish stationary players, rooftops, clusters, and predictable fights. That makes them perfect for a standalone WARDOGS article instead of a short paragraph inside a general gameplay guide.",
          "The search intent is also clear: players want to know whether mortars are overpowered, how they work, and what they can do when indirect fire starts landing."
        ]
      },
      {
        heading: "Practical counterplay from footage",
        body: [
          "The safest guidance is to avoid stacking, keep changing cover, communicate likely firing directions, and pressure the mortar team when the opportunity appears.",
          "Because WARDOGS uses logistics and cash pressure, mortars should also be discussed as part of supply. A weapon that looks oppressive in one clip may be limited by setup, ammunition, spotters, and enemy response."
        ]
      }
    ]
  },
  {
    slug: "wardogs-20-hours-gameplay",
    title: "WARDOGS 20 Hours Gameplay: Long Session Lessons",
    description: "A WARDOGS long-session gameplay article summarizing lessons from extended creator play, including squad movement, Hot Zone pressure, support roles, and caveats.",
    youtubeId: "3EynP3GjopE",
    sourceLabel: "I Played WARDOGS for 20+ Hours",
    sourceUrl: "https://www.youtube.com/watch?v=3EynP3GjopE",
    kind: "creator",
    priority: 6,
    internalGuideSlug: "wardogs-gameplay",
    quickAnswer: "The 20+ hours footage is valuable because it shows repeated patterns, not just highlights: travel friction, squad momentum, support value, Hot Zone risk, and alpha roughness.",
    takeaways: [
      "Best target for users who want deeper impressions than a trailer.",
      "Strong angle: what still feels good after many matches.",
      "Good internal links include gameplay, early access, price, and playtest."
    ],
    sections: [
      {
        heading: "Why long-session footage matters",
        body: [
          "A short trailer can make any large shooter look exciting. A long-session impressions video is different because it exposes repeated loops: how often players travel, how often squads regroup, and whether support play stays useful.",
          "That makes this page a good home for practical observations rather than hype. Players want to know whether WARDOGS has enough structure to stay interesting after the first spectacular battle."
        ]
      },
      {
        heading: "What the article should emphasize",
        body: [
          "The strongest lessons are about team movement, role flexibility, and resource decisions. If a squad keeps arriving together, reviving, transporting, and resupplying, the game looks more coherent than a simple chaos sandbox.",
          "The caveat stays important: 20+ hours in one pre-release environment still cannot predict launch population, final balance, server stability, or the final onboarding experience."
        ]
      }
    ]
  },
  {
    slug: "wardogs-sniping-long-range-combat",
    title: "WARDOGS Sniping and Long-Range Combat: 30 Hours of Testing",
    description: "A WARDOGS sniping article based on long-range creator testing, covering sightlines, positioning, map scale, support value, and alpha-build uncertainty.",
    youtubeId: "3Jwi15nA-gg",
    sourceLabel: "I Tested Sniping in WARDOGS for 30+ Hours",
    sourceUrl: "https://www.youtube.com/watch?v=3Jwi15nA-gg",
    kind: "creator",
    priority: 7,
    internalGuideSlug: "wardogs-gameplay",
    quickAnswer: "The sniping footage is useful for understanding WARDOGS sightlines and positioning, but it should be read as alpha footage rather than proof of final rifle balance.",
    takeaways: [
      "Best target for searches around WARDOGS sniping and long range combat.",
      "The page can teach positioning without inventing exact weapon stats.",
      "Link back to gameplay and factions for map-scale context."
    ],
    sections: [
      {
        heading: "What sniping reveals about map scale",
        body: [
          "Long-range combat shows why WARDOGS cannot be understood only through close-quarters clips. Large maps, towers, ridgelines, vehicle movement, and objective pressure all create moments where information and positioning matter.",
          "A sniping page should not pretend to know final damage values. Its value is explaining sightlines, risk, repositioning, and how a marksman helps a team without abandoning the objective."
        ]
      },
      {
        heading: "How to avoid misleading readers",
        body: [
          "The article should avoid tier-list language until final builds exist. It should instead describe what the footage suggests: long-range players need visibility, patience, communication, and enough mobility to move when the Control Zone shifts.",
          "That approach captures the search traffic while staying honest about alpha uncertainty."
        ]
      }
    ]
  },
  {
    slug: "wardogs-first-look-gameplay",
    title: "WARDOGS First Look Gameplay: Large Squad Alpha Footage",
    description: "A WARDOGS first look gameplay article based on recent creator footage, covering large-party movement, Hot Zone fights, squad support, and alpha caveats.",
    youtubeId: "UKL0hwMRT9s",
    sourceLabel: "I can FINALLY show off WARDOGS Gameplay",
    sourceUrl: "https://www.youtube.com/watch?v=UKL0hwMRT9s",
    kind: "creator",
    priority: 8,
    internalGuideSlug: "wardogs-first-look",
    quickAnswer: "This first-look gameplay footage is useful because it shows larger squad movement, objective pressure, recovery moments, and how WARDOGS can feel when a group moves together.",
    takeaways: [
      "Best target for latest first-look gameplay searches.",
      "The article should emphasize squad flow and Hot Zone pressure.",
      "Good internal links include first look, gameplay, playtest, and early access."
    ],
    sections: [
      {
        heading: "What this first look adds",
        body: [
          "The newest first-look footage helps because it shows more than isolated kills. It gives a clearer sense of players moving as a larger group, reacting to pressure, and using the map as a shared problem.",
          "That is valuable for SEO and for readers. Someone searching for WARDOGS first look gameplay likely wants to know whether the game feels coherent or only loud."
        ]
      },
      {
        heading: "The practical lesson",
        body: [
          "The footage supports a simple beginner lesson: stay with your group, use the objective as your compass, and treat every death as both a tactical loss and an economy decision.",
          "As with all creator footage, final balance and performance may change. The page should therefore point readers toward confirmed Early Access, Steam, and gameplay pages for details that are not only video-based."
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
