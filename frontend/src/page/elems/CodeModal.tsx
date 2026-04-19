import { useState} from "react";
import type { SyntheticEvent } from "react";
import type { CodeElementType } from "../../types";

type CodeModalProps = {
  initial?: CodeElementType; // if true, we are editing an image
  onSubmit: (
    language: 'python' | 'c' | 'javascript',
    code: string,
    fontSize: number,
    width: number,
    height: number,
    _x: number,
    _y: number
  ) => void | Promise<void>;
  onClose: () => void;
};

// used for creating or editing an image element
// collects usr input, validates it, calls onCreate and then closes itself
function CodeModal({ initial, onSubmit, onClose }: CodeModalProps) {
  const [language, setLanguage] = useState<'python' | 'c' | 'javascript'>(
    initial?.language ?? 'python'
  );
  const [code, setCode] = useState(initial?.code ?? '');
  const [fontSize, setFontSize] = useState(initial?.fontSize ?? 1);
  const [width, setWidth] = useState(initial?.width ?? 50);
  const [height, setHeight] = useState(initial?.height ?? 20);
  const [x, _setX] = useState(initial?.x ?? 0);
  const [y, _setY] = useState(initial?.y ?? 0);
  const [error, setError] = useState(''); // implement error messages
  
  const computeSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');

    if (!code) {
      setError('Please enter code into the code block');
      return;
    }

    if (fontSize < 0.5 || fontSize > 5) {
      setError("Font size must be between 0.5 and 5");
      return;
    }

    if (width < 0 || height < 0 || width > 100 || height > 100) {
      setError('Width and height must be between 0 and 100');
      return;
    }
    onSubmit(language, code, fontSize, width, height, x, y);
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
      <h3 style={{ margin: 0 }}>{initial ? "Edit Code" : "Add Code"}</h3><br />

      Language:
      <select value={language} onChange={e => setLanguage(e.target.value as 'python' | 'c' | 'javascript')}>
        <option value="c">C</option>
        <option value="python">Python</option>
        <option value="javascript">JavaScript</option>
      </select>
      Code:<textarea style={{width: "100%", height: "50%"}} value={code} onChange={e => setCode(e.target.value)} /><br />
      Font Size (em):<input type="number" step="0.1" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} /><br />
      Size of TextBox:<div style={{ display: "flex", gap: "10px" }}>
        <span>Height (%):<input style={{ width: "100%", height: "50%" }} type="number" value={height} onChange={e => setHeight(Number(e.target.value))} /><br /></span>
        <span>Width (%):<input style={{ width: "100%", height: "50%" }} type="number" value={width} onChange={e => setWidth(Number(e.target.value))} /><br /></span>
      </div>

      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        marginTop: "10px",
      }}>
        <button type="submit">{initial ? "Save" : "Add"}</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </div>
    </form>
  );
}

export default CodeModal;