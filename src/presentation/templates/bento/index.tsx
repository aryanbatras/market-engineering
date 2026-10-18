import type { TemplateProps } from "../types"
import { cn } from "@presentation/design/cn"
import { ExternalLink } from "../shared/atoms"
import { bentoStyles } from "./bento.styles"

const featured = (count: number): number => Math.min(count, 3)

const Bento = ({ data, showAttribution }: TemplateProps) => {
  const top = featured(data.projects.length)
  const rest = data.projects.slice(top)

  return (
    <article className={bentoStyles.root}>
      <div className={bentoStyles.grid}>
        <header className={cn(bentoStyles.tile, bentoStyles.tileWide, bentoStyles.tileTall)}>
          <h1 className={bentoStyles.name}>{data.identity.name}</h1>
          {data.identity.headline ? (
            <p className={cn(bentoStyles.headline, bentoStyles.gapTop)}>{data.identity.headline}</p>
          ) : null}
        </header>

        <div className={cn(bentoStyles.tileAccent, bentoStyles.tileHalf, bentoStyles.tileTall)}>
          <p className={cn(bentoStyles.tileTitleOnAccent)}>
            {data.identity.availability ?? data.identity.headline ?? "Open to work"}
          </p>
          {data.identity.location ? <p className={cn(bentoStyles.tileBodyOnAccent, bentoStyles.gapTop)}>{data.identity.location}</p> : null}
          <div className={cn(bentoStyles.gapWide, bentoStyles.linkStack)}>
            {data.links.map((link) => (
              <a
                className={bentoStyles.tileBodyOnAccent}
                href={link.url}
                key={link.platform}
                rel="noreferrer"
                target="_blank"
              >
                {link.label ?? link.platform}
              </a>
            ))}
          </div>
        </div>

        {data.projects.slice(0, top).map((project, index) => (
          <div
            className={cn(bentoStyles.tile, index === 0 ? bentoStyles.tileWide : bentoStyles.tileHalf)}
            key={project.name}
          >
            {project.timeline ? (
              <p className={bentoStyles.eyebrow}>{project.timeline}</p>
            ) : null}
            <p className={cn(bentoStyles.tileTitle, bentoStyles.gapTight)}>{project.name}</p>
            {project.description ? (
              <p className={cn(bentoStyles.tileBody, bentoStyles.gapTop)}>{project.description}</p>
            ) : null}
            {project.tech.length > 0 ? (
              <ul className={cn(bentoStyles.tagRow, bentoStyles.gapTop)}>
                {project.tech.map((tech) => (
                  <li className={bentoStyles.tag} key={tech}>
                    {tech}
                  </li>
                ))}
              </ul>
            ) : null}
            {project.url || project.repo ? (
              <div className={cn(bentoStyles.gapSoft, bentoStyles.linkStack)}>
                {project.url ? <ExternalLink href={project.url}>Live project</ExternalLink> : null}
                {project.repo ? <ExternalLink href={project.repo}>Source</ExternalLink> : null}
              </div>
            ) : null}
          </div>
        ))}

        {rest.length > 0 ? (
          <div className={cn(bentoStyles.tile, bentoStyles.tileFull)}>
            <p className={bentoStyles.eyebrow}>Also built</p>
            <ul className={cn(bentoStyles.gapMid, bentoStyles.alsoGrid)}>
              {rest.map((project) => (
                <li key={project.name}>
                  <p className={bentoStyles.projectName}>{project.name}</p>
                  {project.description ? (
                    <p className={cn(bentoStyles.projectBody, bentoStyles.gapTight)}>{project.description}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {data.experience.length > 0 ? (
          <div className={cn(bentoStyles.tile, bentoStyles.tileFull)}>
            <p className={bentoStyles.eyebrow}>Experience</p>
            <ul className={cn(bentoStyles.gapMid, bentoStyles.listStack)}>
              {data.experience.map((item) => (
                <li key={`${item.organisation}-${item.role ?? ""}`}>
                  <p className={bentoStyles.projectName}>
                    {item.role ? `${item.role}, ${item.organisation}` : item.organisation}
                  </p>
                  <p className={bentoStyles.eyebrow}>
                    {[item.location, item.current ? "Present" : item.end].filter(Boolean).join(" · ")}
                  </p>
                  {item.summary ? <p className={cn(bentoStyles.projectBody, bentoStyles.gapTight)}>{item.summary}</p> : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {data.education.length > 0 ? (
          <div className={cn(bentoStyles.tile, bentoStyles.tileHalf)}>
            <p className={bentoStyles.eyebrow}>Education</p>
            <ul className={cn(bentoStyles.gapMid, bentoStyles.listStack)}>
              {data.education.map((item) => (
                <li key={item.institution}>
                  <p className={bentoStyles.projectName}>{item.institution}</p>
                  <p className={bentoStyles.eyebrow}>
                    {[item.degree, item.field, item.grade].filter(Boolean).join(" · ")}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {data.skills.length > 0 ? (
          <div className={cn(bentoStyles.tile, bentoStyles.tileHalf)}>
            <p className={bentoStyles.eyebrow}>Skills</p>
            <ul className={cn(bentoStyles.skillRow, bentoStyles.gapTop)}>
              {data.skills.map((skill) => (
                <li key={skill.name}>{skill.name}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {showAttribution ? <footer className={bentoStyles.footer}>Made with love · Market Engineering</footer> : null}
    </article>
  )
}

export const Template = Bento

export { meta } from "./meta"
