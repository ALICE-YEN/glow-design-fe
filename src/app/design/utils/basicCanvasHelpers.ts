import { Canvas, Line } from "fabric";

// 初始化 Canvas，回傳 Canvas 實例
export const initializeCanvas = (canvasElement: HTMLCanvasElement): Canvas => {
  return new Canvas(canvasElement, {
    // backgroundColor: "#FFFFF0",
    backgroundColor: "#B2AC88",
    isDrawingMode: false, // 畫布的繪畫模式
    // selection: false,
  });
};

// 繪製網格
export const drawGrid = (canvasInstance: Canvas, gridSize: number): void => {
  for (let i = 0; i < (canvasInstance.width ?? 0); i += gridSize) {
    canvasInstance.add(
      new Line([i, 0, i, canvasInstance.height ?? 0], {
        stroke: "#D3D3D3",
        selectable: false,
        strokeWidth: 1,
        evented: false,
      })
    );
  }
  for (let i = 0; i < (canvasInstance.height ?? 0); i += gridSize) {
    canvasInstance.add(
      new Line([0, i, canvasInstance.width ?? 0, i], {
        stroke: "#D3D3D3",
        selectable: false,
        strokeWidth: 1,
        evented: false,
      })
    );
  }
};

// 調整 Canvas 尺寸為視窗大小並繪製網格
export const fitCanvasToWindowAndDrawGrid = (
  canvasInstance: Canvas,
  gridSize: number
): void => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  canvasInstance.setWidth(windowWidth);
  canvasInstance.setHeight(windowHeight);

  drawGrid(canvasInstance, gridSize);
};
