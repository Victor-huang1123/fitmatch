import type { Request } from "express";

export type Role = "student" | "merchant";
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  role: Role;
  merchant_id?: string | null;
}

export interface AuthedRequest extends Request {
  user?: AuthUser;
}
