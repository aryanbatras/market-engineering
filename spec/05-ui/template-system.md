# Template system

Portfolio templates are designed here, not in `DESIGN.md`.

`DESIGN.md` covers **our** surfaces — the marketing site, the builder, the dashboard, the template gallery. It is deliberately narrow.

This document covers the **hundreds of templates we will eventually ship**. We are not designing one template in a system document. We are designing the system that lets hundreds of templates exist coherently without any of them looking like us.

---

## The relationship

Templates **inherit** from `DESIGN.md`:

- Three hues: white, black, blue. Nothing else, ever.
- Two radii: `--radius-pill` and `--radius-panel`. Nothing else, ever.
- Geist, at the six defined steps. A template may re-weight and re-scale within them.
- The same spacing rhythm, the same margins, the same breakpoints.
- The same accessibility floor, without exception.

Templates **own**:

- Composition — how the sections are arranged on the page
- Which sections exist, and in what order
- Density — how much fits on screen
- Dark or light, per template
- Personality — the one thing this template is for

**This is the distinction that makes hundreds of templates tractable.** A template that re-weights type, changes density, and rearranges composition looks completely different from its neighbours while drawing from the same three colours and the same two radii. A template that introduces its own palette is unmaintainable and immediately reads as off-brand.

---

## Why the constraint is good

Our users are not design-literate and they are not designers. They cannot judge craft. What they *can* do is recognise whether a template looks like them — their age, their ambition, their register.

**A template set with wildly different aesthetics helps them.** A template set with wildly different *implementation* creates a maintenance burden we cannot afford at hobby tier, and produces a gallery that looks incoherent.

Inheriting tokens and owning composition gets both: variety where the user perceives it, consistency where it costs us.

---

## v1 — the first five

We ship five. They are deliberately spread across the space so a user can recognise which one is theirs.

| # | Template | Composition | Type | Character |
|---|---|---|---|---|
| 1 | **Classic** | Single column, linear scroll | Display weight 800, generous leading | The safe choice, executed precisely. ATS-friendly, unambiguous. What a recruiter expects. |
| 2 | **Bento** | Asymmetric grid, varied tile spans | Title scale, tight | Confident, project-forward. The grid carries the hierarchy, not type size. |
| 3 | **Editorial** | Split — fixed nav rail, fluid content column | Large display, wide leading | Considered. Reads as deliberate rather than generated. |
| 4 | **Minimal** | Wide margins, almost nothing on screen | Display only for the name, everything else micro | Restraint as a flex. The hardest one to get right. |
| 5 | **Immersive** | Full-bleed hero, content below | Display over GSAP and R3F | The paid flagship. Highest effort, highest differentiation. |

**Templates must not share a composition.** A recruiter who has seen three of ours should identify them from layout alone, with logos and names stripped. That is the test.

---

## What every template must do

**Structurally**

- Pure function of `(data, config)`. Never fetches, never holds state that outlives a render, never imports from `application/` or `infrastructure/`. See `../02-architecture/template-runtime.md`.
- Declares `supportedVersions`, `capabilities`, and `config` surface in its `meta`.
- Mobile-first. Designed at 390px, then widened. Never the reverse.

**For the reader**

- A recruiter spends about ten seconds. They must understand what the person can do in ten seconds.
- Real text in the DOM. Not images, not canvas, not rendered client-side after load. **A portfolio that looks right but scores zero in an ATS has failed at its actual job.**
- Text selectable. Recruiters copy from these.

**Commercially**

- Templates stay on our infrastructure. No source download, no fork, no self-hosting. The whole business depends on this.
- Free-tier templates carry a small "Made with love" in the footer — `--ink-45`, a single heart glyph, no pill, no badge chrome. Removed on paid.
- **No external assets inside templates.** Illustrations, icon packs, and stock imagery are prohibited in anything we render to users. Several common licences ban exactly our business model — see `../04-research/external-assets.md`.

---

## Config surface

Deliberately small. Three controls: **accent colour** (within the blue family), **type density** (compact / comfortable), **dark mode** (on / off).

Rohit — the persona most likely to convert — wants to customise everything and cannot afford to think about it. Fifteen choices is a project. Three is a decision.

A template may not expose more than these three, and may not add configuration that only applies to it. That last rule is what keeps the shared builder coherent as the catalogue grows.

---

## Adding a template

1. New folder under `presentation/templates/<id>/`.
2. `index.ts` exports the `Template`. `meta.ts` exports `id`, `supportedVersions`, `capabilities`, `config`.
3. One entry in the generated registry.
4. A fixture test rendering it against every stored schema version.
5. A bundle-isolation check — if this template's chunk contains another template's dependencies, the build fails.

A template is a folder drop-in. If adding one requires touching shared components, the template is wrong.

---

## Beyond v1

**v1.5 — the block editor.** The "Windows chrome, Apple restraint" portfolio. Bespoke blocks: Spotify, YouTube, weather, project cards, drag-to-reorder. This is a different problem from a fixed template, and it gets its own spec.

**Hundreds of templates.** The design above is what makes that possible. A new template costs a folder and an afternoon; it does not cost a design system change, a new palette decision, or a review conversation about whether it still looks like us.

**Template requests from paid users** are a growth loop and a content pipeline. The rules in this document are what keep a hundred community-submitted templates coherent.

---

## Review checklist

Per template, before it ships:

- [ ] Three hues only, two radii only, six type steps only
- [ ] No composition shared with an existing template
- [ ] Real text in the DOM, selectable, ATS-readable
- [ ] Mobile designed first at 390px
- [ ] Contrast ≥ 4.5:1, focus visible, reduced motion respected
- [ ] "Made with love" present on free, absent on paid
- [ ] `prefers-reduced-motion` removes all 3D and scroll choreography gracefully
- [ ] Bundle isolation check passes
- [ ] Fails the logo-swap test from `DESIGN.md` §13