import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceDir = path.join(root, ".open-next");
const targetDir = path.join(root, "pages-dist");

if (!fs.existsSync(sourceDir)) {
  throw new Error("Missing .open-next build output. Run `npm run cf:build` first.");
}

fs.rmSync(targetDir, { recursive: true, force: true });
fs.cpSync(sourceDir, targetDir, { recursive: true, force: true });

const workerSource = path.join(targetDir, "worker.js");
const workerTarget = path.join(targetDir, "_worker.js");
if (fs.existsSync(workerSource)) {
  fs.copyFileSync(workerSource, workerTarget);
} else {
  throw new Error("Missing .open-next/worker.js. The Cloudflare build did not finish correctly.");
}

console.log(`Pages upload directory ready: ${targetDir}`);
