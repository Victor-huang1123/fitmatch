"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../lib/auth";
import BottomNav from "../components/BottomNav";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!user) {
    router.push("/login?next=/profile");
    return null;
  }

  const roleLabel = user.role === "merchant" ? "商家" : "學員";

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-surface pb-24">
      {/* Header */}
      <div style={{ background: "linear-gradient(145deg,#00677d 0%,#004e5f 60%,#003040 100%)" }} className="px-4 pt-12 pb-8 flex flex-col items-center gap-3">
        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-white" style={{ fontSize: "36px", fontVariationSettings: '"FILL" 1' }}>person</span>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">{user.name}</h2>
          <p className="text-sm text-white/70 mt-0.5">{roleLabel}</p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 pt-4 pb-8 space-y-4">
        {/* Info card */}
        <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border-subtle/60">
            <p className="text-sm font-bold text-on-surface">帳號資料</p>
          </div>
          <div className="divide-y divide-border-subtle/50">
            {[
              { icon: "person", label: "姓名", value: user.name },
              { icon: "call", label: "手機", value: user.phone },
              { icon: "email", label: "Email", value: user.email || "未設定" },
              { icon: "badge", label: "身份", value: roleLabel },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3 px-4 py-3.5">
                <span className="material-symbols-outlined text-on-surface-variant shrink-0" style={{ fontSize: "18px" }}>{row.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-on-surface-variant">{row.label}</p>
                  <p className="text-sm font-semibold text-on-surface mt-0.5">{row.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl overflow-hidden divide-y divide-border-subtle/50">
          {user.role === "student" && (
            <Link href="/orders" className="flex items-center gap-3 px-4 py-3.5 hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "18px" }}>event_note</span>
              <span className="flex-1 text-sm text-on-surface">我的預約</span>
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "18px" }}>chevron_right</span>
            </Link>
          )}
          {user.role === "merchant" && (
            <>
              <Link href="/merchant/bookings" className="flex items-center gap-3 px-4 py-3.5 hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "18px" }}>storefront</span>
                <span className="flex-1 text-sm text-on-surface">預約管理</span>
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "18px" }}>chevron_right</span>
              </Link>
              <Link href="/pending" className="flex items-center gap-3 px-4 py-3.5 hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "18px" }}>pending_actions</span>
                <span className="flex-1 text-sm text-on-surface">待確認預約</span>
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "18px" }}>chevron_right</span>
              </Link>
            </>
          )}
          <Link href="/notifications" className="flex items-center gap-3 px-4 py-3.5 hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "18px" }}>notifications</span>
            <span className="flex-1 text-sm text-on-surface">通知</span>
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "18px" }}>chevron_right</span>
          </Link>
        </div>

        {/* Logout */}
        <button onClick={handleLogout}
          className="w-full py-3 border border-status-danger/30 rounded-xl text-sm font-semibold text-status-danger hover:bg-status-danger/5 transition-colors flex items-center justify-center gap-2">
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>logout</span>
          登出
        </button>
      </main>

      <BottomNav />
    </div>
  );
}
