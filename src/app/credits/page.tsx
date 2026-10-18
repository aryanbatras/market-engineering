import type { Metadata } from "next"
import { ProsePage } from "@presentation/portfolio/marketing/page"
import { pageStyles } from "@presentation/portfolio/marketing/page.styles"
import { credits, licenceNote, prohibitedNote } from "@application/core/media/credits"

export const metadata: Metadata = {
  title: "Credits",
  description: "Every photograph and clip used on this site, and who made it.",
}

const CreditsPage = () => (
  <ProsePage
    lead="Every photograph and clip on this site came from Pexels. Attribution is not required under their licence. We give it anyway, because the work belongs to someone else."
    title="Credits"
  >
    <div className={pageStyles.body}>
      <div className={pageStyles.section}>
        <h2 className={pageStyles.sectionTitle}>Media</h2>
        <ul className={pageStyles.creditList}>
          {credits.map((credit) => (
            <li className={pageStyles.creditRow} key={credit.file}>
              <div>
                <p className={pageStyles.creditTitle}>
                  <a className={pageStyles.creditLink} href={credit.source} rel="noreferrer" target="_blank">
                    {credit.title}
                  </a>
                </p>
                <p className={pageStyles.creditMeta}>
                  {credit.creator} · {credit.usage}
                </p>
              </div>
              <code className={pageStyles.creditFile}>{credit.file}</code>
            </li>
          ))}
        </ul>
      </div>

      <div className={pageStyles.section}>
        <h2 className={pageStyles.sectionTitle}>Licence</h2>
        <p className={pageStyles.paragraph}>{licenceNote}</p>
        <p className={pageStyles.paragraph}>{prohibitedNote}</p>
      </div>

      <div className={pageStyles.section}>
        <h2 className={pageStyles.sectionTitle}>Typefaces</h2>
        <p className={pageStyles.paragraph}>
          Geist and Geist Mono, by Vercel, under the SIL Open Font License. Self-hosted, so loading this
          site does not tell a third party where you were.
        </p>
      </div>
    </div>
  </ProsePage>
)

export default CreditsPage
