"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { useToast } from "../../lib/toast";
import type { Booking, BookingStatus } from "../../lib/types";
import { BookingItem } from "../../components/booking/BookingItem";

export default function OrdersPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const load = () => api.myBookings().then((res) => setBookings(res.bookings));
  useEffect(() => { if (user) load(); }, [user]);
  async function update(id: string, status: BookingStatus) {
    await api.updateBooking(id, status);
    toast("訂單狀態已更新。");
    load();
  }
  if (!user) return <main className="page"><p className="muted">請先登入。</p><Link className="btn" href="/login?next=/orders">登入</Link></main>;
  return <main className="page"><div className="section-head"><div><p className="eyebrow">學員中心</p><h1>我的訂單</h1></div><Link className="btn secondary" href="/venues">繼續找課</Link></div>{bookings.length ? <section className="list">{bookings.map((booking) => <BookingItem key={booking.id} booking={booking} mode="student" onStatus={update} />)}</section> : <div className="empty">目前沒有預約紀錄。</div>}</main>;
}
