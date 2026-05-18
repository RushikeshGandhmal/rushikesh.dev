/**
 * Post content type definitions.
 *
 * To add a new article:
 *   1. Create a new file in `content/posts/<your-slug>.ts`
 *   2. Default-export a `Post` object using the shape below.
 *   3. Register it in `lib/posts.ts` (one line — see the file).
 *
 * The Block union covers everything you'll typically need.
 * Add a new block kind here + handle it in `components/post-renderer.tsx`.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "lead"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "quote"; text: string; author?: string }
  | { type: "code"; lang?: string; text: string; caption?: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "note"; label?: string; text: string }
  | { type: "divider" }
  | { type: "callout"; tone?: "default" | "warn"; title?: string; text: string };

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  readTime: string;
  date: string;          // human-friendly e.g. "Apr 2026"
  dateISO: string;       // ISO-ish e.g. "2026-04-12" for sorting
  issue: string;         // editorial issue label e.g. "Issue 07"
  featured?: boolean;
  cover?: {
    /** soft gradient cover colours */
    from: string;
    to: string;
  };
  content: Block[];
}
