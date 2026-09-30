import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {join} from "node:path";
import {renderToStaticMarkup} from "react-dom/server";
import sharp from "sharp";
import {describe, expect, it} from "vitest";
import {OfficialScreenshot} from "../../src/components/mdx/official-screenshot";
import {officialGameplayAssets} from "../../src/features/media/official-gameplay-assets";

describe("official gameplay images", () => {
  it("matches the actual public image bytes and dimensions to source records", async () => {
    for (const asset of Object.values(officialGameplayAssets)) {
      const bytes = readFileSync(join(process.cwd(), "public", asset.src));
      const metadata = await sharp(bytes).metadata();
      expect(metadata.format).toBe("webp");
      expect([metadata.width, metadata.height]).toEqual([asset.width, asset.height]);
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(asset.sha256);
      expect(asset.sourceUrl).toMatch(/^https:\/\//);
      expect(asset.captureBuild).toBeNull();
    }
  });

  it("renders useful alt, original-image access and source attribution without invented dates", () => {
    const html = renderToStaticMarkup(<OfficialScreenshot
      id="press-house-interior" alt="Interior cover" caption="Official press-kit screenshot." locale="en"
    />);
    expect(html).toContain('alt="Interior cover"');
    expect(html).toContain("house-interior.webp");
    expect(html).toContain("Official source");
    expect(html).toContain("BULKHEAD / Team17");
    expect(html).not.toContain("<time");
  });

  it("does not render unregistered image IDs", () => {
    expect(renderToStaticMarkup(<OfficialScreenshot id="unknown" alt="Unknown" caption="Unknown" />)).toBe("");
  });
});
