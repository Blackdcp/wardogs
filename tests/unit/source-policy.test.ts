import {describe, expect, it} from "vitest";
import {isApprovedSourceUrl} from "../../src/content/source-policy";

describe("source policy", () => {
  it("rejects both known WARDOGS competitor domains", () => {
    expect(isApprovedSourceUrl("https://wardogshub.gg/weapons/")).toBe(false);
    expect(isApprovedSourceUrl("https://www.wardogshub.gg/weapons/")).toBe(false);
    expect(isApprovedSourceUrl("https://wardogs.wiki/")).toBe(false);
    expect(isApprovedSourceUrl("https://www.wardogs.wiki/")).toBe(false);
  });
});
