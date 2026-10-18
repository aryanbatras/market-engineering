import type { Metadata } from "next"
import { ProsePage } from "@presentation/portfolio/marketing/page"
import { pageStyles } from "@presentation/portfolio/marketing/page.styles"

export const metadata: Metadata = {
  title: "Privacy",
  description: "What we collect, what we do not, and how to get it back or delete it.",
}

const PrivacyPage = () => (
  <ProsePage
    lead="Written to be read by a nineteen-year-old, not assembled from a generator. Short version: we hold your portfolio, we never send it to anyone, and you can leave with all of it."
    title="Privacy"
  >
    <div className={pageStyles.body}>
      <div className={pageStyles.section}>
        <h2 className={pageStyles.sectionTitle}>What we hold</h2>
        <p className={pageStyles.paragraph}>
          Your name, email, and Google or GitHub account details. The portfolio you write: your projects,
          experience, education, skills, and links. Your handle. Your payment status.
        </p>
      </div>

      <div className={pageStyles.section}>
        <h2 className={pageStyles.sectionTitle}>What we never do</h2>
        <ul className={pageStyles.list}>
          <li className={pageStyles.listItem}>
            <span aria-hidden className={pageStyles.mark} />
            <span>We do not use an AI service. There is no model that reads your data, because there is no model on our side at all.</span>
          </li>
          <li className={pageStyles.listItem}>
            <span aria-hidden className={pageStyles.mark} />
            <span>We do not show advertising, and we do not sell or share your data with anyone.</span>
          </li>
          <li className={pageStyles.listItem}>
            <span aria-hidden className={pageStyles.mark} />
            <span>We do not store your resume file. If you convert one, that happens in your browser.</span>
          </li>
          <li className={pageStyles.listItem}>
            <span aria-hidden className={pageStyles.mark} />
            <span>We do not track portfolio views in our database, and we do not build a profile of you.</span>
          </li>
        </ul>
      </div>

      <div className={pageStyles.section}>
        <h2 className={pageStyles.sectionTitle}>Who we use</h2>
        <p className={pageStyles.paragraph}>
          Supabase holds our database and handles sign-in. Razorpay handles payments in India. Vercel serves
          the site. Google or GitHub tells us who you are. Your fonts are served from our own servers, so
          loading a page does not tell a third party where you were.
        </p>
      </div>

      <div className={pageStyles.section}>
        <h2 className={pageStyles.sectionTitle}>Getting your data back</h2>
        <p className={pageStyles.paragraph}>
          Download everything as YAML or JSON from your dashboard, at any time, on any plan including free.
          No request, no waiting.
        </p>
      </div>

      <div className={pageStyles.section}>
        <h2 className={pageStyles.sectionTitle}>Deleting your account</h2>
        <p className={pageStyles.paragraph}>
          Settings, then Delete account. Your portfolio goes offline immediately and your data is removed
          straight away. It cannot be undone, so we ask you to type the word first.
        </p>
      </div>

      <div className={pageStyles.section}>
        <h2 className={pageStyles.sectionTitle}>Contact</h2>
        <p className={pageStyles.paragraph}>siteConfig.email</p>
      </div>
    </div>
  </ProsePage>
)

export default PrivacyPage
