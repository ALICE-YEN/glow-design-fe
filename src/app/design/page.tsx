"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, PencilBrush, Line, Rect, Image, FabricImage } from "fabric";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { setZoom, resetAction } from "@/store/canvasSlice";
import { CanvasAction } from "@/types/enum";
import {
  handleObjectMoving,
  clearGuidelines,
} from "@/app/design/utils/snappingHelpers";
import Cropping from "@/app/design/components/Cropping";
import LayerList from "@/app/design/components/LayerList";
import Sidebar from "@/app/design/components/Sidebar";
import Toolbar from "@/app/design/components/Toolbar";

export default function CanvasComponent() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [guidelines, setGuidelines] = useState([]);

  const currentAction = useAppSelector((state) => state.canvas.currentAction);
  const selectedImage = useAppSelector((state) => state.canvas.selectedImage);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (canvasRef.current) {
      // 初始化 Fabric.js Canvas
      const initCanvas = new Canvas(canvasRef.current, {
        // backgroundColor: "#FFFFF0",
        backgroundColor: "#B2AC88",
        isDrawingMode: false, // 畫布的繪畫模式
      });

      initCanvas.requestRenderAll();
      setCanvas(initCanvas);

      // 設置 Canvas 的大小為窗口大小
      const resizeCanvas = () => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        initCanvas.setWidth(windowWidth);
        initCanvas.setHeight(windowHeight);
      };
      // 初始化畫布大小和網格
      resizeCanvas();

      // 監聽窗口大小變化
      window.addEventListener("resize", resizeCanvas);

      return () => {
        window.removeEventListener("resize", resizeCanvas);
        initCanvas.dispose();
      };
    }
  }, []);

  useEffect(() => {
    if (!canvas) return;

    // let startPoint = [];
    // let endPoint = [];

    // const handleMouseDown = (event) => {
    //   if (currentAction === CanvasAction.DRAW) {
    //     const pointer = canvas.getPointer(event.e);

    //     if (!startPoint.length) {
    //       startPoint = [pointer.x, pointer.y];
    //     } else {
    //       endPoint = [pointer.x, pointer.y];

    //       const line = new Line([...startPoint, ...endPoint], {
    //         stroke: "black",
    //         strokeWidth: 2,
    //         selectable: false,
    //         evented: false, // 不响应其他事件
    //       });
    //       canvas.add(line);

    //       startPoint = endPoint;
    //       endPoint = [];
    //     }
    //   }
    // };

    // canvas.on("mouse:down", handleMouseDown);
    // canvas.on("mouse:move", handleMouseMove);
    // canvas.on("mouse:up", handleMouseUp);

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
        canvas.freeDrawingBrush = new PencilBrush(canvas);
        canvas.freeDrawingBrush.color = "gray";
        canvas.freeDrawingBrush.width = 10;
        canvas.freeDrawingBrush.drawStraightLine = true;
        canvas.freeDrawingBrush.straightLineKey = "shiftKey";
        canvas.freeDrawingBrush.strokeLineCap = "square";
        canvas.freeDrawingBrush.strokeLineJoin = "miter";
        canvas.freeDrawingBrush.strokeMiterLimit = 100;
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
    <div className="flex h-screen relative">
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
        <LayerList canvas={canvas} />

        <p>currentAction: {currentAction}</p>
        <p>selectedImage: {selectedImage}</p>
      </div>
    </div>
  );
}
