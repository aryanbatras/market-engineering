# Data entry modes

Three ways in. This document defines how they behave, what they produce, and how they interact.

---

## The design problem

Collecting portfolio data by hand takes longer than users will tolerate. But everyone has different amounts of data in different formats, and no single import covers everyone.

**PDF resume parsing is the obvious answer and it is not available.** Indian resumes lean on Chronology formatting, two-column and table layouts, decorative headers with logos, and inconsistent date formats. Without an LLM doing the extraction — which R1 forbids and privacy forbids — reliable parsing is not achievable. See `../04-research/library-decisions.md`.

So we work with what exists:

1. **YAML** — the user or their LLM structures it. The default.
2. **GitHub** — real data already structured. The fast path.
3. **Manual form** — slow but universal.

---

## Merge model

**Not a precedence race.** This is the most important rule in this document.

- **Identity fields — YAML or manual. The user picks one.** They are not merged with each other. Choosing YAML does not merge with choosing the form.
- **GitHub is an additive namespace.** It contributes projects, repositories, languages, and profile metadata. It never writes to identity, education, or contact fields.
- **GitHub never overwrites.** If a user imports GitHub and later pastes updated YAML, their projects stay.
- **Provenance is tracked per field** — `yaml`, `manual`, or `github` — so the UI can show where a value came from and offer an explicit override.

**Why not last-write-wins:** it silently destroys data. A user who imports GitHub, then pastes YAML, loses their projects without being told. That is a data-loss bug that would surface as "my projects disappeared" and it would cost us the user.

**Why provenance at all, if GitHub never overwrites:** because the user still needs to correct or replace a GitHub-derived project description, and because the UI must be able to explain where a value came from when it looks wrong.

---

## Path 1 — YAML paste

**The default and the documented path.**

### Why YAML over JSON

Human-readable. An LLM produces it reliably when given a clear schema and an example. JSON is more compact and hostile to hand editing, which matters when the audience cannot code.

**Both YAML and JSON are accepted.** JSON costs nothing to support and some users will already have a `.json` file. YAML is what we document and prompt for.

### The prompt we ship

Four of them, behind one **Copy for LLMs** menu in the builder header:

| Option | What it does |
|---|---|
| **Resume to YAML** | The full conversion prompt. Paste a resume, get YAML back. |
| **Fix my YAML** | Paste YAML you have already written. Corrects the shape, never the content. |
| **Tailor to a job** | Same facts, reordered and reworded for one posting. |
| **Fit one page** | Cuts to what survives one page. Never invents to fill space. |

The first is the base prompt:

> Here is my resume. Convert it to the portfolio YAML format defined below.
> Keep my wording where it is accurate.
> Do not invent projects, employers, dates, or skills.
> Leave a field out rather than guessing.

Two lines are load-bearing. **"Do not invent"** — models will fabricate a plausible internship, and a fabricated project is worse than a missing one because it can cost the user a job. **"Leave it out rather than guess"** — gives correct behaviour under uncertainty instead of confident fabrication.

**We do not run any of them.** No model runs on our side, at import or at any point. Every one of these prompts is copy-to-clipboard, and the user pastes it into whatever they already pay for. That is the whole reason the product works on a hobby tier (R1), and it is also why "resume to YAML" is a menu item rather than a button.

### Validation

```
parse     → yaml.parse, errors carry line and column
validate  → the same Zod schema, client-side
surface   → field path + what is expected + the line number
```

Errors are specific. "That line under `education` needs `institution`" is useful. "Invalid YAML" is not.

The user keeps their text. A failed parse never clears the editor.

---

## Path 2 — GitHub import

**The fastest path to a real portfolio.** Aarav's route.

### What we fetch

- Profile: name, bio, avatar, location, company, website
- Repositories: name, description, URL, language, stars, topics, dates
- Language statistics, aggregated
- Pinned or most-starred repositories, unless the user selects manually

### Implementation

`@octokit/graphql` in a single request. Authenticated, so 5,000 requests/hour per user — ample for a one-time import.

**Rate limits are per user, not per user of ours.** Our import consumes the user's own quota. With a GitHub App or OAuth App we hold our own quota and are not competing with the user's other tools.

### Import behaviour

- Fetches, then **shows the user what it found before applying it.** Auto-applying a list of projects the user did not choose is presumptuous.
- Only non-forked repositories with a description. Forks and `dependabot` noise are filtered out.
- Each imported project is tagged `github` provenance so it can be overridden or hidden.
- **Import can be re-run** to pick up new repositories. Existing projects are updated, not duplicated, and anything the user edited is never overwritten.

### The disconnect trap

Disconnecting GitHub **must not delete imported projects.** They are now the user's portfolio content. Deleting them would be a data-loss bug dressed up as a privacy feature.

Disconnect removes the authorisation. The content stays. Copy says exactly that.

---

## Path 3 — Manual form

**The skip path.** Meera who does not want to touch YAML, Rohit who has never heard of YAML.

Presented as an **equal option**, never as a fallback or a lesser path. A user who lands here should not feel they have taken a wrong turn.

### Design

- One column. Labels above fields. No clever layouts.
- Progressive disclosure — the form opens with name and headline, then the sections they fill.
- The form writes into the same schema as YAML, so both paths produce identical data structures.
- Nothing is required except a name.

### Validation

The same Zod schema, running on blur for a field and on submit for the form. Error text sits below the field, states what is wrong and what is expected, and never appears as a red border with no message.

### Autosave

**Drafts persist in `localStorage`.**

They are not in the database until the user publishes, because pre-publish users are anonymous by design. A user who closes the tab and returns to an empty builder has learned that our product loses their work, and they will not trust it with a real portfolio.

---

## Path 4 — PDF resume import

**Gated. Not in v1.**

Enters only if it clears every criterion in `../04-research/library-decisions.md`: correct reading order on real Indian resume layouts, acceptable field-mapping accuracy, and **no LLM involvement**. If good extraction needs a model, the feature is dead — R1 forbids the cost, and it would mean uploading resume PII to a third party.

If it does not clear the bar, it does not ship, and we say so plainly rather than shipping something that half-works.

**The alternative we prefer:** LinkedIn data-export import. The user downloads their own archive from their own account and uploads it. No scraping, no ToS exposure, no third party, and richer than a PDF. Reactive Resume already ships this, so it is proven. Scoping is open.

---

## The schema

One document, two render targets. Everything that has ever been built for this product — the portfolio at `/p/[handle]`, the PDF, the `.tex`, and both previews — comes out of `portfolio.schema.ts`.

**One entry point.** `/start` asks which output the visitor came for, and routes them to the matching gallery. After that the YAML editor, the field guide, the parse result and the error copy are identical in both editors. There is no "portfolio data" schema and no "resume data" schema, and there is never going to be one, because the user's résumé is the same facts whether it renders as a page or as a page of paper.

**What is deliberately not in it.** No `languages`. No `proficiency`. No self-assessment of anything. R22 in `AGENTS.md` covers why: a field a campus recruiter never reads makes the document worse, and completeness for its own sake is not a feature.

```
YAML paste ──┐
             ├──→ validate (Zod, client) ──→ preview ──→ publish ──→ Supabase
Manual form ─┘
GitHub ──────┴──→ fetch ──→ review ──→ merge (additive) ──┘

Draft state ──→ localStorage, until publish
The database is written once, on publish. Not on every keystroke.
```

The same validated document feeds the resume renderer. Nothing is re-entered, nothing is re-mapped, and nothing is asked for twice.

Writes happen on publish and on explicit save. Not continuously. Database egress is metered at 5 GB/month and every write competes with the cached reads that keep public portfolios fast. We spend it on user actions, not on them existing.

---

## Edge cases to handle

| Case | Behaviour |
|---|---|
| YAML with a key we do not recognise | Warn, ignore, keep the rest. Never reject the whole file. |
| YAML with a `languages` or `proficiency` key | Ignored like any other unrecognised key. We never defined those fields. See R22. |
| GitHub returns nothing usable | Say so and point at the other two paths. Not an error state. |
| User connects GitHub, then pastes YAML | GitHub projects remain. Identity fields come from YAML. |
| User pastes YAML twice | Second paste overwrites the first. Warn if the first had content. |
| User disconnects GitHub | Authorisation removed. Imported projects kept. |
| User wants to clear one field | An explicit clear, not an empty string that fails validation. |
| Partial YAML | Fine. Only a name is required. Most users will not fill everything. |
| User's YAML is enormous | Rejected with a size limit and a specific message. |

---

## Copy principles

The builder's copy is written for someone who has never configured a data format.

- **"Paste your YAML"** not "Import schema".
- **"Try the form instead"** not "Manual entry".
- **"Connect GitHub to add your projects"** — names the benefit, not the mechanic.
- **Errors state what to do**, not what went wrong. "That project needs a name" beats "Validation failed".

**The header says what the editor is, and nothing else.** No "Your data", no "Import", no "Rendered page" above the preview. The YAML is on the left and the page is on the right in one component, live; a label claiming the obvious is the standard tell of a mockup. The only status text is the parse result, because that is the one thing the user genuinely cannot see.