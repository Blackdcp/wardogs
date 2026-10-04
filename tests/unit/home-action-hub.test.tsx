import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {HomeActionHubView} from "../../src/components/home/home-action-hub";

describe("HomeActionHubView", () => {
  it("renders six problem-first destinations with an integrated sponsored slot", () => {
    const html = renderToStaticMarkup(
      <HomeActionHubView
        eyebrow="Start here"
        title="What do you need right now?"
        description="Choose the problem you came to solve."
        actions={[
          {key: "firstMatch", href: "/guides/wardogs-beginner-guide", title: "First match", description: "Deploy with a useful plan."},
          {key: "map", href: "/tools/map", title: "Map and mortar", description: "Open the tactical map and fire-control tools."},
          {key: "money", href: "/guides/wardogs-money-guide", title: "Money and logistics", description: "Earn cash and keep supply moving."},
          {key: "weapons", href: "/guides/wardogs-best-weapons-loadouts", title: "Weapons", description: "Build a sourced loadout."},
          {key: "pcFixes", href: "/guides/wardogs-crash-fix", title: "Crashes or server status", description: "Recover from crashes and outages."},
          {key: "season2", href: "/guides/wardogs-season-2", title: "Season 2 wipe", description: "Separate confirmed resets from rumors."}
        ]}
        sponsoredSlot={<div data-sponsored-test="true">Sponsored</div>}
        ctaLabel="Open guide"
      />
    );

    expect(html).toContain('data-home-action-hub="true"');
    expect(html.match(/data-home-action=/g)).toHaveLength(6);
    expect(html.match(/data-home-task=/g)).toHaveLength(6);
    expect(html).toContain('data-home-task="map"');
    expect(html).toContain('data-home-task="season2"');
    expect(html.match(/data-home-sponsored-slot="true"/g)).toHaveLength(1);
    expect(html).toContain('data-sponsored-test="true"');
    expect(html).toContain("Open guide");
    expect(html).not.toContain('data-tactical-cards="true"');
    expect(html).not.toContain('data-home-placement="tactical-hub"');
  });
});
