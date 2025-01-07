import { Canvas } from "fabric";
import { Point as IPoint, CanvasState } from "@/app/design/types/interfaces";
import { isInitialCanvasState } from "@/app/design/utils/basicCanvasHelpers";

export const snapToGrid = (value: number, gridSize: number): number => {
  return Math.round(value / gridSize) * gridSize;
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

export const shouldDisableUndo = (
  undoStackRef: React.MutableRefObject<CanvasState[]>,
  canvasState: CanvasState
): boolean => {
  // 不算儲存初始狀態 1
  // 裝潢，利用點畫線，但 undo 剩一個點，肉眼看不到點，特別處理讓他不能 undo。用 isInitialCanvasState 判斷
  return undoStackRef.current.length <= 1 || isInitialCanvasState(canvasState);
};

export const updateUndoRedoStatus = (
  undoStackRef: React.MutableRefObject<CanvasState[]>,
  redoStackRef: React.MutableRefObject<CanvasState[]>,
  canvasState: CanvasState,
  setCanUndo: (value: boolean) => void,
  setCanRedo: (value: boolean) => void
): void => {
  setCanUndo(!shouldDisableUndo(undoStackRef, canvasState));
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
