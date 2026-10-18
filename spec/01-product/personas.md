# Personas

Three personas. They differ in what they already have, which determines which ingestion path serves them.

---

## Persona 1 — Aarav

**Final-year B.Tech, tier-2 college, mechanical engineering. 22.**

GitHub account opened in first year for a college workshop. 40-odd repositories, mostly forks and tutorial projects. Last meaningful commit was a hackathon in second year. LinkedIn has a profile photo, a college line, and nothing else.

**What he has:** a real degree, one hackathon, weak technical signal, zero presentation.

**What he lacks:** any idea what to put on a portfolio, any idea how it should look, and the belief that he has anything worth showing.

**Where he starts:** GitHub import, because it is the one thing he is confident about — "here is my GitHub, do something." It produces something immediately, which is the entire point. His real experience goes into YAML with a prompt, or into the form.

**What converts him:** seeing his own name, college, and hackathon on a page that looks like an engineer built it. The emotional beat is *legitimacy* — being visible as an engineer at all.

**What loses him:** anything that asks him to write about himself from scratch. He does not know how to describe his own work; that is the problem.

**YAML or GitHub.** Never the manual form.

---

## Persona 2 — Meera

**Pre-final-year, tier-3 college, computer science. 20.**

Two decent internships, one of them real. Has a resume PDF that a senior made for her, three years out of date. Has an Instagram presence because design is where she is actually confident.

**What she has:** genuine experience, a visual sensibility, an out-of-date document, and no idea that the two belong together.

**What she lacks:** understanding that her internship work is presentable, and any confidence that she can present it.

**Where she starts:** **YAML paste.** She asks an LLM to convert her resume, pastes it, and the template makes her internship bullet points read well. This is the path where the value is clearest — she wrote the content, we made it land.

**What converts her:** seeing competent work described competently for the first time. The emotional beat is *recognition* — her work finally reading as good as it is.

**What loses her:** templates that look like everyone else's. She can tell, and she is the audience most likely to reject a generic result.

**YAML. Almost certainly not GitHub** — she may not have a meaningful one.

---

## Persona 3 — Rohit

**Final-year, tier-2 college, computer science. 22.** Started coding in first year. Has built a handful of small projects, none of them finished, one of them actually decent.

Hears about portfolios constantly. Has been meaning to "start" one for about a year and a half. Has opened four different portfolio templates and closed all of them.

**What he has:** enough real skill to have something to show, and enough technical sense to be able to spot a good template from a bad one.

**What he lacks:** the ability to convert "I built things" into a presentation, and any reason to believe it is worth the effort.

**Where he starts:** browsing templates, with the specific fear that he will look like everyone else. He will not commit to YAML. He commits when he finds a template that does not look like the other forty.

**What converts him:** a template that does not look like every other portfolio out there. The emotional beat is *distinction* — not looking generic.

**What loses him:** templates that all look the same. If we ship five variations on the same bento grid, we lose Rohit entirely, and Rohit is the persona most likely to convert.

**This is why Immersive exists, and why it is the paid template.** Rohit is the person who pays.

---

## What the three share

The thing that unites them, and the thing that must be true of the product:

**They have something. They do not have a way to show it.**

Not a capability gap. A translation gap. Everything we build is translation — from scattered unstructured content into a credible professional presentation.

---

## Design consequences

Direct, and non-obvious, so they are recorded here:

- **Non-technical by default.** None of them can read our stack. The product must be usable by someone who does not know what a repository is.
- **Light backgrounds.** `DESIGN.md` §4. A resume is printed and read in daylight, often on a phone, often in a corridor. Dark portfolios are a statement they cannot afford to make.
- **Large type.** Most will read on a mid-range Android. Small grey text is how people conclude they do not belong.
- **They cannot judge our work.** They will not assess craft quality. They will assess whether it *looks like them* — whether the person in the template resembles them in age, ambition, and register. Templates must not read as designed by a thirty-year-old in Berlin.
- **The first five seconds decide everything.** Nobody reads. They glance, decide, and leave. Every surface must communicate what this is without scrolling.