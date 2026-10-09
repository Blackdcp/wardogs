import type {MapId, Point} from "./map-state";

// Original community marker coordinates from apollyon-sys/wardogs-calculator maps/*.json.
// Retrieved 2026-10-09. MIT attribution: public/licenses/apollyon-map-data.txt.
// Coordinates are normalized against each source tileBounds, NOT playable bounds.
// Source precision is retained; these pins are community references, not live game data.
export const COMMUNITY_POI_SOURCE = "https://github.com/apollyon-sys/wardogs-calculator/tree/main/maps";
export type CommunityPoi = Point & {id: string; map: MapId; kind: "tower" | "garage_vendor" | "weapons_vendor" | "spawn_board"; number: number};
export const communityPois: readonly CommunityPoi[] = [
  {
    "id": "bakurani-tower-1",
    "map": "bakurani",
    "kind": "tower",
    "number": 4,
    "x": 0.51049805,
    "y": 0.44464111
  },
  {
    "id": "bakurani-tower-2",
    "map": "bakurani",
    "kind": "tower",
    "number": 3,
    "x": 0.47113037,
    "y": 0.44824219
  },
  {
    "id": "bakurani-tower-3",
    "map": "bakurani",
    "kind": "tower",
    "number": 2,
    "x": 0.47119141,
    "y": 0.42724609
  },
  {
    "id": "bakurani-tower-4",
    "map": "bakurani",
    "kind": "tower",
    "number": 1,
    "x": 0.49145508,
    "y": 0.42633057
  },
  {
    "id": "bakurani-tower-5",
    "map": "bakurani",
    "kind": "tower",
    "number": 5,
    "x": 0.50189209,
    "y": 0.41760254
  },
  {
    "id": "bakurani-weapons_vendor-1",
    "map": "bakurani",
    "kind": "weapons_vendor",
    "number": 1,
    "x": 0.722229,
    "y": 0.4317627
  },
  {
    "id": "bakurani-garage_vendor-1",
    "map": "bakurani",
    "kind": "garage_vendor",
    "number": 1,
    "x": 0.72125244,
    "y": 0.43005371
  },
  {
    "id": "bakurani-spawn_board-1",
    "map": "bakurani",
    "kind": "spawn_board",
    "number": 1,
    "x": 0.72265625,
    "y": 0.43029785
  },
  {
    "id": "bakurani-weapons_vendor-2",
    "map": "bakurani",
    "kind": "weapons_vendor",
    "number": 2,
    "x": 0.24291992,
    "y": 0.47399902
  },
  {
    "id": "bakurani-garage_vendor-2",
    "map": "bakurani",
    "kind": "garage_vendor",
    "number": 2,
    "x": 0.24493408,
    "y": 0.47192383
  },
  {
    "id": "bakurani-spawn_board-2",
    "map": "bakurani",
    "kind": "spawn_board",
    "number": 2,
    "x": 0.24237061,
    "y": 0.47296143
  },
  {
    "id": "bakurani-weapons_vendor-3",
    "map": "bakurani",
    "kind": "weapons_vendor",
    "number": 3,
    "x": 0.53240967,
    "y": 0.19952393
  },
  {
    "id": "bakurani-garage_vendor-3",
    "map": "bakurani",
    "kind": "garage_vendor",
    "number": 3,
    "x": 0.5302124,
    "y": 0.19927979
  },
  {
    "id": "bakurani-spawn_board-3",
    "map": "bakurani",
    "kind": "spawn_board",
    "number": 3,
    "x": 0.53155518,
    "y": 0.19976807
  },
  {
    "id": "ozeti-tower-1",
    "map": "ozeti",
    "kind": "tower",
    "number": 4,
    "x": 0.61431885,
    "y": 0.41290283
  },
  {
    "id": "ozeti-tower-2",
    "map": "ozeti",
    "kind": "tower",
    "number": 3,
    "x": 0.63793945,
    "y": 0.38891602
  },
  {
    "id": "ozeti-tower-3",
    "map": "ozeti",
    "kind": "tower",
    "number": 2,
    "x": 0.61279297,
    "y": 0.36157227
  },
  {
    "id": "ozeti-tower-4",
    "map": "ozeti",
    "kind": "tower",
    "number": 1,
    "x": 0.5848999,
    "y": 0.38348389
  },
  {
    "id": "ozeti-weapons_vendor-1",
    "map": "ozeti",
    "kind": "weapons_vendor",
    "number": 1,
    "x": 0.84265137,
    "y": 0.41101074
  },
  {
    "id": "ozeti-garage_vendor-1",
    "map": "ozeti",
    "kind": "garage_vendor",
    "number": 1,
    "x": 0.84185791,
    "y": 0.40942383
  },
  {
    "id": "ozeti-spawn_board-1",
    "map": "ozeti",
    "kind": "spawn_board",
    "number": 1,
    "x": 0.84173584,
    "y": 0.4105835
  },
  {
    "id": "ozeti-weapons_vendor-2",
    "map": "ozeti",
    "kind": "weapons_vendor",
    "number": 2,
    "x": 0.41851807,
    "y": 0.53814697
  },
  {
    "id": "ozeti-garage_vendor-2",
    "map": "ozeti",
    "kind": "garage_vendor",
    "number": 2,
    "x": 0.41925049,
    "y": 0.53668213
  },
  {
    "id": "ozeti-spawn_board-2",
    "map": "ozeti",
    "kind": "spawn_board",
    "number": 2,
    "x": 0.41778564,
    "y": 0.53631592
  },
  {
    "id": "ozeti-weapons_vendor-3",
    "map": "ozeti",
    "kind": "weapons_vendor",
    "number": 3,
    "x": 0.51196289,
    "y": 0.1885376
  },
  {
    "id": "ozeti-garage_vendor-3",
    "map": "ozeti",
    "kind": "garage_vendor",
    "number": 3,
    "x": 0.51123047,
    "y": 0.19030762
  },
  {
    "id": "ozeti-spawn_board-3",
    "map": "ozeti",
    "kind": "spawn_board",
    "number": 3,
    "x": 0.51092529,
    "y": 0.18951416
  },
  {
    "id": "zestafona-tower-1",
    "map": "zestafona",
    "kind": "tower",
    "number": 3,
    "x": 0.42848311,
    "y": 0.61146057
  },
  {
    "id": "zestafona-tower-2",
    "map": "zestafona",
    "kind": "tower",
    "number": 1,
    "x": 0.41888311,
    "y": 0.6357605
  },
  {
    "id": "zestafona-tower-3",
    "map": "zestafona",
    "kind": "tower",
    "number": 2,
    "x": 0.44508311,
    "y": 0.64136104
  },
  {
    "id": "zestafona-spawn_board-1",
    "map": "zestafona",
    "kind": "spawn_board",
    "number": 1,
    "x": 0.23758311,
    "y": 0.76216104
  },
  {
    "id": "zestafona-garage_vendor-1",
    "map": "zestafona",
    "kind": "garage_vendor",
    "number": 1,
    "x": 0.63898311,
    "y": 0.69916104
  },
  {
    "id": "zestafona-spawn_board-2",
    "map": "zestafona",
    "kind": "spawn_board",
    "number": 2,
    "x": 0.64138311,
    "y": 0.70376104
  },
  {
    "id": "zestafona-spawn_board-3",
    "map": "zestafona",
    "kind": "spawn_board",
    "number": 3,
    "x": 0.41668311,
    "y": 0.40486104
  },
  {
    "id": "zestafona-garage_vendor-2",
    "map": "zestafona",
    "kind": "garage_vendor",
    "number": 2,
    "x": 0.41418311,
    "y": 0.40596104
  },
  {
    "id": "zestafona-garage_vendor-3",
    "map": "zestafona",
    "kind": "garage_vendor",
    "number": 3,
    "x": 0.24068311,
    "y": 0.76176104
  }
];
export function communityPoiLayer(poi: CommunityPoi) {
  return poi.kind === "tower" || poi.kind === "spawn_board" ? "objectives" : "supply";
}

export function clusterCommunityPois(pois: readonly CommunityPoi[], renderedSide: number) {
  const groups: Array<Point & {pois: CommunityPoi[]}> = [];
  for (const poi of pois) {
    const group = groups.find((entry) => Math.hypot(entry.x - poi.x, entry.y - poi.y) * renderedSide < 38);
    if (!group) {groups.push({x: poi.x, y: poi.y, pois: [poi]}); continue;}
    const count = group.pois.length;
    group.x = (group.x * count + poi.x) / (count + 1);
    group.y = (group.y * count + poi.y) / (count + 1);
    group.pois.push(poi);
  }
  return groups;
}
