# Data layer

Turso / libSQL with Drizzle ORM. R10.

---

## The constraint that shapes everything

From `../04-research/platform-findings.md`:

- Free plan **blocks the database outright** on exceeding any single metric.
- **10M writes/month ≈ 3.8 writes/second** sustained.
- **500M row reads/month**, and a "row read" is a row *scan* — an unindexed query burns quota proportional to what it examined, not what it returned.

This is the tightest limit in the whole system. Clerk and Vercel both have far more headroom than Turso.

**Design consequence:** the product is read-heavy and write-light by construction. Portfolio pages are read constantly and written rarely. Every design decision below follows from keeping writes rare.

---

## Tables

```
users
  clerkId         text    primary key
  email           text    unique
  name            text
  avatarUrl       text
  createdAt       integer
  updatedAt       integer

handles
  handle          text    primary key, lowercase, unique
  ownerClerkId    text    unique — single portfolio per account
  status          text    active | reserved | blocked
  createdAt       integer

portfolios
  handle          text    primary key
  clerkId         text
  schemaVersion   integer
  templateId      text
  config          text    JSON
  data            text    JSON — the validated portfolio document
  visibility      text    public | private | unlisted
  publishedAt     integer
  createdAt       integer
  updatedAt       integer

portfolio_revisions
  id              text    primary key
  handle          text
  schemaVersion   integer
  data            text
  createdAt       integer

entitlements
  clerkId         text    primary key
  plan            text    free | paid
  razorpaySubscriptionId  text
  status          text    none | pending | active | past_due | cancelled
  currentPeriodEnd integer
  updatedAt       integer

imports
  id              text    primary key
  clerkId         text
  source          text    github | linkedin | manual | yaml
  status          text    pending | complete | failed
  createdAt       integer
  completedAt     integer
```

---

## Design notes

**`portfolios.data` is a JSON document, not normalised tables.**

Our access pattern is "load one entire portfolio, render it". Normalising `projects`, `education`, and `skills` into relational tables would multiply reads on the hottest path to solve a problem we do not have — we never query across users' projects.

Turso is SQLite, and SQLite handles a JSON text column well. This is the shape the database is good at.

**Revisions are capped.** Keep the last 5 per handle. Old revisions are the easiest way to blow the write budget for a feature nobody uses. Retention is 30 days, then pruned.

**One row per user for entitlements.** Entitlements are read on nearly every authenticated request. Keeping them as a single-row lookup rather than a join is worth the denormalisation.

**`handles.ownerClerkId` is unique.** This is how "single portfolio per account" is enforced — by the database, not by application logic that can be bypassed.

---

## Indexes

Mandatory, because row reads are metered by scan:

```
users                email (unique)
handles              ownerClerkId (unique)
portfolios           clerkId
entitlements         razorpaySubscriptionId (unique)
portfolio_revisions  handle, createdAt
imports              clerkId, createdAt
```

Every query that filters or sorts on a portfolio column must be covered. A full table scan across 50,000 portfolios is 50,000 reads per request and will block the database on a busy afternoon.

---

## Write budget

Allocated against the 3.8 writes/second ceiling:

| Operation | Frequency |
|---|---|
| Portfolio save | A few per user per session |
| Revision write | Same |
| Publish / unpublish | Rare |
| Handle claim | Once |
| Clerk user mirror | Once per signup |
| Razorpay entitlement sync | Rare, webhook-driven |
| GitHub import | Once per connect |

**What we deliberately do not write:**

- ❌ Portfolio views. No `updatedAt` touch, no last-viewed timestamp, no view counter.
- ❌ Analytics events.
- ❌ Session records.
- ❌ Per-render or per-request anything.

Page views are the highest-volume event in the product and they are precisely the thing we refuse to write. Analytics goes to a free-tier external service, and the public route reads from cache instead of touching Turso at all.

---

## Connection and runtime

`@libsql/client` over HTTP, from Vercel serverless. Not the native/libsql socket client — that requires a persistent process we do not have on serverless.

```ts
const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})
```

One module-level client per serverless instance. Reused across warm invocations. Turso's HTTP driver handles connection pooling internally.

---

## Migrations

`drizzle-kit` generates SQL migrations, applied over HTTP. Committed to the repo, applied in deploy order.

**Rules:**

- Migrations are additive where possible. Dropping a column is two migrations: stop writing it, then drop it.
- No migration runs against production without being reviewed.
- We do not rely on automatic migration on deploy. Schema changes are deliberate steps.

---

## Backups and recovery

Free tier gives **1 day** of point-in-time restore. Developer tier ($5.99/mo) gives 10 days plus 3-day audit logs.

That is the first spend we make once R1 lifts, and it is cheap enough that it should not be the thing that forces the decision.

Until then: the user's data is theirs and always exportable, which reduces the cost of a bad state considerably.

---

## Monitoring

Launch requirement, not a later improvement:

- Rows read per hour
- Rows written per hour
- Storage growth
- Query latency outliers

**Turso does not degrade gracefully — it blocks.** We need warning before we hit the wall, not an incident page after. Free-tier external monitoring is sufficient; the metric is simple.

---

## Scaling path

Out of order, decided in advance so the migration is mechanical rather than an emergency:

1. **Free → Developer ($5.99/mo).** Real overage billing. First spend after R1 lifts. Worth doing before Clerk Pro.
2. **Read replicas / caching layer.** Only if row reads approach the limit.
3. **Schema normalisation.** Only if we grow query patterns we do not currently have.

Each step touches one folder because the dependency inversion in `layering.md` keeps persistence behind a port.