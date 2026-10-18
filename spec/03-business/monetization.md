# Monetisation

Founder decision, India-first: **three tiers — Free ₹0, Pro ₹83/month (≈$1), Sponsor.**

---

## The three tiers

| | **Free** | **Pro — $1** | **Sponsor** |
|---|---|---|---|
| **Price** | ₹0 | ₹83/month | ₹2,500 one-off, or ₹500/month |
| **Who** | Everyone, forever | A student who is actually using it | Someone the work helped, or a company with a placement cell |
| Published portfolios | 1 | 1 | 1 |
| Templates | 4 of 5 | All 5, including Immersive | All 5 |
| YAML / GitHub import | Yes | Yes | Yes |
| Data export | Yes | Yes | Yes |
| Recruiter surfaces | Yes | Yes | Yes |
| Accent, density, dark mode | Yes | Yes | Yes |
| "Made with love" footer | Present | Removed | Removed |
| Name on the sponsors list | — | — | Yes |
| Priority on template requests | — | Yes | Yes |
| Early access to new templates | — | — | Yes |

### Why three and not two

**Pro at $1 is the product.** It is priced so low that the decision is not a decision — a fresher does not consult anyone or budget for it. That tier is the business.

**Sponsor is not a second product tier.** It is a way for someone who got a job out of their portfolio to say so, and for a company or a placement cell to reach the exact audience we have. It costs us nothing to offer, it is not a discount on Pro, and it puts money in the bank during a month with no signups.

It also does something Pro cannot: it gives a brand a reason to exist here that is not selling software. A placement cell that sponsors us has a reason to send its students to us. That is distribution we could not buy at ₹83/month.

**Sponsor must not be better than Pro.** If Sponsor gets more templates, Pro has no reason to exist. The differences are recognition and access to us, not capability.

---

## Why a subscription and not a one-time purchase

A one-time fee has nothing to sell once source delivery is off the table.

**If users downloaded the template source, they would publish it themselves and the business would end.** The product's defensibility is that templates never leave our infrastructure. There is nothing to license.

Once there is nothing to license, a one-time payment makes no sense. The value is templates that keep improving and recruiter surfaces that keep getting better — a continuing relationship, which is exactly what a subscription expresses.

---

## Why we keep templates closed-source

If we shipped template source:

1. The user self-hosts and we never see them again.
2. The template is public within a week — it is now a free sample of our entire product.
3. Competitors copy it, or it becomes the product for someone else.
4. Every future template inherits the same fate.

**Our moat is implementation opacity.** A user who cannot tell how a 3D portfolio is built pays ₹83/month for it forever and never thinks to rebuild. One who has the source will, and so will the next hundred people we show it to.

This is also why we own the component source rather than depending on a component library — our templates *are* the product.

---

## Free tier must be genuinely useful

A deliberately crippled free tier converts nobody. It produces signups who feel tricked, and they never return.

Every capability that serves the actual problem is on the free tier. **The paid line is one template and branding removal** — not the ability to get a job.

---

## Why Immersive is the paid template

The 3D/animated template is the highest-effort item by a wide margin and the clearest demonstration of something a free Canva or a free HTML resume cannot do.

It is also the one most likely to be screenshotted and shared, which is how other people discover that the thing exists.

Every other template is free. The one that costs us the most is the one that costs them.

---

## "Made with love"

Free tier footer. Small, `--ink-45`, a short text wordmark with a single Phosphor heart glyph. No pill, no badge chrome, no ribbon.

Deliberately understated. A loud badge would wreck the design (`DESIGN.md` §13) and would generate the resentment that turns a free user into a refund request.

---

## Pricing rationale

| Option | Decision |
|---|---|
| ₹83/month | **Chosen.** Clears UPI comfortably, registers as a real purchase, sustainable through one placement. |
| ₹199/month | Too much for the audience. |
| ₹99 one-time | Rejected — no ongoing value to sell once source delivery is off the table. |
| ₹99/year | Deferred until 50 paying users give us retention data. |
| Freemium with ads | Rejected. We hold student PII; advertising is incompatible with that. |

---

## Upgrade triggers

We surface the paywall where it has genuine relevance, never on a timer.

1. **User selects the Immersive template** — at the point of desire.
2. **Publish attempt** — the footer is our only monetisation surface on their live page, so let them see what removing it looks like.
3. **Settings** — always available, never intrusive.
4. **Never before they have a published portfolio.** Asking someone to pay before they have anything to show is asking for money in exchange for nothing.

---

## Unit economics

At ₹83/month with Razorpay's ~2% plus GST:

- Gross ≈ ₹83
- Net ≈ ₹80
- Fixed costs ≈ ₹0 until R1 lifts
- **Contribution margin effectively 100% on the hobby tier**, because there is nothing to pay for

The first real cost arrives at Supabase Pro ($25/month) or Vercel Pro ($20/month). Both are trivially covered by **one** paying customer.

**That is the whole economic argument for R1's trigger point.**

---

## What we do not build in v1

- Annual plans
- Team or organisation plans — our users are individuals
- Usage metering — we do not meter what we are selling
- Promo codes or discounts — ₹83 needs no discount, and discount mechanics are a support burden
- A hosted customer billing portal — a settings page with cancel, update method, and history is enough
- Dunning emails beyond the grace window — Razorpay's retry engine does the work

---

## Where this goes

The portfolio generator is the wedge. Resume tailoring against a specific job posting is the deepest version of the problem — the same data, restructured for one role.

Pricing for those attaches to the same subscription rather than becoming separate products, because a price-sensitive audience should not have to make three separate purchase decisions to get the help they need.