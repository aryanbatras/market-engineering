# Security and privacy

Our users are students. They will paste resumes containing home addresses, phone numbers, university details, and sometimes date of birth. That is a lot of PII handed to a free tool by people who do not know to be careful.

We treat it as though it matters regardless.

---

## Data inventory

| Data | Where | Retention |
|---|---|---|
| Identity (name, email, avatar) | Clerk, mirrored to Turso | Until account deletion |
| Portfolio content | Turso | Until account deletion |
| GitHub public data | Turso | Until disconnect, then retained as content |
| Handle | Turso | Until account deletion |
| Entitlements | Turso | Until account deletion |
| Revision snapshots | Turso | 30 days, capped at 5 per portfolio |
| Resume files | **Never stored** | — |

**We do not store uploaded resumes.** If PDF import ships, parsing is client-side and the file never reaches our servers. If we ever cannot parse client-side, we do not ship the feature rather than store the file.

---

## No AI API

**There is no AI API integration.** No model provider, no prompt execution on our side, no inference.

Users bring their own model. We ship a prompt and a schema; they paste into whatever they already use. Their resume and portfolio data never leave their device.

This is simultaneously:

- **A privacy control.** Resume content is the most sensitive data in the product. We never see it.
- **A cost control.** No per-user inference spend (R1).
- **A trust feature.** "Your data is not sent to anyone" is a claim we can make without qualification, because it is architecturally true rather than a policy promise.

Any future AI feature requires founder sign-off and a privacy review, because it would break all three at once.

---

## India DPDP Act posture

Our users are in India. The Digital Personal Data Protection Act, 2023 applies.

| Obligation | How we meet it |
|---|---|
| Lawful processing | Portfolio data is provided by the user for the purpose of publishing their portfolio. Nothing else. |
| Purpose limitation | Data collected for one purpose is not reused for another. No resale, no advertising, no model training. |
| Consent | Explicit at publish. Signing in is not consent to marketing. |
| Data minimisation | We store what the portfolio needs. No behavioural profiling, no tracking pixels from us. |
| Right to access | Export on demand, every tier, in YAML and JSON. |
| Right to erasure | Account deletion removes everything. |
| Right to correct | The builder is the correction mechanism. |
| Reasonable security | This document. |

Not legal advice. Before launch at scale, this needs review by an actual lawyer. Flagged in `spec/03-business/cost-model.md`.

---

## Deletion

Two-step, with a typed confirmation, because it is irreversible.

1. **Immediate** — portfolio unpublished, public URL returns 404, Clerk user deleted, Razorpay subscription cancelled.
2. **30 days** — Turso row retained for recovery, then purged.
3. **Then gone.** No backups we control retain it beyond the Turso restore window.

The copy lists exactly what will be deleted before the action becomes available. "This cannot be undone" is not sufficient; the user should know *what* they are losing.

---

## Export

Available on every tier including free, in YAML and JSON.

This is deliberate. Data captivity signals that a free tool run by a stranger might vanish, and it is the fastest route to losing a user's trust. Export is also a growth loop — the file mentions us.

---

## XSS

**The highest-risk vulnerability in this product.**

A portfolio is user-authored content rendered on a domain we control. Any `dangerouslySetInnerHTML` in the render path is a stored XSS on our own origin, reachable by every visitor to that portfolio.

**Rules:**

- Portfolio data renders as **text**. Always. Never as raw HTML.
- No `dangerouslySetInnerHTML` anywhere in the template render path.
- If a template needs to render user-provided markup, it goes through an explicit allowlist sanitiser, and that is a per-template decision the founder reviews.
- The same rule covers GitHub repository descriptions and profile bios — third-party content rendered on our pages.

Content Security Policy is set as defence in depth, not as the primary control.

---

## Injection and SSRF

**SQL:** Drizzle parameterised queries only. No string-built SQL, no raw expressions built from user input.

**SSRF:** we never fetch user-supplied URLs server-side. A project link is rendered as a link the visitor clicks. It is not proxied, previewed, or fetched. This removes the entire SSRF class rather than mitigating it.

**GitHub API:** octokit handles auth and rate limiting. We never pass a user-supplied string into a URL the server constructs without validation.

---

## Payments

- Razorpay webhook signature verified on every event. An unverified webhook is not an event.
- Idempotent handlers — Razorpay retries, and duplicate processing must not corrupt entitlement state.
- Out-of-order events handled — timestamps compared before state regression.
- We never handle raw card data. Razorpay's hosted checkout owns the card fields entirely, so we are not in PCI scope for cardholder data.

---

## Handle enumeration

Private portfolios return **404, not 403**. A 403 confirms the handle exists. 404 leaks nothing and is also the correct semantic.

Handle claims are rate-limited to prevent someone enumerating availability at speed, and reserved words are filtered at claim time.

---

## Secrets

- Environment variables only
- Never in a client component — the bundle is public
- Never committed
- Server-only module boundaries make accidental client-side exposure a build error rather than a review catch

---

## Third parties

| Service | What we send | Why it is acceptable |
|---|---|---|
| Clerk | Email, name, GitHub OAuth | Identity. Required by R9. |
| Vercel | Request metadata | Hosting. Required by R2. |
| Turso | Everything | Our database. Required by R10. |
| Razorpay | Name, email, payment | Payment. Required by founder decision. |
| GitHub | OAuth token | Only when the user connects. |
| Google Fonts | **Nothing** | Fonts are self-hosted via `next/font`. No user IP leak to a third party. |

**No analytics or advertising third parties in v1.** If analytics is added, it must be a free-tier tool that does not require us to hold a data-processing agreement for PII we cannot otherwise justify.

---

## Rate limiting

On: handle claims, handle changes, imports, publishes, YAML submission, and webhook endpoints.

Rate limits protect availability and cost. They also protect users — a rate limit on publish stops a bot from mangling someone's portfolio.

---

## Pre-launch checklist

- [ ] No `dangerouslySetInnerHTML` in the template render path
- [ ] CSP configured as defence in depth
- [ ] Razorpay webhooks signature-verified and idempotent
- [ ] Private portfolios return 404
- [ ] Export works on every tier
- [ ] Deletion purges within 30 days
- [ ] No client component references a secret
- [ ] No AI API call anywhere in the codebase
- [ ] Rate limits in place on all mutation endpoints
- [ ] DPDP posture reviewed by a lawyer before scale