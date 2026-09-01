export type ItemSource = {
  label: string;
  url: string;
  kind: "official" | "creator" | "internal";
  lastChecked: string;
};

export const officialSteam: ItemSource = {
  label: "WARDOGS on Steam",
  url: "https://store.steampowered.com/app/1867240/WARDOGS/",
  kind: "official",
  lastChecked: "2026-08-16"
};

export const officialTeam17: ItemSource = {
  label: "Team17 WARDOGS page",
  url: "https://www.team17.com/games/wardogs",
  kind: "official",
  lastChecked: "2026-08-16"
};

export const sevenThingsVideo: ItemSource = {
  label: "FGS: 7 Things You Need to Know About WARDOGS",
  url: "https://www.youtube.com/watch?v=-k6IV0ITLDo",
  kind: "creator",
  lastChecked: "2026-08-16"
};

export const mortarsVideo: ItemSource = {
  label: "Are WARDOGS Mortars OP or just loads of fun?",
  url: "https://www.youtube.com/watch?v=utnQT_Jmd5w",
  kind: "creator",
  lastChecked: "2026-08-16"
};

export const gameplayVideo: ItemSource = {
  label: "WARDOGS gameplay impressions",
  url: "https://www.youtube.com/watch?v=eAE9LOV-p3s",
  kind: "creator",
  lastChecked: "2026-08-16"
};

export const buildingMortarVideo: ItemSource = {
  label: "The Ultimate WARDOGS Building Guide (mortar at 01:16)",
  url: "https://www.youtube.com/watch?v=kg46BZ1H2W0&t=76s",
  kind: "creator",
  lastChecked: "2026-09-01"
};

export const weaponsCatalogueVideo: ItemSource = {
  label: "Every Weapon Tested in WARDOGS",
  url: "https://www.youtube.com/watch?v=9mSvZyAk62E",
  kind: "creator",
  lastChecked: "2026-08-30"
};

export const vehiclesCatalogueVideo: ItemSource = {
  label: "Every WARDOGS Vehicle Explained",
  url: "https://www.youtube.com/watch?v=ZFRrDSru7Kg",
  kind: "creator",
  lastChecked: "2026-08-30"
};

export const artilleryGuideVideo: ItemSource = {
  label: "How to Use Artillery Tanks in WARDOGS",
  url: "https://www.youtube.com/watch?v=oP9RelmWk6A",
  kind: "creator",
  lastChecked: "2026-08-28"
};

export const vehiclesExplainedVideo: ItemSource = {
  label: "WARDOGS Vehicles Explained",
  url: "https://www.youtube.com/watch?v=ZFRrDSru7Kg",
  kind: "creator",
  lastChecked: "2026-08-28"
};
