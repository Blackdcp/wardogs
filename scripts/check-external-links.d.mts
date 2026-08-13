export type LinkCheckResult = {url: string; status: number; method: "HEAD" | "GET"};
export function collectPublicUrls(root?: string): Promise<string[]>;
export function checkUrl(url: string, fetchImpl?: typeof fetch): Promise<LinkCheckResult>;
