"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import { useAuth } from "../../../lib/auth";
import { useToast } from "../../../lib/toast";
import type { Booking, BookingStatus } from "../../../lib/types";
import { BookingItem } from "../../../components/booking/BookingItem";

export default function MerchantBookingsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const load = () => api.merchantBookings().then((res) => setBookings(res.bookings));
  useEffect(() => { if (user?.role === "merchant") load(); }, [user]);
  async function update(id: string, status: BookingStatus) {
    await api.updateBooking(id, status);
    toast("訂單狀態已更新。");
    load();
  }
  if (!user || user.role !== "merchant") return <main className="page"><p className="muted">需要商家身份。</p><Link className="btn" href="/login?next=/merchant/bookings">登入</Link></main>;
  return <main className="page"><div className="section-head"><div><p className="eyebrow">商家後台</p><h1>預約列表</h1></div><span className="badge">待處理 {bookings.filter((item) => item.status === "pending").length} 筆</span></div>{bookings.length ? <section className="list">{bookings.map((booking) => <BookingItem key={booking.id} booking={booking} mode="merchant" onStatus={update} />)}</section> : <div className="empty">目前沒有收到預約。</div>}</main>;
}
