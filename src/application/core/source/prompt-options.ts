export type PromptOption = {
  id: string
  label: string
  note: string
  prompt: string
}

const schema = `portfolioVersion: 1
identity:
  name: string
  headline: string
  email: string
  phone: string
  location: string
  availability: string
links:
  - platform: github | linkedin | website | email
    url: string
experience:
  - organisation: string
    role: string
    location: string
    kind: internship | full-time | volunteer
    start: YYYY-MM
    end: YYYY-MM
    current: boolean
    summary: string
    highlights:
      - string
projects:
  - name: string
    description: string
    tech:
      - string
    role: string
    timeline: string
    featured: boolean
    url: string
    repo: string
education:
  - institution: string
    degree: string
    field: string
    board: string
    score: string
    grade: string
    start: YYYY
    end: YYYY
    current: boolean
skills:
  - name: string
    group: string
highlights:
  - string`

const rules = `Rules:
- Keep their own wording wherever it is accurate. Do not rewrite in marketing language.
- Do not invent projects, employers, dates, grades, or skills. Leave a field out rather than guessing.
- Only name is required. A short document is fine. A wrong one costs them an interview.
- Keep dates in YYYY-MM or YYYY form.
- URLs must be complete, including https://`

export const promptOptions: PromptOption[] = [
  {
    id: "resume-to-yaml",
    label: "Resume to YAML",
    note: "The full conversion prompt. Paste a resume, get YAML back.",
    prompt: `You are converting a student's resume into the YAML format below.\n\n${rules}\n\nFormat:\n\n${schema}\n\nNow convert this resume:\n\nPASTE YOUR RESUME HERE\n`,
  },
  {
    id: "fix-yaml",
    label: "Fix my YAML",
    note: "Paste YAML you have already written and have it corrected, not rewritten.",
    prompt: `Below is a YAML document in our format. Find every problem and fix it.\n\n${rules}\n- Keep every fact the author wrote. Correct the shape, never the content.\n- If a field is missing, leave it out. Do not invent a value to fill a slot.\n- Return the whole corrected document, not a diff.\n\nFormat:\n\n${schema}\n\nHere is my YAML:\n\nPASTE YOUR YAML HERE\n`,
  },
  {
    id: "tailor",
    label: "Tailor to a job",
    note: "Same facts, reordered and reworded for one posting.",
    prompt: `Below is a student's YAML document and a job description.\n\nRewrite the document so it fits this job, using only facts already present.\n\nRules:\n- You may reorder sections and reword highlights. You may not add a skill, a date, an employer or a project.\n- Prefer the bullet that answers what the posting asks for. Drop the ones that do not.\n- Leave a field out rather than inventing it.\n\nFormat:\n\n${schema}\n\nMy YAML:\n\nPASTE YOUR YAML HERE\n\nThe job:\n\nPASTE THE JOB DESCRIPTION HERE\n`,
  },
  {
    id: "shorten",
    label: "Fit one page",
    note: "Cuts to what survives one page. Never invents to fill space.",
    prompt: `Below is a YAML document that is too long for one page.\n\nShorten it so it fits, using only facts already present.\n\nRules:\n- Cut the weakest bullet from each role before you cut a role.\n- Keep the first internship or job in full. That is the one a recruiter reads.\n- Never invent anything to fill the space you free up.\n- Return the whole shortened document.\n\nFormat:\n\n${schema}\n\nMy YAML:\n\nPASTE YOUR YAML HERE\n`,
  },
]