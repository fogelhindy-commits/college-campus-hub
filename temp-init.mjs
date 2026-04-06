import { createClient } from "@libsql/client";
import fs from "node:fs";

const url = process.env.TURSO_DATABASE_URL?.trim();
const authToken = process.env.TURSO_AUTH_TOKEN?.trim();

if (!url || !authToken) {
  throw new Error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN.");
}

const client = createClient({
  url,
  authToken,
});

async function init() {
  try {
    const sql = fs.readFileSync("./prisma/init.sql", "utf8");
    console.log("Pushing schema to Turso...");
    await client.executeMultiple(sql);
    console.log("Schema initialized successfully.");
  } finally {
    await client.close();
  }
}

init().catch((error) => {
  console.error("Error initializing Turso:", error);
  process.exit(1);
});
