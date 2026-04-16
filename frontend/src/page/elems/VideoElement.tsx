import type { VideoElementType } from "../../types";

type Props = {
  elem: VideoElementType;
  onDelete: (id: number) => void;
  onEdit: (elem: VideoElementType) => void;
};

// handles behaviour and appearance of Text Element
// renders text box, handles right click delete, double click edit and styling
function VideoElement({ elem, onDelete, onEdit }: Props) {
  return (
    <div
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

      }}
    >
      <video controls autoPlay 
        src={elem.url}
        style={{
          width: "100%",
          height:"100%",
          objectFit: "contain",
        }}
      />
    </div>
  );
}

export default VideoElement;