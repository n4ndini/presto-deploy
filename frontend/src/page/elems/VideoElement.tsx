import type { MouseEvent } from "react";
import type { VideoElementType } from "../../types";

type Props = {
  elem: VideoElementType;
  onDelete: (id: number) => void;
  onEdit: (elem: VideoElementType) => void;
  onSelect: () => void; 
  onMoveStart: (e: MouseEvent, elem: VideoElementType) => void; 
  isSelected: boolean;
};

// handles behaviour and appearance of Text Element
// renders text box, handles right click delete, double click edit and styling
function VideoElement({ elem, onDelete, onEdit, onSelect, onMoveStart, isSelected }: Props) {
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