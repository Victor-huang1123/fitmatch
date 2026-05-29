"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import type { Venue } from "../../lib/types";
import BottomNav from "../components/BottomNav";

function BookingContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const { user } = useAuth();
  const venueId = sp.get("venue") || "";
  const courseId = sp.get("course") || "";

  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    contactName: user?.name || "",
    gender: "",
    age: "",
    phone: user?.phone || "",
    note: "",
  });

  useEffect(() => {
    if (!venueId) { router.push("/search"); return; }
    api.venue(venueId).then((r) => setVenue(r.venue)).catch(() => {}).finally(() => setLoading(false));
  }, [venueId, router]);

  useEffect(() => {
    if (user) setForm((f) => ({ ...f, contactName: f.contactName || user.name, phone: f.phone || user.phone }));
  }, [user]);

  if (!user) {
    router.push(`/login?next=/booking?venue=${venueId}&course=${courseId}`);
    return null;
  }

  const selectedCourse = venue?.courses?.find((c) => c.id === courseId) ?? venue?.courses?.[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCourse || !venue) return;
    setSubmitting(true);
    setError("");
    try {
      await api.createBooking({ venueId: venue.id, courseId: selectedCourse.id, ...form, age: form.age ? Number(form.age) : undefined });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "預約失敗，請稍後再試");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-5 px-6 pb-24">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
        <span className="material-symbols-outlined text-primary" style={{ fontSize: "40px", fontVariationSettings: '"FILL" 1' }}>check_circle</span>
      </div>
      <div className="text-center">
        <h2 className="text-lg font-bold text-on-surface">預約成功！</h2>
        <p className="text-sm text-on-surface-variant mt-1">等待商家確認後即可前往上課</p>
      </div>
      <div className="flex gap-3">
        <button onClick={() => router.push("/orders")} className="px-5 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-bold">查看預約</button>
        <button onClick={() => router.push("/")} className="px-5 py-2.5 border border-border-subtle text-on-surface rounded-xl text-sm font-semibold">回首頁</button>
      </div>
      <BottomNav />
    </div>
  );

  return (
    <div className="min-h-screen bg-surface pb-24">
      <div className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border-subtle">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-3">
          <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-high">
            <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
          </button>
          <p className="text-sm font-semibold text-on-surface">填寫預約資料</p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 pt-4 pb-8 space-y-4">
        {/* Course summary */}
        {loading ? (
          <div className="h-20 bg-surface-container rounded-2xl animate-pulse" />
        ) : selectedCourse && venue && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-on-surface-variant">{venue.name}</p>
                <p className="text-sm font-bold text-on-surface mt-0.5">{selectedCourse.name}</p>
              </div>
              <span className="text-sm font-bold text-primary shrink-0">NT$ {selectedCourse.price}</span>
            </div>
            {venue.address && (
              <div className="flex items-center gap-1.5 mt-2">
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "14px" }}>location_on</span>
                <span className="text-xs text-on-surface-variant">{venue.address}</span>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border-subtle/60">
              <p className="text-sm font-bold text-on-surface">聯絡資料</p>
            </div>
            <div className="divide-y divide-border-subtle/50">
              {[
                { label: "姓名", key: "contactName", type: "text", placeholder: "請輸入姓名", required: true },
                { label: "手機", key: "phone", type: "tel", placeholder: "0912345678", required: true },
                { label: "年齡", key: "age", type: "number", placeholder: "選填", required: false },
              ].map(({ label, key, type, placeholder, required }) => (
                <div key={key} className="flex items-center gap-3 px-4 py-3">
                  <span className="text-sm text-on-surface-variant w-12 shrink-0">{label}</span>
                  <input
                    type={type} placeholder={placeholder} required={required}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="flex-1 text-sm text-on-surface bg-transparent outline-none placeholder:text-on-surface-variant/40"
                  />
                </div>
              ))}
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-sm text-on-surface-variant w-12 shrink-0">性別</span>
                <div className="flex gap-2">
                  {["男", "女", "不指定"].map((g) => (
                    <button key={g} type="button" onClick={() => setForm((f) => ({ ...f, gender: g }))}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${form.gender === g ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant"}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-4">
            <p className="text-sm font-bold text-on-surface mb-2">備注</p>
            <textarea
              rows={3} placeholder="有任何特殊需求或注意事項嗎？（選填）"
              value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              className="w-full text-sm bg-surface-container rounded-xl px-3 py-2.5 outline-none border border-border-subtle focus:border-primary transition-colors resize-none placeholder:text-on-surface-variant/40"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-status-danger/5 border border-status-danger/20 rounded-xl px-3 py-2.5">
              <span className="material-symbols-outlined text-status-danger" style={{ fontSize: "16px" }}>error</span>
              <p className="text-xs text-status-danger">{error}</p>
            </div>
          )}

          <button type="submit" disabled={submitting || loading}
            className="w-full py-3.5 bg-primary text-on-primary rounded-xl text-sm font-bold disabled:opacity-50 transition-opacity">
            {submitting ? "送出中…" : "確認預約"}
          </button>
        </form>
      </main>
      <BottomNav />
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center"><span className="text-sm text-on-surface-variant">載入中…</span></div>}>
      <BookingContent />
    </Suspense>
  );
}
