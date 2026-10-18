# The resume builder

The second render target. Same document, same account, same ten minutes.

---

## What it is

The student pastes their YAML once. They get a portfolio **and** a typeset resume, and neither is an export of the other.

```
one document
   ├─→ a website at /p/<handle>       scroll, motion, ten seconds of attention
   └─→ a PDF, typeset in LaTeX        a parser, a millisecond of attention
```

The reason this is one product and not two: the data entry is the expensive part. A student who has typed their facts once will keep them current. A student asked to type them twice will stop after the first.

---

## The flow

```
1. Arrive          From the builder or the dashboard. No second account, no second upload.
2. Choose a layout Ten curated layouts, previewed with the user's own data.
3. Check           The ATS result, with the extracted text shown.
4. Download       PDF, .tex, or both.
5. Publish         Optional. Attach the resume to the published portfolio at /p/<handle]/resume.
```

**Steps 2 through 4 need no account.** Same rule as the portfolio builder: the preview renders from in-memory data, publishing is the only authenticated step, and a visitor who renders and bounces costs us nothing.

---

## Step 2 — Choose a layout

Ten layouts, previewed with the user's actual YAML, at true A4 proportion.

**Preview is the product.** Same rule as the template gallery: a static screenshot would be the one place we lie about what they get. The preview renders from the same `ResumeLayout` descriptor that produces the LaTeX, so it cannot diverge from the PDF.

| Layout | Character | ATS |
|---|---|---|
| **Rule** | One column, ruled section headers, 10pt. The safe choice. | Clean |
| **Compact** | One column, dense, small type. Fits the most in a page. | Clean |
| **Header** | One column with a strong header block for name, role and contact. | Clean |
| **Colour** | One column, coloured section headings. Reads as designed. | Clean |
| **Engineer** | One column, almost nothing but the work. | Clean |
| **Sidebar** | Two columns, tinted rail on the left for skills and contact. | ⚠️ Warns |
| **Rail** | Two columns, dense, the rail carries everything secondary. | ⚠️ Warns |
| **Atlas** | One column, headings tuned for section detection. | Clean |
| **Campus** | The IIT/NIT one-pager. Familiar to every Indian recruiter. | Clean |
| **Modern** | ModernCV's proportions — a widely recognised academic shape. | Clean |

**Two-column layouts ship, and they warn.** They are the ones students choose because they look the most designed, and telling them not to would be dishonest. So we ship them, and the ATS check shows them the actual reading order their file produces. They decide with evidence instead of a rule.

---

## Step 3 — Check

The screen shows the extracted text layer and any failures, in sentences that say what to do.

This is the section that earns trust. Every other resume tool claims "ATS-friendly" in a badge nobody can verify. We show the parse.

**Copy:** "This is what a recruiter's software reads." Not "ATS optimised."

---

## Step 4 — Download

- **PDF** — compiled on demand, one-time engine download on first use.
- **`.tex`** — always, immediately, no engine required. The user can edit it in Overleaf and recompile there.

The `.tex` being available without a compile is what keeps this honest. If our engine is slow on their phone, they are never stuck.

---

## v1 scope

| In | Not in |
|---|---|
| 10 layouts, previewed with the user's data | Live LaTeX editing with live compile |
| YAML in, one document | A second document model |
| ATS check on the generated PDF | An invented "ATS score" out of 100 |
| PDF and `.tex` download | Tailoring to a job description |
| Public resume at `/p/[handle]/resume` | Multiple resumes per account |
| Mocked engine in development | A server-side LaTeX service |

---

## Explicitly not this

**Not a resume tailor.** Rewriting bullets for a job description needs an LLM, and we do not have one (R1). The schema has room for it and the surface does not exist.

**Not a document editor.** The user edits YAML, not a word processor. Someone who wants to move a comma uses the `.tex`.

**Not a source of truth.** The portfolio YAML is the source of truth. The resume is a projection. A user who edits the `.tex` and recompiles it elsewhere gets a PDF we will never see, and that is fine — that is what the `.tex` is for.

---

## Why the schema grows

Indian resumes are not US resumes. Three additions, all optional so existing data stays valid:

| Addition | Why |
|---|---|
| `education[].board` and `.score` | "CBSE, 94.2%" and "9.4 CGPA" are not the same field. Recruiters scan for them. |
| `experience[].kind` | Internships and full-time work are listed separately on almost every Indian fresher resume. |
| `languages[]` | Standard on Indian resumes and on essentially no US ones. |

**No `certifications[]`, `achievements[]`, or `awards[]`.** `data-contract.md` already leaned toward a generic `highlights[]` for exactly this, and three typed arrays is the drift the versioning table warns about. If it proves too coarse, add one array, not four.

Portfolio templates can render these too. That is the whole point of one schema.

---

## Success criteria

| Stage | Measure | Target |
|---|---|---|
| Activation | Reaches a rendered resume preview without signing up | > 25% of resume-route visitors |
| Quality | Downloads a PDF or `.tex` | > 40% of previews |
| Quality | Passes the ATS check on first export | > 80% |
| Quality | Returns to change layout | > 30% within 7 days |
| Value | Publishes the resume to their portfolio | > 20% of downloads |

The ATS pass rate is the one to watch. If it is below 80% the templates are wrong, not the users.