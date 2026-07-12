"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-[12px] border border-transparent"
        aria-label="Toggle theme"
      >
        <span className="h-4 w-4" />
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="h-9 w-9 rounded-[12px] text-[#71717a] dark:text-[#a1a1aa] hover:text-[#09090b] dark:hover:text-[#fafafa] hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] border border-transparent hover:border-[#ececee] dark:hover:border-[#3f3f46] transition-all relative"
    >
      {/* Sun — shown in dark mode to switch to light */}
      <Sun
        className={`h-4 w-4 absolute transition-all duration-300 ${
          isDark
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 rotate-90 scale-50"
        }`}
      />
      {/* Moon — shown in light mode to switch to dark */}
      <Moon
        className={`h-4 w-4 absolute transition-all duration-300 ${
          isDark
            ? "opacity-0 -rotate-90 scale-50"
            : "opacity-100 rotate-0 scale-100"
        }`}
      />
    </Button>
  );
}
