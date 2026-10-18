# Market Engineering

Turn the work an engineer already has into a portfolio that makes recruiters take them seriously.

India-first, tier-2 and tier-3 engineering colleges. Closed source, hobby-tier infrastructure, ₹83/month.

---

## Start here

| Document | What it is |
|---|---|
| **[AGENTS.md](./AGENTS.md)** | The 16 binding rules. Read before writing any code. |
| **[design.md](./design.md)** | The design system. Binding, with the anti-slop blacklist in §12. |
| **[spec/](./spec)** | Requirements, architecture, research, business model. |

## The problem

Roughly 90% of engineering students in tier-2 and tier-3 colleges cannot present what they can do. Not a capability gap — a translation gap. They have projects, internships, and degrees, and no way to turn scattered unstructured content into something a recruiter takes seriously.

The advice "just make a portfolio" fails them twice: it assumes they know what a good one looks like, and that they can build one.

## The product

A single portfolio generator. Paste YAML, connect GitHub, or fill a form. Pick from five templates. Get a live URL at `/p/<handle>` with JSON-LD, an OG image, and a PDF export.

The portfolio generator is the wedge. Resume tailoring, LinkedIn framing, content, and video follow on the same subscription.

## Architecture in one paragraph

Next.js App Router on Vercel. `app/` is a thin routing and HTTP contract layer; `application/` holds use cases, hooks, and ports; `presentation/` holds design, components, and the five portfolio templates; `infrastructure/` holds Clerk, Turso, Razorpay, and Octokit adapters. Clerk for auth, Turso for data, Razorpay for billing. Templates are versioned React modules behind a precompiled registry, each a pure function of `(data, config)`, each isolated so the 3D template's weight never taxes the others.

## Current status

Design and specification. Nothing built yet.

Per R16, the build order is: rules, design, research, spec, scaffold, **template runtime spike**, then YAML-to-publish, templates, recruiter surfaces, monetisation, and the v1.5 block editor.

## Current constraints

- **Turso is the binding limit.** 10M writes/month, roughly 3.8/second, and exceeding any limit *blocks the database*. The public route never writes on view. This is why.
- **Clerk Billing is Stripe-only**, so we use Razorpay and build our own entitlements.
- **No AI API.** Zero inference spend, and user data never leaves their device.
- **PDF resume import is gated** on proving ATS-grade extraction from real Indian resume formats without an LLM. If it cannot clear that bar, it does not ship.

## Licence

Private and closed source. © Market Engineering.