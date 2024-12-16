// useCallback dependency 到底應不應該放 useRef

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Canvas,
  TEvent,
  Group,
  Line,
  Rect,
  FabricImage,
  Polygon,
  Point,
} from "fabric";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { setAction, resetAction } from "@/store/canvasSlice";
import { CanvasAction } from "@/types/enum";
import { Point as IPoint } from "@/app/design/types/interfaces";
import {
  initializeCanvasWithGrid,
  drawGrid,
  setupZoom,
  handleResize,
} from "@/app/design/utils/basicCanvasHelpers";
import {
  getSnappedPointer,
  finalizeTempLine,
  updateTempLine,
  checkClosure,
  createPatternFromImage,
} from "@/app/design/utils/drawingHelpers";
import {
  handleObjectMoving,
  clearGuidelines,
} from "@/app/design/utils/snappingHelpers"; // 暫時修復因網格壞掉的指導線，但物件移動變很緩慢，畫布平移、縮放時還是異常!!!
import Cropping from "@/app/design/components/Cropping";
import LayerList from "@/app/design/components/LayerList";
import Sidebar from "@/app/design/components/Sidebar";
import Toolbar from "@/app/design/components/Toolbar";

export default function Design() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [guidelines, setGuidelines] = useState([]);

  const isPanningRef = useRef<boolean>(false); // 可否平移畫布

  const pointsRef = useRef<IPoint[]>([]); // 保存最新的點資料，用於即時操作，避免 React 狀態更新的非同步問題。
  const tempLineRef = useRef<Line | null>(null); // 表示模擬線，隨滑鼠移動動態更新，用於即時操作，避免 React 狀態更新的非同步問題。

  const selectedObjectRef = useRef<any>(null); // 選取到的物件

  const CANVAS_WIDTH = 3000; // 邏輯畫布寬度
  const CANVAS_HEIGHT = 3000; // 邏輯畫布高度
  const GRID_SIZE = 20; // 網格大小
  const ZOOM_FACTOR = 0.001; // 縮放比例
  const MIN_ZOOM = 0.5; // 限制最大縮放
  const MAX_ZOOM = 2; // 限制最小縮放
  const FLOORING_PATTERN_IMG_WIDTH = 75; // 地板圖案中使用的圖片寬度（用於生成模式填充）

  const currentAction = useAppSelector((state) => state.canvas.currentAction);
  const selectedImage = useAppSelector((state) => state.canvas.selectedImage);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = initializeCanvasWithGrid(
        canvasRef.current,
        GRID_SIZE,
        CANVAS_WIDTH,
        CANVAS_HEIGHT
      );

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

  const togglePanMode = (enable: boolean) => {
    if (!canvas) return;

    if (enable) {
      console.log("啟用平移模式，綁定平移事件");
      canvas.on("mouse:down", handlePanMouseDown);
      canvas.on("mouse:move", handlePanMouseMove);
      canvas.on("mouse:up", handlePanMouseUp);
    } else {
      console.log("停用平移模式，解除事件綁定");
      canvas.off("mouse:down", handlePanMouseDown);
      canvas.off("mouse:move", handlePanMouseMove);
      canvas.off("mouse:up", handlePanMouseUp);
      console.log("監聽的事件", canvas.__eventListeners);
    }
  };

  const startPanMode = () => togglePanMode(true);
  const stopPanMode = () => togglePanMode(false);

  const handlePanMouseDown = useCallback(() => {
    isPanningRef.current = true;
  }, [isPanningRef]);

  const handlePanMouseUp = useCallback(() => {
    isPanningRef.current = false;
  }, [isPanningRef]);

  const handlePanMouseMove = useCallback(
    (opt: any) => {
      if (!canvas) return;

      if (isPanningRef.current && opt.e) {
        // opt.e.movementX：滑鼠自上一次事件到目前事件在 X 軸 上的移動距離（以像素為單位）。
        // opt.e.movementY：滑鼠自上一次事件到目前事件在 Y 軸 上的移動距離。
        const delta = new Point(opt.e.movementX, opt.e.movementY);

        // 用於相對平移畫布的視口。平移的效果是整個畫布（內容和背景）一起移動，但實際上只是改變了視口的偏移量。
        canvas.relativePan(delta);
      }
    },
    [canvas, isPanningRef]
  );

  const toggleDrawingMode = (enable: boolean) => {
    if (!canvas) return;

    if (enable) {
      if (pointsRef.current.length === 0) {
        console.log("開始新的牆體繪製");
      } else {
        console.log("繼續未完成牆體的繪製, 點數: ", pointsRef.current.length);
      }

      console.log("綁定繪圖事件");
      canvas.on("mouse:down", handleDrawMouseDown);
      canvas.on("mouse:move", handleDrawMouseMove);
    } else {
      console.log("解除繪圖事件綁定");
      canvas.off("mouse:down", handleDrawMouseDown);
      canvas.off("mouse:move", handleDrawMouseMove);
    }
  };
  const startDrawingWall = () => toggleDrawingMode(true);
  const stopDrawingWall = () => toggleDrawingMode(false);

  const cleanupTempLine = () => {
    if (canvas && tempLineRef.current) {
      canvas.remove(tempLineRef.current);
      tempLineRef.current = null;
    }
  };

  const handleDrawMouseDown = useCallback(
    (event: TEvent): void => {
      if (!canvas) return;

      // 目前的座標
      const { x, y } = getSnappedPointer(canvas, event, GRID_SIZE);

      // 更新點資料
      pointsRef.current = [...pointsRef.current, { x, y }];

      // 固定模擬線為不同顏色的直線
      finalizeTempLine(canvas, tempLineRef);

      // 檢查 points 組合成的線是否閉合
      if (checkClosure(pointsRef.current, { x, y }, GRID_SIZE)) {
        console.log("檢測到封閉空間，創建房間");
        fillPolygonWithLinesIntoGroup(canvas, pointsRef.current);

        // 重置點資料
        pointsRef.current = [];
      }
    },
    [canvas, pointsRef, tempLineRef]
  );

  const handleDrawMouseMove = useCallback(
    (event: TEvent) => {
      if (!canvas || pointsRef.current.length === 0) return;

      // 目前的座標
      const { x: endX, y: endY } = getSnappedPointer(canvas, event, GRID_SIZE);

      // 前次 handleMouseDown 的座標
      const { x: startX, y: startY } =
        pointsRef.current[pointsRef.current.length - 1];

      // 更新模擬線
      updateTempLine(canvas, tempLineRef, startX, startY, endX, endY);
    },
    [canvas, pointsRef, tempLineRef]
  );

  const fillPolygonWithLinesIntoGroup = async (
    canvas: Canvas,
    points: IPoint[]
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

    // Pattern 用來定義 Polygon 的填充模式
    const pattern = await createPatternFromImage(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHTewZHbRfZqXytUaGYzb1YonM8-bBbGLjVA&s",
      FLOORING_PATTERN_IMG_WIDTH
    );

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
    canvas.add(group);
    dispatch(setAction(CanvasAction.EXIT_DRAW_WALL));

    // 移除 mouse:down 和 mouse:move 監聽器
    stopDrawingWall();

    canvas.requestRenderAll();
  };

  const updateFlooringImage = async (newImageUrl: string) => {
    // Flooring 一定是 polygon
    if (
      !selectedObjectRef.current ||
      selectedObjectRef.current.type !== "polygon"
    ) {
      window.alert("請選擇房間");
      return;
    }

    // Pattern 用來定義 Polygon 的填充模式
    const pattern = await createPatternFromImage(
      newImageUrl,
      FLOORING_PATTERN_IMG_WIDTH
    );

    // 更新 Polygon 的填充模式
    selectedObjectRef.current.set("fill", pattern);
    selectedObjectRef.current.canvas?.requestRenderAll();
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
      // console.log("事件select a new object on canvas", e.selected[0]);
      handleCanvasObjectSelection(e.selected[0], selectedObjectRef);
    });
    canvas.on("selection:updated", (e) => {
      // console.log("事件update the selection", e.selected[0]);
      handleCanvasObjectSelection(e.selected[0], selectedObjectRef);
    });
    canvas.on("selection:cleared", () => {
      // console.log("事件deselect all objects");
      selectedObjectRef.current = null;
    });
    canvas.on("object:modified", (e) => {
      // console.log(
      //   "事件object property is modified(resized or rotated)",
      //   e.target
      // );
      // clearGuidelines(canvas);
    });
    canvas.on("object:scaling", (e) => {
      // console.log("事件object property is scaling", e.target);
    });

    canvas.on("object:moving", (e) => {
      // console.log("事件object property is moving", e.target);
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
        drawGrid(canvas, GRID_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT);

        // 2.只清除非網格物件
        // canvas.getObjects().forEach((obj) => {
        //   if (obj.data !== "grid") {
        //     canvas.remove(obj);
        //   }
        // });

        pointsRef.current = []; // 重置點資料和模擬線
        cleanupTempLine();
        stopDrawingWall(); // 移除 mouse:down 和 mouse:move 監聽器

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
        startPanMode();
        break;
      case CanvasAction.DRAW_WALL:
        canvas.isDrawingMode = true;
        startDrawingWall();
        break;
      case CanvasAction.EXIT_DRAW_WALL:
        canvas.isDrawingMode = false;
        cleanupTempLine();
        stopDrawingWall(); // 移除 mouse:down 和 mouse:move 監聽器

        if (pointsRef.current.length > 0) {
          console.log("未形成封閉空間，未完成牆體");
        }

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

    if (currentAction !== CanvasAction.PAN_CANVAS) {
      stopPanMode();
    }

    // 完成操作後，重置當前操作(除了持續性操作（如繪圖模式）不重置狀態)
    if (
      ![
        CanvasAction.NONE,
        CanvasAction.DRAW_WALL,
        CanvasAction.SELECT_OBJECT,
        CanvasAction.PAN_CANVAS,
      ].includes(currentAction)
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

    // 將圖片放置在畫布的絕對中心點
    imgData.set({
      left: CANVAS_WIDTH / 2,
      top: CANVAS_HEIGHT / 2,
      originX: "center",
      originY: "center",
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
