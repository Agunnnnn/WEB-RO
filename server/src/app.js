import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import memberRoutes from "./routes/members.routes.js";
import teamRoutes from "./routes/teams.routes.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || true }));
  app.use(express.json());

  app.get("/health", (req, res) => res.json({ ok: true }));

  app.use("/auth", authRoutes);
  app.use("/members", memberRoutes);
  app.use("/teams", teamRoutes);

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Terjadi kesalahan di server" });
  });

  return app;
}

const app = createApp();
export default app;
