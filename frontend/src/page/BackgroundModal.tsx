import { useState, useEffect } from "react";
import type { SlideType } from "../types";

type BackgroundModalProps = {
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
function BackgroundModal({ initial, onSubmitCurr, onSubmitDefault, onClose }: BackgroundModalProps) {
  const [backgroundStyle, setBackgroundStyle] = useState<'solid' | 'gradient' | 'image'>('solid');

  const [solidColour, setSolidColour] = useState('#ffffff');
  const [gradientFrom, setGradientFrom] = useState('#ffffff');
  const [gradientTo, setGradientTo] = useState('#000000');
  const [imageUrl, setImageUrl] = useState('');

  const [error, setError] = useState(''); // implement error messages

  useEffect(() => {
    if (!initial?.background) return;

    const bg = initial.background;

    if (bg.startsWith('linear-gradient(')) {
      const match = bg.match(/linear-gradient\((#[0-9A-Fa-f]{6}),\s*(#[0-9A-Fa-f]{6})\)/);
      if (match) {
        setBackgroundStyle('gradient');
        setGradientFrom(match[1]);
        setGradientTo(match[2]);
        return;
      }
    }

    if (bg.startsWith('url(')) {
      const match = bg.match(/url\((.*)\)/);
      setBackgroundStyle('image');
      setImageUrl(match?.[1] ?? '');
      return;
    }

    if (/^#([0-9A-Fa-f]{6})$/.test(bg)) {
      setBackgroundStyle('solid');
      setSolidColour(bg);
    }
  }, [initial]);

  const setBackground = () => {
    if (backgroundStyle === 'solid') {
      if (!/^#([0-9A-Fa-f]{6})$/.test(solidColour)){
        setError('Not a valid HEXCODE!');
        return;
      }
      return solidColour;
    }

    if (backgroundStyle === 'gradient') {
      if (!/^#([0-9A-Fa-f]{6})$/.test(gradientFrom) || !/^#([0-9A-Fa-f]{6})$/.test(gradientTo)) {
        setError('Not a valid HEXCODE!');
        return;
      }
      return `linear-gradient(${gradientFrom}, ${gradientTo})`;
    }

    if (backgroundStyle === 'image') {
      const isValidUrl = /^https?:\/\/.+\.(png|jpg|jpeg|gif|tiff)(\?.*)?$/.test(imageUrl);
      if (!isValidUrl) {
        setError("Image must be png, jpg, gif, tiff image URL");
        return;
      }
      return `url(${imageUrl})`;
    }

    return 'white';
  };

  const handleSubmitCurr = () => {
    const background = setBackground();
    if (!background) return;

    onSubmitCurr(background);
    onClose();
  };

  const handleSubmitDefault = () => {
    const background = setBackground();
    if (!background) return;

    onSubmitDefault(background);
    onClose();
  };

  return (
    <div style={{
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
      <h3>Background Settings</h3>
      
      {error && (
        <div style={{ backgroundColor: "#ffe5e5", border: "1px solid red", borderRadius: "6px", padding: "10px", marginBottom: "10px" }}>
          {error}
          <button type="button" onClick={() => setError('')}>
            Close
          </button>
        </div>
      )}

      Choose Background Style:
      <label>
        <input type="radio" value="solid" checked={backgroundStyle === 'solid'} onChange={() => setBackgroundStyle('solid')}
        />
        Solid Colour
      </label>

      {backgroundStyle === 'solid' && (
        <input
          type="text"
          value={solidColour}
          onChange={(e) => setSolidColour(e.target.value)}
          placeholder="#ffffff"
        />
      )}

      <label>
        <input
          type="radio"
          value="gradient"
          checked={backgroundStyle === 'gradient'}
          onChange={() => setBackgroundStyle('gradient')}
        />
        Gradient Colour
      </label>

      {backgroundStyle === 'gradient' && (
        <div>
          <input
            type="text"
            value={gradientFrom}
            onChange={(e) => setGradientFrom(e.target.value)}
            placeholder="From (#fff)"
          />
          <input
            type="text"
            value={gradientTo}
            onChange={(e) => setGradientTo(e.target.value)}
            placeholder="To (#000)"
          />
        </div>
      )}

      <label>
        <input
          type="radio"
          value="image"
          checked={backgroundStyle === 'image'}
          onChange={() => setBackgroundStyle('image')}
        />
        Image
      </label>

      {backgroundStyle === 'image' && (
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Image URL"
        />
      )}

      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        marginTop: "10px",
      }}>
        <button type="button" onClick={handleSubmitCurr}>
          Save for Current Slide
        </button>
        <button type="button" onClick={handleSubmitDefault}>
          Save as Default
        </button>
        <button type="button" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default BackgroundModal;