import type { Venue } from "../../lib/types";
import { VenueCard, VenueCardSkeleton } from "./VenueCard";

interface VenueGridProps {
  venues: Venue[];
  loading?: boolean;
  skeletonCount?: number;
}

export function VenueGrid({ venues, loading, skeletonCount = 6 }: VenueGridProps) {
  if (loading) {
    return (
      <div className="grid">
        {Array.from({ length: skeletonCount }, (_, i) => <VenueCardSkeleton key={i} />)}
      </div>
    );
  }
  if (!venues.length) return <div className="empty">目前沒有符合條件的場館。</div>;
  return <div className="grid">{venues.map((venue) => <VenueCard key={venue.id} venue={venue} />)}</div>;
}
