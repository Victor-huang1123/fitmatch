"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../lib/auth";
import { api } from "../../lib/api";
import type { Booking } from "../../lib/types";
import BottomNav from "../components/BottomNav";
import AccountSwitcher from "../components/AccountSwitcher";
import ThemeToggle from "../components/ThemeToggle";

const STATUS_LABEL: Record<string, string> = {
  pending: "待確認", confirmed: "已確認", completed: "已完成", cancelled: "已取消",
};
const STATUS_COLOR: Record<string, string> = {
  pending:   "text-tertiary bg-tertiary/10",
  confirmed: "text-primary bg-primary/10",
  completed: "text-primary bg-primary/10",
  cancelled: "text-status-danger bg-status-danger/10",
};

/* ─── 學員個人頁 ─────────────────────────────────────── */

function StudentProfile({ user, bookings, loading, onLogout }: {
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
  bookings: Booking[];
  loading: boolean;
  onLogout: () => void;
}) {
  const confirmed  = bookings.filter(b => b.status === "confirmed").length;
  const completed  = bookings.filter(b => b.status === "completed").length;
  const pending    = bookings.filter(b => b.status === "pending").length;

  return (
    <div className="min-h-screen bg-surface pb-24">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 bg-primary">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-on-primary">arrow_back</span>
            </Link>
            <AccountSwitcher />
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Link href="/notifications" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-on-primary">notifications</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-primary pb-8 flex flex-col items-center gap-3 px-4 pt-4">
        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary" style={{ fontSize: "36px", fontVariationSettings: '"FILL" 1' }}>person</span>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-on-primary">{user.name}</h2>
          <div className="flex items-center justify-center gap-2 mt-1.5">
            <span className="text-xs font-semibold text-on-primary bg-white/20 px-2.5 py-0.5 rounded-full">學員</span>
            <span className="text-xs text-on-primary/60">{user.phone}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="w-full max-w-sm grid grid-cols-3 gap-2 mt-2">
          {[
            { label: "待確認", value: pending,   color: "text-on-primary" },
            { label: "已確認", value: confirmed, color: "text-on-primary" },
            { label: "已完成", value: completed, color: "text-on-primary" },
          ].map((s) => (
            <div key={s.label} className="bg-white/15 rounded-2xl py-3 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-on-primary/70 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 pt-4 pb-8 space-y-4">

        {/* Recent bookings */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-on-surface">最近預約</h3>
            <Link href="/orders" className="text-xs font-semibold text-primary flex items-center gap-0.5">
              查看全部
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>chevron_right</span>
            </Link>
          </div>
          {loading ? (
            [1, 2].map((i) => (
              <div key={i} className="mb-2 bg-surface-container-lowest border border-border-subtle rounded-2xl p-4 space-y-2">
                <div className="h-4 w-2/3 bg-surface-container rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-surface-container rounded animate-pulse" />
              </div>
            ))
          ) : bookings.length === 0 ? (
            <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-8 flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "40px" }}>event_busy</span>
              <p className="text-sm text-on-surface-variant">還沒有預約紀錄</p>
              <Link href="/search" className="px-4 py-2 bg-primary/10 text-primary text-xs font-semibold rounded-full">探索場館</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {bookings.slice(0, 3).map((b) => (
                <div key={b.id} className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: "20px", fontVariationSettings: '"FILL" 1' }}>fitness_center</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-on-surface truncate">{b.courseName || "課程"}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{b.venueName} · {b.createdAt.slice(0, 10)}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${STATUS_COLOR[b.status]}`}>
                    {STATUS_LABEL[b.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick links */}
        <section>
          <h3 className="text-sm font-bold text-on-surface mb-3">功能選單</h3>
          <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl overflow-hidden divide-y divide-border-subtle/50">
            {[
              { href: "/orders",        icon: "event_note",   label: "我的預約",   sub: "查看所有預約紀錄" },
              { href: "/search",        icon: "search",       label: "探索場館",   sub: "搜尋並預約課程" },
              { href: "/notifications", icon: "notifications",label: "通知中心",   sub: "查看最新消息" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 px-4 py-3.5 hover:bg-surface-container-low transition-colors">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: "18px", fontVariationSettings: '"FILL" 1' }}>{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface">{item.label}</p>
                  <p className="text-xs text-on-surface-variant">{item.sub}</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "16px" }}>chevron_right</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Account info */}
        <section>
          <h3 className="text-sm font-bold text-on-surface mb-3">帳號資料</h3>
          <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl overflow-hidden divide-y divide-border-subtle/50">
            {[
              { icon: "person", label: "姓名",  value: user.name },
              { icon: "call",   label: "手機",  value: user.phone },
              { icon: "email",  label: "Email", value: user.email || "未設定" },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3 px-4 py-3.5">
                <span className="material-symbols-outlined text-on-surface-variant shrink-0" style={{ fontSize: "18px" }}>{row.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-on-surface-variant">{row.label}</p>
                  <p className="text-sm font-semibold text-on-surface mt-0.5 truncate">{row.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Logout */}
        <button onClick={onLogout} className="w-full py-3 border border-status-danger/30 rounded-xl text-sm font-semibold text-status-danger hover:bg-status-danger/5 transition-colors flex items-center justify-center gap-2">
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>logout</span>
          登出
        </button>
      </main>

      <BottomNav />
    </div>
  );
}

/* ─── 商家個人頁 ─────────────────────────────────────── */

function MerchantProfile({ user, bookings, loading, onLogout }: {
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
  bookings: Booking[];
  loading: boolean;
  onLogout: () => void;
}) {
  const pendingCount   = bookings.filter(b => b.status === "pending").length;
  const confirmedCount = bookings.filter(b => b.status === "confirmed").length;
  const completedCount = bookings.filter(b => b.status === "completed").length;

  const stats = [
    { label: "總預約",  value: bookings.length, icon: "calendar_today",   color: "bg-primary/10",    ic: "text-primary" },
    { label: "待確認",  value: pendingCount,    icon: "pending_actions",  color: "bg-tertiary/10",   ic: "text-tertiary" },
    { label: "已確認",  value: confirmedCount,  icon: "check_circle",     color: "bg-primary/10",    ic: "text-primary" },
    { label: "已完成",  value: completedCount,  icon: "task_alt",         color: "bg-secondary/10",  ic: "text-secondary" },
  ];

  const quickActions = [
    { href: "/merchant/bookings", icon: "storefront",       label: "預約管理",   sub: "查看所有訂單",      color: "bg-primary/10",  ic: "text-primary" },
    { href: "/pending",           icon: "pending_actions",  label: "待確認",     sub: `${pendingCount} 筆待處理`, color: "bg-tertiary/10", ic: "text-tertiary" },
    { href: "/notifications",     icon: "notifications",    label: "通知中心",   sub: "最新消息",          color: "bg-cta-accent/10",ic: "text-cta-accent" },
    { href: "/search",            icon: "search",           label: "場館搜尋",   sub: "瀏覽其他場館",      color: "bg-secondary/10", ic: "text-secondary" },
  ];

  return (
    <div className="min-h-screen bg-surface pb-24">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 bg-primary">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-on-primary">arrow_back</span>
            </Link>
            <AccountSwitcher />
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Link href="/notifications" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors relative">
              <span className="material-symbols-outlined text-on-primary">notifications</span>
              {pendingCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-danger rounded-full border border-primary" />
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-primary pb-8 flex flex-col items-center gap-3 px-4 pt-4">
        <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary" style={{ fontSize: "36px", fontVariationSettings: '"FILL" 1' }}>storefront</span>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-on-primary">{user.name}</h2>
          <div className="flex items-center justify-center gap-2 mt-1.5">
            <span className="text-xs font-semibold text-on-primary bg-white/20 px-2.5 py-0.5 rounded-full">商家</span>
            <span className="text-xs text-on-primary/60">{user.phone}</span>
          </div>
        </div>

        {/* Stats bar */}
        <div className="w-full max-w-sm grid grid-cols-4 gap-2 mt-2">
          {stats.map((s) => (
            <div key={s.label} className="bg-white/15 rounded-2xl py-3 text-center">
              <p className="text-2xl font-bold text-on-primary">{s.value}</p>
              <p className="text-[10px] text-on-primary/70 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 pt-4 pb-8 space-y-4">

        {/* Quick actions grid */}
        <section>
          <h3 className="text-sm font-bold text-on-surface mb-3">快速操作</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((item) => (
              <Link key={item.href} href={item.href}
                className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-4 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className={`${item.color} w-10 h-10 rounded-xl flex items-center justify-center`}>
                  <span className={`material-symbols-outlined ${item.ic}`} style={{ fontSize: "20px", fontVariationSettings: '"FILL" 1' }}>{item.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">{item.label}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{item.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent bookings */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-on-surface">最新預約</h3>
            <Link href="/merchant/bookings" className="text-xs font-semibold text-primary flex items-center gap-0.5">
              查看全部
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>chevron_right</span>
            </Link>
          </div>
          {loading ? (
            [1, 2].map((i) => (
              <div key={i} className="mb-2 bg-surface-container-lowest border border-border-subtle rounded-2xl p-4 space-y-2">
                <div className="h-4 w-2/3 bg-surface-container rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-surface-container rounded animate-pulse" />
              </div>
            ))
          ) : bookings.length === 0 ? (
            <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-8 flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "40px" }}>inbox</span>
              <p className="text-sm text-on-surface-variant">目前沒有預約</p>
            </div>
          ) : (
            <div className="space-y-2">
              {bookings.slice(0, 4).map((b) => (
                <div key={b.id} className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-primary">{b.contactName.slice(0, 1)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-on-surface">{b.contactName}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{b.courseName} · {b.createdAt.slice(0, 10)}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${STATUS_COLOR[b.status]}`}>
                    {STATUS_LABEL[b.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Account info */}
        <section>
          <h3 className="text-sm font-bold text-on-surface mb-3">商家資料</h3>
          <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl overflow-hidden divide-y divide-border-subtle/50">
            {[
              { icon: "storefront", label: "商家名稱", value: user.name },
              { icon: "call",       label: "聯絡電話", value: user.phone },
              { icon: "email",      label: "Email",    value: user.email || "未設定" },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3 px-4 py-3.5">
                <span className="material-symbols-outlined text-on-surface-variant shrink-0" style={{ fontSize: "18px" }}>{row.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-on-surface-variant">{row.label}</p>
                  <p className="text-sm font-semibold text-on-surface mt-0.5 truncate">{row.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Logout */}
        <button onClick={onLogout} className="w-full py-3 border border-status-danger/30 rounded-xl text-sm font-semibold text-status-danger hover:bg-status-danger/5 transition-colors flex items-center justify-center gap-2">
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>logout</span>
          登出
        </button>
      </main>

      <BottomNav />
    </div>
  );
}

/* ─── Root ───────────────────────────────────────────── */

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push("/login?next=/profile"); return; }
    const fetcher = user.role === "merchant" ? api.merchantBookings() : api.myBookings();
    fetcher
      .then((r) => setBookings(r.bookings))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, router]);

  if (!user) return null;

  function handleLogout() {
    logout();
    router.push("/");
  }

  if (user.role === "merchant") {
    return <MerchantProfile user={user} bookings={bookings} loading={loading} onLogout={handleLogout} />;
  }
  return <StudentProfile user={user} bookings={bookings} loading={loading} onLogout={handleLogout} />;
}
