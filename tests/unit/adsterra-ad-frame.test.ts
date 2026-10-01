import {afterEach, describe, expect, it, vi} from "vitest";
import {GET} from "../../src/app/api/ad-frame/[key]/route";
import {ADSTERRA_BANNER_UNITS, getAdsterraFrameOrigin} from "../../src/features/ads/adsterra-banner";
import {ADSTERRA_NATIVE_ZONE_ID, ADSTERRA_NATIVE_SCRIPT_SRC} from "../../src/features/ads/adsterra-native";

afterEach(() => vi.unstubAllEnvs());
const key = ADSTERRA_BANNER_UNITS.rectangle300.key;
const requestFrame = (host: string, zone = key) => GET(new Request(`https://${host}/api/ad-frame/${zone}`), {params: Promise.resolve({key: zone})});

describe("Adsterra cross-origin container", () => {
  it("serves approved banners only on the isolated production host with a non-removable sandbox", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const response = await requestFrame("wardogswiki.com");
    expect(response.status).toBe(200);
    expect(await response.text()).toContain(ADSTERRA_BANNER_UNITS.rectangle300.src);
    expect(response.headers.get("content-security-policy")).toContain("sandbox allow-scripts allow-same-origin;");
    expect(response.headers.get("content-security-policy")).not.toMatch(/allow-(?:popups|top-navigation|forms|downloads)/);
    expect(response.headers.get("origin-agent-cluster")).toBe("?1");
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
  });

  it("refuses the canonical parent origin and any other production host", async () => {
    vi.stubEnv("NODE_ENV", "production");
    for (const host of ["www.wardogswiki.com", "localhost", "127.0.0.1", "example.com"]) {
      const response = await requestFrame(host);
      expect(response.status, host).toBe(403);
      expect(await response.text()).not.toContain("<script");
    }
  });

  it("serves all six restored display zones through the same isolated container", async () => {
    for (const unit of Object.values(ADSTERRA_BANNER_UNITS)) {
      const response = await requestFrame("wardogswiki.com", unit.key);
      expect(response.status, unit.key).toBe(200);
      expect(await response.text()).toContain(unit.src);
      expect(response.headers.get("content-security-policy")).toContain("sandbox allow-scripts allow-same-origin;");
    }
  });

  it("restores native only through the same restricted isolated host", async () => {
    const response = await requestFrame("wardogswiki.com", ADSTERRA_NATIVE_ZONE_ID);
    expect(response.status).toBe(200);
    expect(await response.text()).toContain(ADSTERRA_NATIVE_SCRIPT_SRC);
    expect(response.headers.get("content-security-policy")).toContain("sandbox allow-scripts allow-same-origin;");
    expect(response.headers.get("content-security-policy")).not.toMatch(/allow-(?:popups|top-navigation|forms|downloads)/);
    expect((await requestFrame("www.wardogswiki.com", ADSTERRA_NATIVE_ZONE_ID)).status).toBe(403);
    expect((await requestFrame("wardogswiki.com", "arbitrary")).status).toBe(404);
  });

  it("uses distinct origins in production and local tests", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(getAdsterraFrameOrigin("https://www.wardogswiki.com")).toBe("https://wardogswiki.com");
    expect(getAdsterraFrameOrigin("http://127.0.0.1:3000")).toBe("https://wardogswiki.com");
    vi.stubEnv("NODE_ENV", "development");
    expect(getAdsterraFrameOrigin("http://127.0.0.1:3000")).toBe("http://localhost:3000");
  });
});
