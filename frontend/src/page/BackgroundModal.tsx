import { useState} from "react";
import type { SyntheticEvent } from "react";
import type { SlideType } from "../types";

type SlideModalProps = {
  initial?: SlideType; // if true, we are editing a textbox
  onSubmitCurr: (
    background: string,
  ) => void | Promise<void>;
  onSubmitDefault: (
    background: string,
  ) => void | Promise<void>;
  onClose: () => void;
};

// used for creating or editing a text element
// collects usr input, validates it, calls onCreate and then closes itself
function SlideModal({ initial, onSubmitCurr, onSubmitDefault, onClose }: SlideModalProps) {
  const [backgroundStyle, setBackgroundStyle] = useState<'solid' | 'gradient' | 'image'>('solid');

  const [solidColour, setSolidColour] = useState('#ffffff');
  const [gradientFrom, setGradientFrom] = useState('#ffffff');
  const [gradientTo, setGradientTo] = useState('#000000');
  const [imageUrl, setImageUrl] = useState('');
  
  const [currBack, setCurrBack] = useState(initial?.background ?? 'white');
  const [defaultBack, setDefaultBack] = useState(initial?.background ?? 'white');

  const [error, setError] = useState(''); // implement error messages

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

        backgroundColor: "#88d3ed",
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

      Choose Background Style:
      <label>
        <input type="radio" value="solid" checked={backgroundStyle === 'solid'} onChange={(e) => setBackgroundStyle(e.target.value)}>
          Solid Colour
        </input>
      </label>



      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        marginTop: "10px",
      }}>
        <button type="submit">{initial ? "Save for Current Slide" : "Add"}</button>
        <button type="submit">{initial ? "Save as Default" : "Add"}</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </div>
    </form>
  );
}

export default SlideModal;