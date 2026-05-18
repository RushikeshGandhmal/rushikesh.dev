"use client";

import { m as motion } from "framer-motion";
import { personal } from "@/lib/data";
import { Sprinkle } from "@/components/sprinkle";

type IconProps = { className?: string };

const MailIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

const LinkedInIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75ZM9.5 9.75h3.83v1.54h.05c.53-.94 1.83-1.93 3.77-1.93 4.03 0 4.78 2.5 4.78 5.75V21h-4v-4.84c0-1.15-.02-2.63-1.7-2.63-1.7 0-1.96 1.24-1.96 2.53V21h-4V9.75Z"/>
  </svg>
);

const GitHubIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.32 6.84 9.67.5.09.68-.22.68-.5 0-.24-.01-.9-.02-1.76-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.55 2.34 1.1 2.91.84.09-.66.35-1.1.63-1.36-2.22-.26-4.56-1.13-4.56-5.04 0-1.11.39-2.02 1.03-2.73-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.04A9.4 9.4 0 0 1 12 6.83c.85 0 1.7.12 2.5.34 1.91-1.31 2.75-1.04 2.75-1.04.55 1.41.2 2.45.1 2.71.64.71 1.03 1.62 1.03 2.73 0 3.92-2.34 4.78-4.57 5.03.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.81 0 .28.18.6.69.5C19.14 20.54 22 16.72 22 12.22 22 6.58 17.52 2 12 2Z"/>
  </svg>
);

const TwitterIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231ZM17.083 19.77h1.833L7.084 4.126H5.117L17.083 19.77Z"/>
  </svg>
);

const contactRoutes = [
  {
    label: "Email",
    note: "fastest route",
    href: `mailto:${personal.email}`,
    Icon: MailIcon,
    headline: "Write a note",
    caption: "Reply within a day.",
    brand: "#E85D2D", // accent orange — email has no brand color
  },
  {
    label: "LinkedIn",
    note: "for recruiters",
    href: personal.social.linkedin.url,
    Icon: LinkedInIcon,
    headline: "Connect on LinkedIn",
    caption: "Roles, intros, references.",
    brand: "#0A66C2", // LinkedIn blue
  },
  {
    label: "GitHub",
    note: "code & commits",
    href: personal.social.github.url,
    Icon: GitHubIcon,
    headline: "Read the code",
    caption: "Open source, daily work.",
    // GitHub's brand is mostly monochrome; use their primary green so the
    // sprinkle reads against the dark card.
    brand: "#2EA043",
  },
  {
    label: "Twitter",
    note: "thoughts in flight",
    href: personal.social.twitter.url,
    Icon: TwitterIcon,
    headline: "Follow on X",
    caption: "Notes on AI and craft.",
    // X is monochrome; use the legacy Twitter blue so the sprinkle has color.
    brand: "#1DA1F2",
  },
];

export function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-ink pb-24 pt-16 text-paper sm:pb-32 sm:pt-24"
    >
      {/* glow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-0 opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(232,93,45,0.22), transparent 55%), radial-gradient(circle at 80% 90%, rgba(123,139,111,0.18), transparent 55%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(var(--paper) / 0.4) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--paper) / 0.4) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)",
        }}
      />

      <div className="container-page relative">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-paper/60">
          <span className="font-mono text-[11px] text-paper/40">06</span>
          <span className="h-px w-8 bg-paper/30" />
          <span>Contact</span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-balance font-display text-display-xl leading-[0.95] tracking-tight text-paper"
        >
          Have an AI problem worth
          <br />
          <span className="italic text-paper/70">solving together?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-paper/70"
        >
          I&apos;m exploring mid&ndash;senior AI / Full-Stack engineering roles
          and high-leverage contract work &mdash; especially anything at the
          intersection of agents, RAG, real-time interfaces and small,
          motivated teams shipping fast.{" "}
          <span className="text-paper/85">Any timezone. Any location.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="mt-12 flex flex-wrap items-center gap-3"
        >
          <a
            href={`mailto:${personal.email}`}
            data-cursor
            data-cursor-label="Write"
            className="group inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3.5 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5"
          >
            <span>{personal.email}</span>
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
          <a
            href={personal.social.linkedin.url}
            target="_blank"
            rel="noreferrer"
            data-cursor
            className="inline-flex items-center gap-2 rounded-full border border-paper/20 px-6 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-paper hover:text-ink"
          >
            LinkedIn ↗
          </a>
        </motion.div>

        {/* contact routes */}
        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-paper/10 bg-paper/10 sm:grid-cols-2 lg:grid-cols-4">
          {contactRoutes.map((r, i) => {
            const Icon = r.Icon;
            return (
              <motion.a
                key={r.label}
                href={r.href}
                target={r.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                data-cursor
                data-cursor-label={r.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover="hover"
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.05 * i,
                }}
                // `--brand` is a per-card CSS variable used by the
                // icon-tile hover state to surface the platform's brand color.
                style={{ ["--brand" as string]: r.brand } as React.CSSProperties}
                className="group relative flex flex-col gap-3.5 overflow-hidden bg-ink p-5 transition-colors hover:bg-ink-800 sm:p-6"
              >
                {/* Sprinkle of brand-color droplets on hover */}
                <Sprinkle color={r.brand} />

                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-paper/45">
                  <span>{r.label}</span>
                  <span className="font-hand text-base tracking-normal normal-case text-paper/50">
                    {r.note}
                  </span>
                </div>
                <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-paper/15 bg-paper/5 text-paper transition-all duration-300 group-hover:scale-[1.05] group-hover:border-[color:var(--brand)]/60 group-hover:bg-[color:var(--brand)]/12">
                  <Icon className="relative z-10 h-[18px] w-[18px] transition-colors duration-300 group-hover:text-[color:var(--brand)]" />
                </div>
                <div>
                  <span className="font-display text-xl tracking-tight text-paper sm:text-[1.45rem]">
                    {r.headline}
                  </span>
                  <p className="mt-1.5 text-[13px] leading-snug text-paper/55">
                    {r.caption}
                  </p>
                </div>
                <span
                  aria-hidden
                  className="mt-1 inline-flex items-center gap-1 text-xs text-paper/45 transition-transform group-hover:translate-x-1 group-hover:text-paper"
                >
                  Open ↗
                </span>
              </motion.a>
            );
          })}
        </div>

        {/* meta line */}
        <div className="mt-16 flex flex-col gap-4 border-t border-paper/10 pt-6 text-sm text-paper/55 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="ticker-blip" />
            <span className="uppercase tracking-[0.18em] text-paper/65">
              Currently · open to mid&ndash;senior roles
            </span>
          </div>
          <p className="font-hand text-xl text-paper/55">
            P.S. I read every message.
          </p>
        </div>
      </div>
    </section>
  );
}
