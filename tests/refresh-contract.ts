/**
 * Single source of truth for the current content refresh.
 *
 * The release-contract tests pin each guide's `updatedAt` so a stale page cannot
 * ship unnoticed. Those dates used to be hard-coded across a dozen test files,
 * which meant every refresh required editing all of them. Changing the values
 * here now updates the whole contract.
 *
 * How to run a refresh:
 *   1. Set `CURRENT_REFRESH_DATE` to today's date.
 *   2. Move the previous `CURRENT_REFRESH_DATE` into `PREVIOUS_REFRESH_DATE`.
 *   3. List every slug you actually rewrote under its locale in `REFRESHED_SLUGS`.
 *   4. Stamp the matching `updatedAt` in the MDX frontmatter for those slugs.
 *
 * A locale with no entries in `REFRESHED_SLUGS` is expected to still carry
 * `PREVIOUS_REFRESH_DATE`, so partially translated refreshes fail loudly
 * instead of being hidden by a global date bump.
 */

/** Date stamped on guides rewritten in the current pass. */
export const CURRENT_REFRESH_DATE = "2026-09-15";

/** Date still stamped on guides that the current pass did not touch. */
export const PREVIOUS_REFRESH_DATE = "2026-09-13";

/** Slugs rewritten in the current pass, grouped by locale. */
export const REFRESHED_SLUGS: Record<string, readonly string[]> = {
  en: [
    "wardogs-beta",
    "wardogs-beginner-guide",
    "wardogs-community-servers-guide",
    "wardogs-crash-fix",
    "wardogs-download",
    "wardogs-early-access",
    "wardogs-fob-guide",
    "wardogs-known-issues",
    "wardogs-launch-checklist",
    "wardogs-money-guide",
    "wardogs-patch-notes",
    "wardogs-playtest",
    "wardogs-preload",
    "wardogs-price",
    "wardogs-progression-wipes-guide",
    "wardogs-release-date",
    "wardogs-server-status",
    "wardogs-steam",
    "wardogs-twitter"
  ],
  de: [],
  ru: [],
  "pt-br": [],
  ja: [],
  "zh-cn": [
    "wardogs-beta",
    "wardogs-beginner-guide",
    "wardogs-community-servers-guide",
    "wardogs-crash-fix",
    "wardogs-download",
    "wardogs-early-access",
    "wardogs-fob-guide",
    "wardogs-known-issues",
    "wardogs-launch-checklist",
    "wardogs-money-guide",
    "wardogs-patch-notes",
    "wardogs-playtest",
    "wardogs-preload",
    "wardogs-price",
    "wardogs-progression-wipes-guide",
    "wardogs-release-date",
    "wardogs-server-status",
    "wardogs-steam",
    "wardogs-twitter"
  ]
};

const refreshedByLocale = new Map(
  Object.entries(REFRESHED_SLUGS).map(([locale, slugs]) => [locale, new Set(slugs)])
);

/** Expected `updatedAt` for one guide in one locale under the current contract. */
export function expectedUpdatedAt(locale: string, slug: string): string {
  return refreshedByLocale.get(locale)?.has(slug) ? CURRENT_REFRESH_DATE : PREVIOUS_REFRESH_DATE;
}
