# Component inventory

What we use, what we built, and what we rejected. Binding constraints from `DESIGN.md` apply. Portfolio templates are specced in `template-system.md`, not here.

---

## Stack

**shadcn/ui is the substrate.** We own the source — our templates are the product, and we cannot ship a third-party component library as our closed-source differentiator.

**HeroUI's design metrics are the target.** Radius multiplier scale, transparent borders by default, low-opacity shadow stack, OKLCH authoring, semantic colour naming. We do not install HeroUI components alongside shadcn; two Radix-wrapped primitive sets collide on focus rings, radii, and shadows.

**MagicUI, whitelisted only.** It is shadcn-compatible, so it drops into our source tree cleanly.

---

## Tokens

Defined once in CSS via Tailwind v4 `@theme`, consumed by TS class maps (R7).

| Group | Tokens |
|---|---|
| Colour | `bg`, `surface`, `surface-2`, `ink`, `ink-muted`, `ink-faint`, `hairline`, `accent`, `accent-soft`, `accent-ink`, `warm`, `success`, `danger` |
| Type | `display-xl`, `display-l`, `display-m`, `title-l`, `title-m`, `body-l`, `body`, `body-s`, `caption`, `overline` |
| Space | `space-1` through `space-32`, 4px base |
| Radius | `xs` `sm` `md` `lg` `xl` `2xl` `3xl` `4xl`, all derived from `--radius` |
| Elevation | `shadow-xs` `shadow-sm` `shadow-md` `shadow-lg` |
| Motion | `duration-micro` `fast` `base` `slow`; `ease-out` `ease-in-out` `ease-spring` |

**One variable drives the radius scale.** Changing `--radius` rescales everything, which is why templates can adopt different geometry without forking the token system.

---

## Adopted from shadcn/ui

Installed via CLI, adapted to our tokens. Each file keeps its variant map in the component file — this is the one sanctioned exception to R6, because a variant map is the component's definition rather than a separate implementation.

| Component | Adaptation |
|---|---|
| `Button` | Pill radius on primary, `--radius-md` on secondary. Minimum 44px touch height. |
| `Input`, `Textarea`, `Label` | `--surface-2` fill, `--hairline` border, `--radius-md`. Label above, always. |
| `Card` | `--surface`, `--radius-lg`, `--shadow-sm`. No lift unless clickable. |
| `Dialog` | `--radius-2xl`, `--shadow-lg`. |
| `Tabs` | `--surface-2` track, `--surface` active tab. |
| `Select`, `Checkbox`, `Switch`, `RadioGroup` | Standard adaptations. |
| `Tooltip` | `role-2xl`, 320ms. |
| `Toast` / `Sonner` | Bottom-right. Auto-dismiss 4s, errors persist. |
| `Progress`, `Skeleton` | Skeleton dimensions match final layout. |
| `Accordion` | Used for the block editor in v1.5. |
| `Alert` | Errors state what to do, not what went wrong. |

**Not adopted:** anything requiring a runtime we do not have, or duplicating a primitive we already have.

---

## Built by us

| Component | Why |
|---|---|
| `YAMLInput` | Split editor with line numbers, live validation, errors pinned to lines. The centrepiece of the ingestion flow. Needs behaviour no library provides. |
| `TemplateSwitcher` | Live preview switcher showing all five with the actual render. |
| `ConfigPanel` | Accent, density, dark mode. Three controls, deliberately. |
| `HandleClaim` | Live availability checking as the user types. Reserved-word and profanity filtering. |
| `SourceBadge` | Shows field provenance — `from GitHub` — with an inline override. Implements the merge model visibly. |
| `CompileHero` | The signature element (`DESIGN.md` §3). Marketing only. It is the live thing — a working editor, not a video. |
| `SectionShell` | Consistent section spacing across templates. The rule that stops section paddings fighting each other. |
| `ProvenanceDot` | GitHub-derived field indicator. |

### Resume components

New for the second render target. Lives in the `resume` domain, not `core` — none of these are used by the portfolio.

| Component | Why |
|---|---|
| `DocumentSheet` | A previewing resume as a sheet of paper: locked A4 proportion, `--shadow-float`, no radius, real text at real size. Per `DESIGN.md §9`. The one resting shadow in the product, with a written §16 allowance. |
| `SheetFrame` | The sunken stage a sheet sits in, with horizontal scroll at 390px. Separated from `DocumentSheet` so the sheet stays a pure object and the frame owns the viewport behaviour. |
| `LayoutSwitcher` | The ten resume layouts, previewed with the user's own data. Different from `TemplateSwitcher` — it switches a layout descriptor, not a React component. |
| `ExtractedTextPane` | The ATS result. Real extracted text in Geist Mono, four to six lines, with failures named underneath. Per R19. |
| `ParseFinding` | One failed check, in a sentence that says what to do. Weight and icon carry the state, because there is no red. |
| `CompileAction` | "Download PDF". Says plainly that the first one prepares an engine, and never shows a spinner. |

---

## Domain placement

Every component above belongs to exactly one domain, and the folder says which.

| Domain | Components |
|---|---|
| `core` | `Button`, `Field`, `Card`, `Badge`, `Page`, `Shell`, `Section`, `Reveal`, `ScrollReveal`, `SourceEditor`, `JsonLd`, `Wordmark` |
| `portfolio` | `YAMLInput`, `TemplateSwitcher`, `ConfigPanel`, `HandleClaim`, `SourceBadge`, `CompileHero`, `SectionShell`, `ProvenanceDot` |
| `resume` | `DocumentSheet`, `SheetFrame`, `LayoutSwitcher`, `ExtractedTextPane`, `ParseFinding`, `CompileAction` |

**A component moves to `core` only when a second domain needs it.** Today `core` holds only things that were already shared before the domains existed. See `../02-architecture/domain-model.md`.

---

## MagicUI whitelist

Shadcn-compatible, restrained, each used only where it earns its place.

| Component | Use |
|---|---|
| `Bento Grid` | Bento template layout |
| `Blur Fade` | Section entrance |
| `Text Reveal` | Hero headline |
| `Number Ticker` | Dashboard metrics |
| `Dot Pattern` | Immersive template background texture |
| `Progressive Blur` | Builder header |
| `Marquee` | Language and technology list, in templates only |
| `Animated List` | Import results |
| `Typing Animation` | Immersive hero |
| `iPhone` | Device mock in the marketing page |

## MagicUI blacklist

Exactly the AI-slop set. Each one appears in `DESIGN.md` §13 for the same reason.

`Particles` · `Meteors` · `Aurora Text` · `Warp Background` · `Neon Gradient Card` · `Shine Border` · `Rainbow Button` · `Shimmer Button` · `Sparkles Text` · `Animated Gradient Text` · `Confetti` · `Retro Grid` · `Comet`

**Given the three-hue palette most of these are additionally impossible.** The blacklist exists so nobody spends an afternoon discovering that.

---

## Icons

**React Icons, Lucide family only.** Founder-pinned. MIT.

React Icons aggregates many families whose stroke weights and geometry differ, so the rule is stricter here than with a single-family library: **exactly one family for the whole product.** We use `react-icons/lu`, at 20px in UI and 24px as feature markers.

```ts
import { ArrowRight, Check, Github } from "react-icons/lu"
```

Per-icon imports only. Never the barrel file — it defeats tree-shaking. `optimizePackageImports` covers `react-icons` in the production build.

One set, one weight, no exceptions. Mixing weights reads as carelessness and it is the fastest way to make a polished page look assembled from parts.

---

## Motion

| Library | Owns | Notes |
|---|---|---|
| **GSAP** | Scroll choreography | `ScrollTrigger`, `SplitText`, `Flip`. Templates and hero only. |
| **Motion** | Component state | Enter, exit, layout transitions. |
| **React Three Fiber** | 3D layer | Immersive template only. |

**All three lazy-loadable, all declared in template `meta`, all subject to the CI bundle-isolation check.**

`prefers-reduced-motion` disables parallax, scroll-linked animation, autoplay, and looping decoration across all three.

---

## Lint enforcement

| Rule | Enforces |
|---|---|
| `no-restricted-imports` per layer | R13 layering |
| `no-restricted-imports` per domain | R18 — `portfolio` and `resume` never import each other; `core` never imports either |
| No `dangerouslySetInnerHTML` outside an allowlist | XSS, per `security-and-privacy.md` |
| No comments in `src/**` | R5 |
| No Tailwind literals in JSX | R7 |
| No runtime-constructed class names | R7 static-literal constraint |
| No AI SDK imports | R1 and the privacy promise |
| No raw LaTeX outside `application/resume/latex/` | R19 — a layout emits blocks, never document structure |
| No icon or symbol font in a generated preamble | R19 — the ATS contact-detection trap |

These ship with the scaffold, in the same change that creates the folders. A rule added later is a rule that gets violated first.

The two domain rules are enabled **last**, after the folders exist and everything compiles. A rule that fails on day one of a refactor gets disabled by day two.