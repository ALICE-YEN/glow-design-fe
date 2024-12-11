"use client";

import { useEffect, useRef, useState } from "react";
import {
  Canvas,
  TEvent,
  PencilBrush,
  Group,
  Line,
  Rect,
  Image,
  FabricImage,
  Polygon,
  StaticCanvas,
  Pattern,
} from "fabric";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { resetAction } from "@/store/canvasSlice";
import { CanvasAction } from "@/types/enum";
import {
  initializeCanvasWithGrid,
  drawGrid,
  setupPan,
  setupZoom,
  handleResize,
} from "@/app/design/utils/basicCanvasHelpers";
import {
  snapToGrid,
  finalizeTempLine,
  updateTempLine,
} from "@/app/design/utils/drawingHelpers";
import {
  handleObjectMoving,
  clearGuidelines,
} from "@/app/design/utils/snappingHelpers"; // 暫時修復因網格壞掉的指導線，但物件移動變很緩慢，畫布平移、縮放時還是異常!!!
import Cropping from "@/app/design/components/Cropping";
import LayerList from "@/app/design/components/LayerList";
import Sidebar from "@/app/design/components/Sidebar";
import Toolbar from "@/app/design/components/Toolbar";

type Point = { x: number; y: number };

export default function Design() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [guidelines, setGuidelines] = useState([]);

  const pointsRef = useRef<Point[]>([]); // 保存最新的點資料，用於即時操作，避免 React 狀態更新的非同步問題。
  const tempLineRef = useRef<Line | null>(null); // 表示模擬線，隨滑鼠移動動態更新，用於即時操作，避免 React 狀態更新的非同步問題。

  const selectedObjectRef = useRef<any>(null); // 選取到的物件

  const GRID_SIZE = 20; // 網格大小
  const ZOOM_FACTOR = 0.001; // 縮放比例
  const MIN_ZOOM = 0.5; // 限制最大縮放
  const MAX_ZOOM = 2; // 限制最小縮放

  const currentAction = useAppSelector((state) => state.canvas.currentAction);
  const selectedImage = useAppSelector((state) => state.canvas.selectedImage);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = initializeCanvasWithGrid(canvasRef.current, GRID_SIZE);

      initCanvas.requestRenderAll();
      setCanvas(initCanvas);

      // 縮放功能
      setupZoom(initCanvas, ZOOM_FACTOR, MIN_ZOOM, MAX_ZOOM);

      // 視窗調整後重新繪製視口，讓畫布的視窗範圍（viewport） 與視窗大小同步，而非改變畫布的內部邏輯尺寸
      const resizeHandler = () => handleResize(initCanvas);
      resizeHandler();

      // 監聽視窗大小變化
      window.addEventListener("resize", resizeHandler);

      return () => {
        window.removeEventListener("resize", resizeHandler);
        initCanvas.dispose();
      };
    }
  }, []);

  const startDrawingWall = () => {
    if (!canvas) return;

    // 重置點資料和模擬線
    pointsRef.current = [];
    tempLineRef.current = null;

    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);

    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
    };
  };

  const handleMouseDown = (event: TEvent): void => {
    if (!canvas) return;

    const pointer = canvas.getPointer(event.e);
    const x = snapToGrid(pointer.x, GRID_SIZE);
    const y = snapToGrid(pointer.y, GRID_SIZE);

    // 更新點資料
    pointsRef.current = [...pointsRef.current, { x, y }];

    // 固定模擬線為黑色直線
    finalizeTempLine(canvas, tempLineRef);

    // 檢查是否閉合
    checkClosure({ x, y });
  };

  const handleMouseMove = (event: TEvent) => {
    if (!canvas || pointsRef.current.length === 0) return;

    // 目前 handleMouseDown 的座標
    const pointer = canvas.getPointer(event.e);
    const endX = snapToGrid(pointer.x, GRID_SIZE);
    const endY = snapToGrid(pointer.y, GRID_SIZE);

    // 前次 handleMouseDown 的座標
    const { x: startX, y: startY } =
      pointsRef.current[pointsRef.current.length - 1];

    // 更新模擬線
    updateTempLine(canvas, tempLineRef, startX, startY, endX, endY);
  };

  const checkClosure = ({ x, y }: Point) => {
    if (pointsRef.current.length >= 3) {
      const { x: firstX, y: firstY } = pointsRef.current[0];
      if (
        Math.abs(x - firstX) < GRID_SIZE &&
        Math.abs(y - firstY) < GRID_SIZE
      ) {
        fillPolygonWithLinesIntoGroup(canvas, pointsRef.current);
        pointsRef.current = [];
      }
    }
  };

  const fillPolygonWithLinesIntoGroup = async (
    canvas: Canvas,
    points: Point[]
  ) => {
    // 清理舊的線
    const finalizedLines = canvas
      .getObjects("line")
      .filter((obj) => obj?.id === "finalizedLine");
    finalizedLines.forEach((obj) => canvas.remove(obj));
    // 為什麽 Group 的線不能用 finalizedLines，是因為沒照順序嗎???

    // 建立線條
    // points 有包含最後一點(就是第一個點)，閉合
    const lines = points.slice(0, -1).map((point, index) => {
      const nextPoint = points[index + 1];
      return new Line([point.x, point.y, nextPoint.x, nextPoint.y], {
        stroke: "gray",
        strokeWidth: 5,
        selectable: false,
        evented: false,
      });
    });
    console.log("lines", lines);

    // 設定 Polygon 底圖
    const imgData = await FabricImage.fromURL(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHTewZHbRfZqXytUaGYzb1YonM8-bBbGLjVA&s"
    );
    imgData.scaleToWidth(75); // Scales an object to a given width

    // 專門用來生成圖像或模式的輔助畫布，不會影響主畫布，提供了一個獨立的渲染環境，允許你創建圖案並用作其他對象的填充
    const patternSourceCanvas = new StaticCanvas();
    patternSourceCanvas.add(imgData);
    patternSourceCanvas.setDimensions({
      width: imgData.getScaledWidth(),
      height: imgData.getScaledHeight(),
    });
    patternSourceCanvas.renderAll();

    // Pattern 用來定義物件的填充模式
    const pattern = new Pattern({
      source: patternSourceCanvas.getElement(),
      repeat: "repeat",
    });

    const polygon = new Polygon(points, {
      fill: pattern,
      selectable: true,
      evented: false,
    });

    // 將 polygon、lines 組合成 Group
    const group = new Group([...lines, polygon], {
      selectable: true,
      evented: true,
    });
    console.log("group", group);
    canvas.add(group);

    // 移除 mouse:down 和 mouse:move 监听器
    canvas.off("mouse:down", handleMouseDown);
    canvas.off("mouse:move", handleMouseMove);

    canvas.renderAll();
    dispatch(resetAction());
  };

  const updateFlooringImage = async (newImageUrl: string) => {
    // Flooring 一定是 polygon
    if (
      !selectedObjectRef.current ||
      selectedObjectRef.current.type !== "polygon"
    ) {
      console.warn("請選擇房間");
      return;
    }

    const imgData = await Image.fromURL(newImageUrl);
    imgData.scaleToWidth(75);

    const patternSourceCanvas = new StaticCanvas();
    patternSourceCanvas.add(imgData);
    patternSourceCanvas.setDimensions({
      width: imgData.getScaledWidth(),
      height: imgData.getScaledHeight(),
    });
    patternSourceCanvas.renderAll();

    const pattern = new Pattern({
      source: patternSourceCanvas.getElement(),
      repeat: "repeat",
    });

    // 更新 Polygon 的填充模式
    selectedObjectRef.current.set("fill", pattern);
    selectedObjectRef.current.canvas?.renderAll();
  };

  const handleCanvasObjectSelection = (
    currentSelection: any,
    selectedObjectRef: React.MutableRefObject<any>
  ) => {
    if (currentSelection.type === "group") {
      // 如果是 Group，遍歷其中的子物件
      currentSelection._objects.forEach((obj) => {
        if (obj.type === "polygon") {
          // 處理 Group 內的 Polygon
          selectedObjectRef.current = obj as Polygon;
        }
      });
    } else {
      selectedObjectRef.current = currentSelection;
    }
  };

  useEffect(() => {
    if (!canvas) return;

    canvas.on("selection:created", (e) => {
      console.log("事件select a new object on canvas", e.selected[0]);
      handleCanvasObjectSelection(e.selected[0], selectedObjectRef);
      console.log("selectedObjectRef", selectedObjectRef);
    });
    canvas.on("selection:updated", (e) => {
      console.log("事件update the selection", e.selected[0]);
      handleCanvasObjectSelection(e.selected[0], selectedObjectRef);
    });
    canvas.on("selection:cleared", () => {
      console.log("事件deselect all objects");
      selectedObjectRef.current = null;
    });
    canvas.on("object:modified", (e) => {
      console.log(
        "事件object property is modified(resized or rotated)",
        e.target
      );
      // clearGuidelines(canvas);
    });
    canvas.on("object:scaling", (e) => {
      console.log("事件object property is scaling", e.target);
    });

    canvas.on("object:moving", (e) => {
      console.log("事件object property is moving", e.target);
      // handleObjectMoving(canvas, e.target, guidelines, setGuidelines);
    });
  }, [canvas]);

  useEffect(() => {
    if (!canvas) return;

    canvas.isDrawingMode = false;

    switch (currentAction) {
      case CanvasAction.CLEAR:
        // 1.清除所有物件後直接重新繪製網格
        canvas.clear();
        drawGrid(canvas, GRID_SIZE);

        // 2.只清除非網格物件
        // canvas.getObjects().forEach((obj) => {
        //   if (obj.data !== "grid") {
        //     canvas.remove(obj);
        //   }
        // });

        canvas.renderAll();
        break;
      case CanvasAction.SELECT_OBJECT:
        break;
      // case CanvasAction.UNDO:
      //   if (undoStack.length > 0) {
      //     const lastState = undoStack.pop();
      //     canvas.loadFromJSON(lastState, () => {
      //       canvas.renderAll();
      //     });
      //   }
      //   break;
      case CanvasAction.PAN_CANVAS:
        setupPan(canvas); // 還不知道怎麼清理事件監聽器
        break;
      case CanvasAction.DRAW_WALL:
        canvas.isDrawingMode = true;
        startDrawingWall();
        break;
      case CanvasAction.PLACE_FLOORING:
        updateFlooringImage(selectedImage);
        break;
      case CanvasAction.PLACE_FURNITURE:
      case CanvasAction.PLACE_WINDOW:
      case CanvasAction.PLACE_DOOR:
        loadFromUrl({ url: selectedImage, customWidth: 300 });
        break;
      default:
        break;
    }

    // 完成操作後，重置當前操作(除了持續性操作（如繪圖模式）不重置狀態)
    if (
      currentAction !== CanvasAction.NONE &&
      currentAction !== CanvasAction.DRAW_WALL
    ) {
      dispatch(resetAction());
    }
  }, [currentAction, canvas, dispatch, selectedImage]);

  const drawRectangle = (color: string) => {
    if (canvas) {
      const rect = new Rect({
        top: 100,
        left: 50,
        width: 100,
        height: 60,
        fill: color,
      });
      canvas.add(rect);
    }
  };

  const loadFromUrl = async ({
    url = "https://www.google.com/images/srpr/logo3w.png",
    customWidth = null, // 自定義寬度（px），默認為 null
  }: {
    url?: string;
    customWidth?: number | null;
  }) => {
    if (!canvas) return;

    const imgData = await FabricImage.fromURL(url);

    // 如果提供了自定義寬度，計算等比例縮放比例
    if (customWidth && imgData.width) {
      const scaleFactor = customWidth / imgData.width; // 計算縮放比例
      imgData.scale(scaleFactor); // 等比例縮放
    }

    imgData.set({
      left:
        canvas.getWidth() / 2 -
        (customWidth ? imgData.getScaledWidth() : imgData.width) / 2,
      top:
        canvas.getHeight() / 2 -
        (customWidth ? imgData.getScaledHeight() : imgData.height) / 2,
    });

    canvas.add(imgData);
    // imgData.setCoords(); // 當對象的屬性（如位置、縮放、旋轉）通過程式碼修改時，需要調用 setCoords()，以同步內部的坐標數據
    canvas.renderAll();
  };

  const handleFramesUpdated = () => {
    console.log("handleFramesUpdated");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target.result; // Base64 URL
      loadFromUrl({ url: result, customWidth: 300 });
    };

    reader.readAsDataURL(file); // 將文件讀取為 Base64 格式 URL
  };

  return (
    <main className="flex h-screen relative">
      <canvas
        id="canvas"
        ref={canvasRef}
        className="w-full h-full block"
      ></canvas>

      <Toolbar />

      <Sidebar />

      <div
        style={{
          position: "fixed",
          bottom: "10px",
          left: "10px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={() => drawRectangle("blue")}
          style={{ marginRight: "10px" }}
        >
          Draw Rectangle1
        </button>
        <button
          onClick={() => drawRectangle("red")}
          style={{ marginRight: "10px" }}
        >
          Draw Rectangle2
        </button>

        <button
          onClick={() => loadFromUrl({ customWidth: 300 })}
          style={{ marginRight: "10px" }}
        >
          loadFromUrl
        </button>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          style={{ position: "absolute", top: 10, left: 10, zIndex: 1000 }}
        />

        <Cropping canvas={canvas} onFramesUpdate={handleFramesUpdated} />
        {/* <LayerList canvas={canvas} /> */}

        <p>currentAction: {currentAction}</p>
        <p>selectedImage: {selectedImage}</p>
      </div>
    </main>
  );
}
