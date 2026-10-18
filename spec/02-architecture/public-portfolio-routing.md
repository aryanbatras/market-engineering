# Public portfolio routing

`/p/[handle]` is the product. Everything else exists to feed it.

---

## Route shape

```
app/
  p/
    [handle]/
      page.tsx           cached public render
      loading.tsx
      not-found.tsx
      error.tsx
```

---

## The hard constraint

**This route never writes to Turso.**

Not a view counter. Not a last-viewed timestamp. Not a session record. Not an analytics event.

We have 3.8 writes/second to spend across the entire product, and portfolio views are by far the most frequent event in it. A single view counter turns the most-read page into the most-written page, and the free Turso plan responds to exceeding a limit by **blocking the database entirely**. One popular portfolio page could take the whole product offline.

**Cached render plus tagged revalidation is not an optimisation here. It is what makes the product survive its own traffic.**

---

## Render strategy

| Situation | Strategy |
|---|---|
| Published portfolio, visitor | Cached render. Zero database access on hit. |
| Owner viewing their own portfolio | Cached, plus a refresh affordance |
| Unpublished portfolio | Live render, or not-found depending on viewer |
| Preview in builder | Live render from draft data, never from the cache |

Revalidate by tag on publish. A publish writes once and invalidates; the traffic that follows is served entirely from cache.

---

## Handle resolution

Handles are:

- Lowercase
- 3–30 characters
- Alphanumeric and single hyphens
- Reserved-word and profanity filtered at claim time
- Unique, enforced by a primary key

Reserved words cover every `app/` route segment. `/p/admin` cannot exist because `/admin` is a system route and a recruiter following that link must never land somewhere unexpected.

**Handle changes:** allowed, 3 per month, with a redirect record so old links keep working. Handles are claimed separately from the Clerk account, so a user can change them without touching auth.

---

## SEO

Portfolios are the artefact people share on LinkedIn and WhatsApp. They need to be shareable and machine-readable.

**Per portfolio:**

- `Person` JSON-LD — name, job title, alumniOf, worksFor, knowsAbout, sameAs
- Canonical URL
- Open Graph and Twitter card, rendered per-user via `next/og`
- Descriptive meta from the portfolio headline

**Site level:**

- Sitemap covering published public portfolios
- `robots.txt` allowing `/p/`, disallowing `/builder`, `/dashboard`, `/api`

**Private portfolios** return not-found to everyone and are excluded from the sitemap. `noindex` is not sufficient protection on its own — a 404 is the correct response.

---

## Social cards

`next/og` route handler at `/api/og/[handle]`. Rendered server-side, cached, regenerated on publish.

A recruiter on WhatsApp sees the person's name, headline, and a clean typographic card — not a generic "Check out my portfolio" preview. The card is doing real work: it is the shareable artefact for the audience we actually target, most of whom will encounter a portfolio through a chat app before they ever open a browser.

---

## Performance targets

This is the page a first-time visitor from a mid-range Android on Indian mobile data opens. It must not feel heavy.

| Metric | Target |
|---|---|
| LCP | under 2.0s on throttled 4G |
| CLS | under 0.05 |
| Initial JS | under 150 KB for non-3D templates |
| Cached TTFB | under 200ms |

The Immersive template carries Three.js and GSAP. Its budget is separate and its assets must not affect the other four templates — that isolation is enforced at build time, per `template-runtime.md`.

---

## Error handling

| Case | Response |
|---|---|
| No such handle | 404, copy offering to create a portfolio |
| Portfolio private, visitor is not owner | 404, not 403. Existence is not disclosed. |
| Portfolio unpublished | 404 to everyone; a banner for the owner explaining it is unpublished |
| Template failed to render | Error boundary per template, so one broken template does not affect routing or other templates |

The 404 page is an invitation, not an apology. Someone who mistypes a handle is a person who might want a portfolio. We do not waste that.

---

## Anonymous preview

Rendering a portfolio requires no account. This is deliberate:

- It is the strongest demonstration of the product — paste YAML, see a real site, seconds later.
- Clerk's free tier meters **retained** users, so people who never sign up cost nothing.
- It removes the highest-drop-off step from the value path.

Anonymous preview renders from in-memory draft data and never touches Turso. Publishing requires an account.

---

## Caching

- Tagged cache per portfolio, invalidated on publish.
- OG images cached separately, longer TTL.
- Public portfolio routes get `revalidate` semantics rather than full static generation, because the data lives in a database rather than the filesystem.
- Cache keys include the template ID and schema version, so a template deploy does not serve stale markup.