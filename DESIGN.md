# DESIGN.md

Binding design system for Market Engineering. A contract, not a mood board. Deviations require founder sign-off.

---

## 1. Scope

**This document covers the product's own surfaces:**

- Marketing site — home, features, pricing, templates gallery, template detail
- Legal — privacy policy, terms and conditions
- The builder and dashboard
- How a portfolio is **listed, previewed, and chosen**
- The published portfolio chrome around the user's template

**This document does not cover portfolio templates.** We will ship hundreds. Each one is designed inside its own file under `spec/05-ui/template-system.md`, which inherits these tokens but owns its composition. A template may re-weight type and change layout density. It may not introduce a fourth colour or a new radius.

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

### Inputs

`--ground-sunken` fill, 1px `--ink-45` border at 15% opacity, `--radius-pill`, 48px min height. Label above, always. Helper text below. Placeholders show format, never replace labels.

### Forms

One column. Errors below the field, in `--ink` with a blue marker — **we have no red**, so errors are marked by weight, an icon, and the message, never colour alone. Errors state what to do: "That project needs a name", not "Validation failed".

### Navigation

`--ground` at 88% opacity with a blur on scroll. Left-aligned. Wordmark, Features · Templates · Pricing, then Sign in and one action. Height 72px. Current page marked by weight, not colour alone.

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
| `/templates` | Gallery. Grows to hundreds. |
| `/templates/[slug]` | One template, live preview, publish to it |
| `/builder` | The editor. |
| `/dashboard` | Portfolio, handle, billing, export. |
| `/p/[handle]` | Published portfolio. |
| `/privacy` | Privacy policy. |
| `/terms` | Terms and conditions. |
| `/sign-in`, `/sign-up` | Supabase auth. |

Nav: **Features · Templates · Pricing** — then Sign in and "Start building".

Privacy and Terms live in the footer. Both are written before launch, not after. India DPDP requires notice; see `spec/02-architecture/security-and-privacy.md`.

### How portfolios are listed

The gallery is the shop window, so it carries the brand rules harder than any other page.

- **Preview is the product.** Every card renders the real template at true size, not a screenshot. A static thumbnail would be the one place we lie about what users get.
- Cards on a `--ground-sunken` field, `--radius-panel`, name in `--text-title` scale, no shadow until hovered.
- Each card states what the template is *for* in one sentence. Not "Modern template." — "For engineers whose projects deserve the front page."
- Filters are tone, not chrome. One row, left-aligned.
- Lazy-loaded. A gallery of hundreds cannot render hundreds of live templates on mobile data.

---

## 11. Homepage

Eight sections. Each has a distinct composition; **no two neighbours share a layout.**

| # | Section | Composition |
|---|---|---|
| 1 | **Hero** | Alignment 27% from the left. Headline at display scale, weight 800, two lines. One supporting sentence. One action. Below it the Compile demo rising into view. Right half blank on purpose. |
| 2 | **Intro** | Narrow column at 15% viewport width. Five short paragraphs. First in full ink, rest in `--ink-70`. Nothing above it. |
| 3 | **How it works** | Four flat fields across the full viewport, butted, each a step of the same portfolio filling in — name only, then photo and headline, then projects, then published. Each field one clause. |
| 4 | **Showcase** | The interface fragment three times, stacked, in three states. The middle one is live — the visitor can tick it and it becomes the third state. |
| 5 | **Templates** | Three or four live template previews at true size, asymmetric widths so the row never becomes a zigzag. |
| 6 | **Pricing** | Price very large. `--text-display` numerals. One plan per column, no card chrome, whitespace doing the separating. |
| 7 | **FAQ** | Questions left, answer right, answer pane sticky. Selection follows hover, click, and keyboard. |
| 8 | **CTA + Footer** | A plain sentence and one button on an almost-empty screen. Footer as a designed close: the wordmark at full width. |

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

## 16. Pre-ship

- [ ] Three hues only. No fourth.
- [ ] Running text in full `--ink`
- [ ] Every headline ≤ 2 lines at 390px
- [ ] Six type steps, no more
- [ ] Section gaps ≥ 160px desktop
- [ ] No shadow on anything at rest
- [ ] No banned effect from §13
- [ ] One primary action per screen
- [ ] ≥ 4 real interface fragments
- [ ] 390px checked, no horizontal scroll
- [ ] Keyboard walkthrough passes
- [ ] Reduced motion verified
- [ ] No raw Tailwind in JSX (R7)
- [ ] Passes the §13 logo-swap test