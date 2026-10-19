"use client"

import Link from "next/link"
import { LuArrowRight } from "react-icons/lu"
import { faqStyles } from "./home-sections.styles"

const faqs = [
  {
    question: "Do I need to know how to code?",
    answer:
      "No. You write YAML, or you copy a prompt into an AI you already pay for and paste the result back. Nothing on this site asks you to open a terminal.",
  },
  {
    question: "What if I only have a PDF?",
    answer:
      "Open it, select the text, and run it through the same prompt. We never ask you to upload the file, and we never see it.",
  },
  {
    question: "Can I keep the source?",
    answer:
      "No. The templates stay on our servers. That is the only reason one dollar a month still works in year two.",
  },
  {
    question: "Who can see it?",
    answer:
      "Anyone with the link. You decide whether it is listed anywhere, and you can unpublish it in one click.",
  },
  {
    question: "What happens after I graduate?",
    answer:
      "Nothing changes. Your address does not expire and the free tier keeps working.",
  },
  {
    question: "What if I get it wrong?",
    answer: "Every publish keeps a revision, so a bad paste is one click to undo.",
  },
]

export const FaqSection = () => (
  <div className={faqStyles.layout}>
    <div className={faqStyles.list}>
      <p className={faqStyles.heading}>Questions</p>
      {faqs.map((item) => (
        <p className={faqStyles.question} key={item.question}>
          {item.question}
        </p>
      ))}
    </div>

    <div className={faqStyles.pane}>
      <div className={faqStyles.answers}>
        {faqs.map((item) => (
          <p className={faqStyles.answer} key={item.question}>
            {item.answer}
          </p>
        ))}
      </div>
      <Link className={faqStyles.more} href="/features">
        Everything else
        <LuArrowRight size={15} strokeWidth={1.5} />
      </Link>
    </div>
  </div>
)