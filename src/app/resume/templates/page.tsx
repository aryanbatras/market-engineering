import type { Metadata } from "next"
import { ResumeGallery } from "@presentation/resume/gallery/resume-gallery"

export const metadata: Metadata = {
  title: "Resume layouts",
  description: "Ten typeset resume layouts, previewed with a real resume.",
}

export default function ResumeTemplatesPage() {
  return <ResumeGallery />
}