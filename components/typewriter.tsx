"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface TypewriterProps {
  /** The full text to reveal. */
  text: string;
  /** ms delay before the first character starts blooming in. */
  startDelay?: number;
  /** Average ms between characters. Punctuation pauses extend this. */
  charDelay?: number;
  /** className applied to the outer span. */
  className?: string;
  /** Called once when the last character has finished its bloom. */
  onDone?: () => void;
}

/**
 * Natural-feeling per-character delay. Punctuation breathes; letters flow.
 * Deterministic (no Math.random) so SSR and client match — handwritten
 * cadence without hydration mismatch.
 */
function delayFor(char: string, base: number, jitter: number): number {
  switch (char) {
    case ".":
    case "!":
    case "?":
      return base * 9;
    case ",":
      return base * 4.5;
    case ";":
    case ":":
      return base * 5.5;
    case "\u2014": // em dash
    case "\u2013": // en dash
      return base * 6;
    case " ":
      return base * 0.85;
    default:
      // Slight per-character variation — feels handwritten, not metronomic.
      return base + jitter * 14 - 4;
  }
}

/**
 * Deterministic pseudo-random in [0, 1) for a given index — keeps SSR and
 * client renders identical while still giving every character its own
 * little rotation/translate quirk.
 */
function pseudo(i: number, salt: number): number {
  const x = Math.sin(i * 9301.13 + salt * 49297.7) * 233280;
  return x - Math.floor(x);
}

interface CharStyle {
  char: string;
  delayMs: number;
  rotDeg: number;
  txEm: number;
  tyEm: number;
}

function buildCharStyles(text: string, charDelay: number, startDelay: number): CharStyle[] {
  const styles: CharStyle[] = [];
  let t = startDelay;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const j1 = pseudo(i, 1);
    const j2 = pseudo(i, 2);
    const j3 = pseudo(i, 3);
    styles.push({
      char: ch,
      delayMs: Math.round(t),
      // Tiny per-letter jitter so the line doesn't look stamped.
      rotDeg: (j1 * 2 - 1) * 1.6, // ±1.6deg
      txEm: (j2 * 2 - 1) * 0.04, // ±0.04em
      tyEm: 0.18 + j3 * 0.18, // 0.18em → 0.36em settle distance
    });
    t += delayFor(ch, charDelay, j1);
  }
  return styles;
}

/**
 * Renders text as if it's being *written by hand* — each character blooms
 * into place with a soft blur, a tiny rotation, and a gentle settle. Reads
 * as ink appearing on paper rather than a mechanical typewriter.
 *
 * Layout space for the full string is reserved on first render, so the
 * surrounding page doesn't jump as characters arrive.
 *
 * Accessibility:
 *   - The full text is exposed to screen readers via a visually-hidden span.
 *   - The animating segment is aria-hidden so AT doesn't read partial words.
 *   - Honours prefers-reduced-motion (shows the full string immediately).
 */
export function Typewriter({
  text,
  startDelay = 0,
  charDelay = 26,
  className,
  onDone,
}: TypewriterProps) {
  const [reduce, setReduce] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  // Build deterministic per-char styles once per text — stable for SSR.
  const styles = useMemo(
    () => buildCharStyles(text, charDelay, startDelay),
    [text, charDelay, startDelay]
  );
  const lastDelay = styles.length ? styles[styles.length - 1].delayMs : 0;
  const totalMs = lastDelay + 620; // last char bloom completes after its delay + duration

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduce) {
      onDoneRef.current?.();
      return;
    }
    const t = setTimeout(() => onDoneRef.current?.(), totalMs);
    return () => clearTimeout(t);
  }, [totalMs, reduce]);

  if (reduce) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {/* Screen-reader friendly: the full text is always available. */}
      <span className="sr-only">{text}</span>
      <span aria-hidden className="ink-writer">
        {styles.map((s, i) => (
          <span
            key={i}
            className="ink-writer__char"
            style={
              {
                animationDelay: `${s.delayMs}ms`,
                ["--ink-rot" as string]: `${s.rotDeg.toFixed(2)}deg`,
                ["--ink-tx" as string]: `${s.txEm.toFixed(3)}em`,
                ["--ink-ty" as string]: `${s.tyEm.toFixed(3)}em`,
              } as React.CSSProperties
            }
          >
            {s.char === " " ? "\u00A0" : s.char}
          </span>
        ))}
      </span>
    </span>
  );
}
