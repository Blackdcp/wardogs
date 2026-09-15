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
    .countdown { margin: 18px 0 8px; color: #ffd166; font-size: 22px; font-weight: 800; font-variant-numeric: tabular-nums; letter-spacing: 0; }
    .note { min-height: 36px; margin: 0; color: #a9b7b0; font-size: 12px; line-height: 1.5; }
    .links { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 10px 18px; margin-top: 18px; border-top: 1px solid #303a35; padding-top: 13px; font-size: 12px; }
    a { color: #78d9a7; text-underline-offset: 3px; }
  </style>
</head>
<body>
  <main
    class="widget"
    data-maintenance-starts-at="${status.maintenance.startsAt}"
    data-maintenance-duration-minutes="${status.maintenance.expectedDurationMinutes}"
  >
    <div class="accent"></div>
    <div class="content">
      <div class="topline">
        <p class="eyebrow">WARDOGS current status</p>
        <span class="badge" id="status-badge">Live</span>
      </div>
      <h1 id="status-title">WARDOGS Early Access is live</h1>
      <p class="schedule" id="status-schedule">Patch 0.11 shipped September 14 after the 08:00 UTC maintenance window</p>
      <p class="countdown" id="status-countdown" role="status" aria-live="polite">No further maintenance announced</p>
      <p class="note" id="status-note">Patch 0.11 rebuilt the server browser, fixed cash exploits and GPU crashes, and added Asia capacity. This widget is schedule-based, not live telemetry.</p>
      <div class="links">
        <a href="${officialSource.url}" target="_blank" rel="noopener noreferrer">Official source</a>
        <span>Powered by <a href="${status.links.home}" target="_blank" rel="noopener noreferrer">WARDOGS Wiki</a></span>
      </div>
    </div>
  </main>
  <script>
    (() => {
      const widget = document.querySelector(".widget");
      const badge = document.getElementById("status-badge");
      const title = document.getElementById("status-title");
      const schedule = document.getElementById("status-schedule");
      const countdown = document.getElementById("status-countdown");
      const note = document.getElementById("status-note");
      const maintenanceStart = Date.parse(widget.dataset.maintenanceStartsAt);
      const maintenanceDuration = Number(widget.dataset.maintenanceDurationMinutes) * 60 * 1000;
      const maintenanceEnd = maintenanceStart + maintenanceDuration;

      function formatDuration(milliseconds) {
        const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return [days + "d", String(hours).padStart(2, "0") + "h", String(minutes).padStart(2, "0") + "m", String(seconds).padStart(2, "0") + "s"].join(" ");
      }

      function updateStatus() {
        const nowMs = Date.now();

        if (nowMs < maintenanceStart) {
          badge.textContent = "Live";
          title.textContent = "WARDOGS Early Access is live";
          schedule.textContent = "Patch 0.11 maintenance: September 14 at 08:00 UTC";
          countdown.textContent = "Maintenance in " + formatDuration(maintenanceStart - nowMs);
          return;
        }

        if (nowMs < maintenanceEnd) {
          badge.textContent = "Maintenance";
          title.textContent = "Patch 0.11 maintenance window";
          schedule.textContent = "Scheduled downtime began at 08:00 UTC";
          countdown.textContent = "Approximate window remaining " + formatDuration(maintenanceEnd - nowMs);
          note.textContent = "The one-hour duration is an estimate, not live server telemetry. Check the official update before retrying.";
          return;
        }

        badge.textContent = "Patch 0.11";
        title.textContent = "WARDOGS Early Access is live on Patch 0.11";
        schedule.textContent = "Maintenance ran September 14 at 08:00 UTC and the patch has shipped";
        countdown.textContent = "No further maintenance announced";
        note.textContent = "This widget does not run live server telemetry. Check the official source for the next scheduled window.";
      }

      updateStatus();
      setInterval(updateStatus, 1000);
    })();
  </script>
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
