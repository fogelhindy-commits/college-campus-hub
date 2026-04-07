import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const target = path.join(
  root,
  "node_modules",
  "@opennextjs",
  "aws",
  "dist",
  "build",
  "copyTracedFiles.js",
);

if (!fs.existsSync(target)) {
  throw new Error(`Missing OpenNext copy helper: ${target}`);
}

const source = fs.readFileSync(target, "utf8");
if (source.includes("sourceStats.isDirectory()")) {
  process.exit(0);
}

const needle = `export function copyFileAndMakeOwnerWritable(src, dest) {
    copyFileSync(src, dest);
    // Ensure the copied file is writable (add owner write permission)
    const stats = statSync(dest);
    if (!(stats.mode & 0o200)) {
        chmodSync(dest, stats.mode | 0o200);
    }
}`;

const replacement = `export function copyFileAndMakeOwnerWritable(src, dest) {
    const sourceStats = statSync(src);
    if (sourceStats.isDirectory()) {
        cpSync(src, dest, { recursive: true, force: true, dereference: true });
        return;
    }
    copyFileSync(src, dest);
    // Ensure the copied file is writable (add owner write permission)
    const stats = statSync(dest);
    if (!(stats.mode & 0o200)) {
        chmodSync(dest, stats.mode | 0o200);
    }
}`;

if (!source.includes(needle)) {
  throw new Error("Could not find OpenNext copy helper body to patch.");
}

fs.writeFileSync(target, source.replace(needle, replacement));
console.log("Patched OpenNext copy helper for Windows junction directories.");
