import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_ENV = { ...process.env };
const TTL_SECONDS = 604800;

beforeEach(() => {
  process.env.DATABASE_URL = "postgresql://user:password@host/db?sslmode=require";
  process.env.ADMIN_PASSWORD = "correct-horse-battery-staple";
  process.env.SESSION_SECRET = "a".repeat(32);
  process.env.ADMIN_SESSION_TTL_SECONDS = String(TTL_SECONDS);
  vi.resetModules();
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.useRealTimers();
});

describe("signSession / verifySession", () => {
  it("round-trips a freshly signed token", async () => {
    const { signSession, verifySession } = await import("./session");
    const token = signSession();
    expect(verifySession(token)).toBe(true);
  });

  it("rejects a token with a tampered signature", async () => {
    const { signSession, verifySession } = await import("./session");
    const token = signSession();
    const [payload, signature] = token.split(".");
    const tamperedFirstChar = signature[0] === "a" ? "b" : "a";
    const tamperedSignature = tamperedFirstChar + signature.slice(1);

    expect(verifySession(`${payload}.${tamperedSignature}`)).toBe(false);
  });

  it("rejects a token with a tampered payload", async () => {
    const { signSession, verifySession } = await import("./session");
    const token = signSession();
    const [payload, signature] = token.split(".");
    const tamperedPayload = payload.slice(0, -1) + (payload.at(-1) === "A" ? "B" : "A");

    expect(verifySession(`${tamperedPayload}.${signature}`)).toBe(false);
  });

  it("rejects an expired token", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2020-01-01T00:00:00.000Z"));

    const { signSession, verifySession } = await import("./session");
    const token = signSession();
    expect(verifySession(token)).toBe(true);

    // Advance past the TTL.
    vi.setSystemTime(new Date(Date.now() + TTL_SECONDS * 1000 + 1000));
    expect(verifySession(token)).toBe(false);
  });

  it("returns false, without throwing, for a token with no separator", async () => {
    const { verifySession } = await import("./session");
    expect(() => verifySession("no-dot-in-here")).not.toThrow();
    expect(verifySession("no-dot-in-here")).toBe(false);
  });

  it("returns false, without throwing, for garbage input", async () => {
    const { verifySession } = await import("./session");
    expect(() => verifySession("!!!not-base64.###not-hex")).not.toThrow();
    expect(verifySession("!!!not-base64.###not-hex")).toBe(false);
  });

  it("returns false for an undefined token", async () => {
    const { verifySession } = await import("./session");
    expect(verifySession(undefined)).toBe(false);
  });

  it("returns false for an empty string token", async () => {
    const { verifySession } = await import("./session");
    expect(verifySession("")).toBe(false);
  });

  it("returns false when the payload decodes but has no numeric exp", async () => {
    const { verifySession } = await import("./session");
    const crypto = await import("crypto");
    const encodedPayload = Buffer.from(JSON.stringify({ exp: "not-a-number" })).toString(
      "base64url",
    );
    const signature = crypto
      .createHmac("sha256", process.env.SESSION_SECRET!)
      .update(encodedPayload)
      .digest("hex");

    expect(verifySession(`${encodedPayload}.${signature}`)).toBe(false);
  });
});

describe("verifyPassword", () => {
  it("accepts the configured admin password", async () => {
    const { verifyPassword } = await import("./session");
    expect(verifyPassword("correct-horse-battery-staple")).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const { verifyPassword } = await import("./session");
    expect(verifyPassword("wrong-password")).toBe(false);
  });

  it("rejects a password of a different length without throwing", async () => {
    const { verifyPassword } = await import("./session");
    expect(() => verifyPassword("x")).not.toThrow();
    expect(verifyPassword("x")).toBe(false);
  });
});
