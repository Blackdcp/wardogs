import {execFileSync, spawnSync} from "node:child_process";
import {pathToFileURL} from "node:url";
import {submitIndexNow} from "./submit-indexnow.mjs";

function git(...args) {
  return execFileSync("git", args, {encoding: "utf8"}).trim();
}

export function validateDeploymentDiff(base, head, status) {
  if (!base || /^0+$/.test(base)) throw new Error("Set INDEXNOW_BASE_SHA to the last production content revision before deploying.");
  if (status) throw new Error("Commit or remove local changes before deploying, so the IndexNow diff matches production.");
  if (base === head) throw new Error("No committed changes since INDEXNOW_BASE_SHA.");
}

export async function deployProduction() {
  const base = process.env.INDEXNOW_BASE_SHA;
  const head = git("rev-parse", "HEAD");
  validateDeploymentDiff(base, head, git("status", "--porcelain"));
  git("rev-parse", "--verify", `${base}^{commit}`);
  execFileSync("git", ["merge-base", "--is-ancestor", base, head]);

  const deployment = spawnSync("vercel", ["deploy", "--prod", "--yes"], {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: {...process.env, NO_UPDATE_NOTIFIER: "1"}
  });
  if (deployment.error) throw deployment.error;
  if (deployment.status !== 0) throw new Error(`Production deployment failed (${deployment.status}); IndexNow was not notified.`);

  process.env.BEFORE_SHA = base;
  process.env.CURRENT_SHA = head;
  const result = await submitIndexNow();
  if (result.submitted >= 200) {
    console.warn("IndexNow reached the 200-URL safety cap. Review the changed routes before another targeted submission.");
  }
  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  deployProduction().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
