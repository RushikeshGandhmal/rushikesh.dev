import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { PostRenderer } from "@/components/post-renderer";
import { BackgroundPaths } from "@/components/background-paths";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Not found" };
  return {
    title: `${post.title} — Rushikesh Gandhmal`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
    },
  };
}

export default function PostPage({ params }: PageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  // Show all other posts at the bottom — not just 2 — so readers can always
  // see the full list without having to bounce back to /blog.
  const others = getAllPosts().filter((p) => p.slug !== post.slug);

  return (
    <article className="relative isolate">
      {/* Calm flowing-paths background for the reading view */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <BackgroundPaths intensity="ambient" />
      </div>

      {/* Hero / masthead — slimmer than before so the article body starts
          near the fold and scrolling feels natural. */}
      <header className="pt-28 sm:pt-32">
        <div className="container-page">
          <div className="flex items-center justify-between">
            <Link
              href="/blog"
              data-cursor
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-ink/55 hover-underline"
            >
              ← All writing
            </Link>
            <span className="text-[11px] uppercase tracking-[0.2em] text-ink/45">
              {post.issue} · {post.date}
            </span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-ink/55">
            {post.tags.map((t, i) => (
              <span key={t} className="flex items-center gap-2">
                {i > 0 && <span className="h-px w-4 bg-ink/25" />}
                <span>{t}</span>
              </span>
            ))}
          </div>

          <h1 className="mt-5 max-w-5xl text-balance font-display text-display-md leading-[1.04] tracking-tight sm:text-display-lg">
            {post.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-ink/60">
            <span className="flex items-center gap-2">
              <span className="ticker-blip" />
              <span className="uppercase tracking-[0.18em]">Rushikesh Gandhmal</span>
            </span>
            <span className="h-px w-6 bg-ink/25" />
            <span>{post.readTime}</span>
            <span className="h-px w-6 bg-ink/25" />
            <span className="font-hand text-lg text-ink/55">a slow read</span>
          </div>

          {/* Cover — shorter ratio so it doesn't push the body too far. */}
          <div
            className="mt-10 aspect-[16/6] w-full overflow-hidden rounded-3xl border border-ink/12 bg-ink sm:aspect-[16/5]"
            style={{
              backgroundImage: post.cover
                ? `radial-gradient(circle at 20% 30%, ${post.cover.from}99, transparent 55%), radial-gradient(circle at 80% 80%, ${post.cover.to}, ${post.cover.to})`
                : undefined,
            }}
          >
            <div
              aria-hidden
              className="h-full w-full opacity-25"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
          </div>
        </div>
      </header>

      {/* Body */}
      <section className="py-16 sm:py-24">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-12">
            <aside className="hidden lg:col-span-2 lg:block">
              <div className="sticky top-32 space-y-2 text-[11px] uppercase tracking-[0.18em] text-ink/45">
                <p>Essay</p>
                <p className="font-mono text-ink/40">{post.issue}</p>
                <p className="font-hand text-base normal-case tracking-normal text-ink/55">
                  read slow.
                </p>
              </div>
            </aside>

            <div className="lg:col-span-8 lg:col-start-3">
              <PostRenderer blocks={post.content} />

              {/* End marker */}
              <div className="mt-16 flex items-center justify-between border-t border-ink/12 pt-6 text-sm text-ink/55">
                <span className="font-hand text-2xl text-ink/65">— rushikesh</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em]">
                  end · {post.dateISO}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All other writing — full list, not just 2 related — so a reader
          who reaches the end of one post sees every other post they could
          open next. */}
      {others.length > 0 && (
        <section className="border-t border-ink/10 bg-paper-warm/40 py-20 sm:py-24">
          <div className="container-page">
            <div className="mb-8 flex flex-col gap-2 border-b border-ink/12 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-hand text-2xl text-ink/55">— keep reading</p>
                <h2 className="mt-1 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
                  More from the journal.
                </h2>
              </div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-ink/50">
                {others.length} {others.length === 1 ? "essay" : "essays"} ·
                pick one
              </span>
            </div>

            <ul className="divide-y divide-ink/10 border-y border-ink/12">
              {others.map((r, i) => (
                <li key={r.slug}>
                  <Link
                    href={`/blog/${r.slug}`}
                    data-cursor
                    data-cursor-label="Read"
                    className="group grid grid-cols-12 items-baseline gap-4 py-6 transition-colors sm:py-7"
                  >
                    <span className="col-span-12 font-mono text-xs text-ink/40 sm:col-span-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="col-span-12 sm:col-span-7">
                      <h3 className="font-display text-xl leading-tight tracking-tight transition-colors sm:text-2xl md:text-3xl">
                        {r.title}
                      </h3>
                      <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-ink/65 sm:text-[15px]">
                        {r.excerpt}
                      </p>
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <div className="flex flex-wrap gap-1.5">
                        {r.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-ink/12 bg-paper/60 px-2.5 py-0.5 text-[11px] font-medium text-ink/70"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-6 flex items-center justify-end gap-3 text-xs text-ink/45 sm:col-span-1">
                      <span className="font-mono">{r.readTime}</span>
                      <span
                        aria-hidden
                        className="text-xl text-ink/40 transition-transform group-hover:translate-x-1 group-hover:text-ink"
                      >
                        ↗
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <p className="font-hand text-2xl text-ink/55">
                that&apos;s the full archive.
              </p>
              <Link
                href="/blog"
                data-cursor
                data-cursor-label="All writing"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper transition-transform hover:-translate-y-0.5"
              >
                <span>View all writing</span>
                <span
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
