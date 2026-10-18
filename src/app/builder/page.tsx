import type { Metadata } from "next"
import { Builder } from "@presentation/portfolio/builder/builder"

export const metadata: Metadata = {
  title: "Portfolio builder",
  description: "Paste your data, pick a template, publish at your own URL.",
  robots: { index: false, follow: false },
}

const BuilderPage = () => <Builder />

export default BuilderPage
