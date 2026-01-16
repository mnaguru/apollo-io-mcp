import { Router } from "express";
import { supabase } from "../index.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";

export const savedRouter = Router();

savedRouter.use(authMiddleware);

savedRouter.get("/", async (req: AuthRequest, res) => {
  try {
    const resultType = req.query.type as string;

    let query = supabase
      .from("saved_results")
      .select("*")
      .eq("user_id", req.userId)
      .order("created_at", { ascending: false });

    if (resultType && (resultType === "person" || resultType === "company")) {
      query = query.eq("result_type", resultType);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch saved results" });
  }
});

savedRouter.post("/", async (req: AuthRequest, res) => {
  try {
    const { resultType, resultData, tags, notes } = req.body;

    if (!resultType || !resultData) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (resultType !== "person" && resultType !== "company") {
      return res.status(400).json({ error: "Invalid result type" });
    }

    const { data, error } = await supabase
      .from("saved_results")
      .insert({
        user_id: req.userId,
        result_type: resultType,
        result_data: resultData,
        tags: tags || [],
        notes: notes || null
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: "Failed to save result" });
  }
});

savedRouter.delete("/:id", async (req: AuthRequest, res) => {
  try {
    const { error } = await supabase
      .from("saved_results")
      .delete()
      .eq("id", req.params.id)
      .eq("user_id", req.userId);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete saved result" });
  }
});

savedRouter.patch("/:id", async (req: AuthRequest, res) => {
  try {
    const { tags, notes } = req.body;

    const { data, error } = await supabase
      .from("saved_results")
      .update({ tags, notes })
      .eq("id", req.params.id)
      .eq("user_id", req.userId)
      .select()
      .single();

    if (error) throw error;

    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: "Failed to update saved result" });
  }
});
