export type OfficialGameplayAsset = {
  src: string;
  width: number;
  height: number;
  sourceUrl: string;
  publishedAt: string | null;
  credit: string;
  captureBuild: string | null;
  sha256: string;
  originalSourceUrl?: string;
  originalArchiveEntry?: string;
  sourceContext: string;
};

const base = "/images/source-evidence/2026-09-30-official-gameplay";
const patchAnnouncement = "https://steamcommunity.com/games/1867240/announcements/detail/701027323413005177";
const patchPublishedAt = "2026-09-12T22:26:39Z";
const steamImages = "https://clan.fastly.steamstatic.com/images/45973082";
const pressHub = "https://www.team17.com/press-and-creator-hub";
const pressKit = "https://www.team17.com/hubfs/WARDOGS%20Press%20Kit%20%28Team17%29%20Sept%202026.zip";
const pressDirectory = "WARDOGS Press Kit (Team17) Sept 2026/03 - Branded Screenshots";

// Hashes cover public WebP derivatives; source-original hashes are in the private research report.
export const officialGameplayAssets = {
  "patch-0-11-deploy-picker": {
    src: `${base}/patch-0-11/deploy-picker.webp`,
    width: 2560,
    height: 1440,
    sourceUrl: patchAnnouncement,
    publishedAt: patchPublishedAt,
    credit: "BULKHEAD / Team17",
    captureBuild: null,
    sha256: "15e19da54233490ce7a5dd11d78eb5c7269d3d831debf2d5979513cadaf79033",
    originalSourceUrl: `${steamImages}/b0e501780369cc9b886834024985afd7d35b2d65.png`,
    sourceContext: "Patch 0.11 announcement; update scheduled for September 14, 2026",
  },
  "patch-0-11-community-browser": {
    src: `${base}/patch-0-11/community-browser.webp`,
    width: 2560,
    height: 1440,
    sourceUrl: patchAnnouncement,
    publishedAt: patchPublishedAt,
    credit: "BULKHEAD / Team17",
    captureBuild: null,
    sha256: "9c6233be573c792e4f9384ebdd0f56975806e1ef73431a95fd92ea0984c6e2d3",
    originalSourceUrl: `${steamImages}/95ddf5e8fe65877da5b905fee421d1beada76fb4.png`,
    sourceContext: "Patch 0.11 announcement; update scheduled for September 14, 2026",
  },
  "patch-0-11-official-browser": {
    src: `${base}/patch-0-11/official-browser.webp`,
    width: 2560,
    height: 1440,
    sourceUrl: patchAnnouncement,
    publishedAt: patchPublishedAt,
    credit: "BULKHEAD / Team17",
    captureBuild: null,
    sha256: "d95c337899f96c5221824dfff6376b8c92616fb0bc1e234c9ea41860b389bdb7",
    originalSourceUrl: `${steamImages}/30e0c0530d03ff69bd433561f83464fff1efb92f.png`,
    sourceContext: "Patch 0.11 announcement; update scheduled for September 14, 2026",
  },
  "press-ghillie-suit": {
    src: `${base}/press-kit-sept-2026/ghillie-suit.webp`,
    width: 1920,
    height: 1080,
    sourceUrl: pressHub,
    publishedAt: null,
    credit: "BULKHEAD / Team17",
    captureBuild: null,
    sha256: "94d513e50eac9937c01d32e2ee3ddcca3aa09357592c1eb88212b108b67345bd",
    originalSourceUrl: pressKit,
    originalArchiveEntry: `${pressDirectory}/WD_Screenshot_Ghellie Suit_WD2.jpg`,
    sourceContext: "Official September 2026 press kit; individual publication date unknown",
  },
  "press-house-interior": {
    src: `${base}/press-kit-sept-2026/house-interior.webp`,
    width: 1920,
    height: 1080,
    sourceUrl: pressHub,
    publishedAt: null,
    credit: "BULKHEAD / Team17",
    captureBuild: null,
    sha256: "59327bfa341ab03d88b8929e90e0e17c55d4f17165c900ca138c312a0efe6206",
    originalSourceUrl: pressKit,
    originalArchiveEntry: `${pressDirectory}/WD_Screenshot_house interior_WD2.jpg`,
    sourceContext: "Official September 2026 press kit; individual publication date unknown",
  },
  "press-littlebird-2": {
    src: `${base}/press-kit-sept-2026/littlebird-2.webp`,
    width: 1920,
    height: 1080,
    sourceUrl: pressHub,
    publishedAt: null,
    credit: "BULKHEAD / Team17",
    captureBuild: null,
    sha256: "0a9b88444f5bc92e6f7d6b32a6371c0bfd075d31504e2a62a4581b3c1868040f",
    originalSourceUrl: pressKit,
    originalArchiveEntry: `${pressDirectory}/WD_Screenshot_Littlebird_2_WD2.jpg`,
    sourceContext: "Official September 2026 press kit; individual publication date unknown",
  },
  "press-river-2": {
    src: `${base}/press-kit-sept-2026/river-2.webp`,
    width: 1920,
    height: 1080,
    sourceUrl: pressHub,
    publishedAt: null,
    credit: "BULKHEAD / Team17",
    captureBuild: null,
    sha256: "46c3b3c01047bdc04ad85025fb20cace6fd7daf0081347df6cfb73cd7e64e53b",
    originalSourceUrl: pressKit,
    originalArchiveEntry: `${pressDirectory}/WD_Screenshot_River_2_WD2.jpg`,
    sourceContext: "Official September 2026 press kit; individual publication date unknown",
  },
} as const satisfies Readonly<Record<string, OfficialGameplayAsset>>;

export type OfficialGameplayAssetId = keyof typeof officialGameplayAssets;
