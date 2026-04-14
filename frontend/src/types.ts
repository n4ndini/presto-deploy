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
  elements: ElementType[];
}

export type ElementType = {
  id: number;
  type: 'text' | 'image' | 'video' | 'code';
  content: string; // text content, url of video/image, actual code
  x: number;
  y: number;
  width: number;
  height: number;
}