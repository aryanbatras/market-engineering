# Layering

Defines the R13 boundary. `app/` is a contract layer. The three source folders carry the actual code.

Every layer folder is further divided by domain. See `domain-model.md` — that document decides which world a file belongs to, this one decides how the layers stack.

---

## The shape

```
src/
  app/                    routing and HTTP contract ONLY
  application/            use cases, hooks, orchestration, validation, ports
  presentation/           design system, components, templates
  infrastructure/         external services, persistence, BFF adapters
```

Inside each of those, three domains: `core/`, `portfolio/`, `resume/`. Domain first, layer second — the full tree is in `domain-model.md`.

---

## `app/` — thin contract layer

Responsibilities:

- File-system routing
- Route handlers and their HTTP shapes — status codes, headers, request parsing, response shaping
- Declaring which server component renders which route
- Composition only

`app/` **must not** contain:

- Business rules or branching logic
- Database queries
- Validation beyond request shape
- Styling decisions
- Third-party client calls
- Anything longer than wiring

A route handler should read as a list of steps that call application-layer functions. If a route handler needs a comment to explain what a block does, the logic is in the wrong layer (R5).

### Example shape

```
app/
  (marketing)/
    page.tsx
  builder/
    page.tsx
    loading.tsx
    error.tsx
  p/
    [handle]/
      page.tsx                 cached public render
      not-found.tsx
      error.tsx
  api/
    portfolios/
      route.ts                 GET list, POST create
    portfolios/[handle]/
      route.ts                 GET one, PATCH update
    github/
      import/route.ts
    billing/
      webhook/route.ts
    og/[handle]/
      route.tsx
  layout.tsx
```

---

## `application/` — logic and orchestration

Contains:

- Use cases — one per file, named as verbs: `publishPortfolio`, `claimHandle`, `importFromGithub`, `syncRazorpayEntitlement`
- React hooks that call use cases
- Form state and validation orchestration
- React context providers
- **Ports** — interfaces the infrastructure layer must satisfy
- Portfolio schema definition (Zod) and version migrations

Depends on: nothing in `infrastructure/`. Only on ports.

This is the dependency-inversion seam. `application/` defines *what* it needs; `infrastructure/` implements it and registers the implementation. Swapping Supabase for Neon touches one folder.

**Across domains**, `application/resume/` may read one thing from `application/portfolio/`: the `Portfolio` type. Anything else between the two domains is forbidden by R18.

---

## `presentation/` — design and components

Contains:

- Design tokens and theme
- shadcn/ui components and our adaptations
- MagicUI whitelisted components
- Semantic class maps (R7)
- Portfolio templates
- Marketing site sections

Depends on: `application/` for data via hooks. Never on `infrastructure/`.

**Presentation never touches the database or a third-party API.** If a component needs data, it calls an application-layer hook.

Templates are stricter still: they receive `data` and `config` as props and import nothing from the other two layers at all.

---

## `infrastructure/` — adapters and external systems

Contains:

- Supabase client and repositories
- Drizzle schema and migrations
- Supabase Auth server helpers and session verification
- Razorpay client and webhook verification
- Octokit client
- `next/og` rendering
- Cache and revalidation primitives

Depends on: `application/` ports. Nothing imports into `infrastructure/` from the other layers except the composition root.

---

## Dependency direction

```
app  →  application  →  (ports)
             ↑
      infrastructure  implements the ports
             ↑
   presentation ──→  application
```

Forbidden:

- `presentation` importing `infrastructure`
- `application` importing `infrastructure`
- `infrastructure` importing `presentation`
- Any folder importing `app/`
- **Any domain importing another domain.** `portfolio` and `resume` are siblings, not parents.
- **`core` importing `portfolio` or `resume`.** Core is the bottom.
- Circular imports anywhere

The composition root is the single place where concrete implementations are wired to ports.

---

## Folder conventions

- **One implementation per file** (R6).
- Filenames match their export. `publishPortfolio.ts` exports `publishPortfolio`.
- `index.ts` re-exports only. No logic.
- Folders group by capability, not by technical type. `application/portfolio/` not `application/hooks/`.

---

## Path aliases

```json
{
  "@app/*":            ["./src/app/*"],
  "@application/*":    ["./src/application/*"],
  "@presentation/*":   ["./src/presentation/*"],
  "@infrastructure/*": ["./src/infrastructure/*"],
  "@composition/*":    ["./src/composition/*"]
}
```

Folders carry their meaning in their names. Import paths should read like the architecture does — a path includes its domain, so `@presentation/resume/templates/rule` says at a glance which world it is in and which rules apply to it.

---

## Enforcement

Linting enforces the boundary. An ESLint `no-restricted-imports` rule maps each layer's forbidden imports from R13 directly, and a second rule maps the cross-domain forbiddance from R18. A CI check fails the build on violation.

A rule that is not enforced is a suggestion. The lint config ships with the scaffold, in the same change that creates the folders — not later.

For the domain rule specifically, it is enabled **last**, after the folders exist. A rule that fails on day one of a refactor gets disabled by day two. The order is in `domain-model.md` § Migration.