# Authentication

Clerk with GitHub social login. R9.

---

## Methods

| Method | Availability | Purpose |
|---|---|---|
| GitHub OAuth | Primary | Doubles as the GitHub data source — one authorisation, two products |
| Email + password | Secondary | Required by R9 for automated testing, and for users without GitHub |

**No email OTP, no phone auth, no passkeys in v1.** Clerk reserves MFA, passkeys, and SMS for Pro. Adding them would force a $25/month spend before revenue, violating R1.

---

## The R9 testing constraint

R9 requires that an automated agent can log in with a dummy email and password and exercise authenticated flows end to end.

This is a design constraint, not a convenience:

- **Email + password must be enabled.** Not GitHub-only. An agent cannot complete an OAuth consent screen.
- **A seeded test account exists** with known credentials in the development and staging environments.
- **Clerk test instances** are used in staging so production users are never affected by test data.
- Auth-dependent routes must remain reachable and observable so an agent can assert on real responses rather than screenshots of a redirect.

Any auth change that makes this flow impossible is not permitted. If a future requirement conflicts with it, that conflict goes to the founder.

---

## Session model

Clerk's Hobby tier has a **fixed 7-day session lifetime**. That is fine for our use case — a portfolio builder session, not a banking app.

Publish and payment routes are the exception: those are mutations, and they require a fresh, explicit action. A long-lived session is not authorisation to spend someone's money.

---

## Relationship to the database

Clerk holds identity. Turso holds everything else.

- Clerk user ID is the foreign key on `users`, `handles`, `portfolios`, and `entitlements`.
- Clerk is the source of truth for authentication and nothing else.
- Application data is mirrored into Turso via webhook so foreign-key queries work locally and so we are not calling Clerk on every request.

**Mirror strategy:** a Clerk webhook creates or updates the `users` row. Reads of application data go to Turso. Clerk is consulted only for session verification, which happens at the middleware boundary.

---

## Entitlements live outside Clerk

Clerk's billing product is **Stripe-only** — Stripe 2.9% plus $0.30 plus a 0.7% fee, on every plan. We use Razorpay. Therefore Clerk Billing is unavailable.

Entitlements are our own system. See `entitlements-and-billing.md`.

Clerk `publicMetadata.plan` is kept in sync as a cheap client-side cache so the UI can render correct state without a round trip. **Turso is the source of truth.** A stale `publicMetadata` must never grant access — every entitlement check that guards something real re-reads Turso.

---

## Route protection

| Route | Requirement |
|---|---|
| `/` marketing | Public |
| `/p/[handle]` public portfolio | Public. This is the whole product. |
| `/builder/*` | Authenticated |
| `/dashboard/*` | Authenticated |
| Publishing a change | Authenticated |
| Claiming a handle | Authenticated |
| Starting a payment | Authenticated |
| Razorpay webhook | Signature-verified. Not a Clerk session — webhooks have no session. |

**Middleware** handles coarse session presence. Authorisation checks happen in the application layer where they can be tested, not in middleware.

---

## GitHub authorisation

Separate from Clerk's GitHub OAuth, because we need API scope that a login does not grant.

- **Clerk GitHub OAuth** — identity only. Public profile scope.
- **GitHub App or OAuth App** — repository read, for importing projects. Authorised once at connect time, revocable by the user.

The user is asked to authorise repository access once. It is disconnected when they disconnect, and the portfolio keeps the imported data. Disconnecting must not delete data the user already has — that would be a data-loss bug dressed as a privacy feature.

---

## Middleware

```
middleware.ts
  → matcher: /builder, /dashboard, /api/private
  → Clerk auth check
  → redirect unauthenticated to sign-in, preserving the return path
```

Middleware makes no authorisation decisions beyond "is there a session". It must stay small, because it runs on every matched request and must not become a place where business logic accumulates.

---

## Account deletion

Immediate and complete:

- Portfolio unpublished instantly. The public URL returns not-found.
- Row retained 30 days for recovery, then purged.
- Clerk user deleted.
- Razorpay subscription cancelled.

Deletion is a two-step flow — confirm, then a typed confirmation — because it is irreversible. The copy says what will be deleted, in plain terms, before the action is available.