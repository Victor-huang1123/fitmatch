"use client";

import { useTheme } from "../../lib/theme";

type Props = {
  /** true = 放在淺色背景上；false（預設）= 放在深色 hero 背景上 */
  light?: boolean;
  className?: string;
};

export default function ThemeToggle({ light = false, className = "" }: Props) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  function toggle() {
    setTheme(isDark ? "light" : "dark");
  }

  if (light) {
    return (
      <button
        onClick={toggle}
        className={`flex items-center gap-1.5 h-9 px-3 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors ${className}`}
        aria-label={isDark ? "切換淺色模式" : "切換深色模式"}
      >
        <span
          className="material-symbols-outlined text-on-surface-variant"
          style={{ fontSize: "17px", fontVariationSettings: '"FILL" 1' }}
        >
          {isDark ? "light_mode" : "dark_mode"}
        </span>
        <span className="text-xs font-semibold text-on-surface-variant">
          {isDark ? "淺色" : "深色"}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1.5 h-9 px-3 rounded-full bg-white/15 hover:bg-white/25 transition-colors ${className}`}
      aria-label={isDark ? "切換淺色模式" : "切換深色模式"}
    >
      <span
        className="material-symbols-outlined text-white"
        style={{ fontSize: "17px", fontVariationSettings: '"FILL" 1' }}
      >
        {isDark ? "light_mode" : "dark_mode"}
      </span>
      <span className="text-xs font-semibold text-white">
        {isDark ? "淺色" : "深色"}
      </span>
    </button>
  );
}
