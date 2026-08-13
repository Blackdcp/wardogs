import type {Locale} from "@/config/site";
import {listGuideSummaries} from "@/content/guides";

export async function buildGuideIndex(locale: Locale) {
  return listGuideSummaries(locale);
}
