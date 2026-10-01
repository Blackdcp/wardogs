import {describe, expect, it} from "vitest";
import {parseVideoStartTime} from "../../src/features/videos/video-start-time";

describe("video key moment start time", () => {
  it.each([0, 63, 408, 735, 1192, 86399])("accepts the timestamp %i", (seconds) => {
    expect(parseVideoStartTime(String(seconds))).toBe(seconds);
  });

  it.each([null, "", "-1", "1.5", "1e3", "Infinity", "NaN", "86400", "9007199254740993", "<script>", " 63 "])("uses the normal start for invalid input %s", (input) => {
    expect(parseVideoStartTime(input)).toBe(0);
  });
});
