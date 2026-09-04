import type {MDXComponents} from "mdx/types";
import {ComparisonTable} from "./comparison-table";
import {FactGrid} from "./fact-grid";
import {FactionVisuals} from "./faction-visuals";
import {Notice} from "./notice";
import {OfficialVideo} from "./official-video";
import {SourceNote} from "./source-note";
import {Steps} from "./steps";

export const mdxComponents: MDXComponents = {
  FactionVisuals,
  ComparisonTable,
  FactGrid,
  Notice,
  OfficialVideo,
  SourceNote,
  Steps
};
