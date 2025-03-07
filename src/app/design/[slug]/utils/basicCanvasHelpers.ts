import { Canvas, Line, Point } from "fabric";
import { INITIAL_GRID_OBJECT_COUNT } from "@/app/design/[slug]/utils/constants";
import { CanvasState } from "@/app/design/[slug]/types/interfaces";

// 初始化 Canvas，繪製網格，回傳 Canvas 實例
export const initializeCanvasWithGrid = (
  canvasElement: HTMLCanvasElement,
  gridSize: number,
  canvasWidth: number,
  canvasHeight: number
): Canvas => {
  const canvas = new Canvas(canvasElement, {
    // backgroundColor: "#FFFFF0",
    backgroundColor: "#B2AC88",
    width: canvasWidth,
    height: canvasHeight,
    isDrawingMode: false, // 畫布的繪畫模式
    selection: false, // 禁用組選框
  });

  // 計算畫布中心
  const canvasCenterX = canvas.width / 2;
  const canvasCenterY = canvas.height / 2;

  // 平移視口到畫布的中心
  canvas.absolutePan({
    x: canvasCenterX - window.innerWidth / 2,
    y: canvasCenterY - window.innerHeight / 2,
  } as Point);

  drawGrid(canvas, gridSize, canvasWidth, canvasHeight);
  return canvas;
};

const STROKE_WIDTHS = {
  THIN: 0.5, // 細網格線
  MEDIUM: 1.5, // 粗網格線
  BOLD: 2.5, // 中心線
};

// 繪製網格
export const drawGrid = (
  canvasInstance: Canvas,
  gridSize: number,
  canvasWidth: number,
  canvasHeight: number
): void => {
  // 清理舊的網格
  const gridObjects = canvasInstance
    .getObjects("line")
    .filter((obj) => obj?.id === "grid");
  gridObjects.forEach((obj) => canvasInstance.remove(obj));

  // 計算畫布中心
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  // 中心線、主網格線及細網格
  for (let x = 0; x <= canvasWidth; x += gridSize) {
    let strokeWidth = STROKE_WIDTHS.THIN;
    if (Math.abs(x - centerX) < gridSize / 2) {
      strokeWidth = STROKE_WIDTHS.BOLD;
    } else if ((x - centerX) % (gridSize * 10) === 0) {
      strokeWidth = STROKE_WIDTHS.MEDIUM;
    }
    canvasInstance.add(
      new Line([x, 0, x, canvasHeight], {
        stroke: "#D3D3D3",
        strokeWidth,
        selectable: false,
        evented: false,
        id: "grid", // 自定義標記為網格物件
      })
    );
  }
  for (let y = 0; y <= canvasHeight; y += gridSize) {
    let strokeWidth = STROKE_WIDTHS.THIN;
    if (Math.abs(y - centerY) < gridSize / 2) {
      strokeWidth = STROKE_WIDTHS.BOLD;
    } else if ((y - centerY) % (gridSize * 10) === 0) {
      strokeWidth = STROKE_WIDTHS.MEDIUM;
    }
    canvasInstance.add(
      new Line([0, y, canvasWidth, y], {
        stroke: "#D3D3D3",
        strokeWidth,
        selectable: false,
        evented: false,
        id: "grid", // 自定義標記為網格物件
      })
    );
  }
};

export const setupZoom = (
  canvasInstance: Canvas,
  zoomFactor = 0.001, // 縮放比例
  minZoom = 0.5, // 最小縮小倍率
  maxZoom = 2 // 最大放大倍率
) => {
  canvasInstance.on("mouse:wheel", (opt) => {
    if (!opt.e) return;

    opt.e.preventDefault(); // 阻止事件的默認行為，避免觸發滾動條滾動等預設行為
    opt.e.stopPropagation(); // 停止事件進一步傳播，防止觸發更上層元素的相同事件處理器

    const zoom = canvasInstance.getZoom(); // 當前畫布的縮放級別
    const delta = opt.e.deltaY; // 滾輪事件的垂直滾動值，正值表示向上滾動，負值表示向下滾動
    let newZoom = zoom - delta * zoomFactor; // delta 為正（向上滾動），則縮放級別會減小（縮小畫面）；如果 delta 為負（向下滾動），則縮放級別會增加（放大畫面）
    if (newZoom > maxZoom) newZoom = maxZoom;
    if (newZoom < minZoom) newZoom = minZoom;

    canvasInstance.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, newZoom);
  });
};

export const handleResize = (canvasInstance: Canvas) => {
  canvasInstance.setDimensions({
    width: window.innerWidth,
    height: window.innerHeight,
  });
};

export const handleCanvasKeyDown =
  (
    canvasInstance: Canvas,
    saveToUndoStack: (canvasInstance: Canvas) => void,
    handleUndoClick: () => void
  ) =>
  (e: KeyboardEvent): void => {
    switch (e.key) {
      case "Delete":
      case "Backspace":
        const activeObject = canvasInstance.getActiveObject();
        if (activeObject) {
          canvasInstance.remove(activeObject); // 從畫布中移除物件
          canvasInstance.discardActiveObject(); // 清除選中狀態，觸發 selection:cleared
          canvasInstance.requestRenderAll(); // 重新渲染畫布

          saveToUndoStack(canvasInstance); // 操作後儲存狀態
          console.log("物件已刪除");
        }
        break;
      case "z":
      case "Z":
        if (e.ctrlKey || e.metaKey) {
          handleUndoClick();
        }
        break;
      default:
        break;
    }
  };

export const isInitialCanvasState = (canvasState: CanvasState): boolean => {
  return canvasState.canvas.objects.length === INITIAL_GRID_OBJECT_COUNT;
};
