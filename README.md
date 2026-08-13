# WARDOGS Wiki

WARDOGS is a fan-made guide for players following BULKHEAD and Team17's tactical all-out warfare FPS. The site is independent and is not affiliated with BULKHEAD, Team17, Valve, Steam, or the WARDOGS rights holders.

## Requirements

- Node.js 20.9 or newer
- npm
- `NEXT_PUBLIC_SITE_URL` set to the final HTTPS origin for production builds

```powershell
npm.cmd install
npm.cmd run dev
```

Local routes start at `http://127.0.0.1:3000/en`. The root path redirects to English, and every visible route is available in English, Russian, German, and Brazilian Portuguese.

## Content Contract

The library contains **20 topics x 4 locales**, stored as MDX under `content/{locale}/guides`. Every locale must include every slug listed in `keywords.json`; changing that manifest requires synchronized content and tests rather than automatic route expansion.

Frontmatter keeps `keyword`, `category`, `slug`, and `order` synchronized with the manifest. Titles are at most 60 characters, descriptions are 140-160 characters, and every source must use HTTPS, be dated, and belong to the approved official, creator, or community host set. Competitor URLs and copied competitor prose are forbidden. Local visual assets originate from official WARDOGS media and are used for identification and commentary on this independent guide.

## Verification

Run the release gates in this order:

```powershell
npm.cmd run content:validate
npm.cmd run links:check
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run test:e2e
$env:NEXT_PUBLIC_SITE_URL='https://your-production-domain.example'
npm.cmd run build
```

## Production

Set `NEXT_PUBLIC_SITE_URL` to the exact public HTTPS origin, then run `npm.cmd run build` and `npm.cmd run start`. Vercel can build the repository with the same environment variable and automatically serves the generated Next.js routes, images, sitemap, robots file, and localized metadata.
