"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import { ReactNode } from "react";

/**
 * Wraps the app in LazyMotion so we can use lightweight <m.*> primitives
 * instead of <motion.*>. Cuts framer-motion's framework footprint from
 * ~34kB gzipped to ~6kB by tree-shaking gesture / drag / layout features.
 *
 * `domAnimation` includes: animations, variants, exit, keyframes,
 * hover/tap/focus gestures. That covers everything used in this app.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      {children}
    </LazyMotion>
  );
}
