import Image from "next/image"
import Link from "next/link"
import { galleryStyles } from "./editor.styles"
import { mediaStyles } from "./media.styles"

const cases = [
  {
    label: "The pain",
    body: "Your work exists. The page that shows it does not, and that page is a whole second project.",
  },
  {
    label: "The answer",
    body: "Fill in the fields. No code, no stack, no styling choices. Drag it until it reads like you.",
  },
  {
    label: "The point",
    body: "One live address that argues for you at every screen after this one.",
  },
]

const plates = [
  {
    src: "/media/campus.jpg",
    alt: "The outside of a college building, seen from across the road",
    caption: "Every template, your content",
  },
  {
    src: "/media/server-room.jpg",
    alt: "Rows of server racks with cabling in a data centre",
    caption: "A link you can send",
  },
  {
    src: "/media/library.jpg",
    alt: "A group of students seated at a long table in a library",
    caption: "Live in ten minutes",
  },
]

export const GallerySection = () => (
  <div className={galleryStyles.root}>
    <div className={galleryStyles.head}>
      <h2 className={galleryStyles.heading}>A page that explains you</h2>
      <p className={galleryStyles.body}>
        Not a gallery. The shortest honest answer to why anyone should read your code: what you built, what
        broke, what you chose, and what you would do differently. Written once, then it argues on your behalf
        at every screen.
      </p>
    </div>
    <div className={galleryStyles.grid}>
      {plates.map((plate) => (
        <figure className={galleryStyles.plate} key={plate.src}>
          <div className={galleryStyles.frame}>
            <Image
              alt={plate.alt}
              className={galleryStyles.image}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              src={plate.src}
            />
            <Link className={galleryStyles.creditButton} href="/credits">
              Credits
            </Link>
          </div>
          <figcaption className={galleryStyles.caption}>{plate.caption}</figcaption>
        </figure>
      ))}
    </div>
  </div>
)

export const AtmosphereBand = () => (
  <section className={mediaStyles.band}>
    <Image
      alt="Hands moving a printed card into place among a wall of cards"
      className={mediaStyles.plate}
      fill
      priority
      sizes="100vw"
      src="/media/drag-drop.jpg"
    />
    <div aria-hidden className={mediaStyles.scrim} />
    <div className={mediaStyles.inner}>
      <p className={mediaStyles.heading}>The page is the bottleneck.</p>

      <div className={mediaStyles.grid}>
        {cases.map((entry) => (
          <div className={mediaStyles.cell} key={entry.label}>
            <p className={mediaStyles.cellLabel}>{entry.label}</p>
            <p className={mediaStyles.cellBody}>{entry.body}</p>
          </div>
        ))}
      </div>

      <div className={mediaStyles.creditRow}>
        <span className={mediaStyles.creditText}>No code. No stack. No deploy.</span>
        <Link className={mediaStyles.creditLink} href="/credits">
          Photo credits
        </Link>
      </div>
    </div>
  </section>
)