import {
  Canvas,
  Line,
  StaticCanvas,
  FabricImage,
  Pattern,
  TEvent,
} from "fabric";
import { FINALIZED_LINE_ID } from "@/utils/constants";
import { Point as IPoint } from "@/app/design/[slug]/types/interfaces";

export const snapToGrid = (value: number, gridSize: number): number => {
  return Math.round(value / gridSize) * gridSize;
};

// 將滑鼠指針的位置對齊到網格上，返回修正後的座標點
export const getSnappedPointer = (
  canvasInstance: Canvas,
  event: TEvent,
  gridSize: number
): IPoint => {
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
  points: IPoint[],
  { x: endX, y: endY }: IPoint,
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
  // 不僅是顯示圖片，而是要讀取（嘗試讀進瀏覽器內記憶體、導出圖片資料），安全等級高，需要 CORS 檢查與明確授權（前端設定 crossOrigin + 後端 CORS 回應）
  // 瀏覽器假設你只是要「看」，不打算「用」，所以瀏覽器預設不送 Origin，直到你主動說：「我想讀裡面內容」（加了 crossOrigin）。對比：fetch/axios 涉及資料存取、帳戶狀態等，所以瀏覽器預設送 Origin 來讓伺服器做 CORS 檢查
  const imgData = await FabricImage.fromURL(imageUrl, {
    crossOrigin: "anonymous", // 我想從別的網域載入這個資源，但我不會帶 cookie，也不需要帳號資訊，請允許我安全地讀它
  });
  // 瀏覽器要確保你載入的是「合法授權用來畫圖」的圖片。前端不設，瀏覽器就不發 Origin，後端也就不給 Access-Control-Allow-Origin（伺服器在回應 HTTP 請求時送給瀏覽器的安全指令）

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
