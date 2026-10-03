import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {ServerStatusSignal} from "../../src/components/live-ops/server-status-signal";

describe("ServerStatusSignal", () => {
  it("distinguishes the published maintenance notice from unverified live uptime", () => {
    const html = renderToStaticMarkup(<ServerStatusSignal locale="en" />);
    expect(html).toContain("Live server uptime is not verified");
    expect(html).toContain("Patch 0.1.2");
    expect(html).toContain("September 30");
    expect(html).toContain("Official Steam notices");
    expect(html).toContain("https://store.steampowered.com/news/app/1867240/view/712287592723252267");
    expect(html).toContain('data-server-status-signal="unverified"');
    expect(html).not.toContain("All servers operational");
  });
});
