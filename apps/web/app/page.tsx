"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../lib/api";
import type { Venue } from "../lib/types";
import { CategoryGrid } from "../components/venue/CategoryGrid";
import { VenueGrid } from "../components/venue/VenueGrid";

export default function HomePage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("全部");

  useEffect(() => {
    api.venues("sort=rating")
      .then((res) => setVenues(res.venues))
      .catch(() => setVenues([]))
      .finally(() => setLoading(false));
  }, []);

  const params = new URLSearchParams();
  if (keyword.trim()) params.set("keyword", keyword.trim());
  if (category !== "全部") params.set("category", category);

  return (
    <main id="main" className="page">
      <section className="hero-compact">
        <div>
          <p className="eyebrow">健身 / 教練 / 場館媒合</p>
          <h1>快速找到適合你的運動課</h1>
          <p className="lead">搜尋場館、比較課程、送出預約，商家確認後即可前往上課。</p>
          <form className="search-panel" action={`/venues?${params.toString()}`}>
            <div className="search-row">
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="搜尋健身房、瑜伽、拳擊"
              />
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                {["全部", "體能訓練", "身心控制", "技巧", "競技對抗", "戶外運動", "其他"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <button className="btn" type="submit">搜尋</button>
            </div>
          </form>
        </div>
        <div className="hero-visual" aria-hidden="true">
          {loading
            ? [1, 2, 3, 4].map((i) => <div key={i} className="visual-tile skeleton" style={{ minHeight: 116 }} />)
            : venues.slice(0, 4).map((venue) => (
                <div key={venue.id} className={`visual-tile tone-${venue.id}`}>
                  <span className="tile-title">{venue.name}</span>
                  <span className="tile-meta">{venue.city} {venue.district}</span>
                </div>
              ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>探索分類</h2>
          <span className="muted">從熟悉的運動類型開始</span>
        </div>
        <CategoryGrid venues={venues} />
      </section>

      <section>
        <div className="section-head">
          <h2>熱門場館</h2>
          <Link className="btn secondary" href="/venues">查看更多場館 →</Link>
        </div>
        <VenueGrid venues={venues.slice(0, 6)} loading={loading} skeletonCount={6} />
      </section>
    </main>
  );
}
