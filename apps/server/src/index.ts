import "dotenv/config";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { initSchema } from "./db/connection";
import { seed } from "./db/seed";
import { authRouter } from "./routes/auth";
import { bookingsRouter } from "./routes/bookings";
import { venuesRouter } from "./routes/venues";

// 🔴 FIX: 捕捉未處理的例外，防止整個 process crash
process.on("uncaughtException", (err) => {
  console.error("[uncaughtException]", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("[unhandledRejection]", reason);
});

initSchema();
seed();

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000").split(",");
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "50kb" }));

// 🟡 FIX: 改為非同步 setImmediate，避免 console.log 阻塞 event loop
app.use((req, _res, next) => {
  setImmediate(() => console.log(`${new Date().toISOString()} ${req.method} ${req.path}`));
  next();
});

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter);
app.use("/api/venues", venuesRouter);
app.use("/api/bookings", bookingsRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

const port = Number(process.env.PORT || 4000);
const host = process.env.HOST || "127.0.0.1";
export const server = app.listen(port, host, () => {
  console.log(`FitMatch API listening on http://${host}:${port}`);
});

// 🔴 FIX: 設定 server timeout，防止客戶端佔住連線不釋放
server.keepAliveTimeout = 65_000;   // 65 秒 (要大於 load balancer 的 60s)
server.headersTimeout  = 66_000;   // 比 keepAliveTimeout 多 1 秒
