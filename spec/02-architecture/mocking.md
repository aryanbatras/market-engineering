# Mocking

Mocking is not optional and not testing. It is how we develop.

Verified by `npm run mock:verify`, which exercises the mock layer end to end.

---

## The rule

**Every external dependency is mocked in development. Always.**

Auth, database, and payments. Not "the parts that are hard to test" — all of them. A developer must be able to run the entire product, sign in as a user, publish a portfolio, read it back, and hit every state, without a single network call.

**This is not a test suite.** There is no assertion about correctness of internals, and there are no unit tests. The thing we are checking is *behaviour at the interface*: does signing in produce a user, does publishing produce a readable portfolio, does a taken handle stay taken.

## The switch

One variable decides everything:

```
NEXT_PUBLIC_APP_ENV=development    →  mocked
NEXT_PUBLIC_APP_ENV=production     →  live
```

It lives in `.env` and `.env.example`. There is no other way to toggle it, and no per-feature override. If half the app is live and half is mocked, nothing is verifiable.

## Why not MSW or a mock Supabase client

Both were evaluated and rejected, on purpose:

- **Mock Service Worker** intercepts at the network boundary. That means the app still contains real Supabase client code, real query builders, and real serialisation. You are testing the integration, not the product, and a schema mismatch between the mock and reality stays invisible until someone hits production.
- **A mock Supabase HTTP client** has the same problem in a different place. It has to stay byte-compatible with Supabase's actual wire format forever.

Both are also more machinery than this problem needs. Swapping an adapter behind a port is three lines and one conditional.

## How it works

```
application/ports/auth-gateway.ts          ← the interface
application/ports/portfolio-repository.ts  ← the interface

infrastructure/auth/mock-auth-gateway.ts          ← localStorage
infrastructure/auth/supabase-auth-gateway.ts      ← real
infrastructure/persistence/mock-portfolio-repository.ts   ← localStorage
infrastructure/persistence/supabase-portfolio-repository.ts ← real

resolve at import time, from NEXT_PUBLIC_APP_ENV
```

Because the adapters are chosen once at the composition root and everything above talks to the port, **no component ever knows whether it is mocked.** The builder does not branch. The dashboard does not branch. Only `/p/[handle]` branches, because the mock store is browser-only and that page needs to resolve on the client.

## The mock user

`src/infrastructure/mock/fixtures/user.json` is the exact Supabase `User` shape — `aud`, `role`, `email_confirmed_at`, `app_metadata.provider`, `user_metadata`, a full `identities` array for the GitHub provider, and timestamps. Written by hand rather than copied from a live response so it carries no real account data.

Signing in through the mock returns that user, with `app_metadata.provider` flipped to whichever provider was clicked.

## The mock database

`mockDatabase` is a small typed table store over `localStorage` under `standout.mock.db`, with `select`, `insert`, `update`, `remove`, and `reset`. Sessions live separately under `standout.mock.session`, so signing out does not wipe published data.

Seeding is **lazy** — it happens on the first auth or repository call, not on page load. A visitor who never signs in leaves no trace in storage.

Seeded state: one user, one handle, one published portfolio, one `free` entitlement, one revision.

Also mocked, in the same shape:

| Fixture | Stands in for |
|---|---|
| `user.json` | Supabase `auth.users` after a GitHub OAuth |
| `github-profile.json` | The Octokit profile the repository import would fetch |
| `entitlement.json` | The `entitlements` row for a free user |
| `razorpay-subscription.json` | A Razorpay subscription object after activation |

## Verifying

```bash
npm run mock:verify
```

Exercises reset, seeding, sign-in, session persistence, sign-out, handle availability including reserved words and malformed input, lookup by handle and by user, publish, unpublish, and delete.

Run as part of `npm run verify` alongside lint and typecheck.

## Rules

1. A new external dependency gets a port in `application/ports`, a mock adapter, and a real adapter. No exceptions.
2. Mock data lives in `src/infrastructure/mock/`. Never in components, never in `application/`.
3. Mock fixtures mirror the real API response shape exactly, including nested objects and nullability. A mock that is more forgiving than reality is worse than no mock.
4. No fixtures containing real accounts, real emails, or real customer data.
5. Nothing in `src/` branches on the environment except where the mock store forces it, which today is `/p/[handle]` alone.
6. If a bug can only be reproduced against the live service, the port is too narrow.