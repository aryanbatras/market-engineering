import type { TemplateProps } from "../types"
import { Attribution, Avatar, ContactLine, PlatformLinks, TagRow } from "../shared/atoms"
import { classicStyles } from "./classic.styles"

const Classic = ({ data, showAttribution }: TemplateProps) => (
  <article className={classicStyles.root}>
    <header className={classicStyles.header}>
      <div className={classicStyles.headerRow}>
        <div>
          <h1 className={classicStyles.name}>{data.identity.name}</h1>
        </div>
        <Avatar name={data.identity.name} photo={data.identity.photo} />
      </div>
      {data.identity.headline ? <p className={classicStyles.headline}>{data.identity.headline}</p> : null}
      <ContactLine portfolio={data} />
      <PlatformLinks portfolio={data} />
    </header>

    {data.experience.length > 0 ? (
      <section className={classicStyles.section}>
        <h2 className={classicStyles.sectionTitle}>Experience</h2>
        {data.experience.map((item) => (
          <div className={classicStyles.entry} key={`${item.organisation}-${item.role ?? ""}`}>
            <p className={classicStyles.entryHead}>
              {item.role ? `${item.role}, ${item.organisation}` : item.organisation}
            </p>
            <p className={classicStyles.entryMeta}>
              {[item.location, item.current ? "Present" : item.end].filter(Boolean).join(" · ")}
            </p>
            {item.summary ? <p className={classicStyles.entryBody}>{item.summary}</p> : null}
            {item.highlights.length > 0 ? (
              <ul className={classicStyles.highlightList}>
                {item.highlights.map((line) => (
                  <li className={classicStyles.highlightItem} key={line}>
                    <span aria-hidden className={classicStyles.highlightMark} />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </section>
    ) : null}

    {data.projects.length > 0 ? (
      <section className={classicStyles.section}>
        <h2 className={classicStyles.sectionTitle}>Projects</h2>
        {data.projects.map((project) => (
          <div className={classicStyles.project} key={project.name}>
            <p className={classicStyles.projectTitle}>{project.name}</p>
            {project.timeline ? <p className={classicStyles.entryMeta}>{project.timeline}</p> : null}
            {project.description ? <p className={classicStyles.entryBody}>{project.description}</p> : null}
            <TagRow items={project.tech} />
          </div>
        ))}
      </section>
    ) : null}

    {data.education.length > 0 ? (
      <section className={classicStyles.section}>
        <h2 className={classicStyles.sectionTitle}>Education</h2>
        {data.education.map((item) => (
          <div className={classicStyles.entry} key={item.institution}>
            <p className={classicStyles.entryHead}>
              {[item.degree, item.field].filter(Boolean).join(", ") || item.institution}
            </p>
            <p className={classicStyles.entryMeta}>
              {[item.institution, item.current ? "Present" : item.end].filter(Boolean).join(" · ")}
            </p>
          </div>
        ))}
      </section>
    ) : null}

    {data.skills.length > 0 ? (
      <section className={classicStyles.section}>
        <h2 className={classicStyles.sectionTitle}>Skills</h2>
        <ul className={classicStyles.skills}>
          {data.skills.map((skill) => (
            <li className={classicStyles.skillItem} key={skill.name}>
              {skill.name}
            </li>
          ))}
        </ul>
      </section>
    ) : null}

    {data.highlights.length > 0 ? (
      <section className={classicStyles.section}>
        <h2 className={classicStyles.sectionTitle}>Also</h2>
        <ul className={classicStyles.highlightList}>
          {data.highlights.map((line) => (
            <li className={classicStyles.highlightItem} key={line}>
              <span aria-hidden className={classicStyles.highlightMark} />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </section>
    ) : null}

    <Attribution visible={showAttribution} />
  </article>
)

export const Template = Classic

export { meta } from "./meta"
