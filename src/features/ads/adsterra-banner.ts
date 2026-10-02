export type AdsterraBannerUnit = {
  height: number;
  key: string;
  src: string;
  width: number;
};

function bannerUnit(key: string, width: number, height: number): AdsterraBannerUnit {
  return {height, key, src: `https://arkgleamfox.com/${key}/invoke.js`, width};
}

export const ADSTERRA_BANNER_UNITS = {
  horizontal468: bannerUnit("c6d1a3e01dc90e01385598a3c84dcaea", 468, 60),
  rectangle300: bannerUnit("3342dc928824e6ed5c01555e7f9e9e0f", 300, 250),
  rail300: bannerUnit("f6fc5667adc4cb97634312e962c199c5", 160, 300),
  rail600: bannerUnit("b2a91c3759bccd2386763c1c71b7d7ad", 160, 600),
  mobile320: bannerUnit("174695845dde18793bf09d3361f8af30", 320, 50),
  leaderboard728: bannerUnit("035c3a3eb2cdc2bcb65b641e981d4874", 728, 90)
} as const;

const approvedKeys = new Set<string>([
  ADSTERRA_BANNER_UNITS.horizontal468.key,
  ADSTERRA_BANNER_UNITS.rectangle300.key,
  ADSTERRA_BANNER_UNITS.rail300.key,
  ADSTERRA_BANNER_UNITS.rail600.key,
  ADSTERRA_BANNER_UNITS.mobile320.key,
  ADSTERRA_BANNER_UNITS.leaderboard728.key
]);

export function getApprovedAdsterraBanner(key: string) {
  return approvedKeys.has(key) ? Object.values(ADSTERRA_BANNER_UNITS).find((unit) => unit.key === key) : undefined;
}

export function buildAdsterraBannerOptions(unit: AdsterraBannerUnit) {
  return {
    key: unit.key,
    format: "iframe",
    height: unit.height,
    width: unit.width,
    params: {}
  };
}

export function buildAdsterraBannerConfigCode(unit: AdsterraBannerUnit): string {
  return `atOptions = ${JSON.stringify(buildAdsterraBannerOptions(unit))};`;
}
