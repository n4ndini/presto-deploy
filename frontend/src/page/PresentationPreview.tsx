import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ElementType, PresentationType, SlideType } from "../types";
import { getPresentationById } from "./Helpers";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "./Slide.module.css";

const renderPreviewElement = (el: ElementType) => {
  const commonStyle = {
    position: "absolute" as const,
    left: `${el.x}%`,
    top: `${el.y}%`,
    width: `${el.width}%`,
    height: `${el.height}%`,
    boxSizing: "border-box" as const,
    overflow: "hidden" as const,
    border: "none",
  };

  switch (el.type) {
    case "text":
      return (
        <div
          key={el.id}
          style={{
            ...commonStyle,
            whiteSpace: "pre-wrap",
            padding: "4px",
            fontSize: `${el.fontSize}em`,
            color: el.colour,
            fontFamily: el.fontFamily,
          }}
        >
          {el.content}
        </div>
      );

    case "image":
      return (
        <div
          key={el.id}
          style={{
            ...commonStyle,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={el.url}
            alt={el.alt}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              pointerEvents: "none",
              border: "none",
            }}
          />
        </div>
      );

    case "video":
      return (
        <div key={el.id} style={commonStyle}>
          <iframe
            src={el.url.replace("watch?v=", "embed/")}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              pointerEvents: "none",
            }}
            allow="autoplay"
            title={`preview-video-${el.id}`}
          />
        </div>
      );

    case "code":
      return (
        <div key={el.id} style={commonStyle}>
          <SyntaxHighlighter
            language={el.language}
            style={dark}
            wrapLongLines={true}
            customStyle={{
              margin: 0,
              border: "none",
              background: "black",
              fontSize: `${el.fontSize}em`,
              height: "100%",
              width: "100%",
              pointerEvents: "none",
            }}
          >
            {el.code}
          </SyntaxHighlighter>
        </div>
      );

    default:
      return null;
  }
};

function PreviewSlide({
  slide,
  slideNumber,
}: {
  slide: SlideType;
  slideNumber: number;
}) {
  return (
    <div
      key={slide.id}
      data-cy="slide-preview-container"
      className={styles.slideFade}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: slide.background || "#ffffff",
        overflow: "hidden",
        border: "none",
      }}
    >
      {slide.elements.map((el) => renderPreviewElement(el))}
      <div
        style={{
          position: "absolute",
          bottom: "12px",
          left: "12px",
          color: "#888",
          fontSize: "0.95rem",
        }}
      >
        {slideNumber}
      </div>
    </div>
  );
}

function PresentationPreview() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [presentation, setPresentation] = useState<PresentationType | null>(
    null
  );
  const [currSlideIndex, setCurrSlideIndex] = useState(0);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchPresentation = async () => {
      try {
        const pres = await getPresentationById(token, Number(id));
        setPresentation(pres);
      } catch {
        setError("Failed to load preview");
      }
    };

    fetchPresentation();
  }, [id, token, navigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!presentation || presentation.slides.length < 2) return;

      if (e.key === "ArrowLeft" && currSlideIndex > 0) {
        setCurrSlideIndex((prev) => prev - 1);
      }

      if (
        e.key === "ArrowRight" &&
        currSlideIndex < presentation.slides.length - 1
      ) {
        setCurrSlideIndex((prev) => prev + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [presentation, currSlideIndex]);

  if (!presentation) {
    return <p>{error || "Loading preview..."}</p>;
  }

  const currentSlide = presentation.slides[currSlideIndex];
  const isFirstSlide = currSlideIndex === 0;
  const isLastSlide = currSlideIndex === presentation.slides.length - 1;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#111827",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "min(96vw, calc(96vh * 16 / 9))",
          aspectRatio: "16 / 9",
          background: "#ffffff",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
        }}
      >
        <PreviewSlide slide={currentSlide} slideNumber={currSlideIndex + 1} />

        {presentation.slides.length >= 2 && (
          <>
            <button
              onClick={() => setCurrSlideIndex((prev) => prev - 1)}
              disabled={isFirstSlide}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                opacity: isFirstSlide ? 0.45 : 1,
                cursor: isFirstSlide ? "not-allowed" : "pointer",
                zIndex: 2,
              }}
            >
              ←
            </button>

            <button
              onClick={() => setCurrSlideIndex((prev) => prev + 1)}
              disabled={isLastSlide}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                opacity: isLastSlide ? 0.45 : 1,
                cursor: isLastSlide ? "not-allowed" : "pointer",
                zIndex: 2,
              }}
            >
              →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PresentationPreview;
