import { Canvas, Line, Point } from "fabric";

// 初始化 Canvas，繪製網格，回傳 Canvas 實例
export const initializeCanvasWithGrid = (
  canvasElement: HTMLCanvasElement,
  gridSize: number
): Canvas => {
  const canvas = new Canvas(canvasElement, {
    // backgroundColor: "#FFFFF0",
    backgroundColor: "#B2AC88",
    width: 2000,
    height: 2000,
    isDrawingMode: false, // 畫布的繪畫模式
    selection: false,
  });

  drawGrid(canvas, gridSize);
  return canvas;
};

// 繪製網格
export const drawGrid = (canvasInstance: Canvas, gridSize: number): void => {
  // 清理舊的網格
  const gridObjects = canvasInstance
    .getObjects("line")
    .filter((obj) => obj?.data === "grid");
  gridObjects.forEach((obj) => canvasInstance.remove(obj));

  for (let i = 0; i < (canvasInstance.width ?? 0); i += gridSize) {
    canvasInstance.add(
      new Line([i, 0, i, canvasInstance.height ?? 0], {
        stroke: "#D3D3D3",
        selectable: false,
        evented: false,
        data: "grid", // 自定義標記為網格物件
      })
    );
  }
  for (let i = 0; i < (canvasInstance.height ?? 0); i += gridSize) {
    canvasInstance.add(
      new Line([0, i, canvasInstance.width ?? 0, i], {
        stroke: "#D3D3D3",
        selectable: false,
        evented: false,
        data: "grid", // 自定義標記為網格物件
      })
    );
  }
};

// 調整 Canvas 尺寸為視窗大小並繪製網格
// export const fitCanvasToWindowAndDrawGrid = (
//   canvasInstance: Canvas,
//   gridSize: number
// ): void => {
//   const windowWidth = window.innerWidth;
//   const windowHeight = window.innerHeight;

//   canvasInstance.setWidth(windowWidth);
//   canvasInstance.setHeight(windowHeight);

//   drawGrid(canvasInstance, gridSize);
// };

export const setupPan = (canvasInstance: Canvas) => {
  let isPanning = false;

  const onMouseDown = () => {
    isPanning = true;
  };

  const onMouseUp = () => {
    isPanning = false;
  };

  const onMouseMove = (opt) => {
    if (isPanning && opt.e) {
      // opt.e.movementX：滑鼠自上一次事件到目前事件在 X 軸 上的移動距離（以像素為單位）。
      // opt.e.movementY：滑鼠自上一次事件到目前事件在 Y 軸 上的移動距離。
      const delta = new Point(opt.e.movementX, opt.e.movementY);

      // 用於相對平移畫布的視口。平移的效果是整個畫布（內容和背景）一起移動，但實際上只是改變了視口的偏移量。
      canvasInstance.relativePan(delta);
    }
  };

  canvasInstance.on("mouse:down", onMouseDown);
  canvasInstance.on("mouse:up", onMouseUp);
  canvasInstance.on("mouse:move", onMouseMove);

  return () => {
    canvasInstance.off("mouse:down", onMouseDown);
    canvasInstance.off("mouse:up", onMouseUp);
    canvasInstance.off("mouse:move", onMouseMove);
  };
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
