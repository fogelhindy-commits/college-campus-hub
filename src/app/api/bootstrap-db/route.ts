import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { INITIAL_STATE } from "@/lib/portal-data";

const APP_STATE_SQL = `
CREATE TABLE IF NOT EXISTS "AppState" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "data" TEXT NOT NULL,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;

const INITIAL_AUTH_STATE = {
  accounts: [
    {
      userId: "owner-olivia",
      email: "olivia@campus-hub.edu",
      passwordHash: hashPassword("ChangeMe123!"),
    },
    {
      userId: "teacher-taylor",
      email: "taylor@campus-hub.edu",
      passwordHash: hashPassword("ChangeMe123!"),
    },
    {
      userId: "teacher-jordan",
      email: "jordan@campus-hub.edu",
      passwordHash: hashPassword("ChangeMe123!"),
    },
    {
      userId: "secretary-sam",
      email: "sam@campus-hub.edu",
      passwordHash: hashPassword("ChangeMe123!"),
    },
    {
      userId: "student-mia",
      email: "mia@campus-hub.edu",
      passwordHash: hashPassword("ChangeMe123!"),
    },
    {
      userId: "student-noah",
      email: "noah@campus-hub.edu",
      passwordHash: hashPassword("ChangeMe123!"),
    },
    {
      userId: "student-ava",
      email: "ava@campus-hub.edu",
      passwordHash: hashPassword("ChangeMe123!"),
    },
  ],
  sessions: [],
};

function jsonOk(result: Record<string, unknown>) {
  return NextResponse.json({ ok: true, ...result });
}

export async function POST() {
  await prisma.$executeRawUnsafe(APP_STATE_SQL);
  await prisma.$executeRawUnsafe(
    `INSERT INTO "AppState" ("id", "data", "updatedAt")
     VALUES ('main', ?, CURRENT_TIMESTAMP)
     ON CONFLICT("id") DO UPDATE SET "data"=excluded."data", "updatedAt"=CURRENT_TIMESTAMP`,
    JSON.stringify(INITIAL_STATE),
  );
  await prisma.$executeRawUnsafe(
    `INSERT INTO "AppState" ("id", "data", "updatedAt")
     VALUES ('auth', ?, CURRENT_TIMESTAMP)
     ON CONFLICT("id") DO UPDATE SET "data"=excluded."data", "updatedAt"=CURRENT_TIMESTAMP`,
    JSON.stringify(INITIAL_AUTH_STATE),
  );

  return jsonOk({
    message: "Bootstrap completed",
  });
}
