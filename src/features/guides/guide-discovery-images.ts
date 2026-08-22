export type GuideDiscoveryImage = {
  url: string;
  width: 1280;
  height: 720;
  alt: string;
  creditLabel: string;
  creditUrl: string;
};

const youtubeImage = (youtubeId: string) => `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`;

export const guideDiscoveryImages: Readonly<Record<string, GuideDiscoveryImage>> = {
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
