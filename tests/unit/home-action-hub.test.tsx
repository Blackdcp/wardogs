import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {HomeActionHubView} from "../../src/components/home/home-action-hub";

describe("HomeActionHubView", () => {
  it("renders eight stable task destinations without nested media cards", () => {
    const html = renderToStaticMarkup(
      <HomeActionHubView
        eyebrow="Your next move"
        title="What do you need right now?"
        description="Go directly to the task that brought you here."
        actions={[
          {key: "firstMatch", href: "/guides/wardogs-beginner-guide", title: "First match", description: "Deploy with a useful plan."},
          {key: "money", href: "/guides/wardogs-money-guide", title: "Earn money", description: "Protect cash and contribute."},
          {key: "progression", href: "/guides/wardogs-progression-wipes-guide", title: "Role progression", description: "Choose a role path."},
          {key: "weapons", href: "/guides/wardogs-best-weapons-loadouts", title: "Weapons", description: "Build a sourced loadout."},
          {key: "logistics", href: "/guides/wardogs-fob-guide", title: "FOB and logistics", description: "Build and supply the front."},
          {key: "vehicles", href: "/items/vehicles", title: "Vehicles", description: "Find transport and armor."},
          {key: "controls", href: "/guides/wardogs-controls", title: "Controls", description: "Learn the current inputs."},
          {key: "pcFixes", href: "/guides/wardogs-crash-fix", title: "PC fixes", description: "Diagnose crashes and performance."}
        ]}
      />
    );

    expect(html).toContain('data-home-action-hub="true"');
    expect(html.match(/data-home-action=/g)).toHaveLength(8);
    expect(html).not.toContain("<img");
    expect(html).toContain('href="/items/vehicles"');
    expect(html).toContain('href="/guides/wardogs-crash-fix"');
  });
});
