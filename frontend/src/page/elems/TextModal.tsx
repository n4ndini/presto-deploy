import { useState} from "react";
import type { SyntheticEvent } from "react";
import type { TextElementType } from "../../types";

type TextModalProps = {
  initial?: TextElementType; // if true, we are editing a textbox
  onSubmit: (
    _text: string,
    _width: number,
    _height: number,
    _fontSize: number,
    _colour: string,
    _fontFamily: string,
    _x: number,
    _y: number
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
  const x = initial?.x ?? 0;
  const y = initial?.x ?? 0;
  const [fontFamily, setFontFamily] = useState(initial?.fontFamily ?? 'Arial');
  const [error, setError] = useState(''); // implement error messages
  
  const computeSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');

    if (!text) {
      setError('Enter text to create a text box!');
      return; // if no text entered then dont make the text box
    }

    if (width < 0 || height < 0 || width > 100 || height > 100) {
      setError('Width and height must be between 0 and 100');
      return;
    }
    onSubmit(text, width, height, fontSize, colour, fontFamily, x, y);
    onClose();
  };
  return (
    <form onSubmit={computeSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",

        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",

        backgroundColor: "#d4bff7",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        zIndex: 1000,
        minWidth: "320px",
      }}>
      {error && (
        <div style={{ backgroundColor: "#ffe5e5", border: "1px solid red", borderRadius: "6px", padding: "10px", marginBottom: "10px" }}>
          {error}
          <button type="button" onClick={() => setError('')}>
            Close
          </button>
        </div>
      )}
      <h3 style={{ margin: 0 }}>{initial ? "Edit Text" : "Add Text"}</h3><br />

      Text:<input data-cy="text-input-field" value={text} onChange={e => setText(e.target.value)} /><br />
      Size of TextBox:<div style={{ display: "flex", gap: "10px" }}>
        <span>Height (%):<input data-cy="text-height-input" style={{ width: "100%", height: "50%" }} type="number" value={height} onChange={e => setHeight(Number(e.target.value))} /><br /></span>
        <span>Width (%):<input data-cy="text-width-input" style={{ width: "100%", height: "50%" }} type="number" value={width} onChange={e => setWidth(Number(e.target.value))} /><br /></span>
      </div>
      Font Size (em):<input type="number" step="0.1" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} /><br />
      Colour (hex):<input value={colour} onChange={e => setColour(e.target.value)} /><br />
      Font:<select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
        <option value="Arial">Arial</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Parchment">Parchment</option>
      </select>
      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        marginTop: "10px",
      }}>
        <button data-cy="text-submit-btn" type="submit">{initial ? "Save" : "Add"}</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </div>
    </form>
  );
}

export default TextModal;