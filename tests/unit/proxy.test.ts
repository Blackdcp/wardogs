import {describe, expect, test} from "vitest";
import * as publicUrl from "@/lib/public-url";

type CanonicalHostRedirect = (requestUrl: URL) => URL | undefined;

function canonicalHostRedirect() {
  return (publicUrl as typeof publicUrl & {
    getCanonicalHostRedirect?: CanonicalHostRedirect;
  }).getCanonicalHostRedirect;
}

describe("canonical host redirects", () => {
  test("redirects the apex domain to www while preserving path and query", () => {
    const resolveRedirect = canonicalHostRedirect();

    expect(resolveRedirect).toBeTypeOf("function");
    if (!resolveRedirect) return;

    expect(resolveRedirect(new URL("https://wardogswiki.com/en/guides/wardogs-playtest?source=bing"))?.toString()).toBe(
      "https://www.wardogswiki.com/en/guides/wardogs-playtest?source=bing"
    );
  });

  test("does not redirect the canonical www host", () => {
    const resolveRedirect = canonicalHostRedirect();

    expect(resolveRedirect).toBeTypeOf("function");
    if (!resolveRedirect) return;

    expect(resolveRedirect(new URL("https://www.wardogswiki.com/en"))).toBeUndefined();
  });
});
