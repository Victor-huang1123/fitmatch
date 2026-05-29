"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../lib/auth";
import { useTheme } from "../../lib/theme";

export default function AccountSwitcher() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const isDark = theme === "dark";

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  function handleLogout() {
    logout();
    router.push("/");
    setOpen(false);
  }

  return (
    <div className="relative">
      {/* Trigger */}
      <button onClick={() => setOpen(true)} className="flex items-center gap-1 cursor-pointer">
        <span className="text-sm font-bold text-white">
          {user ? user.name : "訪客"}
        </span>
        <svg className="h-4 w-4 text-white/70 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      </button>

      {/* Bottom sheet */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex flex-col justify-end animate-fade-in-overlay"
          aria-modal="true"
          role="dialog"
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />

          <div
            className="relative z-10 w-full max-w-lg mx-auto bg-surface-container-lowest rounded-t-3xl shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-on-surface/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-3 pb-4">
              <span className="text-base font-bold text-on-surface">帳號</span>
              <div className="flex items-center gap-2">
                {/* Theme toggle */}
                <button
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors"
                  aria-label={isDark ? "切換淺色模式" : "切換深色模式"}
                >
                  <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "16px", fontVariationSettings: '"FILL" 1' }}>
                    {isDark ? "light_mode" : "dark_mode"}
                  </span>
                  <span className="text-xs font-semibold text-on-surface-variant">
                    {isDark ? "淺色" : "深色"}
                  </span>
                </button>
                {/* Close */}
                <button
                  onClick={() => setOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-colors"
                  aria-label="關閉"
                >
                  <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "20px" }}>close</span>
                </button>
              </div>
            </div>

            {user ? (
              /* ── Logged-in state ── */
              <div className="pb-5">
                {/* User info */}
                <div className="mx-4 mb-3 px-4 py-4 bg-surface-container rounded-2xl flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: "22px", fontVariationSettings: '"FILL" 1' }}>person</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-on-surface">{user.name}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {user.role === "merchant" ? "商家" : "學員"} · {user.phone}
                    </p>
                  </div>
                </div>

                {/* Navigation options */}
                <div className="px-4 space-y-1">
                  <button
                    onClick={() => { router.push("/profile"); setOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-surface-container-low transition-colors text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "18px" }}>person</span>
                    </div>
                    <span className="text-sm font-semibold text-on-surface">個人資料</span>
                    <span className="material-symbols-outlined text-on-surface-variant ml-auto" style={{ fontSize: "16px" }}>chevron_right</span>
                  </button>

                  {user.role === "merchant" && (
                    <button
                      onClick={() => { router.push("/merchant/bookings"); setOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-surface-container-low transition-colors text-left"
                    >
                      <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "18px" }}>storefront</span>
                      </div>
                      <span className="text-sm font-semibold text-on-surface">商家管理</span>
                      <span className="material-symbols-outlined text-on-surface-variant ml-auto" style={{ fontSize: "16px" }}>chevron_right</span>
                    </button>
                  )}

                  {user.role === "student" && (
                    <button
                      onClick={() => { router.push("/orders"); setOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-surface-container-low transition-colors text-left"
                    >
                      <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "18px" }}>event_note</span>
                      </div>
                      <span className="text-sm font-semibold text-on-surface">我的預約</span>
                      <span className="material-symbols-outlined text-on-surface-variant ml-auto" style={{ fontSize: "16px" }}>chevron_right</span>
                    </button>
                  )}
                </div>

                {/* Logout */}
                <div className="mx-4 mt-3 border-t border-border-subtle pt-3">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-status-danger/5 transition-colors text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-status-danger/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-status-danger" style={{ fontSize: "18px" }}>logout</span>
                    </div>
                    <span className="text-sm font-semibold text-status-danger">登出</span>
                  </button>
                </div>
              </div>
            ) : (
              /* ── Visitor state ── */
              <div className="px-5 pb-6 space-y-4">
                <div className="flex flex-col items-center py-4 gap-2">
                  <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "32px", fontVariationSettings: '"FILL" 1' }}>person</span>
                  </div>
                  <p className="text-sm font-bold text-on-surface">歡迎使用 FitMatch</p>
                  <p className="text-xs text-on-surface-variant">登入後享有預約、收藏等完整功能</p>
                </div>
                <div className="flex gap-3">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex-1 py-3 rounded-2xl text-sm font-bold text-on-primary text-center transition-colors"
                    style={{ background: "var(--color-primary)" }}
                  >
                    登入
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="flex-1 py-3 rounded-2xl text-sm font-semibold text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors text-center"
                  >
                    立即註冊
                  </Link>
                </div>
              </div>
            )}

            <div style={{ paddingBottom: "env(safe-area-inset-bottom, 16px)" }} />
          </div>
        </div>
      )}
    </div>
  );
}
