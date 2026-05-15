"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "../../lib/api";
import type { Venue } from "../../lib/types";
import { VenueGrid } from "../../components/venue/VenueGrid";

export default function VenuesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.venues(searchParams.toString()).then((res) => setVenues(res.venues)).finally(() => setLoading(false));
  }, [searchParams]);

  return (
    <main className="page">
      <div className="section-head">
        <div><p className="eyebrow">場館列表</p><h1>搜尋結果</h1></div>
        <span className="badge">共 {venues.length} 間</span>
      </div>
      <details className="disclosure quiet-section" open={searchParams.size > 0}>
        <summary>進階篩選與排序</summary>
        <div className="disclosure-body">
          <form onSubmit={(event) => {
            event.preventDefault();
            router.push(`/venues?${new URLSearchParams(new FormData(event.currentTarget) as any).toString()}`);
          }}>
            <div className="filter-row">
              <label><span>關鍵字</span><input name="keyword" defaultValue={searchParams.get("keyword") || ""} /></label>
              <label><span>分類</span><select name="category" defaultValue={searchParams.get("category") || "全部"}>{["全部", "體能訓練", "身心控制", "技巧", "競技對抗", "戶外運動", "其他"].map((item) => <option key={item}>{item}</option>)}</select></label>
              <label><span>縣市</span><select name="city" defaultValue={searchParams.get("city") || "全部"}>{["全部", "台北市", "新北市", "桃園市", "台中市", "高雄市"].map((item) => <option key={item}>{item}</option>)}</select></label>
              <label><span>評分</span><select name="rating" defaultValue={searchParams.get("rating") || "0"}><option value="0">不限評分</option><option value="4.5">4.5 分以上</option><option value="4.7">4.7 分以上</option></select></label>
              <label><span>排序</span><select name="sort" defaultValue={searchParams.get("sort") || "rating"}><option value="rating">評分優先</option><option value="price">價格低到高</option></select></label>
            </div>
            <div className="tabs"><button className="btn" type="submit">套用篩選</button><button className="btn secondary" type="button" onClick={() => router.push("/venues")}>清除</button></div>
          </form>
        </div>
      </details>
      <VenueGrid venues={venues} loading={loading} skeletonCount={6} />
    </main>
  );
}
