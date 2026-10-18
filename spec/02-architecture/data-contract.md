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

education[]           { institution, degree, field, start, end, current, grade, details }
experience[]          { organisation, role, location, start, end, current, summary, highlights[] }
projects[]            { name, description, url, repo, tech[], image, role, timeline }
skills[]              { name, level?, group? }

github                { username, connected, lastSyncedAt }   populated by import

meta                  { handle, templateId, config, publishedAt }
```

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
- Do we model certifications, achievements, publications, and awards for v1? Indian resumes lean on these heavily. Leaning yes as a generic `highlights[]` rather than four typed arrays.
- Rich text or plain strings for descriptions? Plain strings, with markdown-subset rendering if needed. Full rich text creates a sanitisation surface and breaks ATS extraction.