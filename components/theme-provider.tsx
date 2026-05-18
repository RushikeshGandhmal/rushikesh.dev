"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { playThemeChime } from "@/lib/sound";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "theme";

/**
 * Inline script that runs *before* React hydrates so the page never
 * flashes the wrong theme. Reads the stored preference (or defaults
 * to "dark") and writes `data-theme` on <html> immediately.
 *
 * Rendered via `dangerouslySetInnerHTML` in app/layout.tsx <head>.
 */
export const themeInitScript = `(() => {
  try {
    var stored = localStorage.getItem("${STORAGE_KEY}");
    var theme = stored === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();`;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initial state mirrors the inline script's logic; the real value is
  // re-synced from the DOM on mount, but this avoids an SSR warning.
  const [theme, setThemeState] = useState<Theme>("dark");

  // On mount, hydrate from the DOM attribute the inline script wrote.
  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "light" || current === "dark") {
      setThemeState(current);
    }
  }, []);

  const apply = useCallback((next: Theme) => {
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.style.colorScheme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode, ignore */
    }
  }, []);

  const setTheme = useCallback(
    (next: Theme) => {
      setThemeState(next);
      apply(next);
    },
    [apply]
  );

  const toggle = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      apply(next);
      // Fire the sweet little chime AFTER applying so the audio feels
      // synchronous with the visual change.
      playThemeChime(next);
      return next;
    });
  }, [apply]);

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Allow components rendered outside the provider (e.g. tests) to
    // degrade gracefully.
    return {
      theme: "dark",
      toggle: () => {},
      setTheme: () => {},
    };
  }
  return ctx;
}
