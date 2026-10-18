import Image from "next/image"
import Link from "next/link"
import { galleryStyles, mediaStyles } from "./editor.styles"

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
      <p className={mediaStyles.heading}>The blank page.</p>
      <p className={mediaStyles.body}>
        The bottleneck is not talent, it is setup. You already have the commits, the screenshots and the
        internship notes. What is missing is the two hours to stand up a site, pick a stack and deploy it
        before the deadline. So the work stays invisible, and the strongest thing you have never gets read.
      </p>
      <div className={mediaStyles.captionRow}>
        <span>Typed in, rendered live, published at one address.</span>
        <Link className={mediaStyles.creditLink} href="/credits">
          Footage credits
        </Link>
      </div>
    </div>
  </section>
)