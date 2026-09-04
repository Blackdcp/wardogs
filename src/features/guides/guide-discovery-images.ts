import {assetPath} from "@/lib/assets";

export type GuideDiscoveryImage = {
  url: string;
  width: 1280;
  height: 720;
  alt: string;
  creditLabel: string;
  creditUrl: string;
};

const youtubeImage = (youtubeId: string) => `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;

export const guideDiscoveryImages: Readonly<Record<string, GuideDiscoveryImage>> = {
  "wardogs-best-weapons-loadouts": {
    url: "/images/guide-discovery/best-weapons-loadouts.webp",
    width: 1280,
    height: 720,
    alt: "Official WARDOGS street combat used by the weapons and loadouts guide",
    creditLabel: "Team17 WARDOGS Press Kit",
    creditUrl: "https://www.team17.com/press-and-creator-hub"
  },
  "wardogs-armor-damage-ttk-guide": {
    url: "/images/guide-discovery/armor-damage-ttk.webp",
    width: 1280,
    height: 720,
    alt: "Official WARDOGS combined-arms gameplay used by the armor and damage guide",
    creditLabel: "Team17 WARDOGS Press Kit",
    creditUrl: "https://www.team17.com/press-and-creator-hub"
  },
  "wardogs-medic-revive-guide": {
    url: "/images/guide-discovery/medic-revive.webp",
    width: 1280,
    height: 720,
    alt: "Official WARDOGS downed-player interaction used by the medic and revive guide",
    creditLabel: "Team17 WARDOGS Press Kit",
    creditUrl: "https://www.team17.com/press-and-creator-hub"
  },
  "wardogs-equipment-tools-guide": {
    url: "/images/guide-discovery/equipment-tools.webp",
    width: 1280,
    height: 720,
    alt: "Official WARDOGS indoor combat used by the equipment and tools guide",
    creditLabel: "Team17 WARDOGS Press Kit",
    creditUrl: "https://www.team17.com/press-and-creator-hub"
  },
  "wardogs-crash-fix": {
    url: youtubeImage("fupZGU7LJaU"),
    width: 1280,
    height: 720,
    alt: "WARDOGS PC settings and performance footage used by the crash troubleshooting guide",
    creditLabel: "WARDOGS best settings creator footage",
    creditUrl: "https://www.youtube.com/watch?v=fupZGU7LJaU"
  },
  "wardogs-towers-guide": {
    url: youtubeImage("cSn5IGknapM"),
    width: 1280,
    height: 720,
    alt: "WARDOGS Control Zone tower gameplay used by the towers guide",
    creditLabel: "WARDOGS game mode creator footage",
    creditUrl: "https://www.youtube.com/watch?v=cSn5IGknapM"
  },
  "wardogs-money-guide": {
    url: youtubeImage("2E-KNIugA2M"),
    width: 1280,
    height: 720,
    alt: "WARDOGS loadout economy footage used by the money guide",
    creditLabel: "WARDOGS first $10,000 creator footage",
    creditUrl: "https://www.youtube.com/watch?v=2E-KNIugA2M"
  },
  "wardogs-helicopter-guide": {
    url: youtubeImage("wcsY2EeIlyc"),
    width: 1280,
    height: 720,
    alt: "WARDOGS helicopter flight footage used by the pilot guide",
    creditLabel: "WARDOGS helicopter flight creator footage",
    creditUrl: "https://www.youtube.com/watch?v=wcsY2EeIlyc"
  },
  "wardogs-mortar-guide": {
    url: youtubeImage("utnQT_Jmd5w"),
    width: 1280,
    height: 720,
    alt: "WARDOGS mortar position footage used by the indirect fire guide",
    creditLabel: "WARDOGS mortar creator footage",
    creditUrl: "https://www.youtube.com/watch?v=utnQT_Jmd5w"
  },
  "wardogs-livestream": {
    url: youtubeImage("VQRd91fcQUM"),
    width: 1280,
    height: 720,
    alt: "FPS Games Show announcement artwork for the next WARDOGS reveal",
    creditLabel: "FPS Games Show announcement",
    creditUrl: "https://www.youtube.com/watch?v=VQRd91fcQUM"
  }
};

export function getGuideDiscoveryImage(slug: string) {
  return guideDiscoveryImages[slug];
}

export function getGuideDiscoveryImageSrc(image: GuideDiscoveryImage): string {
  return assetPath(image.url);
}
