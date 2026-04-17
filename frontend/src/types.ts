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

type BaseElementType = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type TextElementType = BaseElementType & {
  type: 'text';
  content: string; // text content, url of video/image, actual code
  fontSize: number;
  colour: string;
}

export type ImageElementType = BaseElementType & {
  type: 'image';
  url: string;  // or base 64
  alt: string;
};

export type VideoElementType = BaseElementType & {
  type: 'video';
  url: string;
  autoplay: boolean;
};

export type CodeElementType = BaseElementType & {
  language: 'python' | 'c' | 'javascript';
  type: 'code';
  code: string;
  fontSize: number;
};

export type ElementType = TextElementType | ImageElementType | VideoElementType | CodeElementType;