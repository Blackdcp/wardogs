import {z} from "zod";
import type {GuideManifestEntry} from "./manifest";
import {isApprovedSourceUrl} from "./source-policy";

const isoDate = /^\d{4}-\d{2}-\d{2}$/;

const badgeSchema = z.object({
  label: z.string().trim().min(1).max(30),
  tone: z.enum(["accent", "warning", "danger", "muted"])
});

const faqSchema = z.object({
  question: z.string().trim().min(8),
  answer: z.string().trim().min(12)
});

const sourceSchema = z.object({
  label: z.string().trim().min(2),
  url: z.string().url().refine(isApprovedSourceUrl, {message: "Source URL is not approved"}),
  kind: z.enum(["official", "creator", "community"]),
  checkedAt: z.string().regex(isoDate, "checkedAt must be an ISO date")
});

export const guideFrontmatterSchema = z.object({
  title: z.string().trim().min(12).max(60),
  description: z.string().trim().min(140).max(160),
  keyword: z.string().trim().min(3),
  category: z.enum(["access", "release", "store", "platform", "video", "community", "developer", "guide"]),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  order: z.number().int().positive(),
  updatedAt: z.string().regex(isoDate, "updatedAt must be an ISO date"),
  badges: z.array(badgeSchema).min(1).max(4),
  faq: z.array(faqSchema).min(2),
  sources: z.array(sourceSchema).min(1)
});

export type GuideFrontmatter = z.infer<typeof guideFrontmatterSchema>;

export function validateGuideFrontmatter(value: unknown, entry: GuideManifestEntry): GuideFrontmatter {
  const parsed = guideFrontmatterSchema.parse(value);
  const fields = ["keyword", "category", "slug", "order"] as const;
  for (const field of fields) {
    if (parsed[field] !== entry[field]) {
      throw new Error(`${field} must match the keyword manifest`);
    }
  }
  return parsed;
}
