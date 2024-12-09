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
} from "fabric";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { resetAction } from "@/store/canvasSlice";
import { CanvasAction } from "@/types/enum";
import {
  initializeCanvas,
  fitCanvasToWindowAndDrawGrid,
} from "@/app/design/utils/basicCanvasHelpers";
import {
  snapToGrid,
  finalizeTempLine,
  updateTempLine,
} from "@/app/design/utils/drawingHelpers";
import {
  handleObjectMoving,
  clearGuidelines,
} from "@/app/design/utils/snappingHelpers";
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
  const [points, setPoints] = useState([]); // 用於追蹤點座標  這還需要嗎？
  const gridSize = 20; // 網格大小

  const currentAction = useAppSelector((state) => state.canvas.currentAction);
  const selectedImage = useAppSelector((state) => state.canvas.selectedImage);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = initializeCanvas(canvasRef.current);

      initCanvas.requestRenderAll();
      setCanvas(initCanvas);

      // 調整 Canvas 尺寸為視窗大小並繪製網格
      const handleResize = () =>
        fitCanvasToWindowAndDrawGrid(initCanvas, gridSize);

      // 初次設定
      handleResize();

      // 監聽視窗大小變化
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        initCanvas.dispose();
      };
    }
  }, []);

  const startDrawing = () => {
    if (!canvas) return;

    // 重置點資料和模擬線
    setPoints([]);
    pointsRef.current = [];
    tempLineRef.current = null;

    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);

    return () => {
      console.log("startDrawing return");
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
    };
  };

  const checkClosure = (x, y) => {
    if (pointsRef.current.length >= 3) {
      const { x: firstX, y: firstY } = pointsRef.current[0];
      if (Math.abs(x - firstX) < gridSize && Math.abs(y - firstY) < gridSize) {
        fillPolygonWithLines(canvas, [
          ...pointsRef.current,
          { x: firstX, y: firstY },
        ]);
        pointsRef.current = [];
        setPoints([]);
      }
    }
  };

  const handleMouseDown = (event: TEvent): void => {
    if (!canvas) return;

    const pointer = canvas.getPointer(event.e);
    const x = snapToGrid(pointer.x, gridSize);
    const y = snapToGrid(pointer.y, gridSize);

    // 更新點資料
    pointsRef.current = [...pointsRef.current, { x, y }];
    setPoints(pointsRef.current);

    // 固定模擬線為黑色直線
    finalizeTempLine(canvas, tempLineRef);

    // 檢查是否閉合
    checkClosure(x, y);
  };

  const handleMouseMove = (event: TEvent) => {
    if (!canvas || pointsRef.current.length === 0) return;

    // 目前 handleMouseDown 的座標
    const pointer = canvas.getPointer(event.e);
    const endX = snapToGrid(pointer.x, gridSize);
    const endY = snapToGrid(pointer.y, gridSize);

    // 前次 handleMouseDown 的座標
    const { x: startX, y: startY } =
      pointsRef.current[pointsRef.current.length - 1];

    // 更新模擬線
    updateTempLine(canvas, tempLineRef, startX, startY, endX, endY);
  };

  const fillPolygonWithLines = (canvas: Canvas, points: Point[]) => {
    // 建立線條
    // const lines = points.map((point, index) => {
    //   const nextPoint = points[(index + 1) % points.length]; // 确保最后一个点连接到第一个点，形成闭合？？？
    //   return new Line([point.x, point.y, nextPoint.x, nextPoint.y], {
    //     stroke: "black",
    //     strokeWidth: 2,
    //     selectable: false, // 保持不可独立选中
    //     evented: false,
    //   });
    // });
    // console.log("lines", lines);

    // 將線條組合成 Group
    // const group = new Group(lines, {
    //   fill: "rgba(0, 255, 0, 0.3)", // 设置填充色
    //   selectable: true, // 整体可选
    //   evented: true, // 响应事件
    // });
    // console.log("group", group);
    // canvas.add(group);

    const polygon = new Polygon(points, {
      fill: "rgba(0, 255, 0, 0.3)",
      selectable: true,
      // evented: false,
    });
    canvas.add(polygon);

    // 移除 mouse:down 和 mouse:move 监听器
    canvas.off("mouse:down", handleMouseDown);
    canvas.off("mouse:move", handleMouseMove);

    canvas.renderAll();
    dispatch(resetAction());
  };

  useEffect(() => {
    if (!canvas) return;

    canvas.on("selection:created", (e) => {
      // console.log("select a new object on canvas", e.selected[0]);
    });
    canvas.on("selection:updated", (e) => {
      // console.log("update the selection", e.selected[0]);
    });
    canvas.on("selection:cleared", () => {
      // console.log("deselect all objects");
    });
    canvas.on("object:modified", (e) => {
      // console.log(
      //   "object property is modified(resized or rotated)",
      //   e.target
      // );
      // clearGuidelines(initCanvas, guidelines, setGuidelines);
      clearGuidelines(canvas);
    });
    canvas.on("object:scaling", (e) => {
      // console.log("object property is scaling", e.target);
    });

    canvas.on("object:moving", (e) => {
      handleObjectMoving(canvas, e.target, guidelines, setGuidelines);
    });
  }, [canvas, currentAction]);

  useEffect(() => {
    if (!canvas) return;

    canvas.isDrawingMode = false;

    switch (currentAction) {
      case CanvasAction.CLEAR:
        canvas.clear();
        canvas.backgroundColor = "#B2AC88"; // 恢復背景色
        canvas.renderAll();
        break;
      case CanvasAction.SELECT_OBJECT:
        break;
      case CanvasAction.DRAW:
        canvas.isDrawingMode = true;
        // const pencilBrush = new PencilBrush(canvas); // 畫出的路徑是 fabric.Path 對象，可以在後續檢查是否形成封閉的形狀（比如檢查起點和終點是否相連）
        // canvas.freeDrawingBrush = pencilBrush;
        // pencilBrush.width = 10;
        // pencilBrush.drawStraightLine = true;
        // pencilBrush.straightLineKey = "shiftKey";
        // pencilBrush.strokeLineCap = "square"; // 線條端點樣式
        // pencilBrush.strokeLineJoin = "miter"; // 線條拐角樣式
        // pencilBrush.strokeMiterLimit = 100;

        // canvas.on("path:created", (event) => {
        //   const path = event.path; // 獲取繪製的路徑
        //   console.log("Path created:", path);

        //   // 可在此檢查是否為封閉形狀
        //   const isClosed = checkIfPathIsClosed(path);
        //   if (isClosed) {
        //     console.log("Path is closed: 密閉格局完成");
        //   } else {
        //     console.log("Path is not closed: 尚未完成格局");
        //   }
        // });

        startDrawing();

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
      currentAction !== CanvasAction.DRAW
    ) {
      dispatch(resetAction());
    }
  }, [currentAction, canvas, dispatch, selectedImage]);

  // function checkIfPathIsClosed(path) {
  //   const points = path.path; // 獲取路徑點數據
  //   if (points.length < 2) return false;

  //   // 檢查起點和終點是否重合
  //   const [startX, startY] = points[0].slice(1); // 起點
  //   const [endX, endY] = points[points.length - 1].slice(1); // 終點

  //   const tolerance = 50; // 容許誤差範圍
  //   return (
  //     Math.abs(startX - endX) < tolerance && Math.abs(startY - endY) < tolerance
  //   );
  // }

  // 繪製網格
  //   const drawGrid = (canvas: Canvas, gridSize: number) => {};

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
    console.log("imgData", imgData);

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

    // const json = canvas.toJSON(); // 導出畫布狀態
    // console.log("Canvas JSON:", json);
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
          // ref={inputRef}
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
