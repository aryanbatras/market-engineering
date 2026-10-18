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

**They are named after the real projects they reproduce.** A student searching "Jake's resume LaTeX" finds the layout they have already seen forty times on GitHub. An invented name matches nothing and has to be explained. R22 in `AGENTS.md` binds this, and it binds the spelling too.

Composition rules, one line each. **No two share a composition.**

| # | Layout | Columns | Composition | Type |
|---|---|---|---|---|
| 1 | **Jake's Resume** | 1 | Full-width name, ruled section headings, flat sections. The default. | 10pt |
| 2 | **Deedy CV** | 1 | Compact single column at 9.5pt, tight leading. Denser than Jake's. | 9.5pt |
| 3 | **McDowell** | 1 | A filled header band holding name, role and contact; everything else plain | 10pt |
| 4 | **Awesome CV** | 1 | Section headings as a filled bar in the accent, body plain | 10pt |
| 5 | **Rover** | 1 | Section headings on a tab-aligned baseline, deliberately boring | 10pt |
| 6 | **Simple Resume** | 1 | No rules, no colour, no band. Bold section names, plain text. | 10pt |
| 7 | **ModernCV** | 1 | ModernCV proportions — a wide measure and a heavy name, academic in feel | 10pt |
| 8 | **IIT Bombay** | 1 | Board, score and degree as a block at the top, then work | 10pt |
| 9 | **AltaCV** | 2 | 30% tinted rail for contact, skills and education; work in the column | 9.5pt |
| 10 | **Friggeri** | 2 | 24% rail carrying everything secondary; a heavier main column | 9pt |

**Eight single-column, two two-column, because that is what the ATS evidence supports.** The two-column layouts exist because students choose them for how they look, and we would rather show them the reading order their file produces than forbid them.

**Jake's Resume is the default** and the first chip in the picker. It is the layout with the fewest ways to be wrong, and the one most of this audience has already seen.

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
- Text in a column other than the main reading order, except AltaCV and Friggeri, which are flagged

**Every layout declares** `columns`, `atsClean`, and `dialect` (`pdftex` or `luatex`) in its metadata. The ATS check reads them.

---

## Config surface

**The three document metrics, in the header's `Layout and size` panel:**

| Control | Values | What it moves |
|---|---|---|
| Type size | Small / Medium / Large | The base point size, and everything derived from it |
| Section gap | Tight / Normal / Roomy | The vertical space before the second heading and every one after |
| Page margin | Narrow / Normal / Wide | The text origin on the page |

Plus the layout picker itself, and nothing else. Density, accent and dark live in the same panel as preview-only variants and carry no PDF assertion, because a printed resume is black on white.

**Each of the three metrics has a byte-level assertion in `npm run mock:verify`.** R20 in `AGENTS.md` binds this: a control that does not change the generated bytes is worse than no control, because it teaches the user that the product's controls are decorative. When you add a control, add its assertion in the same change.

**A layout may not add controls that only apply to it.** That rule is what keeps ten layouts coherent in one gallery.

---

## The editor

Two views, toggled from the centre of the header. Both show the same four things.

**Full sections** (default) — each pane takes the height of the viewport and the full width of its column.

| Pane | Contents |
|---|---|
| Every field | The field guide. Key and example only. It is a reference, not a form. |
| YAML | The editor. Same height as the pane beside it. |
| Generated LaTeX | Exactly what downloads. |
| The sheet | The document, at true A4, with the ATS verdict in the pane head. |

**One screen** — the same four panes side by side, so the whole pipeline is visible at once. This is the view for someone who already understands what they are looking at.

The field guide is hideable from the same `View` menu, from either view. A student on their first pass does not need it; a student about to add a fourth project does.

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
- [ ] The name is the upstream project's real name, spelled as it spells it
- [ ] No composition shared with an existing layout
- [ ] ATS block present in the preamble
- [ ] Zero icon-font glyphs
- [ ] Headings plain text, sentence case
- [ ] No layout tables
- [ ] No field on the schema that a campus recruiter never reads
- [ ] One page, or two. Never three.
- [ ] Sheet previewed at 390px, scrolls sideways
- [ ] ATS check passes, or the layout is flagged and warns
- [ ] Every control has a byte-level assertion in `mock:verify`
- [ ] Fits or breaks from the `ResumeLayout` descriptor — never hand-written TeX