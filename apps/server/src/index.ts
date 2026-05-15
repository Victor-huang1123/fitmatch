import "dotenv/config";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { initSchema } from "./db/connection";
import { seed } from "./db/seed";
import { authRouter } from "./routes/auth";
import { bookingsRouter } from "./routes/bookings";
import { venuesRouter } from "./routes/venues";

initSchema();
seed();

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000").split(",");
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "50kb" }));

app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
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
app.listen(port, () => {
  console.log(`FitMatch API listening on http://localhost:${port}`);
});
