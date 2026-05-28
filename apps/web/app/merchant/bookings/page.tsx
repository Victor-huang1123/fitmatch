"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../lib/api";
import { useAuth } from "../../../lib/auth";
import type { Booking } from "../../../lib/types";
import BottomNav from "../../components/BottomNav";

const STATUS_LABEL: Record<string, string> = { pending: "待確認", confirmed: "已確認", completed: "已完成", cancelled: "已取消" };
const STATUS_COLOR: Record<string, string> = {
  pending: "text-tertiary bg-tertiary/10 border-tertiary/20",
  confirmed: "text-primary bg-primary/10 border-primary/20",
  completed: "text-primary bg-primary/10 border-primary/20",
  cancelled: "text-status-danger bg-status-danger/10 border-status-danger/20",
};
const TABS = ["全部", "待確認", "已確認", "已完成", "已取消"] as const;

export default function MerchantBookingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("全部");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!user) { router.push("/login?next=/merchant/bookings"); return; }
    if (user.role !== "merchant") { router.push("/"); return; }
    api.merchantBookings().then((r) => setBookings(r.bookings)).catch(() => {}).finally(() => setLoading(false));
  }, [user, router]);

  const filtered = bookings.filter((b) => activeTab === "全部" || STATUS_LABEL[b.status] === activeTab);
  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  async function updateStatus(id: string, status: "confirmed" | "completed" | "cancelled") {
    setUpdating(true);
    try {
      await api.updateBooking(id, status);
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
      setSelected(null);
    } catch {
    } finally {
      setUpdating(false);
    }
  }

  const stats = [
    { label: "總預約", value: bookings.length, color: "text-on-surface" },
    { label: "待確認", value: pendingCount, color: "text-tertiary" },
    { label: "已確認", value: bookings.filter((b) => b.status === "confirmed").length, color: "text-primary" },
    { label: "已完成", value: bookings.filter((b) => b.status === "completed").length, color: "text-primary" },
  ];

  return (
    <div className="min-h-screen bg-surface pb-24">
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border-subtle">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-high">
              <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
            </button>
            <p className="text-sm font-semibold text-on-surface">預約管理</p>
          </div>
          {pendingCount > 0 && (
            <span className="text-xs font-bold text-on-primary bg-primary px-2 py-0.5 rounded-full">{pendingCount} 待確認</span>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-4 pb-8 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-3 text-center">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-on-surface-variant mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${activeTab === tab ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"}`}>
              {tab}{tab === "待確認" && pendingCount > 0 ? ` (${pendingCount})` : ""}
            </button>
          ))}
        </div>

        {/* Bookings list */}
        {loading ? (
          [1,2,3].map((i) => (
            <div key={i} className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-4 space-y-2">
              <div className="h-4 w-2/3 bg-surface-container rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-surface-container rounded animate-pulse" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "48px" }}>inbox</span>
            <p className="text-sm text-on-surface-variant mt-2">目前沒有預約</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((b) => (
              <div key={b.id} className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">{b.contactName.slice(0, 1)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">{b.contactName}</p>
                        <p className="text-xs text-on-surface-variant">{b.phone}</p>
                      </div>
                    </div>
                    <div className="mt-2 space-y-0.5">
                      <p className="text-xs text-on-surface-variant">課程：<span className="text-on-surface font-medium">{b.courseName}</span></p>
                      <p className="text-xs text-on-surface-variant">預約日期：{b.createdAt.slice(0, 10)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLOR[b.status]}`}>
                      {STATUS_LABEL[b.status]}
                    </span>
                    <button onClick={() => setSelected(b)}
                      className="text-xs font-semibold text-primary border border-primary/40 px-2.5 py-1 rounded-lg hover:bg-primary/5 transition-colors">
                      管理
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Management sheet */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-60 flex items-end justify-center" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-t-3xl px-5 pt-4 pb-10 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 bg-border-subtle rounded-full mx-auto mb-1" />
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface">管理預約</h3>
              <button onClick={() => setSelected(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container">
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "18px" }}>close</span>
              </button>
            </div>

            <div className="bg-surface-container rounded-2xl overflow-hidden divide-y divide-border-subtle/50">
              {[
                { icon: "person", label: "學員", value: selected.contactName },
                { icon: "call", label: "手機", value: selected.phone },
                { icon: "fitness_center", label: "課程", value: selected.courseName },
                { icon: "calendar_month", label: "預約時間", value: selected.createdAt.slice(0, 10) },
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

            <div className="space-y-2">
              {selected.status === "pending" && (
                <>
                  <button onClick={() => updateStatus(selected.id, "confirmed")} disabled={updating}
                    className="w-full py-3 bg-primary text-on-primary rounded-xl text-sm font-bold disabled:opacity-50">
                    {updating ? "處理中…" : "確認預約"}
                  </button>
                  <button onClick={() => updateStatus(selected.id, "cancelled")} disabled={updating}
                    className="w-full py-3 border border-status-danger/40 text-status-danger rounded-xl text-sm font-semibold disabled:opacity-50 hover:bg-status-danger/5">
                    拒絕預約
                  </button>
                </>
              )}
              {selected.status === "confirmed" && (
                <button onClick={() => updateStatus(selected.id, "completed")} disabled={updating}
                  className="w-full py-3 bg-primary text-on-primary rounded-xl text-sm font-bold disabled:opacity-50">
                  {updating ? "處理中…" : "標記為已完成"}
                </button>
              )}
              <button onClick={() => setSelected(null)} className="w-full py-3 bg-surface-container rounded-xl text-sm font-semibold text-on-surface">關閉</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
