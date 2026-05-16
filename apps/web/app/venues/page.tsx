"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "../../lib/api";
import type { Venue } from "../../lib/types";
import { VenueRow, VenueRowSkeleton } from "../../components/venue/VenueCard";

const CATEGORIES = ["體能訓練", "身心控制", "技巧", "競技對抗", "戶外運動", "其他"];
const CITIES = ["台北市", "新北市", "桃園市", "台中市", "高雄市"];

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="chip chip-active">
      {label}
      <button
        className="chip-remove"
        type="button"
        onClick={onRemove}
        aria-label={`移除篩選：${label}`}
      >
        ×
      </button>
    </span>
  );
}

function RegionPanel({ venues }: { venues: Venue[] }) {
  const cityMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const v of venues) map[v.city] = (map[v.city] ?? 0) + 1;
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [venues]);

  const categoryMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const v of venues) for (const c of v.category) map[c] = (map[c] ?? 0) + 1;
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [venues]);

  const max = cityMap[0]?.[1] ?? 1;

  return (
    <div className="explore-panel">
      <p className="eyebrow" style={{ marginBottom: 14 }}>區域分布</p>
      {cityMap.length === 0 ? (
        <p className="muted" style={{ fontSize: 14 }}>無結果</p>
      ) : (
        <div className="region-bar">
          {cityMap.map(([city, count]) => (
            <div key={city} className="region-item">
              <span style={{ fontSize: 13, fontWeight: 700 }}>{city}</span>
              <div className="region-track">
                <div className="region-fill" style={{ width: `${(count / max) * 100}%` }} />
              </div>
              <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 700, textAlign: "right" }}>{count}</span>
            </div>
          ))}
        </div>
      )}

      {categoryMap.length > 0 && (
        <>
          <p className="eyebrow" style={{ margin: "20px 0 12px" }}>熱門分類</p>
          <div className="chip-row">
            {categoryMap.map(([cat, count]) => (
              <span key={cat} className="chip" style={{ fontSize: 12, gap: 6 }}>
                {cat}
                <span style={{ color: "var(--brand-dark)", fontWeight: 800 }}>{count}</span>
              </span>
            ))}
          </div>
        </>
      )}

      <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
        <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>
          共找到 <strong style={{ color: "var(--text)" }}>{venues.length}</strong> 間場館
        </p>
      </div>
    </div>
  );
}

export default function VenuesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.venues(searchParams.toString())
      .then((res) => setVenues(res.venues))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const keyword = searchParams.get("keyword") ?? "";
  const category = searchParams.get("category") ?? "";
  const city = searchParams.get("city") ?? "";
  const rating = searchParams.get("rating") ?? "";
  const sort = searchParams.get("sort") ?? "rating";

  const activeFilters: { label: string; key: string }[] = [
    ...(keyword ? [{ label: `"${keyword}"`, key: "keyword" }] : []),
    ...(category && category !== "全部" ? [{ label: category, key: "category" }] : []),
    ...(city && city !== "全部" ? [{ label: city, key: "city" }] : []),
    ...(rating ? [{ label: `${rating} 分以上`, key: "rating" }] : []),
    ...(sort === "price" ? [{ label: "價格排序", key: "sort" }] : []),
  ];

  function removeFilter(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push(`/venues?${params.toString()}`);
  }

  function applyFilter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new URLSearchParams(new FormData(event.currentTarget) as any);
    if (data.get("category") === "全部") data.delete("category");
    if (data.get("city") === "全部") data.delete("city");
    if (!data.get("keyword")) data.delete("keyword");
    if (!data.get("rating") || data.get("rating") === "0") data.delete("rating");
    router.push(`/venues?${data.toString()}`);
    setFilterOpen(false);
  }

  return (
    <main className="page">
      {/* Header + filter bar */}
      <div className="explore-header">
        <div className="explore-title-row">
          <div>
            <p className="eyebrow">探索場館</p>
            <h1>搜尋結果</h1>
          </div>
          <button
            className="btn secondary"
            type="button"
            onClick={() => setFilterOpen((v) => !v)}
          >
            篩選
            {activeFilters.length > 0 && (
              <span className="filter-badge">{activeFilters.length}</span>
            )}
          </button>
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="chip-row" style={{ marginTop: 12 }}>
            {activeFilters.map((f) => (
              <FilterChip key={f.key} label={f.label} onRemove={() => removeFilter(f.key)} />
            ))}
            <button
              className="chip"
              type="button"
              onClick={() => router.push("/venues")}
              style={{ color: "var(--danger)", borderColor: "transparent" }}
            >
              清除全部
            </button>
          </div>
        )}

        {/* Filter panel */}
        {filterOpen && (
          <form
            className="filter-panel"
            key={searchParams.toString()}
            onSubmit={applyFilter}
          >
            <div className="filter-row">
              <label>
                <span>關鍵字</span>
                <input name="keyword" defaultValue={keyword} placeholder="搜尋場館名稱" />
              </label>
              <label>
                <span>分類</span>
                <select name="category" defaultValue={category || "全部"}>
                  {["全部", ...CATEGORIES].map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
              <label>
                <span>縣市</span>
                <select name="city" defaultValue={city || "全部"}>
                  {["全部", ...CITIES].map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
              <label>
                <span>最低評分</span>
                <select name="rating" defaultValue={rating || "0"}>
                  <option value="0">不限</option>
                  <option value="4.5">4.5 分以上</option>
                  <option value="4.7">4.7 分以上</option>
                </select>
              </label>
              <label>
                <span>排序</span>
                <select name="sort" defaultValue={sort}>
                  <option value="rating">評分優先</option>
                  <option value="price">價格低到高</option>
                </select>
              </label>
            </div>
            <div className="tabs">
              <button className="btn" type="submit">套用篩選</button>
              <button
                className="btn secondary"
                type="button"
                onClick={() => { router.push("/venues"); setFilterOpen(false); }}
              >
                清除篩選
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Dual-column explore layout */}
      <div className="explore-layout">
        <div className="explore-list">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <VenueRowSkeleton key={i} />)
            : venues.length === 0
              ? <div className="empty">找不到符合條件的場館，請調整篩選條件。</div>
              : venues.map((venue) => <VenueRow key={venue.id} venue={venue} />)
          }
        </div>
        <div className="explore-side">
          <RegionPanel venues={venues} />
        </div>
      </div>
    </main>
  );
}
