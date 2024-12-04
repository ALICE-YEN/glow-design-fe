"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, Line, Rect, Image } from "fabric";
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
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (canvasRef.current) {
      // 初始化 Fabric.js Canvas
      const initCanvas = new Canvas(canvasRef.current, {
        // backgroundColor: "#FFFFF0",
        backgroundColor: "#B2AC88",
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

      initCanvas.on("selection:created", (e) => {
        // console.log("select a new object on canvas", e.selected[0]);
      });
      initCanvas.on("selection:updated", (e) => {
        // console.log("update the selection", e.selected[0]);
      });
      initCanvas.on("selection:cleared", () => {
        // console.log("deselect all objects");
      });
      initCanvas.on("object:modified", (e) => {
        // console.log(
        //   "object property is modified(resized or rotated)",
        //   e.target
        // );
        // clearGuidelines(initCanvas, guidelines, setGuidelines);
        clearGuidelines(initCanvas);
      });
      initCanvas.on("object:scaling", (e) => {
        // console.log("object property is scaling", e.target);
      });

      initCanvas.on("object:moving", (e) => {
        handleObjectMoving(initCanvas, e.target, guidelines, setGuidelines);
      });

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

    switch (currentAction) {
      case CanvasAction.CLEAR:
        canvas.clear();
        break;
      default:
        break;
    }

    // 完成操作後，重置當前操作
    if (currentAction !== CanvasAction.NONE) {
      dispatch(resetAction());
    }
  }, [currentAction, canvas, dispatch]);

  // 繪製網格
  //   const drawGrid = (canvas: Canvas, gridSize: number) => {};

  // 繪製矩形
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

  // 繪製線條
  const drawLine = () => {};

  // 清空畫布（保留網格）
  const clearCanvas = () => {
    if (canvas) {
      canvas.clear();
    }
  };

  const handleFramesUpdated = () => {
    console.log("handleFramesUpdated");
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
        <button onClick={drawLine} style={{ marginRight: "10px" }}>
          Draw Line
        </button>
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
        <button onClick={clearCanvas}>Clear Canvas</button>

        <Cropping canvas={canvas} onFramesUpdate={handleFramesUpdated} />
        <LayerList canvas={canvas} />

        <p>currentAction: {currentAction}</p>
      </div>
    </div>
  );
}
