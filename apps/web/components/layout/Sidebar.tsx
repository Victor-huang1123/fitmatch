"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../lib/auth";

const categories = [
  ["體能訓練", "💪", "fit"],
  ["身心控制", "🧘", "balance"],
  ["技巧", "🎯", "skill"],
  ["競技對抗", "🥊", "box"],
  ["戶外運動", "🏔️", "out"],
  ["其他", "✨", "all"],
] as const;

interface SideLinkProps {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
  tone?: string;
  onClick?: () => void;
}

function SideLink({ href, icon, label, active, tone = "fit", onClick }: SideLinkProps) {
  return (
    <Link
      className={`side-link side-${tone}${active ? " active" : ""}`}
      href={href}
      title={label}
      onClick={onClick}
    >
      <span className="side-icon">{icon}</span>
      <span className="side-text">{label}</span>
    </Link>
  );
}

interface SidebarProps {
  onLinkClick?: () => void;
}

export function Sidebar({ onLinkClick }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="sidebar" aria-label="側邊導覽">
      <div className="sidebar-inner">
        <div className="sidebar-section">
          <SideLink href="/" icon="🏠" label="首頁" active={pathname === "/"} onClick={onLinkClick} />
          <SideLink href="/venues?sort=rating" icon="🏢" label="熱門場館" active={pathname === "/venues"} onClick={onLinkClick} />
          {user ? <SideLink href="/orders" icon="📋" label="我的預約" active={pathname === "/orders"} onClick={onLinkClick} /> : null}
          {user?.role === "merchant" ? (
            <SideLink href="/merchant/bookings" icon="⚙️" label="商家後台" active={pathname === "/merchant/bookings"} onClick={onLinkClick} />
          ) : null}
        </div>

        <div className="sidebar-section">
          <div className="sidebar-title">探索分類</div>
          {categories.map(([label, icon, tone]) => (
            <SideLink
              key={label}
              href={`/venues?category=${encodeURIComponent(label)}`}
              icon={icon}
              label={label}
              tone={tone}
              onClick={onLinkClick}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
