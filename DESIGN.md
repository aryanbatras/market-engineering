# DESIGN.md

Binding design system for Market Engineering. A contract, not a mood board. Deviations require founder sign-off.

---

## 1. Scope

**This document covers the product's own surfaces:**

- Marketing site — home, features, pricing, templates gallery, template detail
- Legal — privacy policy, terms and conditions
- The builder and dashboard
- **The resume editor and the resume layout gallery**
- How a portfolio is **listed, previewed, and chosen**
- The published portfolio chrome around the user's template

**This document does not cover portfolio templates.** We will ship hundreds. Each one is designed inside its own file under `spec/05-ui/template-system.md`, which inherits these tokens but owns its composition. A template may re-weight type and change layout density. It may not introduce a fourth colour or a new radius.

Resume layouts work the same way, with one addition. A portfolio template inherits these tokens and owns its **composition on a screen**. A resume layout additionally has to agree with a **typeset page in LaTeX**, so it inherits a second constraint set: paper proportions, text density, and the parseability rules in `spec/05-ui/resume-system.md`. A layout that looks right in preview and reads badly as a PDF is a bug, not a preference.

---

## 2. Who we design for

Engineering students at tier-2 and tier-3 Indian colleges. Real ability, no idea how to present it, and no design literacy. They compare us against Instagram and LinkedIn, not against other developer tools.

So: broad spacing, large type, full-ink body text, obvious affordances, nothing that rewards effort to figure out. If a freshman needs a second look, it is wrong.

---

## 3. The idea

> **On this page, a portfolio being written becomes a live website.**

Every other portfolio tool shows you a finished page and asks you to imagine your content in it. We show the transformation happening.

**The live thing:** the hero contains a working editor. YAML appears line by line on the left; the rendered portfolio rebuilds on the right as each line lands. The visitor can type into it. It is not a video and not a mockup — it is the product, running, at true size, on our own domain.

**Competitor test:** put Wix, Canva, or Rezi into that sentence. "Wix turns a form into a website" is also true of Wix, and it is why nobody remembers Wix. Ours is specific because our input is *text a person already has* — a resume, a GitHub profile — and the output is a site with their name on it.

---

## 4. Colour

### Three hues. Nothing else.

| Token | Value | Role |
|---|---|---|
| `--ground` | `#FFFFFF` | Page. Default. |
| `--ink` | `#0A0A0B` | Text, primary buttons, dark bands |
| `--blue` | `#0A66C2` | The single accent. LinkedIn blue. |

### Tones

Tone steps within the three families. Not new colours.

| Token | Value | Use |
|---|---|---|
| `--ground-sunken` | `#F5F6F7` | Inputs, recessed panels, interface fragments |
| `--ground-raised` | `#FFFFFF` | Cards on a sunken ground |
| `--ink-70` | `rgba(10,10,11,0.70)` | Secondary text |
| `--ink-45` | `rgba(10,10,11,0.45)` | Captions, disabled |
| `--blue-deep` | `#084C8F` | Blue hover, blue on white text |
| `--blue-wash` | `#EAF2FB` | Blue tint fills, selection |

### Rules

- **The accent appears on the primary action and at most one other thing per screen.** If blue is on the button, it is not also on the heading.
- **Running text is `--ink`, full strength.** Not `--ink-70`. A page set in soft grey reads unfinished.
- **Surfaces separate by tone step.** Never by a border. Never by a shadow at rest.
- **No yellow. No red. No green. No violet.** A fourth hue on this site is a bug.
- **No gradients.** Flat fill only.
- Contrast floor: body ≥ 4.5:1, large text and UI ≥ 3:1.
- Author in `oklch()` in the token layer; the hex above is the reference rendering.

---

## 5. Typography

**Geist.** Display and text from the same family. **Geist Mono** for code only.

One family for everything visible. Founder-pinned, Vercel's typeface, and the right register — a grotesk with confident geometry that stays quiet.

| Token | Size | Line height | Tracking | Weight |
|---|---|---|---|---|
| `--text-display` | `clamp(3rem, 8.5vw, 7.5rem)` | 0.92 | `-0.045em` | **800** |
| `--text-title` | `clamp(2rem, 4.5vw, 3.5rem)` | 0.98 | `-0.035em` | 800 |
| `--text-lead` | `clamp(1.25rem, 2vw, 1.75rem)` | 1.25 | `-0.02em` | 500 |
| `--text-body` | `1.0625rem` (17px) | 1.55 | `-0.011em` | 400 |
| `--text-small` | `0.9375rem` (15px) | 1.5 | `-0.006em` | 400 |
| `--text-micro` | `0.8125rem` (13px) | 1.45 | `0` | 500 |

**Six steps. That is the ceiling.** Adding a seventh is how a design system starts drifting.

### Rules

- **Weight 800 does the display work.** Big type is bold, tight-tracked, and confident. That is where the personality lives.
- **Headlines: two lines maximum at every width, phone included.** Cut words, then widen the measure, then reduce size. Never the reverse.
- **Nothing below 13px.** Body never below 17px.
- Measure: 60–72 characters. Project descriptions cap at 68.
- Sentence case everywhere. Never Title Case On Everything.
- No eyebrow labels — no small caps line above a headline. Put it in the headline or drop it.
- No index numbering. No `01 / 02 / 03`. Order is carried by position, not by decoration.
- Monospace only inside real code.

---

## 6. Spacing

Base unit **4px**. Broad by default — founder-pinned and correct for an audience reading on a phone in daylight.

| Token | Value | Use |
|---|---|---|
| `--space-1` | `0.25rem` | Icon gaps |
| `--space-2` | `0.5rem` | Tight internals |
| `--space-3` | `0.75rem` | Inline spacing |
| `--space-4` | `1rem` | Default gap |
| `--space-6` | `1.5rem` | Card padding, mobile |
| `--space-8` | `2rem` | Card padding, desktop |
| `--space-12` | `3rem` | Between blocks |
| `--space-16` | `4rem` | Within a section |
| `--space-24` | `6rem` | Between sections, mobile |
| `--space-40` | `10rem` | Between sections, desktop |
| `--space-56` | `14rem` | Hero breathing room |

### Rules

- **Section gaps are dramatically larger than any gap inside a section.** 160px desktop, 96px mobile. This single rule is most of what makes a page feel expensive.
- **One pair of margins everywhere.** `32px` desktop, `20px` mobile. Large elements break out to the edges; text blocks do not.
- **Text blocks share two or three left edges across the whole page**, never more. Pick an alignment and repeat it.
- Left-aligned by default. Centred at most once per page, and probably never.
- Grid: 12 columns, `1440px` max, `1.5rem` gutter.

---

## 7. Radius, borders, elevation

**Two radii. That is all.**

| Token | Value | Use |
|---|---|---|
| `--radius-pill` | `999px` | Buttons, chips, avatars, tags |
| `--radius-panel` | `1.25rem` (20px) | Cards, panels, media, dialogs |

Round curves, iPhone-registered, founder-pinned. But reduced to two values so the whole product reads as one object rather than a collection.

**Borders:** none. Surface separation is a tone step. The only borders in the system are 1px inside form fields, where a field needs a containing edge, and inside `data-ui` interface fragments, which follow the product's own conventions.

**Elevation:** shadows only on things that genuinely float.

```
--shadow-float: 0 1px 2px rgba(10,10,11,0.04), 0 16px 40px -16px rgba(10,10,11,0.16)
```

Sticky navigation, dropdowns, dialogs, toasts. Nothing else. A card at rest has no shadow.

---

## 8. Motion

| Token | Value | Use |
|---|---|---|
| `--duration-micro` | `120ms` | Hover, press |
| `--duration-fast` | `200ms` | Small state change |
| `--duration-base` | `320ms` | Element entering |
| `--duration-slow` | `500ms` | Hero sequence |

```
--ease-out:    cubic-bezier(0.22, 1, 0.36, 1)
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)
```

### The signature move

**The Compile demo runs live in the hero.** YAML types in, the portfolio rebuilds. It is the one loud moment on the page.

**The showcase section crossfades** the same interface fragment through three states over 1.6s, holding each ~5s. It should feel like light shifting in a room.

### Rules

- Elements enter by rising 16–32px and fading. Never scaling from zero.
- Stagger 60–90ms, capped at 6 items.
- Every control has press, hover, and focus feedback. No exceptions.
- **`prefers-reduced-motion` is mandatory.** It disables the demo autoplay, all crossfades, parallax, and looping decoration. Content still appears, immediately.
- Transform and opacity only. Nothing that changes colour or layout of whole screens is animated.
- Target: at least 8 elements genuinely moving on load and scroll, 16 or more for a full page.

---

## 9. Components

**Substrate:** shadcn/ui, source owned by us. **Target:** HeroUI's token architecture — radius multipliers, transparent borders, tone-stepped surfaces, OKLCH authoring. **Motion:** GSAP for scroll choreography, Motion for component state, React Three Fiber where 3D is genuinely needed.

**Icons:** React Icons, **Lucide family only** (`react-icons/lu`), 2px stroke at 20px. One family for the whole product — mixing families is instantly visible because their stroke weights differ. Never emoji. Per-icon imports only; never the barrel file.

### Buttons

- **Primary:** `--ink` fill, white text, `--radius-pill`, 48px min height. One per screen.
- **Secondary:** `--ground-sunken` fill, `--ink` text, `--radius-pill`.
- Labels are verbs. "Start building", "Publish", "Save changes". Never "Submit".
- No icon unless the icon *is* the label.

### Cards

`--ground-raised` on a `--ground-sunken` field, `--radius-panel`, `--space-8` padding, **no shadow at rest**. Lift only if clickable.

### Document sheets

A resume previewing in the builder or on the homepage is **not a card**. It is a sheet of paper, and it gets paper's rules.

- **A4 width, locked at 794px** (210mm at 96dpi). Height grows with the content, because a resume that spills onto a second page does in fact become two pages. The frame scrolls; the sheet is never cropped or reflowed to fit a viewport.
- `--ground-raised` on a `--ground-sunken` field, `--shadow-float`, **no radius**. A sheet has square corners; rounding them makes a card pretending to be a document.
- **Real text at real size**, scaled as a unit. A sheet showing placeholder text at 6px proves nothing and looks like a placeholder.
- **No glyphs that do not read.** No icon fonts, no symbol bullets, no dingbats. This is a hard rule inherited from the ATS constraint in `spec/02-architecture/resume-compilation.md` — a sheet carrying an envelope glyph would be a lie about the very thing it is demonstrating.
- At true size on a phone it scrolls horizontally inside a sunken frame rather than shrinking to illegibility. Same rule as the YAML editor's `side-scroll`.

### Inputs

`--ground-sunken` fill, 1px `--ink-45` border at 15% opacity, `--radius-pill`, 48px min height. Label above, always. Helper text below. Placeholders show format, never replace labels.

### The builder header

Both editors open on a sticky header carrying **every** control. Nothing that changes the output lives in a side panel, a settings page, or a second screen.

The header is one row on desktop and wraps on a phone. Left: wordmark, the size control, and the layout dropdown. Right: everything else, ending in the one primary action.

**The layout dropdown doubles as the crumb, so there is no separate crumb.** It already names the layout that is loaded, and a static word beside it saying the same thing is two surfaces showing one fact. That is R23's argument applied to the document: two places to show what you are editing is two places to forget to update. The dropdown is left-aligned, opens downward, scrolls at ten entries, marks the current one with a check, and closes with a link to the full gallery.

**The size controls are a panel, not a sidebar.** One button labelled `Size and spacing` opens a panel of continuous sliders under the header. These are **numbers with units**, not presets: `Body size 10 pt`, `Name size 21 pt`, `Section gap 2.6 ex`, `Entry gap 1.2 ex`, `Page margin 1.9 cm`, plus the bullet mark and the section rule as toggles. A student who has a specific page in their head cannot reach it through three presets, and a slider gets them there in twenty seconds.

**The layout is not in that panel.** `Size and spacing` is page metrics. Which of the ten layouts you are typing into is a different decision, and it gets its own single dropdown button in the header showing the current layout's name. Ten chips across the header is a menu wearing a toolbar costume.

**A control that does not change the output does not ship.** R20 in `AGENTS.md` binds this. Every metric above has a byte-level assertion in `npm run mock:verify` — the margins move the text origin, the body size reaches the entry titles, the name size scales the name, the section gap moves the second heading, and the rule and bullet toggles change the bytes.

### Forms

One column. Errors below the field, in `--ink` with a blue marker — **we have no red**, so errors are marked by weight, an icon, and the message, never colour alone. Errors state what to do: "That project needs a name", not "Validation failed".

### Navigation

`--ground` at 88% opacity with a blur on scroll. Left-aligned. Wordmark, Features · Portfolio templates · Resume templates · Pricing, then Sign in and one action. Height 72px. Current page marked by weight, not colour alone.

### Dialogs

A dialog is a modal panel on a `--ink/20` scrim with a 2px blur. `--radius-panel`, `--shadow-float`, `--text-lead` title, one close button top right, `Escape` and a scrim click both dismiss, and focus moves to the panel on open.

**Anything with more than three options is a dialog, not a dropdown.** A dropdown anchored under a button that is 40px tall cannot hold four two-line options without either clipping or pushing the header out of shape — and the copy we want on those options is one line of explanation each, which is the whole point of the control. A dialog has room for the explanation.

**The confirmation of a copy is a toast, not an inline message.** Toast at the bottom centre, `--shadow-float`, `aria-live="polite"`, gone after 2.6 seconds. A message that replaces the button that produced it is a layout that changes under the user's cursor.

### Empty states

An invitation to act. Names the next step, offers the button that does it. Never an illustration with "Nothing here yet".

### Loading

Skeletons at final dimensions. Never a bare spinner.

---

## 10. Pages

| Route | Purpose |
|---|---|
| `/` | Home. Long, sectioned. The demo lives here. |
| `/features` | What it does, in full |
| `/pricing` | Three tiers |
| `/start` | **The first click.** Portfolio or resume. One question, two cards. |
| `/templates` | Portfolio template gallery. Every card is the link. |
| `/builder` | The portfolio editor. Opens on the template picker, then the editor. |
| `/dashboard` | The only account surface. Portfolio, resume, environment. |
| `/p/[handle]` | Published portfolio. |
| `/resume` | The resume editor. Same YAML, typeset. |
| `/resume/templates` | Resume template gallery. Ten popular layouts. |
| `/privacy` | Privacy policy. |
| `/terms` | Terms and conditions. |
| `/sign-in`, `/sign-up` | Supabase auth. |

Nav: **Features · Portfolio templates · Resume templates · Pricing** — then Sign in and "Start building". The two galleries are named separately because they are different products and a visitor looking for one should not have to guess which label means it.

The resume is reached from the builder, the dashboard and the nav. It stopped being a second product once it got its own gallery, and hiding it now reads as a secret rather than as restraint.

Privacy and Terms live in the footer. Both are written before launch, not after. India DPDP requires notice; see `spec/02-architecture/security-and-privacy.md`.

### How portfolios are listed

The gallery is the shop window, so it carries the brand rules harder than any other page.

- **Preview is the product.** Every card renders the real template at true size, not a screenshot. A static thumbnail would be the one place we lie about what users get.
- Cards on a `--ground-sunken` field, `--radius-panel`, name in `--text-title` scale, no shadow until hovered.
- Each card states what the template is *for* in one sentence. Not "Modern template." — "For engineers whose projects deserve the front page."
- **The card is the button.** Clicking a template opens the editor with it loaded. There is no second "Use this template" underneath a card that is already a target — a card that looks clickable and is not, next to one that is, is the exact failure DESIGN §13 exists to prevent.
- Template names are the names people already search for. See R22 in `AGENTS.md`.
- Filters are tone, not chrome. One row, left-aligned.
- Lazy-loaded. A gallery of hundreds cannot render hundreds of live templates on mobile data.

---

## 11. Homepage

Nine sections. Each has a distinct composition; **no two neighbours share a layout.**

### No decorative line

There is no line on this page. An earlier draft ran one from the Start building button, through the YAML editor, across the rendered page, down the margin and on to the resume sheet. It was a nice idea and it was the wrong one, for the same reason a paragraph rule on a website is the wrong thing: **a line on a page means something, and this one meant nothing a reader could act on.**

It crossed the word "The work". It ran through the first letter of a display heading in the resume section. It produced a stub between the two editor panes that read as a stray mark rather than a route. Every fix moved the problem somewhere else, and the honest reason is that orthogonal routing through unpredictable content is not a problem you solve, it is a problem you remove. The typography already carries the sequence. A line explaining the typography is the typography talking twice.

What replaced it is nothing, and the sections below are ordered so that reading them top to bottom is the argument.

### The hero preview

**The preview frame is `--ground-sunken`, never `--blue-wash`.** This was a blue-tinted panel behind an already-white page, which nested a document inside a decoration. The page is the thing; the frame around it only has to separate it from the ground.

**No label above the preview says "Rendered" or "Rendered page" or "Up to date".** The YAML is on the left and the page is on the right, in the same component, live. A caption claiming the obvious is the single most common way an interface admits it is a mockup. The only status text is the parse result — `Valid`, or the number of things to fix — because that is the one thing the visitor cannot see for themselves.

### The resume section

This is the section that earns the second output. It sits after Templates, because by then the visitor already believes the portfolio works; the job here is to say **"and you never typed it twice."**

**One sheet, not a gallery.** Ten layouts would repeat the Templates section's mistake. One document, at true A4 proportion, carrying real content — a name, a role, three dates, four bullets — typeset dense enough to look like a real resume and legible enough to read at 1440px.

**Beside the sheet, not inside it, four lines of proof.** The extracted text layer in Geist Mono, showing the name and the first role's dates in the order a parser reads them. This is the interface fragment: the actual output of the actual check, cropped. It answers "will this be read?" without making a claim about it.

**The sheet sits on `--ground-raised` over `--ground-sunken`, with `--shadow-float`.** A sheet of paper genuinely floats. This is the one place in the marketing site where a resting shadow is correct, and it is correct because the object really is a piece of paper above a desk.

**No icon glyphs anywhere on the sheet.** Not in the contact line, not as bullets. What is being sold is that a parser can read it, so the sheet must not contain a single glyph that extracts as garbage. That constraint is visible on the page as design quality — it looks like a clean typeset document.

### The Questions section

**Two columns, both static, no pin.** The questions sit left and the answers sit right, and the section does what a section does: it is on the page, it reads top to bottom, and it is gone by the time the reader scrolls past. An earlier draft scrolled the left column past a fixed right column so the answers moved at the pace of the questions. It was broken in the way a pin is always broken — the reader who scrolls fast finds a question with an answer three questions away, and the reader who scrolls slowly has to sit and wait for a sentence. Six questions do not need a scroll narrative. They need to be readable.

**No accordion either.** Six answers is roughly a hundred words each way. An accordion hides two thirds of it behind a click per question, and the questions that get clicked are the ones people already expected — which is the opposite of what the section is for.

**No blue in the proof band.** "The page is the bottleneck" is a claim about latency, and the band that carries it is a dark instrument panel. Every label on that panel is `text-white/50` or `text-white/70`, and the one active cell marker is `--ink`. A blue tint there reads as a link, and the cells are not links.

### Imagery

**Our pictures are our own interface.** Every fragment is built in HTML at true size with real labels, real numbers, one element in its hover or selected state, and its root marked `data-ui`.

- **At least four interface fragments on the homepage.** They are the imagery.
- Fragments are cropped pieces — a menu, a row, a control, a panel edge. Never a whole browser window. Never a device frame.
- Never a fake dashboard of grey bars. That is the worst possible outcome and it is the default an unguided build produces.
- SVG drawings for what no honest fragment exists of, in the three palette colours only.
- No stock photography of people at laptops. No stock photography at all, currently — we have no photography and inventing some would be worse than none.

---

## 12. Responsive

Mobile-first. Most of our traffic is a phone on Indian mobile data.

| Breakpoint | Behaviour |
|---|---|
| `< 640` | Single column. 20px margins. 24px section gaps → 96px vertical. Demo panel spans margins, top 120px above the fold. |
| `640–1024` | Two columns where a fragment is involved. Margins 24px. |
| `1024–1440` | Full 12-column grid. 32px margins. |
| `> 1440` | Content locks at 1440px. Large elements break to the viewport edge; text does not. |

**Non-negotiables at every width:**

- No horizontal scroll. Ever.
- Headlines stay within two lines. If a headline needs three lines, it is too long at every width.
- Touch targets ≥ 44×44px.
- The demo still runs — it is the whole pitch.
- Portfolio templates are designed mobile-first and widened. Never the reverse.

---

## 13. Anti-slop

Each of these is the default output of a generic generated interface. Banned outright.

| Banned | Instead |
|---|---|
| Gradients, anywhere | Flat `--ink`, `--white`, or `--blue` |
| A fourth colour | Three hues. Tone steps only. |
| Emoji as icons or decoration | React Icons, or nothing |
| Glassmorphism, frosted blur panels | Solid fill, `--shadow-float` if it truly floats |
| Icons in rounded tinted squares | The icon alone, or the word |
| Icon-topped feature cards | Section blueprints in §11 |
| Rows of identical cards | Asymmetric widths, tone-stepped fields |
| "Trusted by" logo walls | Real numbers, or nothing |
| Infinite marquees of buzzwords | A static capability list |
| Eyebrow labels, small caps above headlines | In the headline, or dropped |
| A caption that restates the obvious next to it | Only status the visitor cannot infer |
| A tinted panel wrapping an already-white page | `--ground-sunken`, nothing else |
| An invented product name where a real one exists | The real name. See R22 |
| A field a campus recruiter never reads | Cut it. See R22 |
| A second control where the card was already the target | One control |
| `01 / 02 / 03` index numbers | Position and order |
| Hairline dividers | Space, or a tone step |
| Shadows on resting cards | Tone step |
| Particle, meteor, sparkle, aurora, warp | Motion that communicates |
| Yellow, red, green, violet | `--blue` |
| Soft grey body text | `--ink`, full strength |
| Spinner | Skeleton |
| Testimonial carousel with two quotes | One real quote, or none |
| Blob mascots, 3D stock illustrations | Interface fragments, or type |

**Self-check before shipping:** if the screen still works with our wordmark swapped for a competitor's, it is templated. Redesign it.

---

## 14. Voice

- Plain, direct, warm. A student talking to a student.
- Sentence case. Active voice.
- "Your site is live", not "Your portfolio has been published".
- No "unlock", "supercharge", "game-changing", "level up".
- Errors state what to do. Never apologise, never vague.
- One action keeps one name across the whole product. "Publish" produces "Published".

---

## 15. Accessibility

- Contrast ≥ 4.5:1 body, ≥ 3:1 large text and UI.
- Visible keyboard focus on everything, 2px `--blue` with 2px offset. Never `outline: none` without a replacement.
- Since we have no red, **error and success states must never rely on colour.** Weight, icon, and message carry them.
- Colour is never the sole carrier of meaning anywhere.
- Semantic HTML. Heading order never skips a level.
- `prefers-reduced-motion` fully respected.
- Text selectable everywhere. Recruiters copy from portfolios.

---

## 16. The design gate

`node scripts/design-gate.mjs` renders every public page in Chrome and applies the taste-skill rules. It must report zero FAIL before a change ships. Every rule below carries a written allowance, each for one specific and checkable reason.

| Allowed | Where | Why |
|---|---|---|
| `mono` | The YAML editor, hero, builder and resume editor | §5 puts Geist Mono on code. The editor *is* code. The resume editor also sets the LaTeX pane and the field guide in it — both are source the visitor may copy into another tool. No prose anywhere uses it. |
| `eyebrow` | Portfolio template previews | §13 bans editorial kickers above headlines. The Bento template uses section labels (`Experience`, `Education`) so a recruiter can scan a one-page portfolio in four seconds. Removing them costs orientation. The marketing pages themselves have no eyebrows. |
| `side-scroll` | The YAML editor at 390px | A 78-character YAML line does not fit a phone. The editor scrolls horizontally the way every code editor does. Nothing else on any page scrolls sideways. |
| `card-rows` | The template gallery | Two sections are grids on purpose. The gallery is the product: a recruiter's first question is "what does this look like", and the only honest answer is to show the templates side by side. Every other section on every page has been pulled out of a grid. |
| `covered-text`, on `/templates` and `/builder` only | The live previews | Both pages show a whole 1440px portfolio page inside a 440px crop you can scroll. Text that has been scrolled past the crop is invisible to a person, but its layout box still exists and the rule reads the box. The rule stays a FAIL on every other page, where it has twice caught a real defect: a frosted header sitting over the hero, and the Editorial rail escaping its crop. |
| `no-footage` | The statement band | The band used to run screen-recording footage of someone typing code. The product's entire claim is that you do not write code, so the footage contradicted the copy. It is a still now: hands moving a card into place, which is what the product actually asks you to do. |
| `shadow` | Document sheets, on `/` and `/resume` | §7 permits a shadow only on something that genuinely floats. An A4 sheet is the one object in this product that genuinely floats above a surface, and a flat rectangle on a flat field reads as a panel rather than a page. The shadow is on the sheet and on nothing inside it. |
| `hairline` | Ruled section headings inside document sheets | The rule sits under a heading *on a typeset page*, which is typography rather than interface chrome — it is how Jake's Resume, Deedy CV and McDowell all set a section. Remove it and the sheet loses the one thing that makes a resume look typeset rather than printed. It appears on a heading and nowhere else on either page. |
| `body-size` | Document sheets, on `/` and `/resume` | A resume is set in points, not pixels, and 10pt is 13.3px at 96dpi. 13px is the correct size for the thing — inflating a document to clear a web body-text floor would make it read like a webpage, which is the failure this product exists to avoid. |
| `small-text` | Document sheets, on `/` and `/resume` | The rule asks that nothing meant to be read goes below 13px, and that is a rule about web copy. A resume's secondary type — the contact line, entry dates, the institution line — is 9pt by convention, which is 12px. Lifting the preview to clear the floor would mean the preview disagreed with the PDF and the `.tex`, and R19 exists precisely to make those three one artefact. A preview that flatters the document at the expense of the download is a preview that lies. |
| `no-hero` | The two editors | An editor opens on the document, not on a slogan. The rule asks for a focal statement in the first viewport; in `/builder` and `/resume` the focal object is the YAML pane beside the rendered page. A display headline above them would push both below the fold, which is the one thing an editor must not do. The header names what is loaded — a crumb in the builder, the layout dropdown in the resume editor — which is the statement this page actually needs. |
| `focal-point` | The two editors | The rule wants one dominant element, and it looks for large type or a picture. In an editor the dominant element is the pair of working panes, and on `/resume` it is the A4 sheet on the right — the thing the user came to judge. Neither is display type, and making the document large type would put the YAML and the sheet below the fold. `no-hero` reasons about the same object from the other side; this is the rule that asks what is *big*. |
| `card-rows` | The resume template gallery | Ten layout previews is a grid on purpose, exactly like the portfolio gallery beside it. A visitor choosing a resume wants to see all ten at once and compare them, and the only honest way to compare two page layouts is to see both pages. |
| `hairline` | The editor header, on `/builder` and `/resume` | The header carries a 1px bottom rule. It is the one place on either editor where a hairline is the mechanism rather than a divider: it is what tells you the panes below scroll under a fixed surface. One element, one edge, and nothing else on either page. |
| `first-action` | `/start` and `/resume/templates` | The rule looks for a button in the first screen. On both pages every card is the control — on `/start` there are two output choices, in the resume gallery there are ten layouts. A "Choose" button sitting under a card that already goes somewhere is two controls for one decision, and the visitor's eye lands on the button first and hesitates there. |

An allowance is a debt with an owner. If the reason stops being true, the allowance goes with it.

---

## 17. Pre-ship

- [ ] Three hues only. No fourth.
- [ ] Running text in full `--ink`
- [ ] Every headline ≤ 2 lines at 390px
- [ ] Six type steps, no more
- [ ] Section gaps ≥ 160px desktop
- [ ] No shadow on anything at rest, except a written §16 allowance
- [ ] No banned effect from §13
- [ ] One primary action per screen
- [ ] ≥ 4 real interface fragments
- [ ] 390px checked, no horizontal scroll
- [ ] Keyboard walkthrough passes
- [ ] Reduced motion verified
- [ ] No raw Tailwind in JSX (R7)
- [ ] No link nested inside a link (R24)
- [ ] No cross-domain import outside `core` (R18)
- [ ] Every generated PDF passes the ATS check (R19)
- [ ] Every layout name is a real one (R22)
- [ ] One account surface, no `/settings` (R23)
- [ ] Editor controls all live in the header
- [ ] Every gallery card is the link
- [ ] Passes the §13 logo-swap test