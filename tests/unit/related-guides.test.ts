import {describe, expect, it} from "vitest";
import {getRelatedGuides} from "../../src/features/guides/related";

describe("related guides", () => {
  it("selects category neighbors without returning the current guide", async () => {
    const related = await getRelatedGuides("en", "wardogs-alpha", 3);
    expect(related.map(({slug}) => slug)).toEqual([
      "wardogs-playtest",
      "wardogs-beta",
      "wardogs-alpha-key"
    ]);
  });
});
