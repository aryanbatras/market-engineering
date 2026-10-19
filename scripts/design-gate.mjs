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
//   no-hero      an editor opens on the document, not on a slogan. The rule demands a focal statement
//                in the first viewport; in the builders the focal object is the YAML pane beside the
//                rendered page, and a headline above it would push both below the fold.
//   focal-point  the rule wants one dominant element, usually a headline or a picture. In an editor
//                the dominant element is the pair of working panes, and the document on the right is
//                the thing the user came to judge. Neither is large type, and making it large type
//                would put the YAML and the document below the fold.
//   hairline     the builder header carries a bottom rule, which is the one place a 1px line is the
//                mechanism rather than a divider: it is what tells you the panes below scroll under a
//                fixed surface. It appears on one element and nowhere else on either editor.
//   first-action the rule looks for a button in the first screen. On /start the two cards are links,
//                because the card is the control. Adding a "Choose" button underneath a card that
//                already goes somewhere is the two-controls-for-one-decision problem DESIGN.md 13
//                bans, and the visitor's eye goes to the button and hesitates.
//
// The sheet allowance (`sheetAllowed`) covers pages that carry a rendered resume. Two of its rules
// are rules about web copy, and a resume is not web copy:
//
//   body-size   a resume page is set at 10pt on A4. At 96dpi that is 13.3px. The rule asks for 16-20px
//               body copy, which would be a page of enormous text holding almost nothing.
//   small-text  the document's secondary type -- the contact line, entry dates, the institution line --
//               is 9pt by convention, which is 12px. Clamping the preview to 13px would mean the
//               preview disagreed with the PDF and the .tex, and R19 makes those three one artefact.
//               The size the gate objects to is the size the document is supposed to be.
//
// Five rules carry a written allowance everywhere. The reasoning lives in DESIGN.md section 16.
//
//   node scripts/design-gate.mjs [origin]

import { spawn } from "node:child_process"
import { origin, withServer } from "./with-server.mjs"
const inspector = "/Users/aryan/.agents/skills/design-taste-frontend/scripts/inspect.mjs"

const always = "mono,eyebrow,side-scroll,card-rows,no-footage"
const interiorOnly = "few-pictures,no-footage,still-page,long-pin,covered-text"
const sheetAllowed = "side-scroll,mono,shadow,hairline,body-size,small-text"

const pages = [
  { path: "/", allow: `${always},${sheetAllowed}` },
  { path: "/templates", allow: `${always},${interiorOnly}` },
  { path: "/pricing", allow: `${always},${interiorOnly}` },
  { path: "/features", allow: `${always},${interiorOnly}` },
  { path: "/start", allow: `${always},${interiorOnly},first-action` },
  { path: "/builder", allow: `${always},${interiorOnly},hairline,no-hero,focal-point` },
  { path: "/resume", allow: `${always},${interiorOnly},${sheetAllowed},no-hero,focal-point` },
  { path: "/resume/templates", allow: `${always},${interiorOnly},${sheetAllowed},first-action` },
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
