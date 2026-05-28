import { Router } from "express";
import { db } from "../db/connection";

export const venuesRouter = Router();

function parseVenue(row: any) {
  return {
    ...row,
    category: JSON.parse(row.category || "[]"),
    paymentMethods: JSON.parse(row.payment_methods || "[]"),
    businessHours: row.business_hours,
    reviewCount: row.review_count,
    startingPrice: row.starting_price,
  };
}

venuesRouter.get("/", (req, res) => {
  const keyword = String(req.query.keyword || "").trim();
  const category = String(req.query.category || "");
  const city = String(req.query.city || "");
  const rating = Number(req.query.rating || 0);
  const sort = String(req.query.sort || "rating");

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (keyword) {
    const kw = `%${keyword.toLowerCase()}%`;
    conditions.push("(lower(name) LIKE ? OR lower(city) LIKE ? OR lower(district) LIKE ? OR lower(description) LIKE ? OR lower(category) LIKE ?)");
    params.push(kw, kw, kw, kw, kw);
  }
  if (category && category !== "全部") {
    conditions.push(`category LIKE ?`);
    params.push(`%"${category}"%`);
  }
  if (city && city !== "全部") {
    conditions.push("city = ?");
    params.push(city);
  }
  if (rating > 0) {
    conditions.push("rating >= ?");
    params.push(rating);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const orderClause = sort === "price" ? "ORDER BY starting_price ASC" : "ORDER BY rating DESC";
  // 🟡 FIX: 加 LIMIT 防止無限制回傳所有資料
  const limit = Math.min(Number(req.query.limit || 100), 200);
  const rows = db.prepare(`SELECT * FROM venues ${whereClause} ${orderClause} LIMIT ?`).all(...params, limit).map(parseVenue);
  res.json({ venues: rows });
});

venuesRouter.get("/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM venues WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Venue not found" });
  const venue = parseVenue(row);
  const courses = db.prepare("SELECT id, venue_id as venueId, name, price, description FROM courses WHERE venue_id = ?").all(req.params.id);
  const coaches = db.prepare("SELECT id, venue_id as venueId, name, years_of_experience as yearsOfExperience, bio FROM coaches WHERE venue_id = ?").all(req.params.id);
  const reviews = db.prepare("SELECT id, venue_id as venueId, user_name as userName, rating, comment, created_at as createdAt FROM reviews WHERE venue_id = ?").all(req.params.id);
  res.json({ venue: { ...venue, courses, coaches, reviews } });
});
