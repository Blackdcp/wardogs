import {describe, expect, it, vi} from "vitest";

describe("external link checker", () => {
  it("falls back from rejected HEAD to a successful GET", async () => {
    const {checkUrl} = await import("../../scripts/check-external-links.mjs");
    const fetchImpl = vi.fn()
      .mockResolvedValueOnce(new Response(null, {status: 405}))
      .mockResolvedValueOnce(new Response("ok", {status: 200}));
    await expect(checkUrl("https://example.com/page", fetchImpl)).resolves.toMatchObject({status: 200, method: "GET"});
    expect(fetchImpl).toHaveBeenNthCalledWith(1, "https://example.com/page", expect.objectContaining({method: "HEAD"}));
  });

  it("reports a 404 as a hard failure", async () => {
    const {checkUrl} = await import("../../scripts/check-external-links.mjs");
    const fetchImpl = vi.fn().mockResolvedValue(new Response("missing", {status: 404}));
    await expect(checkUrl("https://example.com/missing", fetchImpl)).rejects.toThrow(/404/);
  });

  it("accepts Reddit's verified anti-bot response without hiding a 404", async () => {
    const {checkUrl} = await import("../../scripts/check-external-links.mjs");
    const fetchImpl = vi.fn().mockResolvedValue(new Response("blocked", {status: 403}));
    await expect(checkUrl("https://www.reddit.com/r/WarDogs/", fetchImpl)).resolves.toMatchObject({status: 403, method: "GET"});
  });
});
