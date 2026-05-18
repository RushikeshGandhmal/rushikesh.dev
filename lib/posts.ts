import type { Post } from "@/lib/posts-types";

// -----------------------------------------------------------------------------
// Post registry
// -----------------------------------------------------------------------------
// To add a new article:
//   1. Create `content/posts/<your-slug>.ts` and default-export a Post object
//      (see `lib/posts-types.ts` for the shape).
//   2. Import it below and push it into the `posts` array.
//      That's it — it'll show up on /blog and at /blog/<your-slug>.
// -----------------------------------------------------------------------------
import mcpServerVsCode from "@/content/posts/mcp-server-vscode-json-rpc";
import ragInProduction from "@/content/posts/rag-in-production";
import langgraphAgents from "@/content/posts/langgraph-agents-in-production";

export const posts: Post[] = [
  langgraphAgents,
  ragInProduction,
  mcpServerVsCode,
];

// Sorted newest-first by dateISO.
export function getAllPosts(): Post[] {
  return [...posts].sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getFeaturedPost(): Post {
  return getAllPosts().find((p) => p.featured) ?? getAllPosts()[0];
}

export function getRelatedPosts(slug: string, limit = 2): Post[] {
  return getAllPosts()
    .filter((p) => p.slug !== slug)
    .slice(0, limit);
}
