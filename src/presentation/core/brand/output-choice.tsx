"use client"

import Link from "next/link"
import { LuArrowRight, LuFileText, LuLayoutTemplate } from "react-icons/lu"
import { Wordmark } from "@presentation/core/brand/wordmark"
import { choiceStyles } from "./choice.styles"

const choices = [
  {
    id: "portfolio",
    href: "/builder",
    title: "A portfolio website",
    body: "A page you send in an application. Scroll, motion, space, your projects with images. Live at your own URL.",
    cta: "Pick a portfolio template",
    icon: LuLayoutTemplate,
  },
  {
    id: "resume",
    href: "/resume/templates",
    title: "A typeset resume",
    body: "A PDF you attach. Ten layouts, real LaTeX you can edit in Overleaf, and a check that shows you what a parser reads.",
    cta: "Pick a resume layout",
    icon: LuFileText,
  },
]

export const OutputChoice = () => (
  <div className={choiceStyles.shell}>
    <div className={choiceStyles.bar}>
      <div className={choiceStyles.barInner}>
        <Wordmark />
        <span className={choiceStyles.crumb}>What are you making?</span>
      </div>
    </div>

    <div className={choiceStyles.stage}>
      <h1 className={choiceStyles.title}>Two outputs, one set of facts</h1>
      <p className={choiceStyles.lead}>
        You only type this once. Pick what you need first, and you can make the other one later
        without entering anything again.
      </p>

      <div className={choiceStyles.grid}>
        {choices.map((choice) => {
          const Icon = choice.icon
          return (
            <Link className={choiceStyles.card} href={choice.href} key={choice.id}>
              <span className={choiceStyles.icon}>
                <Icon size={20} strokeWidth={1.5} />
              </span>
              <span className={choiceStyles.cardTitle}>{choice.title}</span>
              <span className={choiceStyles.cardBody}>{choice.body}</span>
              <span className={choiceStyles.cta}>
                {choice.cta}
                <LuArrowRight size={15} strokeWidth={1.5} />
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  </div>
)