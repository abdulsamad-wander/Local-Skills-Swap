import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "../lib/db.js";
import "dotenv/config";
import authRoutes from "../routes/auth.route.js";
import userRoutes from "../routes/user.route.js";
import chatRoutes from "../routes/chat.route.js";

const app = express();

const allowOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: allowOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(cookieParser());

/** On Vercel, connect once per warm instance (connectDB caches). */
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.get("/", (_req, res) => {
  res.json({ ok: true, service: "speak-zen-api" });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// Mount your real routes here, e.g.:
// import authRoutes from "./routes/auth.route.js";
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);


app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Server error" });
});

export default app;
