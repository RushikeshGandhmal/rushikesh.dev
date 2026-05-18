import type { Post } from "@/lib/posts-types";

const post: Post = {
  slug: "mcp-server-vscode-json-rpc",
  title: "Building an MCP Server Inside VS Code: JSON-RPC at the IDE Layer",
  excerpt:
    "A deep dive into bridging AI agents with the editor using the Model Context Protocol, JSON-RPC 2.0 streaming, and a chat surface that finally feels native to the IDE.",
  tags: ["AI Systems", "VS Code", "MCP", "Architecture"],
  readTime: "12 min read",
  date: "Apr 2026",
  dateISO: "2026-04-12",
  issue: "Issue 07",
  featured: true,
  cover: { from: "#E85D2D", to: "#0A0A0A" },
  content: [
    {
      type: "lead",
      text:
        "Most AI tooling lives outside the editor. The interesting stuff — the agent that reads your repo, runs your tests, edits files, talks to you — has historically been bolted on through web chat or a half-broken sidebar. The Model Context Protocol (MCP) changes the shape of that conversation. This post is about how we built an MCP server inside a VS Code extension and made it feel like the IDE was always supposed to do this.",
    },
    {
      type: "p",
      text:
        "When we started, we had a CLI-based AI agent that already worked well in a terminal. The product question was simple: how do we give the same agent a real home inside VS Code, with streaming output, asynchronous tool execution, and a chat UI that doesn't feel like a webview ghost? The engineering question turned out to be harder.",
    },
    { type: "h2", text: "Why MCP, and why JSON-RPC 2.0" },
    {
      type: "p",
      text:
        "MCP is, at its core, a protocol for letting agents talk to context providers — your filesystem, your terminal, your editor — without baking those integrations into the model layer. It's transport-agnostic, but in practice almost every implementation uses JSON-RPC 2.0 over stdio or sockets. There are reasons for that.",
    },
    {
      type: "ul",
      items: [
        "JSON-RPC 2.0 is small enough to implement in an afternoon and stable enough to ship for years.",
        "It supports requests, responses, notifications, and (with care) streaming via custom 'progress' notifications.",
        "The error model is well-defined, which matters once you have multiple agents running concurrently.",
      ],
    },
    {
      type: "p",
      text:
        "VS Code already speaks JSON-RPC fluently — that's how the Language Server Protocol works under the hood. Slotting an MCP server into the same mental model meant the extension side was mostly plumbing, not protocol design.",
    },
    { type: "h2", text: "The architecture, in one paragraph" },
    {
      type: "p",
      text:
        "The VS Code extension owns the lifecycle of a long-lived MCP server child process. The server exposes tools (read_file, edit_file, run_command, search_workspace) and consumes context from the IDE through reverse calls. The chat panel is a webview that speaks to the extension host over postMessage, the extension speaks JSON-RPC to the server, and the agent — running inside the server — orchestrates everything. Three boundaries, one protocol.",
    },
    {
      type: "code",
      lang: "ts",
      caption: "Spinning up the MCP server from the extension activate() hook",
      text: `import { spawn } from "node:child_process";
import { createMessageConnection, StreamMessageReader, StreamMessageWriter } from "vscode-jsonrpc/node";

export async function startMcpServer(context: vscode.ExtensionContext) {
  const child = spawn(process.execPath, [context.asAbsolutePath("dist/mcp-server.js")], {
    stdio: ["pipe", "pipe", "inherit"],
    env: { ...process.env, FORCE_COLOR: "0" },
  });

  const connection = createMessageConnection(
    new StreamMessageReader(child.stdout!),
    new StreamMessageWriter(child.stdin!),
  );

  connection.onNotification("agent/chunk", (payload) => {
    chatPanel.postMessage({ type: "stream", payload });
  });

  connection.listen();
  return connection;
}`,
    },
    { type: "h2", text: "Streaming without breaking everything" },
    {
      type: "p",
      text:
        "The first naive version of the chat surface buffered each completion until the model finished. It worked, and it was awful. Users want to see tokens land. They want to interrupt. They want tool calls to feel like the agent is doing something, not waiting.",
    },
    {
      type: "p",
      text:
        "We landed on a small set of streaming notifications layered on top of MCP: agent/chunk for token deltas, tool/start and tool/finish for lifecycle, and agent/done as the terminator. The webview keeps a single in-flight assistant message and appends to it. Tool calls render as their own cards. Interruption is a regular JSON-RPC request — $/cancelRequest — and the server promises to honour it within a tick.",
    },
    {
      type: "callout",
      tone: "default",
      title: "Rule of thumb",
      text:
        "If you can render a UI state within 50 ms of the user expressing intent, the product feels alive. If you can't, you're going to need a spinner, and spinners are admissions of defeat.",
    },
    { type: "h2", text: "Async tool execution, the part everyone underestimates" },
    {
      type: "p",
      text:
        "Tool calls are where the agent stops being an autocomplete and starts being a colleague. They are also where most agent surfaces fall apart. Three things mattered to us:",
    },
    {
      type: "ol",
      items: [
        "Tools must be cancellable. Period. A 30-second test run that the user can't kill is a hostile UI.",
        "Tools must report progress. Even a heartbeat is enough — silence reads as broken.",
        "Tool failures must be first-class. Surfacing a stack trace inline beats a generic 'something went wrong' every time.",
      ],
    },
    {
      type: "code",
      lang: "ts",
      caption: "A cancellable tool wrapper used inside the MCP server",
      text: `export function tool<TInput, TOutput>(name: string, impl: ToolImpl<TInput, TOutput>) {
  return async (req: ToolRequest<TInput>, token: CancellationToken) => {
    const controller = new AbortController();
    token.onCancellationRequested(() => controller.abort());

    try {
      await connection.sendNotification("tool/start", { id: req.id, name });
      const result = await impl(req.input, { signal: controller.signal });
      await connection.sendNotification("tool/finish", { id: req.id, ok: true });
      return result;
    } catch (err) {
      await connection.sendNotification("tool/finish", { id: req.id, ok: false, error: serialise(err) });
      throw err;
    }
  };
}`,
    },
    { type: "h2", text: "Making it feel native" },
    {
      type: "p",
      text:
        "A webview is not the IDE. It's a browser-shaped guest renting a corner of the editor. To make the chat feel native we did the boring work: respect the active theme, mirror the editor's font, hijack the right keybindings (and only those), and let the user open a referenced file in a real tab with a single click. The cumulative effect is a panel that ages well — it doesn't look like a startup demo six months later.",
    },
    {
      type: "quote",
      text:
        "The best AI tooling disappears into the work. You should notice the answer, not the agent.",
    },
    { type: "h2", text: "What I'd do differently" },
    {
      type: "p",
      text:
        "I'd start with the cancellation story on day one, not day thirty. I'd treat the streaming protocol as a first-class contract with its own tests instead of a thing that emerged. And I'd ship a tiny inspector view from the start — being able to see every JSON-RPC frame the extension sees pays for itself the first time something hangs.",
    },
    { type: "divider" },
    {
      type: "note",
      label: "If you're building this",
      text:
        "Start with stdio + JSON-RPC, not WebSockets. Get the lifecycle right before you reach for transport sophistication. The fancy stuff is easier once the boring stuff is boring.",
    },
  ],
};

export default post;
