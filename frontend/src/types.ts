export type Presentation = {
  id: number,
  name: string,
  desc: string,
  thumbnail: string,
  slides: { id: number }[];
}

export type Store = {
  presentations: Presentation[];
}