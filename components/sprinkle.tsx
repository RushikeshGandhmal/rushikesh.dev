"use client";

import { m as motion } from "framer-motion";
import { useMemo } from "react";

interface SprinkleProps {
  /** Brand color the droplets are tinted with. */
  color: string;
  /** Number of droplets to render. Default 14. */
  count?: number;
  className?: string;
}

/**
 * Sprinkle
 * Renders a flock of small colored droplets that drift, fade and ripple when
 * its `.group` parent is hovered. Pure transform/opacity animation, GPU-light.
 * Position and timing are seeded once per mount so each card has its own
 * "personality" of sprinkle pattern.
 */
export function Sprinkle({ color, count = 14, className }: SprinkleProps) {
  const drops = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        // Deterministic-enough pseudo-random distribution
        left: 8 + (((i * 37) % 88) + (i * 11) % 6),
        top: 10 + (((i * 53) % 78) + (i * 17) % 5),
        size: 3 + ((i * 7) % 5),
        delay: (i % 6) * 0.06,
        duration: 0.9 + ((i * 13) % 7) * 0.08,
        rise: 8 + ((i * 5) % 12),
      })),
    [count]
  );

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${
        className ?? ""
      }`}
    >
      {drops.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            background: color,
            boxShadow: `0 0 ${d.size * 2}px ${color}`,
          }}
          initial={{ opacity: 0, scale: 0, y: 0 }}
          // `whileHover` on the group parent drives the animation via
          // variants — but here we use group-hover via CSS by tying motion
          // animations to a CSS-controlled `data-hover` attribute would be
          // overkill, so we use the variants pattern with `viewport={null}`.
          // We achieve the hover trigger by relying on framer-motion's
          // built-in `whileHover` on the parent .group — see Contact card.
          variants={{
            rest: { opacity: 0, scale: 0, y: 0 },
            hover: {
              opacity: [0, 0.85, 0],
              scale: [0, 1, 0.4],
              y: [0, -d.rise],
              transition: {
                duration: d.duration,
                delay: d.delay,
                ease: "easeOut",
                repeat: Infinity,
                repeatDelay: 0.25 + (d.id % 4) * 0.1,
              },
            },
          }}
        />
      ))}
    </div>
  );
}
