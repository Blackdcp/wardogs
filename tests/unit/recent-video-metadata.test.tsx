import {Children, isValidElement, type ReactElement, type ReactNode} from "react";
import {describe, expect, it, vi} from "vitest";
import VideoPage, {generateMetadata} from "../../src/app/[locale]/videos/[slug]/page";
import {locales} from "../../src/config/site";
import {getLocalizedVideoArticle} from "../../src/features/videos/video-localization";
import {getRecentVideoSeo, RECENT_VIDEO_SEO_SLUGS} from "../../src/features/videos/recent-video-seo-copy";
import {recentVideoUi} from "../../src/features/videos/recent-video-data";

vi.mock("next-intl/server", () => ({getTranslations: async () => (key: string) => key}));
vi.mock("@/i18n/navigation", () => ({Link: "a"}));

type Props = {children?: ReactNode; dateTime?: string; "data-video-description"?: boolean; "data-video-review-scope"?: boolean};
function descendants(node: ReactNode): ReactElement<Props>[] {
  return Children.toArray(node).filter(isValidElement).flatMap(element => {
    const child = element as ReactElement<Props>;
    return [child, ...descendants(child.props.children)];
  });
}

describe("recent watch page search metadata and visible evidence", () => {
  it.each(locales)("uses concise %s search and social summaries while retaining the full article answer", async locale => {
    for (const slug of RECENT_VIDEO_SEO_SLUGS) {
      const article = getLocalizedVideoArticle(locale, slug)!;
      const seo = getRecentVideoSeo(locale, slug)!;
      const metadata = await generateMetadata({params: Promise.resolve({locale, slug})});
      expect(metadata.title).toBe(article.title);
      expect(metadata.description).toBe(seo.description);
      expect(metadata.openGraph?.description).toBe(seo.description);
      expect(metadata.twitter?.description).toBe(seo.description);
      expect(metadata.keywords).toBe(["WARDOGS", ...seo.keywords].join(", "));
      expect(metadata.alternates?.canonical).toBe(`http://localhost:3000/${locale}/videos/${slug}`);

      const page = await VideoPage({params: Promise.resolve({locale, slug})});
      const nodes = descendants(page);
      const fullDescription = nodes.find(node => node.props["data-video-description"]);
      expect(fullDescription?.props.children).toBe(article.description);
      expect(fullDescription?.props.children).not.toBe(seo.description);
      const review = nodes.find(node => node.props["data-video-review-scope"])!;
      const dates = descendants(review);
      expect(dates.filter(node => node.type === "time").map(node => node.props.dateTime)).toEqual([
        article.articlePublishedDate, article.publishedAt
      ]);
      const dateLabels = dates.filter(node => node.type === "p").flatMap(node => Children.toArray(node.props.children));
      expect(dateLabels).toContain(recentVideoUi[locale].articlePublished);
      expect(dateLabels).toContain(recentVideoUi[locale].published);
    }
  });

  it("preserves the existing metadata of older watch pages", async () => {
    const slug = "wardogs-gameplay-impressions";
    const article = getLocalizedVideoArticle("en", slug)!;
    const metadata = await generateMetadata({params: Promise.resolve({locale: "en", slug})});
    expect(metadata.title).toBe(article.title);
    expect(metadata.description).toBe(article.description);
    expect(metadata.keywords).toBe(`WARDOGS ${article.title}, WARDOGS video, WARDOGS gameplay, WARDOGS guide, ${article.sourceLabel}`);
  });
});
