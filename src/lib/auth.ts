import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { playerSessions } from "@/db/schema";

const AUTH_COOKIE = "sw_auth";
const GUEST_COOKIE = "sw_player";
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

function deriveKey(password: string, salt: Buffer) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, 64, (error, key) => {
      if (error) reject(error);
      else resolve(key as Buffer);
    });
  });
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await deriveKey(password, salt);
  return `${salt.toString("hex")}:${key.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [saltHex, keyHex] = storedHash.split(":");
  if (!saltHex || !keyHex || !/^[a-f0-9]+$/i.test(saltHex) || !/^[a-f0-9]+$/i.test(keyHex)) return false;
  const expected = Buffer.from(keyHex, "hex");
  const actual = await deriveKey(password, Buffer.from(saltHex, "hex"));
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function getAuthenticatedPlayerId() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) return null;
  const [session] = await db
    .select({ playerId: playerSessions.playerId })
    .from(playerSessions)
    .where(and(eq(playerSessions.tokenHash, hashSessionToken(token)), gt(playerSessions.expiresAt, new Date())));
  return session?.playerId ?? null;
}

export async function createPlayerSession(playerId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  await db.insert(playerSessions).values({ tokenHash: hashSessionToken(token), playerId, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
  cookieStore.delete(GUEST_COOKIE);
}

export async function deletePlayerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (token) await db.delete(playerSessions).where(eq(playerSessions.tokenHash, hashSessionToken(token)));
  cookieStore.delete(AUTH_COOKIE);
}