import {describe, expect, it} from "vitest";
import {formatLocalizedDate} from "../../src/lib/localized-date";

describe("localized dates", () => {
  it("formats guide dates for every supported locale", () => {
    expect(formatLocalizedDate("2026-08-23", "en")).toBe("August 23, 2026");
    expect(formatLocalizedDate("2026-08-23", "ru")).toBe("23 августа 2026 г.");
    expect(formatLocalizedDate("2026-08-23", "de")).toBe("23. August 2026");
    expect(formatLocalizedDate("2026-08-23", "pt-br")).toBe("23 de agosto de 2026");
    expect(formatLocalizedDate("2026-08-23", "ja")).toBe("2026年8月23日");
    expect(formatLocalizedDate("2026-08-23", "zh-cn")).toBe("2026年8月23日");
  });

  it("keeps an invalid date visible instead of rendering an invalid value", () => {
    expect(formatLocalizedDate("date pending", "en")).toBe("date pending");
  });
});
