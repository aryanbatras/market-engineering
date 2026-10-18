import type { Metadata } from "next"
import { OutputChoice } from "@presentation/core/brand/output-choice"

export const metadata: Metadata = {
  title: "Start building",
  description: "Pick what you want first. A portfolio site, a typeset resume, or both from the same data.",
  robots: { index: false, follow: false },
}

const StartPage = () => <OutputChoice />

export default StartPage