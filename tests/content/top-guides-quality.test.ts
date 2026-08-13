import {readFileSync} from "node:fs";
import {join} from "node:path";
import {describe, expect, it} from "vitest";
import {TOP_GUIDE_SLUGS} from "../../src/features/home/home-data";

const requiredHeadings = [
  "## Quick Answer",
  "## Confirmed Facts",
  "## What Players Search For",
  "## How to Use This Guide",
  "## FAQ",
  "## Sources and Last Checked",
  "## Related Guides"
] as const;

describe("top guide content quality", () => {
  it("gives every priority English guide a complete evergreen SEO structure", () => {
    for (const slug of TOP_GUIDE_SLUGS) {
      const source = readFileSync(join(process.cwd(), "content", "en", "guides", `${slug}.mdx`), "utf8");

      for (const heading of requiredHeadings) {
        expect(source, `${slug} missing ${heading}`).toContain(heading);
      }
    }
  });
});
