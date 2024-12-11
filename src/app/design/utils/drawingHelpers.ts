import { Canvas, Line } from "fabric";

export const snapToGrid = (value: number, gridSize: number): number => {
  return Math.round(value / gridSize) * gridSize;
};

// 固定模擬線為黑色直線
export const finalizeTempLine = (
  canvasInstance: Canvas,
  tempLineRef: React.MutableRefObject<Line | null>
): void => {
  if (!tempLineRef.current) return;
  tempLineRef.current.set({
    stroke: "gray",
    strokeWidth: 5,
    id: "finalizedLine",
  });
  canvasInstance.add(tempLineRef.current);

  tempLineRef.current = null;
};

// 動態更新模擬線
export const updateTempLine = (
  canvasInstance: Canvas,
  tempLineRef: React.MutableRefObject<Line | null>,
  startX: number,
  startY: number,
  endX: number,
  endY: number
): void => {
  if (!canvasInstance) return;

  if (tempLineRef.current) {
    canvasInstance.remove(tempLineRef.current);
  }

  const line = new Line([startX, startY, endX, endY], {
    stroke: "blue",
    strokeWidth: 5,
    selectable: false,
    evented: false,
  });

  tempLineRef.current = line;
  canvasInstance.add(line);
  canvasInstance.renderAll();
};
