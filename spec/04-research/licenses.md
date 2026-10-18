# Licence audit

Rule: **nothing enters the dependency tree without a recorded commercial-use verdict.**

This exists because the entire business depends on templates staying closed-source (see `spec/03-business/monetization.md`). A single copyleft dependency in the render path would force us to open-source the product.

---

## Standing principle

- **Permissive licences (MIT, ISC, BSD, Apache-2.0, 0BSD, Unlicense)** — usable, with attribution retained in our own internal notice file.
- **Copyleft (GPL, AGPL, LGPL, MPL)** — **not permitted in shipped code.** LGPL and MPL are technically usable in specific configurations, but the configuration risk is not worth taking on a hobby-tier team. Nothing copyleft enters.
- **Source-available / BSL** — requires founder review before use.
- **No licence** — do not use.

---

## Verified dependencies

| Package | Licence | Verdict |
|---|---|---|
| `next`, `react`, `react-dom` | MIT | Clear |
| `typescript` | Apache-2.0 | Clear |
| `tailwindcss` | MIT | Clear |
| `clsx` | MIT | Clear |
| `tailwind-merge` | MIT | Clear |
| `class-variance-authority` | Apache-2.0 | Clear |
| `tailwind-variants` | MIT | Clear |
| shadcn/ui components (Radix primitives) | MIT | Clear |
| Radix UI | MIT | Clear |
| `@supabase/supabase-js` | MIT | Clear — Supabase is a hosted service, not vendored |
| `@supabase/ssr` | MIT | Clear |
| `drizzle-orm`, `drizzle-kit` | Apache-2.0 | Clear |
| `zod` | MIT | Clear |
| `zod-to-json-schema` | MIT | Clear |
| `yaml` | ISC | Clear |
| `postgres` (postgres.js, used by Drizzle) | MIT | Clear |
| `@octokit/rest`, `@octokit/graphql` | MIT | Clear |
| `gsap` | Standard "no charge" — **ambiguous for paid tiers** | ⚠️ See below |
| `motion` (framer-motion) | MIT | Clear |
| `three`, `@react-three/fiber`, `@react-three/drei` | MIT | Clear |
| `lenis` | MIT | Clear |
| `phosphor-react` | MIT | Clear |
| `@dnd-kit/*` | MIT | Clear |
| `razorpay` | BSD-2-Clause | Clear |

---

## Removed from the stack

| Was | Licence | Why removed |
|---|---|---|
| `@clerk/nextjs` | MIT | Replaced by Supabase Auth (R9) |
| `@libsql/client` | MIT | Replaced by Supabase Postgres + Drizzle (R10) |
| `tailwind-variants` | MIT | Still used, but only where a component has genuine variant cross-products. `cva` covers the rest |

---

## ⚠️ GSAP — accepted ambiguity

GSAP is **100% free including commercial use** since 2025-04-30, including all previously Club-only plugins. The license explicitly permits use by visual-interface tools that do not directly compete with Webflow's visual animation builder, and explicitly states AI-generated GSAP code is acceptable.

**The gap:** an older page on the same domain still requires a license when *"your site or product requires a fee to use or join."* Our paid tier is that shape.

**Founder decision: use GSAP anyway, risk understood.**

**Mitigation:** GSAP is confined to the Immersive template and scroll choreography. Motion and R3F carry the rest. If a licence question ever materialises, the blast radius is one template, and `motion` can replace it without touching the rest of the product.

---

## Prior art reviewed — not shipped

We studied these. None of their code enters our repository.

| Project | Licence | Note |
|---|---|---|
| `reactive-resume/reactive-resume` | **MIT** | Corrects an earlier assumption that it was AGPL. Its licence explicitly permits use, modification, distribution, sublicensing, and sale. Safe to study and adapt. We did. |
| `jsonresume.io` / JSON Resume | MIT | Interop target |
| `BenjaminOff/portfolio` | MIT | Reference |
| `ChoJongHoon/develofolio` | MIT | Reference |
| `akkefa/developer-portfolio` | MIT | Reference |
| `lorenzomiscoli/developer-portfolio` | MIT | Reference |
| `BuilderIO/builder` | MIT | Evaluated for v1.5 editor |
| `magicuidesign/magicui` | MIT | Whitelisted components only, per `DESIGN.md` §13 |

---

## Fonts

| Family | Licence | Note |
|---|---|---|
| Geist / Geist Mono | SIL Open Font License 1.1 | Clear — permits commercial use and embedding. Vercel's typeface, founder-pinned. One family for display and text, mono for code only. |

Both are OFL, which permits commercial embedding. Fonts are self-hosted via `next/font` — no runtime request to Google, no user-IP leak to a third party, and no layout shift.

---

## Process

1. New dependency → check licence before install.
2. Record it here with the verdict.
3. Anything not MIT/ISC/BSD/Apache-2.0/0BSD/Unlicense stops and goes to the founder.
4. Re-audit before v1 launch and before v1.5.
5. Keep an `oss-notices` attribution for anything we redistribute.