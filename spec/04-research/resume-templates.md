# Resume layouts — research

What the ten layouts are actually derived from, and what the ATS does to them.

Read before `../05-ui/resume-system.md`, because that document is the design system built on top of this one.

---

## Method

Star count is a popularity proxy, not evidence of quality, so it is used only to order the list. Licence was verified against each repository on 2026-10-18, because `licenses.md` decides what we may read closely and what we may not ship.

**Nothing here is copied.** Every layout we ship is written from scratch. The list below is the study that tells us what compositions exist, which ones Indian engineers actually use, and which of them silently break a parser.

---

## The ten archetypes

**We ship them under the source project's own name, not ours.** A student searching "Jake's resume" or "Deedy CV" finds the layout they have already seen. An invented name matches nothing and has to be explained — see R22 in `AGENTS.md`. The "Layout" column below is therefore the name in the product.

| # | Layout (as shipped) | Source archetype | Stars | Licence | Columns | ATS |
|---|---|---|---|---|---|---|
| 1 | **Jake's Resume** | `jakegut/resume` — Jake's Resume | 2.8k | MIT | 1 | Clean |
| 2 | **Deedy CV** | `deedy/Deedy-CV` — Deedy CV | — | MIT | 1 | Clean |
| 3 | **McDowell** | `dnl-blkv/mcdowell-cv` | 2.7k | MIT | 1 | Clean |
| 4 | **Awesome CV** | `posquit0/Awesome-CV` | 28.7k | **LPPL-1.3c** | 1 | Clean |
| 5 | **Simple Resume** | `sb2nov/resume` | 7.0k | MIT | 1 | Clean |
| 6 | **AltaCV** | `posquit0/AltaCV` | — | **LPPL-1.3c** | 2 | ⚠️ |
| 7 | **Friggeri** | `fky2015/resume-ng` | 901 | **LPPL-1.3c** | 2 | ⚠️ |
| 8 | **Rover** | `subidit/rover-resume` | 831 | CC-BY-4.0 | 1 | Clean |
| 9 | **IIT Bombay** | IIT Bombay placement format | — | none | 1 | Clean |
| 10 | **ModernCV** | ModernCV class proportions | — | LPPL | 1 | Clean |

Eight of the ten are single-column because that is what the evidence supports, not because we avoided the pretty ones.

**On licences.** `LPPL-1.3c` and CC-BY-4.0 are outside the allowlist in `licenses.md` and stop at founder review. Every layout above is therefore studied, never adapted. `Rover` is the one CC-BY source; it informs heading structure only, which is not protectable expression.

**On India.** Jake's Resume, Deedy CV, AltaCV and ModernCV are what Indian engineering students reach for, because those are what circulate on campus. The IIT Bombay one-pager exists because it is the single most-recognised resume shape in the country and a recruiter at an IIT/NIT recognises it instantly.

---

## Finding 1 — Two-column layouts scramble a parser

This is the most consequential thing the research turned up.

A parser does not read a PDF. It extracts the text layer **in the order the file hands it over**. For a single-column document that order is the reading order, and it is free. For a two-column document it is column-by-column, top to bottom.

So in AltaCV, a sidebar holding skills, contact and projects emits:

```
Alice Sharma
alice@example.com
Skills: Python, React, Node
Projects: ...
———— main column starts ————
Alice Sharma
Software Engineer Intern, Razorpay
Jun 2024 – Aug 2024
```

The skills land **before the work history**, and dates detach from the jobs they belong to. A keyword search for the first internship finds it, but the ordering a human would assume is not what the machine got.

**What we do.** Ship AltaCV and Friggeri. Mark both as column-bearing in their metadata. The ATS check reports the first reading-order divergence and names the layout. The user sees the actual extracted text.

We are not going to pretend a two-column resume is as safe as a one-column one. We are going to show the difference and let them decide — which is more useful than a badge that says "ATS-friendly" on all ten.

---

## Finding 2 — The ligature trap

pdfTeX typesets `fi`, `fl`, `ff`, `ffi` and `ffl` as single glyphs, because that is what fine typography does.

When the PDF carries an incomplete glyph-to-character mapping, an extractor returns the ligature as **one special character where two letters were**:

```
On screen:  Financial  Engineering  Workflow  Efficient
Extracted:  F-ﬁ-n-a-n-c-i-a-l  E-n-g-i-n-e-e-r-i-n-g
```

A recruiter searching for "financial" returns nothing. The resume looks perfect. This is invisible on screen and decisive in practice, and it hits exactly the words a technical resume uses most: *efficient*, *profile*, *workflow*, *staff*, *office*, *find*, *first*, *infrastructure*.

**The fix** is three preamble lines, shipped unconditionally by every template:

```tex
\usepackage[T1]{fontenc}
\usepackage{lmodern}
\usepackage{cmap}
```

`cmap` writes a ToUnicode map so ligature glyphs extract as their letters. `T1` additionally fixes accented characters, which under OT1 extract as a base letter plus a floating accent. Under fontspec, `Ligatures=NoCommon` is the one-option equivalent.

This is R19. It is a binding constraint, not a default we can turn off per template.

---

## Finding 3 — Icon fonts break contact detection

Templates love a small envelope before the email and a phone glyph before the number, usually from FontAwesome.

To a human: polished. To a parser: a character from a symbol font with no meaningful Unicode mapping, extracted as a stray glyph **glued to the address**. In the worst case the parser's contact-detection regex fails on the whole line and the resume arrives with no email at all.

This is the LaTeX version of the Word icon-bullet failure.

**What we do.** No icon font in any preamble. Where a template wants a label, it writes the label. "Email: alice@example.com" parses. A 9pt envelope does not. The constraint costs nothing visually — a clean typeset document is what we wanted anyway.

---

## Finding 4 — Single-column with plain headings is the floor

Everything above is preamble. The structural floor is:

- **Single column.** Column-per-column extraction is the scramble above.
- **Section headings as plain text.** Not small caps in a custom font — a parser classifies headings by matching them, and a styled glyph is a harder match.
- **Dates on the same line as the role, right-aligned on a tab stop.** Never in a separate column.
- **Reverse chronological.** It is what parsers and humans both expect.
- **No tables for layout.** A table is a grid the extractor has to reconstruct, and it frequently reconstructs it wrong. Bullets are not tables.

LaTeX starts ahead of Word on three of these by default — real text layer, embedded fonts, single-column templates. We have to give that back with the ligature and icon traps, and we do.

---

## Prior art

### `yamlresume/yamlresume` — 1.5k★, MIT

The closest existing implementation. YAML → LaTeX → PDF, twelve locales, TypeScript, with `jake` and `moderncv` templates.

**What we took:** the split between document model and layout. `core/` has `compiler/{parser,ast,codegen}` then `renderer/{latex,html,markdown,docx}`. One template is one renderer file. A template never sees the document model directly.

**What they do not solve:** compilation. They shell out to `xelatex` or `tectonic` on the local machine and their web playground does not compile LaTeX at all. Running a real engine in a browser or a serverless function is the open problem, and it is the one we are actually building.

**What we do differently:** a shared `ResumeLayout` descriptor that both the LaTeX emitter and the HTML preview walk. They have two independent renderers and therefore a drift risk; we have one descriptor and therefore none.

### `reactive-resume/reactive-resume` — ~42k★, MIT

Already in `prior-art.md`. Its **Resume Checks** feature is the strongest evidence that "show the user what the software reads" is a feature people want. It also proves the Write / Design / Check mode split, which is the shape of our step flow.

---

## What we did not find

- **A maintained, permissively-licensed browser TeX engine under 5 MB.** BusyTeX is the best candidate and it is 32 MB plus a data package. Everything smaller either renders to HTML instead of PDF (`LaTeX.js`) or fetches packages from a server mid-compile (`SwiftLaTeX`, and it is AGPL).
- **An honest ATS score.** Every commercial tool that shows a number out of 100 invented it. No real ATS publishes one. We show the extracted text instead.
- **An Indian-specific LaTeX resume schema.** Everyone hand-edits their preamble instead. That is what the layout system is for.