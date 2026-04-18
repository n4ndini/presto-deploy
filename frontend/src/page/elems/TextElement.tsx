import type { MouseEvent } from "react";
import type { TextElementType } from "../../types";

type Props = {
  elem: TextElementType;
  onDelete: (id: number) => void;
  onEdit: (elem: TextElementType) => void;
  onSelect: () => void;
  onMoveStart: (e: MouseEvent, elem: TextElementType) => void;
  isSelected: boolean;
};

// handles behaviour and appearance of Text Element
// renders text box, handles right click delete, double click edit and styling
function TextElement({ elem, onDelete, onEdit, onSelect, onMoveStart}: Props) {
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
        overflow: "auto",
        whiteSpace: "pre",
        textAlign: "left",

        fontSize: `${elem.fontSize}em`,
        color: elem.colour,

        padding: "4px",
        cursor: "move",
        boxSizing: "border-box", 
      }}
    >
      {elem.content}
    </div>
  );
}

export default TextElement;