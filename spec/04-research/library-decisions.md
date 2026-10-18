# Library decisions

Every dependency, why it was chosen, and what was rejected. A library enters this list only after research, not because it was already installed.

---

## Core stack

| Concern | Choice | Rejected | Why |
|---|---|---|---|
| Framework | **Next.js (App Router)** | Remix, Astro | Required by R2. Also gives us RSC for the read-only public route, which is how we satisfy the never-write-on-view constraint. |
| Language | **TypeScript**, strict | — | Non-negotiable with a schema-driven contract. |
| Styling | **Tailwind CSS v4** | CSS Modules, vanilla-extract, styled-components | v4 is CSS-first (`@theme`, `@utility`, `@source`) and shadcn/ui is native to it. Zero-runtime is critical for the template bundle budget. |
| Components | **shadcn/ui** | HeroUI components, Mantine, Chakra | R8 mandates a popular library. shadcn gives us ownership of the source, which matters because our templates must stay closed-source. See the note below. |
| Auth | **Supabase Auth** | Clerk, Auth.js, Better Auth, Firebase | R9. Google and GitHub social login, email for automated testing, 50k free MAU, and it ships in the same product as the database. One dependency instead of two. |
| Database | **Supabase Postgres** | Turso, Neon, PlanetScale | R10. `jsonb` fits our access pattern (few large documents, not heavy relational joins). Row Level Security means the database enforces access even if we ship a bug, which is stronger than a purely server-mediated design. |
| ORM | **Drizzle ORM** | Prisma, Kysely, Supabase client directly | First-class Postgres dialect, typed schema, migrations with no engine binary. Closer to the SQL than Prisma, which matters because Postgres-specific features like `jsonb` operators and partial indexes are how we hit our constraints. |
| Validation | **Zod** | Valibot, Yup, Joi | Single source of truth for the portfolio contract. It generates both the JSON Schema and the prompt we hand users' LLMs. One definition, three consumers. |
| YAML parsing | **`yaml`** | `js-yaml`, `gray-matter` | Maintained, spec-compliant, zero deps, good error positions (we show line numbers in the paste box). |
| Payments | **Razorpay** + `razorpay` + `razorpay-subscriptions` | Stripe, Lemon Squeezy, Polar, Clerk Billing | Founder decision. India-first, UPI-first. Clerk Billing is Stripe-only and therefore unavailable. |

### Why shadcn/ui and not HeroUI components

Both are excellent. Running both means two Radix-wrapped primitive sets competing for the same roles, with inconsistent focus rings, radii, and shadows, plus a doubled bundle.

We take **HeroUI's design metrics** — radius multiplier scale, transparent borders by default, low-opacity shadow stack, OKLCH authoring, semantic colour naming — and implement them in **shadcn/ui components we own**. Target appearance and component substrate are separate decisions.

We also *need* to own the component source. Our portfolio templates are the product; we cannot ship third-party component source as our closed-source differentiator.

---

## Design

| Concern | Choice | Rejected | Why |
|---|---|---|---|
| Display **and** text | **Geist** | Inter, General Sans, Space Grotesk, Instrument Sans | Founder-pinned: Vercel's typeface. One family for display and body, which halves the font payload and removes the pairing question entirely. Weight 800 carries the display work. |
| Utility | **Geist Mono** | JetBrains Mono, IBM Plex Mono | Code and technical values only, never as decoration. |
| Icons | **React Icons** (Lucide family) | Phosphor, standalone Lucide, Heroicons | Founder-pinned. MIT, enormous catalogue, excellent tree-shaking with per-icon imports. The cost is that it aggregates multiple families with differing stroke weights, so DESIGN.md pins us to `react-icons/lu` and forbids mixing. |
| Class composition | **`cn` (clsx + tailwind-merge)**, `cva`, `tailwind-variants` | — | Required by R7. `tailwind-variants` when a component has many slots and variant cross-products. |
| Animation | **GSAP** | — | Founder decision. Scroll choreography. All plugins now free. |
| State animation | **Motion** (framer-motion) | — | Component enter/exit, layout transitions. |
| 3D | **React Three Fiber + drei** | Raw three.js | R3F's React reconciler model fits our component architecture. |
| Smooth scroll | **Lenis** | — | Optional per template, never global — it fights accessibility if applied blindly. |
| OG images | **`next/og`** | `satori` standalone, `html-to-image` | Built in, runs at the edge, no extra service. |

---

## Data and ingestion

| Concern | Choice | Rejected | Why |
|---|---|---|---|
| GitHub API | **Octokit** (`@octokit/rest` + `@octokit/graphql`) | Raw `fetch` | Handles auth, rate-limit headers, retries, and ETags. `@octokit/graphql` in one request fetches profile + repos + languages. |
| Contract schema export | **`zod-to-json-schema`** | Hand-writing JSON Schema | Guarantees the schema we publish and the schema we validate against never drift. |
| Server validation | **Same Zod schema** | Trusting client | The client validates for fast feedback; the server re-validates because it must. |

### PDF resume parsing — **gated, not committed**

Standing decision: **v1 ships without PDF resume import.** It enters only if it clears the bar below.

The bar is deliberately high because our users' resumes are genuinely hard: Indian formats lean on Chronology style, two-column and table-based layouts, decorative headers with logos, inconsistent date formats, and sometimes scan-only PDFs with no text layer at all.

Candidates evaluated:

| Library | Verdict |
|---|---|
| `pdfjs-dist` | Solid text extraction. Reading order on two-column and table layouts is where it falls down. Client-capable, no serverless cost. |
| `unpdf` | Serverless-friendly wrapper over pdf.js. Removes the `canvas` native dependency problem in Lambda. Worth using if we go server-side. |
| `mupdf-js` | Stronger layout reconstruction than pdf.js. WASM, heavier payload. |
| `Forme` | Reactive Resume uses this for PDF rendering. Prior art for our *export* surface. |
| Docparser / Affinda / ResumeParser.ai | Paid. Rejected under R1, and they require uploading user PII to a third party. |

**Promotion criteria — all must hold:**

1. Correct reading order recovered from two-column and table layouts on a test corpus of ~30 anonymised real Indian resumes.
2. Field mapping (name, education, experience, projects, skills) at a hit rate we are willing to state publicly.
3. Achievable **without an LLM**. If good extraction requires an API call, the feature is dead on arrival — it violates R1, introduces per-user cost, and means uploading resume PII to a third party.
4. Client-side execution preferred, so resume data never lands on our servers.

If the corpus fails these, the feature stays out and we say so plainly rather than shipping something that half-works.

**The alternative we like more:** LinkedIn data-export import. Users download their own archive from their own account and upload it. No scraping, no ToS exposure, no third party, and it is richer than a PDF. Reactive Resume already ships this, so it is proven. Scoping in `prior-art.md`.

---

## Future / v1.5

| Concern | Choice | Rejected | Why |
|---|---|---|---|
| Block editor | **`@dnd-kit`** + bespoke block schema | GrapesJS, Craft.js, Builder.io SDK | Our blocks are highly bespoke (Spotify, YouTube, weather, project cards). Generic editors fight bespoke content and drag in a large WYSIWYG runtime. `devPortfolio`-class projects that did this are Bootstrap-era and unmaintained. |
| Multiplayer drag preview | **`@dnd-kit` multi-container** | — | Handles cross-list moves, which the editor needs. |
| JSON Schema validation | **`ajv`** | — | Only if we start validating against the published JSON Schema server-side. |

---

## Explicit non-dependencies

- **No AI SDK.** No `ai` package, no OpenAI/Anthropic client, no spend. We ship the prompt and the schema; the user brings their own model. This is R1 and D8 both.
- **No PDF/DOCX generation library** for v1. `next/og` covers OG images; the PDF surface follows the Forme precedent once we have real data shapes.
- **No analytics SDK that writes to our database.** Supabase Free meters egress at 5 GB/month, and page views are the highest-volume event we have.
- **No component library alongside shadcn/ui.**

---

## Rules for adding a dependency

1. Research whether it already exists (R11). We do not hand-roll what is solved.
2. Confirm the licence permits commercial use. Record it in `licenses.md`.
3. Confirm it runs on the hobby tier within the cost ceilings in `spec/03-business/cost-model.md`.
4. Confirm it works in the App Router and does not require a Node runtime we cannot use on Vercel.
5. Prefer a dependency we can vendor and own over one we merely depend on — our product's value is closed-source templates.
6. If it adds bundle weight to the template runtime, it must be lazy-loadable and declared in the template's `meta`.