import type { CSSProperties, MouseEvent } from "react";
import type { VideoElementType } from "../../types";

type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

type Props = {
  elem: VideoElementType;
  onDelete: (_id: number) => void;
  onEdit: (_elem: VideoElementType) => void;
  onSelect: () => void; 
  onMoveStart: (_e: MouseEvent, _elem: VideoElementType) => void;
  onResizeStart: (_e: MouseEvent, _elem: VideoElementType, _direction: ResizeDirection) => void;
  getResizeHandleStyle: (_direction: ResizeDirection) => CSSProperties; 
  isSelected: boolean;
};

// handles behaviour and appearance of Text Element
// renders text box, handles right click delete, double click edit and styling
function VideoElement({ elem, onDelete, onEdit, onSelect, onMoveStart, onResizeStart, getResizeHandleStyle, isSelected }: Props) {
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
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
      <div style={{border: "2px solid lightgrey"}}>
        <iframe
          src={elem.url.replace("watch?v=", "embed/")}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            pointerEvents: "none",
          }}
          allow="autoplay"
          title={`video-${elem.id}`}
        />
      </div>
    </div>
  );
}

export default VideoElement;