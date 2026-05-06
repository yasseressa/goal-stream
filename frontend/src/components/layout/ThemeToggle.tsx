"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const storageKey = "kinglive-theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(storageKey);
    const initialTheme: Theme = savedTheme === "dark" ? "dark" : "light";
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  function handleToggle() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem(storageKey, nextTheme);
    applyTheme(nextTheme);
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#273340] text-white shadow-[0_0_4px_rgba(0,0,0,0.18)] transition hover:bg-[#931800]"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[1.1rem] w-[1.1rem] fill-none stroke-current" strokeWidth="1.8" aria-hidden="true">
      <path d="M20.5 14.4A8.5 8.5 0 0 1 9.6 3.5a8.7 8.7 0 1 0 10.9 10.9Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[1.1rem] w-[1.1rem] fill-none stroke-current" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}
