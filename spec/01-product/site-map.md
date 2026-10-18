# Site map

Every page, what it is for, and what it must do. Founder-specified, built as a conventional SaaS surface.

---

## Marketing

| Route | Purpose | Single job |
|---|---|---|
| `/` | Home | Make a stranger understand that text becomes a website, in eight seconds, without reading |
| `/features` | Capabilities in full | Answer "what does it actually do", for someone already convinced by the hero |
| `/pricing` | Three tiers | Let someone decide and start paying without a support email |
| `/templates` | Gallery | Help someone recognise which template is theirs |
| `/templates/[slug]` | One template | Let someone preview it live, with their own data, and commit |

### Navigation

**Features · Templates · Pricing** — then **Sign in** and one action, **Start building**.

Plain bar. Wordmark left, three links, one action. No bar chrome, no dropdowns in v1, no mega-menu. The footer carries Privacy, Terms, Contact, and the wordmark at full width.

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
| `/builder` | Required | The editor. Opens without auth for anonymous preview; auth is required only to publish. |
| `/builder/template` | Required | Template choice and preview |
| `/builder/settings` | Required | Handle, accent, density, dark mode |
| `/dashboard` | Required | Portfolio status, share, download PDF |
| `/dashboard/billing` | Required | Plan, payment method, cancel |
| `/dashboard/data` | Required | Export YAML and JSON. Delete account. |

## Resume

| Route | Auth | Purpose |
|---|---|---|
| `/resume` | — | The resume editor. Opens without auth, like the builder. |
| `/resume/templates` | — | The ten layouts, previewed with the user's own data |
| `/resume/check` | — | The ATS result. Reachable from the editor, and a URL so it can be shared |

**Not in the nav.** The resume is reached from the builder and the dashboard. It is the same document rendered a second way, and a nav entry would imply it is a second product.

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

---

## What we are not building

- **Multi-page marketing sprawl.** Twelve pages, not thirty. Every page we do not build is a page we do not have to keep fast.
- **Blog and content marketing** in v1. It is a channel, not a page, and it needs nothing from us to start.
- **Custom domains** in v1. `/p/<handle>` is the whole model. Custom domains need a different hosting story and they are a paid-tier conversation much later.
- **A dashboard with more than one tab.** Four settings screens, all in one place.
- **A live LaTeX editor.** The `.tex` downloads and compiles anywhere. Editing TeX in our editor with a live preview is a separate feature.
- **Resume tailoring.** Rewriting bullets for a job description needs an LLM, and we do not have one (R1).