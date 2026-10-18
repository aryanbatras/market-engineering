"use client"

import { useRef } from "react"
import { LuArrowDown } from "react-icons/lu"
import type { TemplateProps } from "../types"
import { cn } from "@presentation/design/cn"
import { useScrollDepth } from "./scroll-depth"
import { immersiveStyles } from "./immersive.styles"

const tickerItems = (values: string[]): string[] =>
  values.length > 0 ? [...values, ...values] : []

const Immersive = ({ data, showAttribution }: TemplateProps) => {
  const heroRef = useRef<HTMLElement | null>(null)
  const auraRef = useRef<HTMLDivElement | null>(null)

  useScrollDepth({ heroRef, auraRef })

  const ticker = tickerItems(data.skills.map((skill) => skill.name))
  const firstName = data.identity.name.split(" ")[0] ?? data.identity.name
  const restName = data.identity.name.slice(firstName.length).trim()

  return (
    <article className={immersiveStyles.root}>
      <div aria-hidden className={immersiveStyles.field}>
        <div className={immersiveStyles.fieldAura} ref={auraRef} />
        <div className={immersiveStyles.fieldAuraAlt} />
      </div>

      <header className={immersiveStyles.header}>
        <p className={immersiveStyles.wordmark}>{data.identity.name}</p>
        {data.identity.availability ? (
          <p className={immersiveStyles.availability}>{data.identity.availability}</p>
        ) : null}
      </header>

      <section className={immersiveStyles.hero} ref={heroRef}>
        <p className={immersiveStyles.kicker}>{data.identity.headline ?? "Portfolio"}</p>
        <h1 className={immersiveStyles.name}>
          <span className={immersiveStyles.lineWrap}>
            <span className={immersiveStyles.lineInner} data-line>
              {firstName}
            </span>
          </span>
          {restName.length > 0 ? (
            <span className={immersiveStyles.lineWrap}>
              <span className={immersiveStyles.lineInner} data-line>
                {restName}
              </span>
            </span>
          ) : null}
        </h1>

        {data.identity.headline ? (
          <p className={immersiveStyles.headline}>{data.identity.headline}</p>
        ) : null}

        {data.links.length > 0 ? (
          <div className={immersiveStyles.actionRow}>
            {data.links.map((link) => (
              <a className={immersiveStyles.link} href={link.url} key={link.platform} rel="noreferrer" target="_blank">
                {link.label ?? link.platform}
              </a>
            ))}
          </div>
        ) : null}

        <p className={immersiveStyles.scrollHint}>
          <LuArrowDown aria-hidden size={14} strokeWidth={1.5} />
        </p>
      </section>

      {ticker.length > 0 ? (
        <div aria-hidden className={immersiveStyles.tickerWrap}>
          <div className={immersiveStyles.ticker}>
            {ticker.map((item, index) => (
              <span className={immersiveStyles.tickerItem} key={`${item}-${index}`}>
                {item}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {data.projects.length > 0 ? (
        <section className={immersiveStyles.section}>
          <h2 className={immersiveStyles.sectionTitle}>Selected work</h2>
          <div className={immersiveStyles.projectGrid}>
            {data.projects.map((project) => (
              <article className={immersiveStyles.projectCard} key={project.name}>
                <h3 className={immersiveStyles.projectName}>{project.name}</h3>
                {project.description ? (
                  <p className={immersiveStyles.projectBody}>{project.description}</p>
                ) : null}
                {project.tech.length > 0 ? (
                  <ul className={immersiveStyles.tagRow}>
                    {project.tech.map((tech) => (
                      <li className={immersiveStyles.tag} key={tech}>
                        {tech}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <p className={immersiveStyles.projectMeta}>{project.timeline ?? ""}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {data.experience.length > 0 ? (
        <section className={immersiveStyles.section}>
          <h2 className={immersiveStyles.sectionTitle}>Experience</h2>
          <div className={immersiveStyles.list}>
            {data.experience.map((item) => (
              <div className={immersiveStyles.entry} key={`${item.organisation}-${item.role ?? ""}`}>
                <h3 className={immersiveStyles.entryTitle}>
                  {item.role ? `${item.role}, ${item.organisation}` : item.organisation}
                </h3>
                <p className={immersiveStyles.entryMeta}>
                  {[item.location, item.current ? "Present" : item.end].filter(Boolean).join(" · ")}
                </p>
                {item.summary ? <p className={immersiveStyles.entryBody}>{item.summary}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {data.education.length > 0 ? (
        <section className={immersiveStyles.section}>
          <h2 className={immersiveStyles.sectionTitle}>Education</h2>
          <div className={immersiveStyles.list}>
            {data.education.map((item) => (
              <div className={immersiveStyles.entry} key={item.institution}>
                <h3 className={immersiveStyles.entryTitle}>{item.institution}</h3>
                <p className={immersiveStyles.entryMeta}>
                  {[item.degree, item.field, item.current ? "Present" : item.end].filter(Boolean).join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {showAttribution ? (
        <footer className={immersiveStyles.footer}>Made with love · Market Engineering</footer>
      ) : null}
    </article>
  )
}

export const Template = Immersive

export { meta } from "./meta"
