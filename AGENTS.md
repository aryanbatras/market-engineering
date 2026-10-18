# AGENTS.md

Binding rules for this repository. These are hard constraints, not suggestions. If a task appears to require breaking one of these rules, stop and raise it with the founder before writing code.

---

## R1 — Hobby tier until revenue

We stay on free tiers of every paid service until the first paying customer or a substantial base of committed users. No spend on infrastructure, services, or APIs that require payment to build against.

Cost ceilings live in `spec/03-business/cost-model.md`. Any dependency that costs money to run is rejected unless the founder has explicitly lifted R1.

---

## R2 — Closed source, private repo, Next.js on Vercel

The repository is private. The product ships from a Next.js application deployed on Vercel. We do not fork repositories into this codebase and we do not publish our template source.

---

## R3 — Fast to ship, stable at scale

Optimise for the fastest path that still holds up for 10,000 to 50,000 users. A smaller number is fine for now. Correctness and stability beat cleverness.

---

## R4 — Design is a first-class requirement

UI and UX quality is not decoration layered on at the end. It is a requirement with the same weight as functionality.

**Avoid AI slop at all costs.** The full constraints live in `DESIGN.md`, which is binding. Read it before writing any component.

Three hues, no fourth. Two radii, no third. Six type steps, no seventh. Every one of those limits is deliberate: a system with fewer decisions produces more consistent work, and consistency is what reads as expensive.

---

## R5 — No comments, no docstrings

No comments, no JSDoc, no docstrings, no inline explanations anywhere in application code under `src/`.

Self-documenting names are the mechanism. If something needs explanation, it needs a better name or a simpler design.

The only documented artifacts permitted in the repo are:

- `data/portfolio.schema.json` — generated from the Zod schema, never hand-edited
- `data/portfolio.schema.md` — the human and AI readable field guide

---

## R6 — One implementation per file

Code is split aggressively across files and folders. One implementation per file. Clean architecture structure throughout.

---

## R7 — No raw Tailwind in JSX

No raw Tailwind CSS class strings in any HTML tag or JSX attribute.

Component styling lives in TypeScript files as semantic class maps: the key is a semantic name, the value is a Tailwind string.

```ts
export const cardClasses = {
  container: "rounded-lg bg-surface shadow-card",
  title: "text-title-l text-ink",
} as const
```

Composition uses `cn` (clsx + tailwind-merge), `cva`, or `tailwind-variants`.

**Hard constraint:** class values must be static string literals. Tailwind cannot detect runtime-constructed class names, so `bg-${color}-500` silently produces no CSS.

---

## R8 — Component library

shadcn/ui is the component substrate. It is the default and is acceptable for the wide variety of designs we support.

Additional registries are permitted only when they are shadcn-compatible and appear in the MagicUI whitelist in `DESIGN.md`.

---

## R9 — Authentication

Supabase Auth, with Google sign-in and GitHub social login.

Supabase must remain testable with a dummy email and password so that automated agents can log in and exercise authenticated flows end to end. Any auth change that makes this impossible is not permitted.

GitHub sign-in is dual-purpose: identity for login, and the authorisation that unlocks repository import. It is still separate from the Octokit/GitHub App credential used to read repositories, because identity scope does not grant API scope.

---

## R10 — Database, ORM, and API

Database is **Supabase Postgres**, accessed through **Drizzle ORM**. API is Next.js serverless route handlers.

Supabase exposes an anon key intended for the browser. That key is safe **only** because of Row Level Security. We keep the RLS policy surface as small as possible, and every table that is not explicitly public-by-design is unreachable from the anon key. Service-role credentials are server-only and never reach a client component.

---

## R11 — Research before building

Think hard about libraries that already exist before implementing anything ourselves. Do proper web research. Do not reinvent what exists.

For portfolio and resume work, a great deal of prior art already exists on GitHub. Favour repositories that are open source and free for commercial use.

---

## R12 — The template runtime must be solved properly

Running React portfolio templates inside our own Next.js application is the hardest engineering problem in this product. It must be highly stable and highly efficient.

Plan it properly before building on top of it. See `spec/02-architecture/template-runtime.md`.

---

## R13 — Layering

`app/` is a thin routing and HTTP contract layer only. No business logic, no data access, no styling decisions.

Three source folders sit alongside it:

- `application/` — hooks, business logic, forms, context, state, orchestration, validation
- `presentation/` — styling, design system, components, templates
- `infrastructure/` — API clients, backend-for-frontend adapters, external service integrations, persistence

Dependencies point inward. `presentation` and `application` never import from `infrastructure` directly; they go through application-layer ports.

---

## R14 — Never assume

If you are not sure about anything, ask first.

Do not proceed on an assumption that could send the implementation in the wrong direction. This applies to product decisions, architecture, library choices, and design alike.

---

## R15 — Specification before code

The repository contains `AGENTS.md`, `DESIGN.md`, and `spec/`.

Order of work: rules first, then research, then specification. Implementation follows the specification, not the other way around.

---

## R16 — Build order

When resuming work, the correct sequence is:

1. `AGENTS.md`
2. `DESIGN.md`
3. Research (`spec/04-research/`)
4. Specification (`spec/01`–`spec/03`, `spec/05`)
5. Scaffold and toolchain, including lint rules enforcing R5 and R7
6. Template runtime spike (R12) — this gates everything downstream
7. YAML to publish end to end
8. Portfolio templates
9. Recruiter surfaces
10. Monetisation
11. v1.5 block editor
