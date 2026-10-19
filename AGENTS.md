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

## R10 — Mocking is mandatory

Every external dependency is mocked in development: auth, database, payments, everything. A developer must be able to run the entire product, sign in, publish, read back, and hit every state without a single network call.

`NEXT_PUBLIC_APP_ENV=development` serves everything from mock adapters. `production` hits live services. There is no per-feature override, and nothing outside `src/infrastructure/mock/` branches on it.

**This is not testing.** No unit tests, no assertion about internals. We are checking behaviour at the interface.

Full rules in `spec/02-architecture/mocking.md`. `npm run mock:verify` must pass.

---

## R11 — Database, ORM, and API

Database is **Supabase Postgres**, accessed through **Drizzle ORM**. API is Next.js serverless route handlers.

Supabase exposes an anon key intended for the browser. That key is safe **only** because of Row Level Security. We keep the RLS policy surface as small as possible, and every table that is not explicitly public-by-design is unreachable from the anon key. Service-role credentials are server-only and never reach a client component.

---

## R12 — Research before building

Think hard about libraries that already exist before implementing anything ourselves. Do proper web research. Do not reinvent what exists.

For portfolio and resume work, a great deal of prior art already exists on GitHub. Favour repositories that are open source and free for commercial use.

---

## R13 — The template runtime must be solved properly

Running React portfolio templates inside our own Next.js application is the hardest engineering problem in this product. It must be highly stable and highly efficient.

Plan it properly before building on top of it. See `spec/02-architecture/template-runtime.md`.

---

## R14 — Layering

`app/` is a thin routing and HTTP contract layer only. No business logic, no data access, no styling decisions.

Three source folders sit alongside it:

- `application/` — hooks, business logic, forms, context, state, orchestration, validation
- `presentation/` — styling, design system, components, templates
- `infrastructure/` — API clients, backend-for-frontend adapters, external service integrations, persistence

Dependencies point inward. `presentation` and `application` never import from `infrastructure` directly; they go through application-layer ports.

Every one of those folders is further divided by domain. See R18.

---

## R15 — Never assume

If you are not sure about anything, ask first.

Do not proceed on an assumption that could send the implementation in the wrong direction. This applies to product decisions, architecture, library choices, and design alike.

---

## R16 — Specification before code

The repository contains `AGENTS.md`, `DESIGN.md`, and `spec/`.

Order of work: rules first, then research, then specification. Implementation follows the specification, not the other way around.

---

## R17 — Build order

When resuming work, the correct sequence is:

1. `AGENTS.md`
2. `DESIGN.md`
3. Research (`spec/04-research/`)
4. Specification (`spec/01`–`spec/03`, `spec/05`)
5. Scaffold and toolchain, including lint rules enforcing R5, R7 and R18, and the mock layer
6. Template runtime spike (R13) — this gates everything downstream
7. YAML to publish end to end
8. Portfolio templates
9. Recruiter surfaces
10. Monetisation
11. Resume: spec, schema extension, LaTeX compiler, ATS check, export
12. Domain migration (R18) — `core`, `portfolio`, `resume`
13. v1.5 block editor

Steps 1 through 7 are done, and so is step 12. Steps 8 and 9 are in progress.

**Step 11 is partially done.** The spec, the schema extension, the LaTeX compiler, the ATS check, the editor and the layout gallery all ship and pass every gate. The PDF engine ships too — `direct-pdf-compiler.ts` writes the PDF bytes from the same layout descriptor as the `.tex` and the preview, so the download is the document and not a placeholder. Every page is still verified through `unpdf` before it is offered.

**The two editors now share one shape.** Both open at the same place, use the same field guide, the same YAML editor, the same header, and the same "make it the other one" button. The resume adds a second view, a continuous size panel and a layout dropdown on top of that. Anything that appears in one editor and not the other is a bug in the one that has it.

---

## R18 — Three domains, and only one direction between them

The codebase is divided into **domains**, and every layer folder is split by domain:

```
src/
  app/          composition/  application/  infrastructure/  presentation/
       core/           core/         core/           core/            core/
    portfolio/      portfolio/     portfolio/     portfolio/       portfolio/
      resume/         resume/        resume/        resume/          resume/
```

**The three domains:**

| Domain | Owns |
|---|---|
| `portfolio` | The website. Portfolio templates, the builder, `/p/[handle]`, publishing, GitHub import |
| `resume` | The document. LaTeX compilation, the layout descriptor, the ATS check, PDF and `.tex` export |
| `core` | What both genuinely share: auth, database, media, site config, the design system, the code editor, the output-choice page, the LLM prompt set, SEO |

**The rules:**

1. **`portfolio` and `resume` never import each other.** Not "rarely", not "with care" — never. Neither by path, neither through a type, neither through a shared barrel.
2. **`core` imports nothing from `portfolio` or `resume`.** It is the bottom of the graph, not a place to park things that do not fit elsewhere.
3. **A shared concept belongs in `core` only after both domains actually need it.** Moving something to `core` is a commitment that a third thing will not need to change it. Premature sharing is the failure mode, not duplication.
4. **The only thing the two domains are allowed to share is the `Portfolio` type itself**, declared in `application/portfolio/portfolio.schema.ts` and imported as a type. The resume domain reads it; it never writes it.

**Why this shape.** The portfolio and the resume are two render targets off one document. That is a real relationship, but it is a *narrow* one, and every line of code that couples them is a line that has to be understood when either one changes. The failure this prevents is concrete: a resume layout change quietly reflowing a published portfolio page at `/p/[handle]`. That is the bug R18 makes structurally impossible rather than merely discouraged.

**The exception, named precisely.** The resume domain reads three paths from the portfolio domain: `portfolio.schema`, `parse-portfolio.ts` and `preview-portfolio.ts`. That is the document and the code that produces and validates it. Everything else the resume needs, the resume owns — a shared helper appears in `core` only once a second domain needs it, never because it looked reusable.

**`app/` stays flat.** Next.js maps folders to URL segments, so `/resume` must live at `src/app/resume/`. Routing is the one place a folder name is dictated from outside; the domain rule governs the four folders that own code.

**Enforcement.** An ESLint `no-restricted-imports` rule per layer and per domain, mapping the cross-domain forbiddance above. A rule that is not enforced is a suggestion. Full model in `spec/02-architecture/domain-model.md`.

---

## R19 — A generated document must survive a parser

We generate PDF documents that hiring software reads. A resume that looks correct and parses as noise has failed at the only job it has.

Three rules, binding on anything that emits a PDF:

1. **No ligature, no icon font, no symbol glyph in the text layer.** Every generated preamble ships a ToUnicode mapping so glyphs extract as their letters. Every layout uses plain text where a glyph would otherwise go. This is not a preference — it is the difference between "efficient" being found by a keyword search and being silently missed.
2. **The PDF is generated directly, not by an engine.** There is no browser LaTeX engine to install, and there is no server-side one we are allowed to run. The PDF comes out of the same layout descriptor as the `.tex` and the preview. **If someone proposes reintroducing an engine, the file-size and first-download cost lands on the phone traffic in `DESIGN.md §12`, not on a desktop.**
3. **Every document is verified before it is offered.** The generated PDF's text layer is extracted with `unpdf` — the same class of tool a real ATS uses — and diffed against the source. `npm run mock:verify` asserts the name, the email, the dates, every heading and the absence of ligature damage, across all ten layouts.

Full checks in `spec/02-architecture/resume-compilation.md`.

---

## R20 — A control that does not change the output is a lie

Every control in the editor must measurably change what comes out.

A font-size selector that resizes the preview but leaves the PDF identical is worse than no selector, because it teaches the user that the product's controls are decorative. The same applies to any future setting, any "quick action", and any toggle.

`npm run mock:verify` asserts each control against the generated bytes: the margin moves the text origin, the font scales the type, the section gap moves the second heading. When you add a control, add its assertion in the same change.

---

## R21 — The resume is a document, and a document is continuous

The resume is not a template with three presets. A resume is a typeset page, and the things that change a page — the type size, the space between sections, the space between entries, the page margin, whether a heading carries a rule, what a bullet looks like — are **numbers**, not choices.

So the resume editor exposes them as continuous sliders, not as `small / medium / large`. Every one of them writes straight into the generated `.tex` and the generated PDF, exactly as if the user had typed the value into the LaTeX themselves. Nothing about the layout or the structure of the document is affected by any of them; they are page metrics, and that boundary is what keeps them safe.

**This replaced an earlier rule that capped the resume at three controls.** That cap was wrong, and the reason it was wrong is worth keeping: it treated the document as a picture of a document. Someone who has a specific page in their head — a recruiter who has seen one page fit it — cannot reach it through three presets, so they download the `.tex` and fight LaTeX on Overleaf. A slider is twenty seconds. The presets were not simplicity, they were a wall.

**The portfolio keeps its cap.** Three controls — accent, density, dark. A portfolio is a screen, not a page, and a screen is a composition somebody already designed. R22 is the adjacent rule on what a thing is called.

**The boundary, exactly:** a metric may change size, spacing, a rule, or a mark. A metric may not change the layout's composition, the order of sections, which sections appear, or the column count. That is the difference between tuning a document and designing a template, and the second one is what the layout picker is for.

---

## R22 — Name things the way the world already names them

Every portfolio template and every resume layout carries **the name of something that already exists in the wild**. Jake's Resume is called Jake's Resume. Deedy is called Deedy CV. AltaCV is called AltaCV.

The reason is not homage. It is retrieval. A student who has seen a layout, or a recruiter who has seen it forty times, searches for that name. An invented name matches nothing, ranks against nothing, and has to be explained. The name *is* the distribution.

The corollary, and it binds harder: **we do not invent a category the user did not ask for.** There is no "languages spoken" field on a resume for an engineering student in Bengaluru. There is no proficiency scale, no proficiency bar, no self-assessment. A field that a recruiter at an Indian campus will never read is a field that makes the document worse, and adding it is not a neutral act of completeness.

**Every layout name is the upstream project's name, spelled the way that project spells it.** When we add a layout, we ship the name people already type into a search box.

**And a layout is a set of traits, never a name.** Every visual difference between two layouts comes from typed fields on the spec — `nameStyle`, `headerAlign`, `headlineStyle`, `contactSeparator`, `headingCaps`, `headingStyle`, `entryStyle`, `bulletStyle`, `headerRule`, `railTint`, `railWidth` — and from nothing else. A renderer that branches on a layout's id is a bug with a timer on it: rename the layout, the branch silently goes dead, every layout renders identically, and nothing fails. It happened. **Every difference between two layouts has to survive a rename.**

---

## R23 — One account surface

The signed-in name in the nav is the **only** route into the account. It goes to `/dashboard`. The dashboard header shows the same name pointing at `/dashboard`.

There is no `/settings` route, and no "Dashboard" button sitting next to it. Two surfaces that show the same account facts are two places to forget to update, and the second one is always the one nobody looks at.

Account actions are for signed-in users only. Before sign-in there is one action — start building — and it is not a different action depending on state.

---

## R24 — A link is never nested inside a link

No `<a>` inside an `<a>`, and no `<Link>` inside a `<Link>`. It is invalid HTML, React reports it as a hydration mismatch, and the result is a browser guessing which element a click belongs to.

**A card is a link only when the card is a link.** Where the card's contents carry their own links — a live template preview with a nav rail and three social buttons — the card's target is a click handler on a non-interactive element, and the contents are inert. A render of a template inside a gallery or a picker runs in preview mode, where every internal anchor becomes a `<span>`.

A `<button>` inside a `<Link>` is the ordinary way to style a link as a button and is not what this rule is about. That is one control wearing two costumes, not two controls. What is banned is two controls: a link inside a link, where the inner one is unreachable and the outer one is unclickable where it appears to be.

**This is not only an HTML rule.** It is the rule that nobody clicks something that looks clickable and does nothing. Nested anchors produce exactly that, in the DOM and in the mind.
