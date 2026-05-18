"use client";

import { m as motion } from "framer-motion";
import { skills, marqueeStack } from "@/lib/data";
import { SectionHeader } from "@/components/section-header";

export function Skills() {
  const groups = Object.entries(skills);

  return (
    <section
      id="skills"
      className="relative bg-paper-warm/40 pb-24 pt-16 sm:pb-32 sm:pt-24"
    >
      <div className="container-page">
        <SectionHeader
          number="04"
          label="Toolkit"
          title={
            <>
              The tools I reach for
              <span className="italic text-ink/55"> on Monday morning.</span>
            </>
          }
          note="a toolkit, not a religion."
        />

        <div className="mt-16 md:mt-24">
          <div className="grid gap-px overflow-hidden rounded-3xl border border-ink/12 bg-ink/12 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map(([group, items], i) => {
              const isAI = group === "AI / GenAI";
              return (
                <motion.div
                  key={group}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.04 * i,
                  }}
                  className={`group relative bg-paper p-6 transition-colors hover:bg-paper-warm sm:p-8 ${
                    isAI ? "sm:col-span-2 lg:col-span-2" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-ink/45">
                      <span>
                        {String(i + 1).padStart(2, "0")} — {group}
                      </span>
                      {isAI && (
                        <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[9.5px] tracking-[0.16em] text-accent-ink">
                          primary focus
                        </span>
                      )}
                    </span>
                    <span className="font-hand text-base text-ink/40">
                      {items.length}
                    </span>
                  </div>
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {items.map((item) => (
                      <li
                        key={item}
                        className={`rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                          isAI
                            ? "border-ink/15 bg-ink text-paper"
                            : "border-ink/12 bg-paper text-ink/80 group-hover:border-ink/25"
                        }`}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom marquee */}
          <div className="mt-12 overflow-hidden">
            <div className="mask-fade-x">
              <div className="marquee-track items-center gap-10 whitespace-nowrap">
                {[...marqueeStack, ...marqueeStack].map((t, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-4 font-display text-5xl italic leading-none tracking-tight text-ink/15 sm:text-6xl"
                  >
                    {t.label}
                    <span
                      aria-hidden
                      className="inline-block h-3 w-3 rounded-full not-italic"
                      style={{ backgroundColor: t.color, opacity: 0.4 }}
                    />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
