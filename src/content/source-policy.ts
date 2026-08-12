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
  "discord.com",
  "x.com",
  "twitter.com",
  "reddit.com",
  "www.reddit.com"
]);

const competitorHosts = new Set(["wardogshub.gg", "www.wardogshub.gg", "gamblewithyourfriends.net", "www.gamblewithyourfriends.net"]);

export function isApprovedSourceUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !competitorHosts.has(url.hostname) && approvedHosts.has(url.hostname);
  } catch {
    return false;
  }
}

export function assertApprovedSourceUrl(value: string): void {
  if (!isApprovedSourceUrl(value)) {
    throw new Error(`Source URL is not approved: ${value}`);
  }
}
