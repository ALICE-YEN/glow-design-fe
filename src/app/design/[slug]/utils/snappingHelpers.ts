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
  const transform = canvas.viewportTransform || [1, 0, 0, 1, 0, 0]; // Fabric.js 中表示畫布縮放和平移狀態的陣列
  const scaleX = transform[0]; // 畫布的水平縮放比例
  const scaleY = transform[3]; // 畫布的垂直縮放比例
  const translateX = transform[4]; // 畫布的平移偏移量
  const translateY = transform[5]; // 畫布的平移偏移量

  // 將畫布的寬高除以縮放比例，得到實際的邏輯尺寸（即未被縮放的尺寸）
  const canvasWidth = (canvas.width ?? 0) / scaleX;
  const canvasHeight = (canvas.height ?? 0) / scaleY;

  // 計算物件的左上角座標，考慮畫布的縮放和平移
  const left = (obj.left ?? 0) / scaleX - translateX / scaleX;
  const top = (obj.top ?? 0) / scaleY - translateY / scaleY;

  // 物件的寬高，考慮物件縮放比例和畫布縮放比例
  const width = ((obj.width ?? 0) * (obj.scaleX ?? 1)) / scaleX;
  const height = ((obj.height ?? 0) * (obj.scaleY ?? 1)) / scaleY;

  const right = left + width;
  const bottom = top + height;

  // 物件的中心點坐標
  const centerX = left + width / 2;
  const centerY = top + height / 2;

  const newGuidelines = [];
  clearGuidelines(canvas);

  // 物件是否發生了吸附
  let snapped = false;

  // 檢查左邊界
  if (Math.abs(left) < snappingDistance) {
    obj.set({ left: translateX });
    // 檢查是否已經存在一條 ID 為 vertical-left 的指導線。如果不存在，創建一條垂直線並添加到畫布上。
    if (!guidelineExists(canvas, "vertical-left")) {
      const line = createVerticalGuideline(canvas, translateX, "vertical-left");
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  // 檢查上邊界
  if (Math.abs(top) < snappingDistance) {
    obj.set({ top: translateY });
    if (!guidelineExists(canvas, "horizontal-top")) {
      const line = createHorizontalGuideline(
        canvas,
        translateY,
        "horizontal-top"
      );
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  // 檢查右邊界
  if (Math.abs(right - canvasWidth) < snappingDistance) {
    obj.set({ left: canvasWidth - width + translateX });
    if (!guidelineExists(canvas, "vertical-right")) {
      const line = createVerticalGuideline(
        canvas,
        canvasWidth + translateX,
        "vertical-right"
      );
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  // 檢查下邊界
  if (Math.abs(bottom - canvasHeight) < snappingDistance) {
    obj.set({ top: canvasHeight - height + translateY });
    if (!guidelineExists(canvas, "horizontal-bottom")) {
      const line = createHorizontalGuideline(
        canvas,
        canvasHeight + translateY,
        "horizontal-bottom"
      );
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  // 檢查水平中心線
  if (Math.abs(centerX - canvasWidth / 2) < snappingDistance) {
    obj.set({ left: canvasWidth / 2 - width / 2 + translateX });
    if (!guidelineExists(canvas, "vertical-center")) {
      const line = createVerticalGuideline(
        canvas,
        canvasWidth / 2 + translateX,
        "vertical-center"
      );
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  // 檢查垂直中心線
  if (Math.abs(centerY - canvasHeight / 2) < snappingDistance) {
    obj.set({ top: canvasHeight / 2 - height / 2 + translateY });
    if (!guidelineExists(canvas, "horizontal-center")) {
      const line = createHorizontalGuideline(
        canvas,
        canvasHeight / 2 + translateY,
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
      (obj?.id && obj?.id?.startsWith("vertical-")) ||
      obj?.id?.startsWith("horizontal-")
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
    id, // 自定義標記
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
    id, // 自定義標記
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
