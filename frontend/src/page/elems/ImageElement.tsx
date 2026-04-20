import type { CSSProperties, MouseEvent } from "react";
import type { ImageElementType } from "../../types";

type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

type Props = {
  elem: ImageElementType;
  onDelete: (_id: number) => void;
  onEdit: (_elem: ImageElementType) => void;
  onSelect: () => void;
  onMoveStart: (_e: MouseEvent, _elem: ImageElementType) => void;
  onResizeStart: (_e: MouseEvent, _elem: ImageElementType, _direction: ResizeDirection) => void;
  getResizeHandleStyle: (_direction: ResizeDirection) => CSSProperties;
  isSelected: boolean;
};

// handles behaviour and appearance of Text Element
// renders text box, handles right click delete, double click edit and styling
function ImageElement({ elem, onDelete, onEdit, onSelect, onMoveStart, onResizeStart, getResizeHandleStyle, isSelected }: Props) {
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
      // style={{
      //   position: "absolute",
      //   left: `${elem.x}%`,
      //   top: `${elem.y}%`,
      //   width: `${elem.width}%`,
      //   height: `${elem.height}%`,

      //   border: isSelected ? "2px solid #4a90e2" : "1px solid lightgrey",
      //   overflow: "hidden",
      //   display: "flex",
      //   alignItems: "center",
      //   justifyContent: "center",
      //   cursor: "move",
      //   boxSizing: "border-box",

      // }}
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
      <img 
        src={elem.url}
        alt={elem.alt}
        // style={{
        //   width: "100%",
        //   height:"100%",
        //   objectFit: "contain",
        //   pointerEvents: "none",
        // }}
      />

    </div>
  );
}

export default ImageElement;