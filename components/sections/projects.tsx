"use client";

import { m as motion } from "framer-motion";
import { projects } from "@/lib/data";
import { SectionHeader } from "@/components/section-header";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Projects() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      id="projects"
      className="relative pb-24 pt-16 sm:pb-32 sm:pt-24"
    >
      <div className="container-page">
        <SectionHeader
          number="03"
          label="Selected work"
          title={
            <>
              Things I&apos;ve helped
              <span className="italic text-ink/55"> put into the world.</span>
            </>
          }
          note="a small list, deliberately."
        />

        <div className="mt-16 md:mt-24">
          <div
            className="relative divide-y divide-ink/12 border-y border-ink/12"
            onMouseLeave={() => setHovered(null)}
          >
            {projects.map((p, i) => (
              <motion.a
                key={p.name}
                href={p.href}
                target={p.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                data-cursor
                data-cursor-label={p.href === "#" ? "Soon" : "View"}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.04 * i,
                }}
                onMouseEnter={() => setHovered(i)}
                className="group relative grid grid-cols-12 items-baseline gap-4 py-7 transition-colors sm:py-9"
              >
                {/* subtle highlight on hover */}
                <span
                  className={cn(
                    "absolute inset-x-0 inset-y-1 -z-10 origin-left scale-x-0 rounded-2xl bg-paper-warm transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    hovered === i && "scale-x-100"
                  )}
                />

                <div className="col-span-12 flex items-center gap-4 sm:col-span-1">
                  <span className="font-mono text-xs text-ink/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="col-span-12 sm:col-span-6">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <h3 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl md:text-5xl">
                      {p.name}
                    </h3>
                    <span className="text-xs uppercase tracking-[0.18em] text-ink/45">
                      {p.tag}
                    </span>
                    {p.inProgress && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-accent-ink">
                        <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-accent">
                          <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />
                        </span>
                        in progress
                      </span>
                    )}
                    {p.featured && !p.inProgress && (
                      <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-accent-ink">
                        featured
                      </span>
                    )}
                  </div>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/65 sm:text-[15px]">
                    {p.description}
                  </p>
                  {p.meta && (
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink/40">
                      {p.meta}
                    </p>
                  )}
                </div>

                <div className="col-span-12 sm:col-span-4">
                  <div className="flex flex-wrap gap-1.5">
                    {p.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-ink/12 bg-paper/60 px-2.5 py-1 text-[11px] font-medium text-ink/70"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="col-span-12 flex items-center justify-between sm:col-span-1 sm:justify-end">
                  <span className="text-xs text-ink/45">{p.year}</span>
                  <span
                    className={cn(
                      "ml-3 text-xl text-ink/45 transition-all duration-500",
                      hovered === i ? "translate-x-1 text-ink opacity-100" : "opacity-60"
                    )}
                    aria-hidden
                  >
                    ↗
                  </span>
                </div>

                {/* type label */}
                <div className="col-span-12 -mt-2 text-[11px] uppercase tracking-[0.2em] text-ink/40 sm:col-span-11 sm:col-start-2 sm:mt-0">
                  {p.type}
                </div>
              </motion.a>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="font-hand text-2xl text-ink/55">
              psst — more lives quietly on GitHub.
            </p>
            <a
              href="https://github.com/rushikeshgandhmal"
              target="_blank"
              rel="noreferrer"
              data-cursor
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Browse GitHub <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
