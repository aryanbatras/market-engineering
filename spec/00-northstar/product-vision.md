# Product vision

---

## One sentence

We turn the work an engineer already has into a portfolio that makes recruiters take them seriously.

---

## The wedge

**The portfolio generator is the first feature, not the product.**

The wider platform is job-market readiness: resume tailoring, LinkedIn framing, content, video, interview prep. All of it is the same underlying problem — a competent person whose work is invisible.

The portfolio is the wedge because it produces a **live URL a recruiter can open.** It is the only artefact in the entire problem space that gets passed to a third party. Everything else we build later attaches to an account and a subscription we already have.

---

## Who we are for

Engineering students and early-career engineers at tier-2 and tier-3 Indian colleges. People with real ability and no idea how to present it.

**Explicitly not for:** engineers who can already build their own portfolio. They will not visit, and we do not want them to. If a technical person has the ability to create a portfolio, they create one and we are irrelevant to them. Our users are, by construction, non-technical — which is why the design is light, large, and generous rather than dark, dense, and clever.

---

## What makes this defensible

**Templates never leave our infrastructure.** No source download, no fork, no self-hosting.

This is the whole business. A user who has the source will rebuild it, and so will the next hundred people we show it to. A user who cannot see how a 3D portfolio is built pays ₹83/month for it indefinitely and never thinks about it again.

Everything else follows from this:

- **We own the component source** rather than depending on a component library, because our templates *are* the product.
- **We do not fork repositories.** We study prior art and write our own. Unmaintained forks become our maintenance burden and their licence becomes our liability.
- **The data contract is ours**, and it compounds. Every template, every import path, every recruiter surface is built on one schema.

---

## What we refuse to build

Stated up front so nobody adds them later by accident.

| Refused | Why |
|---|---|
| **Template source download** | Ends the business |
| **Self-hosting instructions** | Same, wearing a different hat |
| **AI API integration** | Breaks R1's cost model and the privacy promise simultaneously |
| **Server-side resume storage** | PII we do not need to hold |
| **Advertising** | We hold student PII. Ads are incompatible with that. |
| **Multiple portfolios in v1** | One account, one portfolio, one handle |
| **Freeform block editor in v1** | Most expensive item on the list, most likely half-finished |
| **A free tier that cannot succeed** | Converts nobody, just produces resentment |

---

## Principles

**1. Ten minutes to a live URL.**
Every decision serves this. A feature that adds five minutes to the path is a feature that halves our conversion.

**2. Anonymous until the last moment.**
Render a portfolio without an account. Publishing is the only gate, and it sits at the point where the user already has something they want. An anonymous preview creates no auth user and no database row, so it costs nothing against any quota.

**3. The user's data is always theirs.**
Export on every tier, free included. Data captivity signals that a free tool might vanish, and it is the fastest route to losing trust. Export is also a growth loop.

**4. Light background, large type, no cleverness.**
Most of our users will read on a mid-range phone in Indian daylight. Small grey text is how people conclude they do not belong.

**5. One idea per screen.**
The Compile element is the bold gesture. Everything around it stays disciplined so that it lands.

**6. Ship the honest version.**
If PDF resume import cannot work without an LLM, we do not ship it. A half-working feature costs more trust than a missing one.

---

## Where this goes

**v1** — portfolio generator. Five templates, three ingestion paths, recruiter surfaces, ₹83/month.

**v1.5** — the block editor. The "Windows chrome, Apple restraint" portfolio that Rohit actually wants. Bespoke blocks: Spotify, YouTube, weather, project cards.

**v2** — resume tailoring against a specific job posting. This is the deepest version of the problem: the same data, restructured for one job. Reactive Resume's Resume Checks already validate that this is wanted.

**Later** — LinkedIn framing, content generation, video, interview prep. All on the same account and subscription.

---

## What success looks like

| Stage | Measure |
|---|---|
| Someone gets a live portfolio | The first person who sends us their URL and says it got them interviews |
| The model works | A user who would have never made one now maintains one |
| The business works | A user pays ₹83/month voluntarily, unprompted, for something they could not have built |
| The platform works | Someone subscribes for the portfolio and stays for the rest |

**The business is proven when someone pays for a template they could not have built.** Everything before that is validation, not proof.