import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dbPath = process.env.DB_PATH || "./data/fitmatch.db";
const absolutePath = path.resolve(process.cwd(), dbPath);
fs.mkdirSync(path.dirname(absolutePath), { recursive: true });

export const db = new Database(absolutePath);
db.pragma("foreign_keys = ON");

export function initSchema() {
  db.exec(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      email TEXT,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      merchant_id TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS venues (
      id TEXT PRIMARY KEY,
      merchant_id TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      city TEXT NOT NULL,
      district TEXT NOT NULL,
      address TEXT,
      phone TEXT,
      business_hours TEXT,
      payment_methods TEXT,
      description TEXT,
      rating REAL DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      starting_price INTEGER DEFAULT 0,
      color TEXT,
      FOREIGN KEY (merchant_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      venue_id TEXT NOT NULL,
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      description TEXT,
      FOREIGN KEY (venue_id) REFERENCES venues(id)
    );

    CREATE TABLE IF NOT EXISTS coaches (
      id TEXT PRIMARY KEY,
      venue_id TEXT NOT NULL,
      name TEXT NOT NULL,
      years_of_experience INTEGER DEFAULT 0,
      bio TEXT,
      FOREIGN KEY (venue_id) REFERENCES venues(id)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      venue_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      rating REAL NOT NULL,
      comment TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (venue_id) REFERENCES venues(id)
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      venue_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      contact_name TEXT NOT NULL,
      gender TEXT,
      age INTEGER,
      phone TEXT NOT NULL,
      note TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (venue_id) REFERENCES venues(id),
      FOREIGN KEY (course_id) REFERENCES courses(id)
    );

    CREATE INDEX IF NOT EXISTS idx_venues_city     ON venues(city);
    CREATE INDEX IF NOT EXISTS idx_venues_rating   ON venues(rating DESC);
    CREATE INDEX IF NOT EXISTS idx_venues_price    ON venues(starting_price ASC);
    CREATE INDEX IF NOT EXISTS idx_bookings_user   ON bookings(user_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_venue  ON bookings(venue_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_time   ON bookings(created_at DESC);
  `);
}
