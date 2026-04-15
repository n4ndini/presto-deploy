import type { React } from "next/dist/server/route-modules/app-page/vendored/ssr/entrypoints";
import { useState } from "react";

type TextModalProps = {
  onCreate: (
    text: string,
    width: number,
    height: number,
    fontSize: number,
    colour: string
  ) => void;
  onClose: () => void;
};

function TextModal({ onCreate, onClose }: TextModalProps) {
  const [text, setText] = useState('');
  const [width, setWidth] = useState(50);
  const [height, setHeight] = useState(20);
  const [fontSize, setFontSize] = useState(1);
  const [colour, setColour] = useState('#000000');
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
    onCreate(text, width, height, fontSize, colour);
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

      Text:<input value={text} onChange={e => setText(e.target.value)} /><br />
      Size of TextBox:<div>
        Height (%):<input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} /><br />
        Width (%):<input type="number" value={width} onChange={e => setWidth(Number(e.target.value))} /><br />
      </div>
      Font Size (em):<input type="number" step="0.1" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} /><br />
      Colour (hex):<input value={colour} onChange={e => setColour(e.target.value)} /><br />

      <button type="submit">Add textbox</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
}

export default TextModal;