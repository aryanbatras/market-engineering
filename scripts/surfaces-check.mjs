#!/usr/bin/env node
// Behavioural check for the builder, the templates gallery and the sign-in mock.
//
//   node scripts/surfaces-check.mjs [origin]

import { Browser, sleep } from "/Users/aryan/.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs"

const origin = process.argv[2] ?? "http://localhost:3000"
const results = []
const record = (name, pass, detail) => {
  results.push({ name, pass, detail })
  console.log(`${pass ? "PASS" : "FAIL"}  ${name.padEnd(38)} ${detail}`)
}

const editorProbe = () => {
  const scroller = document.querySelector(".cm-scroller")
  const content = document.querySelector(".cm-content")
  if (!scroller || !content) return null
  return {
    length: content.textContent.length,
    lines: document.querySelectorAll(".cm-line").length,
    gutters: document.querySelectorAll(".cm-gutters").length > 0,
    scrollable: scroller.scrollHeight > scroller.clientHeight + 1,
    maxScroll: scroller.scrollHeight - scroller.clientHeight,
  }
}

const browser = await Browser.launch({ width: 1440, height: 1000 })
const page = await browser.newPage({ width: 1440, height: 1000 })

await page.goto(`${origin}/builder?template=bento`, { settleMs: 1600 })
await sleep(900)

const editor = await page.eval(editorProbe)
record("builder editor opens", editor !== null, editor ? `${editor.lines} lines` : "no editor")
record("builder editor is scrollable", editor?.scrollable === true, `${editor?.maxScroll}px of overflow`)
record("builder editor has line numbers", editor?.gutters === true, `gutters=${editor?.gutters}`)
record("builder editor fits", (editor?.length ?? 0) > 800, `${editor?.length} chars loaded`)

const crumb = await page.eval(() => document.body.innerText.includes("Bento"))
record("?template= persists on load", crumb, "landed on the edit step with Bento")

const nav = await page.eval(() => {
  const home = [...document.querySelectorAll("a")].some((node) => node.getAttribute("href") === "/")
  return { home, header: Boolean(document.querySelector("header")) }
})
record("builder has a nav home link", nav.home, JSON.stringify(nav))

const point = await page.eval(() => {
  const rect = document.querySelector(".cm-content").getBoundingClientRect()
  return { x: Math.round(rect.left + 80), y: Math.round(rect.top + 14) }
})
await page.send("Input.dispatchMouseEvent", { type: "mousePressed", x: point.x, y: point.y, button: "left", clickCount: 1 })
await page.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: point.x, y: point.y, button: "left", clickCount: 1 })
await sleep(300)

const typedPath = []
for (const chunk of ["a", " ", "b", " ", "c"]) {
  await page.send("Input.insertText", { text: chunk })
  await sleep(160)
  typedPath.push((await page.eval(editorProbe))?.length ?? 0)
}
const regressed = typedPath.filter((value, index) => index > 0 && value < typedPath[index - 1]).length
record("builder typing never rewinds", regressed === 0, typedPath.join(" → "))
record("builder typing grows", typedPath.at(-1) > typedPath[0], `${typedPath[0]} → ${typedPath.at(-1)}`)

const preview = await page.eval(() => {
  const stage = document.querySelector('[class*="origin-top-left"]')
  if (!stage) return null
  const box = stage.getBoundingClientRect()
  return { width: Math.round(box.width), height: Math.round(box.height), text: stage.innerText.length }
})
record("builder renders a live preview", (preview?.text ?? 0) > 100, JSON.stringify(preview))

await page.goto(`${origin}/builder`, { settleMs: 1400 })
await sleep(900)
const picker = await page.eval(() => ({
  cards: document.querySelectorAll("[data-template]").length,
  buttons: [...document.querySelectorAll("button")].filter((node) => /^Use /.test(node.textContent.trim())).length,
}))
record("template step lists every template", picker.cards >= 5, `${picker.cards} previews`)
record("template step has a confirm button", picker.buttons === 1, `${picker.buttons} confirm button`)

const chosen = await page.eval(() => {
  const slots = [...document.querySelectorAll("button > div")]
  const immersive = slots.find((node) => node.textContent.includes("Immersive"))
  if (!immersive) return false
  immersive.closest("button").click()
  return true
})
await sleep(500)
const confirmed = await page.eval(() => {
  const button = [...document.querySelectorAll("button")].find((node) => /^Use /.test(node.textContent.trim()))
  if (!button) return null
  button.click()
  return button.textContent.trim()
})
await sleep(1200)
const routed = await page.eval(() => ({ search: location.search, editor: Boolean(document.querySelector(".cm-content")) }))
record("picking a template routes", chosen && Boolean(confirmed), `${confirmed}`)
record(
  "?template= is in the URL",
  /[?&]template=immersive/.test(routed.search) && routed.editor,
  `${routed.search} editor=${routed.editor}`,
)

await page.goto(routed.search ? `${origin}/builder${routed.search}` : `${origin}/builder`, { settleMs: 1600 })
await sleep(1200)
const afterReload = await page.eval(() => ({
  search: location.search,
  editor: Boolean(document.querySelector(".cm-content")),
  crumb: document.body.innerText.includes("Immersive"),
}))
record(
  "refresh keeps the step",
  afterReload.editor && afterReload.crumb,
  `${afterReload.search} editor=${afterReload.editor}`,
)

await page.goto(`${origin}/templates`, { settleMs: 1600 })
await sleep(1400)
const gallery = await page.eval(() => {
  const stages = [...document.querySelectorAll('[class*="origin-top-left"]')]
  return {
    count: stages.length,
    zoomed: stages.every((stage) => stage.getBoundingClientRect().height > 0),
    names: document.body.innerText.split("\n").filter((line) => ["Classic", "Bento", "Editorial", "Minimal", "Immersive"].includes(line.trim())).length,
    saysFive: /five templates/i.test(document.body.innerText),
  }
})
record("templates page previews every template", gallery.count >= 5, `${gallery.count} live previews`)
record("templates page previews are sized", gallery.zoomed, JSON.stringify({ count: gallery.count, names: gallery.names }))
record("templates page avoids the word five", !gallery.saysFive, `matches=${gallery.saysFive}`)

await page.goto(`${origin}/sign-in`, { settleMs: 1400 })
await sleep(700)
const signIn = await page.eval(() => {
  const buttons = [...document.querySelectorAll("button")].map((node) => node.textContent.trim())
  return {
    mocked: buttons.some((label) => /mocked/i.test(label)),
    providers: buttons.filter((label) => /github|google/i.test(label)).length,
    note: document.body.innerText.includes("localStorage"),
  }
})
record("sign-in page offers a mocked session", signIn.mocked, `providers=${signIn.providers}`)
record("sign-in page explains the mock", signIn.note, "states that nothing leaves the browser")

const clicked = await page.eval(() => {
  const button = [...document.querySelectorAll("button")].find((node) => /mocked/i.test(node.textContent))
  if (!button) return false
  button.click()
  return true
})
record("sign-in button is clickable", clicked, "found the mock provider")
await sleep(1800)
const landed = await page.eval(() => ({ path: location.pathname, text: document.body.innerText.slice(0, 200) }))
record("sign-in lands on the dashboard", landed.path === "/dashboard", landed.path)
await page.screenshot({ path: ".taste-skill/sign-in-check.png" })

await browser.close()

const failed = results.filter((entry) => !entry.pass)
console.log(`\n${results.length - failed.length}/${results.length} passed`)
process.exit(failed.length === 0 ? 0 : 1)