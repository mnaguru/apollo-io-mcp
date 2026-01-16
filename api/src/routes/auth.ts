import { Router, Response } from "express";
import { supabase } from "../index.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";

export const authRouter = Router();

authRouter.post("/validate", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", req.userId)
      .maybeSingle();

    res.json({ valid: true, userId: req.userId, profile });
  } catch (error) {
    res.status(500).json({ error: "Failed to validate session" });
  }
});
