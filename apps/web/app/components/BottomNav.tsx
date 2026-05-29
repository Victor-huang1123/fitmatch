"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../lib/auth";

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const studentNav = [
    { href: "/",       label: "首頁", icon: "home",       match: (p: string) => p === "/" },
    { href: "/search", label: "搜尋", icon: "search",     match: (p: string) => p.startsWith("/search") },
    { href: "/orders", label: "預約", icon: "event_note", match: (p: string) => p.startsWith("/orders") },
    { href: "/profile",label: "個人", icon: "person",     match: (p: string) => p.startsWith("/profile") },
  ];

  const merchantNav = [
    { href: "/",                label: "首頁",   icon: "home",                  match: (p: string) => p === "/" },
    { href: "/pending",         label: "待確認", icon: "pending_actions",       match: (p: string) => p.startsWith("/pending") },
    { href: "/merchant/bookings",label: "管理",  icon: "settings_applications", match: (p: string) => p.startsWith("/merchant") },
    { href: "/profile",         label: "個人",   icon: "person",                match: (p: string) => p.startsWith("/profile") },
  ];

  const visitorNav = [
    { href: "/",       label: "首頁", icon: "home",   match: (p: string) => p === "/" },
    { href: "/search", label: "搜尋", icon: "search", match: (p: string) => p.startsWith("/search") },
    { href: "/venues", label: "場館", icon: "sports_gymnastics", match: (p: string) => p.startsWith("/venues") },
  ];

  const items = user?.role === "merchant" ? merchantNav : user ? studentNav : visitorNav;

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center py-2 px-4 bg-surface border-t border-border-subtle shadow-[0_-4px_12px_0_rgba(0,0,0,0.05)] z-50">
      {items.map((item) => {
        const active = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center px-3 py-1 transition-all active:scale-95 ${
              active
                ? "bg-primary-container text-on-primary-container rounded-xl"
                : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: active ? '"FILL" 1' : '"FILL" 0' }}
            >
              {item.icon}
            </span>
            <span className="text-xs">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
