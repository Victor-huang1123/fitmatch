import Link from "next/link";
import type { Venue } from "../../lib/types";

export function StarRating({ rating }: { rating: number }) {
  const filled = Math.round(rating);
  const empty = 5 - filled;
  return (
    <span className="star-rating">
      <span className="stars">{"★".repeat(filled)}{"☆".repeat(empty)}</span>
      <span className="rating-num">{rating.toFixed(1)}</span>
    </span>
  );
}

export function VenueCard({ venue }: { venue: Venue }) {
  return (
    <article className="venue-card">
      <div className={`venue-cover tone-${venue.id}`}>
        <span className="venue-tag">{venue.category[0]}</span>
        <div className="venue-name-overlay">
          <span style={{ fontWeight: 800 }}>{venue.name}</span>
          <span style={{ fontSize: 12, opacity: 0.86 }}>{venue.city} {venue.district}</span>
        </div>
      </div>
      <div className="card-body">
        <h3>{venue.name}</h3>
        <div className="meta-row">
          <StarRating rating={venue.rating} />
          <span className="muted">·</span>
          <span className="muted">{venue.reviewCount} 則評價</span>
        </div>
        <div className="venue-price">NT$ {venue.startingPrice} <span className="muted" style={{ fontWeight: 400 }}>起 / 堂</span></div>
        <p className="muted" style={{ fontSize: 13 }}>{venue.category.join(" / ")}</p>
        <Link className="btn secondary" href={`/venue/${venue.id}`}>查看課程 →</Link>
      </div>
    </article>
  );
}

export function VenueRow({ venue }: { venue: Venue }) {
  return (
    <Link href={`/venue/${venue.id}`} className="venue-row">
      <div className={`venue-row-cover tone-${venue.id}`} />
      <div className="venue-row-body">
        <h3 style={{ margin: 0, fontSize: 16 }}>{venue.name}</h3>
        <div className="meta-row">
          <StarRating rating={venue.rating} />
          <span className="muted">·</span>
          <span className="muted" style={{ fontSize: 13 }}>{venue.reviewCount} 則評價</span>
        </div>
        <div className="meta-row">
          <span className="muted" style={{ fontSize: 13 }}>{venue.city} {venue.district}</span>
          <span className="muted">·</span>
          <span style={{ fontSize: 13 }}>{venue.category.join(" / ")}</span>
        </div>
        <div className="venue-price" style={{ fontSize: 14 }}>
          NT$ {venue.startingPrice} <span className="muted" style={{ fontWeight: 400 }}>起 / 堂</span>
        </div>
      </div>
    </Link>
  );
}

export function VenueCardSkeleton() {
  return (
    <article className="venue-card">
      <div className="skeleton skeleton-cover" />
      <div className="card-body">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-short" />
        <div className="skeleton skeleton-btn" />
      </div>
    </article>
  );
}

export function VenueRowSkeleton() {
  return (
    <div className="venue-row" style={{ pointerEvents: "none" }}>
      <div className="skeleton" style={{ minHeight: 112, borderRadius: 0 }} />
      <div className="venue-row-body">
        <div className="skeleton skeleton-title" style={{ width: "65%" }} />
        <div className="skeleton skeleton-line" style={{ width: "50%" }} />
        <div className="skeleton skeleton-short" style={{ width: "40%" }} />
      </div>
    </div>
  );
}
