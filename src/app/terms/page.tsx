import type { Metadata } from "next"
import { ProsePage } from "@presentation/marketing/page"
import { pageStyles } from "@presentation/marketing/page.styles"

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms you are agreeing to when you publish a portfolio with us.",
}

const TermsPage = () => (
  <ProsePage
    lead="The terms you are agreeing to when you publish a portfolio here. Short, because there is not much to it."
    title="Terms and conditions"
  >
    <div className={pageStyles.body}>
      <div className={pageStyles.section}>
        <h2 className={pageStyles.sectionTitle}>What you are publishing</h2>
        <p className={pageStyles.paragraph}>
          You are responsible for what is on your portfolio. If it is not yours, do not put it there. We do not
          review portfolios before they go live.
        </p>
      </div>

      <div className={pageStyles.section}>
        <h2 className={pageStyles.sectionTitle}>Your data stays yours</h2>
        <p className={pageStyles.paragraph}>
          It is your work and your name. You can export it whenever you like, and deleting your account
          removes it. We do not claim any rights over what you wrote.
        </p>
      </div>

      <div className={pageStyles.section}>
        <h2 className={pageStyles.sectionTitle}>The templates are ours</h2>
        <p className={pageStyles.paragraph}>
          The design, layout, and code behind every template belong to us. You are licensed to publish your
          own content on them for as long as your subscription is active. Copying a template, reselling it, or
          redistributing it is not permitted, and is the one thing that ends an account.
        </p>
      </div>

      <div className={pageStyles.section}>
        <h2 className={pageStyles.sectionTitle}>Payment</h2>
        <p className={pageStyles.paragraph}>
          Paid plans are billed monthly in advance and renew automatically until you cancel. You can cancel at
          any time from your dashboard, and your access continues until the period you have already paid for
          runs out.
        </p>
      </div>

      <div className={pageStyles.section}>
        <h2 className={pageStyles.sectionTitle}>If something goes wrong</h2>
        <p className={pageStyles.paragraph}>
          We aim to keep your portfolio online. We do not promise it will never be down, and we are not liable
          for what happens in an interview that followed from it.
        </p>
      </div>

      <div className={pageStyles.section}>
        <h2 className={pageStyles.sectionTitle}>Contact</h2>
        <p className={pageStyles.paragraph}>siteConfig.email</p>
      </div>
    </div>
  </ProsePage>
)

export default TermsPage
