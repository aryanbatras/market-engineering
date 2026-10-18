# The portfolio generator

The first feature of the platform. This is the v1 scope.

---

## What it does

A user provides their existing information in whatever form they have it. We validate it into a single structured document. They choose a template. They get a live, shareable portfolio at `/p/<handle>`.

That is the whole feature. Everything else is detail.

---

## Primary flow

```
1. Arrive          No account. Marketing page explains the product in one sentence.
2. Try it          Click to open the builder. No signup gate.
3. Get data in     Paste YAML, connect GitHub, or fill the form. GitHub and YAML can both be used.
4. Pick a template Preview changes live as you switch.
5. Publish         Sign in. Claim a handle. Site is live.
6. Share          Copy link, download PDF, send on WhatsApp.
```

**No step is a dead end.** Every exit from the builder leads somewhere useful, even an unfinished portfolio.

---

## Step 1 — Arrive

The marketing page's single job: make it obvious that text becomes a website.

The hero is the **Compile** element (`DESIGN.md` §3) — a *working* editor, YAML appearing line by line on the left while the rendered portfolio rebuilds on the right. Not a video, not a mockup. The visitor can type into it. No explanation needed; the demo is the explanation.

Above the fold: the demo, one sentence, one button. Not a feature grid.

---

## Step 2 — Try it, without an account

The builder opens immediately. No account, no gate.

**Why:** this is the strongest demonstration we have, and it is nearly free — an anonymous preview creates no auth user and no database row, so someone who renders a portfolio and bounces consumes none of our quotas. Removing the signup step removes the largest source of drop-off from the value path.

**Preview renders from in-memory data.** It never touches the database, because the user is not authenticated and their data belongs to their browser.

**Publishing is the only thing that requires an account.** The gate sits at the last possible moment, right when the user already has something they want.

---

## Step 3 — Get data in

Three paths. Full detail in `data-entry-modes.md`. In brief:

| Path | Who | Time |
|---|---|---|
| **YAML paste** | Default. Has a resume, will use an LLM | 2 minutes |
| **GitHub import** | Has a profile worth showing | 1 minute |
| **Manual form** | Skips YAML entirely | 10 minutes |

**YAML is the documented default.** The form is presented as an equal option, never as a lesser fallback — a user who finds YAML intimidating should not feel they have taken a wrong turn.

GitHub merges in as an additional namespace and never overwrites what they typed.

**Validation is client-side and immediate.** A bad paste fails on the spot with the offending line number, not a generic error thirty seconds later.

---

## Step 4 — Pick a template

Five templates, live preview, instant switch. Composition rules per template live in `../05-ui/template-system.md`.

| Template | For |
|---|---|
| **Classic** | The safe choice, executed precisely. ATS-friendly. |
| **Bento** | Project-forward. Reads as an engineer instantly. |
| **Editorial** | Considered. Reads as deliberate. |
| **Minimal** | Restraint as confidence. |
| **Immersive** | Paid. The flagship. 3D and animation. |

Preview renders in the same runtime the published site uses, at the same viewport the visitor will see. A preview that differs from the result is worse than no preview.

**Config surface in v1 is deliberately small:** accent colour, type density, dark mode. Rohit (personas) wants to customise everything and cannot afford to think about it. Three choices is a decision; fifteen is a project.

---

## Step 5 — Publish

The only authenticated step.

1. Sign in — GitHub or email.
2. Claim a handle. Suggested from the user's name, checked for availability and reserved words.
3. Publish.

Handle claims are one-time and rate-limited. Suggested handles get taken often, so the availability check is live rather than on submit — a user who types a taken handle should see it turn unavailable as they type, not after they press a button.

**Copy says what happens, in the same verb the button used.** Button says "Publish", toast says "Published". Not "Success!", not "Your portfolio is now live and ready to share!".

---

## Step 6 — Share

This is where the job gets done. The portfolio exists to be opened by a recruiter.

- **The URL.** `/p/<handle>`, copy to clipboard.
- **PDF.** Download, for applications that demand an attachment.
- **OG image.** Rendered per user, so sharing on WhatsApp or LinkedIn shows the person's name and headline rather than a generic preview.
- **JSON-LD.** Present but invisible, so recruiter tools and ATS can read it.

Share prompts appear **after** the first publish and **only** when a portfolio is live. Asking someone to share an empty portfolio is insulting and gets ignored.

---

## v1 scope

| In | Not in |
|---|---|
| 5 templates, live preview | Drag-and-drop block editor (v1.5) |
| YAML, GitHub, manual form | PDF resume import (gated — see library-decisions) |
| Handle claim, publish, unpublish | Multiple portfolios per account |
| Data export, always | Custom domains |
| JSON-LD, OG image, PDF download | Resume tailoring, LinkedIn tools |
| Razorpay subscription, three tiers | Annual plans, team plans |

The resume is specified separately in `resume-builder.md` and reads the same document. It is a **second render target**, not a second data-entry path, which is why it does not appear in this table — there is nothing extra for the user to do, and nothing here that would break when it lands.

---

## Explicitly out of scope

**The editor.** Rohit wants customisation and cannot afford complexity. A freeform block editor is the most expensive thing on our list and the most likely to be half-finished. v1.5, after templates prove out.

**Self-hosting.** Users may be told their data is exportable and always will be — but the product's defensibility is that templates never leave our infrastructure. Offering a fork option contradicts the business model.

**Multiple portfolios.** One account, one portfolio, one handle. If someone wants a personal site and an OSS site, that is a different product conversation. The same holds for resumes: one document, one resume, one handle.

---

## Success criteria

| Stage | Measure | Target |
|---|---|---|
| Activation | Reaches a rendered preview without signing up | > 60% of new visitors |
| Activation | Publishes a portfolio | > 25% of visitors who preview |
| Quality | Publishes with 3+ projects or 1 project plus a description | > 60% of published |
| Activation | Returns to edit after publishing | > 40% within 7 days |
| Value | Shares the URL | > 30% of published |
| Revenue | Converts to paid | > 3% of published |