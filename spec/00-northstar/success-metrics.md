# Success metrics

Deliberately small. A hobby-tier product with one founder needs five numbers it cannot lie to itself about, not a dashboard.

---

## The five that matter

| # | Metric | Target | Why this one |
|---|---|---|---|
| 1 | **Portfolios published** | 1,000 in 6 months | The only proof we solved the problem |
| 2 | **Activation rate** — visitors who publish | > 25% | Distinguishes a working product from a demo |
| 3 | **D30 retention** — active in month 30 | > 20% | Distinguishes a tool from a one-off curiosity |
| 4 | **Paid conversion** — of published | > 3% | Distinguishes a business from a free tool |
| 5 | **Quality rate** — published with 3+ projects, or 1 project with a real description | > 60% | Distinguishes a portfolio from an empty shell |

**Metric 5 is the one teams lie to themselves about.** A published portfolio containing a name and nothing else is a failure that looks like a success. An empty portfolio does not get anyone a job, and publishing one is easy.

---

## Why these and not the usual set

- **No MAU.** Clerk meters retained users, and our anonymous-preview flow means a visitor can get real value without ever appearing in any account metric. MAU would measure our traffic, not our value.
- **No "signups."** A signup is not progress. Someone can create a Clerk account, paste nothing, and leave. Counting it flatters us.
- **No page views.** Portfolio views are our highest-volume event and we deliberately do not store them (see `../02-architecture/nfrs.md`).
- **No revenue as the headline.** At our scale revenue is noisy. The trigger for R1 is one customer, not a target.

---

## Secondary signals

Watched, not optimised. A sharp move in any of these means something changed.

| Signal | Reading |
|---|---|
| YAML vs form vs GitHub uptake | If GitHub dominates, the templates are not compelling enough |
| Immersive template selection rate | Directly predicts paid conversion |
| Second portfolio edit rate | If people never edit after publishing, our templates are not doing enough work |
| Share rate | If people do not share, the portfolio is not good enough to be worth their reputation |
| Handle abandonment | If users claim nothing at publish, we are one step too many in the way |
| Export rate | High export means trust. Zero export on a paying user is a churn signal. |

---

## Operational health

Not growth metrics, but these fail silently and are harder to recover from.

| Check | Threshold | Why |
|---|---|---|
| **Turso row writes** | Alert at 50% of monthly ceiling | **Hard block on breach. Not a degradation.** |
| Turso row reads | Alert at 50% | Scan-metered, so a bad query burns quota invisibly |
| Razorpay webhook failures | Any sustained > 1% | Revenue correctness |
| LCP on `/p/[handle]` | Alert above 2.5s | A recruiter on mobile data is the real user |
| Publish failure rate | Any sustained > 0.1% | The most important user action in the product |

The Turso one is the only non-negotiable monitor. Everything else in this business degrades; Turso stops.

---

## Qualitative signals

Numbers will tell us whether something works. These tell us why, and they are how we find out the numbers are wrong.

**Watch for:**

- Users sharing a portfolio link in a public place unprompted. The strongest signal we can get — they are staking their reputation on our output.
- "I got interviews." The actual outcome we are selling. Ask.
- Confusion in the builder. Every question that appears in our DMs is a copy problem first and a feature problem second.
- Which template people choose first. If one template dominates, the others are not worth the effort.
- Whether people are hiding our badge. If paid users want it gone badly enough to ask, we priced it correctly.

**Ask directly, monthly, of people who published:**

1. Did anyone open it?
2. Did you send it to anyone?
3. Do you think it looks like you?

The third question is the one that matters. Rohit does not want a good portfolio. He wants one that does not look generic.

---

## What would make us stop

Recorded now so the decision is not emotional later.

| Signal | Meaning |
|---|---|
| Published portfolios flat after 6 months of active work | The problem is not real enough, or we have not found the channel |
| Publish rate high, share rate near zero | Portfolios are not good enough to stake a reputation on |
| YAML abandonment above 60% | The default path is not working — GitHub or the form needs to lead |
| Nobody converts at ₹83 | We are either underpriced on value or overcharging on ₹83 |
| Users overwhelmingly request one specific template | Stop shipping five, ship that one |

---

## Reporting cadence

- **Weekly:** published count, activation rate, paid count, Turso write volume.
- **Monthly:** retention cohort, qualitative conversations, one honest answer to "what would make you delete this?"
- **Never:** optimising against a metric without a user conversation behind it.