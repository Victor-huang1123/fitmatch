"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { api } from "../../../lib/api";
import { useAuth } from "../../../lib/auth";
import { useToast } from "../../../lib/toast";
import type { Booking, BookingStatus } from "../../../lib/types";
import { BookingItem } from "../../../components/booking/BookingItem";

function StatCard({ num, label, tone }: { num: string | number; label: string; tone?: string }) {
  return (
    <div className={`dash-stat${tone ? ` ${tone}` : ""}`}>
      <div className="dash-stat-num">{num}</div>
      <div className="dash-stat-label">{label}</div>
    </div>
  );
}

export default function MerchantBookingsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");

  const load = () => api.merchantBookings().then((res) => setBookings(res.bookings));
  useEffect(() => { if (user?.role === "merchant") load(); }, [user]);

  async function update(id: string, status: BookingStatus) {
    await api.updateBooking(id, status);
    toast("訂單狀態已更新。");
    load();
  }

  const stats = useMemo(() => {
    const pending = bookings.filter((b) => b.status === "pending").length;
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const cancelled = bookings.filter((b) => b.status === "cancelled").length;
    const total = bookings.length;
    const cancelRate = total > 0 ? Math.round((cancelled / total) * 100) : 0;

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const thisWeek = bookings.filter((b) => new Date(b.createdAt) >= weekStart).length;

    const courseMap: Record<string, number> = {};
    for (const b of bookings) {
      const name = b.courseName ?? "未知課程";
      courseMap[name] = (courseMap[name] ?? 0) + 1;
    }
    const topEntry = Object.entries(courseMap).sort((a, b) => b[1] - a[1])[0];

    return { pending, confirmed, cancelled, total, cancelRate, thisWeek, topEntry };
  }, [bookings]);

  const filtered = statusFilter === "all" ? bookings : bookings.filter((b) => b.status === statusFilter);

  if (!user || user.role !== "merchant") {
    return (
      <main className="page">
        <p className="muted">需要商家身份。</p>
        <Link className="btn" href="/login?next=/merchant/bookings">登入</Link>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="section-head">
        <div>
          <p className="eyebrow">商家後台</p>
          <h1>預約管理</h1>
        </div>
      </div>

      {/* Stats */}
      <div className="dash-stats">
        <StatCard num={stats.pending} label="待確認" tone={stats.pending > 0 ? "warn" : undefined} />
        <StatCard num={stats.thisWeek} label="本週新增" tone="accent" />
        <StatCard
          num={`${stats.cancelRate}%`}
          label="取消率"
          tone={stats.cancelRate > 20 ? "danger" : undefined}
        />
        <StatCard num={stats.total} label="累計訂單" />
      </div>

      {/* Top course banner */}
      {stats.topEntry && (
        <div
          className="panel"
          style={{
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "14px 20px",
          }}
        >
          <span style={{ fontSize: 26 }}>🏆</span>
          <div>
            <p className="eyebrow" style={{ margin: 0 }}>最熱門課程</p>
            <strong>{stats.topEntry[0]}</strong>
            <span className="muted" style={{ marginLeft: 8, fontSize: 13 }}>共 {stats.topEntry[1]} 筆預約</span>
          </div>
        </div>
      )}

      {/* Status filter tabs */}
      <div className="section-head" style={{ marginTop: 0 }}>
        <div className="chip-row">
          {(["all", "pending", "confirmed", "completed", "cancelled"] as const).map((s) => {
            const labels: Record<string, string> = {
              all: "全部", pending: "待確認", confirmed: "已確認", completed: "已完成", cancelled: "已取消",
            };
            const count = s === "all" ? bookings.length : bookings.filter((b) => b.status === s).length;
            return (
              <button
                key={s}
                type="button"
                className={`chip${statusFilter === s ? " chip-active" : ""}`}
                onClick={() => setStatusFilter(s)}
              >
                {labels[s]}
                <span style={{
                  marginLeft: 6,
                  fontWeight: 800,
                  color: statusFilter === s ? "var(--brand-dark)" : "var(--muted)",
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Booking list */}
      {filtered.length ? (
        <section className="list" style={{ marginTop: 12 }}>
          {filtered.map((booking) => (
            <BookingItem key={booking.id} booking={booking} mode="merchant" onStatus={update} />
          ))}
        </section>
      ) : (
        <div className="empty">目前沒有符合條件的預約。</div>
      )}
    </main>
  );
}
