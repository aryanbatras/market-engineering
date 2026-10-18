# Data contract

The portfolio schema is the product. Templates, the YAML paste flow, the GitHub import, the PDF export, and the user's own LLM all consume the same definition.

---

## Single source of truth

One Zod schema in `application/portfolio/portfolio.schema.ts` generates three artifacts:

1. Runtime validation — client and server
2. `data/portfolio.schema.json` — machine-readable, published for AI tooling, **never hand-edited**
3. `data/portfolio.schema.md` — the human and AI field guide

One definition, three consumers. They cannot drift.

---

## Why YAML is the primary format

Humans can read and write it. An LLM can produce it correctly from a resume when given a clear example. JSON is more compact but hostile to hand-editing, and the audience is non-technical.

**Both YAML and JSON are accepted.** YAML is what we document and prompt for; JSON is accepted because it costs nothing and some users will have a JSON file already.

JSON Resume is supported for import and export interop. It is not our native format.

---

## Schema shape

```
portfolioVersion      integer, required

identity
  name                string, required
  headline            string          one line, what they do
  photo               string | null   URL
  location            string | null
  email               string | null
  phone               string | null
  availability        string | null   open to work / notice period / etc

links[]               { platform, label, url }   ordered, platform enum

education[]           { institution, degree, field, start, end, current, grade,
                        board, score, details }
experience[]          { organisation, role, location, start, end, current,
                        summary, highlights[], kind }
projects[]            { name, description, url, repo, tech[], image, role, timeline }
skills[]              { name, level?, group? }
languages[]           { name, proficiency }

github                { username, connected, lastSyncedAt }   populated by import

meta                  { handle, templateId, config, publishedAt }
```

### Fields added for the resume

Indian resumes are not US resumes. Four additions, all optional, all additive:

| Field | Why |
|---|---|
| `education[].board` | `CBSE`, `ICSE`, `State Board`, `IB` — recruiters scan for the board by name |
| `education[].score` | `94.2%` and `9.4 CGPA` occupy the same slot and neither parses from the other |
| `experience[].kind` | `internship` \| `full-time` \| `volunteer` — Indian fresher resumes list internships separately from work |
| `languages[]` | Standard on Indian resumes and on essentially no US ones |

**Why these and not more.** The open question below previously leaned toward a generic `highlights[]` for certifications, achievements, publications and awards rather than four typed arrays. That leaning holds — four near-identical arrays is exactly the drift the versioning rules exist to prevent. If `highlights[]` proves too coarse, we add **one** array.

**Both products render these.** A portfolio template can show board and score. Nothing about the addition is resume-specific, which is what one schema buys.

---

## Field design rules

**Every field is either required, optional, or nullable — and the choice is deliberate.**

- `name` is the only truly required field. A portfolio without a name has no reason to exist, and requiring more would block the anonymous-preview flow.
- Dates are strings in `YYYY-MM` or `YYYY` format. Free-form date strings are a permanent source of sorting bugs. Longer formats allow `"2024-03"`, `"2024"`, `"Present"` for `current`.
- `current: true` rather than a `"Present"` sentinel, so filtering by "is this ongoing" is a boolean check.
- External URLs are strings validated as URLs. We never fetch them server-side, so no SSRF surface.
- `tech[]` is a flat string list, not an object with a level. Levels are vanity; the list is what recruiters scan for.
- Every array has a defined empty-state meaning. An empty `projects[]` means "no projects listed", never "failed to load".

---

## Versioning

`portfolioVersion` is required and checked on every read and write.

| Bump | Trigger | Compatibility |
|---|---|---|
| Minor | Adding an optional field | Old data valid, new field absent |
| Major | Removing, renaming, or changing a field's type | Migration function required |

**Rules:**

- Old versions stay valid for as long as portfolios using them are published. We do not break a live URL.
- Each template declares `supportedVersions` in its `meta`.
- A render against an unsupported version is a bug, caught by a fixture test rendering every template against every stored version.
- Version upgrades run through a forward migration in `application/`, never in-place.
- A user does not upgrade until they edit. Their existing published URL keeps rendering on its original version.

### ⚠️ The literal blocks the first minor bump

The schema currently reads:

```ts
portfolioVersion: z.literal(1)
```

A literal accepts exactly one value. The moment we make a minor change — adding `education[].board`, as this document now specifies — there is no way to say "1 or 2", so the schema would reject every portfolio stored before the change. That imposes a major bump's behaviour on a minor bump's trigger, and it contradicts the table directly.

This has never been exercised because no additive change has been made yet. It is fixed as part of the resume work, **before** the first additive field lands:

```ts
const supportedVersions = [1, 2] as const

portfolioVersion: z.union([z.literal(1), z.literal(2)])
```

`data/portfolio.schema.json` and `data/portfolio.schema.md` regenerate from it, as they always do. A published schema advertising `"const": 1` while the code accepts two versions would be the same class of drift the schema exists to prevent.

**The rule this confirms:** a version is a **set of accepted values**, not a single value. Every future minor bump appends to `supportedVersions` and never edits an existing entry.

---

## Provenance

Every field carries a source tag: `yaml` | `manual` | `github`.

This exists because of a specific failure we designed against: a user imports from GitHub, later pastes updated YAML, and silently loses their projects. Provenance lets the UI say "this came from GitHub" and offer an explicit override, rather than clobbering.

**Ingestion is a merge, not a race:**

- Identity fields come from **YAML or manual** — the user picks one. They are not merged.
- GitHub contributes project and repository data. It is an **additive namespace** that never overwrites identity, education, or contact fields.
- The UI shows where each field came from and lets the user override any of it.

---

## The AI prompt

We ship a prompt with the schema that users paste into whatever model they use:

> Here is my resume. Convert it to the portfolio YAML format defined below. Keep my wording where it is accurate. Do not invent projects, employers, dates, or skills. Leave a field out rather than guessing.

Two lines in that prompt are load-bearing:

- **"Do not invent"** — LLMs will happily fabricate a plausible internship. The user's credibility depends on accuracy, and a fabricated project is worse than a missing one.
- **"Leave it out rather than guess"** — gives an explicit, correct behaviour for uncertainty instead of a confident fabrication.

We validate the output client-side with the same Zod schema, so a bad paste fails immediately with a specific message and the offending line number — not a silent partial render.

---

## Validation flow

```
User input (YAML or JSON)
  → parse                     yaml.parse, errors carry line and column
  → validate                  Zod, shared schema, client-side for instant feedback
  → surface precise errors    field path + what is expected
  → submit
  → server re-validates       same schema, never trusts the client
  → normalise                 defaults, ordering, derived fields
  → persist
```

The client validates for speed. The server validates because it must. Both use one schema so they cannot disagree.

---

## Export

Users can always download their data as YAML or JSON, on every tier including free. This is a trust signal and a growth loop — the file mentions us.

Import is also supported. Data ownership is real, not a retention tactic.

---

## Reserved and forbidden content

The schema cannot enforce these. Server-side checks reject:

- Handles that are reserved, profanity, or impersonate a system route
- URLs pointing at our own infrastructure (SSRF and self-reference)
- Content over size limits (a YAML payload is text; it should not be megabytes)

---

## Open questions

- Do we support multiple profiles per YAML (phone numbers, work address)? Leaning no for v1.
- ~~Do we model certifications, achievements, publications, and awards for v1?~~ **Resolved: no typed arrays.** The generic `highlights[]` carries them. See the schema shape above.
- Rich text or plain strings for descriptions? Plain strings, with markdown-subset rendering if needed. Full rich text creates a sanitisation surface and breaks ATS extraction.

## Consumers of this contract

The schema is not only a portfolio contract. It is the single document behind two render targets:

| Consumer | Reads | Writes |
|---|---|---|
| Portfolio templates | the whole document | nothing |
| GitHub import | `github`, `projects`, `skills` | those fields only |
| **Resume layouts** | the whole document | **nothing** |

**The resume reads the document and never writes it.** It maps `Portfolio` into its own model rather than extending this schema, so a layout change cannot alter what a published portfolio contains. The coupling rules are in `domain-model.md`; the projection lives in the resume domain.

**JSON Resume interop** matters more now. A student who maintains a `resume.json` gets both outputs. Import and export it alongside YAML.