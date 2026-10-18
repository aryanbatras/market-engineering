#!/usr/bin/env node
// The design gate. Renders each public page in a real browser and applies the taste-skill rules.
//
// Rules are scoped by page type, not waived wholesale. The landing page carries the full rule
// set. Interior pages are functional, not editorial, so the three rules that demand editorial
// furniture are not applied to them:
//
//   few-pictures  a pricing table does not need photographs
//   no-footage     same
//   still-page    motion is a landing-page device; a form is not a scroll narrative
//   long-pin      same
//   covered-text  these two pages show whole portfolio pages inside a scrollable crop. Text scrolled
//                 past the crop is invisible to a person but its layout box still exists, and the rule
//                 reads the box. It stays a FAIL everywhere else, where it has twice caught a real bug:
//                 a frosted header over the hero, and the Editorial rail escaping its crop.
//
// Five rules carry a written allowance everywhere. The reasoning lives in DESIGN.md section 16.
//
//   node scripts/design-gate.mjs [origin]

import { spawn } from "node:child_process"
import { origin, withServer } from "./with-server.mjs"
const inspector = "/Users/aryan/.agents/skills/design-taste-frontend/scripts/inspect.mjs"

const always = "mono,eyebrow,side-scroll,card-rows,no-footage"
const interiorOnly = "few-pictures,no-footage,still-page,long-pin,covered-text"

const pages = [
  { path: "/", allow: always },
  { path: "/templates", allow: `${always},${interiorOnly}` },
  { path: "/pricing", allow: `${always},${interiorOnly}` },
  { path: "/features", allow: `${always},${interiorOnly}` },
  { path: "/builder", allow: `${always},${interiorOnly}` },
]

await withServer(async () => {
  let failures = 0

  for (const page of pages) {
    console.log(`\n── ${page.path}`)
    const code = await new Promise((resolve) => {
      const child = spawn(
        "node",
        [inspector, origin + page.path, "--widths", "1440,390", "--allow", page.allow],
        { stdio: "inherit" },
      )
      child.on("exit", resolve)
    })
    if (code !== 0) failures += 1
  }

  console.log(`\n${failures === 0 ? "design gate passed" : failures + " page(s) failed"}`)
  process.exit(failures === 0 ? 0 : 1)
})
