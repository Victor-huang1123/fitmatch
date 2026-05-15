"use client";

import type { Booking, BookingStatus } from "../../lib/types";

const statusText: Record<BookingStatus, string> = {
  pending: "待確認",
  confirmed: "已確認",
  completed: "已完成",
  cancelled: "已取消",
};

export function BookingItem({ booking, mode, onStatus }: { booking: Booking; mode: "student" | "merchant"; onStatus: (id: string, status: BookingStatus) => void }) {
  const canStudentCancel = mode === "student" && booking.status === "pending";
  const canMerchantAct = mode === "merchant" && booking.status === "pending";
  return (
    <article className="list-item">
      <div className="meta-row">
        <span className={`badge status-${booking.status}`}>{statusText[booking.status]}</span>
        <span>{booking.id}</span>
        <span>{new Date(booking.createdAt).toLocaleDateString("zh-TW")}</span>
      </div>
      <h3>{booking.venueName || booking.venueId} / {booking.courseName || booking.courseId}</h3>
      <p className="muted">聯絡人：{booking.contactName}，電話：{booking.phone}</p>
      {booking.note ? <p>備註：{booking.note}</p> : null}
      <div className="actions">
        {canStudentCancel ? <button className="btn danger" type="button" onClick={() => onStatus(booking.id, "cancelled")}>取消預約</button> : null}
        {canMerchantAct ? <button className="btn" type="button" onClick={() => onStatus(booking.id, "confirmed")}>確認預約</button> : null}
        {canMerchantAct ? <button className="btn danger" type="button" onClick={() => onStatus(booking.id, "cancelled")}>取消</button> : null}
      </div>
    </article>
  );
}
