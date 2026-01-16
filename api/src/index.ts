import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { createClient } from "@supabase/supabase-js";
import { apolloRouter } from "./routes/apollo.js";
import { authRouter } from "./routes/auth.js";
import { historyRouter } from "./routes/history.js";
import { savedRouter } from "./routes/saved.js";
import { apiKeysRouter } from "./routes/api-keys.js";

const app = express();
const PORT = process.env.API_PORT || 3001;

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

export const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/api-keys", apiKeysRouter);
app.use("/api/v1/apollo", apolloRouter);
app.use("/api/v1/history", historyRouter);
app.use("/api/v1/saved", savedRouter);

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
