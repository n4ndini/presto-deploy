import type { CodeElementType } from "../../types";

type Props = {
  elem: CodeElementType;
  onDelete: (id: number) => void;
  onEdit: (elem: CodeElementType) => void;
};

// handles behaviour and appearance of Text Element
// renders text box, handles right click delete, double click edit and styling
function CodeElement({ elem, onDelete, onEdit }: Props) {
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
        overflow: "auto",
        whiteSpace: "pre",
        textAlign: "left",

        fontSize: `${elem.fontSize}em`,

        padding: "4px",
      }}
    >
      {elem.code}
    </div>
  );
}

export default CodeElement;