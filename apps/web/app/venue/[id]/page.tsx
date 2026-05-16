"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import { useToast } from "../../../lib/toast";
import type { Venue } from "../../../lib/types";

const TIME_SLOTS = ["09:00", "10:30", "13:00", "14:30", "17:00", "19:00", "20:30"];

export default function VenueDetailPage({ params }: { params: { id: string } }) {
  const toast = useToast();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    api.venue(params.id)
      .then((res) => {
        setVenue(res.venue);
        if (res.venue.courses?.[0]) setSelectedCourseId(res.venue.courses[0].id);
      })
      .catch(() => toast("載入場館資料失敗，請稍後再試。"))
      .finally(() => setLoading(false));
  }, [params.id]);

  const today = new Date().toISOString().split("T")[0];

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

  const selectedCourse = venue.courses?.find((c) => c.id === selectedCourseId) ?? venue.courses?.[0];
  const bookingBase = selectedCourse
    ? `/booking?venue=${venue.id}&course=${selectedCourse.id}`
    : `/booking?venue=${venue.id}`;
  const bookingUrl = `${bookingBase}${selectedDate ? `&date=${selectedDate}` : ""}${selectedTime ? `&time=${encodeURIComponent(selectedTime)}` : ""}`;

  return (
    <main className="page">
      <Link className="nav-link" href="/venues">返回列表</Link>

      <section>
        <p className="eyebrow">{venue.category.join(" / ")}</p>
        <h1>{venue.name}</h1>
        <div className="meta-row">
          <span>{venue.rating.toFixed(1)} 分，{venue.reviewCount} 則評價</span>
          <span>{venue.city} {venue.district}</span>
          <span>NT$ {venue.startingPrice} 起</span>
        </div>
        <div className="photo-grid">
          {[0, 1, 2, 3, 4].map((index) => (
            <div key={index} className={`photo-tile tone-${venue.id} photo-tone-${index}`}>
              <span className="tile-title">{index === 0 ? venue.name : `空間照片 ${index + 1}`}</span>
              <span className="tile-meta">Mock placeholder</span>
            </div>
          ))}
        </div>
      </section>

      <div className="detail-layout">
        {/* Left: content */}
        <div className="list">
          <section className="panel list">
            <h2>課程 / 方案</h2>
            {venue.courses?.map((course) => (
              <article key={course.id} className="list-item course-row">
                <div>
                  <h3>{course.name}</h3>
                  <p className="muted">{course.description}</p>
                  <strong>NT$ {course.price}</strong>
                </div>
                <Link className="btn" href={`/booking?venue=${venue.id}&course=${course.id}`}>預約</Link>
              </article>
            ))}
          </section>

          <details className="disclosure quiet-section">
            <summary>教練列表</summary>
            <div className="disclosure-body avatar-list">
              {venue.coaches?.map((coach) => (
                <div key={coach.id} className="avatar">
                  <span className="avatar-mark">{coach.name.slice(0, 1)}</span>
                  <div>
                    <strong>{coach.name}</strong>
                    <p className="muted">{coach.yearsOfExperience} 年經驗，{coach.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </details>

          <details className="disclosure quiet-section">
            <summary>店家介紹</summary>
            <div className="disclosure-body">
              <p>{venue.description}</p>
              <p className="muted">地址：{venue.address}</p>
              <p className="muted">電話：{venue.phone}</p>
              <p className="muted">營業時間：{venue.businessHours}</p>
            </div>
          </details>

          <details className="disclosure quiet-section">
            <summary>評價</summary>
            <div className="disclosure-body">
              {venue.reviews?.map((review) => (
                <article key={review.id} className="list-item">
                  <div className="meta-row">
                    <strong>{review.userName}</strong>
                    <span>{review.rating.toFixed(1)} 分</span>
                    <span>{review.createdAt}</span>
                  </div>
                  <p>{review.comment}</p>
                </article>
              ))}
            </div>
          </details>
        </div>

        {/* Right: sticky booking panel */}
        <aside className="panel sticky-panel booking-panel">
          <h2>立即預約</h2>

          {/* Course selector */}
          {venue.courses && venue.courses.length > 0 ? (
            <div>
              <p className="booking-panel-label">選擇課程</p>
              <div className="course-options">
                {venue.courses.map((course) => (
                  <label
                    key={course.id}
                    className={`course-option${selectedCourseId === course.id ? " selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="course"
                      value={course.id}
                      checked={selectedCourseId === course.id}
                      onChange={() => setSelectedCourseId(course.id)}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{course.name}</div>
                      {course.description && (
                        <div style={{ fontSize: 12, color: "var(--muted)" }}>{course.description}</div>
                      )}
                    </div>
                    <span style={{ fontWeight: 800, color: "var(--brand-dark)", fontSize: 14, whiteSpace: "nowrap" }}>
                      NT$ {course.price}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <p className="muted">目前沒有課程</p>
          )}

          {/* Date picker */}
          {selectedCourse && (
            <div>
              <p className="booking-panel-label">選擇日期</p>
              <input
                type="date"
                min={today}
                value={selectedDate}
                onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(""); }}
                style={{ width: "100%" }}
              />
            </div>
          )}

          {/* Time slots */}
          {selectedDate && (
            <div>
              <p className="booking-panel-label">選擇時段</p>
              <div className="time-slots">
                {TIME_SLOTS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`time-slot${selectedTime === t ? " selected" : ""}`}
                    onClick={() => setSelectedTime(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price summary */}
          {selectedCourse && (
            <div className="booking-price-summary">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 14, color: "var(--muted)" }}>{selectedCourse.name}</span>
                <span style={{ fontWeight: 900, fontSize: 22 }}>NT$ {selectedCourse.price}</span>
              </div>
              {selectedDate && (
                <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
                  {selectedDate}{selectedTime ? ` · ${selectedTime}` : ""}
                </p>
              )}
            </div>
          )}

          {selectedCourse ? (
            <Link className="btn" href={bookingUrl} style={{ width: "100%", justifyContent: "center" }}>
              立即預約
            </Link>
          ) : null}

          {/* Cancellation policy */}
          <details className="disclosure">
            <summary style={{ minHeight: 44, fontSize: 13 }}>取消政策</summary>
            <div className="disclosure-body">
              <p className="muted" style={{ fontSize: 13 }}>
                上課前 24 小時可免費取消或改期。上課前 12 小時內取消，將收取 50% 手續費。
              </p>
            </div>
          </details>
        </aside>
      </div>

      {/* Mobile bottom CTA */}
      {selectedCourse && (
        <div className="mobile-cta">
          <Link className="btn" href={bookingUrl}>
            立即預約 · NT$ {selectedCourse.price}
          </Link>
        </div>
      )}
    </main>
  );
}
