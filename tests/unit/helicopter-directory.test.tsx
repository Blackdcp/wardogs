import {describe, expect, it} from "vitest";
import {renderToStaticMarkup} from "react-dom/server";
import {getHelicopterRecords} from "../../src/app/[locale]/vehicles/helicopters/helicopter-directory";
import HelicoptersPage, {generateMetadata, generateStaticParams} from "../../src/app/[locale]/vehicles/helicopters/page";

describe("helicopter directory", () => {
  it("lists the six published Alpha aircraft and excludes ground vehicles", () => {
    const records = getHelicopterRecords("en");
    expect(records.map((record) => record.slug)).toEqual([
      "ah-6m-miniguns", "ah-6r-rockets", "havoc", "mh-6", "uh-1y-miniguns", "uh-1y"
    ]);
    expect(records.every((record) => record.detailStatus === "published" && record.detailHref)).toBe(true);
  });

  it("prerenders every supported locale with a canonical directory URL", async () => {
    expect(generateStaticParams().map(({locale}) => locale)).toEqual(["en", "ru", "de", "pt-br", "ja", "zh-cn"]);
    const metadata = await generateMetadata({params: Promise.resolve({locale: "en"})});
    expect(metadata.alternates?.canonical).toBe("http://localhost:3000/en/vehicles/helicopters");
    expect(metadata.openGraph?.images).toEqual([{
      url: "http://localhost:3000/images/catalogue/banners/vehicles-1280.webp",
      width: 1280,
      height: 720,
      alt: "WARDOGS vehicle catalogue"
    }]);
  });

  it("renders a useful directory with separated Season 1 evidence and detail links", async () => {
    const html = renderToStaticMarkup(await HelicoptersPage({params: Promise.resolve({locale: "en"})}));
    expect(html).toContain("WARDOGS Helicopters");
    expect(html).toContain("Z20 Lakota");
    expect(html).toContain("$35,000");
    expect(html).toContain("Alpha 1 archive");
    expect(html).toContain('href="/en/items/vehicles/mh-6"');
    expect(html).toContain('href="/en/guides/wardogs-helicopter-guide"');
    expect(html).toContain("Search helicopters");
    expect(html).not.toContain('data-catalogue-record="bobcat"');
  });
});
