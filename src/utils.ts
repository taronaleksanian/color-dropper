import { CURSOR_SIZE, RADIUS, STEP } from "./ColorDropper/colorDropper.const";

const rgbToHex = (red: number, green: number, blue: number): string => {
  const r = red.toString(16).padStart(2, "0");
  const g = green.toString(16).padStart(2, "0");
  const b = blue.toString(16).padStart(2, "0");

  const hexColor = `#${r}${g}${b}`;

  return hexColor;
};

export const getPixelColor = (
  x: number,
  y: number,
  ctx: CanvasRenderingContext2D
): string => {
  const imageData = ctx.getImageData(x, y, 1, 1);
  const data = imageData.data;

  const [red, green, blue] = data;

  const hex = rgbToHex(red, green, blue);

  return hex;
};

export const calculateDisplayedPosition = (pos: number, scale: number) => {
  let finalPos = pos;
  let dPos = 0;

  if (finalPos < 0) {
    dPos = Math.abs(finalPos) * scale;
    finalPos = 0;
  }

  return { finalPos, dPos };
};

export const between = (num: number, a: number, b: number) =>
  num >= a && num <= b;

export const generateSquares = (): HTMLCanvasElement | null => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  canvas.width = CURSOR_SIZE;
  canvas.height = CURSOR_SIZE;
  let positionX = 0;
  let positionY = 0;
  const squaresList = [];

  while (positionX < CURSOR_SIZE || positionY < CURSOR_SIZE) {
    if (positionX >= CURSOR_SIZE && positionY < CURSOR_SIZE) {
      positionX = 0;
      positionY += STEP;
      continue;
    }

    const isCenter = positionY === RADIUS && positionX === RADIUS;

    if (!isCenter) {
      squaresList.push({ color: "#f6f6f6", x: positionX, y: positionY });
    }

    positionX += STEP;
  }

  squaresList.push({
    color: "yellow",
    x: RADIUS,
    y: RADIUS,
  });

  squaresList.forEach(({ color, x, y }) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.strokeRect(x, y, STEP, STEP);
    ctx.closePath();
  });

  return canvas;
};
