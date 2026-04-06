import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

let prismaInstance: PrismaClient | undefined = globalForPrisma.prisma;

function createPrismaClient() {
  const databaseUrl =
    process.env.TURSO_DATABASE_URL?.trim() ||
    process.env.DATABASE_URL?.trim() ||
    "";
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim();

  return new PrismaClient({
    adapter: new PrismaLibSql({
      url: databaseUrl,
      authToken: authToken || undefined,
    }),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function getPrismaClient() {
  prismaInstance ??= createPrismaClient();
  return prismaInstance;
}

const prismaProxy = new Proxy({} as PrismaClient, {
  get(_target, property, receiver) {
    const client = getPrismaClient();
    return Reflect.get(client, property, receiver);
  },
  set(_target, property, value, receiver) {
    const client = getPrismaClient();
    return Reflect.set(client, property, value, receiver);
  },
  has(_target, property) {
    const client = getPrismaClient();
    return Reflect.has(client, property);
  },
  ownKeys() {
    return Reflect.ownKeys(getPrismaClient());
  },
  getOwnPropertyDescriptor(_target, property) {
    return Object.getOwnPropertyDescriptor(getPrismaClient(), property);
  },
}) as PrismaClient;

export const prisma = prismaProxy;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = getPrismaClient();
}
