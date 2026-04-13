export type Store = {
  presentations: PresentationType[];
}

export type PresentationType = {
  id: number,
  name: string,
  desc: string,
  thumbnail: string,
  slides: SlideType[];
}

export type SlideType = {
    id: number;
    content: string;
}