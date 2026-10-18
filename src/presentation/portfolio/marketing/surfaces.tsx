import { LuDownload } from "react-icons/lu"
import { siteConfig } from "@application/core/site/site-config"
import { surfacesStyles } from "./surfaces.styles"

type SurfacesProps = {
  name: string
  headline: string
}

export const RecruiterSurfaces = ({ name, headline }: SurfacesProps) => (
  <div className={surfacesStyles.layout}>
    <div className={surfacesStyles.labelColumn}>
      <h2 className={surfacesStyles.heading}>What a recruiter actually opens</h2>
      <p className={surfacesStyles.body}>
        Not your page. A link they tap in WhatsApp, and a PDF they attach to an application. Both are
        generated from the same data you already pasted.
      </p>
    </div>

    <div className={surfacesStyles.fragmentColumn}>
      <div className={surfacesStyles.grid}>
        <div className={surfacesStyles.socialSlot}>
          <div className={surfacesStyles.socialCard} data-ui>
            <p className={surfacesStyles.cardEyebrow}>{siteConfig.origin.replace(/^https?:\/\//, "")}</p>
            <p className={surfacesStyles.cardName}>{name}</p>
            <p className={surfacesStyles.cardHeadline}>{headline}</p>
            <p className={surfacesStyles.cardFoot}>3 projects · 1 internship</p>
          </div>
          <p className={surfacesStyles.caption}>Rendered for every handle.</p>
        </div>

        <div className={surfacesStyles.pdfSlot}>
          <div className={surfacesStyles.pdf} data-ui>
            <div className={surfacesStyles.pdfBar}>
              <LuDownload aria-hidden size={15} strokeWidth={1.5} />
              <span className={surfacesStyles.pdfName}>{name.replace(/\s+/g, "-").toLowerCase()}.pdf</span>
              <span className={surfacesStyles.pdfMeta}>A4</span>
            </div>
            <div className={surfacesStyles.pdfBlock}>
              <p className={surfacesStyles.pdfBlockTitle}>Experience</p>
              <p className={surfacesStyles.pdfLine}>Software engineering intern, Zoho</p>
              <span className={surfacesStyles.pdfLineStrong} />
              <p className={surfacesStyles.pdfLine}>Built a reporting tool that replaced a spreadsheet.</p>
            </div>
            <div className={surfacesStyles.pdfBlock}>
              <p className={surfacesStyles.pdfBlockTitle}>Projects</p>
              <p className={surfacesStyles.pdfLine}>Attendance without the queue</p>
              <p className={surfacesStyles.pdfLine}>Second-year compiler notes</p>
            </div>
          </div>
          <p className={surfacesStyles.caption}>For the application form that insists on one.</p>
        </div>
      </div>
    </div>
  </div>
)