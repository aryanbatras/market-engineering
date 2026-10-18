# PRODUCT.md

Durable product context. Read before designing or building anything.

---

## What this is

A web platform that turns the work an engineering student already has — a resume, a GitHub profile, a LinkedIn export — into a portfolio website and a typeset resume, both of which they can send to a recruiter.

The **portfolio generator is the first feature, not the product.** The wider platform is job-market readiness: the resume, resume tailoring, LinkedIn framing, content, video. All of it attaches to the same account and the same subscription, and all of it reads and writes the same document.

---

## Who it is for

Engineering students and final-year engineers at tier-2 and tier-3 Indian colleges. Three to twelve months from campus placement.

**Explicitly not for:** engineers who can already build their own portfolio. They will not visit, and we do not want them to. Our users are non-technical by construction, which is why the design is light, large, and generous.

Three personas, detailed in `spec/01-product/personas.md`: Aarav (GitHub-only, needs legitimacy), Meera (has a real internship, needs it to read well), Rohit (has real skill, needs to not look generic — this is who converts).

---

## The problem

Not a capability gap. A **translation gap**.

They have projects, internships, and degrees, and no way to turn scattered unstructured content into something a recruiter takes seriously. The advice "just make a portfolio" fails them twice: it assumes they know what a good one looks like, and that they can build one.

Full statement in `spec/01-product/problem-statement.md`.

---

## The single job

> **Ten minutes from nothing to a live portfolio URL.**

Every decision serves this. A feature that adds five minutes to that path halves our conversion, and it is the only path that matters in v1.

---

## What we are

A focused, single-purpose tool. Light, fast, legible. One thing done properly beats a platform that half-does five things — and our users are not sophisticated enough to navigate a product surface, which is exactly why they need us to do the curation for them.

---

## The two outputs

One document. Two render targets. A student should never type the same facts twice, and should never have to choose between a site and a resume.

| | Portfolio | Resume |
|---|---|---|
| **The artefact** | A website at `/p/<handle>` | A PDF, typeset in LaTeX |
| **Optimised for** | A recruiter browsing for ten seconds | A parser reading for a millisecond |
| **Layout** | Scroll, motion, space, image | One or two dense pages of type |
| **Built from** | The same YAML | The same YAML |

The YAML is the source of truth for both. They are designed together, and neither is an export of the other — a portfolio is not a resume printed on A4, and pretending otherwise produces two mediocre documents instead of two good ones.

---

## What we are not

| Not this | Because |
|---|---|
| A website builder | Our users cannot design a layout and do not want to learn |
| A freeform editor in v1 | Most expensive item on the list, most likely half-finished |
| A generic resume builder with two hundred stock designs | Ten considered layouts beat two hundred interchangeable ones. We curate; we do not catalogue. |
| A LaTeX tool | The `.tex` is editable and downloadable, but nobody needs a TeX compiler to apply for a job. They need a PDF that reads. |
| A LinkedIn tool | Someone else's platform |
| An AI product | No AI API. Users bring their own model; we ship the prompt and the schema |
| A source-code template shop | That business ends the moment the first template is public |

---

## The one idea

> **On this page, a portfolio being written becomes a live website.**

Every competing tool shows a finished page and asks you to imagine your content in it. We show the transformation happening — a working editor in the hero, YAML typing in on the left while the rendered portfolio rebuilds on the right.

It is not a video and not a mockup. It is the product, running, at true size, on our own domain.

---

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js App Router, deployed on Vercel |
| Language | TypeScript, strict |
| Database | Supabase Postgres |
| Auth | Supabase Auth — Google, GitHub, email |
| ORM | Drizzle |
| Payments | Razorpay, UPI-first |
| Styling | Tailwind v4 |
| Components | shadcn/ui, source owned by us |
| Motion | GSAP, Motion, React Three Fiber |

**Why Supabase rather than Clerk + Turso:** one service instead of two, cheaper at the paid tier, better backups on Pro, and Row Level Security means the database enforces access even if we ship a bug. The full comparison is in `spec/04-research/platform-findings.md` §1a.

---

## Constraints we chose

- **Free tier until the first paying customer.** At ₹83/month, customer number one covers the entire fixed cost base.
- **Closed source.** Templates never leave our infrastructure. This is the moat.
- **No AI API.** Saves per-user cost and the privacy problem simultaneously.
- **Data always exportable**, on every tier including free.
- **India-first.** Razorpay, UPI, ₹83/month, English.

---

## How it should feel

Quiet precision. Confident, engineered, not playful and not hacker-styled.

Like a tool that was made by someone who respects you enough not to make you feel stupid.

Every constraint in `DESIGN.md` exists to produce that feeling. Three hues, two radii, six type steps — a system with fewer decisions produces more consistent work, and consistency is what reads as expensive.