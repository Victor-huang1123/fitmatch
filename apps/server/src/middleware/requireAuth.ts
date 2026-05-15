import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db/connection";
import type { AuthUser, AuthedRequest } from "../types";

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret") as { sub: string };
    const user = db.prepare("SELECT id, name, phone, email, role, merchant_id FROM users WHERE id = ?").get(payload.sub) as AuthUser | undefined;
    if (!user) return res.status(401).json({ error: "Invalid token" });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

export function requireMerchant(req: AuthedRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== "merchant") return res.status(403).json({ error: "Merchant role required" });
  next();
}
