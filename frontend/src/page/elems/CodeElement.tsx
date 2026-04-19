import type { MouseEvent } from "react";
import type { CodeElementType } from "../../types";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

type Props = {
  elem: CodeElementType;
  onDelete: (id: number) => void;
  onEdit: (elem: CodeElementType) => void;
  onSelect: () => void;
  onMoveStart: (e: MouseEvent, elem: CodeElementType) => void;
  isSelected: boolean;
};

// handles behaviour and appearance of Text Element
// renders text box, handles right click delete, double click edit and styling
function CodeElement({ elem, onDelete, onEdit, onSelect, onMoveStart, isSelected }: Props) {
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
        cursor: "move",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", height: "100%", pointerEvents: "none" }}>
        <SyntaxHighlighter
          language={elem.language}
          style={dark}
          wrapLongLines={true}
          customStyle={{
            margin: 0,
            border: 'none',
            background: 'black',
            fontSize: `${elem.fontSize}em`,
            height: "100%",
            width: "100%",
            pointerEvents: "none",
          }}>
            {elem.code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default CodeElement;