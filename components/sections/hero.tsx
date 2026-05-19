"use client";

import { m as motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { personal, marqueeStack, stats } from "@/lib/data";
import { Typewriter } from "@/components/typewriter";

// Three.js is heavy & client-only — load lazily, no SSR.
const GenerativeArtScene = dynamic(
  () => import("@/components/generative-art-scene").then((m) => m.GenerativeArtScene),
  { ssr: false }
);

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Subtle parallax only — no opacity fade so content below stays crisp.
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const wordsLine1 = ["AI", "Software", "Engineer"];
  const wordsLine2 = ["shipping", "0\u21921,", "end-to-end."];

  return (
    <section
      id="home"
      ref={ref}
      className="relative isolate min-h-[100svh] overflow-hidden pt-32 sm:pt-40"
    >
      {/* Background — generative art + pencil grid + soft accent */}
      <motion.div
        aria-hidden
        style={{ scale: bgScale }}
        className="absolute inset-0 -z-10"
      >
        {/* Three.js morphing wireframe — sits as the calm focal point */}
        <div
          className="absolute inset-0"
          style={{
            maskImage:
              "radial-gradient(ellipse at 70% 35%, black 0%, black 35%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 70% 35%, black 0%, black 35%, transparent 75%)",
          }}
        >
          <GenerativeArtScene />
        </div>

        {/* Faint pencil grid */}
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(var(--ink) / 0.5) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--ink) / 0.5) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse at 30% 30%, black 20%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 30% 30%, black 20%, transparent 70%)",
          }}
        />
        <div className="absolute -top-32 left-1/4 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[420px] w-[420px] rounded-full bg-sage/10 blur-[120px]" />

        {/* Soft top-down fade so the text never fights the 3D scene */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgb(var(--paper) / 0) 0%, rgb(var(--paper) / 0) 55%, rgb(var(--paper) / 0.85) 100%)",
          }}
        />
      </motion.div>

      <div className="container-page">
        <motion.div style={{ y: titleY }}>
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
            className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.2em] text-ink/60"
          >
            <span className="flex items-center gap-2">
              <span className="ticker-blip" /> Open · mid&ndash;senior roles
            </span>
            <span className="h-px w-6 bg-ink/30" />
            <span>Any timezone</span>
            <span className="h-px w-6 bg-ink/30" />
            <span>AI &middot; Frontend &middot; Backend</span>
          </motion.div>

          {/* Handwritten greeting — sits above the title, breaks the
              formality, makes it feel like a person wrote the page. */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.35 }}
            className="mt-8 font-hand text-3xl leading-none text-ink/65 sm:text-4xl"
          >
            &mdash; hey, I&apos;m {personal.firstName}.
          </motion.p>

          {/* Title */}
          <h1 className="mt-5 font-display tracking-tight text-display-2xl">
            <span className="block overflow-hidden">
              <span className="block">
                {wordsLine1.map((w, i) => (
                  <motion.span
                    key={w}
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 1.1,
                      ease: EASE,
                      delay: 0.65 + i * 0.08,
                    }}
                    className="mr-[0.18em] inline-block"
                  >
                    {w}
                  </motion.span>
                ))}
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="block italic text-ink/80">
                {wordsLine2.map((w, i) => (
                  <motion.span
                    key={w}
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 1.1,
                      ease: EASE,
                      delay: 0.9 + i * 0.08,
                    }}
                    className="mr-[0.18em] inline-block"
                  >
                    {w}
                  </motion.span>
                ))}
              </span>
            </span>
          </h1>

          {/* Lower row */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 1.35 }}
            className="mt-14 grid gap-10 md:grid-cols-12 md:items-end"
          >
            <div className="md:col-span-7">
              {/* Summary is hand-written into place, character by character,
                  with a soft ink bloom on each letter. startDelay accounts
                  for the parent's fade-up settling. */}
              <Typewriter
                text={personal.summary}
                startDelay={1700}
                charDelay={18}
                className="block max-w-xl text-balance text-lg leading-relaxed text-ink/75"
              />
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#projects"
                  data-cursor
                  data-cursor-label="See work"
                  className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper transition-transform hover:-translate-y-0.5"
                >
                  <span>See selected work</span>
                  <span
                    aria-hidden
                    className="inline-block transition-transform group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </a>
                <a
                  href={`mailto:${personal.email}`}
                  data-cursor
                  className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper/50 px-5 py-3 text-sm font-medium text-ink backdrop-blur transition-colors hover:bg-ink hover:text-paper"
                >
                  Start a project
                </a>
              </div>
            </div>

            <div className="md:col-span-5">
              <ul className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-ink/15 pt-6 sm:grid-cols-4 md:grid-cols-2 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                {stats.map((s, i) => (
                  <motion.li
                    key={s.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.7,
                      ease: EASE,
                      delay: 1.5 + i * 0.08,
                    }}
                  >
                    <div className="font-display text-3xl leading-none tracking-tight">
                      {s.value}
                    </div>
                    <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-ink/50">
                      {s.label}
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Marquee tech stack — colored brand dots, AI-first */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="relative mt-20 border-y border-ink/10 bg-paper/40 py-5 backdrop-blur-sm"
      >
        <div className="mask-fade-x overflow-hidden">
          <div className="marquee-track items-center gap-10 whitespace-nowrap">
            {[...marqueeStack, ...marqueeStack, ...marqueeStack].map(
              (item, i) => (
                <span
                  key={i}
                  className="inline-flex shrink-0 items-center gap-3 text-sm font-medium tracking-tight text-ink/80"
                >
                  <span
                    aria-hidden
                    className="inline-block h-2 w-2 rounded-full ring-1 ring-ink/10"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="leading-none">{item.label}</span>
                  <span aria-hidden className="font-display leading-none italic text-ink/25">/</span>
                </span>
              )
            )}
          </div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
        className="container-page mt-10 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-ink/40 sm:mt-12"
      >
        <span>↓ Scroll to read</span>
        <span className="font-hand text-base tracking-normal normal-case text-ink/45">
          AI &middot; from prompt to production
        </span>
      </motion.div>
    </section>
  );
}
