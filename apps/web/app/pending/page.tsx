"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import type { Booking } from "../../lib/types";
import BottomNav from "../components/BottomNav";

export default function PendingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { router.push("/login?next=/pending"); return; }
    if (user.role !== "merchant") { router.push("/"); return; }
    api.merchantBookings()
      .then((r) => setBookings(r.bookings.filter((b) => b.status === "pending")))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, router]);

  async function updateStatus(id: string, status: "confirmed" | "cancelled") {
    setUpdating(id);
    try {
      await api.updateBooking(id, status);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch {
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="min-h-screen bg-surface pb-24">
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border-subtle">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-2">
          <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-high">
            <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
          </button>
          <p className="text-sm font-semibold text-on-surface">待確認預約</p>
          {bookings.length > 0 && (
            <span className="text-xs font-bold text-on-primary bg-primary px-2 py-0.5 rounded-full ml-1">{bookings.length}</span>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-4 pb-8 space-y-3">
        {loading ? (
          [1,2].map((i) => (
            <div key={i} className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-4 space-y-3">
              <div className="h-4 w-1/2 bg-surface-container rounded animate-pulse" />
              <div className="h-3 w-1/3 bg-surface-container rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-9 flex-1 bg-surface-container rounded-xl animate-pulse" />
                <div className="h-9 flex-1 bg-surface-container rounded-xl animate-pulse" />
              </div>
            </div>
          ))
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "48px" }}>done_all</span>
            <p className="text-sm text-on-surface-variant mt-2">目前沒有待確認的預約</p>
          </div>
        ) : bookings.map((b) => (
          <div key={b.id} className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-tertiary/15 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-tertiary">{b.contactName.slice(0, 1)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-on-surface">{b.contactName}</p>
                <p className="text-xs text-on-surface-variant">{b.phone}</p>
              </div>
              <span className="text-[10px] font-bold text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full">待確認</span>
            </div>
            <div className="bg-surface-container rounded-xl px-3 py-2.5 space-y-1">
              <p className="text-xs text-on-surface-variant">課程：<span className="text-on-surface font-medium">{b.courseName}</span></p>
              <p className="text-xs text-on-surface-variant">預約時間：{b.createdAt.slice(0, 10)}</p>
              {b.note && <p className="text-xs text-on-surface-variant">備注：{b.note}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => updateStatus(b.id, "confirmed")} disabled={updating === b.id}
                className="flex-1 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold disabled:opacity-50 transition-opacity">
                {updating === b.id ? "處理中…" : "確認"}
              </button>
              <button onClick={() => updateStatus(b.id, "cancelled")} disabled={updating === b.id}
                className="flex-1 py-2.5 border border-status-danger/40 text-status-danger rounded-xl text-xs font-semibold disabled:opacity-50 hover:bg-status-danger/5 transition-colors">
                拒絕
              </button>
            </div>
          </div>
        ))}
      </main>
      <BottomNav />
    </div>
  );
}
