"use client"; // CSR 模式

import { useEffect } from "react";
import { Canvas, Rect, Object } from "fabric";
import { useAppSelector, useAppDispatch } from "@/services/redux/hooks";
import { resetAction } from "@/store/canvasSlice";
import { computeBoundingRect } from "@/app/design/[slug]/utils/basicCanvasHelpers";
import {
  GRID_LINE_ID,
  CHOOSE_CUSTOMIZED_IMG_PADDING,
  CHOOSE_CUSTOMIZED_IMG_DEFAULT_WIDTH_HEIGHT,
} from "@/app/design/[slug]/utils/constants";
import { CanvasAction } from "@/types/enum";

interface CroppingProps {
  canvas: Canvas;
}

export default function Cropping({ canvas }: CroppingProps) {
  const dispatch = useAppDispatch();
  const currentAction = useAppSelector((state) => state.canvas.currentAction);

  useEffect(() => {
    if (currentAction === CanvasAction.CHOOSE_IMG_BY_CUSTOMIZED) {
      addFrameToCanvas();
      dispatch(resetAction()); // Reset action after adding a frame
    } else if (currentAction === CanvasAction.EXPORT_PNG) {
      exportFrameAsPNG();
      dispatch(resetAction()); // Reset action after exporting
    }
  }, [currentAction, dispatch]);

  const addFrameToCanvas = () => {
    let dimensions: {
      left: number;
      top: number;
      width: number;
      height: number;
    };

    const objects = canvas
      .getObjects()
      .filter((obj) => obj.id !== GRID_LINE_ID);

    if (objects.length === 0) {
      // 若畫布上沒有物件，則用預設中心與尺寸
      dimensions = getDefaultFrameDimensions(canvas);
    } else {
      // 根據畫布上所有物件計算出包圍盒，再加上 padding 來決定框架的尺寸與位置
      dimensions = getContentFrameDimensions(objects);
    }

    const frameName = `GlowDesign_${new Date()
      .toLocaleString("zh-TW", {
        timeZone: "Asia/Taipei",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(/\//g, "")
      .replace(" ", "")
      .replace(":", "")}`;

    const frame = new Rect({
      left: dimensions.left,
      top: dimensions.top,
      width: dimensions.width,
      height: dimensions.height,
      fill: "transparent",
      stroke: "#07FE3D",
      strokeWidth: 1,
      selectable: true, // 設置矩形可選擇
      evented: true, // 使矩形響應事件
      name: frameName,
    });

    canvas.add(frame);
    canvas.requestRenderAll();

    frame.on("scaling", () => {
      maintainStrokeWidth(frame);
      canvas.requestRenderAll();
    });

    frame.on("modified", () => {
      maintainStrokeWidth(frame);
      canvas.requestRenderAll();
    });
  };

  // 取得預設框架的尺寸與位置
  const getDefaultFrameDimensions = (
    canvas: Canvas
  ): { left: number; top: number; width: number; height: number } => {
    const transform = canvas.viewportTransform || [1, 0, 0, 1, 0, 0];

    const visibleCenterX = (canvas.width / 2 - transform[4]) / transform[0];
    const visibleCenterY = (canvas.height / 2 - transform[5]) / transform[3];

    return {
      left: visibleCenterX - CHOOSE_CUSTOMIZED_IMG_DEFAULT_WIDTH_HEIGHT / 2,
      top: visibleCenterY - CHOOSE_CUSTOMIZED_IMG_DEFAULT_WIDTH_HEIGHT / 2,
      width: CHOOSE_CUSTOMIZED_IMG_DEFAULT_WIDTH_HEIGHT,
      height: CHOOSE_CUSTOMIZED_IMG_DEFAULT_WIDTH_HEIGHT,
    };
  };

  // 根據畫布上所有物件計算出包圍盒，再加上 padding 來決定框架的尺寸與位置
  const getContentFrameDimensions = (
    objects: Object[]
  ): { left: number; top: number; width: number; height: number } => {
    const boundingRect = computeBoundingRect(objects);

    return {
      left: boundingRect.left - CHOOSE_CUSTOMIZED_IMG_PADDING,
      top: boundingRect.top - CHOOSE_CUSTOMIZED_IMG_PADDING,
      width: boundingRect.width + CHOOSE_CUSTOMIZED_IMG_PADDING * 2,
      height: boundingRect.height + CHOOSE_CUSTOMIZED_IMG_PADDING * 2,
    };
  };

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

  const exportFrameAsPNG = () => {
    const framesFromCanvas = canvas
      .getObjects("rect")
      .filter((obj) => obj?.name?.startsWith("GlowDesign"));

    if (!framesFromCanvas.length) {
      console.warn("No frames found!");
      return;
    }

    const selectedFrame = framesFromCanvas[0];

    const transform = canvas.viewportTransform || [1, 0, 0, 1, 0, 0];

    // Adjust for viewport scaling and translation
    const adjustedLeft = selectedFrame.left * transform[0] + transform[4];
    const adjustedTop = selectedFrame.top * transform[3] + transform[5];
    const adjustedWidth =
      selectedFrame.width * selectedFrame.scaleX * transform[0];
    const adjustedHeight =
      selectedFrame.height * selectedFrame.scaleY * transform[3];

    if (selectedFrame) {
      const dataURL = canvas.toDataURL({
        left: adjustedLeft,
        top: adjustedTop,
        width: adjustedWidth,
        height: adjustedHeight,
        format: "png",
      });

      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `${selectedFrame.name}.png`;
      link.click();

      canvas.remove(selectedFrame);
      canvas.requestRenderAll();
    }
  };

  return null; // No buttons, just listens for Redux actions
}
