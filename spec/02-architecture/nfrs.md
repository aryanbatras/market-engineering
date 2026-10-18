# Non-functional requirements

R3: fastest path that still holds at 10,000–50,000 users.

---

## Scale model

| Dimension | v1 target | Hard ceiling before revisiting |
|---|---|---|
| Registered users | 10,000 | 50,000 |
| Monthly active users (Supabase Auth) | 5,000 | 50,000 |
| Published portfolios | 5,000 | 50,000 |
| Portfolio views / month | 500,000 | 5,000,000 |
| Payingly active users | 100 | 1,000 |

The interesting number is **views**. 500,000 portfolio views a month is roughly 12 requests/second at peak. Every one of them must be a cache hit. The alternative is egress we cannot afford: 5 GB/month is about 125,000 uncached renders, and we are targeting 500,000 views.

---

## Performance budgets

**Public portfolio (`/p/[handle]`) — the page that matters:**

| Metric | Target |
|---|---|
| LCP, throttled 4G | under 2.0s |
| CLS | under 0.05 |
| INP | under 200ms |
| Cached TTFB | under 200ms |
| Initial JS, non-3D templates | under 150 KB |
| Initial JS, Immersive | under 500 KB |

**Builder:**

| Metric | Target |
|---|---|
| LCP | under 2.5s |
| INP | under 300ms |
| Preview render | under 300ms after edit |
| YAML validate | under 100ms client-side |

---

## Reliability

| Guarantee | Target |
|---|---|
| Public portfolio availability | 99.9% |
| Publish success rate | 99.9% |
| Payment webhook success | 99.99%, idempotent and retry-safe |
| Data loss | None. Every publish is a revision. |

**The published portfolio is someone applying for a job.** It being down when a recruiter opens it is not an inconvenience — it is the user losing an opportunity. This is why caching and the revisions table are not premature optimisation.

---

## The Supabase ceiling

Our binding constraint, and it is an **egress** limit rather than a write limit. That change moves the requirement but keeps the rule.

- **5 GB egress/month** ≈ 125,000 uncached portfolio renders, against a 500,000 view target
- **500 MB database** ≈ 25,000 portfolios, with **no backups** on Free
- Project **pauses after 7 days** of inactivity

**Hard requirements:**

1. `/p/[handle]` reads from CDN cache and never queries the database on a hit.
2. Revisions capped at 3 per portfolio, 30-day retention.
3. No analytics, view counters, or page-view writes anywhere in the database.
4. Every filtered or sorted query has a covering or partial index.
5. Egress and database-size monitoring from day one.

The escape hatch is Supabase Pro at **$25/month**: 250 GB egress, 8 GB database, daily backups with 7-day retention, and no pausing. That is the first spend after R1 lifts.

---

## Scalability

**Read path.** Cache does the work. Template markup is deterministic from `(data, config)`, so cache hits are the normal case, not the exception.

**Write path.** Serialisation is not a concern at this scale — writes come from individual user actions, not from traffic. At 10× the current user base the write path is still comfortably inside budget.

**Function limits.** Vercel constrains serverless function size and cold-start time. The Immersive template with Three.js, GSAP, and Lenis is the worst case and must be measured in the `template-runtime.md` spike before templates are built.

**Bundle isolation.** Enforced at build time. If the Bento chunk contains `three`, the build fails. This is a CI check, not a convention.

---

## Accessibility

Required floor, per `DESIGN.md` §15:

- Responsive from 360px, no horizontal scroll at any width
- Visible keyboard focus on every interactive element, never `outline: none` without replacement
- Touch targets at least 44×44px
- `prefers-reduced-motion` fully respected
- Colour never the sole carrier of meaning
- Semantic HTML, no skipped heading levels
- Body text at least 16px, contrast at least 4.5:1
- Text remains selectable in portfolio templates — recruiters copy from these

**Portfolio-specific:** ATS systems parse the text of these pages. Content must be real text in the DOM, not images, not canvas, not generated client-side after load. A portfolio that looks right but scores zero in an ATS has failed at its actual job.

---

## Privacy

Per `security-and-privacy.md`. Summary of the non-negotiables:

- No AI API. Resume and portfolio data never leaves our infrastructure.
- Resume data is client-side only. We never store an uploaded resume file.
- Export on every tier, including free.
- Deletion is immediate and complete, with a 30-day recovery window.

---

## Security

| Concern | Mitigation |
|---|---|
| Secrets | Environment variables only, never in the bundle, never in client components |
| Payments | Razorpay webhook signature verification on every event, idempotent handling |
| Auth | Supabase Auth, JWT verified locally against the public key |
| SQL injection | Drizzle parameterised queries only. No string-built SQL, ever. |
| XSS | Portfolio data is user-supplied. Render as text, never as raw HTML. No `dangerouslySetInnerHTML` outside a sanitiser with an explicit allowlist. |
| SSRF | We never fetch user-supplied URLs server-side. Project links are rendered as links, never proxied. |
| Handle enumeration | Private portfolios return 404, not 403. Existence is not disclosed. |
| Rate limiting | On handle claims, imports, publishes, and webhook endpoints |

**XSS deserves emphasis.** A portfolio is user-authored content rendered on a page we host. `dangerouslySetInnerHTML` anywhere in the render path is a stored XSS vulnerability on our own domain. Text in, text out.

---

## Browser support

Last two versions of Chrome, Safari, Firefox, Edge. Mobile Safari and Chrome Android are the priority — most of our traffic is a phone on Indian mobile data.

Older browsers get a functional, unstyled portfolio rather than an error. A fresher on a four-year-old phone still needs their portfolio to open when a recruiter clicks the link.

---

## Performance regression prevention

- Lighthouse CI on `/` and `/p/[handle]`, budgets enforced in CI
- Bundle size check per template — fails the build when a chunk grows unexpectedly
- Egress and database-size monitoring with alerts before the limits, because the failure modes are a hard stop rather than a degradation