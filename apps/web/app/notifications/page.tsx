"use client";

import { useRouter } from "next/navigation";
import BottomNav from "../components/BottomNav";

export default function NotificationsPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-surface pb-24">
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border-subtle">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-2">
          <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-high">
            <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
          </button>
          <p className="text-sm font-semibold text-on-surface">通知</p>
        </div>
      </header>
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "56px" }}>notifications_off</span>
        <p className="text-base font-semibold text-on-surface mt-4">通知功能即將推出</p>
        <p className="text-sm text-on-surface-variant mt-1">目前尚無通知訊息</p>
      </div>
      <BottomNav />
    </div>
  );
}
