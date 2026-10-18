# Monetisation

Founder decision, India-first: **₹83/month (≈$1)**, Razorpay, UPI-first.

---

## Why a subscription and not a one-time purchase

The original reasoning for a one-time fee was that a ₹99 lifetime purchase feels bigger. It was rejected.

**If users downloaded the template source, they would publish it themselves and the business would end.** The product's defensibility is that the templates never leave our infrastructure. There is nothing to license.

Once source delivery is off the table, a one-time payment has nothing to sell. The value is in templates that keep improving and recruiter surfaces that keep getting better — a continuing relationship, which is what a subscription expresses.

At ₹83/month, a fresher can sustain this through a placement or two. It is below the threshold where anyone asks their parents.

---

## Why we keep templates closed-source

If we shipped template source:

1. The user self-hosts and we never see them again.
2. The template is published publicly within a week — it is now a free sample of our entire product.
3. Competitors copy it, or the template becomes the product for someone else.
4. Every future template inherits the same fate.

**Our moat is implementation opacity.** A user who cannot tell how a 3D portfolio is built will pay ₹83/month for it forever and never think to rebuild it. One who has the source will, and so will the next hundred people we show it to.

This is also why we own the component source rather than depending on a component library — our templates *are* the product.

---

## Free tier

The free tier must be genuinely useful. A deliberately crippled free tier converts nobody; it produces signups who feel tricked and never return.

| Capability | Free | Paid |
|---|---|---|
| Published portfolios | 1 | 1 |
| Templates | 4 of 5 | All 5, including Immersive |
| YAML import | Yes | Yes |
| GitHub import | Yes | Yes |
| Data export | Yes | Yes |
| Recruiter surfaces | Yes | Yes |
| Accent, density, dark mode | Yes | Yes |
| "Made with love" footer | Present | Removed |
| New templates as they ship | Yes | Yes |
| Priority on template requests | No | Yes |

**The paid line is template access and branding removal** — not the ability to get a job. A free user gets every feature that serves the actual problem.

---

## Why Immersive is the paid template

The 3D/animated template is the highest-effort item by a wide margin, and the clearest demonstration of what the product does that a free Canva or a free HTML resume cannot.

It is also the one most likely to be screenshotted and shared, which is how other people discover that the thing exists.

Every other template is available on the free tier. The one that costs us the most is the one that costs them.

---

## "Made with love"

Free tier footer. Small, `--ink-faint`, a short text wordmark with a single Phosphor heart glyph. No background pill, no badge chrome, no ribbon.

Deliberately understated. A loud badge would wreck the design (`design.md` §12) and would generate the resentment that turns a free user into a refund request.

---

## Pricing rationale

| Option | Decision |
|---|---|
| ₹83/month | **Chosen.** Clears UPI comfortably, registers as a real purchase, sustainable through one placement. |
| ₹199/month | Too much for the audience. |
| ₹99 one-time | Rejected — no ongoing value to sell. |
| ₹99/year | Deferred until 50 paying users give us retention data. |
| Freemium with ads | Rejected. We hold PII for students; advertising is incompatible with that. |

---

## Upgrade triggers

We surface the paywall where it has genuine relevance, not on a timer.

1. **User selects the Immersive template** — paywall at the point of desire.
2. **Publish attempt with a free-tier template** — the banner is our only monetisation surface, so let them see what removing it looks like.
3. **Settings page** — always available, never intrusive.
4. **No upgrade prompt before the user has a published portfolio.** Asking someone to pay before they have anything to show is asking for money in exchange for nothing.

---

## What we do not build in v1

- Annual plans
- Team or organisation plans — our users are individuals
- Usage metering — we do not meter what we are selling
- Promo codes or discounts — ₹83 needs no discount, and discount mechanics are a support burden
- Tiered plans beyond free and paid

---

## Unit economics

At ₹83/month with Razorpay's ~2% plus GST:

- Gross ≈ ₹83
- Net ≈ ₹80
- Fixed costs ≈ ₹0 until R1 lifts
- **Contribution margin is effectively 100% on the hobby tier**, because there is nothing to pay for

The first real cost arrives when we need Turso Developer at $5.99/month or Clerk Pro at $25/month. Both are trivially covered by **one** paying customer.

**That is the whole economic argument for R1's trigger point.** The business becomes self-sustaining at customer number one.

---

## Expansion beyond portfolios

The portfolio generator is the wedge, not the product. The wider platform — resume tailoring, LinkedIn framing, content, video — follows once the portfolio proves the user will show up and publish.

Pricing for those is not decided here. What is decided: they attach to the same account and the same subscription, rather than becoming separate products requiring separate purchases from a price-sensitive audience.