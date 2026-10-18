# Prior art

What already exists, what we learned from it, and what we deliberately did not take.

Nothing here is forked into our codebase. We read it, understood it, and wrote our own. The licence audit lives in `licenses.md`.

---

## Reactive Resume — `reactive-resume/reactive-resume`

The single most relevant prior art in this space. ~42k stars, MIT, v6 shipping.

**Why it matters:** it is the closest thing to a finished version of the "resume and career documents as structured data" half of our problem, built by a maintainer who clearly understood both the design and the recruitment-side pain.

**What we took:**

| Pattern | What it solved for us |
|---|---|
| Write / Design / Check editor modes | Separation of data entry from presentation from validation. Direct fit for our YAML + form + preview split. |
| Structured style rules, not raw CSS | Confirms the R7 semantic-class approach is a real pattern with precedent, not a personal preference. Reactive Resume v6 describes custom styles as "Semantic CSS with an element picker." |
| Resume Checks | Readability findings pinned to specific lines, job-posting keyword matching, and a view of "the text hiring software reads." That is our exact business problem, already validated as a feature people want. Strong candidate for a later module. |
| Live PDF preview via a background worker | Prior art for our Download-as-PDF surface without blocking the main thread. |
| JSON Resume import | Proves the schema interop path is real and worth supporting. |

**What surprised us:** it imports **LinkedIn data exports**. That is a legal, ToS-compliant answer to the "we cannot scrape LinkedIn" constraint — the user exports their own archive from their own account and uploads it to us. Nobody scrapes anyone.

**What we did not take:** the template set (Pokémon-themed, wrong register entirely for our audience), the job-application tracker (out of scope for v1), the 55-language scope.

---

## JSON Resume — `jsonresume.io`

MIT. The de facto standard for resume-as-data.

**Use:** interop target. We should be able to import and export it even though our native format is YAML. It costs us little and means a user who already maintains a `resume.json` is not locked out.

---

## Portfolio template repositories

All MIT. Useful as design reference and as evidence that our data schema needs to be broad enough.

| Repo | What we learned |
|---|---|
| `BenjaminOff/portfolio` (GitProfile / Shadow) | A complete auto-generated portfolio from a GitHub username alone, in Vite. Best reference for the GitHub ingestion path and for how much a username alone can produce. |
| `ChoJongHoon/develofolio` | TypeScript portfolio editor, MIT. Reference for editor UX sequencing. |
| `akkefa/developer-portfolio` | The classic Bootstrap-era single-page structure. Useful as the baseline archetype our "Classic" template modernises. |
| `lorenzomiscoli/developer-portfolio` | Light/dark theming and one-page section ordering. |
| `BuilderIO/builder` | MIT drag-and-drop editor SDK. Evaluated for the v1.5 block editor; likely rejected in favour of a bespoke block schema, but the editor UX is worth studying. |

---

## Resume prior art

### `yamlresume/yamlresume` — 1.5k★, MIT

The closest existing implementation of what we are building. YAML in, LaTeX out, PDF at the end, twelve locales, TypeScript, with `jake` and `moderncv` layouts.

**What we took.** The separation of document model from layout. Their `core/` splits into `compiler/{parser,ast,codegen}` and then `renderer/{latex,html,markdown,docx}`. A layout is one renderer file and never touches the document model. That is the right shape and it is the shape we follow.

**What they did not solve.** Compilation. They shell out to `xelatex` or `tectonic` on the local machine via `execa`, and their web playground does not compile LaTeX at all — it previews with `docx-preview`. Running a real engine in a browser or a serverless function is the open problem in that project, and it is the actual hard part of ours.

**Where we differ.** They have two independent renderers, LaTeX and HTML, and therefore a drift risk between them. We have one layout descriptor that both walk, so the preview cannot disagree with the PDF. Full detail in `resume-templates.md`.

### Resume LaTeX layouts

Studied for composition, never adapted. Most of the archetypes sit outside our allowlist or carry no licence at all, and the whole business depends on templates staying closed-source.

| Archetype | Licence | Layout (as shipped) |
|---|---|---|
| `jakegut/resume` | MIT | Jake's Resume |
| `deedy/Deedy-CV` | MIT | Deedy CV |
| `dnl-blkv/mcdowell-cv` | MIT | McDowell |
| `posquit0/Awesome-CV` | LPPL-1.3c | Awesome CV |
| `sb2nov/resume` | MIT | Simple Resume |
| `posquit0/AltaCV` | LPPL-1.3c | AltaCV |
| `fky2015/resume-ng` | LPPL-1.3c | Friggeri |
| `subidit/rover-resume` | CC-BY-4.0 | Rover |
| IIT Bombay format | none | IIT Bombay |
| ModernCV | LPPL | ModernCV |

Each ships under the source project's own name. A student searching that name finds the layout they have already seen; an invented name finds nothing. See R22 in `AGENTS.md`.

### Rejected on licence

`SwiftLaTeX/SwiftLaTeX` (AGPL-3.0, 2.3k★) and `TeXlyre/texlyre-busytex` (AGPL-3.0) both solve browser LaTeX compilation and both are copyleft. `licenses.md` is unambiguous. Both are out; the engine we use instead is Tectonic.

---

## Tailwind v4 guidance

Not prior art exactly, but it changed two decisions:

1. **`@apply` is an escape hatch, not a pattern.** v4 recommends composing utilities directly. This means our semantic class maps must live in **TypeScript files exporting static strings**, not in CSS classes using `@apply` — which is exactly what R7 already mandates. The two rules agree.
2. **Source detection follows `.gitignore` and skips `node_modules`.** Explicit `@source` directives are required for anything outside the default scan.

---

## What we could not find

- A clean, MIT-licensed, actively maintained **drag-and-drop block portfolio editor** matching the "Windows 8 chrome, Apple restraint" direction in v1.5. devPortfolio-family projects are Bootstrap-era or unmaintained. We will build this one.
- A **template marketplace** that keeps templates closed-source. Every existing one ships source, which is precisely the model we are rejecting for commercial reasons.
- A **resume parser that handles Indian resume formats at ATS grade without an LLM.** Investigated in `library-decisions.md`. This is why PDF import is gated rather than committed.
- **A permissively-licensed browser TeX engine under 5 MB.** BusyTeX is the best candidate and it is 32 MB of wasm plus a 90–400 MB data package. Everything smaller either renders to HTML instead of PDF (`LaTeX.js`) or fetches packages from a server mid-compile (`SwiftLaTeX`, and it is AGPL).
- **An honest ATS score.** Every commercial tool showing a number out of 100 invented it. No real ATS publishes one, so we show the extracted text instead of a score.