import { FC, useEffect, useMemo, useRef } from "react";
import { CURSOR_SIZE, RADIUS } from "../colorDropper.const";

import styles from "../ColorDropper.module.css";
import { IPosition } from "../ColorDropper.models";
import {
  calculateDisplayedPosition,
  generateSquares,
  getPixelColor,
} from "../../utils";

interface CursorProps {
  mousePosition: IPosition | null;
  image: HTMLImageElement | null;
  onColorChange: (color: string) => void;
}

const Cursor: FC<CursorProps> = ({ mousePosition, image, onColorChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const toolTipRef = useRef<HTMLSpanElement>(null);

  const cursorPosition = useMemo(() => {
    if (!mousePosition) return null;

    const { x, y } = mousePosition;
    const cursorLeft = x - RADIUS;
    const cursorTop = y - RADIUS;

    return { x: cursorLeft, y: cursorTop };
  }, [mousePosition]);

  const cursorStyles = useMemo(() => {
    if (!cursorPosition) return { display: "none" };

    const { x, y } = cursorPosition;

    return {
      display: "block",
      left: `${x}px`,
      top: `${y}px`,
    };
  }, [cursorPosition]);

  const squareCanvas = useMemo<HTMLCanvasElement | null>(
    () => generateSquares(),
    []
  );

  const onColorSelect = () => {
    onColorChange(toolTipRef.current?.innerText || "");
  };

  useEffect(() => {
    if (
      canvasRef.current &&
      squareCanvas &&
      image &&
      cursorPosition &&
      toolTipRef?.current
    ) {
      const { x: cursorX, y: cursorY } = cursorPosition;
      const ctx = canvasRef.current.getContext("2d");

      if (!canvasRef.current || !ctx) return;

      ctx.clearRect(0, 0, CURSOR_SIZE, CURSOR_SIZE);
      canvasRef.current.width = CURSOR_SIZE;
      canvasRef.current.height = CURSOR_SIZE;
      const imgX = (cursorX / image.width) * image.naturalWidth;
      const imgY = (cursorY / image.height) * image.naturalHeight;

      const { finalPos: finalX, dPos: dX } = calculateDisplayedPosition(
        imgX,
        image.width / image.naturalWidth
      );

      const { finalPos: finalY, dPos: dY } = calculateDisplayedPosition(
        imgY,
        image.height / image.naturalHeight
      );

      ctx.beginPath();
      ctx.arc(RADIUS, RADIUS, RADIUS, 0, 2 * Math.PI);
      ctx.lineWidth = 16;
      ctx.clip();
      ctx.lineWidth = 16;
      ctx.closePath();
      ctx.drawImage(
        image,
        finalX,
        finalY,
        CURSOR_SIZE,
        CURSOR_SIZE,
        dX,
        dY,
        CURSOR_SIZE,
        CURSOR_SIZE
      );
      const activeColor = getPixelColor(RADIUS, RADIUS, ctx);
      ctx.strokeStyle = activeColor;
      toolTipRef.current.innerText = activeColor;
      ctx.drawImage(squareCanvas, 0, 0, CURSOR_SIZE, CURSOR_SIZE);
      ctx.closePath();
      ctx.stroke();
    }
  }, [squareCanvas, image, cursorPosition, onColorChange]);

  return (
    <span
      role="button"
      onClick={onColorSelect}
      className={styles.cursor}
      style={cursorStyles}
    >
      <canvas ref={canvasRef} />
      <span ref={toolTipRef} className={styles.cursorTooltip} />
    </span>
  );
};

export default Cursor;
