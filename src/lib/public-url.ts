type PublicReferenceKind = "asset" | "route";

type PublicReference = {
  pathname: string;
  suffix: string;
};

function hasUriScheme(reference: string) {
  return /^[a-z][a-z\d+.-]*:/i.test(reference);
}

function isProtocolRelative(reference: string) {
  return reference.startsWith("//");
}

function splitReference(reference: string): PublicReference {
  const suffixIndex = reference.search(/[?#]/);
  if (suffixIndex < 0) return {pathname: reference, suffix: ""};
  return {pathname: reference.slice(0, suffixIndex), suffix: reference.slice(suffixIndex)};
}

function normalizeBasePath(value = process.env.NEXT_PUBLIC_BASE_PATH ?? "") {
  const normalized = value.replace(/^\/+|\/+$/g, "");
  return normalized ? `/${normalized}` : "";
}

function normalizePathname(pathname: string) {
  const normalized = pathname.replace(/^\/+|\/+$/g, "");
  return normalized ? `/${normalized}` : "/";
}

function hasBasePath(pathname: string, basePath: string) {
  return basePath !== "" && (pathname === basePath || pathname.startsWith(`${basePath}/`));
}

function addBasePath(pathname: string, basePath: string) {
  if (!basePath || hasBasePath(pathname, basePath)) return pathname;
  return pathname === "/" ? `${basePath}/` : `${basePath}${pathname}`;
}

function removeBasePath(pathname: string, basePath: string) {
  if (!hasBasePath(pathname, basePath)) return pathname;
  const withoutBasePath = pathname.slice(basePath.length);
  return withoutBasePath || "/";
}

function publicPath(reference: string, kind: PublicReferenceKind) {
  if (hasUriScheme(reference) || isProtocolRelative(reference)) return reference;

  const {pathname, suffix} = splitReference(reference);
  if (!pathname) return suffix;

  const basePath = normalizeBasePath();
  let publicPathname = addBasePath(normalizePathname(pathname), basePath);
  if (kind === "route" && process.env.GITHUB_PAGES === "true" && !publicPathname.endsWith("/")) {
    publicPathname += "/";
  }
  return `${publicPathname}${suffix}`;
}

function configuredSiteUrl() {
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  const defaultSiteUrl = process.env.NODE_ENV === "production" ? "https://www.wardogswiki.com" : "http://localhost:3000";
  return process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.NODE_ENV === "production" ? defaultSiteUrl : vercelHost ? `https://${vercelHost}` : defaultSiteUrl);
}

export function getPublicSiteBase() {
  const siteUrl = new URL(configuredSiteUrl());
  const basePath = normalizeBasePath();
  const sitePath = normalizeBasePath(siteUrl.pathname);
  const deploymentPath = basePath && sitePath !== basePath && !sitePath.endsWith(basePath)
    ? `${sitePath}${basePath}`
    : sitePath || basePath;
  return `${siteUrl.origin}${deploymentPath}`;
}

function publicUrl(reference: string, kind: PublicReferenceKind) {
  if (hasUriScheme(reference)) return reference;
  if (isProtocolRelative(reference)) return new URL(reference, configuredSiteUrl()).toString();

  const publicReference = publicPath(reference, kind);
  const {pathname, suffix} = splitReference(publicReference);
  if (!pathname) return `${getPublicSiteBase()}${suffix}`;

  const relativePathname = removeBasePath(pathname, normalizeBasePath());
  return `${getPublicSiteBase()}${relativePathname}${suffix}`;
}

export function publicRoutePath(reference: string) {
  return publicPath(reference, "route");
}

export function publicAssetPath(reference: string) {
  return publicPath(reference, "asset");
}

export function publicRouteUrl(reference: string) {
  return publicUrl(reference, "route");
}

export function publicAssetUrl(reference: string) {
  return publicUrl(reference, "asset");
}
