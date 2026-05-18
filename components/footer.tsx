"use client";

import { personal } from "@/lib/data";
import { m as motion } from "framer-motion";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-ink/10 bg-paper">
      <div className="container-page py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="font-hand text-2xl text-ink/60">— end of page</p>
            <h2 className="mt-3 text-balance font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
              Let&apos;s build something
              <span className="italic text-ink/60"> worth shipping.</span>
            </h2>
            <a
              href={`mailto:${personal.email}`}
              data-cursor
              data-cursor-label="Email"
              className="mt-8 inline-flex items-center gap-3 text-lg font-medium text-ink hover-underline"
            >
              {personal.email}
              <span aria-hidden>↗</span>
            </a>
          </div>

          <div className="md:col-span-5">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-ink/40">
                  Elsewhere
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {Object.values(personal.social).map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        data-cursor
                        className="text-sm text-ink/80 hover-underline"
                      >
                        {s.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-ink/40">
                  Local
                </h3>
                <ul className="mt-4 space-y-2.5 text-sm text-ink/70">
                  <li>{personal.location}</li>
                  <li>UTC +5:30 · IST</li>
                  <li>{personal.phone}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 h-px origin-left bg-ink/15"
        />

        <div className="mt-6 flex flex-col items-start justify-between gap-3 text-xs text-ink/50 sm:flex-row sm:items-center">
          <p>
            © {year} {personal.name}. Crafted with care in Pune.
          </p>
          <p className="font-mono">
            Built with Next.js · Tailwind · Framer Motion · ☕
          </p>
        </div>
      </div>

      {/* Big bottom wordmark */}
      <div
        aria-hidden
        className="container-page select-none pb-6"
      >
        <p className="font-display text-[clamp(4rem,18vw,18rem)] leading-[0.85] tracking-[-0.04em] text-ink/[0.08]">
          Rushikesh.
        </p>
      </div>
    </footer>
  );
}
