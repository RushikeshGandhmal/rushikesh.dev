import type { Block } from "@/lib/posts-types";
import { cn } from "@/lib/utils";

interface PostRendererProps {
  blocks: Block[];
}

export function PostRenderer({ blocks }: PostRendererProps) {
  return (
    <div className="prose-article">
      {blocks.map((block, i) => (
        <BlockRenderer key={i} block={block} />
      ))}
    </div>
  );
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "lead":
      return (
        <p className="font-display text-2xl leading-snug text-ink/85 sm:text-[28px]">
          {block.text}
        </p>
      );
    case "p":
      return (
        <p className="text-[17px] leading-[1.75] text-ink/80">{block.text}</p>
      );
    case "h2":
      return (
        <h2 className="mt-14 flex items-baseline gap-3 font-display text-3xl tracking-tight text-ink sm:text-4xl">
          <span className="font-hand text-xl text-accent">§</span>
          <span>{block.text}</span>
        </h2>
      );
    case "h3":
      return (
        <h3 className="mt-10 font-display text-2xl tracking-tight text-ink">
          {block.text}
        </h3>
      );
    case "quote":
      return (
        <blockquote className="relative my-8 border-l-2 border-ink/30 pl-6">
          <p className="font-display text-2xl italic leading-snug text-ink/85 sm:text-3xl">
            “{block.text}”
          </p>
          {block.author && (
            <footer className="mt-3 text-sm uppercase tracking-[0.18em] text-ink/50">
              — {block.author}
            </footer>
          )}
        </blockquote>
      );
    case "code":
      return (
        <figure className="my-6 overflow-hidden rounded-2xl border border-ink/12 bg-ink text-paper">
          <div className="flex items-center justify-between border-b border-paper/10 px-4 py-2.5 text-[11px] uppercase tracking-[0.18em] text-paper/55">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-paper/25" />
              <span className="h-2 w-2 rounded-full bg-paper/25" />
              <span className="h-2 w-2 rounded-full bg-paper/25" />
              <span className="ml-2">{block.lang ?? "code"}</span>
            </div>
            {block.caption && (
              <span className="hidden font-hand text-sm tracking-normal normal-case text-paper/60 sm:inline">
                {block.caption}
              </span>
            )}
          </div>
          <pre className="overflow-x-auto px-5 py-5 font-mono text-[13.5px] leading-relaxed">
            <code>{block.text}</code>
          </pre>
        </figure>
      );
    case "ul":
      return (
        <ul className="my-3 space-y-2.5">
          {block.items.map((item, idx) => (
            <li
              key={idx}
              className="flex gap-3 text-[17px] leading-[1.7] text-ink/80"
            >
              <span className="mt-3 inline-block h-[3px] w-3 shrink-0 bg-ink/40" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="my-3 space-y-2.5">
          {block.items.map((item, idx) => (
            <li
              key={idx}
              className="flex gap-4 text-[17px] leading-[1.7] text-ink/80"
            >
              <span className="font-mono text-sm text-ink/40">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );
    case "note":
      return (
        <aside className="my-8 rounded-2xl border border-ink/12 bg-paper-warm/70 p-5 sm:p-6">
          <div className="text-[11px] uppercase tracking-[0.2em] text-ink/45">
            {block.label ?? "Note"}
          </div>
          <p className="mt-2 font-hand text-2xl leading-snug text-ink/85">
            {block.text}
          </p>
        </aside>
      );
    case "callout":
      return (
        <aside
          className={cn(
            "my-8 rounded-2xl border p-5 sm:p-6",
            block.tone === "warn"
              ? "border-accent/30 bg-accent/10"
              : "border-ink/12 bg-paper-warm/70"
          )}
        >
          {block.title && (
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-ink/65">
              {block.title}
            </div>
          )}
          <p className="mt-2 text-[16px] leading-[1.7] text-ink/85">
            {block.text}
          </p>
        </aside>
      );
    case "divider":
      return (
        <div className="my-12 flex items-center justify-center">
          <span className="font-display text-2xl italic text-ink/25">
            * * *
          </span>
        </div>
      );
    default:
      return null;
  }
}
