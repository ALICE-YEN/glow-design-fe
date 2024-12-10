// 這段代碼實現了對 Fabric.js 畫布上的物件移動時的「吸附」邏輯，並輔助顯示「指導線」來提示吸附效果。
// 當物件接近畫布邊緣或中心線（在某個範圍內）時，自動將物件移動到對齊的位置。

// 動態線的特點
// 生成時機：在 object:moving 事件中，根據物件的當前位置動態生成。
// 參考對象：
// 其他物件：例如，當移動的物件左邊靠近另一個物件的右邊時，顯示動態輔導線。
// 固定線：例如，畫布中心線或其他用戶設置的基準線。
// 顯示距離：
// 可以在輔導線旁邊顯示物件之間或與基準線的距離。

import { Canvas, Line, Object as FabricObject } from "fabric";

const snappingDistance = 10; // 控制吸附的敏感範圍

export const handleObjectMoving = (
  canvas: Canvas, // Fabric.js 畫布對象
  obj: FabricObject, // 被移動的物件
  guidelines: Line[], // 當前指導線列表
  setGuidelines: (guidelines: Line[]) => void // 更新指導線列表的回調函數
) => {
  const canvasWidth = canvas.width ?? 0;
  const canvasHeight = canvas.height ?? 0;

  const left = obj.left ?? 0;
  const top = obj.top ?? 0;
  const right = left + (obj.width ?? 0) * (obj.scaleX ?? 1);
  const bottom = top + (obj.height ?? 0) * (obj.scaleY ?? 1);

  // 物件的中心點坐標
  const centerX = left + ((obj.width ?? 0) * (obj.scaleX ?? 1)) / 2;
  const centerY = top + ((obj.height ?? 0) * (obj.scaleY ?? 1)) / 2;

  const newGuidelines = [];
  clearGuidelines(canvas);

  // 物件是否發生了吸附
  let snapped = false;

  // 檢查左邊界
  if (Math.abs(left) < snappingDistance) {
    obj.set({ left: 0 });
    // 檢查是否已經存在一條 ID 為 vertical-left 的指導線。如果不存在，創建一條垂直線並添加到畫布上。
    if (!guidelineExists(canvas, "vertical-left")) {
      const line = createVerticalGuideline(canvas, 0, "vertical-left");
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  // 檢查上邊界
  if (Math.abs(top) < snappingDistance) {
    obj.set({ top: 0 });
    if (!guidelineExists(canvas, "horizontal-top")) {
      const line = createHorizontalGuideline(canvas, 0, "horizontal-top");
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  // 檢查右邊界
  if (Math.abs(right - canvasWidth) < snappingDistance) {
    obj.set({ left: canvasWidth - obj.width * obj.scaleX });
    if (!guidelineExists(canvas, "vertical-right")) {
      const line = createVerticalGuideline(
        canvas,
        canvasWidth,
        "vertical-right"
      );
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  // 檢查下邊界
  if (Math.abs(bottom - canvasHeight) < snappingDistance) {
    obj.set({ top: canvasHeight - obj.height * obj.scaleY });
    if (!guidelineExists(canvas, "horizontal-bottom")) {
      const line = createHorizontalGuideline(
        canvas,
        canvasHeight,
        "horizontal-bottom"
      );
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  // 檢查水平中心線
  if (Math.abs(centerX - canvasWidth / 2) < snappingDistance) {
    obj.set({ left: canvasWidth / 2 - (obj.width * obj.scaleX) / 2 });
    if (!guidelineExists(canvas, "vertical-center")) {
      const line = createVerticalGuideline(
        canvas,
        canvasWidth / 2,
        "vertical-center"
      );
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  // 檢查垂直中心線
  if (Math.abs(centerY - canvasHeight / 2) < snappingDistance) {
    obj.set({ top: canvasHeight / 2 - (obj.height * obj.scaleY) / 2 });
    if (!guidelineExists(canvas, "horizontal-center")) {
      const line = createHorizontalGuideline(
        canvas,
        canvasHeight / 2,
        "horizontal-center"
      );
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  if (!snapped) {
    clearGuidelines(canvas);
  } else {
    setGuidelines(newGuidelines);
  }
};

export const clearGuidelines = (canvas: Canvas) => {
  const objects = canvas.getObjects("line") as Line[];

  objects.forEach((obj) => {
    if (
      (obj.id && obj.id.startsWith("vertical-")) ||
      obj.id.startsWith("horizontal-")
    ) {
      canvas.remove(obj);
    }
  });
  canvas.renderAll();
};

export const createVerticalGuideline = (
  canvas: Canvas,
  x: number,
  id: string
) => {
  return new Line([x, 0, x, canvas.height ?? 0], {
    id,
    stroke: "red",
    strokeWidth: 1,
    selectable: false,
    evented: false,
    strokeDashArray: [5, 5],
    opacity: 0.8,
  });
};

export const createHorizontalGuideline = (
  canvas: Canvas,
  y: number,
  id: string
) => {
  return new Line([0, y, canvas.width ?? 0, y], {
    id,
    stroke: "red",
    strokeWidth: 1,
    selectable: false,
    evented: false,
    strokeDashArray: [5, 5],
    opacity: 0.8,
  });
};

const guidelineExists = (canvas: Canvas, id: string) => {
  const objects = canvas.getObjects("line") as Line[];
  return objects.some((obj) => obj.id === id);
};
