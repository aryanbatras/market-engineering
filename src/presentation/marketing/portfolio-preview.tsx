"use client"

import { memo, type ReactNode } from "react"
import { LuMail, LuMapPin } from "react-icons/lu"
import type { Portfolio } from "@application/portfolio/portfolio.schema"
import { previewStyles } from "./preview.styles"

const Range = ({ start, end, current }: { start?: string; end?: string; current?: boolean }) => {
  const span = [start, current ? "Present" : end].filter(Boolean).join(" – ")
  return span ? <span>{span}</span> : null
}

const Entry = ({ title, org, meta, body, bullets }: {
  title: string
  org?: string
  meta?: ReactNode
  body?: string
  bullets?: string[]
}) => (
  <article className={previewStyles.entry}>
    <p className={previewStyles.entryTitle}>{title}</p>
    {org ? <p className={previewStyles.entryOrg}>{org}</p> : null}
    {meta ? <p className={previewStyles.entryMeta}>{meta}</p> : null}
    {body ? <p className={previewStyles.entryBody}>{body}</p> : null}
    {bullets?.map((line) => (
      <p className={previewStyles.bullet} key={line}>
        <span aria-hidden className={previewStyles.bulletMark}>
          —
        </span>
        <span>{line}</span>
      </p>
    ))}
  </article>
)

const PortfolioPreview = memo(({ data }: { data: Portfolio }) => (
  <div className={previewStyles.root}>
    <header className={previewStyles.header}>
      <p className={previewStyles.name}>{data.identity.name}</p>
      {data.identity.headline ? (
        <p className={previewStyles.headline}>{data.identity.headline}</p>
      ) : null}
      <p className={previewStyles.meta}>
        {data.identity.location ? (
          <span className={previewStyles.metaIcon}>
            <LuMapPin aria-hidden size={12} strokeWidth={1.5} />
            {data.identity.location}
          </span>
        ) : null}
        {data.identity.availability ? <span>{data.identity.availability}</span> : null}
      </p>
    </header>

    {data.links.length > 0 || data.identity.email ? (
      <ul className={previewStyles.links}>
        {data.links.map((link) => (
          <li className={previewStyles.link} key={link.platform}>
            {link.label}
          </li>
        ))}
        {data.identity.email ? (
          <li className={previewStyles.link}>
            <LuMail aria-hidden size={12} strokeWidth={1.5} />
            {data.identity.email}
          </li>
        ) : null}
      </ul>
    ) : null}

    {data.experience.length > 0 ? (
      <section className={previewStyles.section}>
        <p className={previewStyles.sectionLabel}>Experience</p>
        {data.experience.map((item) => (
          <Entry
            body={item.summary}
            bullets={item.highlights}
            key={item.organisation}
            meta={
              <>
                <Range current={item.current} end={item.end} start={item.start} />
                {item.location ? <span>{item.location}</span> : null}
              </>
            }
            org={item.role ? item.organisation : undefined}
            title={item.role ?? item.organisation}
          />
        ))}
      </section>
    ) : null}

    {data.projects.length > 0 ? (
      <section className={previewStyles.section}>
        <p className={previewStyles.sectionLabel}>Projects</p>
        {data.projects.map((item) => (
          <Entry
            body={item.description}
            key={item.name}
            meta={item.tech.length > 0 ? <span className={previewStyles.tags}>{item.tech.join(" · ")}</span> : null}
            title={item.name}
          />
        ))}
      </section>
    ) : null}

    {data.education.length > 0 ? (
      <section className={previewStyles.section}>
        <p className={previewStyles.sectionLabel}>Education</p>
        {data.education.map((item) => (
          <Entry
            key={item.institution}
            meta={
              <>
                <Range current={item.current} end={item.end} start={item.start} />
                {item.grade ? <span>{item.grade}</span> : null}
              </>
            }
            org={[item.degree, item.field].filter(Boolean).join(", ") || undefined}
            title={item.institution}
          />
        ))}
      </section>
    ) : null}

    {data.skills.length > 0 ? (
      <section className={previewStyles.section}>
        <p className={previewStyles.sectionLabel}>Skills</p>
        <ul className={previewStyles.links}>
          {data.skills.map((group) => (
            <li className={previewStyles.link} key={group.name}>
              {group.name}
              {group.group ? ` · ${group.group}` : ""}
            </li>
          ))}
        </ul>
      </section>
    ) : null}
  </div>
))

PortfolioPreview.displayName = "PortfolioPreview"

export { PortfolioPreview }