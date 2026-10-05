import {readFileSync} from "node:fs";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
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
    for (const tool of TOOL_REGISTRY) {
      expect(html).toContain(`href="/${locale}${tool.href}"`);
      expect(html).toContain(t(tool.descriptionKey).replaceAll("&", "&amp;"));
      for (const slug of tool.relatedGuideSlugs) expect(html).toContain(`href="/${locale}/guides/${slug}"`);
    }
    expect(html).not.toContain("toolsHub.");
    if (locale !== "en") expect(t("toolsHub.title")).not.toBe(translate("en")("toolsHub.title"));
  });
});
