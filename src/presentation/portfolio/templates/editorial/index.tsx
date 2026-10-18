import { cn } from "@presentation/core/design/cn"
import type { TemplateProps } from "../types"
import { editorialStyles } from "./editorial.styles"

const sections = [
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
]

const Editorial = ({ data, showAttribution }: TemplateProps) => (
  <article className={editorialStyles.root}>
    <div className={editorialStyles.rail}>
      <div>
        <p className={editorialStyles.railName}>{data.identity.name}</p>
        {data.identity.headline ? <p className={editorialStyles.railHeadline}>{data.identity.headline}</p> : null}
      </div>
      <nav className={editorialStyles.railNav}>
        {sections.map((section, index) => (
          <a
            className={cn(editorialStyles.railLink, index === 0 && editorialStyles.railActive)}
            href={`#${section.id}`}
            key={section.id}
          >
            {section.label}
          </a>
        ))}
      </nav>
      {data.identity.location ? <p className={editorialStyles.railHeadline}>{data.identity.location}</p> : null}
    </div>

    <div className={editorialStyles.content}>
      <header>
        <h1 className={editorialStyles.display}>{data.identity.name}</h1>
        {data.identity.headline ? <p className={editorialStyles.headline}>{data.identity.headline}</p> : null}
        {data.links.length > 0 ? (
          <div className={editorialStyles.linkRow}>
            {data.links.map((link) => (
              <a
                className={editorialStyles.link}
                href={link.url}
                key={link.platform}
                rel="noreferrer"
                target="_blank"
              >
                {link.label ?? link.platform}
              </a>
            ))}
          </div>
        ) : null}
      </header>

      {data.experience.length > 0 ? (
        <section className={editorialStyles.block} id="work">
          <h2 className={editorialStyles.blockTitle}>Where I have worked</h2>
          {data.experience.map((item) => (
            <div key={`${item.organisation}-${item.role ?? ""}`}>
              <h3 className={editorialStyles.entryTitle}>
                {item.role ? `${item.role}, ${item.organisation}` : item.organisation}
              </h3>
              <p className={editorialStyles.entryMeta}>
                {[item.location, item.current ? "Present" : item.end].filter(Boolean).join(" · ")}
              </p>
              {item.summary ? <p className={editorialStyles.entryBody}>{item.summary}</p> : null}
            </div>
          ))}
        </section>
      ) : null}

      {data.projects.length > 0 ? (
        <section className={editorialStyles.block} id="projects">
          <h2 className={editorialStyles.blockTitle}>What I have built</h2>
          <div className={editorialStyles.projectGrid}>
            {data.projects.map((project) => (
              <article key={project.name}>
                <h3 className={editorialStyles.entryTitle}>{project.name}</h3>
                {project.timeline ? <p className={editorialStyles.entryMeta}>{project.timeline}</p> : null}
                {project.description ? <p className={editorialStyles.entryBody}>{project.description}</p> : null}
                {project.tech.length > 0 ? (
                  <ul className={editorialStyles.tagRow}>
                    {project.tech.map((tech) => (
                      <li className={editorialStyles.tag} key={tech}>
                        {tech}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {data.education.length > 0 ? (
        <section className={editorialStyles.block} id="education">
          <h2 className={editorialStyles.blockTitle}>Education</h2>
          {data.education.map((item) => (
            <div key={item.institution}>
              <h3 className={editorialStyles.entryTitle}>{item.institution}</h3>
              <p className={editorialStyles.entryMeta}>
                {[item.degree, item.field, item.current ? "Present" : item.end].filter(Boolean).join(" · ")}
              </p>
            </div>
          ))}
        </section>
      ) : null}

      {data.skills.length > 0 ? (
        <section className={editorialStyles.block} id="skills">
          <h2 className={editorialStyles.blockTitle}>Skills</h2>
          <p className={editorialStyles.blockBody}>
            {data.skills.map((skill) => skill.name).join(" · ")}
          </p>
        </section>
      ) : null}

      {showAttribution ? <footer className={editorialStyles.footer}>Made with love · Market Engineering</footer> : null}
    </div>
  </article>
)

export const Template = Editorial

export { meta } from "./meta"
