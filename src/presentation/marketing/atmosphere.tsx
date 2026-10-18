import { mediaStyles } from "./editor.styles"

export const AtmosphereBand = () => (
  <section className={mediaStyles.band}>
    <video
      autoPlay
      className={mediaStyles.video}
      loop
      muted
      playsInline
      poster="/media/server-room.jpg"
      src="/media/typing.mp4"
    />
    <div aria-hidden className={mediaStyles.scrim} />
    <div className={mediaStyles.inner}>
      <p className={mediaStyles.heading}>Nobody saw your work.</p>
      <p className={mediaStyles.body}>
        Most engineering students have projects, internships, and a degree worth something. Almost none of
        them ever turn any of it into a link.
      </p>
      <p className={mediaStyles.captionRow}>Pexels · Pexels License · Typing of codes</p>
    </div>
  </section>
)
