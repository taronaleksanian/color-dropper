import { FC, MouseEvent, useRef, useState } from "react";
import picture from "../assets/picture.jpg";
import iconColorPicker from "../assets/IconColorPicker.svg";
import { IPosition } from "./ColorDropper.models";
import Cursor from "./components/Cursor";
import styles from "./ColorDropper.module.css";
import { between } from "../utils";
import { CURSOR_SIZE } from "./colorDropper.const";

const ColorDropper: FC = () => {
  const [selectedColor, setSelectedColor] = useState("");
  const [isCursorMode, setIsCursorMode] = useState(false);
  const [mousePosition, setMousePosition] = useState<IPosition | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const isCursorHidden = !mousePosition && !isCursorMode;
    if (!imageRef.current || isCursorHidden) return;

    const { left, top } = imageRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const r = CURSOR_SIZE / 2;
    const isXOnImage = between(x, 0, imageRef.current.width + r);
    const isYOnImage = between(y, 0, imageRef.current.height + r);

    if (!isXOnImage || !isYOnImage) {
      return setMousePosition(null);
    }

    setMousePosition({ x, y });
  };

  const toggleCursorMode = () => setIsCursorMode((prev) => !prev);
  const onHeaderMouseEnter = () => setMousePosition(null);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header} onMouseEnter={onHeaderMouseEnter}>
        <span role="button" onClick={toggleCursorMode}>
          <img src={iconColorPicker} />
        </span>
        <span>{selectedColor}</span>
      </div>
      <div onMouseMove={handleMouseMove} className={styles.imageWrapper}>
        <img src={picture} className={styles.picture} ref={imageRef} />
        {isCursorMode && mousePosition && (
          <Cursor
            mousePosition={mousePosition}
            onColorChange={setSelectedColor}
            image={imageRef?.current}
          />
        )}
      </div>
    </div>
  );
};

export default ColorDropper;
