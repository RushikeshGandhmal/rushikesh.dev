import type { Post } from "@/lib/posts-types";

const post: Post = {
  slug: "langgraph-agents-in-production",
  title:
    "From Chains to Graphs: Why LangGraph Is How I Build Agents Now",
  excerpt:
    "Linear chains break the moment your agent needs to retry, branch, or wait for a human. Why I migrated from LangChain chains to LangGraph for every multi-step AI workflow — and what production taught me on the way.",
  tags: ["AI / GenAI", "LangGraph", "Agents", "LLM"],
  readTime: "11 min read",
  date: "Apr 2026",
  dateISO: "2026-04-22",
  issue: "Issue 07",
  featured: true,
  cover: { from: "#4285F4", to: "#0A0A0A" },
  content: [
    {
      type: "lead",
      text: "The first agent I shipped was a chain. Six steps, top to bottom, no branches. It worked on the demo. It survived the staging environment. It died the first time a user asked an ambiguous question — the agent confidently walked off a cliff and there was no way to recover. That's the lesson that taught me chains are demos and graphs are products.",
    },
    {
      type: "p",
      text: "Over the last year I've moved every non-trivial AI workflow I own from LangChain's chain abstraction to LangGraph. This essay is the version of that argument I wish someone had handed me a year ago — concrete, opinionated, with the bits that actually broke under load.",
    },
    {
      type: "h2",
      text: "A chain is a function. An agent is a state machine.",
    },
    {
      type: "p",
      text: "The fundamental shift is conceptual. A chain is a pipeline — input goes in, output comes out, the shape is fixed at design time. An agent isn't a pipeline. An agent is a thing that has state, makes decisions, calls tools, retries failures, and sometimes pauses to ask a human. That's a state machine, and the moment you accept that, LangGraph stops feeling like extra ceremony and starts feeling like the right primitive.",
    },
    {
      type: "code",
      lang: "ts",
      caption: "A tiny LangGraph agent — nodes are pure async functions, edges are decisions.",
      text: `import { StateGraph, END } from "@langchain/langgraph";

type State = {
  question: string;
  context?: string;
  draft?: string;
  approved?: boolean;
};

const graph = new StateGraph<State>({
  channels: {
    question: null,
    context: null,
    draft: null,
    approved: null,
  },
})
  .addNode("retrieve", async (s) => ({
    context: await retrieveContext(s.question),
  }))
  .addNode("draft", async (s) => ({
    draft: await llm.draft({ q: s.question, ctx: s.context }),
  }))
  .addNode("review", async (s) => ({
    approved: await reviewer.judge(s.draft),
  }))
  .addEdge("retrieve", "draft")
  .addConditionalEdges("review", (s) =>
    s.approved ? END : "draft"
  )
  .setEntryPoint("retrieve");

export const agent = graph.compile();`,
    },
    {
      type: "p",
      text: "Three things to notice. Every node is a small async function that returns a partial state — nothing fancy. The wiring is data; you can serialize, inspect, and visualize it. And the review-loop edge is just a function — if the reviewer rejects the draft, we go back. In a linear chain that loop is a recursive nightmare. Here it's one line.",
    },
    {
      type: "h2",
      text: "Five things graphs gave me that chains couldn't",
    },
    {
      type: "ol",
      items: [
        "Retries that aren't `try/catch` spaghetti. A retry is just an edge that loops back to the same node with an attempt counter in state.",
        "Human-in-the-loop, finally. Pause the graph, persist state, surface the half-finished plan in the UI, resume from where you stopped. Try doing that with a chain that lives inside one process.",
        "Parallel fan-out for free. Two retrievers, two LLM calls, merge the results in a `combine` node. The graph topology is the parallelism.",
        "Streaming events at the node boundary. Each node emits an event you can pipe to the UI — `retrieving...`, `drafting...`, `reviewing...` — which is how you turn 'long-running AI' into 'feels-fast AI'.",
        "Observability that maps to your mental model. LangSmith traces show the actual graph you drew, not a flattened stack of `RunnableSequence`s.",
      ],
    },
    {
      type: "callout",
      title: "The migration pattern that worked for me",
      text: "Don't rewrite. Wrap each existing chain as a single node in a graph. Then split the nodes that need to branch, retry, or stream independently. It's a refactor, not a rewrite.",
    },
    {
      type: "h2",
      text: "Where chains still beat graphs",
    },
    {
      type: "p",
      text: "I don't think every LLM call should be a graph. If your workflow is genuinely linear — translate, then summarize, then format — a chain is fine. The cost of LangGraph is real: more boilerplate, a steeper concept curve for new contributors, and a tooling story that's still catching up. Reach for it when the workflow has loops, branches, or pauses, not when it doesn't.",
    },
    {
      type: "h2",
      text: "Production gotchas I paid for",
    },
    { type: "h3", text: "1. State can grow without you noticing" },
    {
      type: "p",
      text: "Every node returns a partial state that's merged into the running state. If your retriever stuffs the full retrieved chunks back into state on every iteration, you'll find yourself paying token costs to drag five megabytes of context around the graph. Keep state lean — store IDs or hashes, fetch full payloads on demand.",
    },
    { type: "h3", text: "2. Conditional edges hide failure modes" },
    {
      type: "p",
      text: "A conditional edge is a function that returns the name of the next node. If that function throws, your graph stops in a state that's hard to debug. Wrap routing logic in a try/catch that returns a known-bad sentinel node — typically a `failure_handler` — so failures route somewhere visible.",
    },
    { type: "h3", text: "3. Infinite loops are one bad model output away" },
    {
      type: "p",
      text: "If a reviewer node keeps rejecting drafts forever, you have a loop that costs real money. Always add a `max_iterations` counter to state and a guard edge that terminates the graph when it's hit. I default to 5 unless I have a strong reason to go higher.",
    },
    {
      type: "code",
      lang: "ts",
      caption: "A cheap, effective loop guard.",
      text: `.addConditionalEdges("review", (s) => {
  if (s.approved) return END;
  if ((s.attempts ?? 0) >= 5) return "give_up";
  return "draft"; // try again with attempts++
})`,
    },
    { type: "h3", text: "4. Persist state if a node calls anything slow" },
    {
      type: "p",
      text: "If your draft node makes a 30-second LLM call and your server restarts, the request is dead. LangGraph supports checkpointers — a Postgres or Redis-backed store that snapshots state after each node. Turn it on for any user-facing flow. The dev-experience cost is small. The production-trust gain is huge.",
    },
    {
      type: "h2",
      text: "What I'd build next",
    },
    {
      type: "p",
      text: "Most of my agents now look like this: a retrieve node, a plan node, a tool-using executor node, a critic node, and a streaming-output node — wired into a graph that can retry, branch on critic verdicts, and pause for human input on high-stakes decisions. The shape is small enough to fit in your head and flexible enough to survive real users. That's the goal.",
    },
    {
      type: "note",
      label: "if you take one thing",
      text: "Chains are great for shipping the first version. Graphs are how the first version survives the second week.",
    },
    {
      type: "p",
      text: "I'm shipping LangGraph into Rivaly and Onramp right now. If you're wrestling with a chain that's outgrown its skin, write me — I genuinely enjoy talking about this stuff.",
    },
  ],
};

export default post;
