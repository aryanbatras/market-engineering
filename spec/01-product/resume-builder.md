# Resume builder

The second render target. Same document, two outputs, one set of facts.

---

## What it is

The student enters their data once. They get a portfolio **and** a resume, and neither is an export of the other.

```
one document
   ├─→ a website at /p/<handle>       scroll, motion, ten seconds of attention
   └─→ a PDF + a .tex                a parser, a millisecond of attention
```

The reason this is one product and not two: the data entry is the expensive part. A student who has typed their facts once will keep them current. A student asked to type them twice stops after the first.

---

## The flow

```
/start               Which output first. Two cards. This is the first thing
                     "Start building" asks, because the answer changes which
                     gallery comes next.
  ↓
/templates           Portfolio templates.  Click one, you are in the editor.
/resume/templates    Resume layouts.       Click one, you are in the editor.
  ↓
/builder             the editor, template already loaded
/resume              the editor, layout already loaded
  ↓
Download PDF or .tex. Publish is optional and comes last.
```

**Nothing between choosing and editing.** A template card is the button. There is no confirm step, because a confirm step is a question the visitor has already answered by clicking, and a second button under a card that is already a target is the place a visitor's eye goes to hesitate.

**Choosing a portfolio goes through the gallery, not straight into an editor.** Picking "A portfolio website" on `/start` lands on the template picker, never on a default template the visitor did not choose. The whole point of asking which output they came for is that the next screen is a choice, not a default.

**Both routes stay open.** The editor header carries "Make it a portfolio" on the resume side and "Make it a resume" in the portfolio builder. Switching never re-enters anything.

---

## The ten layouts

Named after the ones Indian engineering students actually use, because a student searching for "resume template" is searching for those names. Nine of the ten are outside our licence allowlist and are studied, never adapted — see `../04-research/licenses.md`.

| Layout | Source archetype | Columns | ATS |
|---|---|---|---|
| **Jake's Resume** | `jakegut/resume` | 1 | Clean |
| **Deedy CV** | `deedy/Deedy-CV` | 1 | Clean |
| **McDowell** | `dnl-blkv/mcdowell-cv` | 1 | Clean |
| **Awesome CV** | `posquit0/Awesome-CV` | 1 | Clean |
| **Rover** | `subidit/rover-resume` | 1 | Clean |
| **Simple Resume** | `sb2nov/resume` | 1 | Clean |
| **ModernCV** | ModernCV class proportions | 1 | Clean |
| **IIT Bombay** | The IIT/NIT one-pager | 1 | Clean |
| **AltaCV** | `posquit0/AltaCV` | 2 | ⚠️ Warns |
| **Friggeri** | `fky2015/resume-ng` | 2 | ⚠️ Warns |

Eight single-column because the ATS evidence supports it. The two two-column layouts ship with a warning, because they are the ones students choose for how they look and forbidding them would be dishonest.

**The name is the feature.** Jake's Resume is called Jake's Resume because that is what a student types into a search box, and because it is the one an IIT recruiter has already read four hundred times. Every layout ships under its upstream project's own name, spelled the way that project spells it. An invented name ranks against nothing, has to be explained, and is a worse product for a user who already knew which one they wanted. R22 in `AGENTS.md` makes this binding, and it also binds the corollary: **we do not add a field the user did not ask for.** There is no spoken-language list and no proficiency scale on this schema. A recruiter reading for six seconds is not helped by a line saying the candidate speaks Tamil.

---

## Customisation

Three controls, and only three.

| Control | Values | Effect |
|---|---|---|
| **Font** | Small, Medium, Large | 9pt, 10pt, 11.5pt body |
| **Section gap** | Tight, Normal, Roomy | 9pt, 15pt, 23pt before each heading |
| **Margin** | Narrow, Normal, Wide | 32pt, 48pt, 68pt |

**Why three.** `template-system.md` caps portfolio templates at three controls, and a resume that needs twelve is a resume builder with a layout picker bolted on. Three is a decision; twelve is a project.

**All three change the PDF, not just the preview.** `npm run mock:verify` asserts that each control measurably moves the output — the margin shifts the text origin, the font scales the type, the gap moves the second heading. A control that only changes the preview would be a lie.

**Beyond three, the `.tex` is the escape hatch.** A user who wants line spacing or a custom column ratio edits the downloaded LaTeX in Overleaf. That is a supported round-trip, not a workaround.

---

## The two views

**Full sections** (default) — the field guide and the YAML side by side, then the generated LaTeX and the rendered page side by side. Each band is a full-width, bounded-height region. This is the view for editing.

**One screen** (compact) — all four panes in a single row: structure, YAML, LaTeX, page. Nothing scrolls. This is the view for seeing whether the document is right.

**Field guide toggle** — the schema panel can be hidden independently. Someone who already knows the format does not want to read the key list.

All three live in one dropdown at the centre of the header. The dropdown opens left to right, and it is the only overlay in the editor.

**Everything else lives in the header too.** Layout, the three size controls, Copy for LLMs, both downloads, and the switch to the other output. Nothing that changes the output is on a side panel or a second screen, in either editor. A control you have to go looking for is a control most people never find, and the person who would have found it is the person who already had a `.tex` file.

---

## Download

**PDF** — typeset directly from the layout descriptor. Instant, no engine, no download, and the text layer is real and parseable. See `../02-architecture/resume-compilation.md`.

**.tex** — genuine LaTeX, generated from the same descriptor, for Overleaf and for anyone who wants to compile it properly themselves.

Both come out of the same `ResumeLayout`, so they are the same document. Verified: `npm run mock:verify` extracts the generated PDF with `unpdf` and asserts the name, the email, the dates, the headings and the absence of ligature damage.

---

## v1 scope

| In | Not in |
|---|---|
| 10 layouts, named after the real ones | Live LaTeX editing with live compile |
| Three size controls | Full Overleaf-style typography control |
| Field guide, YAML, LaTeX and preview | A server-side compile service |
| Real PDF and `.tex`, both downloadable | Tailoring to a job description |
| ATS check on the generated PDF | An invented "ATS score" out of 100 |
| Two views, one toggle | Multiple resumes per account |
| Every control in the header | A settings page |
| Card-is-the-button in both galleries | A confirm step after choosing |

---

## Explicitly not this

**Not a LaTeX tool.** Nobody needs a TeX compiler to apply for a job. They need a PDF that reads, and the `.tex` is there for the people who want it.

**Not a tailor.** Rewriting bullets for a job description needs an LLM, and we do not have one (R1). The "Tailor to a job" prompt in the Copy-for-LLMs dropdown is the honest version: the student brings their own model.

**Not a source of truth.** The document is the source of truth. The resume is a projection.

---

## Success criteria

| Stage | Measure | Target |
|---|---|---|
| Activation | Reaches `/start` and picks an output | > 50% of new visitors |
| Activation | Chooses a template by clicking, no confirm | > 90% reach the editor |
| Quality | Downloads a PDF or `.tex` | > 40% of previews |
| Quality | PDF passes the ATS check on first export | > 80% |
| Quality | Uses at least one size control | > 25% |
| Value | Switches to make the other output | > 15% |
| Value | Copies a prompt out of Copy for LLMs | > 10% |

**On the last one.** It measures the ceiling of what this product can be without an LLM on our side. Every prompt we ship is a thing the student runs on a model they already pay for. If most of them never copy one, that is evidence the entry flow is wrong, not evidence they did not need the help.

If the ATS pass rate falls below 80%, the templates are wrong, not the users.