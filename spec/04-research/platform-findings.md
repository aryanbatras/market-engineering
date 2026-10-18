# Platform findings

Verified 2026-10-18 from vendor documentation. These replaced our assumptions. **Re-verify before building against any of them** — pricing pages move.

---

## Razorpay — UPI subscriptions are viable, with one open item

**Supported on Razorpay Subscriptions:** Cards (Visa, Mastercard, RuPay), UPI Autopay, eMandate (eNACH).

**UPI Autopay specifics:**
- 60+ UPI apps supported (PhonePe, Google Pay, Paytm, BHIM, and others)
- Mandate creation up to ₹1,00,000; frictionless debit limit ₹15,000
- **₹83/month (≈$1) is far below every limit**
- Initial authorisation charge is **₹1**
- INR only
- Customers manage, pause, and cancel mandates from their own UPI app
- Merchant-side senders handle reminders and payment retries

**NPCI interoperability** (circular OC-163 / OC-163A, purpose code `14` → `AZ`) rolling out from July 2026 means UPI autopay mandates are no longer locked to a single aggregator. Debits can be rerouted across processors. **Razorpay states no integration changes are needed** — existing mandates migrate automatically, `token_id` and `subscription_id` unchanged.

### ⚠️ Open item — confirm before building checkout

Razorpay's Subscriptions FAQ labels UPI as **"early access"** and states *"we will choose a set of merchants to enable this feature and inform them through the POCs."* The marketing page simultaneously says autopay is available instantly.

**Action:** verify on our own merchant account during onboarding. 

**Fallback if UPI autopay is denied:** card-only subscriptions via standing instruction. Visa, Mastercard, and RuPay card mandates are unrestricted. Our audience overwhelmingly has cards. The product is viable either way.

---

## Clerk — free tier is 50,000 retained users, and billing is unusable for us

**Hobby (free):**
- **50,000 monthly retained users per app**, unlimited applications
- 3 dashboard seats, up to 3 social connections
- Custom domain, fixed 7-day session
- Application Logs, 1-day retention
- Community support

Raised from 10,000 to 50,000 on **2026-02-05**. The "Clerk is free to 10k MAU" figure circulating widely is stale.

**Retained ≠ active.** A user must return at least one day after signing up to count toward the limit. One-shot signups and anonymous previewers are free.

**This directly rewards our anonymous-preview flow.** We can let anyone render a portfolio without an account at effectively zero cost.

**Hobby excludes:** MFA, passkeys, branding removal, custom session lifetime, user ban/allowlist, SMS auth.

**Pro:** $25/month ($20/month annual), 50k MRU included, then $0.02/user.

### 🚨 Clerk Billing is Stripe-only

Clerk's billing is **Stripe 2.9% + $0.30 per transaction + 0.7% Clerk fee**, on every plan. It is an integration of Clerk Billing with Stripe.

We are using Razorpay. Therefore **Clerk Billing cannot be used.** Entitlements are our own system — see `../02-architecture/entitlements-and-billing.md`.

**Consequence:** Clerk holds identity, not application data. We mirror users into Turso via webhooks and treat Clerk `publicMetadata` as a cheap cached entitlement mirror, with Turso as the source of truth.

---

## Turso — hard blocks on breach, and the row math is tight

**Free plan:**

| Metric | Limit |
|---|---|
| Databases | 100 |
| Storage | 5 GB |
| Rows read | 500,000,000 / month |
| Rows written | 10,000,000 / month |
| Syncs | 3 GB / month |
| Point-in-time restore | 1 day |
| Support | Community |

Entry paid tier: **Developer, $5.99/month** (9 GB, 2.5B reads, 25M writes, 10-day PITR, 3-day audit logs) with real overage billing.

### 🚨 The critical constraint

**Exceeding any single metric BLOCKS the database outright.** Error code `BLOCKED`. No grace period, no overage on the free plan. One unindexed query can take the entire product down.

**"Row read" means row scan**, not row returned. A query that scans 10,000 rows to return 1 burns 10,000 units. Index design is a cost-control mechanism, not a nicety.

### The write budget

10M writes/month ≈ 333,000 writes/day ≈ **3.8 writes/second sustained.**

That comfortably covers auth, portfolio saves, and revision history. It covers **nothing that happens on a page view.**

### Architecture consequences

1. The public portfolio route **never writes on view.** Cache aggressively, revalidate on publish.
2. **No per-view analytics in the database.** Use a free-tier external analytics tool or Vercel's own metrics.
3. Every query that touches portfolio data needs an index on the columns it filters and sorts by.
4. `VACUUM` is disabled on Turso, so storage only grows until we compact deliberately.

---

## GSAP — free, licence ambiguity understood and accepted

Since 2025-04-30 GSAP is **100% free including commercial use**, including all previously Club-only plugins (SplitText, MorphSVG, ScrollTrigger, ScrollSmoother, DrawSVG, Inertia, Draggable, Observer, Flip).

The license explicitly permits visual-interface tools that do not directly compete with Webflow's visual animation builder, and explicitly states AI-generated GSAP code is acceptable.

**The ambiguity:** an older page on the same domain still states a license is required when *"your site or product requires a fee to use or join."* Our paid tier is exactly that shape.

**Founder decision: use GSAP.** Risk understood and accepted. Stack is GSAP for scroll choreography, Motion for component state, React Three Fiber for the 3D layer — each used where it is genuinely the right tool.

**Engineering consequence:** each must be independently lazy-loadable, so the Immersive template's 3D weight never taxes the Bento template's bundle.

---

## React Server Components caching (Next.js 15+)

Relevant to R12 and the public route. `unstable_cache` / `use cache` with tagged revalidation is our mechanism for the never-write-on-view constraint. Verify exact API surface against the Next.js version we install.

---

## Cost summary at hobby tier

| Service | Free tier | Our headroom |
|---|---|---|
| Vercel | Hobby | Generous; function size is the constraint, not compute |
| Clerk | 50,000 MRU | Above our 10k–50k target |
| Turso | 500M reads / 10M writes | **Tightest constraint in the system** |
| Razorpay | Transaction fees only | ~2% + GST on collected payments |

Turso is the one that will fail first, and it fails hard rather than degrading. Monitoring on write volume is a launch requirement, not a nice-to-have.