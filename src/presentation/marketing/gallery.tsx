import Image from "next/image"
import Link from "next/link"
import { galleryStyles } from "./editor.styles"
import { mediaStyles } from "./editor.styles"

const plates = [
  {
    src: "/media/campus.jpg",
    alt: "The outside of a college building, seen from across the road",
    caption: "Four years in rooms like this",
  },
  {
    src: "/media/server-room.jpg",
    alt: "Rows of server racks with cabling in a data centre",
    caption: "What the coursework is actually for",
  },
  {
    src: "/media/library.jpg",
    alt: "A group of students seated at a long table in a library",
    caption: "Where the work gets done",
  },
]

export const GallerySection = () => (
  <div className={galleryStyles.root}>
    <div className={galleryStyles.head}>
      <h2 className={galleryStyles.heading}>The world they already study in</h2>
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
        Four years of coursework, three internships nobody can find, and a profile a recruiter scrolls past.
      </p>
      <Link className={mediaStyles.creditLink} href="/credits">
        Credits
      </Link>
    </div>
  </section>
)