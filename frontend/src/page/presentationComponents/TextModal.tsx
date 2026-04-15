import type { React } from "next/dist/server/route-modules/app-page/vendored/ssr/entrypoints";
import { useState} from "react";
import type { ElementType } from "../../types";

type TextModalProps = {
  initial?: ElementType; // if true, we are editing a textbox
  onSubmit: (
    text: string,
    width: number,
    height: number,
    fontSize: number,
    colour: string,
    x: number,
    y: number
  ) => void | Promise<void>;
  onClose: () => void;
};

// used for creating or editing a text element
// collects usr input, validates it, calls onCreate and then closes itself
function TextModal({ initial, onSubmit, onClose }: TextModalProps) {
  const [text, setText] = useState(initial?.content ?? '');
  const [width, setWidth] = useState(initial?.width ?? 50);
  const [height, setHeight] = useState(initial?.height ?? 20);
  const [fontSize, setFontSize] = useState(initial?.fontSize ?? 1);
  const [colour, setColour] = useState(initial?.colour ?? '#000000');
  const [x, setX] = useState(initial?.x ?? 0);
  const [y, setY] = useState(initial?.y ?? 0);
  const [error, setError] = useState(''); // implement error messages
  
  const computeSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError('');

    if (!text) {
      return; // if no text entered then dont make the text box
    }

    if (width < 0 || height < 0 || width > 100 || height > 100) {
      setError('Width and height must be between 0 and 100');
      return;
    }
    onSubmit(text, width, height, fontSize, colour, x, y);
    onClose();
  };
  return (
    <form onSubmit={computeSubmit}>
      {error && (
        <div>
          {error}
          <button type="button" onClick={() => setError('')}>
            Close
          </button>
        </div>
      )}
      <h3>{initial ? "Edit Text" : "Add Text"}</h3><br />

      Text:<input value={text} onChange={e => setText(e.target.value)} /><br />
      Size of TextBox:<div>
        Height (%):<input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} /><br />
        Width (%):<input type="number" value={width} onChange={e => setWidth(Number(e.target.value))} /><br />
      </div>
      Font Size (em):<input type="number" step="0.1" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} /><br />
      Colour (hex):<input value={colour} onChange={e => setColour(e.target.value)} /><br />

      <button type="submit">{initial ? "Save" : "Add"}</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
}

export default TextModal;