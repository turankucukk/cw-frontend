"use server";

import crypto from "crypto";

const getSecret = () => {
  const secret = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "default_fallback_secret_key_12345";
  return crypto.createHash("sha256").update(secret).digest();
};

export async function generateInviteToken(reservationId: number): Promise<string> {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", getSecret(), iv);
  let encrypted = cipher.update(reservationId.toString(), "utf8", "base64url");
  encrypted += cipher.final("base64url");
  return iv.toString("base64url") + "." + encrypted;
}

export async function decodeInviteToken(token: string): Promise<number | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const iv = Buffer.from(parts[0], "base64url");
    const decipher = crypto.createDecipheriv("aes-256-cbc", getSecret(), iv);
    let decrypted = decipher.update(parts[1], "base64url", "utf8");
    decrypted += decipher.final("utf8");
    return parseInt(decrypted, 10);
  } catch (e) {
    console.error("decodeInviteToken error:", e);
    return null;
  }
}
