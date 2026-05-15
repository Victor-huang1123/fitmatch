import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db/connection";
import { requireAuth } from "../middleware/requireAuth";
import type { AuthUser, AuthedRequest } from "../types";

export const authRouter = Router();

function publicUser(user: AuthUser) {
  return { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role, merchant_id: user.merchant_id };
}

function signToken(userId: string) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET || "dev_secret", { expiresIn: "7d" });
}

authRouter.post("/register", (req, res) => {
  const { name, phone, email, password } = req.body || {};
  if (!name || !/^[0-9]{10}$/.test(phone || "") || !password || password.length < 8) {
    return res.status(400).json({ error: "Invalid registration data" });
  }
  const id = `u_${Date.now().toString(36)}`;
  const passwordHash = bcrypt.hashSync(password, 10);
  try {
    db.prepare("INSERT INTO users (id, name, phone, email, password_hash, role) VALUES (?, ?, ?, ?, ?, 'student')").run(id, name, phone, email || null, passwordHash);
    const user = db.prepare("SELECT id, name, phone, email, role, merchant_id FROM users WHERE id = ?").get(id) as AuthUser;
    res.json({ token: signToken(user.id), user: publicUser(user) });
  } catch {
    res.status(409).json({ error: "Phone already exists" });
  }
});

authRouter.post("/login", (req, res) => {
  const { phone, password } = req.body || {};
  const row = db.prepare("SELECT * FROM users WHERE phone = ?").get(phone) as (AuthUser & { password_hash: string }) | undefined;
  if (!row || !bcrypt.compareSync(password || "", row.password_hash)) return res.status(401).json({ error: "Invalid credentials" });
  res.json({ token: signToken(row.id), user: publicUser(row) });
});

authRouter.get("/me", requireAuth, (req: AuthedRequest, res) => {
  res.json({ user: publicUser(req.user!) });
});
