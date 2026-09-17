export type SiteSearchType = "guide" | "item" | "video" | "tool" | "map";

export type SiteSearchEntry = {
  id: `${SiteSearchType}:${string}`;
  type: SiteSearchType;
  title: string;
  aliases: readonly string[];
  summary: string;
  taskIntent: readonly string[];
  category: string;
  href: string;
};

export type SiteSearchCounts = {
  guides: number;
  items: number;
  videos: number;
  tools: number;
};

export type SearchNavigationKey = "ArrowDown" | "ArrowUp" | "Home" | "End";
export type SearchKeyboardAction =
  | {type: "select"; index: number}
  | {type: "clear"}
  | {type: "open"; href: string}
  | {type: "none"};

export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function scoreEntry(entry: SiteSearchEntry, query: string): number {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return 0;

  const title = normalizeSearchText(entry.title);
  const aliases = entry.aliases.map(normalizeSearchText).filter(Boolean);
  if (title === normalizedQuery) return 4_000;
  if (aliases.includes(normalizedQuery)) return 3_900;
  if (title.startsWith(normalizedQuery)) return 3_000;
  if (aliases.some((alias) => alias.startsWith(normalizedQuery))) return 2_900;

  const tokens = normalizedQuery.split(" ");
  const primary = [title, ...aliases].join(" ");
  const supporting = [entry.summary, ...entry.taskIntent, entry.category].map(normalizeSearchText).join(" ");
  const haystack = `${primary} ${supporting}`;
  if (!tokens.every((token) => haystack.includes(token))) return 0;

  const primaryMatches = tokens.filter((token) => primary.includes(token)).length;
  return 2_000 + (primaryMatches * 40) + (haystack.includes(normalizedQuery) ? 20 : 0);
}

export function searchSiteIndex(index: readonly SiteSearchEntry[], query: string, limit = 8): SiteSearchEntry[] {
  return index
    .map((entry) => ({entry, score: scoreEntry(entry, query)}))
    .filter(({score}) => score > 0)
    .sort((left, right) => right.score - left.score
      || left.entry.title.localeCompare(right.entry.title)
      || left.entry.id.localeCompare(right.entry.id))
    .slice(0, limit)
    .map(({entry}) => entry);
}

export function getNextSearchSelection(current: number, key: SearchNavigationKey, resultCount: number): number {
  if (resultCount <= 0) return -1;
  if (key === "Home") return 0;
  if (key === "End") return resultCount - 1;
  if (key === "ArrowDown") return current < 0 ? 0 : (current + 1) % resultCount;
  return current < 0 ? resultCount - 1 : (current - 1 + resultCount) % resultCount;
}

export function getSearchKeyboardAction(
  key: string,
  current: number,
  results: readonly SiteSearchEntry[]
): SearchKeyboardAction {
  if (key === "Escape") return {type: "clear"};
  if (key === "Enter") {
    const result = results[current];
    return result ? {type: "open", href: result.href} : {type: "none"};
  }
  if (key === "ArrowDown" || key === "ArrowUp" || key === "Home" || key === "End") {
    return {type: "select", index: getNextSearchSelection(current, key, results.length)};
  }
  return {type: "none"};
}

export function getSiteSearchCounts(index: readonly SiteSearchEntry[]): SiteSearchCounts {
  return {
    guides: index.filter((entry) => entry.type === "guide").length,
    items: index.filter((entry) => entry.type === "item").length,
    videos: index.filter((entry) => entry.type === "video").length,
    tools: index.filter((entry) => entry.type === "tool" || entry.type === "map").length
  };
}
