"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../../lib/api";
import { useAuth } from "../../../lib/auth";
import type { Venue } from "../../../lib/types";
import BottomNav from "../../components/BottomNav";

export default function VenueDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [activeTab, setActiveTab] = useState<"courses" | "coaches" | "reviews">("courses");

  useEffect(() => {
    api.venue(params.id)
      .then((r) => { setVenue(r.venue); if (r.venue.courses?.[0]) setSelectedCourseId(r.venue.courses[0].id); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen bg-surface pb-24">
      <div className="h-48 bg-surface-container animate-pulse" />
      <div className="px-4 pt-4 space-y-3">
        {[1,2,3].map((i) => <div key={i} className="h-4 bg-surface-container rounded animate-pulse" />)}
      </div>
      <BottomNav />
    </div>
  );

  if (!venue) return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-3 pb-24">
      <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "48px" }}>error</span>
      <p className="text-sm text-on-surface-variant">找不到這間場館</p>
      <button onClick={() => router.back()} className="text-xs text-primary font-semibold">返回</button>
      <BottomNav />
    </div>
  );

  const selectedCourse = venue.courses?.find((c) => c.id === selectedCourseId) ?? venue.courses?.[0];

  return (
    <div className="min-h-screen bg-surface pb-32">
      <div className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border-subtle">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-3">
          <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-high">
            <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
          </button>
          <p className="text-sm font-semibold text-on-surface flex-1 truncate">{venue.name}</p>
        </div>
      </div>

      <div className="h-48 bg-gradient-to-br from-primary to-[#003040] flex flex-col justify-end px-5 pb-5">
        <div className="flex flex-wrap gap-1 mb-2">
          {venue.category.map((c) => (
            <span key={c} className="text-[10px] font-bold text-white bg-white/20 px-2 py-0.5 rounded-full">{c}</span>
          ))}
        </div>
        <h1 className="text-xl font-bold text-white">{venue.name}</h1>
        <p className="text-xs text-white/70 mt-0.5">{venue.city} {venue.district}{venue.address ? ` · ${venue.address}` : ""}</p>
      </div>

      <main className="max-w-4xl mx-auto px-4 pt-4 space-y-4">
        <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-rating-star" style={{ fontSize: "16px", fontVariationSettings: '"FILL" 1' }}>star</span>
            <span className="text-sm font-bold text-on-surface">{venue.rating.toFixed(1)}</span>
            <span className="text-xs text-on-surface-variant">({venue.reviewCount} 則評價)</span>
          </div>
          <span className="text-sm font-bold text-primary">NT$ {venue.startingPrice} 起</span>
          {venue.phone && (
            <a href={`tel:${venue.phone}`} className="flex items-center gap-1 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>call</span>
              {venue.phone}
            </a>
          )}
        </div>

        {(venue.description || venue.businessHours) && (
          <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-4 space-y-2">
            {venue.description && <p className="text-sm text-on-surface leading-relaxed">{venue.description}</p>}
            {venue.businessHours && (
              <div className="flex items-center gap-2 pt-2 border-t border-border-subtle/50">
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "15px" }}>schedule</span>
                <span className="text-xs text-on-surface-variant">{venue.businessHours}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden">
          {(["courses", "coaches", "reviews"] as const).map((tab) => {
            const labels = { courses: `課程 (${venue.courses?.length ?? 0})`, coaches: `教練 (${venue.coaches?.length ?? 0})`, reviews: `評價 (${venue.reviews?.length ?? 0})` };
            return (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${activeTab === tab ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container-low"}`}>
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {activeTab === "courses" && (
          <div className="space-y-2">
            {!venue.courses?.length && <p className="text-sm text-on-surface-variant text-center py-8">目前沒有課程</p>}
            {venue.courses?.map((course) => (
              <div key={course.id} onClick={() => setSelectedCourseId(course.id)}
                className={`bg-surface-container-lowest border rounded-2xl p-4 cursor-pointer transition-all ${selectedCourseId === course.id ? "border-primary bg-primary/5" : "border-border-subtle hover:border-primary/40"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {selectedCourseId === course.id && (
                        <span className="material-symbols-outlined text-primary" style={{ fontSize: "15px", fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                      )}
                      <p className="text-sm font-bold text-on-surface">{course.name}</p>
                    </div>
                    {course.description && <p className="text-xs text-on-surface-variant mt-1">{course.description}</p>}
                  </div>
                  <span className="shrink-0 text-sm font-bold text-primary">NT$ {course.price}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "coaches" && (
          <div className="space-y-2">
            {!venue.coaches?.length && <p className="text-sm text-on-surface-variant text-center py-8">暫無教練資料</p>}
            {venue.coaches?.map((coach) => (
              <div key={coach.id} className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-4 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <span className="text-base font-bold text-primary">{coach.name.slice(0, 1)}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">{coach.name}</p>
                  <p className="text-xs text-on-surface-variant">{coach.yearsOfExperience} 年經驗{coach.bio ? ` · ${coach.bio}` : ""}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-2">
            {!venue.reviews?.length && <p className="text-sm text-on-surface-variant text-center py-8">還沒有評價</p>}
            {venue.reviews?.map((review) => (
              <div key={review.id} className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center">
                      <span className="text-xs font-bold text-on-surface">{review.userName.slice(0, 1)}</span>
                    </div>
                    <span className="text-sm font-semibold text-on-surface">{review.userName}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-rating-star" style={{ fontSize: "13px", fontVariationSettings: '"FILL" 1' }}>star</span>
                    <span className="text-xs font-bold text-on-surface">{review.rating.toFixed(1)}</span>
                  </div>
                </div>
                {review.comment && <p className="text-xs text-on-surface-variant leading-relaxed">{review.comment}</p>}
                <p className="text-[10px] text-on-surface-variant/60 mt-1.5">{String(review.createdAt).slice(0, 10)}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedCourse && (
        <div className="fixed bottom-16 left-0 right-0 px-4 pb-2 z-40">
          <div className="max-w-4xl mx-auto bg-surface-container-lowest border border-border-subtle rounded-2xl p-3 flex items-center justify-between shadow-lg">
            <div>
              <p className="text-xs text-on-surface-variant">已選課程</p>
              <p className="text-sm font-bold text-on-surface">{selectedCourse.name}</p>
              <p className="text-xs font-bold text-primary">NT$ {selectedCourse.price}</p>
            </div>
            {user ? (
              <Link href={`/booking?venue=${venue.id}&course=${selectedCourse.id}`} className="px-5 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-bold">立即預約</Link>
            ) : (
              <Link href={`/login?next=/venue/${venue.id}`} className="px-5 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-bold">登入預約</Link>
            )}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
