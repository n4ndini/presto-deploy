import { useState} from "react";
import type { CodeElementType } from "../../types";

type CodeModalProps = {
  initial?: CodeElementType; // if true, we are editing an image
  onSubmit: (
    code: string,
    fontSize: number,
    width: number,
    height: number,
    x: number,
    y: number
  ) => void | Promise<void>;
  onClose: () => void;
};

// used for creating or editing an image element
// collects usr input, validates it, calls onCreate and then closes itself
function CodeModal({ initial, onSubmit, onClose }: CodeModalProps) {
  const [code, setCode] = useState(initial?.code ?? '');
  const [fontSize, setFontSize] = useState(initial?.fontSize ?? 10);
  const [width, setWidth] = useState(initial?.width ?? 50);
  const [height, setHeight] = useState(initial?.height ?? 20);
  const [x, setX] = useState(initial?.x ?? 0);
  const [y, setY] = useState(initial?.y ?? 0);
  const [error, setError] = useState(''); // implement error messages
  
  const computeSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError('');

    if (!code) {
      setError('Please enter code into the code block');
      return;
    }

    // check url is an img or 64base encoded
    // ENCODE IMAGE W .encode or smth is base64 string

    if (width < 0 || height < 0 || width > 100 || height > 100) {
      setError('Width and height must be between 0 and 100');
      return;
    }
    onSubmit(code, fontSize, width, height, x, y);
    onClose();
  };
  
  return (
    
  );
}

export default CodeModal;