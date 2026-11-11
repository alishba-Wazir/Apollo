"use client";

import React, { useEffect, useState } from "react";

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check saved theme or default to dark
    const saved = (localStorage.getItem("apollo-theme") ||
      (localStorage.getItem("apollo_admin_theme") === "theme-light" ? "light" : "dark")) as "dark" | "light";

    const activeTheme = saved === "light" ? "light" : "dark";
    setTheme(activeTheme);
    applyTheme(activeTheme);
    setMounted(true);

    const handleThemeChange = (e: CustomEvent<{ theme: "dark" | "light" }>) => {
      if (e.detail?.theme) {
        setTheme(e.detail.theme);
      }
    };

    window.addEventListener("apollo-theme-change" as any, handleThemeChange);
    return () => {
      window.removeEventListener("apollo-theme-change" as any, handleThemeChange);
    };
  }, []);

  const applyTheme = (targetTheme: "dark" | "light") => {
    const isDark = targetTheme === "dark";
    document.documentElement.setAttribute("data-theme", targetTheme);
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.classList.toggle("theme-dark", isDark);
    document.documentElement.classList.toggle("theme-light", !isDark);
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("apollo-theme", next);
    localStorage.setItem("apollo_admin_theme", next === "dark" ? "theme-dark" : "theme-light");
    applyTheme(next);

    window.dispatchEvent(
      new CustomEvent("apollo-theme-change", { detail: { theme: next } })
    );
  };

  if (!mounted) {
    return <div className="w-[58px] h-[32px] rounded-full glass border border-[var(--card-border)]" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      role="switch"
      aria-checked={!isDark}
      aria-label="Toggle dark/light theme"
      className="relative w-[58px] h-[32px] rounded-full p-[2px] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] border border-[var(--card-border)] glass cursor-pointer select-none shrink-0"
    >
      {/* Sliding knob */}
      <div
        className={`w-[26px] h-[26px] rounded-full bg-[var(--accent)] text-[var(--on-accent)] flex items-center justify-center text-[13px] font-bold shadow-md transform transition-transform duration-300 ${
          isDark ? "translate-x-0" : "translate-x-[26px]"
        }`}
      >
        {isDark ? "☾" : "☀"}
      </div>
    </button>
  );
};
