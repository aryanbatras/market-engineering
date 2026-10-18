# Entitlements and billing

Razorpay, India-first, UPI-first. Founder decision: no GST registration, UPI and PAN card only.

---

## Why we build our own billing

Clerk's billing product is Stripe-only — Stripe 2.9% plus $0.30 plus a 0.7% Clerk fee, on every plan. It is an integration, not a standalone processor.

We are on Razorpay. **Clerk Billing is therefore unavailable to us.** Entitlements are our own subsystem, built on webhooks.

This is a real cost: we own the subscription state machine, the webhook handling, the failed-payment recovery, and the customer-facing billing portal. We do not get a hosted UI or a reconciliation dashboard.

---

## What is actually purchasable

Razorpay Subscriptions supports:

| Method | Status | Notes |
|---|---|---|
| **UPI Autopay** | Primary | 60+ UPI apps. ₹1 authorisation. Customers manage and cancel from their own UPI app. |
| Cards | Fallback | Visa, Mastercard, RuPay. Standing instructions supported. |
| eMandate (eNACH) | Not in v1 | Bank debit. Adds complexity for marginal benefit at ₹83/month. |

₹83/month sits far below every Razorpay limit — the ₹15,000 frictionless debit cap, the ₹1,00,000 mandate cap.

**⚠️ Unverified:** Razorpay's documentation labels UPI subscriptions "early access" and says merchant enablement is selective. This must be confirmed on our own account before checkout is built. The card path works regardless and is a complete fallback.

---

## NPCI interoperability

From July 2026 (circular OC-163 / OC-163A), UPI autopay mandates are no longer locked to a single aggregator. Purpose codes migrate `14` → `AZ`, mandates move to a Merchant Identifier Code, and debits can be rerouted across processors.

**Razorpay states no integration changes are required.** `token_id` and `subscription_id` are unchanged, existing mandates migrate automatically, merchant APIs and webhooks are unaffected.

For us this removes a real risk: a dependency on one aggregator's uptime for recurring revenue.

---

## GST

Not registered, per founder decision. Below the ₹20 lakh services turnover threshold this is legally permissible.

**Not legal advice.** As revenue grows this needs a CA. We track revenue so the threshold is never a surprise, and the reminder lives in `spec/03-business/cost-model.md`.

---

## The subscription state machine

The ₹1 authorisation is the subtle part. UPI subscriptions begin with a ₹1 authorisation charge to establish the mandate. **Nothing is granted until the first real charge succeeds.**

```
        create subscription
              │
              ▼
        ┌───────────┐
        │  pending  │   ₹1 authorisation in flight
        └─────┬─────┘   grants NOTHING
              │
        ┌─────┴──────┐
        │            │
   mandate       mandate
   confirmed     failed
        │            │
        ▼            ▼
   ┌─────────┐   ┌──────────┐
   │ active  │   │ inactive │── user can retry
   └────┬────┘   └──────────┘
        │
   ┌────┴─────┬───────────┐
   │          │           │
 payment    payment    payment
 failed     succeeded  cancelled
   │          │           │
   ▼          ▼           ▼
past_due   active    cancelled
(grace)        │           │
   │          │           └── access until currentPeriodEnd, then free
   └── retry ──┘
```

**Rules:**

- `pending` grants nothing. No free trial, no courtesy access. A ₹83 product does not need one.
- `past_due` grants a 7-day grace window. Razorpay's retry engine handles recovery; we surface the state honestly rather than punishing a failed UPI debit.
- Entitlement reads are cached and cheap, but **a stale cache must never grant access.** Every check that guards something real re-reads Turso.

---

## Webhooks

The only server-authoritative signal for payment state.

**Requirements:**

- Signature-verified on every event. An unverified webhook is not an event, it is an attack.
- **Idempotent.** Razorpay retries. Processing the same event twice must not corrupt state.
- Order-independent. Events can arrive out of order; compare timestamps before regressing state.
- Writes exactly one row per event.

**Events we handle:**

| Event | Action |
|---|---|
| `subscription.activated` | Grant access, set period end |
| `subscription.charged` | Extend period |
| `subscription.pending` | No change, record for diagnostics |
| `subscription.halted` | `past_due`, start grace |
| `subscription.cancelled` | Keep access until period end |
| `subscription.completed` | Access ends at period end |
| `payment.failed` | `past_due`, record |
| `refund.processed` | Revoke per policy |

---

## Free versus paid

| Capability | Free | Paid |
|---|---|---|
| Published portfolios | 1 | 1 |
| Templates | Subset | All five, including Immersive |
| YAML import | Yes | Yes |
| GitHub import | Yes | Yes |
| Data export | Yes | Yes |
| Recruiter surfaces (JSON-LD, OG, PDF) | Yes | Yes |
| "Made with love" footer | Present | Removed |
| Custom accent, density, dark mode | Yes | Yes |
| Priority on template requests | No | Yes |

**The free tier must be genuinely useful.** A crippled free tier converts nobody; it just produces angry signups. The paid line is template access and branding removal — not the ability to succeed.

**One-time purchase is rejected.** The value is in continuously updated templates and recruiter surfaces, which a one-time sale cannot express.

---

## Pricing

**₹83/month (≈$1).**

Enough to clear UPI comfortably and register as a real purchase rather than a token. Well below the threshold where a student pauses and asks their parents.

Founder decision: "one dollar a month is decent, anyone can pay it."

---

## Cost

Razorpay charges ~2% plus GST on collected payments, plus a small per-transaction fee. At ₹83/month the net is roughly ₹80. There is no monthly fee to us until we are transacting.

**This is the only revenue-dependent cost in the business.** Every fixed cost is a free tier until R1 lifts.

---

## What we do not build in v1

- Usage-based billing. We do not meter what we are selling.
- Annual plans. Revisit after 50 paying users, when retention data exists.
- Team or organisation plans. Our users are individuals.
- A hosted customer billing portal. Settings page with cancel, update method, and history is enough.
- Dunning emails beyond the grace window. Razorpay's retry engine does the work.

---

## Cancel flow

One click from settings, no retention maze, no dark patterns, no "are you sure you want to lose all these benefits" copy.

Access continues until the period already paid for. The copy says exactly that. A user who wants to leave is a user who might come back; making it painful converts them into a refund request instead.

This is also just correct. Cancelling a ₹83 subscription should not require a support email.