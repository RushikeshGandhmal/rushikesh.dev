export const personal = {
  name: "Rushikesh Gandhmal",
  firstName: "Rushikesh",
  lastName: "Gandhmal",
  title: "AI Software Engineer",
  tagline: "Zero-to-one AI products. End-to-end. Solo when needed.",
  summary:
    "AI Software Engineer with 4+ years shipping AI-driven products from zero to one at startups. I own end-to-end across AI, frontend, backend and infra — agents, RAG pipelines, MCP servers, streaming UIs, auth, billing, the whole stack. I take the complex problems and have fun with them.",
  longBio:
    "I build AI products the way a startup needs them built — owned end-to-end, shipped without a committee, and treated as a craft rather than a checklist. Over the last four years I've co-founded two SaaS products, embedded an MCP server into VS Code, shipped RAG into real products, and rebuilt legacy codebases into clean, typed, modular systems. Most of my career has been at small teams where one engineer ships an entire feature — frontend, backend, AI, infra. That's the work I love. I have fun with the complex stuff most people avoid.",
  phone: "+91 9146968166",
  email: "rushikeshgandhmal@gmail.com",
  location: "Pune, Maharashtra · India",
  availability: "Open to mid–senior AI / Full-Stack roles · Any timezone · Any location",
  social: {
    github: { label: "GitHub", url: "https://github.com/rushikeshgandhmal" },
    linkedin: {
      label: "LinkedIn",
      url: "https://linkedin.com/in/rushikeshgandhmal",
    },
    twitter: { label: "Twitter", url: "https://twitter.com/rushikeshgandhmal" },
    leetcode: {
      label: "LeetCode",
      url: "https://leetcode.com/rushikeshgandhmal",
    },
    medium: { label: "Medium", url: "https://medium.com/@rushikeshgandhmal" },
  },
};

export const stats = [
  { label: "Years Shipping", value: "4+" },
  { label: "0→1 Products Owned", value: "5" },
  { label: "Extension Downloads", value: "2.2k+" },
  { label: "Open-Source", value: "Cal.com" },
];

export const experience = [
  {
    company: "Forge Code",
    role: "AI Software Engineer · Full Stack",
    location: "Delaware, USA · Remote",
    period: "Jul 2025 — Feb 2026",
    current: false,
    summary:
      "Owned a VS Code extension and embedded MCP server end-to-end — real-time AI agents inside the IDE. Crossed 2,200+ downloads.",
    stack: [
      "TypeScript",
      "React",
      "Node.js",
      "MCP",
      "JSON-RPC",
      "PostgreSQL",
      "Redis",
      "PostHog",
    ],
    highlights: [
      "Architected a Model Context Protocol (MCP) server inside a VS Code extension using JSON-RPC 2.0 for real-time AI ↔ IDE communication.",
      "Engineered an ACP-compliant multi-agent chat interface with low-latency streaming UI and asynchronous, cancellable tool execution.",
      "Designed REST APIs in Node.js + Express with Redis caching; analytics on PostHog + PostgreSQL aggregations.",
      "Shipped a scalable frontend with React, Next.js and Zustand — Lighthouse scores 90+.",
      "Drove the extension past 2,200+ marketplace downloads with zero formal marketing.",
    ],
  },
  {
    company: "Induced AI",
    role: "AI Software Engineer",
    location: "Palo Alto, USA · Remote",
    period: "Feb 2025 — Apr 2025",
    current: false,
    summary:
      "Built the frontend for a voice-based AI Calling Agent and refactored a legacy product to a typed, modular architecture.",
    stack: ["TypeScript", "Next.js", "Voice AI", "MDX"],
    highlights: [
      "Engineered the frontend for a voice-based AI Calling Agent using Next.js and TypeScript.",
      "Refactored the legacy DNTEL codebase to TypeScript with a modular, composable architecture.",
      "Implemented caching strategies that reduced redundant API calls and improved perceived latency for AI responses.",
      "Built a dynamic documentation platform with Next.js, MDX and structured JSON content.",
    ],
  },
  {
    company: "Rethink Ledgers",
    role: "Software Engineer",
    location: "Charlotte, USA · Remote",
    period: "May 2023 — Feb 2025",
    current: false,
    summary:
      "Owned end-to-end delivery on two flagship products — Msg2ai (AI messaging) and TYDEI — across auth, billing, onboarding and data.",
    stack: [
      "Next.js",
      "Clerk",
      "Stripe",
      "Prisma",
      "MongoDB",
      "Zustand",
      "Resend",
    ],
    highlights: [
      "Built authentication flows with Clerk (OTP + protected routes) and led RBAC integration across products.",
      "Integrated usage-based Stripe billing with webhook handling and dynamic UI updates.",
      "Designed Prisma + MongoDB data models and scheduled cleanup jobs on Vercel.",
      "Migrated the entire codebase from JavaScript to TypeScript and built an admin invitation workflow with Resend.",
    ],
  },
  {
    company: "Wipro · MasterCard",
    role: "Software Engineer",
    location: "Pune, India · Remote",
    period: "Oct 2021 — May 2023",
    current: false,
    summary:
      "Delivered accessible, performant interfaces for an enterprise fintech product as part of the MasterCard engagement.",
    stack: ["React", "TypeScript", "Zod", "Figma"],
    highlights: [
      "Developed reusable, accessible UI components with React and TypeScript.",
      "Improved frontend performance through memoization and component refactoring.",
      "Integrated frontend with backend APIs using Zod for runtime validation.",
      "Translated Figma designs into accessible, semantic interfaces.",
    ],
  },
];

export type Project = {
  name: string;
  year: string;
  type: string;
  tag: string;
  description: string;
  stack: string[];
  href: string;
  featured?: boolean;
  inProgress?: boolean;
  meta?: string;
};

export const projects: Project[] = [
  {
    name: "Rivaly",
    year: "2026",
    type: "Co-founder · AI Competitive Intelligence",
    tag: "In development",
    description:
      "An AI competitive-intelligence platform for operators and founders — real-time business insights, alerts and ‘what your rivals shipped this week’ digests powered by LLMs, RAG and scheduled agent workflows.",
    stack: ["Next.js", "OpenAI", "RAG", "PostgreSQL", "Vercel"],
    href: "https://rivaly-alpha.vercel.app/",
    featured: true,
    inProgress: true,
  },
  {
    name: "Onramp",
    year: "2026",
    type: "Co-founder · OSS Discovery + Talent Surface",
    tag: "In development",
    description:
      "A two-sided platform built for the open-source generation: developers find skill-matched OSS issues in under 10 seconds via semantic search, and their contributions quietly surface their profile to recruiters hunting for proven, talented engineers.",
    stack: ["Next.js", "OpenAI", "Embeddings", "pgvector", "Stripe"],
    href: "https://onramp-seven.vercel.app/",
    featured: true,
    inProgress: true,
  },
  {
    name: "ForgeCode",
    year: "2025",
    type: "VS Code Extension · MCP · AI Agent",
    tag: "Shipped",
    description:
      "A VS Code extension that brings a CLI-based AI agent inside the editor over an MCP server with JSON-RPC streaming. 2,200+ marketplace downloads.",
    stack: ["TypeScript", "JSON-RPC", "MCP", "React"],
    href: "#",
    featured: true,
  },
  {
    name: "PrepWise AI Interview",
    year: "2024",
    type: "Full-Stack AI Product",
    tag: "Side project",
    description:
      "An AI-powered voice interview simulator using Firebase, Vapi AI and Google Gemini for dynamic question generation.",
    stack: ["Next.js", "Firebase", "Vapi", "Gemini"],
    href: "#",
    featured: false,
  },
  {
    name: "Cal.com",
    year: "2024",
    type: "Open Source",
    tag: "OSS",
    description:
      "Resolved internationalization bugs and corrected i18next implementation issues across UI components.",
    stack: ["Next.js", "i18next", "TypeScript"],
    href: "https://github.com/calcom/cal.com/pulls?q=author%3Arushikeshgandhmal",
    featured: false,
    meta: "PRs #15657 · #15463 · #15626 · #15631",
  },
  {
    name: "Issue Tracker",
    year: "2023",
    type: "Full-Stack",
    tag: "Side project",
    description:
      "A Jira-like issue tracking system built on Next.js, Prisma, SQL, NextAuth, React Query and Radix UI.",
    stack: ["Next.js", "Prisma", "NextAuth", "Radix UI"],
    href: "#",
    featured: false,
  },
];

// AI-first ordering — what recruiters should see first.
export const skills = {
  "AI / GenAI": [
    "OpenAI (GPT-4o, o1)",
    "Anthropic Claude",
    "Gemini",
    "LangChain & LangGraph",
    "LlamaIndex",
    "Vercel AI SDK",
    "Model Context Protocol (MCP)",
    "RAG Pipelines",
    "Vector DBs · pgvector · Pinecone",
    "Function Calling & Tool Use",
    "Structured Outputs",
    "Embeddings & Reranking",
    "Evals · LangSmith · Promptfoo",
    "Agent Workflows",
    "Streaming UIs",
    "Prompt Engineering",
  ],
  Languages: ["TypeScript", "JavaScript (ES6+)", "Python", "Java"],
  Frontend: [
    "Next.js",
    "React",
    "Redux Toolkit",
    "Zustand",
    "TanStack Query",
    "Tailwind CSS",
    "shadcn/ui",
    "Zod",
    "Web Accessibility",
  ],
  Backend: [
    "Node.js",
    "Express",
    "REST APIs",
    "Clerk Auth",
    "RBAC",
    "Webhooks",
    "Cron",
    "Stripe",
    "Prisma",
    "Redis",
  ],
  Databases: ["PostgreSQL", "MySQL", "MongoDB", "Supabase"],
  "Cloud & DevOps": ["AWS", "Vercel", "Docker", "CI/CD", "GitHub Actions"],
  Testing: ["Jest", "React Testing Library", "Cypress", "API Testing"],
};

// Marquee items with brand-ish colors. Keep small + readable.
export type MarqueeItem = { label: string; color: string };
export const marqueeStack: MarqueeItem[] = [
  { label: "OpenAI", color: "#10A37F" },
  { label: "Anthropic", color: "#D97757" },
  { label: "Gemini", color: "#4285F4" },
  { label: "MCP", color: "#E85D2D" },
  { label: "RAG", color: "#7B8B6F" },
  { label: "Vercel AI SDK", color: "#0A0A0A" },
  { label: "TypeScript", color: "#3178C6" },
  { label: "Next.js", color: "#0A0A0A" },
  { label: "React", color: "#149ECA" },
  { label: "Node.js", color: "#3C873A" },
  { label: "Postgres", color: "#336791" },
  { label: "Redis", color: "#DC382D" },
  { label: "Tailwind", color: "#06B6D4" },
  { label: "AWS", color: "#FF9900" },
  { label: "Docker", color: "#2496ED" },
  { label: "Prisma", color: "#2D3748" },
];

export const sections = [
  { id: "home", label: "Index", number: "00" },
  { id: "about", label: "About", number: "01" },
  { id: "experience", label: "Experience", number: "02" },
  { id: "projects", label: "Work", number: "03" },
  { id: "skills", label: "Toolkit", number: "04" },
  { id: "writing", label: "Writing", number: "05" },
  { id: "contact", label: "Contact", number: "06" },
];
