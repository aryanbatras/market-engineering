# design.md

Binding design system for Market Engineering. This document is a contract, not a mood board. Deviations require founder sign-off.

---

## 1. Who we design for

Our users are engineering students and early-career engineers at tier-2 and tier-3 Indian colleges. Most arrive with real ability and no idea how to present it. They are not design-literate. They compare our product against Instagram, Notion, and Linear — not against other developer tools.

**Therefore:** generous spacing, large type, high contrast, obvious affordances, nothing that rewards effort to figure out. If a freshman needs a second look, it is wrong.

---

## 2. Design thesis

> **Quiet precision. One loud idea per screen.**

The product does something genuinely unusual — it turns plain text into a finished website. Our design reflects that: calm, confident, engineered. Not playful, not hacker-styled, not corporate-generic.

We borrow HeroUI's **metrics and token architecture** (radius multiplier scale, no-border-by-default, two-layer near-invisible shadows, OKLCH colour space) and shadcn/ui's **component substrate**. We do not run both libraries' components.

---

## 3. Signature element — "Compile"

Our hero is a live moment, not a headline with a gradient behind it.

A text panel on the left fills with YAML, line by line. As each line lands, the rendered portfolio beside it rebuilds in real time. Text becomes website. The user understands the entire product in eight seconds without reading a word of explanation.

This is the single bold gesture. Everything else on the page stays disciplined so this lands.

**This signature appears once per page.** It does not become a component we sprinkle everywhere.

---

## 4. Colour

### 4.1 Palette

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#FFFFFF` | Page background. Default, and non-negotiable. |
| `--surface` | `#FAFAFB` | Cards, panels, recessed areas |
| `--surface-2` | `#F4F4F6` | Inputs, hover fills, code blocks |
| `--ink` | `#101014` | Primary text |
| `--ink-muted` | `#5F6068` | Secondary text, descriptions |
| `--ink-faint` | `#8E8F98` | Captions, placeholders, disabled |
| `--hairline` | `#E7E7EC` | Dividers and separators **only** |
| `--accent` | `#5B4BE8` | Primary action, links, focus |
| `--accent-soft` | `#EFEDFE` | Accent tint backgrounds |
| `--accent-ink` | `#3B2FBF` | Accent text on white |
| `--warm` | `#F2704B` | Success / "published" moment. Rare. |
| `--success` | `#12A150` | Positive states |
| `--danger` | `#E5484D` | Errors, destructive actions |

### 4.2 Rules

- **Light is the default.** Dark mode is opt-in per portfolio, never the product default.
- **Accent is solid.** No gradient meshes, no purple-to-pink washes, no animated gradient text.
- **`--warm` is rationed.** One per screen maximum. If everything is warm, nothing is.
- **Contrast floor:** body text ≥ 4.5:1, large text and UI borders ≥ 3:1.
- **`--hairline` never outlines a component.** Surfaces separate by background difference and shadow. Hairlines are for content dividers.
- Author colours in `oklch()` in the token layer; the hex values above are the reference rendering.

---

## 5. Typography

### 5.1 Faces

| Role | Face | Notes |
|---|---|---|
| Display | **Instrument Sans** | Characterful geometric grotesque. Used at large sizes with restraint. |
| Body | **Inter** | Maximum legibility at 16px for non-design-literate readers. |
| Utility | **Geist Mono** | Labels, overlines, code, handles, dates, metadata |

Never Inter for display. Never three weights of one family.

### 5.2 Scale

Text is bigger and cleaner than a typical SaaS default. Generous, not shouty.

| Token | Size | Line height | Tracking | Weight |
|---|---|---|---|---|
| `display-xl` | `clamp(2.75rem, 6vw, 4.5rem)` | 1.05 | `-0.035em` | 600 |
| `display-l` | `clamp(2.25rem, 4.5vw, 3.5rem)` | 1.1 | `-0.03em` | 600 |
| `display-m` | `clamp(1.75rem, 3vw, 2.5rem)` | 1.15 | `-0.025em` | 600 |
| `title-l` | `1.5rem` | 1.3 | `-0.02em` | 600 |
| `title-m` | `1.25rem` | 1.4 | `-0.015em` | 600 |
| `body-l` | `1.125rem` | 1.6 | `-0.01em` | 400 |
| `body` | `1rem` | 1.65 | `0` | 400 |
| `body-s` | `0.9375rem` | 1.6 | `0` | 400 |
| `caption` | `0.8125rem` | 1.5 | `0` | 500 |
| `overline` | `0.75rem` | 1.4 | `0.08em` | 600, uppercase |

### 5.3 Rules

- **Body copy never drops below 16px.** Captions may go to 13px. Nothing smaller.
- Measure: 60–72 characters for prose. Resume and project descriptions cap at 68.
- Overlines are reserved for section labels. They are not decoration — if a section isn't a real category, it doesn't get an overline.
- Tabular numerals for dates, durations, and counts.

---

## 6. Spacing and layout

Base unit **4px**. Everything is a multiple.

| Token | Value | Use |
|---|---|---|
| `space-1` | `0.25rem` | Icon gaps |
| `space-2` | `0.5rem` | Tight internals |
| `space-3` | `0.75rem` | Inline spacing |
| `space-4` | `1rem` | Default gap |
| `space-6` | `1.5rem` | Card padding (mobile) |
| `space-8` | `2rem` | Card padding (desktop) |
| `space-12` | `3rem` | Between blocks |
| `space-16` | `4rem` | Section rhythm |
| `space-24` | `6rem` | Major section separation |
| `space-32` | `8rem` | Hero breathing room |

**Grid:** 12 columns, max width `1200px`, gutter `1.5rem` (`1.25rem` under 768px).

**Breakpoints:** `sm 640` · `md 768` · `lg 1024` · `xl 1280`. Mobile-first.

**Rule:** whitespace between sections is fixed. Inside a section, whitespace flexes. Sections never bleed into each other.

---

## 7. Radius, borders, elevation

HeroUI's multiplier approach. One variable drives the whole scale.

```
--radius: 0.875rem   /* 14px base — rounder than HeroUI's 8px, per brief */

--radius-xs:   calc(var(--radius) * 0.25)   /*  3.5px */
--radius-sm:   calc(var(--radius) * 0.5)    /*  7px   */
--radius-md:   calc(var(--radius) * 0.75)   /* 10.5px */
--radius-lg:   calc(var(--radius) * 1)      /* 14px   */
--radius-xl:   calc(var(--radius) * 1.5)    /* 21px   */
--radius-2xl:  calc(var(--radius) * 2)      /* 28px   */
--radius-3xl:  calc(var(--radius) * 3)      /* 42px   */
--radius-4xl:  calc(var(--radius) * 4)      /* 56px   */
```

| Element | Radius |
|---|---|
| Buttons (primary CTA) | `999px` — pill |
| Buttons (secondary) | `--radius-md` |
| Inputs | `--radius-md` |
| Cards | `--radius-lg` |
| Panels, modals | `--radius-2xl` |
| Avatars | `999px` |
| Chips, tags | `999px` |

**Borders:** none by default (`--border: transparent`). Component separation comes from background and shadow. Hairlines appear only as content dividers inside cards and lists.

**Elevation:**

```
--shadow-xs: 0 1px 2px rgba(16,16,20,0.04)
--shadow-sm: 0 1px 2px rgba(16,16,20,0.04), 0 2px 4px rgba(16,16,20,0.03)
--shadow-md: 0 1px 2px rgba(16,16,20,0.04), 0 8px 24px -12px rgba(16,16,20,0.08)
--shadow-lg: 0 2px 4px rgba(16,16,20,0.04), 0 24px 48px -24px rgba(16,16,20,0.14)
```

Shadow opacity stays low. If a card's shadow is visible as a glow, it is too strong.

---

## 8. Motion

Motion earns its place or it is removed. No ambient loops on marketing surfaces.

**Durations**

| Token | Value | Use |
|---|---|---|
| `--duration-micro` | `120ms` | Hover, press |
| `--duration-fast` | `200ms` | Small state change |
| `--duration-base` | `320ms` | Element entering |
| `--duration-slow` | `500ms` | Hero sequence |

**Easing**

```
--ease-out:      cubic-bezier(0.22, 1, 0.36, 1)
--ease-in-out:   cubic-bezier(0.65, 0, 0.35, 1)
--ease-spring:   linear(0, 0.2, 0.8, 1, 1.05, 0.95, 1.03, 1.01)
```

**Rules**

- Elements enter by moving 8–16px and fading. Never by scaling from 0.
- Stagger lists at 40–60ms intervals, capped at 6 items.
- One orchestrated moment per page. The hero "Compile" sequence is that moment.
- **`prefers-reduced-motion` is mandatory.** Reduced motion disables parallax, scroll-linked animation, autoplay video, and all looping decoration. Content still appears instantly.
- GSAP handles scroll choreography. Motion (framer) handles component state. React Three Fiber handles 3D. Each where it belongs.

---

## 9. Component rules

### Buttons
- Primary: `--accent` fill, white text, pill, 44px min height. **One primary per screen.**
- Secondary: `--surface-2` fill, `--ink` text, `--radius-md`, 40px min height.
- Ghost: transparent, `--ink-muted` text, appears on hover fill.
- Labels are verbs in the present tense. "Publish", "Save changes", "Continue". Never "Submit".
- No icons in buttons unless the icon *is* the label.

### Cards
`--surface` fill, `--radius-lg`, `--shadow-sm`, `--space-8` padding. Hover lifts to `--shadow-md` only when the card is actually clickable. Non-interactive cards never lift — that motion means "you can press this", and if you can't, it's a lie.

### Inputs
`--surface-2` fill, 1px `--hairline` border (inputs are the exception to the no-border rule, because fields need containment), `--radius-md`, 44px min height. Label sits above, always. Helper text sits below, never as placeholder-only.

Placeholders show format, never replace labels.

### Forms
One column always. Labels above fields. Errors below the field, in `--danger`, stating what to do. Never an inline red border with no message.

### Navigation
Left-aligned. Generous height (64px). Current page marked with weight change plus colour, not colour alone.

### Empty states
An empty screen is an invitation to act. It names the next step and offers the button that performs it. Never an illustration with "Nothing here yet".

### Loading
Skeletons matching final layout dimensions. Never a spinner alone. Never a full-screen loader on route transitions under 400ms.

### Toasts
Confirm what happened, in the same verb the button used. Button says "Publish" → toast says "Published". Auto-dismiss 4s. Errors persist until dismissed.

---

## 10. Iconography

- One icon set. **Phosphor** (regular weight, 1.5px stroke at 20px) as the house set.
- Icons are 20px in UI, 24px as feature markers. Never arbitrary sizes.
- **Never emoji as UI icons.** No 🚀 in a hero. No ✅ in a list.
- Icons accompany text or replace it entirely. They never sit inside a rounded square with a tinted background — that pattern is the single loudest AI-slop tell.
- Stroke weight stays consistent across the entire product. Mixing weights reads as carelessness.

---

## 11. Voice

- Plain, direct, warm. Talk to a student, not to a growth team.
- Sentence case everywhere. Not Title Case On Everything.
- Active voice. "Your site is live", not "Your site has been published".
- Never condescending, never hyped, never exclamation-heavy.
- No "unlock", no "supercharge", no "game-changing", no "level up your career".
- Errors never apologise and are never vague. "That file is larger than 2 MB. Try a smaller image."
- Empty states are directions, not mood.
- Keep one vocabulary per action across the whole product. "Publish" means publish everywhere.

---

## 12. Anti-slop blacklist

These are banned outright. Each is the default output of a generic AI-generated interface.

| Banned | Do instead |
|---|---|
| Purple/indigo gradient mesh backgrounds | Solid `--bg`, or one `--accent` element |
| Gradient-filled or animated gradient text | Solid `--ink`, weight and size carry the headline |
| Emoji as icons or decoration | Phosphor set, or nothing |
| Glassmorphism / frosted blur cards | Solid `--surface` with a real shadow |
| Icon in a rounded tinted square | The icon alone, or a word |
| "Trusted by" logo wall | Real numbers, or omit |
| Infinite marquee of buzzwords | Static, factual capability list |
| Three equal columns of icon + heading + text | Whatever structure the content actually needs |
| Particle, meteor, sparkle, aurora, warp effects | Motion that communicates something |
| Neon gradient cards, shine borders | `--surface` and `--shadow-md` |
| Dark mode by default | Light |
| Everything centred | Left-aligned by default |
| Three identical stat blocks | One number that means something |
| Blob / 3D mascot illustrations | Photography or nothing |
| "Welcome to my portfolio" | The person's actual name, large |
| Testimonial carousel with 2 quotes | One real quote, or none |
| Loading spinner | Skeleton |
| Rainbow or multicolor data viz | One accent, ink for the rest |

**Self-check before any UI ships:** if this screen would still make sense with the company logo replaced by any other company, it is templated. Redesign it.

---

## 13. Reference stack

**Component substrate:** shadcn/ui (Tailwind v4 native, gives us `cn`/`cva` required by R7).

**Design target:** HeroUI. We take their token architecture and metrics — radius multiplier scale, transparent borders, low-opacity shadow stack, OKLCH authoring, semantic colour naming. We do not install their component library alongside shadcn; two Radix-wrapped primitive sets collide.

**Motion:** GSAP (scroll choreography) · Motion (component state) · React Three Fiber (3D layer).

**MagicUI whitelist** — shadcn-compatible registry, use sparingly:

`Bento Grid` · `Marquee` · `Blur Fade` · `Text Reveal` · `Number Ticker` · `Dot Pattern` · `Progressive Blur` · `iPhone` (device mock) · `Animated List` · `Typing Animation`

**MagicUI blacklist** — exactly the AI-slop set:

`Particles` · `Meteors` · `Aurora Text` · `Warp Background` · `Neon Gradient Card` · `Shine Border` · `Rainbow Button` · `Shimmer Button` · `Sparkles Text` · `Animated Gradient Text` · `Confetti` · `Retro Grid` · `Comet`

---

## 14. Portfolio templates

Templates share the token system but **must not share a composition**. A recruiter who has seen three of our templates should be able to tell them apart from the layout alone, with logos and names stripped.

| Template | Composition | Type | Character |
|---|---|---|---|
| **Classic** | Single column, linear scroll | Display serif-adjacent or Instrument Sans | ATS-friendly, unambiguous. The safe choice, executed precisely. |
| **Bento** | Asymmetric grid, varied tile spans | Inter, tight | Confident, project-forward. Grid carries the hierarchy. |
| **Editorial** | Split — fixed nav rail, fluid content column | Large display, generous leading | Considered. Reads as deliberate rather than generated. |
| **Minimal** | Wide margins, almost nothing on screen | Huge display, tiny everything else | Restraint as a flex. The hardest to get right. |
| **Immersive** | Full-bleed 3D hero, content below | Display over GSAP/R3F | The paid flagship. Highest effort, highest differentiation. |

**Rules for templates:**

- Each declares its own token overrides in its own `meta`. They do not restyle shared components to suit themselves.
- Light background is the default for all five. Dark is opt-in per template, never default.
- Mobile is designed first, then widened. Not the reverse.
- Templates never ask for config the product doesn't expose. Config surface is accent colour, type density, and dark mode for v1.
- Footer: free tier carries "Made with love" — a small text wordmark with a single Phosphor heart glyph, `--ink-faint`, no background pill, no badge chrome. Removed on paid.

---

## 15. Accessibility floor

Non-negotiable, checked before shipping any surface:

- Responsive from 360px up, no horizontal scroll at any width.
- Visible keyboard focus on every interactive element, using `--accent` at 2px with 2px offset. Never `outline: none` without a replacement.
- All interactive targets ≥ 44×44px on touch.
- `prefers-reduced-motion` fully respected.
- Colour is never the sole carrier of meaning.
- Semantic HTML throughout. Heading order never skips a level.
- Images and avatars have alt text or an explicit empty alt.
- Text remains selectable in portfolio templates — recruiters copy from these.

---

## 16. Pre-ship checklist

- [ ] Light background, white or `--surface`
- [ ] No banned effect from §12
- [ ] One primary action per screen
- [ ] Body text ≥ 16px, contrast ≥ 4.5:1
- [ ] Mobile checked at 360px
- [ ] Keyboard walkthrough passes, focus visible
- [ ] Reduced motion verified
- [ ] No raw Tailwind in JSX (R7)
- [ ] Copy in sentence case, active voice, no AI-slop vocabulary
- [ ] Fails the §12 logo-swap test