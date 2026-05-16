"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { useToast } from "../../lib/toast";
import type { Course, Venue } from "../../lib/types";

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const toast = useToast();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const venueId = searchParams.get("venue");
    const courseId = searchParams.get("course");
    if (!user) router.push(`/login?next=${encodeURIComponent(`/booking?${searchParams.toString()}`)}`);
    if (venueId) api.venue(venueId).then((res) => {
      setVenue(res.venue);
      setCourse(res.venue.courses?.find((item) => item.id === courseId) || null);
    });
  }, [router, searchParams, user]);

  if (!user || !venue || !course) return <main className="page"><p className="muted">載入中...</p></main>;

  return (
    <main className="page">
      <div className="section-head"><div><p className="eyebrow">預約表單</p><h1>{course.name}</h1></div><span className="badge">NT$ {course.price}</span></div>
      <section className="panel list"><p>{venue.name}</p><p className="muted">{course.description}</p></section>
      <form className="panel" onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        try {
          await api.createBooking({
            venueId: venue.id,
            courseId: course.id,
            contactName: form.get("contactName"),
            gender: form.get("gender"),
            age: Number(form.get("age")),
            phone: form.get("phone"),
            note: form.get("note"),
          });
          toast("已送出預約，等待商家確認。");
          router.push("/orders");
        } catch (err) {
          setError(err instanceof Error ? err.message : "預約失敗");
        }
      }}>
        <div className="form-grid">
          <label><span>姓名</span><input name="contactName" defaultValue={user.name} required /></label>
          <label><span>性別</span><select name="gender" defaultValue="不透露"><option>不透露</option><option>女</option><option>男</option><option>其他</option></select></label>
          <label><span>年齡</span><input name="age" type="number" min={12} max={90} required /></label>
          <label><span>電話</span><input name="phone" defaultValue={user.phone} maxLength={10} required /></label>
          <label className="full"><span>備註</span><textarea name="note" maxLength={180} /></label>
        </div>
        {error ? <p className="error">{error}</p> : null}
        <div className="actions"><button className="btn" type="submit">送出預約</button><Link className="btn secondary" href={`/venue/${venue.id}`}>返回場館</Link></div>
      </form>
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<main className="page"><p className="muted">載入中...</p></main>}>
      <BookingContent />
    </Suspense>
  );
}
