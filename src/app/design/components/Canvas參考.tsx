"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas, Line, Rect } from "fabric";

export default function DesignPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );

  const gridSize = 20; // 網格大小

  useEffect(() => {
    if (canvasRef.current) {
      // 初始化 Fabric.js Canvas
      const fabricCanvas = new Canvas(canvasRef.current, {
        backgroundColor: "#ffffff",
        selection: false, // 禁用組選框
      });
      console.log("fabricCanvas", fabricCanvas);
      fabricCanvasRef.current = fabricCanvas;

      // 設置 Canvas 的初始大小為窗口大小
      const resizeCanvas = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        fabricCanvas.setWidth(width);
        fabricCanvas.setHeight(height);
        fabricCanvas.renderAll();

        // 重新繪製網格
        drawGrid(fabricCanvas, gridSize);
      };

      // 初始化畫布大小和網格
      resizeCanvas();

      // 監聽窗口大小變化
      window.addEventListener("resize", resizeCanvas);

      // 清理事件
      return () => {
        window.removeEventListener("resize", resizeCanvas);
        fabricCanvas.dispose(); // 清理畫布
      };
    }
  }, []);

  // 繪製網格
  const drawGrid = (canvas: Canvas, gridSize: number) => {
    const width = canvas.getWidth();
    const height = canvas.getHeight();

    // 移除舊的網格
    canvas.getObjects("line").forEach((line) => canvas.remove(line));

    // 繪製新網格
    for (let i = 0; i <= width; i += gridSize) {
      // 垂直線
      canvas.add(
        new Line([i, 0, i, height], {
          stroke: "#ccc",
          selectable: false,
          evented: false,
        })
      );
    }

    for (let j = 0; j <= height; j += gridSize) {
      // 水平線
      canvas.add(
        new Line([0, j, width, j], {
          stroke: "#ccc",
          selectable: false,
          evented: false,
        })
      );
    }

    // 渲染畫布
    canvas.renderAll();
  };

  // 繪製矩形
  const drawRectangle = () => {
    if (fabricCanvasRef.current) {
      const rect = new Rect({
        left: 100,
        top: 100,
        fill: "blue",
        width: 200,
        height: 100,
      });
      fabricCanvasRef.current.add(rect);
    }
  };

  // 繪製線條
  const drawLine = () => {};

  // 清空畫布（保留網格）
  const clearCanvas = () => {
    if (fabricCanvasRef.current) {
      const canvas = fabricCanvasRef.current;
      // 清空畫布的所有物件
      canvas.clear();
      // 重繪網格
      drawGrid(canvas, 50);
    }
  };

  return (
    <div>
      <canvas ref={canvasRef} style={{ display: "block" }}></canvas>
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
        <button onClick={drawRectangle} style={{ marginRight: "10px" }}>
          Draw Rectangle
        </button>
        <button onClick={clearCanvas}>Clear Canvas</button>
      </div>
    </div>
  );
}
