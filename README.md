# Market Engineering

Turn the work an engineer already has into a portfolio that makes recruiters take them seriously.

India-first, tier-2 and tier-3 engineering colleges. Closed source, hobby-tier infrastructure, ₹83/month.

---

## Start here

| Document | What it is |
|---|---|
| **[AGENTS.md](./AGENTS.md)** | The binding rules. Read before writing any code. |
| **[DESIGN.md](./DESIGN.md)** | The design system for our own surfaces. Three hues, two radii, six type steps. |
| **[PRODUCT.md](./PRODUCT.md)** | Durable product context. Read before designing anything. |
| **[spec/](./spec)** | Requirements, architecture, research, business model. |

---

## The problem

Not a capability gap. A **translation gap**.

Engineering students at tier-2 and tier-3 colleges have projects, internships, and degrees, and no way to turn scattered unstructured content into something a recruiter takes seriously. The advice "just make a portfolio" fails them twice: it assumes they know what a good one looks like, and that they can build one.

## The product

A portfolio generator. Paste YAML, connect GitHub, or fill a form. Pick from five templates. Get a live URL at `/p/[handle>` with JSON-LD, an OG image, and a PDF export.

The portfolio generator is the wedge. Resume tailoring, LinkedIn framing, content, and video follow on the same subscription.

**Free · ₹83/month · Sponsor** — three tiers.

---

## The idea

> On this page, a portfolio being written becomes a live website.

Every competing tool shows a finished page and asks you to imagine your content in it. Our hero is a **working** editor — YAML typing in on the left while the rendered portfolio rebuilds on the right. Not a video. Not a mockup. The product, running, at true size, on our own domain.

---

## Architecture in one paragraph

Next.js App Router on Vercel. `app/` is a thin routing and HTTP contract layer; `application/` holds use cases, hooks, and ports; `presentation/` holds design, components, and the portfolio templates; `infrastructure/` holds Supabase, Razorpay, and Octokit adapters. **Supabase Postgres + Supabase Auth** for data and identity, **Drizzle** for the ORM, **Razorpay** for billing. Row Level Security means the database enforces access even if we ship a bug. Templates are versioned React modules behind a precompiled registry, each a pure function of `(data, config)`, each isolated so the 3D template's weight never taxes the others.

---

## Current status

Design and specification. Nothing built yet.

Per R16, the build order is: rules, design, research, spec, scaffold, **template runtime spike**, then YAML-to-publish, templates, recruiter surfaces, monetisation, and the v1.5 block editor.

---

## Current constraints

- **Egress is the binding limit.** Supabase Free gives 5 GB/month — roughly 125,000 uncached portfolio renders. `/p/[handle]` reads from CDN cache and never queries the database on a hit. This is why.
- **Free projects pause after 7 days of inactivity.** A risk for a seasonal student audience. Mitigated structurally by the cache, fixed properly by upgrading on first revenue.
- **No AI API.** Zero inference spend, and user data never leaves their device.
- **Templates never ship as source.** That is the moat.
- **PDF resume import is gated** on proving ATS-grade extraction from real Indian resume formats without an LLM. If it cannot clear that bar, it does not ship.

## Licence

Private and closed source. © Market Engineering.