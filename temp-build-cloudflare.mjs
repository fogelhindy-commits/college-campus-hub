import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const nextConfigPath = path.join(root, ".next", "required-server-files.json");
const nextRequiredServerFiles = JSON.parse(fs.readFileSync(nextConfigPath, "utf8"));
const nextConfig = nextRequiredServerFiles.config;
const nextBuildIdPath = path.join(root, ".next", "BUILD_ID");
const nextBuildId = fs.existsSync(nextBuildIdPath)
  ? fs.readFileSync(nextBuildIdPath, "utf8").trim()
  : "development";
const nextRoutesManifestPath = path.join(root, ".next", "routes-manifest.json");
const nextPagesManifestPath = path.join(root, ".next", "server", "pages-manifest.json");
const nextPrerenderManifestPath = path.join(root, ".next", "prerender-manifest.json");
const nextAppPathsManifestPath = path.join(root, ".next", "server", "app-paths-manifest.json");
const nextAppPathRoutesManifestPath = path.join(root, ".next", "app-path-routes-manifest.json");
const nextMiddlewareManifestPath = path.join(root, ".next", "server", "middleware-manifest.json");
const nextFunctionsConfigManifestPath = path.join(root, ".next", "server", "functions-config-manifest.json");
const nextRoutesManifest = fs.existsSync(nextRoutesManifestPath)
  ? JSON.parse(fs.readFileSync(nextRoutesManifestPath, "utf8"))
  : { basePath: "", rewrites: { beforeFiles: [], afterFiles: [], fallback: [] }, redirects: [], routes: { static: [], dynamic: [], data: { static: [], dynamic: [] } }, locales: [] };
const nextPagesManifest = fs.existsSync(nextPagesManifestPath)
  ? JSON.parse(fs.readFileSync(nextPagesManifestPath, "utf8"))
  : {};
const nextPrerenderManifest = fs.existsSync(nextPrerenderManifestPath)
  ? JSON.parse(fs.readFileSync(nextPrerenderManifestPath, "utf8"))
  : void 0;
const nextAppPathsManifest = fs.existsSync(nextAppPathsManifestPath)
  ? JSON.parse(fs.readFileSync(nextAppPathsManifestPath, "utf8"))
  : {};
const nextAppPathRoutesManifest = fs.existsSync(nextAppPathRoutesManifestPath)
  ? JSON.parse(fs.readFileSync(nextAppPathRoutesManifestPath, "utf8"))
  : {};
const nextMiddlewareManifest = fs.existsSync(nextMiddlewareManifestPath)
  ? JSON.parse(fs.readFileSync(nextMiddlewareManifestPath, "utf8"))
  : {};
const nextFunctionsConfigManifest = fs.existsSync(nextFunctionsConfigManifestPath)
  ? JSON.parse(fs.readFileSync(nextFunctionsConfigManifestPath, "utf8"))
  : { functions: {}, version: 1 };
const virtualFsEntries = new Map();
if (fs.existsSync(nextConfigPath)) {
  const requiredServerFilesJson = fs.readFileSync(nextConfigPath, "utf8");
  virtualFsEntries.set(".next/required-server-files.json", requiredServerFilesJson);
  virtualFsEntries.set(nextConfigPath.replace(/\\/g, "/"), requiredServerFilesJson);
}
if (fs.existsSync(nextBuildIdPath)) {
  const buildId = fs.readFileSync(nextBuildIdPath, "utf8");
  virtualFsEntries.set(".next/BUILD_ID", buildId);
  virtualFsEntries.set(nextBuildIdPath.replace(/\\/g, "/"), buildId);
}
for (const filePath of nextRequiredServerFiles.files ?? []) {
  const normalizedPath = path.normalize(filePath).replace(/\\/g, "/");
  const absPath = path.normalize(path.isAbsolute(filePath) ? filePath : path.join(root, filePath)).replace(/\\/g, "/");
  if (fs.existsSync(path.join(root, filePath))) {
    virtualFsEntries.set(normalizedPath, fs.readFileSync(path.join(root, filePath), "utf8"));
    virtualFsEntries.set(absPath, fs.readFileSync(path.join(root, filePath), "utf8"));
  }
}

const esbuildBin = path.join(root, "node_modules", "@esbuild", "win32-x64", "esbuild.exe");
const serverAdapter = path.join(
  root,
  "node_modules",
  "@opennextjs",
  "aws",
  "dist",
  "adapters",
  "server-adapter.js",
);
const cloudflareTemplates = path.join(
  root,
  "node_modules",
  "@opennextjs",
  "cloudflare",
  "dist",
  "cli",
  "templates",
  "shims",
);
const openNextDir = path.join(root, ".open-next");
const workerTemplate = path.join(
  root,
  "node_modules",
  "@opennextjs",
  "cloudflare",
  "dist",
  "cli",
  "templates",
  "worker.js",
);
const serverDir = path.join(openNextDir, "server-functions", "default");
const handlerOut = path.join(serverDir, "handler.mjs");
const middlewareOut = path.join(serverDir, "middleware.mjs");
const doDir = path.join(openNextDir, ".build", "durable-objects");
const workerEntry = path.join(openNextDir, "worker.js");
const workerBundle = path.join(openNextDir, "worker.bundle.mjs");

const defineStandaloneConfig = JSON.stringify(JSON.stringify(nextConfig));
const commonArgs = [
  serverAdapter,
  "--bundle",
  "--platform=node",
  "--format=esm",
  "--target=esnext",
  `--outfile=${handlerOut}`,
  "--external:./middleware/handler.mjs",
  "--external:./middleware.mjs",
  "--external:./open-next.config.mjs",
  "--external:critters",
  `--banner:js=import {setInterval, clearInterval, setTimeout, clearTimeout} from "node:timers"`,
  `--define:process.env.__NEXT_PRIVATE_STANDALONE_CONFIG=${defineStandaloneConfig}`,
  `--define:process.env.NEXT_RUNTIME="nodejs"`,
  `--define:process.env.NODE_ENV="production"`,
  `--define:process.env.__NEXT_TRUST_HOST_HEADER="true"`,
  `--define:__dirname=""`,
  `--define:__non_webpack_require__=require`,
  `--alias:next/dist/compiled/node-fetch=${path.join(cloudflareTemplates, "fetch.js")}`,
  `--alias:next/dist/compiled/ws=${path.join(cloudflareTemplates, "empty.js")}`,
  `--alias:next/dist/compiled/@ampproject/toolbox-optimizer=${path.join(cloudflareTemplates, "throw.js")}`,
  `--alias:next/dist/compiled/edge-runtime=${path.join(cloudflareTemplates, "empty.js")}`,
  `--alias:@next/env=${path.join(cloudflareTemplates, "env.js")}`,
];

fs.copyFileSync(path.join(openNextDir, "middleware", "handler.mjs"), middlewareOut);
fs.mkdirSync(doDir, { recursive: true });
fs.writeFileSync(
  path.join(doDir, "queue.js"),
  "export class DOQueueHandler {}\n",
);
fs.writeFileSync(
  path.join(doDir, "sharded-tag-cache.js"),
  "export class DOShardedTagCache {}\n",
);
fs.writeFileSync(
  path.join(doDir, "bucket-cache-purge.js"),
  "export class BucketCachePurge {}\n",
);
execFileSync(esbuildBin, commonArgs, { stdio: "inherit" });

const cloudflareInitPath = path.join(openNextDir, "cloudflare", "init.js");
if (fs.existsSync(cloudflareInitPath)) {
  const originalInit = fs.readFileSync(cloudflareInitPath, "utf8");
  const patchedInit = originalInit
    .replace(
      'Object.assign(process, { version: process.version || "v22.14.0" });',
      'try { if (!("version" in process) || process.version == null) { Object.defineProperty(process, "version", { value: "v22.14.0", configurable: true }); } } catch {}',
    )
    .replace(
      'Object.assign(process.versions, { node: "22.14.0", ...process.versions });',
      'try { if (!process.versions?.node) { Object.defineProperty(process.versions, "node", { value: "22.14.0", configurable: true }); } } catch {}',
    );

  if (patchedInit !== originalInit) {
    fs.writeFileSync(cloudflareInitPath, patchedInit);
  }
}

fs.copyFileSync(workerTemplate, workerEntry);
execFileSync(
  esbuildBin,
  [
    workerEntry,
    "--bundle",
    "--platform=node",
    "--format=esm",
    "--target=esnext",
    `--outfile=${workerBundle}`,
  ],
  { stdio: "inherit" },
);

if (fs.existsSync(workerBundle)) {
  const originalBundle = fs.readFileSync(workerBundle, "utf8");
  const requirePrelude = `import * as __nodePath from "node:path";\nimport * as __nodeUrl from "node:url";\nimport * as __nodeUtil from "node:util";\nimport * as __nodeOs from "node:os";\nimport * as __nodeStream from "node:stream";\nimport * as __nodeHttp from "node:http";\nimport * as __nodeHttps from "node:https";\nimport * as __nodeCrypto from "node:crypto";\nimport * as __nodeProcess from "node:process";\nconst __NEXT_REQUIRED_SERVER_FILES = ${JSON.stringify(nextConfig)};\nconst __NEXT_BUILD_ID = ${JSON.stringify(nextBuildId)};\nprocess.env.NEXT_DEPLOYMENT_ID ||= __NEXT_BUILD_ID;\nprocess.env.NEXT_IMMUTABLE_ASSET_TOKEN ||= __NEXT_BUILD_ID;\nconst __VIRTUAL_FS = ${JSON.stringify(Object.fromEntries(virtualFsEntries))};\nconst __virtualFsLookup = (filePath) => {\n  const normalized = String(filePath).replace(/\\\\/g, "/");\n  for (const [key, value] of Object.entries(__VIRTUAL_FS)) {\n    if (normalized === key || normalized.endsWith(\"/\" + key)) {\n      return value;\n    }\n  }\n  return void 0;\n};\nconst __fsShim = {\n  existsSync(filePath) {\n    return __virtualFsLookup(filePath) !== void 0;\n  },\n  readFileSync(filePath) {\n    const value = __virtualFsLookup(filePath);\n    if (value === void 0) {\n      throw new Error(\"Virtual fs missing file: \" + String(filePath));\n    }\n    return value;\n  },\n  writeFileSync() {},\n  mkdirSync() {},\n  statSync(filePath) {\n    const value = __virtualFsLookup(filePath);\n    if (value === void 0) {\n      throw new Error("Virtual fs missing file: " + String(filePath));\n    }\n    return { isFile: () => true, isDirectory: () => false, size: String(value).length };\n  },\n  readdirSync() {\n    return [];\n  },\n  promises: {\n    readFile: async (filePath) => {\n      const value = __virtualFsLookup(filePath);\n      if (value === void 0) {\n        throw new Error(\"Virtual fs missing file: \" + String(filePath));\n      }\n      return value;\n    },\n    writeFile: async () => {},\n    mkdir: async () => {},\n    readdir: async () => [],\n    stat: async (filePath) => {\n      const value = __virtualFsLookup(filePath);\n      if (value === void 0) {\n        throw new Error(\"Virtual fs missing file: \" + String(filePath));\n      }\n      return { isFile: () => true, isDirectory: () => false, size: String(value).length };\n    }\n  }\n};\nconst __immediateShim = (callback, ...args) => setTimeout(callback, 0, ...args);\nif (typeof globalThis.setImmediate !== \"function\") {\n  globalThis.setImmediate = __immediateShim;\n}\nif (typeof globalThis.clearImmediate !== \"function\") {\n  globalThis.clearImmediate = (handle) => clearTimeout(handle);\n}\nconst __nodeModuleStub = { _resolveFilename: (request2) => request2, prototype: { require(request2) { return require(request2); } } };\nvar require = Object.assign((id) => {\n  switch (id) {\n    case \"fs\":\n    case \"node:fs\":\n      return __fsShim;\n    case \"fs/promises\":\n    case \"node:fs/promises\":\n      return __fsShim.promises;\n    case \"module\":\n    case \"node:module\":\n      return __nodeModuleStub;\n    case \"path\":\n    case \"node:path\":\n      return __nodePath;\n    case \"url\":\n    case \"node:url\":\n      return __nodeUrl;\n    case \"util\":\n    case \"node:util\":\n      return __nodeUtil;\n    case \"os\":\n    case \"node:os\":\n      return __nodeOs;\n    case \"stream\":\n    case \"node:stream\":\n      return __nodeStream;\n    case \"http\":\n    case \"node:http\":\n      return __nodeHttp;\n    case \"https\":\n    case \"node:https\":\n      return __nodeHttps;\n    case \"crypto\":\n    case \"node:crypto\":\n      return __nodeCrypto;\n    case \"process\":\n    case \"node:process\":\n      return __nodeProcess;\n    default:\n      return {};\n  }\n}, { resolve: (id) => id });\n`;
  const withPrelude = originalBundle.startsWith(requirePrelude)
    ? originalBundle
    : `${requirePrelude}${originalBundle}`;
  const patchedBundle = withPrelude
    .replace(
      'Object.assign(process2, { version: process2.version || "v22.14.0" });',
      'try { if (!("version" in process2) || process2.version == null) { Object.defineProperty(process2, "version", { value: "v22.14.0", configurable: true }); } } catch {}',
    )
    .replace(
      'Object.assign(process2.versions, { node: "22.14.0", ...process2.versions });',
      'try { if (!process2.versions?.node) { Object.defineProperty(process2.versions, "node", { value: "22.14.0", configurable: true }); } } catch {}',
    )
    .replace(
      'mod = __require2("node:module");',
      'mod = { _resolveFilename: (request2) => request2 };',
    )
    .replace(
      'mod2 = __require2("node:module");',
      'mod2 = { _resolveFilename: (request2) => request2 };',
    )
    .replace(
      'function setNextjsServerWorkingDirectory() {\n  process.chdir("");\n}',
      'function setNextjsServerWorkingDirectory() {\n}',
    );
  const patchedBundle2 = patchedBundle.replace(
    'var rootSpanIdKey = api.createContextKey("next.rootSpanId");',
    'var rootSpanIdKey = (api.createContextKey ?? ((name) => Symbol.for(name)))("next.rootSpanId");',
  );
  const patchedBundle3 = patchedBundle2
    .replace(
      'var { context, propagation, trace, SpanStatusCode, SpanKind, ROOT_CONTEXT } = api;',
      'var { context, propagation, trace, SpanStatusCode, SpanKind, ROOT_CONTEXT } = api;\n        ROOT_CONTEXT = ROOT_CONTEXT ?? { getValue: () => undefined, setValue: (_key, _value) => ROOT_CONTEXT, deleteValue: () => ROOT_CONTEXT };\n        context = context ?? { active: () => ROOT_CONTEXT, with: (_ctx, fn, ...args) => fn(...args), bind: (_ctx, value) => value };\n        propagation = propagation ?? { inject: () => {}, extract: (_ctx, _carrier) => ROOT_CONTEXT };\n        trace = trace ?? { getTracer: () => ({ startActiveSpan: (_name, _options, fn) => fn({ setAttribute() {}, setAttributes() {}, recordException() {}, setStatus() {}, end() {} }) }), getSpan: () => undefined, getSpanContext: () => ROOT_CONTEXT };\n        SpanKind = SpanKind ?? { SERVER: 1, CLIENT: 2, PRODUCER: 3, CONSUMER: 4, INTERNAL: 5 };\n        SpanStatusCode = SpanStatusCode ?? { ERROR: 2, OK: 1 };',
    )
    .replace(
      'var { context, propagation, trace, SpanStatusCode, SpanKind, ROOT_CONTEXT } = api;\n        context = context ?? { active: () => ROOT_CONTEXT, with: (_ctx, fn, ...args) => fn(...args), bind: (_ctx, value) => value };\n        propagation = propagation ?? { inject: () => {}, extract: (_ctx, _carrier) => ROOT_CONTEXT };\n        trace = trace ?? { getTracer: () => ({ startSpan: () => ({ setAttribute() {}, recordException() {}, setStatus() {}, end() {} }) }), getSpan: () => undefined, getSpanContext: () => undefined };',
      'var { context, propagation, trace, SpanStatusCode, SpanKind, ROOT_CONTEXT } = api;\n        ROOT_CONTEXT = ROOT_CONTEXT ?? { getValue: () => undefined, setValue: (_key, _value) => ROOT_CONTEXT, deleteValue: () => ROOT_CONTEXT };\n        context = context ?? { active: () => ROOT_CONTEXT, with: (_ctx, fn, ...args) => fn(...args), bind: (_ctx, value) => value };\n        propagation = propagation ?? { inject: () => {}, extract: (_ctx, _carrier) => ROOT_CONTEXT };\n        trace = trace ?? { getTracer: () => ({ startActiveSpan: (_name, _options, fn) => fn({ setAttribute() {}, setAttributes() {}, recordException() {}, setStatus() {}, end() {} }) }), getSpan: () => undefined, getSpanContext: () => ROOT_CONTEXT };\n        SpanKind = SpanKind ?? { SERVER: 1, CLIENT: 2, PRODUCER: 3, CONSUMER: 4, INTERNAL: 5 };\n        SpanStatusCode = SpanStatusCode ?? { ERROR: 2, OK: 1 };',
    )
    .replace(
      'const m_1 = await Promise.resolve().then(() => (init_aws_apigw_v2(), aws_apigw_v2_exports));',
      'const m_1 = await Promise.resolve().then(() => (init_edge(), edge_exports));',
    )
    .replace(
      'const m_1 = await Promise.resolve().then(() => (init_aws_lambda(), aws_lambda_exports));',
      'const m_1 = await Promise.resolve().then(() => (init_cloudflare_edge(), cloudflare_edge_exports));',
    )
    .replace(
      'error4("NextJS request failed.", e5);\n        await tryRenderError("500", res, routingResult.internalEvent);',
      'console.error("NextJS request failed.", e5?.stack || e5);\n        throw e5;',
    )
    .replace(
      'function loadConfig(nextDir) {\n  const filePath = path3.join(nextDir, "required-server-files.json");\n  const json = fs.readFileSync(filePath, "utf-8");\n  const { config } = JSON.parse(json);\n  return config;\n}',
      'function loadConfig(nextDir) {\n  return __NEXT_REQUIRED_SERVER_FILES;\n}',
    )
    .replace(
      'function loadBuildId(nextDir) {\n  const filePath = path3.join(nextDir, "BUILD_ID");\n  return fs.readFileSync(filePath, "utf-8").trim();\n}',
      'function loadBuildId(nextDir) {\n  return __NEXT_BUILD_ID;\n}',
    );
  const patchedBundle6a = patchedBundle3.replace(
    'SpanStatusCode = SpanStatusCode ?? { ERROR: 2, OK: 1 };',
    'SpanStatusCode = SpanStatusCode ?? { ERROR: 2, OK: 1 };',
  );
  const patchedBundle4 = patchedBundle6a.replace(
    'kind: _tracer.SpanKind.SERVER,',
    'kind: (_tracer.SpanKind?.SERVER ?? 1),',
  );
  const patchedBundle5 = patchedBundle4
    .replace(
      'cacheHandlerPath = __require2.resolve("./cache.cjs");',
      'cacheHandlerPath = void 0;',
    )
    .replace(
      'composableCacheHandlerPath = __require2.resolve("./composable-cache.cjs");',
      'composableCacheHandlerPath = void 0;',
    )
    .replace(
      /error4\("NextJS request failed\.", e5\);\s+await tryRenderError\("500", res, routingResult\.internalEvent\);/g,
      'console.error("NextJS request failed.", e5?.stack || e5);\n      throw e5;',
    )
    .replace(
      /error4\("NextJS request failed\.", e5\);\s+res\.statusCode = 500;\s+res\.setHeader\("Content-Type", "application\/json"\);\s+res\.end\(JSON\.stringify\(\{\s+message: "Server failed to respond\.",\s+details: e5\s+\}, null, 2\)\);/g,
      'console.error("NextJS request failed in tryRenderError.", e5?.stack || e5);\n    throw e5;',
    )
    .replace(
      /logError\(err2\) \{\s+if \(this\.quiet\) return;\s+_log\.error\(err2\);\s+\}/,
      'logError(err2) {\n            if (this.quiet) return;\n            console.error("Next.js error:", err2?.stack || err2);\n            _log.error(err2);\n          }',
    );
  const patchedBundle6 = patchedBundle5
    .replace(
      'import fs from "node:fs";',
      'const fs = __fsShim;',
    )
    .replace(/__require2\("node:fs\/promises"\)/g, "__fsShim.promises")
    .replace(/__require2\("fs\/promises"\)/g, "__fsShim.promises")
    .replace(/__require2\("node:fs"\)/g, "__fsShim")
    .replace(/__require2\("fs"\)/g, "__fsShim")
    .replace(
      'res.body("Internal Server Error").send();',
      'res.body((err2?.stack || String(err2) || "Internal Server Error")).send();',
    )
    .replace(
      'body: _renderresult.default.fromStatic("Internal Server Error", "text/plain")',
      'body: _renderresult.default.fromStatic(err2?.stack || String(err2) || "Internal Server Error", "text/plain")',
    )
    .replace(
      '        waitUntil: ctx.waitUntil.bind(ctx)\n',
      '        waitUntil: typeof ctx?.waitUntil === "function" ? ctx.waitUntil.bind(ctx) : (() => {})\n',
    )
    .replace(
      'async fetch(request2, env, ctx) {\n    return runWithCloudflareRequestContext(request2, env, ctx, async () => {',
      'async fetch(request2, env, ctx) {\n    try {\n      return await runWithCloudflareRequestContext(request2, env, ctx, async () => {',
    )
    .replace(
      '      return handler5(reqOrResp, env, ctx, request2.signal);\n    });\n  }\n};',
      '      return handler5(reqOrResp, env, ctx, request2.signal);\n    });\n    } catch (error) {\n      console.error("Worker fetch failed.", error?.stack || error);\n      return new Response(typeof error?.stack === "string" ? error.stack : String(error), {\n        status: 500,\n        headers: { "content-type": "text/plain; charset=UTF-8" },\n      });\n    }\n  }\n};',
    );

  if (patchedBundle6 !== originalBundle) {
    fs.writeFileSync(workerBundle, patchedBundle6);
  }
}

console.log(`Worker bundle written to ${workerBundle}`);
