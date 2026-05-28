"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import type { Venue } from "../lib/types";
import BottomNav from "./components/BottomNav";
import AccountSwitcher from "./components/AccountSwitcher";

const CATEGORIES = [
  { label: "體能訓練", icon: "fitness_center", bg: "bg-primary/10", iconColor: "text-primary" },
  { label: "身心控制", icon: "self_improvement", bg: "bg-tertiary/10", iconColor: "text-tertiary" },
  { label: "技巧", icon: "sports_martial_arts", bg: "bg-secondary/10", iconColor: "text-secondary" },
  { label: "競技對抗", icon: "sports_kabaddi", bg: "bg-tertiary/10", iconColor: "text-tertiary" },
  { label: "戶外運動", icon: "hiking", bg: "bg-primary/10", iconColor: "text-primary" },
  { label: "其他", icon: "more_horiz", bg: "bg-surface-container", iconColor: "text-on-surface-variant" },
];

const GRAD = ["from-primary to-[#004e5f]", "from-tertiary to-[#6e3900]", "from-secondary to-[#3c475d]", "from-[#127c69] to-[#0d5e50]", "from-[#7c4d12] to-[#5d2f00]"];

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    api.venues("sort=rating").then((r) => setVenues(r.venues)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const doSearch = () => router.push(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search");

  return (
    <div className="min-h-screen bg-surface pb-24">
      {/* Hero */}
      <div style={{ background: "linear-gradient(145deg,#00677d 0%,#004e5f 60%,#003040 100%)" }} className="px-4 pt-12 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-white" style={{ fontSize: "20px", fontVariationSettings: '"FILL" 1' }}>person</span>
            </div>
            <div>
              <AccountSwitcher />
              <p className="text-[11px] text-white/60 mt-0.5">{user ? `早安，${user.name} 👋` : "探索你的運動世界 💪"}</p>
            </div>
          </div>
          <Link href="/notifications" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10">
            <span className="material-symbols-outlined text-white/80">notifications</span>
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">FitMatch 健身媒合</h1>
        <p className="text-sm text-white/70 mb-5">搜尋場館 · 預約課程 · 輕鬆上課</p>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant" style={{ fontSize: "20px" }}>search</span>
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && doSearch()}
            placeholder="搜尋健身房、瑜伽、拳擊…"
            className="w-full pl-10 pr-20 py-3 rounded-2xl bg-white text-on-surface placeholder:text-on-surface-variant/50 text-sm outline-none"
          />
          <button onClick={doSearch} className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-on-primary px-3 py-1.5 rounded-xl text-xs font-bold">搜尋</button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 pt-5 space-y-6">
        {user?.role === "merchant" && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: "20px", fontVariationSettings: '"FILL" 1' }}>storefront</span>
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">商家管理中心</p>
                <p className="text-xs text-on-surface-variant">查看與管理預約</p>
              </div>
            </div>
            <Link href="/merchant/bookings" className="px-3 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold">前往管理</Link>
          </div>
        )}

        <section>
          <h2 className="text-base font-bold text-on-surface mb-3">探索分類</h2>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((c) => (
              <Link key={c.label} href={`/search?category=${encodeURIComponent(c.label)}`}
                className={`${c.bg} rounded-2xl p-3 flex flex-col items-center gap-1.5 active:scale-95 transition-transform`}>
                <span className={`material-symbols-outlined ${c.iconColor}`} style={{ fontSize: "24px", fontVariationSettings: '"FILL" 1' }}>{c.icon}</span>
                <span className="text-xs font-semibold text-on-surface">{c.label}</span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-on-surface">熱門場館</h2>
            <Link href="/search" className="text-xs font-semibold text-primary">查看全部</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {loading
              ? [1,2,3,4].map((i) => (
                  <div key={i} className="bg-surface-container-lowest border border-border-subtle rounded-2xl overflow-hidden">
                    <div className="h-32 bg-surface-container animate-pulse" />
                    <div className="p-3 flex justify-between">
                      <div className="h-3 w-10 bg-surface-container rounded animate-pulse" />
                      <div className="h-3 w-16 bg-surface-container rounded animate-pulse" />
                    </div>
                  </div>
                ))
              : venues.slice(0, 4).map((v, i) => (
                  <Link key={v.id} href={`/venue/${v.id}`}
                    className="bg-surface-container-lowest border border-border-subtle rounded-2xl overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all">
                    <div className={`h-32 bg-gradient-to-br ${GRAD[i % GRAD.length]} flex flex-col justify-end p-3 relative`}>
                      <span className="absolute top-2 left-2 text-[10px] font-bold text-white bg-white/20 px-2 py-0.5 rounded-full">{v.category[0]}</span>
                      <p className="text-sm font-bold text-white leading-tight">{v.name}</p>
                      <p className="text-xs text-white/70">{v.city} {v.district}</p>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-rating-star" style={{ fontSize: "13px", fontVariationSettings: '"FILL" 1' }}>star</span>
                        <span className="text-xs font-bold text-on-surface">{v.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-xs font-semibold text-primary">NT$ {v.startingPrice} 起</span>
                    </div>
                  </Link>
                ))
            }
          </div>
        </section>

        {!loading && venues.length > 4 && (
          <section>
            <h2 className="text-base font-bold text-on-surface mb-3">更多場館</h2>
            <div className="space-y-2">
              {venues.slice(4).map((v) => (
                <Link key={v.id} href={`/venue/${v.id}`}
                  className="flex items-center gap-3 bg-surface-container-lowest border border-border-subtle rounded-2xl p-3 hover:bg-surface-container-low transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: "20px", fontVariationSettings: '"FILL" 1' }}>fitness_center</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-on-surface truncate">{v.name}</p>
                    <p className="text-xs text-on-surface-variant">{v.city} {v.district} · {v.category.join(" / ")}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="flex items-center gap-0.5 justify-end">
                      <span className="material-symbols-outlined text-rating-star" style={{ fontSize: "12px", fontVariationSettings: '"FILL" 1' }}>star</span>
                      <span className="text-xs font-bold text-on-surface">{v.rating.toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">NT$ {v.startingPrice}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
