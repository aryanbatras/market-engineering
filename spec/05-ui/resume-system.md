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

**A layout is a set of traits, never a name.** The preview, the `.tex` and the PDF all come from the same typed fields, and a renderer that branches on a layout's id instead of on its traits is a bug waiting to happen: rename the layout, the branch goes dead, and every layout silently renders identically. That is exactly what happened when the ids stopped matching, and it is why the traits below exist.

| Trait | Values | What it changes |
|---|---|---|
| `nameStyle` | `left` / `centred` / `boxed` | Where the name sits, and whether it carries the accent |
| `headerAlign` | `left` / `centred` | Whether the whole header block — name, role, contact — is centred |
| `headlineStyle` | `italic` / `bold` | The role line under the name |
| `contactSeparator` | `dot` / `bar` | A middot or a vertical bar between contact details |
| `headingCaps` | `true` / `false` | Whether section headings are set in caps |
| `headingStyle` | `plain` / `rule` / `bar` / `caret` | A bare bold word, a rule under it, a filled accent bar, or a square in front of it |
| `headerRule` | `true` / `false` | A full-width rule under the whole header block |
| `entryStyle` | `split` / `inline` | Role and dates on one line with the dates pushed right, or all on one line separated by a bar |
| `bulletStyle` | `none` / `dash` / `dot` | No mark, an em dash, or a bullet |
| `railTint` | `true` / `false` | Whether the two-column rail gets a tinted ground |
| `railWidth` | `0.24`–`0.30` | The rail's share of the measure |

`pageSize` used to live here as a `small / medium / large` trait. It is gone, because the continuous `bodySize` metric in `ResumeMetrics` is the same decision done properly — a layout declared its own type size and fought the user's slider for it.

| # | Layout | Name | Headings | Entry | Bullets | Cols | ATS |
|---|---|---|---|---|---|---|---|
| 1 | **Jake's Resume** | centred header, caps headings | rule | split | none | 1 | Clean |
| 2 | **Deedy CV** | left, role inline with the name | rule | inline | dash | 1 | Clean |
| 3 | **McDowell** | centred + header rule | rule | split | dash | 1 | Clean |
| 4 | **Awesome CV** | left, accent bar headings | bar | split | dash | 1 | Clean |
| 5 | **Rover** | left, caret headings | caret | split | dot | 1 | Clean |
| 6 | **Simple Resume** | left | plain | split | dash | 1 | Clean |
| 7 | **ModernCV** | left + header rule | rule | split | none | 1 | Clean |
| 8 | **IIT Bombay** | centred, caps headings | plain | split | none | 1 | Clean |
| 9 | **AltaCV** | boxed | plain | split | dash | 2 | ⚠️ |
| 10 | **Friggeri** | left | rule | inline | dot | 2 | ⚠️ |

Eight of the ten are single-column because that is what the ATS evidence supports. The two-column layouts exist because students choose them for how they look, and we would rather show them the reading order their file produces than forbid them.

**Jake's Resume is the default** and the first name in the picker. It is the layout with the fewest ways to be wrong, and the one most of this audience has already seen.

---

## Type on paper

`DESIGN.md §5` gives six steps sized in pixels. Paper is sized in points and the whole page is a different physical object, so:

- **Body is 10pt, and the slider runs 7–14pt.** 7pt is the floor, and it is the floor because that is the smallest a real resume sets; the preview shows it faithfully rather than flattering it, because a preview that disagrees with the PDF is worse than a small preview.
- **The name is 18–22pt.** One step, not five. A resume has exactly one piece of display type and it is the person's name.
- **Section headings are 11–12pt and bold.** Case is a trait. `DESIGN.md §5` asks for sentence case on the web, and six of the ten layouts take it; the other four are reproductions of documents that set their headings in caps, and caps is the thing that makes a student recognise the layout as the one they have already seen. R22 is about retrieval, and retrieval wins a detail like this.
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

**The page metrics, in the header's `Size and spacing` panel.** Continuous sliders with units, not presets:

| Control | Range | What it moves |
|---|---|---|
| Body size | 7 – 14 pt | The base point size, and everything derived from it |
| Name size | 12 – 40 pt | The name's point size |
| Section gap | 0 – 8 ex | The vertical space before the second heading and every one after |
| Entry gap | 0 – 6 ex | The space between entries inside a section |
| Page margin | 0.4 – 4 cm | The text origin on the page |
| Section rule | on / off | Whether a rule-head heading carries its rule |
| Bullet mark | dash / dot / none | The mark that opens a bullet |

**The layout is not in that panel.** It has its own single dropdown in the header showing the current layout's name. Page metrics and template choice are two different decisions, and the second one is not a number you can slide.

Density, accent and dark live in the portfolio's panel as preview-only variants and carry no PDF assertion, because a printed resume is black on white.

**Each of the seven metrics has a byte-level assertion in `npm run mock:verify`.** R20 in `AGENTS.md` binds this: a control that does not change the generated bytes is worse than no control, because it teaches the user that the product's controls are decorative. When you add a control, add its assertion in the same change.

**A metric may not change the layout's composition.** Not the order of sections, not which sections appear, not the column count. That boundary is the difference between tuning a document and designing a template, and the layout picker is what does the second one.

**A layout may not add controls that only apply to it.** That rule is what keeps ten layouts coherent in one gallery.

---

## The editor

Two views, toggled from the centre of the header.

**Full sections** (default) — two rows, each pane the height of its row.

| Row | Left | Right |
|---|---|---|
| 1 | **YAML** — the editor | **The sheet** — the document, at true A4, with the ATS verdict in the pane head |
| 2 | **Every field** — the field guide, key and example only | **Generated LaTeX** — exactly what downloads |

Row one is the loop: write, see. Row two is the reference: what the keys mean, and what came out the other end. Both rows carry a copy button on their own pane head.

**One screen** — YAML and the sheet only. Nothing else, nothing scrolling. This is the view for someone who already understands what they are looking at and wants to judge the document.

The field guide and the LaTeX are still reachable in one screen, as hover overlays on the two words beside the `YAML` label. Hover opens, leave closes, click pins it open, `Escape` closes. That is the whole reason there is no third option in the `View` menu: every pane that can be hidden can be hovered, and a toggle for a pane you can already hover is a second control for one decision.

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
- [ ] No two layouts share the same trait signature
- [ ] Every visual difference comes from a trait, never from a layout id
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