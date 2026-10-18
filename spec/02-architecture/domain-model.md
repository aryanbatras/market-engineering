# Domain model

The layering in `layering.md` decides which folder a thing goes in. This document decides **which world it belongs to**.

Binding under R18.

---

## The problem this solves

We have two render targets off one document. The portfolio is a website at `/p/<handle>`. The resume is a typeset PDF built from LaTeX.

They share exactly one thing: the `Portfolio` type. Everything else — how a section is laid out, how dates are formatted, what "Experience" is called, how a two-column layout behaves — differs between them, and will diverge further with every feature.

Left alone, that shared type becomes a shared everything. Someone adds a helper for date ranges to the portfolio builder, the resume compiler wants it too, it moves up a folder, then two more things move up with it. Within a year the portfolio and the resume are the same codebase with two entry points, and a resume layout change can reflow a published page at `/p/<handle]`.

That bug is expensive and it is invisible until it ships. So we make it structurally impossible.

---

## The shape

Domain first, layer second.

```
src/
  app/              composition/     application/      infrastructure/     presentation/
    core/             core/             core/              core/              core/
    portfolio/        portfolio/        portfolio/         portfolio/         portfolio/
    resume/           resume/           resume/            resume/            resume/
```

Read the column top to bottom and you get one domain. Read across and you get one layer.

---

## What each domain owns

### `portfolio` — the website

The portfolio is a screen you scroll. Its problems are composition, motion, bundle weight, image loading, and first paint.

| Layer | Contents |
|---|---|
| `app/portfolio/` | `/builder`, `/dashboard`, `/templates`, `/templates/[slug]`, `/p/[handle]`, `/api/og/[handle]` |
| `application/portfolio/` | `portfolio.schema.ts`, `parse-portfolio.ts`, portfolio use cases, `ports/portfolio-repository.ts` |
| `infrastructure/portfolio/` | auth gateway adapters, portfolio repository adapters, Octokit, `next/og` |
| `presentation/portfolio/` | portfolio templates and their registry, the builder, the gallery |

### `resume` — the document

The resume is a page that gets parsed. Its problems are text order, density, glyph coverage, page breaks, and parseability.

| Layer | Contents |
|---|---|
| `app/resume/` | `/resume`, `/resume/templates` |
| `application/resume/` | the resume model, the layout descriptor, the LaTeX compiler, the ATS check, `ports/resume-compiler.ts`, `ports/pdf-text-extractor.ts` |
| `infrastructure/resume/` | the LaTeX engine adapter, the PDF text extraction adapter, its mock |
| `presentation/resume/` | resume layouts and their registry, the resume builder, document sheet primitives |

**The resume domain has its own registry.** It is not a flag on the portfolio registry, not a sixth portfolio template, and not a mode of an existing template. `presentation/portfolio/registry.ts` and `presentation/resume/registry.ts` are separate modules with separate descriptor types, because the two things being registered are genuinely different: one is a React component, the other is a layout descriptor plus a preamble plus a skin.

### `core` — what both actually share

Nothing goes here because it is "common". Something goes here because **both domains already need it and would otherwise duplicate it.**

| Layer | Contents |
|---|---|
| `app/core/` | root layout, global CSS, not-found, error boundaries |
| `composition/core/` | shared adapter resolution |
| `application/core/` | auth session hook, auth port, site config, environment switch, media credits |
| `infrastructure/core/` | Supabase clients, Drizzle database, mock database |
| `presentation/core/` | the design system, motion primitives, the CodeMirror editor, JSON-LD |

**These are all already shared today.** That is the test: if it was in `src/presentation/design/` before the domains existed, it belongs in `core`. If it appeared in one domain and later in the other, it belongs in `core`.

---

## The rules

1. **`portfolio` and `resume` never import each other.** Not by path, not by type, not through a barrel that re-exports one of them.

2. **`core` imports nothing from `portfolio` or `resume`.** It sits at the bottom. A file in `core` that reaches upward is a file in the wrong domain.

3. **The only shared thing is the `Portfolio` type**, and it is imported as a type, from `application/portfolio/portfolio.schema.ts`. The resume domain reads it. The resume domain does not extend it, does not wrap it in a mutable structure, and does not write to it.

4. **If a second thing needs a concept, that is when it moves to `core`.** Not before. Duplication is cheaper than a wrong abstraction, and it is trivially fixed. A wrong shared abstraction is not.

### The one sanctioned exception

`application/portfolio/portfolio.schema.ts` defines the document. `application/resume/` reads its type. That is the entire permitted coupling, and it is a type-only edge.

If the resume genuinely needs data the document does not carry — an ATS keyword, a per-layout ordering preference — it goes in the **resume's own model**, mapped from `Portfolio`. It does not go into the schema for both domains to carry.

---

## Why not one shared "documents" domain

The obvious alternative is to put the schema, the date formatting, and the section vocabulary into a shared domain both import.

Rejected. The section vocabulary is exactly the thing that must diverge — `Projects` is a heading on a portfolio and a two-line entry with a tech list on a resume, and the day someone shares a `SECTION_TITLES` map, the resume starts rendering "Selected Projects" with a sidebar and a recruiter's parser reads it in the wrong order. Shared concepts that are *nearly* shared are the most expensive kind of shared, because they look reasonable and they are wrong.

The one thing genuinely identical is the shape of the data. So that is the one thing that crosses.

---

## Enforcement

The lint config ships the rule in the same change that creates the folders.

```
presentation/resume/**   may not import   presentation/portfolio/**
application/resume/**    may not import   application/portfolio/**      except the type-only schema import
infrastructure/resume/** may not import   infrastructure/portfolio/**
app/resume/**            may not import   app/portfolio/**
**/core/**               may not import   **/portfolio/**  or  **/resume/**
```

The layer rules from `layering.md` apply within each domain exactly as they do now: `presentation` and `application` never import `infrastructure` directly; they go through ports.

A rule that is not enforced is a suggestion.

---

## Migration

The codebase is currently flat. The move is mechanical and lands in one pass, after the resume feature works in place:

```
presentation/templates/**      → presentation/portfolio/templates/**
presentation/builder/**        → presentation/portfolio/builder/**
presentation/marketing/**      → presentation/portfolio/marketing/**
presentation/design/**        → presentation/core/design/**
presentation/motion/**        → presentation/core/motion/**
presentation/code-mirror/**   → presentation/core/code-mirror/**
presentation/seo/**           → presentation/core/seo/**
presentation/auth/**          → presentation/core/auth/**
application/portfolio/**      → application/portfolio/**          (already correct)
application/auth/**           → application/core/auth/**
application/media/**          → application/core/media/**
application/site/**           → application/core/site/**
application/ports/**          → split — see below
infrastructure/**             → split — see below
composition/**                → split — see below
```

**The ports split is the only judgement call.** `application/ports/portfolio-repository.ts` is portfolio. `application/ports/auth-gateway.ts` is core. `application/ports/resume-compiler.ts` and `pdf-text-extractor.ts` are resume. Nothing is moved to core that only one domain uses.

**The composition root splits with it.** `composition/portfolio-queries.ts` is portfolio. Adapter resolution that both domains depend on is core.

Migration order, so the tree is never broken:

1. Move `portfolio/**` into place. Everything still compiles — the domain folders exist but the cross-domain rule is not yet enabled.
2. Move `core/**`.
3. Enable the lint rule. Fix whatever it catches.
4. `npm run gate` green.

Enabling the rule last is deliberate. A rule that fails on day one of a refactor gets disabled by day two.