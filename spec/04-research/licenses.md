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
| `react-icons` | MIT | Clear — Lucide family (`react-icons/lu`). Per-icon imports only. |
| `unpdf` | MIT | Clear — ATS text extraction. Already evaluated for PDF import. |
| `busytex` | MIT (code) / TeX Live (binaries) | Evaluated, not chosen — 32 MB wasm plus a 90–400 MB data package is too large for the preview path. Kept as a documented fallback. |
| `tectonic` | MIT (Rust) / LPPL (vendored TeX, XeTeX) / Apache-2.0 (Xdvipdfmx) | **Chosen engine.** All three permit redistribution and closed-source combination. Verified 2026-10-18 against the 0.17.0 release. **Re-audit before it ships.** |

---

## Rejected on licence

Recorded so it does not get re-litigated later. Both of these would have solved browser LaTeX compilation, and both are out.

| Project | Licence | Why rejected |
|---|---|---|
| `SwiftLaTeX/SwiftLaTeX` | **AGPL-3.0** | Copyleft. Shipping its WASM engine to a browser is distribution, and AGPL's network clause reaches a hosted service. 2.3k★, actively maintained, widely used — still out. |
| `TeXlyre/texlyre-busytex` | **AGPL-3.0** | Same. Derived from BusyTeX (MIT), but the WASM wrapper is AGPL, and the wrapper is the part we would ship. |

**The rule this adds:** a permissive upstream is not a permissive artefact. If a project wraps MIT code in an AGPL interface, the interface is what we ship and the interface governs.

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
| `reactive-resume/reactive-resume` | **MIT** | Corrects an earlier assumption that it was AGPL. Safe to study. |
| `yamlresume/yamlresume` | **MIT** | Closest existing resume implementation. Took the model/layout split; did not solve compilation. |
| `jsonresume.io` / JSON Resume | MIT | Interop target |
| `BenjaminOff/portfolio` | MIT | Reference |
| `ChoJongHoon/develofolio` | MIT | Reference |
| `akkefa/developer-portfolio` | MIT | Reference |
| `lorenzomiscoli/developer-portfolio` | MIT | Reference |
| `BuilderIO/builder` | MIT | Evaluated for v1.5 editor |
| `magicuidesign/magicui` | MIT | Whitelisted components only, per `DESIGN.md` §13 |

### Resume layout archetypes — studied, never adapted

Every resume layout we ship is written from scratch, exactly as every portfolio template is. Nine of these ten sit outside the allowlist at §Standing principle, which is the point of listing them: the design language of a popular template is not its source code, and we are allowed to know what Rule looks like without shipping a line of it.

| Archetype | Licence | Disposition |
|---|---|---|
| `jakegut/resume` — Jake's Resume | MIT | Studied. Layout `rule`. |
| `deedy/Deedy-CV` | MIT | Studied. Layout `compact`. |
| `dnl-blkv/mcdowell-cv` | MIT | Studied. Layout `header`. |
| `sb2nov/resume` | MIT | Studied. Layout `engineer`. |
| `posquit0/Awesome-CV` | LPPL-1.3c | Outside allowlist — studied only. Layout `colour`. |
| `posquit0/AltaCV` | LPPL-1.3c | Outside allowlist — studied only. Layout `sidebar`. |
| `fky2015/resume-ng` | LPPL-1.3c | Outside allowlist — studied only. Layout `rail`. |
| `subidit/rover-resume` | CC-BY-4.0 | Outside allowlist — studied only. Layout `atlas`. |
| IIT Bombay placement format | none | No licence — studied only. Layout `campus`. |
| ModernCV class | LPPL | Outside allowlist — studied only. Layout `modern`. |

---

## Fonts

| Family | Licence | Note |
|---|---|---|
| Geist / Geist Mono | SIL Open Font License 1.1 | Clear — permits commercial use and embedding. Vercel's typeface, founder-pinned. One family for display and text, mono for code only. |

Both are OFL, which permits commercial embedding. Fonts are self-hosted via `next/font` — no runtime request to Google, no user-IP leak to a third party, and no layout shift.

---

## Fonts in generated PDFs

LaTeX ships its own fonts. We do not embed Geist in the `.tex`.

| Engine | Uses | Licence |
|---|---|---|
| pdfLaTeX + `lmodern` | Latin Modern — a Type 1 reimplementation of Computer Modern | GUST Font Licence, LPPL-compatible. Permits embedding in a generated PDF, including a closed-source product. |
| XeLaTeX / LuaLaTeX + `fontspec` | Whatever we point it at | Would need its own audit. **Not used in v1.** |

Latin Modern is the right choice for two reasons beyond the licence. It is the traditional academic face, so the output looks like a document rather than a web page. And it is what the ATS preamble in `resume-compilation.md` already assumes, which keeps the preamble short.

---

## Process

1. New dependency → check licence before install.
2. Record it here with the verdict.
3. Anything not MIT/ISC/BSD/Apache-2.0/0BSD/Unlicense stops and goes to the founder.
4. Re-audit before v1 launch and before v1.5.
5. Keep an `oss-notices` attribution for anything we redistribute.

**Before anything reaches a user as a file, check what is inside it.** A PDF embeds fonts. A WASM engine embeds a TeX distribution. The dependency tree is not the whole licence surface — the artefacts are. The resume engine audit in the table above covers the wasm and its bundled TeX files together, not the Rust crate alone.