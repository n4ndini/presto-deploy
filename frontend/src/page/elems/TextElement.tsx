import type { ElementType } from "../../types";

type Props = {
  elem: ElementType;
  onDelete: (id: number) => void;
};

// handles behaviour and appearance of Text Element
// renders text box, handles right click delete, double click edit and styling
function TextElement({ elem, onDelete }: Props) {
  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        onDelete(elem.id);
      }}
      onDoubleClick={() => {
        console.log("edit later");
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
      }}
    >
      {elem.content}
    </div>
  );
}

export default TextElement;