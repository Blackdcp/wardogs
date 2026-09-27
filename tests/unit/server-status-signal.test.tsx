import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {ServerStatusSignal} from "../../src/components/live-ops/server-status-signal";

describe("ServerStatusSignal", () => {
  it("distinguishes the published maintenance notice from unverified live uptime", () => {
    const html = renderToStaticMarkup(<ServerStatusSignal locale="en" />);
    expect(html).toContain("Live server uptime is not verified");
    expect(html).toContain("Patch 0.11");
    expect(html).toContain("September 14");
    expect(html).toContain("Official Steam notices");
    expect(html).toContain("https://steamcommunity.com/app/1867240/homecontent/");
    expect(html).toContain('data-server-status-signal="unverified"');
    expect(html).not.toContain("All servers operational");
  });
});
