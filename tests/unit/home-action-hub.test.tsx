import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {HomeActionHubView} from "../../src/components/home/home-action-hub";

describe("HomeActionHubView", () => {
  it("renders four stable, image-backed task destinations", () => {
    const html = renderToStaticMarkup(
      <HomeActionHubView
        eyebrow="Your next move"
        title="What do you need right now?"
        description="Go directly to the task that brought you here."
        actions={[
          {key: "play", href: "/guides/wardogs-download", image: "/images/wardogs-hero.jpg", imageAlt: "Play WARDOGS", title: "Play now", description: "Install and enter the current test."},
          {key: "fix", href: "/guides/wardogs-known-issues", image: "/images/guide-discovery/equipment-tools.webp", imageAlt: "Fix WARDOGS", title: "Fix a problem", description: "Check current workarounds."},
          {key: "gear", href: "/items", image: "/images/catalogue/banners/weapons-1280.webp", imageAlt: "WARDOGS equipment", title: "Browse equipment", description: "Compare illustrated records."},
          {key: "system", href: "/tools/system-check", image: "/images/catalogue/banners/thegame-1280.webp", imageAlt: "WARDOGS PC check", title: "Check your PC", description: "Compare your system."}
        ]}
      />
    );

    expect(html).toContain('data-home-action-hub="true"');
    expect(html.match(/data-home-action=/g)).toHaveLength(4);
    expect(html.match(/<img/g)).toHaveLength(4);
    expect(html).toContain('href="/items"');
    expect(html).toContain('href="/tools/system-check"');
  });
});
