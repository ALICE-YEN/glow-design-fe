"use client"; // CSR 模式

import { Canvas, Rect, Object } from "fabric";

interface CroppingProps {
  canvas: Canvas;
  onFramesUpdate: () => void;
}

export default function Cropping({ canvas, onFramesUpdate }: CroppingProps) {
  const addFrameToCanvas = () => {
    // 基於當前畫布中矩形物件的數量來生成唯一名稱。
    const frameName = `Frame ${canvas.getObjects("rect").length + 1}`;

    const frame = new Rect({
      left: 100,
      top: 100,
      width: 200,
      height: 200,
      fill: "transparent",
      stroke: "#07FE3D",
      strokeWidth: 1,
      selectable: true, // 設置矩形可選擇
      evented: true, // 使矩形響應事件
      name: frameName,
    });

    canvas.add(frame);
    canvas.renderAll();

    // 在矩形框縮放變換過程中維持邊框的寬度
    const maintainStrokeWidth = (object: Object) => {
      const scaleX = object.scaleX || 1;
      const scaleY = object.scaleY || 1;

      object.set({
        width: object.width * scaleX,
        height: object.height * scaleY,
        scaleX: 1,
        scaleY: 1,
        strokeWidth: 1,
      });

      // 在更改後更新物件的坐標
      object.setCoords();
    };

    frame.on("scaling", () => {
      maintainStrokeWidth(frame);
      canvas.renderAll();
    });

    frame.on("modified", () => {
      maintainStrokeWidth(frame);
      canvas.renderAll();
    });

    onFramesUpdate();
  };

  const exportFrameAsPNG = () => {
    const framesFromCanvas = canvas.getObjects("rect").filter((obj) => {
      return obj.name && obj.name.startsWith("Frame");
    });
    const selectedFrame = framesFromCanvas[0];
    console.log("檢查rect1", canvas.getObjects("rect"));
    console.log("檢查rect2", selectedFrame);

    if (selectedFrame) {
      const dataURL = canvas.toDataURL({
        left: selectedFrame.left,
        top: selectedFrame.top,
        width: selectedFrame.width * selectedFrame.scaleX,
        height: selectedFrame.height * selectedFrame.scaleY,
        format: "png",
      });

      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `${selectedFrame.name}.png`;
      link.click();

      canvas.remove(selectedFrame);
      canvas.renderAll();
    }
  };

  return (
    <>
      <button onClick={addFrameToCanvas} style={{ marginRight: "10px" }}>
        Add Frame To Canvas
      </button>
      <button onClick={exportFrameAsPNG} style={{ marginRight: "10px" }}>
        Export Frame As PNG
      </button>
    </>
  );
}
