import type { Post } from "@/lib/posts-types";

const post: Post = {
  slug: "rag-in-production",
  title: "RAG in Production: What the Tutorials Don't Tell You",
  excerpt:
    "Chunking strategies, retrieval quality metrics, eval loops, and the unglamorous infra work that decides whether your RAG actually ships — beyond the demo.",
  tags: ["AI / LLM", "RAG", "Infra"],
  readTime: "14 min read",
  date: "Mar 2026",
  dateISO: "2026-03-04",
  issue: "Issue 06",
  featured: true,
  cover: { from: "#7B8B6F", to: "#0A0A0A" },
  content: [
    {
      type: "lead",
      text:
        "Every RAG tutorial ends right before the hard part starts. You embed a corpus, drop it into a vector DB, fetch top-k, stuff it into a prompt, and ship. The demo looks magical. Then a real user types something nobody anticipated, the retriever returns five unrelated chunks, the model hallucinates a citation, and someone in product asks why the answer was wrong on Slack. This essay is about what happens after that Slack message.",
    },
    {
      type: "p",
      text:
        "I've shipped RAG into two products now — once as a search layer for an AI competitive intelligence tool, once as a doc-grounded copilot. Both started simple. Neither stayed that way. The lessons that survived are mostly about the parts that aren't actually about embeddings.",
    },
    { type: "h2", text: "Chunking is half the system, and most teams ignore it" },
    {
      type: "p",
      text:
        "Naive chunking — 'split every 1000 tokens with 200 overlap' — works just well enough to be misleading in development and just badly enough to be infuriating in production. The shape of your chunks decides what your retriever can find. A few patterns I keep returning to:",
    },
    {
      type: "ul",
      items: [
        "Chunk along semantic boundaries (headings, paragraphs, list items) before you chunk by length. Length is a fallback, not a primary key.",
        "Index multiple granularities. Sentence-level chunks for precise lookups, paragraph-level for context, document summaries for breadth.",
        "Attach metadata aggressively: source, section, last_updated, author, doc_type. Most retrieval failures are filter problems wearing an embedding costume.",
      ],
    },
    {
      type: "code",
      lang: "ts",
      caption: "A chunk with the metadata I actually wish I'd added on day one",
      text: `type Chunk = {
  id: string;
  content: string;
  embedding: number[];

  // metadata that pays for itself repeatedly
  source_id: string;
  source_title: string;
  section_path: string[];     // ["Billing", "Webhooks", "Idempotency"]
  granularity: "sentence" | "paragraph" | "doc_summary";
  doc_type: "guide" | "api_ref" | "changelog" | "internal_note";
  last_updated: string;       // ISO date — used for recency boosts
  token_count: number;
};`,
    },
    { type: "h2", text: "Retrieval quality is a metric, not a vibe" },
    {
      type: "p",
      text:
        "The single highest-leverage thing you can do for a RAG system is build a small, curated evaluation set early and refuse to ship retrieval changes that regress it. Forty handwritten Q&A pairs is enough to start. Two hundred is plenty.",
    },
    {
      type: "ol",
      items: [
        "For each eval question, label which chunks are 'gold' — the ones a human would cite to answer.",
        "Run retrieval, compute recall@k and MRR against the gold labels.",
        "When the retriever changes — embedding model, chunking, reranker, weights — re-run and diff.",
      ],
    },
    {
      type: "callout",
      tone: "default",
      title: "Bias toward boring metrics",
      text:
        "Recall@k and MRR aren't glamorous, but they catch regressions that human eyeballing won't. A dashboard that shows them per-doc-type is worth a week of work.",
    },
    { type: "h2", text: "Hybrid search is almost always the right answer" },
    {
      type: "p",
      text:
        "Pure vector search gets you 70% of the way. The next 20% comes from layering BM25 or a similar lexical retriever and merging the two ranked lists. The reason is mundane: embeddings are great at semantic similarity and bad at exact-match queries, identifiers, error codes, and acronyms. Users type those things constantly.",
    },
    {
      type: "code",
      lang: "ts",
      caption: "A small reciprocal rank fusion that consistently beat either retriever alone",
      text: `function fuse(rankings: string[][], k = 60): string[] {
  const scores = new Map<string, number>();
  for (const ranked of rankings) {
    ranked.forEach((id, idx) => {
      scores.set(id, (scores.get(id) ?? 0) + 1 / (k + idx + 1));
    });
  }
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);
}

// usage
const finalIds = fuse([
  await vectorSearch(query, { topK: 50 }),
  await bm25Search(query, { topK: 50 }),
]);`,
    },
    { type: "h2", text: "Rerankers earn their keep" },
    {
      type: "p",
      text:
        "Once you have a fused candidate list, a cross-encoder reranker over the top 50 → 8 is one of the cheapest wins available. Cohere's rerank, BGE-reranker, or whatever your hosting allows — the model matters less than the fact that you are doing it. Cross-encoders are slow, but you're only running them on 50 items per query, and the precision lift is consistently 10–20% in my evals.",
    },
    { type: "h2", text: "Prompting the model after retrieval" },
    {
      type: "p",
      text:
        "The chunk you retrieve and the prompt you assemble are different jobs. Two things matter a lot once you're stuffing context into a model:",
    },
    {
      type: "ul",
      items: [
        "Cite by chunk id, not by inline reference. Render citations in the UI as clickable sources — this is your single best defence against hallucinated answers.",
        "Refuse politely when retrieval is empty. A model told it 'has no relevant context' will mostly stop confabulating; one given an empty string will improvise.",
      ],
    },
    {
      type: "quote",
      text:
        "The model is a renderer for your retriever. If the retrieval is wrong, prompt engineering won't save you.",
    },
    { type: "h2", text: "The infra nobody writes about" },
    {
      type: "p",
      text:
        "RAG in production is mostly an ingestion problem dressed up as an AI problem. The retriever is fine. The ingestion pipeline is where everything breaks.",
    },
    {
      type: "ol",
      items: [
        "Make ingestion idempotent. A re-run on the same source should never produce drift.",
        "Track ingestion as a series of versioned snapshots, not a single mutable index. You'll want to roll back.",
        "Backfills should be jobs, not scripts. The hundredth time you re-embed a corpus you'll want it to be a button.",
        "Observe everything: per-doc ingest time, per-chunk failures, embedding API errors, dimension mismatches. Set alarms on the boring ones.",
      ],
    },
    { type: "h2", text: "Cost and latency, honestly" },
    {
      type: "p",
      text:
        "Embedding the corpus is a one-off bill you'll pay again every few months. Embedding queries is a forever bill. Caching query embeddings, batching ingest, and choosing a smaller embedding model for high-volume use cases will easily save you an order of magnitude. Latency-wise, the long tail almost always comes from a sequential pipeline that could have been parallel — fire your vector search, BM25 search, and metadata filter together, fuse on arrival.",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Be suspicious of magic",
      text:
        "A new embedding model that scores +3% on MTEB will probably not move your product. The same week spent on chunking and evals almost certainly will.",
    },
    { type: "h2", text: "What I'd build first, if I started over" },
    {
      type: "ol",
      items: [
        "A 100-question eval set, hand-labelled with gold chunks.",
        "An ingestion pipeline that is idempotent, observable, and re-runnable.",
        "Hybrid retrieval with a small reranker.",
        "A citation-first UI so users can self-verify every answer.",
        "Only then — model choice, prompt tuning, fancy graph stuff.",
      ],
    },
    { type: "divider" },
    {
      type: "note",
      label: "Closing note",
      text:
        "RAG isn't a model problem and it isn't a database problem. It's a content pipeline problem with retrieval on top. Treat it that way and most of the rest gets simpler.",
    },
  ],
};

export default post;
