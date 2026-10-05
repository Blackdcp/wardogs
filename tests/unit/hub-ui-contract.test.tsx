import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";

async function loadUi() {
  const paths = ["../../src/components/ui/hub-header", "../../src/components/ui/section-heading", "../../src/components/ui/task-link", "../../src/components/tools/tool-page-header"];
  const modules = await Promise.all(paths.map((path) => import(path).catch(() => undefined)));
  for (const ui of modules) expect(ui, "Shared Hub UI component must exist").toBeDefined();
  return {HubHeader: modules[0]!.HubHeader, SectionHeading: modules[1]!.SectionHeading, TaskLink: modules[2]!.TaskLink, ToolPageHeader: modules[3]!.ToolPageHeader};
}

describe("shared discovery Hub UI", () => {
  it("renders one labelled page heading, localized description, both action variants and evidence slot", async () => {
    const {HubHeader} = await loadUi();
    const actions = JSON.parse(JSON.stringify([{href: "/ja/tools/map", label: "マップ", variant: "primary"}, {href: "/ja/tools", label: "ツール", variant: "secondary"}]));
    const html = renderToStaticMarkup(<HubHeader eyebrow="攻略" title="プレイヤーの道筋" description="目的に沿って進みます。" actions={actions}><span data-evidence="verified">確認済み</span></HubHeader>);
    expect(html.match(/<h1/g)).toHaveLength(1);
    for (const text of ["攻略", "プレイヤーの道筋", "目的に沿って進みます。", "確認済み"]) expect(html).toContain(text);
    expect(html).toContain('href="/ja/tools/map"');
    expect(html).toContain('data-task-link="primary"');
    expect(html).toContain('data-task-link="secondary"');
  });
  it("keeps section headings subordinate and connects their stable fragment ID", async () => {
    const {SectionHeading} = await loadUi();
    const html = renderToStaticMarkup(<SectionHeading id="collection-start-title" title="Start playing" description="Follow the order." eyebrow="Library" />);
    expect(html).toContain('<h2 id="collection-start-title"');
    expect(html).not.toContain("<h1");
    expect(html).toContain("Follow the order.");
  });
  it("gives task links a descriptive name and preserves exact destination and discovery taxonomy", async () => {
    const {TaskLink} = await loadUi();
    const html = renderToStaticMarkup(<TaskLink href="/ja/items" label="図鑑" description="武器と車両" hub="catalogue" task="catalogue" target="/items" />);
    expect(html).toContain('href="/ja/items"');
    expect(html).toContain('title="図鑑"');
    expect(html).toContain('data-discovery-target="/items"');
    expect(html).toContain('data-discovery-task="catalogue"');
    expect(html).toContain('data-discovery-hub="catalogue"');
    expect(html).toContain("武器と車両");
    expect(html).toContain('class="task-link');
  });
  it("keeps tool/form IDs and related navigation without creating a second heading", async () => {
    const {ToolPageHeader} = await loadUi();
    const html = renderToStaticMarkup(<ToolPageHeader toolId="loadout-budget" titleId="loadout-budget-form" eyebrow="Observed inputs" title="Loadout budget" description="Read current client prices." actions={[{href: "/pl/tools", label: "Narzędzia"}]}><span data-tool-crosslink="guide">Related guide</span></ToolPageHeader>);
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain('id="loadout-budget-form"');
    expect(html).toContain('data-tool-page-hero="loadout-budget"');
    expect(html).toContain('href="/pl/tools"');
    expect(html).toContain('data-tool-crosslink="guide"');
  });
});
