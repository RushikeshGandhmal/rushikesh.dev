"use client";

import { m as motion } from "framer-motion";

/**
 * BackgroundPaths
 * A calm, minimalistic SVG-paths ambient background. Two layered flocks of
 * lines drift in opposite directions, their `pathLength` and `pathOffset`
 * looping slowly. Uses `currentColor` so the parent's text color drives the
 * stroke \u2014 making it instantly theme-aware via our CSS variable system.
 *
 * Designed to sit behind content as `aria-hidden`, pointer-events-none.
 * Honours prefers-reduced-motion (renders static, no animation loop).
 */
function PathFlock({
  position,
  count = 28,
  baseDuration = 24,
}: {
  position: number;
  count?: number;
  baseDuration?: number;
}) {
  const paths = Array.from({ length: count }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${
      189 + i * 6
    } -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${
      343 - i * 6
    }C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${
      875 - i * 6
    } ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <svg
      className="absolute inset-0 h-full w-full text-ink"
      viewBox="0 0 696 316"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <title>Background paths</title>
      {paths.map((path) => (
        <motion.path
          key={path.id}
          d={path.d}
          stroke="currentColor"
          strokeWidth={path.width}
          strokeOpacity={0.08 + path.id * 0.018}
          initial={{ pathLength: 0.35, opacity: 0.55, pathOffset: 0 }}
          animate={{
            pathLength: 1,
            opacity: [0.25, 0.55, 0.25],
            pathOffset: [0, 1, 0],
          }}
          transition={{
            duration: baseDuration + (path.id % 5) * 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </svg>
  );
}

interface BackgroundPathsProps {
  /** Lower for use as a subtle ambient layer, higher for a hero treatment. */
  intensity?: "ambient" | "subtle" | "vivid";
  /** Where the layer sits in stacking order. Defaults to behind everything. */
  className?: string;
}

export function BackgroundPaths({
  intensity = "ambient",
  className,
}: BackgroundPathsProps) {
  const opacity =
    intensity === "vivid" ? 1 : intensity === "subtle" ? 0.55 : 0.32;
  const count = intensity === "vivid" ? 32 : intensity === "subtle" ? 26 : 22;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${
        className ?? ""
      }`}
      style={{ opacity }}
    >
      <PathFlock position={1} count={count} />
      <PathFlock position={-1} count={count} baseDuration={28} />
    </div>
  );
}
