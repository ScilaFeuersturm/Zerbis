import express from "express";
import cors from "cors";

import { authRouter } from "./routes/auth.routes.js";
import { providersRouter } from "./routes/providers.routes.js";
import { contactRequestsRouter } from "./routes/contactRequests.routes.js";
import { conversationsRouter } from "./routes/conversations.routes.js";
import { reviewsRouter } from "./routes/reviews.routes.js";
import { adminRouter } from "./routes/admin.routes.js";

export const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);
app.use("/api/providers", providersRouter);
app.use("/api/contact-requests", contactRequestsRouter);
app.use("/api/conversations", conversationsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/admin", adminRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});