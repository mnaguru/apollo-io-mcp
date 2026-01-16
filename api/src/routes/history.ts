import { Router, Response } from "express";
import { supabase } from "../index.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";

export const historyRouter = Router();

historyRouter.use(authMiddleware);

historyRouter.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from("search_history")
      .select("*", { count: "exact" })
      .eq("user_id", req.userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json({
      data,
      pagination: {
        page,
        limit,
        total: count || 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch search history" });
  }
});

historyRouter.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { error } = await supabase
      .from("search_history")
      .delete()
      .eq("id", req.params.id)
      .eq("user_id", req.userId);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete history item" });
  }
});
