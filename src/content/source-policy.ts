const approvedHosts = new Set([
  "store.steampowered.com",
  "steamcommunity.com",
  "team17.com",
  "www.team17.com",
  "bulkhead.com",
  "www.bulkhead.com",
  "youtube.com",
  "www.youtube.com",
  "youtu.be",
  "twitch.tv",
  "www.twitch.tv",
  "discord.com",
  "x.com",
  "reddit.com",
  "www.reddit.com",
  "support.microsoft.com",
  "pcgamer.com",
  "www.pcgamer.com",
  "wardogs100k.com",
  "www.wardogs100k.com",
]);

const competitorHosts = new Set([
  "wardogshub.gg",
  "www.wardogshub.gg",
  "wardogs.wiki",
  "www.wardogs.wiki",
  "gamblewithyourfriends.net",
  "www.gamblewithyourfriends.net"
]);

const approvedExactUrls = new Set([
  "https://www.linkedin.com/posts/bulkhead_new-devlog-level-design-performance-activity-7483535791831478273-9DOJ"
]);

export function isApprovedSourceUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || competitorHosts.has(url.hostname)) {
      return false;
    }

    return approvedHosts.has(url.hostname) || approvedExactUrls.has(url.href.replace(/\/$/, ""));
  } catch {
    return false;
  }
}

export function assertApprovedSourceUrl(value: string): void {
  if (!isApprovedSourceUrl(value)) {
    throw new Error(`Source URL is not approved: ${value}`);
  }
}
