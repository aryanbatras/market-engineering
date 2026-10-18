# Cost model

R1: hobby tier until the first paying customer or a substantial committed user base.

**Trigger to lift R1:** the first paying customer. Not a revenue threshold, not a user count. At ₹83/month one customer covers every fixed cost in the business.

---

## Current state — all free

| Service | Plan | Cost | Limit | Headroom |
|---|---|---|---|---|
| Vercel | Hobby | ₹0 | Function size is the real constraint, not compute | Generous |
| Clerk | Hobby | ₹0 | 50,000 monthly **retained** users | Above our 10k–50k target |
| **Turso** | Free | ₹0 | 500M row reads · **10M row writes** · 5 GB | ⚠️ **Tightest constraint in the system** |
| Razorpay | Transaction | ~2% + GST | No monthly fee | Only revenue-dependent cost |
| Fonts | Self-hosted | ₹0 | OFL licence, `next/font` | Unlimited |

**Monthly fixed cost: ₹0.**

---

## Turso is the one that fails first

Free plan behaviour, from `../04-research/platform-findings.md`:

- Exceeding **any single metric blocks the database entirely.** Error code `BLOCKED`.
- No grace period. No overage billing.
- 10M writes/month ≈ **3.8 writes/second** sustained.
- Row reads are metered by **scan**, so an unindexed query is expensive by default.

A single unindexed query, or one popular portfolio page with a view counter on it, can take the entire product down. This is the failure mode that actually matters, and it is why the never-write-on-view rule is architectural rather than aspirational.

**Monitoring on write volume is a launch requirement.**

---

## First spend, when R1 lifts

| Priority | Service | Plan | Cost | Why this one first |
|---|---|---|---|---|
| **1** | **Turso** | Developer | **$5.99/mo** | 2.5× the write ceiling, 9 GB storage, 10-day point-in-time restore, real overage billing instead of a hard block |
| 2 | Clerk | Pro | $25/mo | MFA, branding removal, custom session lifetime, 7-day logs — none of which we need at our scale |
| 3 | Vercel | Pro | $20/mo | Only if build minutes or bandwidth become a constraint |
| 4 | Error tracking | Free tier | ₹0 | Sentry free tier is adequate |

**Turso Developer before Clerk Pro.** It is the constraint we will actually hit, at a quarter of the cost.

---

## The break-even arithmetic

| Item | Amount |
|---|---|
| Turso Developer | $5.99 |
| Clerk Pro | $25.00 |
| Vercel Pro | $20.00 |
| **Total, fully paid** | **$50.99** |
| One customer at ₹83/month (~$1) | ~$1.00 |

**One paying customer covers the entire fixed cost base with room to spare.** Roughly fifty customers at full paid infrastructure, and we would likely still be on Clerk Hobby and Vercel Hobby at that point.

This is the entire economic argument for R1's trigger.

---

## Cost drivers to watch

Not current costs — things that would become costs if we are careless.

| Driver | Why it could bite | Control |
|---|---|---|
| **Per-view writes** | 500k views/month with a view counter = 500k writes. A quarter of the entire monthly budget, spent on a number nobody reads. | Never write on view. This is the big one. |
| **Unindexed queries** | Row reads are metered by scan, so a bad query burns quota proportional to rows examined. | Covering indexes. Query budgets. |
| **Revision history** | Unbounded revisions on 50,000 portfolios would dominate the write budget. | Cap at 5, 30-day retention. |
| **AI inference** | Per-user cost on every data entry. | No AI API. Non-negotiable. |
| **Resume parsing** | Server-side parsing means storage plus compute plus PII handling. | Client-side only, or the feature does not ship. |
| **Analytics events** | Page views are the highest-volume event type there is. | External free-tier analytics. Never Turso. |
| **OG image generation** | `next/og` renders per portfolio. Cache aggressively; regenerate on publish only. | Tagged cache, long TTL. |
| **Fonts** | A third-party font CDN leaks user IPs and costs a round trip. | Self-host via `next/font`. Already decided. |

---

## Deliberate zero-cost decisions

Recorded so nobody "fixes" them later by adding a service:

- **No AI API.** Saves per-user inference cost and the privacy problem at the same time.
- **No analytics vendor.** Free tier or nothing. We do not need a data-processing agreement for data we cannot otherwise justify holding.
- **No email service.** Clerk handles transactional auth email. Marketing email waits until there is a list worth mailing.
- **No error tracking paid plan.** Sentry free tier covers launch scale.
- **Self-hosted fonts.** No CDN, no cost, no third-party request.

---

## Compliance and professional costs

Not infrastructure, but they will eventually cost money. Tracked here so they are never a surprise.

| Item | When | Cost |
|---|---|---|
| **GST registration** | On crossing ₹20 lakh annual services turnover | Variable |
| **Legal review, DPDP Act** | Before meaningful scale | One-off |
| **Terms of Service and Privacy Policy** | Before launch — India DPDP requires notice | Self-drafted, then reviewed |
| **CA / accounting** | Once revenue is real | Monthly |

**GST is the one to watch.** Below ₹20 lakh services turnover, registration is not required — which is why R1 can start with no GST. It becomes a legal obligation as revenue grows, and it should never arrive as a surprise. Razorpay surfaces GST collected on payments in its settlement reports, so the number is already visible before we are required to act on it.

Not legal or tax advice. Flagged for a CA when revenue justifies the conversation.

---

## Monitoring

Launch requirement:

- **Turso row writes per hour** — alert well before the ceiling, because the failure mode is a hard block
- Turso row reads per hour
- Storage growth
- Vercel function size and cold-start latency, especially for the Immersive template
- Razorpay webhook failure rate

A free-tier external monitor is sufficient. The Turso one is not optional.