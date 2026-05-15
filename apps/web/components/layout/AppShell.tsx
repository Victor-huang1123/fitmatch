"use client";

import { useEffect, useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

const STORAGE_KEY = "fitmatch.sidebarCollapsed";
const MOBILE_BREAKPOINT = 820;

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  // 桌機：切換 collapsed（圖示模式）；手機：切換 overlay
  const handleMenuClick = () => {
    if (window.innerWidth <= MOBILE_BREAKPOINT) {
      setSidebarOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => {
        const next = !prev;
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
        return next;
      });
    }
  };

  return (
    <div
      className={`app-shell app-layout${collapsed ? " collapsed" : ""}${sidebarOpen ? " sidebar-open" : ""}`}
    >
      <Header onMenuClick={handleMenuClick} />
      <Sidebar onLinkClick={() => setSidebarOpen(false)} />
      <div
        className="main-content"
        onClick={() => { if (sidebarOpen) setSidebarOpen(false); }}
      >
        {children}
      </div>
    </div>
  );
}
