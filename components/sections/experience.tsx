"use client";

import { m as motion } from "framer-motion";
import { experience } from "@/lib/data";
import { SectionHeader } from "@/components/section-header";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Experience() {
  const [active, setActive] = useState(0);

  return (
    <section
      id="experience"
      className="relative bg-paper-warm/40 pb-24 pt-16 sm:pb-32 sm:pt-24"
    >
      <div className="container-page">
        <SectionHeader
          number="02"
          label="Experience"
          title={
            <>
              A timeline of products
              <span className="italic text-ink/55"> I&apos;ve shipped.</span>
            </>
          }
          note="four companies, one consistent thread."
        />

        <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-12">
          {/* Company list */}
          <div className="md:col-span-4">
            <ul role="tablist" className="flex flex-col gap-1.5">
              {experience.map((exp, i) => {
                const isActive = active === i;
                return (
                  <motion.li
                    key={exp.company}
                    initial={{ opacity: 0, x: -28 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{
                      duration: 0.7,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.08 * i,
                    }}
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActive(i)}
                      data-cursor
                      className={cn(
                        "group relative w-full overflow-hidden rounded-2xl border px-5 py-4 text-left transition-all duration-500",
                        isActive
                          ? "border-ink bg-ink text-paper"
                          : "border-ink/10 bg-paper/60 hover:border-ink/25"
                      )}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <div
                            className={cn(
                              "text-xs uppercase tracking-[0.18em]",
                              isActive ? "text-paper/60" : "text-ink/45"
                            )}
                          >
                            {exp.period}
                          </div>
                          <div className="mt-1 truncate font-display text-2xl leading-tight tracking-tight">
                            {exp.company}
                          </div>
                          <div
                            className={cn(
                              "mt-0.5 truncate text-sm",
                              isActive ? "text-paper/70" : "text-ink/60"
                            )}
                          >
                            {exp.role}
                          </div>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 text-2xl transition-transform duration-500",
                            isActive ? "translate-x-0 text-paper" : "-translate-x-2 text-ink/30 group-hover:translate-x-0"
                          )}
                        >
                          →
                        </span>
                      </div>
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          {/* Detail card */}
          <div className="md:col-span-8">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden rounded-3xl border border-ink/10 bg-paper p-6 sm:p-10"
            >
              {/* corner ticks */}
              <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/30">
                Role · {String(active + 1).padStart(2, "0")} / {String(experience.length).padStart(2, "0")}
              </span>
              <span className="absolute right-4 top-4 font-hand text-lg text-ink/40">
                chapter {active + 1}
              </span>

              <div className="mt-6 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">
                    {experience[active].company}
                  </h3>
                  <p className="mt-2 text-base text-ink/65">
                    {experience[active].role}
                  </p>
                </div>
                <div className="text-sm text-ink/55 sm:text-right">
                  <div>{experience[active].location}</div>
                  <div className="font-mono text-xs uppercase tracking-[0.18em] text-ink/40">
                    {experience[active].period}
                  </div>
                </div>
              </div>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/80">
                {experience[active].summary}
              </p>

              <ul className="mt-8 space-y-3">
                {experience[active].highlights.map((h, i) => (
                  <motion.li
                    key={h}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.05 * i,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex gap-3 text-[15px] leading-relaxed text-ink/75"
                  >
                    <span className="mt-2 inline-block h-[3px] w-3 shrink-0 bg-ink/40" />
                    <span>{h}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-2">
                {experience[active].stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-ink/15 bg-paper-warm px-3 py-1 text-[12px] font-medium text-ink/75"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
