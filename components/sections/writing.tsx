"use client";

import Link from "next/link";
import { m as motion } from "framer-motion";
import { SectionHeader } from "@/components/section-header";
import { getAllPosts } from "@/lib/posts";

export function Writing() {
  const posts = getAllPosts();
  // Show all posts on the homepage — currently 2-3 — sorted newest first
  // by getAllPosts(). A "See all writing" CTA always sends to /blog so the
  // pattern is consistent even as the list grows.
  const previewLimit = 3;
  const preview = posts.slice(0, previewLimit);
  const hasMore = posts.length > previewLimit;

  return (
    <section
      id="writing"
      className="relative pb-24 pt-16 sm:pb-32 sm:pt-24"
    >
      <div className="container-page">
        {/* Compact masthead */}
        <div className="mb-10 flex flex-col gap-3 border-b border-ink/15 pb-6 md:flex-row md:items-end md:justify-between">
          <p className="font-hand text-2xl text-ink/55">
            — the engineering journal
          </p>
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.2em] text-ink/50">
            <span>Vol. III</span>
            <span className="h-px w-8 bg-ink/30" />
            <span>Est. 2022</span>
            <span className="h-px w-8 bg-ink/30" />
            <span>
              {posts.length} {posts.length === 1 ? "essay" : "essays"}
            </span>
          </div>
        </div>

        <SectionHeader
          number="05"
          label="Writing"
          title={
            <>
              Things I&apos;ve learned the
              <span className="italic text-ink/55"> hard way.</span>
            </>
          }
          note="essays, notes, post-mortems."
        />

        {/* The list of writings — clean, scannable, list-first */}
        <div className="mt-14 md:mt-20">
          <ul className="divide-y divide-ink/10 border-y border-ink/12">
            {preview.map((p, i) => (
              <motion.li
                key={p.slug}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.04 * i,
                }}
              >
                <Link
                  href={`/blog/${p.slug}`}
                  data-cursor
                  data-cursor-label="Read"
                  className="group grid grid-cols-12 items-baseline gap-4 py-7 transition-colors sm:py-9"
                >
                  <span className="col-span-12 font-mono text-xs text-ink/40 sm:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="col-span-12 sm:col-span-7">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-display text-2xl leading-tight tracking-tight transition-colors group-hover:text-ink sm:text-3xl md:text-4xl">
                        {p.title}
                      </h3>
                      {i === 0 && (
                        <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-paper">
                          Latest
                        </span>
                      )}
                    </div>
                    <p className="mt-2.5 max-w-xl text-[15px] leading-relaxed text-ink/65">
                      {p.excerpt}
                    </p>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-ink/12 bg-paper/60 px-2.5 py-1 text-[11px] font-medium text-ink/70"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-6 flex items-center justify-end gap-3 text-xs text-ink/45 sm:col-span-1">
                    <span className="font-mono">{p.readTime}</span>
                    <span
                      aria-hidden
                      className="text-xl text-ink/40 transition-transform group-hover:translate-x-1 group-hover:text-ink"
                    >
                      ↗
                    </span>
                  </div>
                </Link>
              </motion.li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="font-hand text-2xl text-ink/55">
              written between deploys.
            </p>
            <Link
              href="/blog"
              data-cursor
              data-cursor-label="Open journal"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper transition-transform hover:-translate-y-0.5"
            >
              <span>
                {hasMore
                  ? `See all ${posts.length} posts`
                  : "Open the journal"}
              </span>
              <span
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
