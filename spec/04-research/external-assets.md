# External assets policy

What we may use from outside the repository, what we may not, and why. Binding.

This exists because "it's free" and "we may use it in our product" are different questions, and for our specific business model the answer is often no.

---

## ⚠️ First: the API key

Do not commit it. Do not paste it into a shell command — it lands in shell history, and it is now in this session's transcript permanently.

**Rotate it.** A key that has been pasted into a chat should be considered exposed. Pexels keys are free, so rotation costs nothing.

```
# .env.local — gitignored, never committed
PEXELS_API_KEY=your_key_here
```

`.gitignore` already covers `.env` and `.env*.local`. `.env.example` carries the key name with an empty value so the shape is documented without the secret.

**Never call the API from the browser.** The key belongs in a server-side route handler that runs at build time or behind a cache. A key in client code is public, and Pexels will find it.

---

## The rule that decides everything

Our product is a **tool where a user customises a design and receives a personalised end product.** That specific shape is prohibited outright by most asset licences, even the ones that say "free for commercial use."

Most free licences mean: *free for you to build one end product.* They almost never mean: *free for you to ship a service that builds end products on demand for other people.*

We are the second thing. Read every licence against that sentence.

---

## Pexels — ✅ usable, narrow scope

**Licence terms verified 2026-10-18.** Free for commercial and personal use. Attribution not required. Modification permitted.

**Permitted uses, our scope:**

| Where | Rule |
|---|---|
| Marketing site | ✅ Hero and section imagery, as atmosphere |
| Footer / social preview | ✅ Pexels-hosted or self-hosted with credit |
| Portfolio templates | ❌ Never |
| Anything downloadable by a user | ❌ Never |
| Our logo, wordmark, or trade dress | ❌ Never — explicitly prohibited |

**Hard prohibitions, from Pexels' own terms:**

- **Do not imply endorsement.** No identifiable person may appear in a way that suggests they endorse or are affiliated with us. This rules out most stock photos of named people, and any photo where a person appears to be using *our* product.
- **Do not redistribute** on another stock or wallpaper platform.
- **Do not sell unaltered copies**, standalone, with only filters or crops applied.
- **Do not compile content** to replicate or compete with Pexels.
- **Do not use the API for ML or dataset construction.** Explicitly prohibited, and worth knowing because it means no AI training on Pexels content, ever.

**The design argument, which is separate from the legal one:**

We will not use generic stock photography of people at laptops. Our audience is nineteen-year-olds; a stock photo of a smiling professional is the single most generic thing we could put on the page, and it signals "template" instantly.

What we *will* use from Pexels, when we use it at all:

- Real architecture of Indian campuses and cities
- Real hardware, workbenches, circuit boards, tools
- Real light and texture
- The world our users actually live in

One image, used large, beats a row of small ones. If we cannot find an honest one, we use our own interface instead, which is the default anyway.

**Attribution is not required but we give it.** It costs nothing, and it is the correct behaviour when taking someone's work for free.

---

## Illustration packs — ❌ not for templates, mostly not for the app

| Source | Verdict | Reason |
|---|---|---|
| **Envato Elements** | ❌ **Prohibited outright** | Its terms explicitly ban use in "on-demand, made-to-order, or build-yourself applications" — a tool where a customer customises a design and receives a personalised end product. **That is exactly what we are.** Also bans redistribution even with modification, and bans recolouring an icon as a "superficial modification." |
| **Envato Free Files** | ❌ Prohibited | One end product per file, no derivatives, and the same on-demand prohibition. |
| **unDraw** | ⚠️ Not for us | Its own licence says: *"If you find unDraw or its illustrations in the center of what you are doing (e.g. sell or re-distribute one/some of them, train an ai model, **add them in an app**), then you probably should not proceed."* Also bans automated scraping of its assets, which is how anyone would ingest them at scale. |
| **getillustrations** | ⚠️ With conditions | Free tier requires attribution back to their site, and redistribution is prohibited. |
| **Unblast** | ⚠️ Attribution required | Their own designs are free for commercial use, but you may not host the download files, and third-party resources carry whatever licence the author chose — often unspecified. |

**Envato is the one to be certain about.** A portfolio generator is the textbook example of the prohibited category. Using an Envato illustration in a template we render for users is a licence violation, and it is the kind that arrives as a takedown notice months later when you have users depending on it.

---

## What we may freely use

| Source | Licence | Verdict |
|---|---|---|
| **React Icons** | MIT | ✅ Icons |
| **Openverse** | Per-asset, many CC0 | ✅ CC0 illustrations and imagery |
| **Wikimedia Commons** | Per-asset | ✅ Public domain and CC0 only — verify per file |
| **Art Institute of Chicago**, **The Met** | Public domain / CC0 | ✅ Public domain artworks |
| **Google Fonts** | OFL | ✅ Self-hosted via `next/font` |
| **Geist** | OFL | ✅ Our typeface |
| **lottie / rive** | Per-file | ⚠️ Verify each; Rive is MIT for the runtime, content varies |

**CC0 is the safe harbour.** Public domain dedication, no conditions, no attribution requirement, redistributable. When in doubt, CC0.

---

## Icons — React Icons

**Library: React Icons (MIT).** Founder-pinned, aggregates Iconify sets, widely used, tree-shakeable with per-icon imports.

**Critical constraint:** React Icons bundles *many* icon families, and their stroke weights and geometry are **not** consistent across sets. Using Feather and Lucide icons in the same view is instantly visible and reads as carelessness.

**Therefore: exactly one family for the whole product.** We pick Lucide — it is the most consistent set in the library, the stroke weight is uniform, and it tree-shakes cleanly.

```ts
import { ArrowRight, Check, Github, Plus } from "react-icons/lu"
```

**Rules:**

- One family. One weight. No exceptions, ever.
- Import per icon, never the barrel file. `react-icons/lu`, not `react-icons`.
- No emoji as icons. No icon in a rounded tinted square.
- Icons accompany text or replace it entirely.

`optimizePackageImports` is configured for `react-icons` so the per-icon imports hold in production builds.

---

## The default position

**Our imagery is our own interface.** This is the default and it needs no external source.

Where this document permits an external asset, that is an exception, not a licence to fill the page with stock. The direction we committed to says software is most convincing when it is doing its job on the page — and that is both better design and a cleaner legal position.

**Order of preference, always:**

1. Our own interface, rendered live at true size
2. Real photographs of our users' world, from Pexels or CC0 sources, credited
3. CC0 illustrations, when they genuinely serve a section
4. Our own drawings in the three palette colours
5. Nothing

Never: assets of unclear licence, anything with a named brand or identifiable person in an endorsement position, anything a licence forbids in an on-demand builder, and anything lifted from a competitor's site.