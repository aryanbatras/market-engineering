export const importPrompt = `You are converting a student's resume into the portfolio YAML format below.

Rules:
- Keep their own wording wherever it is accurate. Do not rewrite in marketing language.
- Do not invent projects, employers, dates, grades, or skills. Leave a field out rather than guessing.
- Only name is required. A short portfolio is fine. A wrong portfolio costs them an interview.
- Keep dates in YYYY-MM or YYYY form.
- URLs must be complete, including https://

Format:

portfolioVersion: 1
identity:
  name: string
  headline: string
  location: string
  email: string
  availability: string
links:
  - platform: github | linkedin | website | email
    url: string
education:
  - institution: string
    degree: string
    field: string
    start: string
    end: string
    current: boolean
    grade: string
experience:
  - organisation: string
    role: string
    location: string
    start: string
    end: string
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
skills:
  - name: string
    group: string
highlights:
  - string

Now convert this resume:

PASTE YOUR RESUME HERE
`

export const promptCopy = {
  title: "Ask any AI to convert your resume",
  body: "Paste the prompt below into ChatGPT, Gemini, or whatever you already use. It asks for YAML in our exact format, and it tells the model not to invent anything.",
  action: "Copy the prompt",
  copied: "Prompt copied",
  fallback: "Open the prompt on GitHub",
}

export const emptyStateCopy = {
  title: "Nothing here yet",
  body: "Paste some YAML, connect GitHub, or fill in the form. You can publish with just a name.",
  action: "Use the sample",
}

export const errorCopy = {
  invalid: "That did not parse",
  noName: "Add a name before publishing",
  handleTaken: "That handle is already claimed",
  publishFailed: "We could not publish that. Try again in a moment.",
  networkLost: "You appear to be offline. Your draft is safe in this browser.",
}

export const actionCopy = {
  publish: "Publish",
  published: "Published",
  save: "Save changes",
  saved: "Changes saved",
  copyLink: "Copy link",
  linkCopied: "Link copied",
  download: "Download",
  startBuilding: "Start building",
  signIn: "Sign in",
  trySample: "Try with sample data",
}