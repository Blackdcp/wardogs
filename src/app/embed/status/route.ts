import {getPublicStatus} from "@/features/live-ops/public-status";

export const dynamic = "force-static";

export function GET() {
  const status = getPublicStatus();
  const officialSource = status.sources[0];
  const body = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>WARDOGS Current Status</title>
  <style>
    :root { color-scheme: dark; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
    * { box-sizing: border-box; }
    html, body { margin: 0; min-height: 100%; background: #0d100f; color: #f4f6f5; }
    body { display: grid; place-items: center; padding: 12px; }
    .widget { width: min(100%, 520px); border: 1px solid #39443f; border-radius: 8px; background: #171d1a; box-shadow: 0 12px 28px rgb(0 0 0 / 24%); overflow: hidden; }
    .accent { height: 4px; background: #39b978; }
    .content { padding: 18px; }
    .topline { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .eyebrow { margin: 0; color: #a9b7b0; font-size: 12px; font-weight: 700; text-transform: uppercase; }
    .badge { flex: none; border: 1px solid #4ed18c; border-radius: 999px; padding: 4px 8px; color: #75e6aa; font-size: 12px; font-weight: 800; }
    h1 { margin: 12px 0 4px; font-size: 24px; line-height: 1.15; letter-spacing: 0; }
    .schedule { margin: 0; color: #c4cec9; font-size: 13px; line-height: 1.5; }
    .status-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px; margin: 18px 0 12px; border: 1px solid #303a35; background: #303a35; }
    .status-item { min-width: 0; background: #111614; padding: 12px; }
    .status-label { display: block; margin-bottom: 4px; color: #8fa098; font-size: 10px; font-weight: 800; text-transform: uppercase; }
    .status-value { color: #f4f6f5; font-size: 14px; font-weight: 800; }
    .note { margin: 0; color: #a9b7b0; font-size: 12px; line-height: 1.5; }
    .links { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 10px 18px; margin-top: 18px; border-top: 1px solid #303a35; padding-top: 13px; font-size: 12px; }
    a { color: #78d9a7; text-underline-offset: 3px; }
  </style>
</head>
<body>
  <main class="widget">
    <div class="accent"></div>
    <div class="content">
      <div class="topline">
        <p class="eyebrow">WARDOGS current status</p>
        <span class="badge" id="status-badge">Live</span>
      </div>
      <h1 id="status-title">WARDOGS Early Access is live</h1>
      <p class="schedule">Patch 0.11 is the latest official patch announcement.</p>
      <div class="status-grid">
        <div class="status-item">
          <span class="status-label">Current phase</span>
          <span class="status-value">Season 1 Early Access</span>
        </div>
        <div class="status-item">
          <span class="status-label">Last checked</span>
          <span class="status-value">September 17</span>
        </div>
      </div>
      <p class="note">The published maintenance window has passed. This is not live telemetry; use the official feed for live service status before troubleshooting locally.</p>
      <div class="links">
        <a href="${officialSource.url}" target="_blank" rel="noopener noreferrer">Official source</a>
        <span>Powered by <a href="${status.links.home}" target="_blank" rel="noopener noreferrer">WARDOGS Wiki</a></span>
      </div>
    </div>
  </main>
</body>
</html>`;

  return new Response(body, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
      "content-security-policy": "frame-ancestors *",
      "x-content-type-options": "nosniff"
    }
  });
}
