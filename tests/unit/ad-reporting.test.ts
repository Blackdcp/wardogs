import {describe, expect, it} from "vitest";
import {AD_REPORTING_VERSION, getAdReportingMetadata} from "../../src/features/ads/ad-reporting";

describe("ad reporting attribution", () => {
  it.each([
    ["/en", "home"], ["/ja/guides", "guide_hub"],
    ["/en/guides/wardogs-money-guide", "guide"], ["/de/items", "catalogue_hub"],
    ["/ru/items/weapons", "catalogue_category"], ["/pl/items/weapons/m4", "item"],
    ["/zh-cn/videos", "video_hub"], ["/zh-tw/videos/example", "video"],
    ["/pt-br/tools/map", "tool"], ["/en/maps", "map_hub"]
  ])("attributes %s to %s without inspecting visitor identity", (path, expected) => {
    expect(getAdReportingMetadata(path, "test-zone")).toEqual({
      ad_unit: "test-zone", page_path: path, page_type: expected, config_version: AD_REPORTING_VERSION
    });
  });

  it("strips share state and queries from ad attribution", () => {
    expect(getAdReportingMetadata("/en/tools/map/?x=100&y=200#private", "test-zone")).toMatchObject({page_path: "/en/tools/map", page_type: "tool"});
    expect(getAdReportingMetadata("/unexpected", "test-zone").page_type).toBe("other");
  });
});
