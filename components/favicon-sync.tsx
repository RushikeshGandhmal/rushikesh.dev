"use client";

import { useEffect } from "react";

/**
 * FaviconSync
 * The R-badge in the nav uses `bg-ink text-paper` so its colors flip when the
 * theme toggles. The tab favicon should mirror that exact behaviour, so we
 * generate the SVG at runtime and swap the <link rel="icon"> href whenever
 * `data-theme` changes on <html>.
 */
function buildSvg(theme: "dark" | "light") {
  // These match the resolved CSS tokens for each theme:
  //   light: --ink #0A0A0A on --paper #FAF9F6
  //   dark : --ink #F0EBE2 on --paper #0E0D0C
  // The badge is `bg-ink text-paper`, so bg = ink, fg = paper.
  const palette =
    theme === "dark"
      ? { bg: "#F0EBE2", fg: "#0E0D0C", accent: "#F58250", ring: "#0E0D0C" }
      : { bg: "#0A0A0A", fg: "#FAF9F6", accent: "#E85D2D", ring: "#FAF9F6" };

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <circle cx="32" cy="32" r="32" fill="${palette.bg}"/>
  <text x="32" y="45" text-anchor="middle"
        font-family="'Instrument Serif', 'Times New Roman', Georgia, serif"
        font-size="40" font-weight="400" fill="${palette.fg}">R</text>
  <circle cx="52" cy="52" r="6" fill="${palette.accent}" stroke="${palette.ring}" stroke-width="2"/>
</svg>`;
}

function svgToDataUri(svg: string) {
  // encodeURIComponent keeps the SVG inline-friendly without a btoa cost.
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function applyFavicon(theme: "dark" | "light") {
  const href = svgToDataUri(buildSvg(theme));

  // Find every link that acts as the page icon and update its href.
  // Next.js injects `<link rel="icon">`; some browsers also read shortcut icon.
  const selectors = [
    'link[rel="icon"]',
    'link[rel~="icon"]',
    'link[rel="shortcut icon"]',
  ];
  const seen = new Set<HTMLLinkElement>();
  for (const sel of selectors) {
    document.head.querySelectorAll<HTMLLinkElement>(sel).forEach((el) => {
      // Skip the apple-touch-icon (iOS home screen) — that one stays static.
      if (el.rel.includes("apple-touch-icon")) return;
      seen.add(el);
    });
  }

  if (seen.size === 0) {
    // Defensive: if Next hasn't injected one yet, create it.
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/svg+xml";
    link.href = href;
    document.head.appendChild(link);
    return;
  }

  seen.forEach((el) => {
    el.type = "image/svg+xml";
    el.href = href;
  });
}

export function FaviconSync() {
  useEffect(() => {
    const readTheme = () =>
      document.documentElement.getAttribute("data-theme") === "light"
        ? ("light" as const)
        : ("dark" as const);

    // Apply once on mount with the current resolved theme.
    applyFavicon(readTheme());

    // Watch for runtime theme toggles.
    const observer = new MutationObserver(() => applyFavicon(readTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
