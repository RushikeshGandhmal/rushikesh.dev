"use client";

import { AnimatePresence, m as motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  /** Render in the compact pill-button style used in the desktop nav. */
  variant?: "pill" | "ghost";
}

/**
 * Sun ↔ moon morph. The icon shown is the current theme (moon → "you
 * are in dark mode, click for light"). Crossfades + rotates with a
 * spring on click. Triggers the audio chime via ThemeProvider.toggle.
 */
export function ThemeToggle({ className, variant = "pill" }: ThemeToggleProps) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      data-cursor
      data-cursor-label={isDark ? "Lights on" : "Lights off"}
      aria-label={
        isDark ? "Switch to light mode" : "Switch to dark mode"
      }
      aria-pressed={isDark}
      className={cn(
        "group relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full transition-colors",
        variant === "pill"
          ? "border border-ink/10 bg-paper/60 hover:bg-paper-warm"
          : "hover:bg-ink/5",
        className
      )}
    >
      {/* Hover ring sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 ring-1 ring-accent/40 transition-opacity duration-300 group-hover:opacity-100"
      />

      <AnimatePresence initial={false} mode="wait">
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="block text-ink"
          >
            <MoonIcon />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="block text-ink"
          >
            <SunIcon />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m4.93 19.07 1.41-1.41" />
      <path d="m17.66 6.34 1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
    </svg>
  );
}
