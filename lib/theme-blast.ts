"use client";

import { playSeaWave } from "./sound";

type Theme = "light" | "dark";

// CSS supports check for the View Transitions API — set to `true` only when
// we have both startViewTransition (Chromium / latest Safari) and the
// pseudo-elements work as expected.
function supportsViewTransitions(): boolean {
  if (typeof document === "undefined") return false;
  return typeof (document as Document & {
    startViewTransition?: (cb: () => void) => unknown;
  }).startViewTransition === "function";
}

interface BlastOpts {
  from: Theme;
  to: Theme;
  /** Click origin in viewport coordinates (px). */
  origin: { x: number; y: number };
  /** Mutates the DOM to apply the new theme (data-theme + storage). */
  applyTheme: (next: Theme) => void;
}

/**
 * The cinematic theme transition — a *wave* of the new theme washing
 * outward from the toggle button while the page content stays fully
 * visible underneath. Layered with a shockwave ring, a hot accent
 * flash, a low-frequency boom, and the existing arpeggio chime.
 *
 * Implementation:
 *   - Uses the View Transitions API where supported (Chromium, modern
 *     Safari/Firefox). The browser snapshots the page, we flip the
 *     theme attribute, and the new snapshot is clipped from invisible
 *     to fully revealed via a circle expanding from the click point.
 *     Old snapshot sits beneath — so content never disappears.
 *   - On unsupported browsers, falls back to a soft crossfade overlay.
 *   - Honours prefers-reduced-motion (instant swap + chime only).
 */
export function themeBlast(opts: BlastOpts): void {
  const { to, origin, applyTheme } = opts;

  if (typeof window === "undefined") return;

  // Reduced motion: silent swap + sea-wave only, no ripples.
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    applyTheme(to);
    playSeaWave(to);
    return;
  }

  // Lock to prevent double-clicks stacking.
  if (document.body.dataset.themeBlasting === "1") return;
  document.body.dataset.themeBlasting = "1";

  const { x, y } = origin;
  const maxRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  // --- cinematic accents (independent of theme-swap mechanism) ----------
  spawnAccents({ x, y, to });

  // --- the actual color wave -------------------------------------------
  if (supportsViewTransitions()) {
    // Set CSS custom properties so the @keyframes in globals.css know
    // where to expand the clip-path from.
    const root = document.documentElement;
    root.style.setProperty("--blast-x", `${x}px`);
    root.style.setProperty("--blast-y", `${y}px`);
    root.style.setProperty("--blast-r", `${Math.ceil(maxRadius * 1.05)}px`);
    root.dataset.themeBlasting = "1";

    // startViewTransition: browser takes a snapshot of the current state,
    // runs the callback (which swaps the theme attribute and triggers a
    // full restyle), takes a second snapshot, then animates between them
    // via the ::view-transition-old/new pseudo-elements defined in CSS.
    const transition = (
      document as Document & {
        startViewTransition: (cb: () => void) => {
          finished: Promise<void>;
        };
      }
    ).startViewTransition(() => {
      applyTheme(to);
    });

    transition.finished.finally(() => {
      root.style.removeProperty("--blast-x");
      root.style.removeProperty("--blast-y");
      root.style.removeProperty("--blast-r");
      delete root.dataset.themeBlasting;
      delete document.body.dataset.themeBlasting;
    });
  } else {
    // --- fallback for browsers without View Transitions API ----------
    // A short opacity crossfade overlay in the *new* theme's paper color,
    // then swap underneath. Content still stays visible because the
    // overlay is semi-transparent at peak.
    const paperRgb = to === "dark" ? "14 13 12" : "250 249 246";
    const fade = document.createElement("div");
    fade.setAttribute("aria-hidden", "true");
    fade.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 9998;
      pointer-events: none;
      background: rgb(${paperRgb});
      opacity: 0;
      transition: opacity 320ms ease-out;
    `;
    document.body.appendChild(fade);
    requestAnimationFrame(() => {
      fade.style.opacity = "0.6";
    });
    window.setTimeout(() => {
      applyTheme(to);
      fade.style.opacity = "0";
      window.setTimeout(() => {
        fade.remove();
        delete document.body.dataset.themeBlasting;
      }, 280);
    }, 320);
  }
}

/**
 * Spawn the cinematic accents — sea-wave audio + three staggered ripple
 * rings + a soft accent glow. Drawn on top of the View Transition so
 * they read like the gentle disturbance on the water's surface as the
 * wave passes through.
 */
function spawnAccents({
  x,
  y,
  to,
}: {
  x: number;
  y: number;
  to: Theme;
}): void {
  const accentRgb = to === "dark" ? "245 130 80" : "232 93 45";
  const DUR = 1400;
  // Soft, organic easing — like water moving at terminal velocity then
  // gently settling. Not as snappy as the previous out-expo.
  const EASE = "cubic-bezier(0.32, 0.94, 0.40, 1)";

  const maxRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  // Play the sea-wave whoosh in sync with the visual.
  playSeaWave(to);

  // --- Three concentric ripples, staggered like spreading water -------
  const ripples = [
    { delay: 0, peakOpacity: 0.85, finalScale: maxRadius * 2 * 0.55 },
    { delay: 220, peakOpacity: 0.55, finalScale: maxRadius * 2 * 0.7 },
    { delay: 420, peakOpacity: 0.35, finalScale: maxRadius * 2 * 0.85 },
  ];

  const created: HTMLDivElement[] = [];

  ripples.forEach(({ delay, peakOpacity, finalScale }) => {
    const ring = document.createElement("div");
    ring.setAttribute("aria-hidden", "true");
    ring.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      z-index: 9999;
      pointer-events: none;
      width: 12px;
      height: 12px;
      margin: -6px 0 0 -6px;
      border-radius: 9999px;
      border: 1.5px solid rgb(${accentRgb} / ${peakOpacity});
      box-shadow: 0 0 24px rgb(${accentRgb} / ${peakOpacity * 0.5});
      transform: scale(1);
      opacity: 0;
      transition:
        transform ${DUR}ms ${EASE},
        opacity ${DUR}ms ease-out,
        border-width ${DUR}ms ${EASE};
      will-change: transform, opacity;
    `;
    document.body.appendChild(ring);
    created.push(ring);

    window.setTimeout(() => {
      // First make it visible at full opacity, then animate outward.
      ring.style.opacity = String(peakOpacity);
      requestAnimationFrame(() => {
        ring.style.transform = `scale(${finalScale / 12})`;
        ring.style.opacity = "0";
        ring.style.borderWidth = "0.3px";
      });
    }, delay);
  });

  // --- The soft accent glow at the click point ------------------------
  const glow = document.createElement("div");
  glow.setAttribute("aria-hidden", "true");
  glow.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    z-index: 9998;
    pointer-events: none;
    width: 120px;
    height: 120px;
    margin: -60px 0 0 -60px;
    border-radius: 9999px;
    background: radial-gradient(circle, rgb(${accentRgb} / 0.55) 0%, rgb(${accentRgb} / 0) 70%);
    transform: scale(0.4);
    opacity: 0;
    transition:
      transform 1100ms ${EASE},
      opacity 1100ms ease-out;
    will-change: transform, opacity;
  `;
  document.body.appendChild(glow);
  created.push(glow);

  requestAnimationFrame(() => {
    glow.style.opacity = "0.9";
    glow.style.transform = "scale(5)";
    // Fade the glow out after the wave has crested.
    window.setTimeout(() => {
      glow.style.opacity = "0";
    }, 380);
  });

  // Cleanup well after the last ripple has finished.
  window.setTimeout(() => {
    created.forEach((el) => el.remove());
  }, DUR + ripples[ripples.length - 1].delay + 50);
}
