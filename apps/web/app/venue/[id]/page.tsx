"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import { useToast } from "../../../lib/toast";
import type { Venue } from "../../../lib/types";

export default function VenueDetailPage({ params }: { params: { id: string } }) {
  const toast = useToast();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.venue(params.id)
      .then((res) => setVenue(res.venue))
      .catch(() => toast("載入場館資料失敗，請稍後再試。"))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <main className="page">
        <div className="skeleton skeleton-line" style={{ width: 80, marginBottom: 16 }} />
        <div className="skeleton skeleton-title" style={{ width: "60%", marginBottom: 12 }} />
        <div className="skeleton skeleton-line" style={{ marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 280, marginBottom: 24 }} />
      </main>
    );
  }
  if (!venue) return <main className="page"><div className="empty">找不到這間場館。</div></main>;
  const firstCourse = venue.courses?.[0];
  return (
    <main className="page">
      <Link className="nav-link" href="/venues">返回列表</Link>
      <section>
        <p className="eyebrow">{venue.category.join(" / ")}</p>
        <h1>{venue.name}</h1>
        <div className="meta-row"><span>{venue.rating.toFixed(1)} 分，{venue.reviewCount} 則評價</span><span>{venue.city} {venue.district}</span><span>NT$ {venue.startingPrice} 起</span></div>
        <div className="photo-grid">{[0, 1, 2, 3, 4].map((index) => <div key={index} className={`photo-tile tone-${venue.id} photo-tone-${index}`}><span className="tile-title">{index === 0 ? venue.name : `空間照片 ${index + 1}`}</span><span className="tile-meta">Mock placeholder</span></div>)}</div>
      </section>
      <div className="detail-layout">
        <div className="list">
          <section className="panel list"><h2>課程 / 方案</h2>{venue.courses?.map((course) => <article key={course.id} className="list-item course-row"><div><h3>{course.name}</h3><p className="muted">{course.description}</p><strong>NT$ {course.price}</strong></div><Link className="btn" href={`/booking?venue=${venue.id}&course=${course.id}`}>預約</Link></article>)}</section>
          <details className="disclosure quiet-section"><summary>教練列表</summary><div className="disclosure-body avatar-list">{venue.coaches?.map((coach) => <div key={coach.id} className="avatar"><span className="avatar-mark">{coach.name.slice(0, 1)}</span><div><strong>{coach.name}</strong><p className="muted">{coach.yearsOfExperience} 年經驗，{coach.bio}</p></div></div>)}</div></details>
          <details className="disclosure quiet-section"><summary>店家介紹</summary><div className="disclosure-body"><p>{venue.description}</p><p className="muted">地址：{venue.address}</p><p className="muted">電話：{venue.phone}</p><p className="muted">營業時間：{venue.businessHours}</p></div></details>
          <details className="disclosure quiet-section"><summary>評價</summary><div className="disclosure-body">{venue.reviews?.map((review) => <article key={review.id} className="list-item"><div className="meta-row"><strong>{review.userName}</strong><span>{review.rating.toFixed(1)} 分</span><span>{review.createdAt}</span></div><p>{review.comment}</p></article>)}</div></details>
        </div>
        <aside className="panel sticky-panel"><h2>預約這間場館</h2><p className="muted">{firstCourse ? `${firstCourse.name}，NT$ ${firstCourse.price}` : "目前沒有課程"}</p>{firstCourse ? <Link className="btn" href={`/booking?venue=${venue.id}&course=${firstCourse.id}`}>立即預約</Link> : null}</aside>
      </div>
    </main>
  );
}
