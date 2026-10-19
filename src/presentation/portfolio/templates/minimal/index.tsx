import type { TemplateProps } from "../types"
import { cn } from "@presentation/core/design/cn"
import { minimalStyles } from "./minimal.styles"

import { PreviewAnchor } from "../shared/preview-anchor"
const Minimal = ({ data, showAttribution }: TemplateProps) => (
  <article className={minimalStyles.root}>
    <header>
      <h1 className={minimalStyles.name}>{data.identity.name}</h1>
      {data.identity.headline ? <p className={minimalStyles.headline}>{data.identity.headline}</p> : null}
    </header>

    <span aria-hidden className={minimalStyles.rule} />

    {data.experience.length > 0 ? (
      <section className={minimalStyles.block}>
        <h2 className={minimalStyles.blockTitle}>Experience</h2>
        {data.experience.map((item) => (
          <div className={minimalStyles.project} key={`${item.organisation}-${item.role ?? ""}`}>
            <p className={minimalStyles.projectName}>
              {item.role ? `${item.role}, ${item.organisation}` : item.organisation}
            </p>
            <p className={minimalStyles.muted}>
              {[item.location, item.current ? "Present" : item.end].filter(Boolean).join(" · ")}
            </p>
          </div>
        ))}
      </section>
    ) : null}

    {data.projects.length > 0 ? (
      <section className={minimalStyles.block}>
        <h2 className={minimalStyles.blockTitle}>Projects</h2>
        {data.projects.map((project) => (
          <div className={minimalStyles.project} key={project.name}>
            <p className={minimalStyles.projectName}>{project.name}</p>
            {project.description ? <p className={minimalStyles.muted}>{project.description}</p> : null}
          </div>
        ))}
      </section>
    ) : null}

    {data.education.length > 0 ? (
      <section className={minimalStyles.block}>
        <h2 className={minimalStyles.blockTitle}>Education</h2>
        {data.education.map((item) => (
          <div className={minimalStyles.project} key={item.institution}>
            <p className={minimalStyles.projectName}>{item.institution}</p>
            <p className={minimalStyles.muted}>
              {[item.degree, item.field].filter(Boolean).join(", ")}
            </p>
          </div>
        ))}
      </section>
    ) : null}

    {data.skills.length > 0 ? (
      <section className={minimalStyles.block}>
        <h2 className={minimalStyles.blockTitle}>Skills</h2>
        <ul className={minimalStyles.list}>
          {data.skills.map((skill) => (
            <li key={skill.name}>{skill.name}</li>
          ))}
        </ul>
      </section>
    ) : null}

    {data.links.length > 0 ? (
      <div className={minimalStyles.linkStack}>
        {data.links.map((link) => (
          <PreviewAnchor className={cn(minimalStyles.link, minimalStyles.linkTop)} href={link.url} key={link.platform} rel="noreferrer" target="_blank">
            {link.label ?? link.platform}
          </PreviewAnchor>
        ))}
      </div>
    ) : null}

    {showAttribution ? <footer className={minimalStyles.footer}>Made with love · Market Engineering</footer> : null}
  </article>
)

export const Template = Minimal

export { meta } from "./meta"
