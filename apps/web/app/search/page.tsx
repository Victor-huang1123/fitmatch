"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "../../lib/api";
import type { Venue } from "../../lib/types";
import BottomNav from "../components/BottomNav";

const CATEGORIES = ["全部", "體能訓練", "身心控制", "技巧", "競技對抗", "戶外運動", "其他"];
const CITIES = ["全部", "台北市", "新北市", "桃園市", "台中市", "高雄市"];
const GRAD = ["from-primary to-[#004e5f]", "from-tertiary to-[#6e3900]", "from-secondary to-[#3c475d]", "from-[#127c69] to-[#0d5e50]", "from-[#7c4d12] to-[#5d2f00]"];

function SearchContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const [keyword, setKeyword] = useState(sp.get("q") || "");
  const [category, setCategory] = useState(sp.get("category") || "全部");
  const [city, setCity] = useState("全部");
  const [sort, setSort] = useState("rating");
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams();
    if (keyword.trim()) p.set("keyword", keyword.trim());
    if (category !== "全部") p.set("category", category);
    if (city !== "全部") p.set("city", city);
    p.set("sort", sort);
    api.venues(p.toString()).then((r) => setVenues(r.venues)).catch(() => setVenues([])).finally(() => setLoading(false));
  }, [keyword, category, city, sort]);

  // sync from URL params on mount
  useEffect(() => {
    const cat = sp.get("category");
    if (cat) setCategory(cat);
  }, [sp]);

  return (
    <div className="min-h-screen bg-surface pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border-subtle">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-3">
          <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-high shrink-0">
            <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
          </button>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant" style={{ fontSize: "18px" }}>search</span>
            <input
              value={keyword} onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜尋場館、課程類型…"
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none border border-transparent focus:border-primary"
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-4 pb-4 space-y-4">
        {/* Filters */}
        <div className="space-y-2">
          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCategory(c)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  category === c ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                }`}>
                {c}
              </button>
            ))}
          </div>
          {/* City + Sort row */}
          <div className="flex gap-2">
            <select value={city} onChange={(e) => setCity(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-surface-container text-xs font-semibold text-on-surface border-none outline-none">
              {CITIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-surface-container text-xs font-semibold text-on-surface border-none outline-none">
              <option value="rating">評分最高</option>
              <option value="price">價格最低</option>
            </select>
          </div>
        </div>

        {/* Result count */}
        <p className="text-xs text-on-surface-variant">
          {loading ? "搜尋中…" : `找到 ${venues.length} 間場館`}
        </p>

        {/* Results */}
        {loading
          ? [1,2,3].map((i) => (
              <div key={i} className="bg-surface-container-lowest border border-border-subtle rounded-2xl overflow-hidden flex">
                <div className="w-28 h-24 bg-surface-container animate-pulse shrink-0" />
                <div className="flex-1 p-3 space-y-2">
                  <div className="h-4 w-3/4 bg-surface-container rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-surface-container rounded animate-pulse" />
                  <div className="h-3 w-1/3 bg-surface-container rounded animate-pulse" />
                </div>
              </div>
            ))
          : venues.length === 0
          ? (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "48px" }}>search_off</span>
                <p className="text-sm text-on-surface-variant mt-2">找不到符合條件的場館</p>
                <button onClick={() => { setKeyword(""); setCategory("全部"); setCity("全部"); }}
                  className="mt-3 text-xs text-primary font-semibold">清除篩選</button>
              </div>
            )
          : venues.map((v, i) => (
              <Link key={v.id} href={`/venue/${v.id}`}
                className="bg-surface-container-lowest border border-border-subtle rounded-2xl overflow-hidden flex hover:shadow-md transition-shadow">
                <div className={`w-28 shrink-0 bg-gradient-to-br ${GRAD[i % GRAD.length]} flex flex-col justify-end p-2`}>
                  <p className="text-xs font-bold text-white leading-tight">{v.name.slice(0, 6)}</p>
                </div>
                <div className="flex-1 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-on-surface truncate">{v.name}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{v.city} {v.district}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {v.category.map((c) => (
                          <span key={c} className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">{c}</span>
                        ))}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="flex items-center gap-0.5 justify-end">
                        <span className="material-symbols-outlined text-rating-star" style={{ fontSize: "12px", fontVariationSettings: '"FILL" 1' }}>star</span>
                        <span className="text-xs font-bold text-on-surface">{v.rating.toFixed(1)}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5">{v.reviewCount} 則</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-primary">NT$ {v.startingPrice} 起</span>
                    <span className="text-[10px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">立即預約</span>
                  </div>
                </div>
              </Link>
            ))
        }
      </main>
      <BottomNav />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center"><span className="text-sm text-on-surface-variant">載入中…</span></div>}>
      <SearchContent />
    </Suspense>
  );
}
