import { PrismaClient } from "@prisma/client";
import net from "net";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  dbAvailable: boolean | null;
  lastDbCheck: number;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

let cachedDbAvailable = globalForPrisma.dbAvailable ?? null;
let lastCheckTime = globalForPrisma.lastDbCheck ?? 0;

/**
 * Fast non-blocking check to determine if MySQL port is open.
 * Prevents Prisma's 20-second connection timeout when MySQL server is not running.
 */
export async function isDatabaseAvailable(): Promise<boolean> {
  const now = Date.now();
  // Cache check for 10 seconds to avoid pinging on every request
  if (cachedDbAvailable !== null && now - lastCheckTime < 10000) {
    return cachedDbAvailable;
  }

  return new Promise((resolve) => {
    const socket = new net.Socket();
    let resolved = false;

    const finish = (available: boolean) => {
      if (!resolved) {
        resolved = true;
        socket.destroy();
        cachedDbAvailable = available;
        lastCheckTime = Date.now();
        globalForPrisma.dbAvailable = available;
        globalForPrisma.lastDbCheck = lastCheckTime;
        resolve(available);
      }
    };

    socket.setTimeout(250); // max 250ms timeout
    socket.on("connect", () => finish(true));
    socket.on("timeout", () => finish(false));
    socket.on("error", () => finish(false));

    try {
      socket.connect(3306, "127.0.0.1");
    } catch {
      finish(false);
    }
  });
}
