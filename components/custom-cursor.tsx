"use client";

import { useEffect, useState } from "react";
import { m as motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [hideRing, setHideRing] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(true);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 380, mass: 0.4 };
  const dotX = useSpring(x, { damping: 50, stiffness: 1000, mass: 0.2 });
  const dotY = useSpring(y, { damping: 50, stiffness: 1000, mass: 0.2 });
  const ringX = useSpring(x, springConfig);
  const ringY = useSpring(y, springConfig);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) {
      setEnabled(false);
      return;
    }

    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest(
        "a, button, [role='button'], [data-cursor]"
      ) as HTMLElement | null;
      if (interactive) {
        // Elements (e.g. nav links) can opt out of the enlarged blurred ring,
        // which would otherwise obscure small text on hover.
        const ignore = !!interactive.closest("[data-cursor-ignore]");
        if (ignore) {
          setHideRing(true);
          setIsPointer(false);
          setLabel(null);
        } else {
          setHideRing(false);
          setIsPointer(true);
          setLabel(interactive.getAttribute("data-cursor-label"));
        }
      } else {
        setHideRing(false);
        setIsPointer(false);
        setLabel(null);
      }
    };

    const handleLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block"
        style={{ x: dotX, y: dotY }}
      >
        <div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-ink"
          style={{
            width: isPointer ? 6 : 5,
            height: isPointer ? 6 : 5,
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.2s, width 0.25s, height 0.25s",
          }}
        />
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block"
        style={{ x: ringX, y: ringY }}
      >
        <div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-ink/40 backdrop-blur-[1px]"
          style={{
            width: isPointer ? 56 : 32,
            height: isPointer ? 56 : 32,
            opacity: isVisible && !hideRing ? (isPointer ? 1 : 0.6) : 0,
            transition: "width 0.35s cubic-bezier(0.16,1,0.3,1), height 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.25s",
            backgroundColor: isPointer ? "rgb(var(--ink) / 0.04)" : "transparent",
          }}
        >
          {label && (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.15em] text-ink/80">
              {label}
            </span>
          )}
        </div>
      </motion.div>
    </>
  );
}
