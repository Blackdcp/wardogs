import {access} from "node:fs/promises";
import path from "node:path";
import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";

const locales = ["en", "ru", "de", "pt-br", "ja", "zh-cn", "zh-tw", "pl"] as const;
const checkedAt = "2026-09-30";
const launchNotice = "https://steamcommunity.com/app/1867240/discussions/3/585060903246925093/";
const previewUpdate = "https://support.microsoft.com/en-us/servicing/os/windows-11/2026/09/kb5124010-windows-11-24h2-25h2-update";
const voiceReply = "https://steamcommunity.com/app/1867240/discussions/3/571549538645744916/";
const microphoneHelp = "https://support.microsoft.com/en-us/windows/hardware/drivers/fix-microphone-problems";

describe.each(locales)("bounded technical answers: %s", (locale) => {
  it("dates the Windows-update applicability check without replacing the existing crash branches", async () => {
    const guide = await loadGuideDocument(locale, "wardogs-crash-fix");
    expect(guide).not.toBeNull();
    expect(guide?.body).toContain("`winver`");
    expect(guide?.body).toContain(`**${checkedAt}`);
    expect(guide?.body).toContain("| WD-L020");
    for (const url of [launchNotice, previewUpdate]) {
      expect(guide?.frontmatter.sources).toContainEqual(expect.objectContaining({url, kind: "official", checkedAt}));
      expect(guide?.body).toContain(`](${url})`);
    }
    for (const slug of ["wardogs-controls", "wardogs-server-status"]) {
      expect(guide?.body).toContain(`/${locale}/guides/${slug}`);
    }
  });

  it("distinguishes voice channels and escalation using current primary support evidence", async () => {
    const guide = await loadGuideDocument(locale, "wardogs-known-issues");
    expect(guide?.frontmatter.updatedAt).toBe(checkedAt);
    for (const url of [voiceReply, microphoneHelp]) {
      expect(guide?.frontmatter.sources).toContainEqual(expect.objectContaining({url, kind: "official", checkedAt}));
      expect(guide?.body).toContain(`](${url})`);
    }
    for (const marker of ["Squad", "Local", "DxDiag", "UTC", checkedAt]) {
      expect(guide?.body).toContain(marker);
    }
    for (const slug of ["wardogs-controls", "wardogs-squad-guide", "wardogs-server-status"]) {
      expect(guide?.body).toContain(`/${locale}/guides/${slug}`);
    }
  });

  it("keeps guide links within the current locale and points to existing content", async () => {
    for (const slug of ["wardogs-crash-fix", "wardogs-known-issues"]) {
      const guide = await loadGuideDocument(locale, slug);
      expect(guide).not.toBeNull();
      const links = [...(guide?.body ?? "").matchAll(/\]\((\/[^)#?\s]+)(?:[?#][^)]*)?\)/g)];
      expect(links.length).toBeGreaterThan(0);
      for (const [, href] of links) {
        expect(href, `${locale}/${slug}: ${href}`).toMatch(new RegExp(`^/${locale}/guides/`));
        await expect(access(path.join("content", `${href.slice(1)}.mdx`))).resolves.toBeUndefined();
      }
    }
  });
});
