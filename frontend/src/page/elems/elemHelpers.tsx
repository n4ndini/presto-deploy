import type { ElementType, PresentationType } from "../../types";

const updateSlide = (
  presentation: PresentationType,
  slideIndex: number,
  updater: (elements: ElementType[]) => ElementType[]
): PresentationType => {
  return {
    ...presentation,
    slides: presentation.slides.map((slide, i) =>
      i === slideIndex
        ? { ...slide, elements: updater(slide.elements) }
        : slide
    ),
  };
};

export const addElement = (
  presentation: PresentationType,
  slideIndex: number,
  newElem: ElementType
): PresentationType => {
  return updateSlide(presentation, slideIndex, (elements) => [
    ...elements,
    newElem,
  ]);
};

export const deleteElement = (
  presentation: PresentationType,
  slideIndex: number,
  elemId: number
): PresentationType => {
  return updateSlide(presentation, slideIndex, (elements) =>
    elements.filter((el) => el.id !== elemId)
  );
};