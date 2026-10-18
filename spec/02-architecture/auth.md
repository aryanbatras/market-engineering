# Authentication

Supabase Auth with Google and GitHub sign-in. R9.

---

## Why Supabase

**Founder decision, and it is the right one for reasons beyond cost.**

- **Stack credibility.** Razorpay + Supabase + Next.js reads as a serious stack to anyone who reviews this later. Turso and Clerk are excellent products that most reviewers have not heard of.
- **One service instead of two.** Auth and database in the same product, with one connection pool, one dashboard, one set of credentials.
- **Row Level Security.** Supabase hands the browser an anon key and makes the *database* enforce access. That is a stronger security posture than a server-only design where every read must route through our own code correctly. RLS is enforced even if we write a bug.
- **Cheaper at the paid tier.** Supabase Pro at $25/month covers both auth and database, versus Clerk Pro $25 plus Turso Developer $5.99.

---

## Methods

| Method | Availability | Purpose |
|---|---|---|
| **Google** | Primary | Largest population in our audience, zero friction on Android |
| **GitHub** | Primary | Identity, and it is the same population as the repository-import path |
| **Email + password** | Secondary | Required by R9 for automated testing, and as a fallback |

Google is the default because most of our users arrive on Android with a Google account already signed in, and one tap beats typing.

**No email OTP, no phone auth, no passkeys in v1.** Google and GitHub cover the audience; adding more providers is surface area with no v1 value.

---

## The R9 testing constraint

R9 requires that an automated agent can log in with a dummy email and password and exercise authenticated flows end to end.

This is a design constraint, not a convenience:

- **Email + password must stay enabled.** An agent cannot complete an OAuth consent screen for Google or GitHub.
- **A seeded test account exists** with known credentials in development and staging.
- **A separate Supabase project for staging**, so production users are never affected by test data.
- Auth-dependent routes stay reachable and observable so an agent can assert on real responses rather than screenshots of a redirect.

Supabase provides local development tooling, which makes this easier than it was with Clerk — the whole stack can run locally against a local Postgres.

Any auth change that makes this flow impossible is not permitted.

---

## ⚠️ The free tier pauses the project

**This is the real cost of moving to Supabase and it must be understood before launch.**

A Supabase **Free** project is considered inactive after 7 days without sufficient database activity and is **paused automatically**. While paused:

- The Postgres instance is spun down.
- Requests fail or stall until the project resumes.
- **The first request after a long pause has significant latency** while the instance wakes.

**Why this matters specifically for us:** our users are students. Placement activity is seasonal. A user could publish a portfolio in October, go quiet through a semester of exams, and their portfolio — the thing a recruiter opens when they apply six months later — could be paused or slow when it matters most.

**This is the worst-case failure mode in the product**: a recruiter clicks a student's link and the site hangs.

### Options

| Option | Assessment |
|---|---|
| **Accept it, upgrade on first revenue** | The default. Pro at $25 removes pausing entirely. We upgrade the moment R1 lifts, which is at customer number one. |
| **Keep a heartbeat** | A scheduled request to prevent pausing. Works, but it burns compute indefinitely and is a hack against the platform's intent. Not doing this. |
| **Move public reads off Supabase** | Portfolio data cached on Vercel's CDN, so public portfolio views never touch the database. **This is required anyway** for the egress budget, and it largely neutralises the risk for the most important route. |

**Decision:** build the public route to read from CDN cache and never touch Supabase on a cache hit. That is an egress requirement first and a resilience measure second. The remaining exposure is the builder and dashboard, where a paused project costs a user's editing session rather than a recruiter's first impression — and it costs us one paying customer to fix.

---

## Supabase Auth details

| Setting | Value |
|---|---|
| Session duration | Default (7 days), refreshed on activity |
| Email confirmations | On for email/password. Not required for Google or GitHub, which are already verified |
| Email provider | Supabase's built-in SMTP on free. Upgrade to a custom domain on first revenue |
| Site URL and redirect URLs | Configured per environment, never hardcoded |

Session length is a non-issue here. This is a portfolio builder, not a bank.

**Payment and publish routes are the exception.** Those are mutations and they require a fresh, explicit action. A long-lived session is not authorisation to spend someone's money.

---

## Relationship to the database

Supabase Auth and Supabase Postgres share an instance, which removes the mirroring problem Clerk created. The `users` table references `auth.users.id` directly.

```
public.users.id  →  auth.users.id   (foreign key, cascade delete)
```

Application rows read the user's identity from the JWT the session already carries. **We do not call Supabase Auth on every request** — the JWT is verified locally against the public key, and `auth.users` is read only when we genuinely need a field that is not in the token.

**On signup,** a database trigger creates the `public.users` row. No webhook round trip, no eventual consistency window, no mirror to fall out of sync.

---

## Row Level Security

**This is what makes the anon key safe to ship to the browser.**

Supabase exposes an anon key intended for client use. It is not a secret and must never be treated as one. Its safety depends entirely on RLS being correct, which means RLS is a security boundary, not configuration.

### Policy surface — deliberately minimal

| Table | Anon access | Policy |
|---|---|---|
| `portfolios` | **Published rows only** | `select where visibility = 'public' and published_at is not null` |
| `templates` | **All rows** | Public catalogue, read-only |
| `handles` | **Nothing** | Availability checks go through a server route that checks and returns only a boolean |
| `users` | **Nothing** | Own rows only, via `auth.uid()` |
| `entitlements` | **Nothing** | Own row only. Never readable by the anon key, ever |
| `portfolio_revisions` | **Nothing** | Server-only, service role |
| `imports` | **Nothing** | Own rows only |

### The rules

1. **RLS is enabled on every table.** No exceptions, no "I'll add it later". A table without RLS is fully readable by anyone with the anon key.
2. **Default deny.** No policy means no access. We add policies deliberately, never to fix an error.
3. **Entitlements are never client-readable.** The anon key must not be able to determine a user's plan. Entitlements are read server-side only.
4. **Handle availability never leaks.** A public `select` on `handles` would let anyone enumerate who has claimed what. Availability is a server route returning a boolean.
5. **The service-role key is server-only.** It bypasses RLS entirely, so it must never appear in a client component, and the module boundary makes that a build error rather than a review catch.

The upside of this design: even if we ship a bug that leaks a query, RLS stops it at the database. That is defence the previous architecture did not have.

---

## Route protection

| Route | Requirement |
|---|---|
| `/` marketing | Public |
| `/templates/*` | Public |
| `/p/[handle]` | Public |
| `/privacy`, `/terms` | Public |
| `/builder/*`, `/dashboard/*` | Authenticated |
| Publishing a change | Authenticated |
| Claiming a handle | Authenticated |
| Starting a payment | Authenticated |
| Razorpay webhook | Signature-verified. No session — webhooks have none |

**Middleware** checks session presence only. Authorisation lives in the application layer where it can be tested, not in middleware, which runs on every request and is the wrong place for logic to accumulate.

---

## GitHub authorisation

Two distinct things, frequently confused:

| Credential | Grants | Used for |
|---|---|---|
| **Supabase GitHub OAuth** | Identity | Sign-in |
| **GitHub App** | Repository read | Importing projects |

Identity scope does not grant API scope. A user who signs in with GitHub has authorised us to know who they are, not to read their repositories. Importing requires a separate, revocable authorisation.

**Disconnecting must not delete imported projects.** They are now the user's portfolio content. Deleting them would be a data-loss bug dressed as a privacy feature. Disconnect removes the authorisation; the content stays.

---

## Middleware

```
middleware.ts
  matcher: /builder, /dashboard
  → Supabase session check
  → redirect unauthenticated to /sign-in, preserving the return path
  → refresh the session token if near expiry
```

Keeps small. It runs on every matched request.

---

## Account deletion

Immediate and complete:

1. Portfolio unpublished. The public URL returns 404.
2. Rows deleted. `auth.users` deletion cascades to `public.users` and everything referencing it.
3. Razorpay subscription cancelled.
4. Revisions purged immediately rather than held for the 30-day recovery window — see `security-and-privacy.md` for the exception and the reasoning.

Two-step confirmation with a typed phrase, because it is irreversible. The copy lists what will be deleted before the action becomes available.