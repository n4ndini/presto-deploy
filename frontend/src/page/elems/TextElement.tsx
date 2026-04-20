import type { CSSProperties, MouseEvent } from "react";
import type { TextElementType } from "../../types";

type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

type Props = {
  elem: TextElementType;
  onDelete: (id: number) => void;
  onEdit: (elem: TextElementType) => void;
  onSelect: () => void;
  onMoveStart: (e: MouseEvent, elem: TextElementType) => void;
  onResizeStart: (e: MouseEvent, elem: TextElementType, direction: ResizeDirection) => void;
  getResizeHandleStyle: (direction: ResizeDirection) => CSSProperties;
  isSelected: boolean;
};

// handles behaviour and appearance of Text Element
// renders text box, handles right click delete, double click edit and styling
function TextElement({ elem, onDelete, onEdit, onSelect, onMoveStart, onResizeStart, getResizeHandleStyle, isSelected }: Props) {
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

        border: isSelected ? "2px solid #4a90e2" : "1px solid lightgrey",
        overflow: "auto",
        whiteSpace: "pre",
        textAlign: "left",

        fontSize: `${elem.fontSize}em`,
        color: elem.colour,
        fontFamily: elem.fontFamily,

        padding: "4px",
        cursor: "move",
        boxSizing: "border-box", 
      }}
    >
      {isSelected && (["nw", "n", "ne", "e", "se", "s", "sw", "w"] as ResizeDirection[]).map((direction) => (
        <button
          key={direction}
          type="button"
          aria-label={`Resize ${direction}`}
          onMouseDown={(e) => onResizeStart(e, elem, direction)}
          onClick={(e) => e.stopPropagation()}
          style={getResizeHandleStyle(direction)}
        />
      ))}
      {elem.content}
    </div>
  );
}

export default TextElement;