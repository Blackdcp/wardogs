import {describe, expect, it} from "vitest";
import {itemLibrary} from "../../src/features/items/item-library";
import {getLocalizedItem} from "../../src/features/items/item-localization";
import {videoArticles} from "../../src/features/videos/video-library";
import {getLocalizedVideoArticles} from "../../src/features/videos/video-localization";

const locales = ["zh-tw", "pl"] as const;

describe.each(locales)("%s complete editorial translations", (locale) => {
  it("rejects an untranslated item instead of publishing a generic substitute", () => {
    expect(() => getLocalizedItem({...itemLibrary[0], slug: "untranslated-item"}, locale)).toThrow();
  });

  it("retains every video section, paragraph, takeaway and source", () => {
    const translations = getLocalizedVideoArticles(locale);
    expect(translations.map(({slug}) => slug)).toEqual(videoArticles.map(({slug}) => slug));
    for (const [index, original] of videoArticles.entries()) {
      const translated = translations[index];
      for (const field of ["title", "description", "quickAnswer"] as const) {
        expect(translated[field], `${original.slug}/${field}`).not.toBe(original[field]);
        expect(translated[field].trim().length).toBeGreaterThan(10);
      }
      expect(translated.takeaways, original.slug).toHaveLength(original.takeaways.length);
      original.takeaways.forEach((text, i) => {
        expect(translated.takeaways[i], `${original.slug}/takeaway ${i}`).not.toBe(text);
      });
      expect(translated.sections, original.slug).toHaveLength(original.sections.length);
      original.sections.forEach((section, i) => {
        expect(translated.sections[i].heading, original.slug).not.toBe(section.heading);
        expect(translated.sections[i].body, `${original.slug}/section ${i}`).toHaveLength(section.body.length);
        section.body.forEach((text, j) => {
          expect(translated.sections[i].body[j], `${original.slug}/${i}/${j}`).not.toBe(text);
          expect(translated.sections[i].body[j].trim().length).toBeGreaterThan(10);
        });
      });
      for (const field of ["youtubeId", "sourceLabel", "sourceUrl", "publishedDate", "updatedDate", "kind", "priority", "internalGuideSlug"] as const) {
        expect(translated[field], `${original.slug}/${field}`).toEqual(original[field]);
      }
      expect(translated.clips?.map(({startOffset, endOffset}) => ({startOffset, endOffset})))
        .toEqual(original.clips?.map(({startOffset, endOffset}) => ({startOffset, endOffset})));
    }
  });

  it("preserves item-specific prose and all evidence rather than a category template", () => {
    const translations = itemLibrary.map((item) => getLocalizedItem(item, locale));
    for (const [index, original] of itemLibrary.entries()) {
      const translated = translations[index];
      for (const field of ["summary", "description", "role"] as const) {
        expect(translated[field], `${original.slug}/${field}`).not.toBe(original[field]);
        expect(translated[field].trim().length).toBeGreaterThan(5);
      }
      for (const field of ["strengths", "cautions", "confirmedFacts", "unconfirmedFacts"] as const) {
        if (!original[field]) {
          expect(translated[field], `${original.slug}/${field}`).toBeUndefined();
          continue;
        }
        expect(translated[field], `${original.slug}/${field}`).toHaveLength(original[field].length);
        original[field].forEach((text, i) => {
          expect(translated[field]?.[i], `${original.slug}/${field}/${i}`).not.toBe(text);
          expect(translated[field]?.[i].trim().length).toBeGreaterThan(5);
        });
      }
      for (const field of ["slug", "name", "type", "status", "sources", "relatedGuides", "relatedItems", "detailUpdatedAt", "evidence", "changeHistory", "observedPrice"] as const) {
        expect(translated[field], `${original.slug}/${field}`).toEqual(original[field]);
      }
    }

    // Removing item names exposes a repeated category template even if every item has a different title.
    for (const field of ["description", "role"] as const) {
      const distinct = (items: typeof translations) => new Set(items.map((item) => item[field].replaceAll(item.name, "[item]"))).size;
      expect(distinct(translations), `${field} must retain distinct source explanations`)
        .toBeGreaterThanOrEqual(distinct([...itemLibrary]));
    }
  });
});
