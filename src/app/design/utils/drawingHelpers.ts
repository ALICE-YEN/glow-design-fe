import {
  Canvas,
  Line,
  StaticCanvas,
  FabricImage,
  Pattern,
  TEvent,
} from "fabric";
import { Point } from "@/app/design/types/interfaces";
import { FINALIZED_LINE_ID } from "@/app/design/utils/constants";
import { Point as IPoint, CanvasState } from "@/app/design/types/interfaces";

export const snapToGrid = (value: number, gridSize: number): number => {
  return Math.round(value / gridSize) * gridSize;
};

// 將滑鼠指針的位置對齊到網格上，返回修正後的座標點
export const getSnappedPointer = (
  canvasInstance: Canvas,
  event: TEvent,
  gridSize: number
): Point => {
  const pointer = canvasInstance.getPointer(event.e);
  return {
    x: snapToGrid(pointer.x, gridSize),
    y: snapToGrid(pointer.y, gridSize),
  };
};

// 固定模擬線為不同顏色的直線
export const finalizeTempLine = (
  canvasInstance: Canvas,
  tempLineRef: React.MutableRefObject<Line | null>
): void => {
  if (!tempLineRef.current) return;

  tempLineRef.current.set({
    stroke: "gray",
    strokeWidth: 5,
    strokeLineJoin: "round",
    strokeLineCap: "round",
    id: FINALIZED_LINE_ID,
  });
  canvasInstance.requestRenderAll();

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
  canvasInstance.requestRenderAll();
};

// 檢查 points 組合成的線是否閉合
export const checkClosure = (
  points: Point[],
  { x: endX, y: endY }: Point,
  gridSize: number
): boolean => {
  if (points.length >= 3) {
    const { x: firstX, y: firstY } = points[0];
    return (
      Math.abs(endX - firstX) < gridSize && Math.abs(endY - firstY) < gridSize
    );
  }
  return false;
};

// 建立 Pattern 作為物件的填充模式
export const createPatternFromImage = async (
  imageUrl: string,
  width: number
): Promise<Pattern> => {
  // 設定 Polygon 底圖
  const imgData = await FabricImage.fromURL(imageUrl);
  imgData.scaleToWidth(width); // Scales an object to a given width

  // 專門用來生成圖像或模式的輔助畫布，不會影響主畫布，提供了一個獨立的渲染環境，允許你創建圖案並用作其他對象的填充
  const patternSourceCanvas = new StaticCanvas();
  patternSourceCanvas.add(imgData);
  patternSourceCanvas.setDimensions({
    width: imgData.getScaledWidth(),
    height: imgData.getScaledHeight(),
  });
  patternSourceCanvas.renderAll();

  // Pattern 用來定義物件的填充模式
  return new Pattern({
    source: patternSourceCanvas.getElement(),
    repeat: "repeat",
  });
};

export const saveCanvasStateToStack = (
  stackRef: React.MutableRefObject<CanvasState[]>,
  canvasInstance: Canvas,
  points: IPoint[]
): void => {
  const currentCanvasState: CanvasState = {
    canvas: canvasInstance.toObject(["id"]), // 序列化時輸出自定義屬性
    points: [...points], // 保存 pointsRef，便於 undo、redo
  };
  stackRef.current.push(currentCanvasState);
};

export const updateUndoRedoStatus = (
  undoStackRef: React.MutableRefObject<CanvasState[]>,
  redoStackRef: React.MutableRefObject<CanvasState[]>,
  setCanUndo: (value: boolean) => void,
  setCanRedo: (value: boolean) => void
): void => {
  setCanUndo(undoStackRef.current.length > 1); // 不算儲存初始狀態
  setCanRedo(redoStackRef.current.length > 0);
};

export const restoreCanvasState = async (
  canvasInstance: Canvas,
  canvasState: CanvasState,
  pointsRef: React.MutableRefObject<IPoint[]>
): Promise<void> => {
  canvasInstance.loadFromJSON(canvasState.canvas).then(function () {
    canvasInstance.renderAll();
  });

  pointsRef.current = [...canvasState.points];
};
