"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth";

export default function AccountSwitcher() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  if (!user) {
    return (
      <button
        onClick={() => router.push("/login")}
        className="text-sm font-bold text-on-primary"
      >
        登入
      </button>
    );
  }

  const roleLabel = user.role === "merchant" ? "商家" : "學員";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 cursor-pointer"
      >
        <span className="text-sm font-bold text-white">{user.name}</span>
        <svg
          className={`h-4 w-4 text-white/70 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-border-subtle rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="px-4 pt-3 pb-2 border-b border-border-subtle">
            <p className="text-sm font-bold text-on-surface">{user.name}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">{roleLabel} · {user.phone}</p>
          </div>
          <div className="py-1">
            <button
              onClick={() => { router.push("/profile"); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors text-left"
            >
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "18px" }}>person</span>
              <span className="text-sm text-on-surface">個人資料</span>
            </button>
            {user.role === "merchant" && (
              <button
                onClick={() => { router.push("/merchant/bookings"); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors text-left"
              >
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "18px" }}>storefront</span>
                <span className="text-sm text-on-surface">商家管理</span>
              </button>
            )}
            {user.role === "student" && (
              <button
                onClick={() => { router.push("/orders"); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors text-left"
              >
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "18px" }}>event_note</span>
                <span className="text-sm text-on-surface">我的預約</span>
              </button>
            )}
          </div>
          <div className="border-t border-border-subtle">
            <button
              onClick={() => { logout(); router.push("/"); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors text-left"
            >
              <span className="material-symbols-outlined text-status-danger" style={{ fontSize: "18px" }}>logout</span>
              <span className="text-sm text-status-danger">登出</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
