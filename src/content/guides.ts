import {readFile, readdir} from "node:fs/promises";
import path from "node:path";
import type {MDXComponents} from "mdx/types";
import {compileMDX} from "next-mdx-remote/rsc";
import matter from "gray-matter";
import type {Locale} from "../config/site";
import {getManifestEntry, guideManifest, type GuideManifestEntry} from "./manifest";
import {remarkWardogsMdxPolicy} from "./mdx-policy";
import {validateGuideFrontmatter, type GuideFrontmatter} from "./schema";

export type GuideDocument = {
  locale: Locale;
  frontmatter: GuideFrontmatter;
  body: string;
};

export type GuideSummary = Pick<GuideFrontmatter,
  "title" | "description" | "keyword" | "category" | "slug" | "order" | "updatedAt" | "badges"
>;

export function parseGuideSource(source: string, entry: GuideManifestEntry): {frontmatter: GuideFrontmatter; body: string} {
  const parsed = matter(source);
  return {frontmatter: validateGuideFrontmatter(parsed.data, entry), body: parsed.content.trim()};
}

export async function loadGuideDocument(
  locale: Locale,
  slug: string,
  root = path.resolve("content")
): Promise<GuideDocument | null> {
  const entry = getManifestEntry(slug);
  if (!entry) return null;
  try {
    const source = await readFile(path.join(root, locale, "guides", `${slug}.mdx`), "utf8");
    return {locale, ...parseGuideSource(source, entry)};
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export async function listGuideSummaries(
  locale: Locale,
  root = path.resolve("content")
): Promise<GuideSummary[]> {
  const guides = await Promise.all(guideManifest.map(({slug}) => loadGuideDocument(locale, slug, root)));
  return guides.filter((guide): guide is GuideDocument => guide !== null).map(({frontmatter}) => ({
    title: frontmatter.title,
    description: frontmatter.description,
    keyword: frontmatter.keyword,
    category: frontmatter.category,
    slug: frontmatter.slug,
    order: frontmatter.order,
    updatedAt: frontmatter.updatedAt,
    badges: frontmatter.badges
  }));
}

export async function assertCompleteContentMatrix(
  requestedLocales: readonly Locale[],
  root = path.resolve("content")
): Promise<void> {
  const missing: string[] = [];
  const extra: string[] = [];
  const expected = new Set(guideManifest.map(({slug}) => `${slug}.mdx`));

  for (const locale of requestedLocales) {
    const directory = path.join(root, locale, "guides");
    let files: string[] = [];
    try {
      files = (await readdir(directory, {withFileTypes: true}))
        .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
        .map((entry) => entry.name);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    for (const {slug} of guideManifest) {
      if (!files.includes(`${slug}.mdx`)) missing.push(`${locale}/guides/${slug}.mdx`);
    }
    for (const file of files) {
      if (!expected.has(file)) extra.push(`${locale}/guides/${file}`);
    }
  }

  if (missing.length || extra.length) {
    const details = [
      missing.length ? `${missing.length} missing: ${missing.join(", ")}` : "",
      extra.length ? `${extra.length} extra: ${extra.join(", ")}` : ""
    ].filter(Boolean).join("; ");
    throw new Error(`Incomplete guide content matrix - ${details}`);
  }
}

export async function compileGuideBody(body: string, components: MDXComponents) {
  return compileMDX({
    source: body,
    components,
    options: {blockJS: true, blockDangerousJS: true, mdxOptions: {remarkPlugins: [remarkWardogsMdxPolicy]}}
  });
}
