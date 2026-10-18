# Template runtime

**This is the highest-risk decision in the product (R12).** Everything — five templates, the editor, the public route — sits on this. If this is wrong, we rewrite it before we write anything else.

Status: **spike first**. Nothing else gets built until this is proven.

---

## The problem

We have N portfolio templates, each a self-contained React UI. One user, one portfolio, rendered at `/p/<handle>`. We need:

- All templates in one Next.js App Router app, no separate deployments.
- Adding a template to be a folder drop-in, not a refactor.
- A template with a Three.js scene must not tax a template with no 3D.
- Published portfolios to stay renderable when the schema or templates change months later.
- Users on free tier to be served from cached HTML, because our write budget is 3.8/sec.

---

## Options evaluated

### Option A — Runtime registry with dynamic import

A registry maps `templateId` to a module. The route handler does `await import(\`./templates/${id}\`)`.

**Pros:** templates are ordinary source files, fully typed, tree-shaken, refactorable, hot-reloadable in dev. No build pipeline.
**Cons:** every template lands in the server bundle unless code-split carefully. Heavy deps pull in transitively unless isolated.

### Option B — Precompiled template registry

A build step emits a serialisable registry — template metadata plus async loader functions — so template code is split into separate chunks and only the selected template loads.

**Pros:** cleanest bundle boundary. Static analysis can prove which chunks exist.
**Cons:** a build step that must be kept in sync, and template source stops being directly refactorable by the compiler.

### Option C — Compile templates to standalone ESM and import the artifact

Each template is its own Vite library build. Next imports the built bundle. This is the "run a React app inside Next.js" escape hatch.

**Pros:** total isolation. A template author cannot break the main app.
**Cons:** loses types across the boundary, two build systems, duplicate React in the artifact, and it optimises for a threat model we do not have — our templates are ours, written by us. Isolation from our own code is not the constraint. Bundle size is.

### Option D — Fork per user

**Rejected outright.** Breaks R2 (we would be shipping template source), multiplies repos, and does not scale.

---

## Decision

**Option B — precompiled registry over runtime templates.**

The source of truth is TypeScript. A build step generates the registry that the route handler consumes. This gets Option A's developer ergonomics with Option B's bundle guarantees, without Option C's two-build-system tax.

We take the isolation win of C only where it actually matters — dependency isolation — which we get for free by keeping heavy deps inside the template folder that needs them.

**This is a spike decision. We validate it in a throwaway branch before committing to it.** The spike must prove four things (below). If it cannot, we fall back to Option A with strict `next/dynamic` boundaries and accept a larger bundle.

---

## Spike acceptance criteria

The spike is not done until all four are demonstrated with real measurements, not assertions.

| # | Must demonstrate | How |
|---|---|---|
| 1 | Five templates coexist, route-level code splitting works | Build output shows separate chunks per template; verify no template's deps appear in another's chunk |
| 2 | The 3D template's weight is fully isolated | A route serving the Bento template loads **zero** Three.js/R3F bytes |
| 3 | Cached HTML path works and never writes | Public route renders from cache with the database untouched |
| 4 | A cold render stays inside the Vercel function limit | Measure cold-start latency for the heaviest template, with GSAP + R3F + Lenis |

If criterion 2 or 4 fails, the architecture changes before we build templates.

---

## Runtime shape

```
presentation/
  templates/
    registry.generated.ts        build output — the only thing routes import
    classic/
      index.ts                    exports Template
      meta.ts                     id, supported schema versions, deps, config surface
      sections/                   one component per section
    bento/
    editorial/
    minimal/
    immersive/
      three/                      R3F isolated to this folder
      motion/                     GSAP isolated to this folder
```

A template module exports exactly one `Template` component plus `meta`. Nothing else.

### Template contract

```ts
type TemplateModule = {
  meta: {
    id: string
    supportedVersions: number[]
    capabilities: { three: boolean; gsap: boolean; lenis: boolean }
    config: ConfigField[]
  }
  Template: ComponentType<{ data: Portfolio, config: TemplateConfig }>
}
```

Templates are **pure functions of `(data, config)`.** They:

- never fetch
- never import from `application/` or `infrastructure/`
- never reach for a global context they did not receive as a prop
- hold no state that outlives a render

That constraint is what makes caching, static generation, PDF export, and a future editor all possible from one implementation.

---

## Data contract

One Zod schema, versioned. Templates declare the versions they support.

```
portfolioVersion: 1
```

**Rules:**

- Adding an optional field is a minor bump and backward compatible.
- Removing or renaming a field is a major bump; the old schema must remain valid for as long as portfolios using it are published.
- A template rendering a version it does not declare support for is a bug, caught by a test that renders every template against every stored fixture version.
- `data/portfolio.schema.json` is generated from Zod. Never hand-edited.

The upgrade path when we bump versions is a migration function in the application layer that reads stored data forward. Old published portfolios keep rendering on their original version until the user edits them.

---

## Bundle isolation

The hard requirement: **template N must not load template M's dependencies.**

Enforcement:

1. Heavy dependencies are imported only inside the template folder that uses them. Never lifted to a shared location.
2. Templates declaring `three: true` never appear in the static import graph of templates that do not.
3. `optimizePackageImports` configured for GSAP, Three, R3F, Phosphor.
4. Each template's `meta` drives a build-time check. If the Bento chunk contains `three`, the build fails.
5. That check runs in CI. It is the mechanism that stops this from regressing silently as templates grow.

---

## Rendering modes

| Mode | Used by | Writes to DB |
|---|---|---|
| **Cached** | Published public portfolio | Never |
| **Live preview** | In-editor preview of unpublished data | Never |
| **Fresh** | Owner viewing their own dashboard | Never, unless saving |

The default for the public route is Cached. A Turso write on view would burn the budget at 3.8 writes/second and hard-block the database. Cached render plus tagged revalidation on publish is what makes the product survive contact with its own traffic.

---

## What this runtime must support later

- **PDF export** — same templates, different render target.
- **v1.5 block editor** — templates expose slots; the editor populates them. Purity of `(data, config)` is what makes this additive rather than a rewrite.
- **OG image generation** — templates declare an OG variant.
- **Adding a sixth template** — a folder, a registry entry, nothing else.

---

## Open questions

- Does the generated registry survive Turbopack, or do we need a Webpack build step for this specific concern? Verify in the spike.
- Server Components versus Client Components per template. R3F and GSAP are inherently client. If a template is mostly client, is a Server Component shell around it worth the complexity? Measure in the spike.
- Do we need per-template error boundaries so one broken template cannot take down `/p/<handle>` routing? Leaning yes.