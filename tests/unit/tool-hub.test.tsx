import {readFileSync} from "node:fs";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {afterEach, describe, expect, it, vi} from "vitest";
import {locales} from "../../src/config/site";
import {buildGuideIndex} from "../../src/features/guides/guide-index";
import {TOOL_REGISTRY} from "../../src/features/tools/tool-registry";

function translate(locale: string) {
  const messages = JSON.parse(readFileSync(`messages/${locale}.json`, "utf8"));
  return (key: string): string => {
    const value = key.split(".").reduce((tree, segment) => tree?.[segment], messages);
    if (typeof value !== "string") throw new Error(`Missing ${locale} message: ${key}`);
    return value;
  };
}

describe("localized Tools hub", () => {
  afterEach(() => vi.unstubAllEnvs());
  it.each(locales)("renders all exact tool links, purpose, evidence limits and local related guides in %s", async (locale) => {
    const hubModule = await import("../../src/components/tools/tool-hub").catch(() => undefined);
    expect(hubModule, "Tools hub component must exist").toBeDefined();
    const ToolHubView = hubModule!.ToolHubView;
    const t = translate(locale);
    const guides = await buildGuideIndex(locale);
    const html = renderToStaticMarkup(<ToolHubView locale={locale} guides={guides} t={t} />);
    expect(html.match(/data-tool-entry=/g)).toHaveLength(9);
    expect(html.match(/data-tool-group=/g)).toHaveLength(5);
    expect(html).toContain(t("toolsHub.evidenceDescription"));
    expect(html).toContain(`href="/${locale}/contact"`);
    expect(html).toContain('href="/feed.xml"');
    expect(html).toContain('type="application/rss+xml"');
    expect(html).toContain('hrefLang="en"');
    expect(html).toContain(t("toolsHub.feedback"));
    expect(html).toContain(t("toolsHub.rss"));
    for (const tool of TOOL_REGISTRY) {
      expect(html).toContain(`href="/${locale}${tool.href}"`);
      expect(html).toContain(t(tool.descriptionKey).replaceAll("&", "&amp;"));
      for (const slug of tool.relatedGuideSlugs) expect(html).toContain(`href="/${locale}/guides/${slug}"`);
    }
    expect(html).not.toContain("toolsHub.");
    if (locale !== "en") expect(t("toolsHub.title")).not.toBe(translate("en")("toolsHub.title"));
  });
  it("keeps feedback and RSS usable with a static-export base path", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/wardogs");
    const {ToolHubView} = await import("../../src/components/tools/tool-hub");
    const html = renderToStaticMarkup(<ToolHubView locale="ja" guides={await buildGuideIndex("ja")} t={translate("ja")} />);
    expect(html).toContain('href="/wardogs/ja/contact/"');
    expect(html).toContain('href="/wardogs/feed.xml"');
  });
});
