import type { BookingStatus, User, Venue, Booking } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function token() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("fitmatch.token") || "";
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  const authToken = token();
  if (authToken) headers.set("Authorization", `Bearer ${authToken}`);
  const res = await fetch(`${API_URL}${path}`, { ...options, headers, cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "API request failed");
  return data as T;
}

export const api = {
  register: (body: { name: string; phone: string; email?: string; password: string }) =>
    request<{ token: string; user: User }>("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body: { phone: string; password: string }) =>
    request<{ token: string; user: User }>("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request<{ user: User }>("/api/auth/me"),
  venues: (params = "") => request<{ venues: Venue[] }>(`/api/venues${params ? `?${params}` : ""}`),
  venue: (id: string) => request<{ venue: Venue }>(`/api/venues/${id}`),
  createBooking: (body: Record<string, unknown>) =>
    request<{ booking: Booking }>("/api/bookings", { method: "POST", body: JSON.stringify(body) }),
  myBookings: () => request<{ bookings: Booking[] }>("/api/bookings/mine"),
  merchantBookings: () => request<{ bookings: Booking[] }>("/api/bookings/merchant"),
  updateBooking: (id: string, status: BookingStatus) =>
    request<{ booking: Booking }>(`/api/bookings/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
};
