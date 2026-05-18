import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { BackgroundPaths } from "@/components/background-paths";

export const metadata: Metadata = {
  title: "Writing — Rushikesh Gandhmal",
  description:
    "Field notes and deep dives on AI systems, real-time interfaces, and shipping software end-to-end.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="relative isolate">
      {/* Ambient flowing paths — gives the blog page a calm, alive backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <BackgroundPaths intensity="ambient" />
      </div>

      {/* Compact masthead — light, doesn't dominate the viewport so the list
          is visible without scrolling on most screens. */}
      <section className="pt-32 sm:pt-36">
        <div className="container-page">
          <Link
            href="/#home"
            data-cursor
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-ink/55 hover-underline"
          >
            ← Back to portfolio
          </Link>

          <div className="mt-8 flex flex-col gap-3 border-b border-ink/15 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-hand text-2xl text-ink/55">
                — the engineering journal
              </p>
              <h1 className="mt-1 font-display text-display-lg leading-[0.98] tracking-tight">
                All writing.
                <span className="italic text-ink/55">
                  {" "}
                  {posts.length} {posts.length === 1 ? "essay" : "essays"}.
                </span>
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-ink/55">
              <span>Vol. III</span>
              <span className="h-px w-8 bg-ink/30" />
              <span>Est. 2022</span>
              <span className="h-px w-8 bg-ink/30" />
              <span>updated {posts[0]?.date ?? "—"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* The actual list — every post is equal weight, in reverse-chronological
          order. Editorial, scannable, scroll-friendly. */}
      <section className="pt-10 pb-24 sm:pt-14 sm:pb-32">
        <div className="container-page">
          <ul className="divide-y divide-ink/10 border-y border-ink/12">
            {posts.map((p, i) => (
              <li key={p.slug}>
                <Link
                  href={`/blog/${p.slug}`}
                  data-cursor
                  data-cursor-label="Read"
                  className="group grid grid-cols-12 items-baseline gap-4 py-8 transition-colors sm:py-10"
                >
                  <span className="col-span-12 font-mono text-xs text-ink/40 sm:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="col-span-12 sm:col-span-7">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h2 className="font-display text-2xl leading-tight tracking-tight transition-colors sm:text-3xl md:text-4xl">
                        {p.title}
                      </h2>
                      {i === 0 && (
                        <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-paper">
                          Latest
                        </span>
                      )}
                    </div>
                    <p className="mt-2.5 max-w-xl text-[15px] leading-relaxed text-ink/65">
                      {p.excerpt}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.18em] text-ink/45">
                      <span>{p.date}</span>
                      <span className="h-px w-4 bg-ink/25" />
                      <span>{p.readTime}</span>
                      <span className="h-px w-4 bg-ink/25" />
                      <span>{p.issue}</span>
                    </div>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-ink/12 bg-paper/60 px-2.5 py-1 text-[11px] font-medium text-ink/70"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-6 flex items-center justify-end gap-3 text-sm text-ink/45 sm:col-span-1">
                    <span
                      aria-hidden
                      className="text-2xl text-ink/40 transition-transform group-hover:translate-x-1 group-hover:text-ink"
                    >
                      ↗
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-14 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="font-hand text-2xl text-ink/55">
              that&apos;s all of it — for now.
            </p>
            <Link
              href="/#contact"
              data-cursor
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Suggest a topic <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
