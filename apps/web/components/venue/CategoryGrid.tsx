import Link from "next/link";
import type { Venue } from "../../lib/types";

const categories = [
  ["體能訓練", "💪", "fit"],
  ["身心控制", "🧘", "balance"],
  ["技巧", "🎯", "skill"],
  ["競技對抗", "🥊", "box"],
  ["戶外運動", "🏔️", "out"],
  ["其他", "✨", "all"],
] as const;

export function CategoryGrid({ venues }: { venues: Venue[] }) {
  return (
    <div className="category-grid">
      {categories.map(([name, icon, tone]) => {
        const count = venues.filter((venue) => venue.category.includes(name)).length;
        return (
          <Link key={name} className={`category-card cat-${tone}`} href={`/venues?category=${encodeURIComponent(name)}`}>
            <span className="category-icon">{icon}</span>
            <span className="category-name">{name}</span>
            <span className="category-count">{count} 間場館</span>
          </Link>
        );
      })}
    </div>
  );
}
