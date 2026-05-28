import { Router } from "express";
import { db } from "../db/connection";
import { requireAuth, requireMerchant } from "../middleware/requireAuth";
import type { AuthedRequest, BookingStatus } from "../types";

export const bookingsRouter = Router();

function bookingRows(sql: string, ...params: unknown[]) {
  return db.prepare(sql).all(...params).map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    venueId: row.venue_id,
    courseId: row.course_id,
    contactName: row.contact_name,
    gender: row.gender,
    age: row.age,
    phone: row.phone,
    note: row.note,
    status: row.status,
    createdAt: row.created_at,
    venueName: row.venue_name,
    courseName: row.course_name,
  }));
}

bookingsRouter.post("/", requireAuth, (req: AuthedRequest, res) => {
  const { venueId, courseId, contactName, gender, age, phone, note } = req.body || {};
  if (!venueId || !courseId || !contactName || !/^[0-9]{10}$/.test(phone || "")) return res.status(400).json({ error: "Invalid booking data" });
  const id = `BK-${Date.now().toString(36).toUpperCase()}`;
  db.prepare(`
    INSERT INTO bookings (id, user_id, venue_id, course_id, contact_name, gender, age, phone, note, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `).run(id, req.user!.id, venueId, courseId, contactName, gender || null, Number(age) || null, phone, note || null);
  res.status(201).json({ booking: bookingRows("SELECT * FROM bookings WHERE id = ?", id)[0] });
});

bookingsRouter.get("/mine", requireAuth, (req: AuthedRequest, res) => {
  res.json({ bookings: bookingRows(`
    SELECT b.*, v.name as venue_name, c.name as course_name
    FROM bookings b
    JOIN venues v ON v.id = b.venue_id
    JOIN courses c ON c.id = b.course_id
    WHERE b.user_id = ?
    ORDER BY b.created_at DESC
    LIMIT 200
  `, req.user!.id) });
});

bookingsRouter.get("/merchant", requireAuth, requireMerchant, (req: AuthedRequest, res) => {
  res.json({ bookings: bookingRows(`
    SELECT b.*, v.name as venue_name, c.name as course_name
    FROM bookings b
    JOIN venues v ON v.id = b.venue_id
    JOIN courses c ON c.id = b.course_id
    WHERE v.merchant_id = ?
    ORDER BY b.created_at DESC
    LIMIT 500
  `, req.user!.merchant_id || req.user!.id) });
});

bookingsRouter.patch("/:id/status", requireAuth, (req: AuthedRequest, res) => {
  const status = req.body?.status as BookingStatus;
  if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) return res.status(400).json({ error: "Invalid status" });
  const row = db.prepare(`
    SELECT b.*, v.merchant_id
    FROM bookings b
    JOIN venues v ON v.id = b.venue_id
    WHERE b.id = ?
  `).get(req.params.id) as any;
  if (!row) return res.status(404).json({ error: "Booking not found" });

  const isOwner = row.user_id === req.user!.id;
  const isMerchant = req.user!.role === "merchant" && row.merchant_id === (req.user!.merchant_id || req.user!.id);
  if (!isOwner && !isMerchant) return res.status(403).json({ error: "Forbidden" });
  if (isOwner && status !== "cancelled") return res.status(403).json({ error: "Students can only cancel bookings" });

  db.prepare("UPDATE bookings SET status = ? WHERE id = ?").run(status, req.params.id);
  res.json({ booking: bookingRows("SELECT * FROM bookings WHERE id = ?", req.params.id)[0] });
});
