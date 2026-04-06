import { spawnSync } from "node:child_process";

delete process.env.PRISMA_CLIENT_ENGINE_TYPE;
delete process.env.PRISMA_GENERATE_DATAPROXY;
delete process.env.PRISMA_GENERATE_NO_ENGINE;
delete process.env.PRISMA_SKIP_POSTINSTALL_GENERATE;

const result = spawnSync("npx", ["prisma", "generate"], {
  stdio: "inherit",
  env: process.env,
  shell: true,
});

process.exit(result.status ?? 1);
