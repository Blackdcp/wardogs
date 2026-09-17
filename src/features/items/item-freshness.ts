export type ItemFreshnessSource = {
  detailUpdatedAt?: string;
  evidence?: {verifiedAt?: string};
  changeHistory?: readonly {verifiedAt?: string}[];
};

const fallbackItemModifiedAt = "2026-08-16";

export function getItemLatestVerifiedAt(item: ItemFreshnessSource | undefined) {
  const candidates = [
    item?.detailUpdatedAt,
    item?.evidence?.verifiedAt,
    ...(item?.changeHistory?.map(({verifiedAt}) => verifiedAt) ?? [])
  ].filter((candidate): candidate is string => Boolean(candidate));

  if (candidates.length === 0) return fallbackItemModifiedAt;

  return candidates.slice(1).reduce((latest, candidate) => {
    const candidateTime = Date.parse(candidate);
    const latestTime = Date.parse(latest);
    return Number.isFinite(candidateTime) && candidateTime > latestTime ? candidate : latest;
  }, candidates[0]);
}
