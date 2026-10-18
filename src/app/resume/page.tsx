import type { Metadata } from "next"
import { ResumeEditorRoute } from "@presentation/resume/editor/resume-editor"

export const metadata: Metadata = {
  title: "Resume builder",
  description: "The same data as your portfolio, typeset as a document a parser can read.",
}

export default function ResumePage() {
  return <ResumeEditorRoute />
}