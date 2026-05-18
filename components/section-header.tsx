"use client";

import { m as motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  number: string;
  label: string;
  title: React.ReactNode;
  note?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  number,
  label,
  title,
  note,
  align = "left",
  className,
}: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Scroll-bound parallax — the eyebrow and note drift gently as the
  // section enters and leaves the viewport, giving every section a sense
  // of motion when you scroll past it.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const eyebrowX = useTransform(scrollYProgress, [0, 1], [-12, 12]);
  const noteY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-6",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ x: eyebrowX }}
        className="flex items-center gap-3"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/40">
          {number}
        </span>
        <span className="h-px w-8 bg-ink/30" />
        <span className="text-xs font-medium uppercase tracking-[0.22em] text-ink/70">
          {label}
        </span>
      </motion.div>

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-12">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          className="text-balance font-display text-display-lg"
        >
          {title}
        </motion.h2>
        {note && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            style={{ y: noteY }}
            className="max-w-md font-hand text-2xl leading-tight text-ink/60"
          >
            {note}
          </motion.p>
        )}
      </div>
    </div>
  );
}
