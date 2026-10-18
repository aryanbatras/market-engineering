#!/usr/bin/env node
// Template previews must fit their frame by width at every breakpoint, never clip, and stay
// scrollable by height.
//
//   node scripts/preview-fit-check.mjs [origin]

import { Browser, sleep } from "/Users/aryan/.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs"

const origin = process.argv[2] ?? "http://localhost:3000"
const widths = [1440, 1280, 1024, 768, 390]
const results = []
const record = (name, pass, detail) => {
  results.push({ name, pass, detail })
  console.log(`${pass ? "PASS" : "FAIL"}  ${name.padEnd(38)} ${detail}`)
}

const measure = () => {
  const frames = [...document.querySelectorAll("[data-template]")]
  return frames.map((frame) => {
    const stage = frame.querySelector(".stage-canvas")
    const canvas = frame.querySelector(".page-canvas")
    if (!stage || !canvas) return { id: frame.dataset.template, missing: true }
    const stageBox = stage.getBoundingClientRect()
    const canvasBox = canvas.getBoundingClientRect()
    return {
      id: frame.dataset.template,
      stageWidth: Math.round(stageBox.width),
      canvasWidth: Math.round(canvasBox.width),
      overflowX: Math.round(canvasBox.width - stageBox.width),
      scrollableY: stage.scrollHeight > stage.clientHeight + 1,
      frameHeight: Math.round(frame.getBoundingClientRect().height),
      canvasHeight: Math.round(canvasBox.height),
      text: canvas.innerText.length,
    }
  })
}

const browser = await Browser.launch({ width: 1440, height: 1000 })
const page = await browser.newPage({ width: 1440, height: 1000 })

for (const path of ["/templates", "/"]) {
  for (const width of widths) {
    await page.setViewport({ width, height: 1000 })
    await page.goto(`${origin}${path}`, { settleMs: 1600 })
    await sleep(1400)
    const frames = await page.eval(measure)
    const real = frames.filter((frame) => !frame.missing)
    const clipped = real.filter((frame) => frame.overflowX > 1)
    const scrollable = real.filter((frame) => frame.scrollableY).length
    record(
      `${path} @${width} previews fit by width`,
      clipped.length === 0 && real.length > 0,
      real.length === 0
        ? "no previews found"
        : clipped.length === 0
          ? `${real.length} previews, widest ${Math.max(...real.map((f) => f.canvasWidth))}px`
          : `${clipped.map((f) => `${f.id}+${f.overflowX}px`).join(", ")} clipped`,
    )
    if (path === "/templates" && width === 1440) {
      record(
        "previews are never cut off",
        real.every((frame) => frame.scrollableY || frame.canvasHeight <= frame.frameHeight),
        `${scrollable}/${real.length} scroll, the rest fit whole`,
      )
      record(
        "previews render real content",
        real.every((frame) => frame.text > 200),
        `${real.length} previews with text`,
      )
    }
  }
}

await page.setViewport({ width: 1440, height: 1000 })
await page.goto(`${origin}/templates`, { settleMs: 1600 })
await sleep(1600)
await page.screenshot({ path: ".taste-skill/preview-fit.png" })
await browser.close()

const failed = results.filter((entry) => !entry.pass)
console.log(`\n${results.length - failed.length}/${results.length} passed`)
process.exit(failed.length === 0 ? 0 : 1)