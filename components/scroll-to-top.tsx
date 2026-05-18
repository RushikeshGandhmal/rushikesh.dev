"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Forces the window to scroll to (0, 0) when entering certain routes.
 * Solves the case where a soft navigation lands the user at the previous
 * scroll position because of restoration or anchor side-effects.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't override anchor jumps on the home page (#about, #projects, etc.)
    if (pathname === "/") return;

    // Use rAF so the route's content paints first and then we snap to top.
    const id = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
