#!/usr/bin/env node
// Runs the browser checks against a production build. Starts the server if it is not already up,
// then runs every check in scripts/.
//
//   npm run ui:verify

import { spawn } from "node:child_process"
import { origin, withServer } from "./with-server.mjs"

const checks = [
  "./scripts/editor-flicker-check.mjs",
  "./scripts/preview-fit-check.mjs",
  "./scripts/surfaces-check.mjs",
]

await withServer(async () => {
  let failures = 0

  for (const check of checks) {
    console.log("\n── " + check)
    const code = await new Promise((resolve) => {
      const child = spawn("node", [check, origin], { stdio: "inherit" })
      child.on("exit", resolve)
    })
    if (code !== 0) failures += 1
  }

  console.log(`\n${failures === 0 ? "all checks passed" : failures + " check file(s) failed"}`)
  process.exit(failures === 0 ? 0 : 1)
})