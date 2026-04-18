import type { MouseEvent } from "react";
import type { ImageElementType } from "../../types";

type Props = {
  elem: ImageElementType;
  onDelete: (id: number) => void;
  onEdit: (elem: ImageElementType) => void;
  onSelect: () => void;
  onMoveStart: (e: MouseEvent, elem: ImageElementType) => void;
  isSelected: boolean;
};

// handles behaviour and appearance of Text Element
// renders text box, handles right click delete, double click edit and styling
function ImageElement({ elem, onDelete, onEdit, onSelect, onMoveStart }: Props) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onMouseDown={(e) => {
        if (e.button !== 0) return;
        onMoveStart(e, elem);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        onDelete(elem.id);
      }}
      onDoubleClick={() => {
        onEdit(elem)
      }}
      style={{
        position: "absolute",
        left: `${elem.x}%`,
        top: `${elem.y}%`,
        width: `${elem.width}%`,
        height: `${elem.height}%`,

        border: "1px solid lightgrey",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "move",
        boxSizing: "border-box",

      }}
    >
      <img 
        src={elem.url}
        alt={elem.alt}
        style={{
          width: "100%",
          height:"100%",
          objectFit: "contain",
          pointerEvents: "none",
        }}
      />

    </div>
  );
}

export default ImageElement;