"use client";

import { m as motion } from "framer-motion";
import { personal } from "@/lib/data";
import { SectionHeader } from "@/components/section-header";

const principles = [
  {
    n: "01",
    title: "Own the feature, end to end",
    body: "Most teams I join are small. I take a problem from product brief to production — AI, frontend, backend, infra, the boring auth flow, the messy webhook. I prefer fewer hand-offs and more shipping.",
  },
  {
    n: "02",
    title: "Zero to one, on purpose",
    body: "0→1 is what I love. Blank page, real users, real constraints, real deadlines. I've co-founded two products and built five from a Figma file to a deploy URL.",
  },
  {
    n: "03",
    title: "Have fun with the hard part",
    body: "Streaming, agents, race conditions, weird Stripe edge cases, that one webhook that drops on Tuesdays. The complex stuff is the fun stuff. I look for it on purpose.",
  },
  {
    n: "04",
    title: "Leave the codebase warmer",
    body: "Types, contracts, honest comments, small refactors as you pass through. Tools you'd hand to a friend on day one. The next engineer matters as much as today's PR.",
  },
];

export function About() {
  return (
    <section
      id="about"
      className="relative pb-24 pt-16 sm:pb-32 sm:pt-24"
    >
      <div className="container-page">
        <SectionHeader
          number="01"
          label="About"
          title={
            <>
              AI, frontend, backend &mdash;
              <span className="italic text-ink/55"> shipped by one person,</span>
              not a committee.
            </>
          }
          note="0→1, end-to-end, mostly caffeinated."
        />

        <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12 md:gap-16">
          {/* Long-form bio */}
          <div className="md:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 text-balance text-lg leading-[1.7] text-ink/80"
            >
              <p className="text-2xl leading-snug text-ink">
                {personal.longBio}
              </p>
              <p>
                Today I spend most of my time on AI systems &mdash; agent
                runtimes, Model Context Protocol (MCP) servers, RAG pipelines,
                LangChain / LangGraph orchestration, and the streaming UIs
                that turn LLMs from impressive demos into tools people actually
                use. The frontend and backend stay sharp: modern React,
                Next.js, TypeScript, Node, Postgres, the boring fundamentals
                done well.
              </p>
              <p>
                I&apos;ve <span className="font-medium text-ink">co-founded
                two SaaS products</span> &mdash;{" "}
                <span className="font-medium text-ink">Rivaly</span> (AI
                competitive intelligence) and{" "}
                <span className="font-medium text-ink">Onramp</span> (OSS
                issue discovery in under ten seconds, with a talent surface
                for recruiters). Both are in active development. Earlier I
                shipped a VS Code extension with an embedded MCP server that
                crossed{" "}
                <span className="font-medium text-ink">2,200+ downloads</span>,
                contributed fixes to{" "}
                <span className="font-medium text-ink">Cal.com</span>, and led
                migrations, billing systems and auth flows as a solo engineer
                at multiple early-stage startups.
              </p>

              {/* Signature */}
              <div className="pt-6">
                <p className="font-hand text-3xl leading-none text-ink/85">
                  — Rushikesh
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-ink/40">
                  AI Software Engineer · {personal.location.split("·")[0].trim()}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Principles */}
          <div className="md:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl border border-ink/10 bg-paper-warm p-6 sm:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.2em] text-ink/45">
                  Working principles
                </span>
                <span className="font-hand text-lg text-ink/55">notes to self</span>
              </div>

              <ul className="mt-6 space-y-6">
                {principles.map((p, i) => (
                  <motion.li
                    key={p.n}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      duration: 0.7,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.05 * i,
                    }}
                    className="group relative"
                  >
                    <div className="flex items-start gap-4">
                      <span className="mt-1 font-mono text-[11px] text-ink/40">
                        {p.n}
                      </span>
                      <div className="flex-1">
                        <h3 className="font-display text-2xl leading-tight tracking-tight">
                          {p.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-ink/65">
                          {p.body}
                        </p>
                      </div>
                    </div>
                    {i < principles.length - 1 && (
                      <div className="mt-6 h-px w-full bg-ink/8" />
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
