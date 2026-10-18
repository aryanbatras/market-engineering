import Link from "next/link"
import { cn } from "@presentation/design/cn"
import { templatesStyles } from "./home-sections.styles"

const templates = [
  {
    name: "Classic",
    tag: "Free",
    span: "md:col-span-5",
    projects: [
      { name: "Ledger for a canteen that runs on IOU", body: "A card scan, a ledger, and a number everyone can check." },
      { name: "Rate limiter that survived load testing", body: "A token bucket in Redis, written to learn how it fails." },
    ],
  },
  {
    name: "Bento",
    tag: "Free",
    span: "md:col-span-7",
    projects: [
      { name: "Query cost dashboard", body: "Finds the slow query hiding behind a dashboard nobody owned." },
      { name: "A tiny search engine", body: "Inverted index, BM25, about 900 lines. Not fast. Understandable." },
      { name: "Mess menu, without the group chat chaos", body: "Reads the canteen board, posts it once." },
      { name: "First-year Arduino lamp", body: "It blinks. It is still my favourite thing I built." },
    ],
  },
]

export const TemplatesSection = () => (
  <>
    <h2 className={templatesStyles.heading}>Templates that do not look alike</h2>
    <p className={templatesStyles.body}>
      A recruiter who has seen three of ours should be able to tell them apart from the layout alone. That is
      the bar each one has to clear.
    </p>
    <div className={templatesStyles.grid}>
      {templates.map((template) => (
        <div className={cn(templatesStyles.card, template.span)} key={template.name}>
          <div className={templatesStyles.cardHead}>
            <span className={templatesStyles.cardName}>{template.name}</span>
            <span className={templatesStyles.cardTag}>{template.tag}</span>
          </div>
          <div className={templatesStyles.cardBody}>
            {template.projects.map((project) => (
              <div key={project.name}>
                <p className={templatesStyles.projectName}>{project.name}</p>
                <p className={templatesStyles.projectBody}>{project.body}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    <Link className={templatesStyles.more} href="/templates">
      See all templates
    </Link>
  </>
)