# Site map

Every page, what it is for, and what it must do. Founder-specified, built as a conventional SaaS surface.

---

## Marketing

| Route | Purpose | Single job |
|---|---|---|
| `/` | Home | Make a stranger understand that text becomes a website, in eight seconds, without reading |
| `/features` | Capabilities in full | Answer "what does it actually do", for someone already convinced by the hero |
| `/pricing` | Three tiers | Let someone decide and start paying without a support email |
| `/start` | The first click | Ask which output they came for, then route them to the right gallery |
| `/templates` | Portfolio template gallery | Help someone recognise which portfolio template is theirs |
| `/resume/templates` | Resume template gallery | Help someone recognise which resume layout is theirs |

### Navigation

**Features · Portfolio templates · Resume templates · Pricing** — then **Sign in** and one action, **Start building**.

Plain bar. Wordmark left, four links, one action. No bar chrome, no dropdowns, no mega-menu. The footer carries Privacy, Terms, Contact, and the wordmark at full width.

**The two galleries are separate links because they are separate products.** "Templates" meant both and meant neither; a visitor who wanted a PDF had to guess which label covered it. Naming them apart costs one word and removes the guess.

---

## Legal

| Route | Purpose |
|---|---|
| `/privacy` | Privacy policy. India DPDP requires notice before launch, not after. |
| `/terms` | Terms and conditions. |

Both are written before launch. Both are plain prose, readable by a nineteen-year-old, not assembled from a generator. A terms page nobody can read is a terms page that will not protect us.

They also do real work for us: this product collects student PII in India, and a clear, specific policy is part of earning the right to hold it.

---

## Application

| Route | Auth | Purpose |
|---|---|---|
| `/sign-in` | — | Google, GitHub, or email and password |
| `/sign-up` | — | Same. One screen — we do not need a separate flow |
| `/builder` | — | The portfolio editor. Opens without auth on the template picker; auth is required only to publish. |
| `/dashboard` | Required | **The only account surface.** Portfolio, resume, environment, export. |

`/builder` is two states on one route, not two routes. With no `?template=` it is the picker; with one, it is the editor. A picker that lives at its own URL means the back button after choosing does not return you to the choices, and choosing a template has to feel like one click rather than two.

`/builder/settings` and `/dashboard/billing` and `/dashboard/data` are **not separate routes**. The account is one screen. See R23 in `AGENTS.md`.

## Resume

| Route | Auth | Purpose |
|---|---|---|
| `/resume` | — | The resume editor. Opens without auth, like the builder. |
| `/resume/templates` | — | The ten layouts, previewed with real content |
| `/resume/check` | — | The ATS result. Reachable from the editor, and a URL so it can be shared |

**In the nav.** The resume was hidden while it was a rendering of the builder's output. It now has its own gallery, its own editor and its own place in the nav, and hiding it reads as a secret rather than as restraint.

---

## Public

| Route | Purpose |
|---|---|
| `/p/[handle]` | The published portfolio. The product. |
| `/p/[handle]/resume` | The published resume PDF, generated from the same data |
| `/p/[handle]/resume.tex` | The same document as downloadable LaTeX source |
| `/api/og/[handle]` | Social card, generated per user |

The resume routes under `/p/[handle]` render from the **cached** published record, never touching the database on view — same rule as the portfolio route, for the same reason. An uncached read on view burns the egress budget in about a week.

---

## Error and edge routes

| Route | Behaviour |
|---|---|
| `not-found` | An invitation, not an apology. "That page doesn't exist. Here's what this site does." |
| `/p/[handle]` on unknown handle | 404, not 500 |
| `/p/[handle]` on private portfolio | **404, not 403.** Existence is not disclosed. |
| `/p/[handle]` error | Template-scoped error boundary. One broken template must not affect routing or other templates. |
| Rate limited | Says what to do and when to try again. Not a spinner. |

---

## Language and region

English for v1. i18n structured in from the start — message catalogues, no hardcoded strings — so a bilingual version ships without rework.

We are India-first, and English is the working language of Indian engineering campuses. Language is not the v1 blocker; it is a v2 opportunity.

**This is the product's working language, not a field on the document.** The document schema has no `languages` key and no proficiency scale, and never will. A resume for a Bengaluru engineering student listing "English — fluent, Hindi — native, Tamil — conversational" is noise on a page a recruiter reads for six seconds. Language support in the *product* is a v2 decision about our own UI; language as *resume content* is not ours to invent. See R22.

---

## What we are not building

- **Multi-page marketing sprawl.** Twelve pages, not thirty. Every page we do not build is a page we do not have to keep fast.
- **Blog and content marketing** in v1. It is a channel, not a page, and it needs nothing from us to start.
- **Custom domains** in v1. `/p/<handle>` is the whole model. Custom domains need a different hosting story and they are a paid-tier conversation much later.
- **A second account surface.** One dashboard, one route, one set of facts. See R23.
- **A live LaTeX editor.** The `.tex` downloads and compiles anywhere. Editing TeX in our editor with a live preview is a separate feature.
- **Resume tailoring.** Rewriting bullets for a job description needs an LLM, and we do not have one (R1).
- **Fields nobody reads.** No spoken-language list, no proficiency scale, no self-assessment. See R22.