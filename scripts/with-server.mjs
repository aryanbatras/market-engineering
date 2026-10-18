// Boots the production build on :3000 if it is not already up, and tears it down afterwards.
// Shared by the UI checks and the design gate so they never fight over the port.

import { spawn } from "node:child_process"
import { existsSync } from "node:fs"
import { sleep } from "/Users/aryan/.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs"

export const origin = "http://localhost:3000"

const isUp = async () => {
  try {
    const response = await fetch(origin, { signal: AbortSignal.timeout(2500) })
    return response.ok
  } catch {
    return false
  }
}

export const withServer = async (run) => {
  if (await isUp()) return run()

  if (!existsSync(".next/BUILD_ID")) {
    console.error("No production build. Run npm run build first.")
    process.exit(1)
  }

  const server = spawn("npm", ["run", "start"], { stdio: "ignore", detached: true })
  for (let attempt = 0; attempt < 40; attempt += 1) {
    await sleep(500)
    if (await isUp()) break
  }
  if (!(await isUp())) {
    console.error("Server did not come up on " + origin)
    process.exit(1)
  }

  try {
    return await run()
  } finally {
    try {
      process.kill(-server.pid)
    } catch {
      server.kill()
    }
  }
}