"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { m as motion, AnimatePresence } from "framer-motion";
import { sections, personal } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navigation() {
  const pathname = usePathname();
  const onHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!onHome) {
      setActive("writing");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [onHome]);

  // Build hrefs that work from any route. The "writing" entry always
  // points at the real /blog page rather than the homepage teaser.
  const linkFor = (id: string) => {
    if (id === "writing") return "/blog";
    return onHome ? `#${id}` : `/#${id}`;
  };

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "py-2.5" : "py-4"
        )}
      >
        <div className="container-page">
          <div
            className={cn(
              "flex items-center justify-between rounded-full border border-transparent px-4 py-2 transition-all duration-500 sm:px-5",
              scrolled
                ? "border-ink/10 bg-paper/75 backdrop-blur-xl ring-soft"
                : "bg-transparent"
            )}
          >
            <Link
              href={onHome ? "#home" : "/"}
              className="group flex items-center gap-2.5"
              data-cursor
              aria-label="Home — rushikesh.dev"
            >
              <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-ink text-paper">
                <span className="font-display text-base leading-none">R</span>
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-accent ring-2 ring-paper" />
              </span>
              <span className="font-hand text-2xl leading-none tracking-tight text-ink transition-colors group-hover:text-accent-ink">
                rushikesh
                <span className="text-ink/45">.dev</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
              {sections.slice(1).map((s) => {
                const isActive = active === s.id;
                const isExternal = s.id === "writing";
                const linkProps = {
                  href: linkFor(s.id),
                  className: cn(
                    "nav-link group relative rounded-full px-4 py-1.5 text-[13px] font-medium tracking-tight transition-colors",
                    isActive ? "text-ink" : "text-ink/65 hover:text-ink"
                  ),
                  "data-cursor-ignore": true,
                } as const;

                const inner = (
                  <>
                    <span className="relative z-10 flex items-center gap-1.5">
                      <span className="font-mono text-[10px] opacity-50">
                        {s.number}
                      </span>
                      {s.label}
                    </span>
                    {/* Hand-drawn pen circle — draws itself on hover, stays
                        drawn on the active section. Sits behind the text and
                        never blurs it. */}
                    <svg
                      aria-hidden
                      viewBox="0 0 120 50"
                      preserveAspectRatio="none"
                      className={cn(
                        "nav-circle pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible text-accent",
                        isActive && "is-active"
                      )}
                    >
                      <path
                        d="M97 11C71 3 35 3 18 12C3 20 6 37 31 43C59 50 101 46 110 32C116 23 108 11 79 8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                        pathLength={1}
                      />
                    </svg>
                  </>
                );

                return isExternal ? (
                  <Link key={s.id} {...linkProps}>
                    {inner}
                  </Link>
                ) : (
                  <a key={s.id} {...linkProps}>
                    {inner}
                  </a>
                );
              })}
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              <ThemeToggle />
              <a
                href={`mailto:${personal.email}`}
                data-cursor
                data-cursor-label="Say hi"
                className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-paper transition-transform hover:-translate-y-0.5"
              >
                <span className="relative z-10">Get in touch</span>
                <span className="relative z-10 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </a>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="relative flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-full border border-ink/10 bg-paper/60"
                aria-label="Toggle menu"
                aria-expanded={open}
              >
                <span
                  className={cn(
                    "block h-px w-4 bg-ink transition-transform duration-300",
                    open && "translate-y-[3px] rotate-45"
                  )}
                />
                <span
                  className={cn(
                    "block h-px w-4 bg-ink transition-transform duration-300",
                    open && "-translate-y-[3px] -rotate-45"
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-0 top-0 bg-paper px-6 pb-10 pt-24 shadow-2xl"
            >
              <nav className="flex flex-col gap-1">
                {sections.slice(1).map((s, i) => {
                  const isExternal = s.id === "writing";
                  const cls =
                    "flex items-baseline justify-between border-b border-ink/10 py-4";
                  const body = (
                    <>
                      <span className="font-display text-3xl tracking-tight">
                        {s.label}
                      </span>
                      <span className="font-mono text-xs text-ink/40">
                        {s.number}
                      </span>
                    </>
                  );

                  return (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.05 * i,
                        duration: 0.6,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      {isExternal ? (
                        <Link
                          href={linkFor(s.id)}
                          onClick={() => setOpen(false)}
                          className={cls}
                        >
                          {body}
                        </Link>
                      ) : (
                        <a
                          href={linkFor(s.id)}
                          onClick={() => setOpen(false)}
                          className={cls}
                        >
                          {body}
                        </a>
                      )}
                    </motion.div>
                  );
                })}
                <motion.a
                  href={`mailto:${personal.email}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="mt-6 flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-sm font-medium text-paper"
                >
                  Get in touch →
                </motion.a>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
