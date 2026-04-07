import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const indexPath = path.join(
  root,
  ".open-next",
  "server-functions",
  "default",
  "index.mjs",
);

if (!fs.existsSync(indexPath)) {
  throw new Error(`Missing OpenNext server bundle: ${indexPath}`);
}

const serverDir = path.dirname(indexPath);
const serverNextDir = path.join(serverDir, ".next");
const cacheSource = path.join(serverDir, "cache.cjs");
const composableCacheSource = path.join(serverDir, "composable-cache.cjs");
const cacheTarget = path.join(serverNextDir, "cache.cjs");
const composableCacheTarget = path.join(serverNextDir, "composable-cache.cjs");
const turbopackRuntimePath = path.join(
  serverNextDir,
  "server",
  "chunks",
  "ssr",
  "[turbopack]_runtime.js",
);
const nonSsrTurbopackRuntimePath = path.join(
  serverNextDir,
  "server",
  "chunks",
  "[turbopack]_runtime.js",
);
const baseServerPath = path.join(
  serverDir,
  "node_modules",
  "next",
  "dist",
  "server",
  "base-server.js",
);
const handlerPath = path.join(serverDir, "handler.mjs");
const ssrChunkDir = path.join(serverNextDir, "server", "chunks", "ssr");

function buildStaticRequireSwitch() {
  const cases = [];
  if (fs.existsSync(ssrChunkDir)) {
    for (const file of fs.readdirSync(ssrChunkDir)) {
      if (!file.endsWith(".js")) continue;
      cases.push(
        `    case "server/chunks/ssr/${file}":\n      return require("./${file}");`,
      );
    }
  }
  return `function requireChunk(chunkPath) {\n    switch (chunkPath) {\n${cases.join(
    "\n",
  )}\n      default:\n        throw new Error(\`Not found \${chunkPath}\`);\n    }\n  }`;
}

const source = fs.readFileSync(indexPath, "utf8");
const patched = source
  .replace(
    'globalThis.openNextDebug = false;',
    'globalThis.openNextDebug = process.env.OPEN_NEXT_DEBUG === "true";',
  )
  .replace(
    'globalThis.__dirname ??= "";',
    'globalThis.__dirname ??= decodeURIComponent(new URL(".", import.meta.url).pathname).replace(/^\\/([A-Za-z]:)/, "$1");',
  )
  .replace(
    'var cacheHandlerPath = __require.resolve("./cache.cjs");',
    'var cacheHandlerPath = "./cache.cjs";',
  )
  .replace(
    'var composableCacheHandlerPath = __require.resolve("./composable-cache.cjs");',
    'var composableCacheHandlerPath = "./composable-cache.cjs";',
  )
  .replace(
    "function setNextjsServerWorkingDirectory() {\n}",
    "function setNextjsServerWorkingDirectory() {\n  process.chdir(__dirname);\n}",
  )
  .replace(
    /function requireChunk\(chunkPath\) \{\s*switch\(chunkPath\) \{\s*default:\s*throw new Error\(`Not found \$\{chunkPath\}`\);\s*\}\s*\}/s,
    buildStaticRequireSwitch(),
  );

if (patched === source) {
  console.log("OpenNext runtime bundle already patched.");
} else {
  fs.writeFileSync(indexPath, patched);
  console.log("Patched OpenNext runtime cache handler paths.");
}

fs.mkdirSync(serverNextDir, { recursive: true });
if (fs.existsSync(cacheSource)) {
  fs.copyFileSync(cacheSource, cacheTarget);
}
if (fs.existsSync(composableCacheSource)) {
  fs.copyFileSync(composableCacheSource, composableCacheTarget);
}

for (const runtimePath of [turbopackRuntimePath, nonSsrTurbopackRuntimePath]) {
  if (!fs.existsSync(runtimePath)) continue;
  const runtimeSource = fs.readFileSync(runtimePath, "utf8");
  const runtimePatched = runtimeSource.replace(
    /function requireChunk\(chunkPath\) \{\s*switch\(chunkPath\) \{\s*default:\s*throw new Error\(`Not found \$\{chunkPath\}`\);\s*\}\s*\}/s,
    buildStaticRequireSwitch(),
  );

  if (runtimePatched !== runtimeSource) {
    fs.writeFileSync(runtimePath, runtimePatched);
    console.log(`Patched Turbopack runtime chunk loader: ${path.relative(root, runtimePath)}`);
  }
}

if (fs.existsSync(baseServerPath)) {
  const baseServerSource = fs.readFileSync(baseServerPath, "utf8");
  const baseServerPatched = baseServerSource.replace(
    'await components.ComponentMod.handler(handlerReq, handlerRes, {\n            waitUntil: this.getWaitUntil()\n        });',
    'const componentMod = typeof components.ComponentMod?.handler === "function"\n            ? components.ComponentMod\n            : components.ComponentMod?.default ?? components.ComponentMod;\n        const componentHandler = typeof componentMod?.handler === "function"\n            ? componentMod.handler\n            : typeof componentMod?.default?.handler === "function"\n                ? componentMod.default.handler\n                : typeof componentMod?.default === "function"\n                    ? componentMod.default\n                    : typeof componentMod === "function"\n                        ? componentMod\n                        : null;\n        if (typeof componentHandler !== "function") {\n            throw new Error(`Invalid component handler for ${components.page ?? "unknown page"}`);\n        }\n        await componentHandler(handlerReq, handlerRes, {\n            waitUntil: this.getWaitUntil()\n        });',
  );

  if (baseServerPatched !== baseServerSource) {
    fs.writeFileSync(baseServerPath, baseServerPatched);
    console.log("Patched Next base-server component handler normalization.");
  }
}

if (fs.existsSync(handlerPath)) {
  const handlerSource = fs.readFileSync(handlerPath, "utf8");
  const handlerPatched = handlerSource.replace(
    'await components.ComponentMod.handler(handlerReq, handlerRes, {\n      waitUntil: this.getWaitUntil(),\n    });',
    'const componentMod = typeof components.ComponentMod?.handler === "function"\n      ? components.ComponentMod\n      : components.ComponentMod?.default ?? components.ComponentMod;\n    const componentHandler = typeof componentMod?.handler === "function"\n      ? componentMod.handler\n      : typeof componentMod?.default?.handler === "function"\n        ? componentMod.default.handler\n        : typeof componentMod?.default === "function"\n          ? componentMod.default\n          : typeof componentMod === "function"\n            ? componentMod\n            : null;\n    if (typeof componentHandler !== "function") {\n      throw new Error(`Invalid component handler for ${components.page ?? "unknown page"}`);\n    }\n    await componentHandler(handlerReq, handlerRes, {\n      waitUntil: this.getWaitUntil(),\n    });',
  );

  if (handlerPatched !== handlerSource) {
    fs.writeFileSync(handlerPath, handlerPatched);
    console.log("Patched OpenNext handler component normalization.");
  }
}
