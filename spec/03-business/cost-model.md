# Cost model

R1: hobby tier until the first paying customer or a substantial committed user base.

**Trigger to lift R1:** the first paying customer. At ₹83/month one customer covers every fixed cost in the business.

---

## Current state — all free

| Service | Plan | Cost | Limits | Headroom |
|---|---|---|---|---|
| Vercel | Hobby | ₹0 | Function size is the real constraint | Generous |
| **Supabase** | Free | ₹0 | **500 MB database · 5 GB egress · 50k MAU · no backups** | ⚠️ **Tightest constraint in the system** |
| Razorpay | Transaction | ~2% + GST | No monthly fee | Only revenue-dependent cost |
| Fonts | Self-hosted | ₹0 | OFL licence via `next/font` | Unlimited |

**Monthly fixed cost: ₹0.**

Note what disappeared: Clerk is gone. Supabase Auth is included in the free project, which removes a service, a dependency, and a line item.

---

## Supabase is the one to watch

### Egress — 5 GB/month

At roughly 40 KB per portfolio render, that is about **125,000 uncached renders per month**. Our target is 500,000 views.

**Uncached, the budget is gone in a week.** This is why `/p/[handle]` reads from CDN cache and never queries Supabase on a hit. That rule is not an optimisation — it is the difference between surviving the first month and not.

### Database — 500 MB

At roughly 20 KB per portfolio, about **25,000 portfolios**. Inside our target range, so a ceiling to plan for rather than a wall we hit next week.

Revisions are the adjustable cost. Capped at 3, retained 30 days, because a revision nobody restores from is paid for twice.

### Project pausing — 7 days

Free projects pause after a week of inactivity. The first request after waking has significant latency.

**Mitigation is structural, not a workaround:** public portfolio reads come from CDN and never touch the database, so a paused project degrades the builder rather than a recruiter's first impression. Pro removes it entirely and we upgrade on first revenue.

### No backups

Free has no automatic backups. For a product holding student portfolios, that is the risk we are least comfortable with. Export-on-demand caps the damage; Pro closes it.

---

## First spend, when R1 lifts

| Priority | Service | Plan | Cost | Why |
|---|---|---|---|---|
| **1** | **Supabase** | Pro | **$25/mo** | Removes pausing, 8 GB database, 250 GB egress, daily backups with 7-day retention |
| 2 | Vercel | Pro | $20/mo | Only if build minutes or bandwidth become a constraint |
| 3 | Email provider | — | ~$0 | Custom SMTP for auth mail, once Pro is on |
| 4 | Error tracking | Free tier | ₹0 | Sentry free tier is adequate |

**One service, not two.** Clerk Pro at $25 and Turso Developer at $5.99 would have been $30.99 for less capacity, less backup coverage, and no auth. Supabase Pro is both cheaper and better.

---

## The break-even arithmetic

| Item | Amount |
|---|---|
| Supabase Pro | $25.00 |
| Vercel Pro | $20.00 |
| **Total, fully paid** | **$45.00** |
| One customer at ₹83/month (≈$1) | ~$1.00 |

**One paying customer covers the entire fixed cost base with room to spare.** Roughly forty-five customers at full paid infrastructure, and we would likely still be on Vercel Hobby well before that.

This is the whole economic argument for R1's trigger point.

---

## Cost drivers to watch

Not current costs — things that would become costs if we are careless.

| Driver | Why it could bite | Control |
|---|---|---|
| **Uncached portfolio views** | 125k/month is the entire egress budget. View counters or missing cache tags would exhaust it in days. | Public route reads from cache only. This is the big one. |
| **Template gallery rendering** | Hundreds of live templates on a listing page would multiply egress and destroy mobile load times. | Render one live preview, screenshot the rest at build time. |
| **OG image generation** | `next/og` renders per portfolio and each render is egress. | Cache aggressively, long TTL, regenerate on publish only. |
| **Revisions** | Unbounded revisions against 500 MB with no backups. | Cap at 3, 30-day retention. |
| **Per-view writes** | Page views are our highest-volume event and we refuse to write them. | No view counters, no analytics rows, ever. |
| **AI inference** | Per-user cost on every data entry. | No AI API. Non-negotiable. |
| **Resume parsing** | Server-side parsing means storage, compute, and PII handling. | Client-side only, or the feature does not ship. |
| **Storage growth** | 500 MB, no backups, no automatic warning. | Alert on database size ourselves. |
| **Fonts** | A third-party font CDN leaks user IPs and costs a round trip. | Self-host via `next/font`. Already decided. |

---

## Deliberate zero-cost decisions

Recorded so nobody "fixes" them later by adding a service:

- **No AI API.** Saves per-user inference cost and the privacy problem at the same time.
- **No analytics vendor.** Free tier or nothing. We do not need a data-processing agreement for data we cannot otherwise justify holding.
- **No email service.** Supabase's built-in SMTP handles transactional auth mail on Free. Marketing mail waits until there is a list worth mailing.
- **No error tracking paid plan.** Sentry free tier covers launch scale.
- **Self-hosted fonts.** No CDN, no cost, no third-party request.
- **No CDN paid tier.** Vercel's included caching is sufficient while egress stays off the database.

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

- **Egress per day** — the tightest budget in the system, and the easiest to exhaust by accident
- **Database size** — 500 MB, no backups on Free
- **Project pause state** — a paused project means public reads are degraded
- Vercel function size and cold-start latency, especially for the Immersive template
- Razorpay webhook failure rate

A free-tier external monitor is sufficient. The egress one is not optional.