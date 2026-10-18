# Data layer

Supabase Postgres with Drizzle ORM. R10.

---

## The constraints that shape everything

From `../04-research/platform-findings.md`:

| Limit | Value | Consequence |
|---|---|---|
| **Database size** | **500 MB** on Free | Caps us around 25,000 portfolios. Revisions must be rationed. |
| **Egress** | **5 GB / month** | Portfolio views must be CDN-cached or we run out in a week |
| **Project pausing** | 7 days inactivity | See `auth.md`. Mitigated by caching public reads. |
| Auth MAU | 50,000 | Matches Clerk. Not our binding constraint. |
| Backups | **None on Free** | No automatic restore point |

Egress is the number to watch. It replaced Turso's write ceiling as the tightest constraint, and it moves the caching requirement from "strongly recommended" to "mandatory."

**500 MB / ~20 KB per portfolio ≈ 25,000 portfolios.** That is inside our target range, so it is a ceiling to plan for rather than a wall we hit next week. But revisions are pure overhead against it, so the caps below are firm.

---

## Tables

```sql
users
  id              uuid        primary key, references auth.users (cascade delete)
  email           text        not null
  name            text
  avatar_url      text
  created_at      timestamptz not null default now()
  updated_at      timestamptz not null default now()

handles
  handle          text        primary key, lowercased
  user_id         uuid        unique references users, cascade delete
  status          text        not null default 'active'   -- active | reserved | blocked
  redirect_to     text                                     -- set while a rename propagates
  created_at      timestamptz not null default now()

portfolios
  handle          text        primary key references handles
  user_id         uuid        not null references users, cascade delete
  schema_version  integer     not null
  template_id     text        not null
  config          jsonb       not null default '{}'
  data            jsonb       not null
  visibility      text        not null default 'private'  -- public | private | unlisted
  published_at    timestamptz
  created_at      timestamptz not null default now()
  updated_at      timestamptz not null default now()

portfolio_revisions
  id              uuid        primary key
  handle          text        not null
  schema_version  integer     not null
  data            jsonb       not null
  created_at      timestamptz not null default now()

entitlements
  user_id         uuid        primary key references users, cascade delete
  plan            text        not null default 'free'     -- free | paid | sponsor
  razorpay_subscription_id  text  unique
  status          text        not null default 'none'     -- none | pending | active | past_due | cancelled
  current_period_end       timestamptz
  updated_at      timestamptz not null default now()

imports
  id              uuid        primary key
  user_id         uuid        not null references users, cascade delete
  source          text        not null                       -- github | linkedin | manual | yaml
  status          text        not null                       -- pending | complete | failed
  created_at      timestamptz not null default now()
  completed_at    timestamptz
```

---

## Design notes

**`portfolios.data` is `jsonb`, not normalised tables.**

Our access pattern is "load one entire portfolio and render it." Normalising projects, education, and skills would multiply reads on the hottest path to solve a problem we do not have — we never query across users' projects.

Postgres `jsonb` is genuinely better than Turso's TEXT here: it is indexed, binary, and queryable when we do need to reach into it later, without a migration.

**Revisions are capped at 3, retained 30 days.** Turso allowed 5. The storage budget is an order of magnitude tighter, and a revision we have not used to recover anything is a revision we are paying for twice.

**`handles.user_id` is unique.** This is how "single portfolio per account" is enforced — by the database, not by application logic that can be bypassed.

**`jsonb` carries the schema version.** `schema_version` is a column rather than a key inside the JSON so it can be indexed and filtered without touching the document.

**Cascade delete everywhere.** Deleting `auth.users` removes every trace. That is the correct behaviour for a DPDP-compliant deletion and it removes an entire class of orphaned-row bugs.

---

## Indexes

```sql
create unique index on handles (user_id);
create unique index on handles (handle) where status = 'active';
create index on portfolios (user_id);
create index on portfolios (visibility) where visibility = 'public';
create index on portfolios (published_at desc) where visibility = 'public';
create unique index on entitlements (razorpay_subscription_id);
create index on portfolio_revisions (handle, created_at desc);
create index on imports (user_id, created_at desc);
```

Partial indexes matter more here than they did on SQLite. Public portfolio reads are the overwhelming majority of traffic and they only touch rows where `visibility = 'public'`, so a partial index keeps the hot path off the private rows entirely.

---

## Egress budget

**5 GB per month on Free.** This is the constraint that decides the architecture.

Every portfolio view that queries Postgres directly spends egress. At roughly 40 KB per render:

```
5 GB / 40 KB  ≈  125,000 uncached renders per month
```

Our target is 500,000 portfolio views per month. **Uncached, we exhaust the budget in a week.**

### The rule

**`/p/[handle]` reads from CDN cache and never queries Supabase on a hit.** Revalidate on publish via cache tags.

This was already the plan under Turso, where caching was justified by the write ceiling. Here it is justified by egress, which is a stronger argument, and it has the side benefit of insulating the most important route from the project-pausing problem.

### What this means in practice

| Route | Supabase access |
|---|---|
| `/p/[handle]` public | **Cache hit only.** On miss, one query then cache. |
| `/builder`, `/dashboard` | Direct, user-initiated, low volume |
| Template catalogue | Cached, static catalogue |
| OG image generation | Cached, long TTL, regenerated on publish only |
| Any analytics or view counter | **Never.** Externally, or not at all. |

---

## Connection and runtime

```ts
const client = drizzle(postgres(process.env.DATABASE_URL), { schema })
```

- **Browser:** Supabase JS client with the anon key. RLS is the boundary.
- **Server:** Drizzle over the pooled connection string. Never the direct one — Postgres has a connection limit and serverless instances open connections independently.

**Pooler, always.** Supabase's connection pooler is required on serverless. The direct connection URL will exhaust Postgres's connection limit under concurrent serverless invocations, which is a hard failure and an easy one to hit by accident.

The previous architecture also raises a question the old one did not: **should the browser query Supabase directly at all?** For a static portfolio catalogue, yes — RLS makes it safe and it removes a round trip. For anything involving entitlements, no — entitlements must never be client-readable.

---

## Migrations

`drizzle-kit` generates SQL migrations against the Postgres dialect.

**Rules:**

- Migrations are additive. Dropping a column is two steps: stop writing it, then drop it.
- Every migration that touches a table with data must be reviewed for table locks on large tables.
- **RLS policies ship in the same migration as the table.** A table that exists without RLS is fully readable by anyone with the anon key, and that window should never exist even briefly.
- Reviewed and applied deliberately. Never automatically on deploy.

---

## Backups

**Free has none.** This is a genuine durability gap for user portfolios — the one thing users would be most upset to lose.

Mitigations, in order:

1. **Data is always exportable.** A user can retrieve everything in YAML or JSON at any time. That caps the damage from data loss even though it does not prevent it.
2. **Pro ($25/month) includes daily backups with 7-day retention.** We upgrade on first revenue, which is customer number one.
3. Revisions give a 30-day in-product undo, which covers the common case — a user overwriting something — but not a database-level incident.

**Monitoring for storage growth is a launch requirement.** At 500 MB with no backups and no automatic warning, running out of space quietly would be bad. Supabase does surface database size, but we should alert on it ourselves.

---

## Monitoring

Launch requirement:

- **Egress per day** — the tightest budget in the system
- **Database size** — approaching 500 MB with no backups on Free
- **Project pause state** — alert if the project pauses, because that means public routes are degraded
- Query latency on the builder path
- Razorpay webhook failure rate

---

## Scaling path

1. **Free → Pro ($25/month).** Removes pausing, adds 8 GB, 250 GB egress, daily backups. First spend after R1 lifts.
2. **CDN caching layer, properly configured.** Do this before Pro if egress gets tight — it is the cheaper fix and it is what the architecture already assumes.
3. **Revisions to object storage.** If revision history grows past what is worth storing inline, move cold revisions to Supabase Storage and keep only the latest in `jsonb`.
4. **Normalise only if query patterns demand it.** They currently do not.

Each step touches one folder, because the dependency inversion in `layering.md` keeps persistence behind a port.