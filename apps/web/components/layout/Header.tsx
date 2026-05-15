"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../lib/auth";
import { useTheme } from "../../lib/theme";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [keyword, setKeyword] = useState("");

  const isDark = theme === "dark" || (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="topbar-left">
          <button
            className="btn secondary menu-button"
            type="button"
            aria-label="開啟側邊欄"
            onClick={onMenuClick}
          >
            ☰
          </button>
          <Link className="brand" href="/">
            <span className="brand-mark">FM</span>
            <span>FitMatch</span>
          </Link>
        </div>
        <form
          className="topbar-search"
          onSubmit={(event) => {
            event.preventDefault();
            router.push(keyword.trim() ? `/venues?keyword=${encodeURIComponent(keyword.trim())}` : "/venues");
          }}
        >
          <div className="search-row">
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="搜尋場館"
              aria-label="搜尋場館"
            />
            <button className="btn secondary" type="submit">搜尋</button>
          </div>
        </form>
        <nav className="nav" aria-label="主要導覽">
          <button
            className="btn secondary theme-toggle"
            type="button"
            aria-label={isDark ? "切換為亮色模式" : "切換為暗色模式"}
            onClick={toggleTheme}
          >
            {isDark ? "☀️" : "🌙"}
          </button>
          <Link className="nav-link" href="/venues">找場館</Link>
          {user ? <Link className="nav-link" href="/orders">我的訂單</Link> : null}
          {user?.role === "merchant" ? <Link className="nav-link" href="/merchant/bookings">商家後台</Link> : null}
          {user ? (
            <button
              className="btn secondary"
              type="button"
              onClick={() => { logout(); router.push("/"); }}
            >
              {user.name} / 登出
            </button>
          ) : (
            <Link className="btn secondary" href="/login">登入</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
