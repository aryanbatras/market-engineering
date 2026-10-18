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

**Two render targets, one layout descriptor, compile on export.**

```
Portfolio
  → ResumeDocument
  → ResumeLayout          ← an ordered list of blocks
       ├─→ toLatex(layout, preamble) → .tex → [engine, on demand] → pdf → ATS check
       └─→ toHtml(layout)             → live preview, instant
```

The critical idea is that **the preview is not a second renderer.** Both walk the same `ResumeLayout`. There is no second place where a section could be ordered differently, so the preview cannot drift from the PDF.

This is what makes the whole thing viable: we do not need a fast LaTeX engine for the live path, because the live path never runs LaTeX.

---

## Why not compile in the browser for live preview

Because of what it costs the first ten seconds.

`DESIGN.md §12` says most of our traffic is a phone on Indian mobile data. A 32 MB engine download before the preview appears is a worse product than a preview that appears in 200 ms and is honest — and honesty is guaranteed by the shared descriptor rather than by the engine being the same one.

So: instant preview, real LaTeX on export, and the `.tex` is downloadable either way.

---

## The engine

Chosen: **Tectonic**, vendored, compiled on demand in the browser behind a port.

- Rust, single static binary, no OS dependencies, no subprocesses. That is exactly why it cross-compiles to WebAssembly cleanly.
- The Rust layer is MIT. The vendored TeX code is LPPL. Both are free-software licences that permit redistribution and closed-source combination. **Recorded in `licenses.md` before it ships.**
- Rejected: anything AGPL. SwiftLaTeX and TeXlyre are both out.

**It lives behind `ResumeCompiler`.** Development uses a mock adapter that returns a small fixed PDF, so `npm run mock:verify` passes and no developer downloads 32 MB to run the app (R10).

---

## Ports

```
application/resume/ports/resume-compiler.ts
  compile(tex: string, options: CompileOptions): Promise<CompileResult>

application/resume/ports/pdf-text-extractor.ts
  extractText(pdf: Uint8Array): Promise<string>
```

`CompileResult` is a discriminated union on `ok`. It carries `pdf`, `log`, and `pages`. It never carries a thrown error — a compile failure is a normal result with a log a user can read, not an exception.

`unpdf` is the text extractor. MIT, ~2 MB, serverless build of pdf.js, already evaluated in `library-decisions.md`.

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

1. **Compile on demand only.** Never automatically, never on a timer, never on a debounce.
2. **The engine is lazy-loaded** and cached by the browser after the first use.
3. **A first compile says so.** "Preparing the PDF engine. This happens once." Never a spinner, never a silent wait.
4. **A failed compile returns the log.** The user can paste it into Overleaf and we get a bug report with a stack trace in it.
5. **The `.tex` is always downloadable**, compiled or not. A user with a local TeX install is never blocked by ours.
6. **No live LaTeX editing in v1.** Downloading the `.tex`, editing it in Overleaf and recompiling there is the supported round-trip. Editing LaTeX inside our editor with a live preview is a separate feature and it reopens this decision.

---

## What would change this

If measured, server-side Tectonic turns out to hold on the Hobby tier — sub-two-second compiles, no 32 MB client download — then the export path moves to the server and the WASM engine is deleted. The layout descriptor and the ATS check are unaffected either way, which is the point of separating them.