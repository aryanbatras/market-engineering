export type Credit = {
  file: string
  title: string
  creator: string
  source: string
  usage: string
}

export const credits: Credit[] = [
  {
    file: "/media/typing.mp4",
    title: "Typing of codes",
    creator: "Pexels",
    source: "https://www.pexels.com/video/typing-of-codes-854053/",
    usage: "Muted background loop on the home page",
  },
  {
    file: "/media/campus.jpg",
    title: "Exterior of a building",
    creator: "LensWitzRaj",
    source: "https://www.pexels.com/photo/exterior-of-a-building-20200756/",
    usage: "Home page, the world our users study in",
  },
  {
    file: "/media/server-room.jpg",
    title: "Data center server racks with active equipment",
    creator: "panumas nikhomkhai",
    source:
      "https://www.pexels.com/photo/data-center-server-racks-with-active-equipment-37730212/",
    usage: "Home page and video poster frame",
  },
  {
    file: "/media/library.jpg",
    title: "Group seated at a table",
    creator: "Yan Krukau",
    source: "https://www.pexels.com/photo/group-of-people-sitting-on-chair-in-front-of-table-8199558/",
    usage: "Home page",
  },
]

export const licenceNote =
  "Every photograph and clip on this site comes from Pexels under the Pexels Licence: free for commercial use, attribution not required, modification permitted. Credit is given anyway, because the work belongs to someone else."

export const prohibitedNote =
  "We stay clear of what that licence forbids: implying endorsement by any person or brand, using any of it as a trade mark, and redistributing it as stock. None of it appears inside a portfolio template, where users would be republishing it as their own work."