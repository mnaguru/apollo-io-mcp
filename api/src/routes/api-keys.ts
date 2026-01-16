import { Router } from "express";
import { supabase } from "../index.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";
import crypto from "crypto";

export const apiKeysRouter = Router();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString("hex");
const ALGORITHM = "aes-256-cbc";

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.slice(0, 32)), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

function decrypt(text: string): string {
  const parts = text.split(":");
  const iv = Buffer.from(parts[0], "hex");
  const encryptedText = parts[1];
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.slice(0, 32)), iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

apiKeysRouter.get("/status", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { data } = await supabase
      .from("api_keys")
      .select("id, is_active, last_used_at, created_at")
      .eq("user_id", req.userId)
      .eq("is_active", true)
      .maybeSingle();

    res.json({ hasKey: !!data, keyInfo: data });
  } catch (error) {
    res.status(500).json({ error: "Failed to check API key status" });
  }
});

apiKeysRouter.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { apiKey } = req.body;

    if (!apiKey || typeof apiKey !== "string") {
      return res.status(400).json({ error: "Invalid API key" });
    }

    const encryptedKey = encrypt(apiKey);

    await supabase
      .from("api_keys")
      .update({ is_active: false })
      .eq("user_id", req.userId);

    const { data, error } = await supabase
      .from("api_keys")
      .insert({
        user_id: req.userId,
        encrypted_key: encryptedKey,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, keyId: data.id });
  } catch (error) {
    console.error("Failed to save API key:", error);
    res.status(500).json({ error: "Failed to save API key" });
  }
});

export async function getUserApiKey(userId: string): Promise<string | null> {
  try {
    const { data } = await supabase
      .from("api_keys")
      .select("encrypted_key")
      .eq("user_id", userId)
      .eq("is_active", true)
      .maybeSingle();

    if (!data) return null;

    await supabase
      .from("api_keys")
      .update({ last_used_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("is_active", true);

    return decrypt(data.encrypted_key);
  } catch (error) {
    console.error("Failed to get user API key:", error);
    return null;
  }
}
