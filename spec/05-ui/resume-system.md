# Resume system

How the ten layouts are designed, and the constraint they inherit that portfolio templates do not have.

Portfolio templates live in `template-system.md`. This document is its counterpart.

---

## The relationship

A resume layout inherits from two documents, not one:

**From `DESIGN.md`** — the product's own surfaces. The editor, the gallery, the homepage section, the document sheet primitive.

**From `../04-research/resume-templates.md`** — the ATS findings. These are findings, not preferences, and they override aesthetics whenever the two conflict.

**It owns:**

- The composition of the page
- Which sections appear, in what order
- Column count
- Type size and density
- The LaTeX preamble
- The visual skin used by the HTML preview

**It may not:**

- Introduce a fourth hue or a third radius
- Emit a glyph from an icon or symbol font
- Hand-write document structure in LaTeX
- Claim to be ATS-safe while failing the check

---

## The two-renderer rule

This is the mechanism that keeps a preview from lying.

```
ResumeLayout   ← one ordered list of blocks
      │
      ├──→ toLatex()  → .tex → PDF     the artefact the user submits
      └──→ toHtml()   → preview        the artefact the user judges
```

**A layout emits blocks. It never emits TeX.**

```
type ResumeBlock =
  | { kind: "name";    text: string }
  | { kind: "contact"; items: string[] }
  | { kind: "heading"; text: string; rule: boolean }
  | { kind: "entry";   title: string; org: string; dates: string; meta: string; bullets: string[] }
  | { kind: "skills";  groups: { label: string; items: string[] }[] }
  | { kind: "note";    text: string }
```

`toLatex` turns a block into macro calls. `toHtml` turns the same block into React. Neither can invent, drop, or reorder a block, so **the preview cannot drift from the PDF.**

**A layout that writes raw LaTeX is a FAIL**, and lint checks it. That rule is what keeps the descriptor authoritative — the moment a template hand-writes `\begin{minipage}`, the two renderers start disagreeing and nobody notices until the PDF comes out wrong.

---

## The ten layouts

Composition rules, one line each. **No two share a composition.**

| # | Layout | Columns | Composition | Type |
|---|---|---|---|---|
| 1 | **Rule** | 1 | Full-width name, one ruled contact line, flat sections | 10pt |
| 2 | **Compact** | 1 | Name and contact in a two-line header, sections at 9.5pt, tight leading | 9.5pt |
| 3 | **Header** | 1 | A filled header band holding name, role and contact; everything else plain | 10pt |
| 4 | **Colour** | 1 | Section headings as a filled bar in the accent, body plain | 10pt |
| 5 | **Engineer** | 1 | No header at all. Name, then straight into work | 10pt |
| 6 | **Sidebar** | 2 | 30% tinted rail for contact, skills and education; work in the column | 9.5pt |
| 7 | **Rail** | 2 | 24% rail carrying everything secondary; a heavier main column | 9pt |
| 8 | **Atlas** | 1 | Section headings on a tab-aligned baseline, deliberately boring | 10pt |
| 9 | **Campus** | 1 | The IIT one-pager — name centred, 10th/12th/degree as a block, then work | 10pt |
| 10 | **Modern** | 1 | ModernCV proportions — a wide measure and a heavy name, academic in feel | 10pt |

**Six single-column, two two-column, because that is what the ATS evidence supports.** The two-column layouts exist because students choose them for how they look, and we would rather show them the reading order their file produces than forbid them.

---

## Type on paper

`DESIGN.md §5` gives six steps sized in pixels. Paper is sized in points and the whole page is a different physical object, so:

- **Body is 10pt, or 9.5pt for the dense layouts.** 9pt is the floor; below that a student on a phone in daylight cannot read their own resume in the preview.
- **The name is 18–22pt.** One step, not five. A resume has exactly one piece of display type and it is the person's name.
- **Section headings are 11–12pt, bold, sentence case.** Sentence case, because `DESIGN.md §5` says so and no layout is exempt.
- **Line height 1.15–1.25.** Tighter than the web because the page is a fixed object, not a scroll.
- **One page is the target. Two is acceptable. Three is a FAIL.**

The six-step web scale does not apply here and this is the one place it is allowed not to. Paper typography is a different medium, and pretending otherwise produces a resume set at `clamp()` which is a category error.

---

## The sheet

A previewing resume is a sheet of paper, per `DESIGN.md §9`.

- A4 proportion, locked. Never cropped, never reflowed.
- `--ground-raised` on `--ground-sunken`, `--shadow-float`, **no radius**.
- Real text at real size, scaled as a unit. Placeholder text at 6px proves nothing.
- At 390px it scrolls sideways in a sunken frame rather than shrinking.

---

## ATS requirements

From `resume-templates.md`, binding under R19.

**Every preamble ships, unconditionally, non-overridable by a template:**

```tex
\usepackage[T1]{fontenc}
\usepackage{lmodern}
\usepackage{cmap}
```

**No template may emit:**

- A glyph from an icon or symbol font
- A heading in small caps in a custom face
- A layout table
- Dates in anything but `MMM YYYY` or `YYYY`
- Text in a column other than the main reading order, except Sidebar and Rail, which are flagged

**Every layout declares** `columns`, `atsClean`, and `dialect` (`pdftex` or `luatex`) in its metadata. The ATS check reads them.

---

## Config surface

Three controls, matching the portfolio templates in `template-system.md`: **density** (comfortable / compact), **accent** (blue / ink), **dark** (on / off, for the preview only — a printed resume is on white).

**A layout may not add controls that only apply to it.** That rule is what keeps ten layouts coherent in one gallery.

---

## Adding a layout

1. New folder under `presentation/resume/templates/<id>/`.
2. `layout.ts` — the ordered block list. **No TeX, no JSX.**
3. `preamble.ts` — returns the preamble string. Must include the ATS block.
4. `skin.ts` — the class map for `toHtml`.
5. `meta.ts` — id, name, forWhom, columns, atsClean, dialect.
6. One registry entry.
7. A fixture rendering it against every stored schema version.

**A layout is a folder drop-in.** If adding one requires touching a shared emitter, the emitter is wrong.

---

## Review checklist

- [ ] Three hues, two radii, no exception
- [ ] No composition shared with an existing layout
- [ ] ATS block present in the preamble
- [ ] Zero icon-font glyphs
- [ ] Headings plain text, sentence case
- [ ] No layout tables
- [ ] One page, or two. Never three.
- [ ] Sheet previewed at 390px, scrolls sideways
- [ ] ATS check passes, or the layout is flagged and warns
- [ ] Fits or breaks from the `ResumeLayout` descriptor — never hand-written TeX