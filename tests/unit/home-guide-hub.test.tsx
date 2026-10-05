import type {ReactNode} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it, vi} from "vitest";
import {HomeGuideHub} from "../../src/components/home/home-guide-hub";
import {listGuideSummaries} from "../../src/content/guides";
vi.mock("next-intl/server", () => ({getTranslations: vi.fn(async () => (key: string) => key)}));
vi.mock("@/i18n/navigation", () => ({Link: ({children, ...props}: {children: ReactNode; href: string}) => <a {...props}>{children}</a>}));

describe("homepage guide hub", () => {
  it("keeps priority tool and guide destinations clickable and tracked", async () => {
    const guides = await listGuideSummaries("en");
    const html = renderToStaticMarkup(await HomeGuideHub({guides, locale: "en"}));
    for (const href of ["/tools/map", "/tools/artillery-calculator", "/tools/cash-xp-calculator", "/tools/logistics-planner", "/guides/wardogs-mortar-guide", "/guides/wardogs-fob-guide", "/guides/wardogs-progression-wipes-guide", "/guides/wardogs-patch-notes"]) expect(html).toContain(`href="${href}"`);
    expect(html.match(/data-home-placement="tools"/g)).toHaveLength(9);
    expect(html).not.toContain('data-home-recovery="ja"');
  });
  it("promotes the Japanese query recovery entries using current routes", async () => {
    const guides = await listGuideSummaries("ja");
    const html = renderToStaticMarkup(await HomeGuideHub({guides, locale: "ja"}));
    expect(html).toContain('data-home-recovery="ja"');
    expect(html.match(/data-home-placement="recovery"/g)).toHaveLength(5);
    for (const slug of ["wardogs-squad-guide", "wardogs-towers-guide", "wardogs-cargo-guide", "wardogs-helicopter-guide", "wardogs-progression-wipes-guide"]) expect(html).toContain(`href="/guides/${slug}"`);
  });
});
