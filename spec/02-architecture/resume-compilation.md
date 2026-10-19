# Resume compilation

How a `Portfolio` becomes a `.tex`, and a `.tex` becomes a PDF, and a PDF proves it can be read.

Binding under R19. This is the hardest architecture decision in the resume feature and the one most likely to be got wrong quietly.

---

## The problem

The user has a resume. They want a PDF that a recruiter's software can read. We want that PDF to be typeset, not a screenshot of a web page, because:

- Typesetting is what makes a resume look like a resume
- The `.tex` is a real artefact they can edit and recompile anywhere
- A PDF produced by a typesetting engine has a real text layer, which is what a parser needs

And we have three hard constraints:

- **R1** — hobby tier until revenue. No paid API.
- **R2** — Next.js on Vercel. No second service, no native toolchain the platform does not support.
- **DESIGN.md §12** — most of our traffic is a phone on Indian mobile data.

Those three together eliminate almost every obvious answer.

---

## What was evaluated

| Option | Verdict |
|---|---|
| **SwiftLaTeX API** | Paid per compile. Rejected under R1. |
| **LaTeX.Online** | Paid per compile. Rejected under R1. |
| **TeX Live on a server** | ~4 GB. Not a Vercel function. Rejected under R2. |
| **Server-side Tectonic** | The binary is 9.7 MB musl static, so it fits a function. But it fetches the TeX bundle on first run and Vercel has no persistent writable cache, so every cold instance re-downloads. Not measured. Spiked in Phase 2, deferred if it fails. |
| **Browser WASM TeX, live preview** | BusyTeX is MIT and works. But it is 32 MB of wasm plus 90–400 MB of data package. On a phone, that is the whole session before the user sees anything. Rejected for the live path under `DESIGN.md §12`. |
| **Browser WASM TeX, on demand** | Same binary, but the user has explicitly asked for a PDF and accepts a wait. **Chosen for the export path.** |
| **SwiftLaTeX / TeXlyre in the browser** | Both **AGPL-3.0**. Rejected under `licenses.md`, which forbids copyleft in anything we ship. |

---

## The decision

**Three render targets, one layout descriptor, no engine.**

```
Portfolio
  → ResumeDocument
  → ResumeLayout          ← an ordered list of blocks
       ├─→ composeLatex(layout) → .tex        for Overleaf, for anyone who wants real LaTeX
       ├─→ composePdf(layout)  → pdf         instant, real text layer, zero download
       └─→ toHtml(layout)      → preview     instant, and honest by construction
```

The critical idea is that **none of the three is a second renderer.** All three walk the same `ResumeLayout`. There is no second place where a section could be ordered differently, so the preview cannot drift from either download.

---

## Why not a browser LaTeX engine

Because there isn't one you can install.

Verified against npm on 2026-10-18:

| Package | Reality |
|---|---|
| `swiftlatex` | Not on npm. Assets on GitHub Releases. |
| `texlyre-busytex` | 153 KB wrapper. The engine is 32 MB wasm plus 90–400 MB of data files, downloaded separately. AGPL. |
| `pdftex-wasm` | Does not exist on npm. |

So client-side LaTeX is a vendoring project measured in weeks and hundreds of megabytes, shipping copyleft, on the phone traffic `DESIGN.md §12` calls our main audience.

**The direct writer is not a compromise. For this product it is the better answer.** A student on a phone needs the PDF in one tap. They do not need XeTeX. And a 3 KB writer that produces a genuinely parseable text layer makes the ATS check *real*, which a mock reading a fixture never could.

**What the direct writer cannot do:** tables, images, multicol, TikZ, anything requiring a package. None of those are in the ATS evidence, and all of them are available in the `.tex`.

---

## The PDF writer

Hand-written, about 200 lines, no dependency.

- Base-14 Type 1 fonts (`Helvetica`, `Helvetica-Bold`) with `WinAnsiEncoding`. These are guaranteed present in every reader and never embedded, which is why the file is 3 KB instead of 300 KB.
- Real AFM widths for wrapping and for right-aligning dates on the title line.
- A `cmap`-equivalent is unnecessary: WinAnsi is a single-byte encoding with a standard mapping, so glyphs extract as their characters with no ToUnicode ambiguity and no ligature damage. **The ligature trap from `resume-templates.md` cannot occur in this path.**
- Multi-page when the content overflows. One page is the target, two is fine, three is a FAIL.

---

## Ports

```
application/resume/ports/resume-compiler.ts
  compile(payload: ResumePayload, options: CompileOptions): Promise<CompileResult>

application/resume/ports/pdf-text-extractor.ts
  extractText(pdf: Uint8Array<ArrayBuffer>): Promise<string>
```

The compiler takes the **layout descriptor**, not the `.tex` string. That matters: passing the `.tex` would mean parsing it back to typeset it, which is a pointless round-trip through a format we just generated.

`CompileResult` is a discriminated union on `ok`. It carries `pdf`, `pages` and `log`. It never carries a thrown error — a failure is a normal result with a log a user can read, not an exception.

`unpdf` is the text extractor. MIT, 2 MB, serverless build of pdf.js. It is the same class of tool a real ATS uses, which is what makes the check meaningful rather than decorative.

---

## The ATS check

`runAtsCheck(document, extractedText) → AtsReport`

This is the feature that justifies the whole engine, and the reason R19 exists. It runs on every generated PDF and the user sees the result.

### The two traps

**Ligatures.** pdfTeX typesets `fi`, `fl`, `ff`, `ffi`, `ffl` as single glyphs. When the PDF lacks a ToUnicode mapping, the extractor returns one special character where two letters were. "Financial" becomes `F-ﬁ-n-a-n-c-i-a-l`, and a recruiter searching for "financial" finds nothing. The same applies to `efficient`, `profile`, `workflow`, `staff`, `office`.

Every generated preamble ships the fix unconditionally:

```tex
\usepackage[T1]{fontenc}
\usepackage{lmodern}
\usepackage{cmap}
```

`cmap` writes a ToUnicode map so ligature glyphs extract as their letters. `T1` also fixes accented characters, which under the old OT1 default extract as a base letter plus a floating accent.

Under fontspec-based templates the equivalent is `Ligatures=NoCommon`.

**Icon fonts.** A FontAwesome envelope before the email address extracts as a stray glyph glued to the address. In the worst case the parser's email detection fails on the whole line. This is the LaTeX version of the Word icon-bullet failure.

**The rule is structural, not a fix:** no template may emit a glyph from a symbol or icon font. There is no icon font in any of our preambles, so there is nothing to break.

### The checks

| # | Check | Fails when |
|---|---|---|
| 1 | Name first | The name is not in the first three extracted lines |
| 2 | Clean email | The email does not match a clean pattern, or is glued to a non-alphanumeric glyph |
| 3 | Dates attached | A role's dates do not appear on the same line as its title |
| 4 | Ligature regression | A word containing `fi`/`fl`/`ff` does not extract as letters |
| 5 | Plain headings | A section heading does not appear as plain text |
| 6 | Reading order | A source string appears out of order in the extracted text |
| 7 | Column warning | A two-column layout is used — a standing warning, not a failure |

Check 6 is the honest one. It diffs the source strings in document order against the extracted text and reports the **first divergence**. For a single-column layout it must find none. For a two-column layout it will, and saying so plainly is more useful than a score.

### What the user sees

Not a number. No real ATS publishes one and inventing a score out of 100 is dishonest.

- **The extracted text, four to six lines of it, in Geist Mono.**
- **Each failure named in a sentence that says what to do.** "Your email has a symbol in front of it, so it may not be recognised." Not "Validation failed."
- **Still downloadable.** A failed check is information, not a lock.

---

## Preamble contract

Every resume template supplies a preamble. The compiler assembles:

1. Document class and page geometry
2. The ATS preamble block — non-negotiable, not overridable by a template
3. Package set for the template's own features
4. Semantic macros: `\rsection`, `\rentry`, `\rskills`, `\rcontact`

Templates emit only those macros. **A template may not hand-write document structure.** That is the rule that keeps the layout descriptor authoritative, and lint enforces it: a template's LaTeX output that contains anything other than macro calls is a FAIL.

---

## Constraints

1. **The PDF path must be instant.** No download, no engine, no queue. `DESIGN.md §12` says most of our traffic is a phone on Indian mobile data, and a 32 MB engine before the download button works is a worse product than no engine.
2. **The PDF must be real.** A real text layer, extractable by a standard parser. This is asserted in `npm run mock:verify` against `unpdf`, not assumed.
3. **The `.tex` is always downloadable**, in every layout, in every view. It costs nothing and it is the escape hatch for anyone who wants real LaTeX.
4. **A failed compile returns the log.** The user can paste it into Overleaf and we get a bug report with a stack trace in it.
5. **No live LaTeX editing in v1.** Downloading the `.tex`, editing it in Overleaf and recompiling there is the supported round-trip.

---

## What would change this

If the founder ever wants browser LaTeX specifically, `texlyre-busytex` is the only maintained option and it is AGPL plus a 32 MB wasm plus 90–400 MB of data files. That is a vendoring project, not a dependency, and it is written up here so the cost is visible rather than rediscovered. The direct writer is not a fallback until then — for our actual use case it is the better answer, because instant and mobile-friendly matter more to a nineteen-year-old on a phone than typesetting fidelity nobody will notice.

---

## Three renderers, one descriptor

| Output | Renderer | Notes |
|---|---|---|
| `.tex` | `composeLatex` | Macro calls only, never raw document structure |
| `.pdf` | `composePdf` | Helvetica base-14, WinAnsi, real ToUnicode |
| Preview | `toHtml` | React, from the same block list |

All three walk `ResumeLayout`. A block cannot be dropped or reordered in one and not the others, so the preview and the download are the same document by construction.

**The page metrics live in `ResumeMetrics`**, which all three renderers read. They are continuous numbers, not presets, and every one of them is a parameter to a macro rather than a constant baked into it — `\rnameleft[<gap>]{<size>}{<text>}`, `\rsectionrule[<gap>]{<text>}` — so the generated `.tex` reads like something the user typed. The PDF emitter uses Helvetica's real AFM widths for wrapping and right-alignment, so a narrow margin actually produces a narrower line of text rather than the same line with more white space.