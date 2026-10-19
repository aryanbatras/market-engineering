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
record("builder editor has no line numbers", editor?.gutters === false, `gutters=${editor?.gutters}`)
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
  const stage = document.querySelector(".page-canvas")
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
record("template step needs no confirm button", picker.buttons === 0, `${picker.buttons} confirm buttons`)

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
  const stages = [...document.querySelectorAll(".page-canvas")]
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

const nesting = await page.eval(() => document.querySelectorAll("a a").length)
record("no link nested inside a link", nesting === 0, `nested=${nesting}`)

const portfolioCards = await page.eval(() => {
  const links = [...document.querySelectorAll('a[href^="/builder?template="]')]
  return {
    count: links.length,
    nested: [...document.querySelectorAll('a[href^="/builder?template="] button')].length,
  }
})
record(
  "portfolio gallery card is the button",
  portfolioCards.count >= 5 && portfolioCards.nested === 0,
  `cards=${portfolioCards.count} nested=${portfolioCards.nested}`,
)

await page.goto(`${origin}/start`, { settleMs: 1400 })
await sleep(700)
const start = await page.eval(() => {
  const links = [...document.querySelectorAll("a")]
  const portfolio = links.find((node) => node.getAttribute("href")?.startsWith("/builder"))
  return {
    portfolio: Boolean(portfolio),
    resume: links.some((node) => node.getAttribute("href") === "/resume/templates"),
    portfolioHref: portfolio ? portfolio.getAttribute("href") : null,
    text: document.body.innerText,
  }
})
record("start asks which output first", start.portfolio && start.resume, `portfolio=${start.portfolio} resume=${start.resume}`)
record("start explains both outputs", /Two outputs/.test(start.text) && /portfolio/i.test(start.text) && /resume/i.test(start.text))
record(
  "choosing a portfolio shows the templates, not a default",
  start.portfolioHref === "/builder",
  `href=${start.portfolioHref}`,
)

await page.goto(`${origin}/resume`, { settleMs: 1800 })
await sleep(1400)
const layoutNames = ["Jake's Resume", "Deedy CV", "McDowell", "Awesome CV", "Rover", "Simple Resume", "ModernCV", "IIT Bombay", "AltaCV", "Friggeri"]
const resume = await page.eval((names) => {
  const article = document.querySelector("article")
  const box = article ? article.getBoundingClientRect() : null
  const text = document.body.innerText
  return {
    sheet: Boolean(article),
    width: box ? Math.round(box.width) : 0,
    sheetText: article ? article.innerText.length : 0,
    layouts: names.filter((name) => text.includes(name)).length,
    editor: Boolean(document.querySelector(".cm-content")),
    gutter: Boolean(document.querySelector(".cm-gutters")),
    schema: /Every field/.test(text),
    tex: /Generated LaTeX/.test(text),
    hasPdf: /\bPDF\b/.test(text),
    hasTex: Boolean(text.split("\n").find((line) => line.trim() === ".tex")),
    crossLink: /Make it a portfolio/.test(text),
  }
}, layoutNames)

const openTune = () =>
  page.eval(() => {
    const tune = [...document.querySelectorAll("button")].find((node) =>
      /Size and spacing/.test(node.textContent),
    )
    if (tune) tune.click()
  })

await openTune()
await sleep(700)
const controls = await page.eval(() => {
  const text = document.body.innerText
  const ranges = document.querySelectorAll('input[type="range"]').length
  return {
    font: /Body size/.test(text) && /pt/.test(text),
    gap: /Section gap/.test(text),
    margin: /Page margin/.test(text),
    ranges,
  }
})
await openTune()

record(
  "resume offers continuous size and spacing controls",
  controls.font && controls.gap && controls.margin && controls.ranges >= 5,
  `ranges=${controls.ranges}`,
)

const stacked = await page.eval(() => {
  const labels = [...document.querySelectorAll("span")]
    .map((node) => node.textContent.trim())
    .filter((t) => ["YAML", "Every field", "Generated LaTeX", "Jake's Resume"].includes(t))
  return labels
})
record(
  "full sections lead with YAML and the page",
  stacked.indexOf("YAML") < stacked.lastIndexOf("Jake's Resume") &&
    stacked.indexOf("Every field") > stacked.indexOf("YAML"),
  stacked.join(" > "),
)

record("resume links back to the portfolio", resume.crossLink, `link=${resume.crossLink}`)

await page.eval(() => {
  const picker = [...document.querySelectorAll("button")].find((node) =>
    node.textContent.includes("Jake's Resume") || node.textContent.includes("Change template"),
  )
  if (picker) picker.click()
})
await sleep(600)
await page.eval(() => {
  const item = [...document.querySelectorAll("button")].find((node) =>
    node.textContent.trim().startsWith("AltaCV"),
  )
  if (item) item.click()
})
await sleep(900)
const twoColumn = await page.eval(() => {
  const text = document.body.innerText
  return { warns: /two columns/i.test(text) && /A parser reads one column/i.test(text) }
})
record("two-column layout warns before you pick it", twoColumn.warns, `warning=${twoColumn.warns}`)

await page.eval(() => {
  const view = [...document.querySelectorAll("button")].find((node) => node.textContent.trim() === "View")
  if (view) view.click()
})
await sleep(500)
await page.eval(() => {
  const option = [...document.querySelectorAll("button")].find((node) => node.textContent.trim().startsWith("One screen"))
  if (option) option.click()
})
await sleep(700)
const compact = await page.eval(() => {
  const text = document.body.innerText
  return {
    yaml: text.includes("YAML"),
    guidePane: text.includes("Every field"),
    texPane: text.includes("Generated LaTeX"),
    triggers: document.querySelectorAll("[data-hover-trigger]").length,
    sheets: document.querySelectorAll("article").length,
    screen: document.documentElement.scrollHeight <= window.innerHeight * 1.6,
  }
})
record(
  "compact view shows the YAML and the page",
  compact.yaml && compact.sheets >= 1,
  `yaml=${compact.yaml} sheets=${compact.sheets}`,
)
record(
  "compact view hides the guide and the LaTeX behind a hover",
  !compact.guidePane && !compact.texPane && compact.triggers === 2,
  `guide=${compact.guidePane} tex=${compact.texPane} triggers=${compact.triggers}`,
)
record("compact view fits one screen", compact.screen, `scroll=${compact.screen ? "fits" : "overflows"}`)

await page.goto(`${origin}/resume/templates`, { settleMs: 1800 })
await sleep(1200)
const resumeGallery = await page.eval((names) => {
  const links = [...document.querySelectorAll('a[href^="/resume?layout="]')]
  return {
    sheet: Boolean(document.querySelector("article")),
    layouts: names.filter((name) => document.body.innerText.includes(name)).length,
    heading: /Resume templates/.test(document.body.innerText),
    text: document.body.innerText.length,
    linkedLayouts: links.length,
  }
}, layoutNames)
record("resume gallery is titled correctly", resumeGallery.heading, `titled=${resumeGallery.heading}`)
record("resume gallery lists every layout", resumeGallery.layouts === 10, `${resumeGallery.layouts}/10`)
record("resume gallery previews a real sheet", resumeGallery.sheet && resumeGallery.text > 500, `${resumeGallery.text} chars`)
record(
  "resume gallery layout is the link",
  resumeGallery.linkedLayouts >= 10,
  `links=${resumeGallery.linkedLayouts}`,
)

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

const account = await page.eval(() => {
  const links = [...document.querySelectorAll("a")]
  return {
    settingsLinks: links.filter((node) => node.getAttribute("href") === "/settings").length,
    dashboardButtons: [...document.querySelectorAll("button, a")].filter(
      (node) => node.textContent.trim() === "Dashboard",
    ).length,
    selfLink: links.some((node) => node.getAttribute("href") === "/dashboard"),
  }
})
record("one account surface, no settings route", account.settingsLinks === 0, `settings=${account.settingsLinks}`)
record(
  "the account name is the only way in",
  account.selfLink && account.dashboardButtons === 0,
  `self=${account.selfLink} buttons=${account.dashboardButtons}`,
)
await page.screenshot({ path: ".taste-skill/sign-in-check.png" })

await page.goto(`${origin}/`, { settleMs: 2000 })
await sleep(1600)
await browser.close()

const failed = results.filter((entry) => !entry.pass)
console.log(`\n${results.length - failed.length}/${results.length} passed`)
process.exit(failed.length === 0 ? 0 : 1)