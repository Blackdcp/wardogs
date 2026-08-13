export function assetPath(pathname: string) {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
