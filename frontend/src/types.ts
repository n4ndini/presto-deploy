export type PresentationType = {
  id: number,
  name: string,
  desc: string,
  thumbnail: string,
  slides: { id: number }[];
}

export type Store = {
  presentations: PresentationType[];
}