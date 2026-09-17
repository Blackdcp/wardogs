import {readFileSync} from "node:fs";
import {join} from "node:path";
import {describe, expect, it} from "vitest";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {GuideTaskPanel} from "../../src/components/guides/guide-task-panel";
import {getGuideTaskData} from "../../src/features/guides/guide-task-data";

describe("guide responsive typography", () => {
  it("wraps whole words before splitting long tokens on narrow screens", () => {
    const source = readFileSync(
      join(process.cwd(), "src", "app", "[locale]", "guides", "[slug]", "page.tsx"),
      "utf8",
    );

    expect(source).toContain('overflowWrap: "break-word", wordBreak: "normal"');
    expect(source).not.toContain('wordBreak: "break-all"');
  });

  it("keeps long translated checklist and video labels inside responsive tracks", () => {
    const html = renderToStaticMarkup(
      React.createElement(GuideTaskPanel, {
        data: getGuideTaskData("wardogs-community-servers-guide", "de")!,
        locale: "de"
      })
    );

    expect(html).toContain("min-w-0");
    expect(html).toContain("overflow-wrap:anywhere");
    expect(html).not.toContain("break-all");
  });
});
