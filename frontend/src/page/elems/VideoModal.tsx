import { useState} from "react";
import type { SyntheticEvent } from "react";
import type { VideoElementType } from "../../types";

type VideoModalProps = {
  initial?: VideoElementType; // if true, we are editing an image
  onSubmit: (
    url: string,
    autoplay: boolean,
    width: number,
    height: number,
    _x: number,
    _y: number
  ) => void | Promise<void>;
  onClose: () => void;
};

// used for creating or editing an image element
// collects usr input, validates it, calls onCreate and then closes itself
function VideoModal({ initial, onSubmit, onClose }: VideoModalProps) {
  const [url, setUrl] = useState(initial?.url ?? '');
  const [autoplay, setAutoplay] = useState(initial?.autoplay ?? false);
  const [width, setWidth] = useState(initial?.width ?? 50);
  const [height, setHeight] = useState(initial?.height ?? 20);
  const [x, _setX] = useState(initial?.x ?? 0);
  const [y, _setY] = useState(initial?.y ?? 0);
  const [error, setError] = useState(''); // implement error messages
  
  const computeSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');

    if (!url || !url.includes('https://www.youtube.com')) {
      setError('Enter a URL of a youtube video');
      return; // if no image url entered then dont make the text box
    }

    if (width < 0 || height < 0 || width > 100 || height > 100) {
      setError('Width and height must be between 0 and 100');
      return;
    }
    onSubmit(url, autoplay, width, height, x, y);
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
      <h3 style={{ margin: 0 }}>{initial ? "Edit Video" : "Add Video"}</h3><br />

      Youtube URL:<input value={url} onChange={e => setUrl(e.target.value)} /><br />
      <div style={{display:"flex", gap: "10px"}}> 
        Autoplay video? :<input style={{ display: "flex", alignItems: "center", gap: "8px", width: "20px", height:"20px"}} type="checkbox" checked={autoplay} onChange={e => setAutoplay(e.target.checked)} /><br />
      </div>
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

export default VideoModal;