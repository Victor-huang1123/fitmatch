"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import type { Booking } from "../../lib/types";
import BottomNav from "../components/BottomNav";

const STATUS_LABEL: Record<string, string> = { pending: "待確認", confirmed: "已確認", completed: "已完成", cancelled: "已取消" };
const STATUS_COLOR: Record<string, string> = {
  pending: "text-tertiary bg-tertiary/10",
  confirmed: "text-primary bg-primary/10",
  completed: "text-primary bg-primary/10",
  cancelled: "text-status-danger bg-status-danger/10",
};
const TABS = ["全部", "待確認", "已確認", "已完成", "已取消"] as const;

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("全部");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!user) { router.push("/login?next=/orders"); return; }
    api.myBookings().then((r) => setBookings(r.bookings)).catch(() => {}).finally(() => setLoading(false));
  }, [user, router]);

  const filtered = bookings.filter((b) => {
    if (activeTab === "全部") return true;
    return STATUS_LABEL[b.status] === activeTab;
  });

  async function handleCancel(id: string) {
    setCancelling(true);
    try {
      await api.updateBooking(id, "cancelled");
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: "cancelled" } : b));
      setSelectedBooking(null);
    } catch {
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface pb-24">
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border-subtle">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-high">
              <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
            </button>
            <p className="text-sm font-semibold text-on-surface">我的預約</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-4 pb-8 space-y-4">
        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${activeTab === tab ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"}`}>
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          [1,2,3].map((i) => (
            <div key={i} className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-4 space-y-2">
              <div className="h-4 w-3/4 bg-surface-container rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-surface-container rounded animate-pulse" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "48px" }}>event_busy</span>
            <p className="text-sm text-on-surface-variant mt-2">目前沒有預約紀錄</p>
            <Link href="/search" className="mt-3 inline-block text-xs text-primary font-semibold">探索場館</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((b) => (
              <div key={b.id} className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full shrink-0 mt-1.5 bg-primary" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-on-surface">{b.courseName || "課程"}</p>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${STATUS_COLOR[b.status]}`}>
                        {STATUS_LABEL[b.status]}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">{b.venueName}</p>
                    <p className="text-xs text-on-surface-variant">{b.createdAt.slice(0, 10)} · 預約單 {b.id}</p>
                  </div>
                  <button onClick={() => setSelectedBooking(b)}
                    className="shrink-0 px-3 py-1.5 text-xs font-semibold text-primary border border-primary/40 rounded-lg hover:bg-primary/5 transition-colors">
                    詳情
                  </button>
                </div>
                {b.status === "pending" && (
                  <div className="mt-3 pt-3 border-t border-border-subtle/50">
                    <button onClick={() => handleCancel(b.id)} disabled={cancelling}
                      className="w-full py-2 text-xs font-semibold text-status-danger border border-status-danger/30 rounded-xl hover:bg-status-danger/5 transition-colors disabled:opacity-50">
                      取消預約
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Detail sheet */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-60 flex items-end justify-center" onClick={() => setSelectedBooking(null)}>
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-t-3xl px-5 pt-4 pb-10 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 bg-border-subtle rounded-full mx-auto mb-1" />
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface">預約詳情</h3>
              <button onClick={() => setSelectedBooking(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container">
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "18px" }}>close</span>
              </button>
            </div>
            <div className="bg-surface-container rounded-2xl overflow-hidden divide-y divide-border-subtle/50">
              {[
                { icon: "storefront", label: "場館", value: selectedBooking.venueName },
                { icon: "fitness_center", label: "課程", value: selectedBooking.courseName },
                { icon: "person", label: "聯絡人", value: selectedBooking.contactName },
                { icon: "call", label: "手機", value: selectedBooking.phone },
                { icon: "calendar_month", label: "預約時間", value: selectedBooking.createdAt.slice(0, 10) },
              ].map((row) => row.value && (
                <div key={row.label} className="flex items-center gap-3 px-4 py-3">
                  <span className="material-symbols-outlined text-on-surface-variant shrink-0" style={{ fontSize: "18px" }}>{row.icon}</span>
                  <div>
                    <p className="text-xs text-on-surface-variant">{row.label}</p>
                    <p className="text-sm font-semibold text-on-surface mt-0.5">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLOR[selectedBooking.status]}`}>
              {STATUS_LABEL[selectedBooking.status]}
            </span>
            {selectedBooking.status === "pending" && (
              <button onClick={() => handleCancel(selectedBooking.id)} disabled={cancelling}
                className="w-full py-3 border border-status-danger/40 rounded-xl text-sm font-semibold text-status-danger hover:bg-status-danger/5 transition-colors disabled:opacity-50">
                {cancelling ? "取消中…" : "取消預約"}
              </button>
            )}
            <button onClick={() => setSelectedBooking(null)} className="w-full py-3 bg-surface-container rounded-xl text-sm font-semibold text-on-surface">關閉</button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
