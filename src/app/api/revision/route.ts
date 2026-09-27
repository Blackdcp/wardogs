export const dynamic = "force-static";

export function GET() {
  return Response.json(
    {revision: process.env.WARDOGSWIKI_RELEASE_SHA ?? "unknown"},
    {headers: {"cache-control": "no-store"}}
  );
}
