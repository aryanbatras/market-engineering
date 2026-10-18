import Image from "next/image"
import { galleryStyles } from "./editor.styles"

const plates = [
  {
    src: "/media/campus.jpg",
    alt: "The outside of a college building, seen from across the road",
    caption: "Where most of them study",
    credit: "Pexels · LensWitzRaj",
  },
  {
    src: "/media/server-room.jpg",
    alt: "Rows of server racks with cabling in a data centre",
    caption: "What they are being prepared for",
    credit: "Pexels · panumas nikhomkhai",
  },
  {
    src: "/media/library.jpg",
    alt: "A group of students seated at a long table in a library",
    caption: "Where the work actually gets done",
    credit: "Pexels · Yan Krukau",
  },
]

export const GallerySection = () => (
  <div className={galleryStyles.root}>
    <div className={galleryStyles.head}>
      <h2 className={galleryStyles.heading}>The world they are already in</h2>
      <p className={galleryStyles.body}>
        They spend four years in rooms like these. Nobody in that building has ever told them that how they
        present what they built matters as much as what they built.
      </p>
    </div>
    <div className={galleryStyles.grid}>
      {plates.map((plate) => (
        <figure className={galleryStyles.plate} key={plate.src}>
          <div className={galleryStyles.frame}>
            <Image alt={plate.alt} className={galleryStyles.image} fill sizes="(max-width: 768px) 100vw, 33vw" src={plate.src} />
          </div>
          <figcaption className={galleryStyles.caption}>
            <span>{plate.caption}</span>
            <span className={galleryStyles.credit}>{plate.credit}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  </div>
)
