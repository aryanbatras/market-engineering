#!/usr/bin/env node
// Behavioural check for the hero editor: it is always editable, it never flickers while you type,
// the source is always scrollable, and the preview renders every field in the file.
//
//   node scripts/editor-flicker-check.mjs [origin]

import { Browser, sleep } from "/Users/aryan/.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs"

const origin = process.argv[2] ?? "http://localhost:3000"
const results = []
const record = (name, pass, detail) => {
  results.push({ name, pass, detail })
  console.log(`${pass ? "PASS" : "FAIL"}  ${name.padEnd(40)} ${detail}`)
}

const probe = () => {
  const content = document.querySelector(".cm-content")
  const scroller = document.querySelector(".cm-scroller")
  const editor = document.querySelector(".cm-editor")
  if (!content || !scroller || !editor) return null

  let frame = editor.parentElement
  while (frame && getComputedStyle(frame).overflowY !== "hidden") frame = frame.parentElement

  const editorBox = editor.getBoundingClientRect()
  const frameBox = frame ? frame.getBoundingClientRect() : null

  return {
    length: content.textContent.length,
    lines: document.querySelectorAll(".cm-line").length,
    editorHeight: Math.round(editorBox.height),
    fitsFrame: frameBox ? editorBox.height <= frameBox.height + 1 : false,
    fitsParent: editorBox.bottom <= (frame?.parentElement?.getBoundingClientRect().bottom ?? 0) + 1,
    scrollable: scroller.scrollHeight > scroller.clientHeight + 1,
    editable: content.getAttribute("contenteditable") === "true",
    focused: editor.classList.contains("cm-focused"),
  }
}

const readPreview = () =>
  [...document.querySelectorAll("p, li")].map((node) => node.textContent.trim()).join(" | ")

const browser = await Browser.launch({ width: 1440, height: 1000 })
const page = await browser.newPage({ width: 1440, height: 1000 })
await page.goto(`${origin}/`, { settleMs: 1600 })
await sleep(2500)

const first = await page.eval(probe)
record("editor is editable by default", first?.editable === true, `contenteditable=${first?.editable}`)
record("there is no edit button", !(await page.eval(() =>
  [...document.querySelectorAll("button")].some((node) => /edit here|replay/i.test(node.textContent)),
)), "no toggle controls in the hero")

const frames = []
for (let index = 0; index < 24; index += 1) {
  const state = await page.eval(probe)
  if (state) frames.push(state)
  await sleep(90)
}
record(
  "editor sits still when idle",
  new Set(frames.map((state) => state.length)).size === 1,
  `${new Set(frames.map((s) => s.length)).size} distinct sizes over ${frames.length} frames`,
)
record("editor fits its frame", frames.every((state) => state.fitsFrame && state.fitsParent), `${first?.editorHeight}px`)
record("source is scrollable", first?.scrollable === true, `${first?.lines} lines`)

const point = await page.eval(() => {
  const rect = document.querySelector(".cm-content").getBoundingClientRect()
  return { x: Math.round(rect.left + 60), y: Math.round(rect.top + 14) }
})
await page.send("Input.dispatchMouseEvent", { type: "mousePressed", x: point.x, y: point.y, button: "left", clickCount: 1 })
await page.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: point.x, y: point.y, button: "left", clickCount: 1 })
await sleep(400)
record("editor takes focus on click", (await page.eval(probe))?.focused === true, "focused")

const path = []
for (const chunk of ["I", " ", "ship", " ", "it"]) {
  await page.send("Input.insertText", { text: chunk })
  await sleep(180)
  path.push((await page.eval(probe))?.length ?? 0)
}
const lost = path.filter((value, index) => index > 0 && value < path[index - 1]).length
record("typing never rewinds", lost === 0, path.join(" → "))
record("typing grows the buffer", path.at(-1) > path[0], `${path[0]} → ${path.at(-1)}`)
record("document survives typing", path.at(-1) > 700, `${path.at(-1)} chars held`)

await sleep(900)
const afterType = await page.eval(readPreview)
record("name still renders after an edit", afterType.includes("Naina Kumari"), "preview survived")

// paste the full file and assert every section renders
const full = [
  "portfolioVersion: 1",
  "identity:",
  "  name: Naina Kumari",
  "  headline: Backend engineer.",
  "  location: Bengaluru",
  "links:",
  "  - platform: github",
  "    label: github.com/nainakumari",
  "    url: https://github.com/nainakumari",
  "experience:",
  "  - organisation: Razorpay",
  "    role: Software engineering intern",
  "    location: Bengaluru",
  "    start: 2026-04",
  "    end: 2026-09",
  "    summary: Cleared forty thousand crore a month.",
  "    highlights:",
  "      - Rewrote a nightly reconciliation job from 95 minutes to 6",
  "projects:",
  "  - name: Attendance without the queue",
  "    description: Face check-in for the attendance portal.",
  "    tech:",
  "      - Next.js",
  "      - Postgres",
  "education:",
  "  - institution: National Institute of Technology",
  "    degree: B.Tech",
  "    field: Computer Science",
  "    start: '2023'",
  "    end: '2027'",
  "    current: true",
  "    grade: CGPA 9.1",
  "skills:",
  "  - name: Go",
  "  - name: Postgres",
  "    group: backend",
].join("\n")

await page.send("Input.dispatchKeyEvent", { type: "keyDown", key: "a", code: "KeyA", modifiers: 4 })
await page.send("Input.dispatchKeyEvent", { type: "keyUp", key: "a", code: "KeyA", modifiers: 4 })
await sleep(300)
await page.send("Input.insertText", { text: full })
await sleep(1600)

const rendered = await page.eval(readPreview)
const expected = [
  ["identity name", "Naina Kumari"],
  ["headline", "Backend engineer."],
  ["location", "Bengaluru"],
  ["availability", "Available from"],
  ["link label", "github.com/nainakumari"],
  ["experience org", "Razorpay"],
  ["experience role", "Software engineering intern"],
  ["experience summary", "forty thousand crore"],
  ["experience highlight", "95 minutes to 6"],
  ["project name", "Attendance without the queue"],
  ["project description", "Face check-in"],
  ["project tech", "Postgres"],
  ["education institution", "National Institute of Technology"],
  ["education degree", "B.Tech"],
  ["education grade", "CGPA 9.1"],
  ["skill", "Go"],
]
const missing = expected.filter(([, needle]) => !rendered.includes(needle)).map(([label]) => label)
record("preview maps every field in the file", missing.length === 0, missing.length === 0 ? `${expected.length}/${expected.length} fields render` : `missing: ${missing.join(", ")}`)

await page.screenshot({ path: ".taste-skill/editor-check.png" })
await browser.close()

const failed = results.filter((entry) => !entry.pass)
console.log(`\n${results.length - failed.length}/${results.length} passed`)
process.exit(failed.length === 0 ? 0 : 1)