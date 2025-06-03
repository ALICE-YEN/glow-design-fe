"use client";

import { useEffect } from "react";
import { Canvas, Rect, Object } from "fabric";
import { toast } from "react-toastify";
import { useAppSelector, useAppDispatch } from "@/services/redux/hooks";
import { resetAction } from "@/store/canvasSlice";
import {
  CHOOSE_CUSTOMIZED_IMG_PADDING,
  CHOOSE_CUSTOMIZED_IMG_DEFAULT_WIDTH_HEIGHT,
  PAPER_SIZES,
  DEFAULT_FRAME_VIEWPORT_RATIO,
} from "@/utils/constants";
import { CanvasAction, ImgSize } from "@/types/enum";
import {
  getContentObjects,
  computeBoundingRect,
  getGridLines,
} from "@/app/design/[slug]/utils/basicCanvasHelpers";

interface CroppingProps {
  canvas: Canvas;
}

export default function Cropping({ canvas }: CroppingProps) {
  const dispatch = useAppDispatch();
  const currentAction = useAppSelector((state) => state.canvas.currentAction);

  useEffect(() => {
    if (
      currentAction === CanvasAction.CHOOSE_IMG_BY_CUSTOMIZED ||
      currentAction === CanvasAction.CHOOSE_IMG_BY_A4 ||
      currentAction === CanvasAction.CHOOSE_IMG_BY_A3
    ) {
      addFrameToCanvas(currentAction);
      dispatch(resetAction()); // Reset action after adding a frame
    } else if (currentAction === CanvasAction.EXPORT_PNG) {
      exportFrameAsPNG();
      dispatch(resetAction()); // Reset action after exporting
    }
  }, [currentAction, dispatch]);

  const getCroppingFrames = (): Rect[] =>
    canvas
      .getObjects("rect")
      .filter((obj) => (obj as Rect).name?.startsWith("GlowDesign")) as Rect[];

  const generateFrameName = (imgSize: ImgSize): string => {
    const formatted = new Date()
      .toLocaleString("zh-TW", {
        timeZone: "Asia/Taipei",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(/\//g, "") // 移除斜線
      .replace(" ", "") // 移除空格
      .replace(":", ""); // 移除冒號

    return `GlowDesign_${imgSize}_${formatted}`;
  };

  const addFrameToCanvas = (
    currentAction:
      | CanvasAction.CHOOSE_IMG_BY_CUSTOMIZED
      | CanvasAction.CHOOSE_IMG_BY_A4
      | CanvasAction.CHOOSE_IMG_BY_A3
  ) => {
    // 檢查，移除畫布上所有舊 GlowDesign 框
    canvas.getObjects("rect").forEach((obj) => {
      if (obj.name?.startsWith("GlowDesign")) {
        canvas.remove(obj);
      }
    });

    let imgSize: ImgSize | null = null;
    let dimensions: {
      left: number;
      top: number;
      width: number;
      height: number;
    };

    const objects = getContentObjects(canvas);

    switch (currentAction) {
      case CanvasAction.CHOOSE_IMG_BY_CUSTOMIZED:
        dimensions =
          objects.length === 0
            ? getFixedSizeFrameDimensions(
                CHOOSE_CUSTOMIZED_IMG_DEFAULT_WIDTH_HEIGHT,
                CHOOSE_CUSTOMIZED_IMG_DEFAULT_WIDTH_HEIGHT
              ) // 若畫布上沒有物件，則用預設中心與尺寸
            : getContentFrameDimensionsWithPadding(objects); // 根據畫布上所有物件計算出包圍盒，再加上 padding 來決定框架的尺寸與位置
        imgSize = ImgSize.CUSTOMIZED;
        break;

      case CanvasAction.CHOOSE_IMG_BY_A4: {
        dimensions = getFixedRatioFrame(
          PAPER_SIZES.A4.width,
          PAPER_SIZES.A4.height,
          objects
        );
        imgSize = ImgSize.A4;
        break;
      }

      case CanvasAction.CHOOSE_IMG_BY_A3: {
        dimensions = getFixedRatioFrame(
          PAPER_SIZES.A3.width,
          PAPER_SIZES.A3.height,
          objects
        );
        imgSize = ImgSize.A3;
        break;
      }

      default:
        break;
    }

    const frameName = generateFrameName(imgSize as ImgSize);

    const frame = new Rect({
      ...dimensions,
      fill: "transparent",
      stroke: "#07FE3D",
      strokeWidth: 1,
      selectable:
        currentAction === CanvasAction.CHOOSE_IMG_BY_CUSTOMIZED ? true : false, // 設置矩形可選擇
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

  // 取得以畫布中央為基準，使用固定寬度與高度的框架尺寸與位置
  const getFixedSizeFrameDimensions = (
    width: number,
    height: number
  ): { left: number; top: number; width: number; height: number } => {
    const transform = canvas.viewportTransform || [1, 0, 0, 1, 0, 0];

    const visibleCenterX = (canvas.width / 2 - transform[4]) / transform[0];
    const visibleCenterY = (canvas.height / 2 - transform[5]) / transform[3];

    return {
      left: visibleCenterX - width / 2,
      top: visibleCenterY - height / 2,
      width,
      height,
    };
  };

  // 根據畫布上所有物件計算出包圍盒，再加上 padding 來決定框架的尺寸與位置
  const getContentFrameDimensionsWithPadding = (
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

  const getFixedRatioFrame = (
    mmWidth: number,
    mmHeight: number,
    contentObjects: Object[]
  ) => {
    const ratio = mmWidth / mmHeight;

    if (contentObjects.length === 0) {
      // 無內容 → 以 viewport 中心放置比例框（80%）
      const transform = canvas.viewportTransform || [1, 0, 0, 1, 0, 0];
      const visibleWidth = canvas.width / transform[0];
      const visibleHeight = canvas.height / transform[3];

      let width = visibleWidth * DEFAULT_FRAME_VIEWPORT_RATIO;
      let height = width / ratio;

      if (height > visibleHeight * DEFAULT_FRAME_VIEWPORT_RATIO) {
        height = visibleHeight * DEFAULT_FRAME_VIEWPORT_RATIO;
        width = height * ratio;
      }

      const left = -transform[4] / transform[0] + (visibleWidth - width) / 2;
      const top = -transform[5] / transform[3] + (visibleHeight - height) / 2;

      return { left, top, width, height };
    } else {
      // 有內容 → 以內容中心為基準放置比例框（至少包住）
      const boundingRect = computeBoundingRect(contentObjects);

      let width = boundingRect.width + CHOOSE_CUSTOMIZED_IMG_PADDING * 2;
      let height = width / ratio;

      if (height < boundingRect.height) {
        height = boundingRect.height + CHOOSE_CUSTOMIZED_IMG_PADDING * 2;
        width = height * ratio;
      }

      const centerX = boundingRect.left + boundingRect.width / 2;
      const centerY = boundingRect.top + boundingRect.height / 2;

      return {
        left: centerX - width / 2,
        top: centerY - height / 2,
        width,
        height,
      };
    }
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

  const hideObjects = (items: Object[]) => {
    items.forEach((obj) => (obj.visible = false));
  };

  const showObjects = (items: Object[]) => {
    items.forEach((obj) => (obj.visible = true));
  };

  const triggerDownload = (dataURL: string, filename: string) => {
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = filename;
    link.click();
  };

  const exportFrameAsPNG = () => {
    let croppingFrames = getCroppingFrames();
    let croppingFrame: Rect;

    if (!croppingFrames.length) {
      // 預設建立 A4 框
      addFrameToCanvas(CanvasAction.CHOOSE_IMG_BY_A4);

      // 重新取得框
      croppingFrames = getCroppingFrames();
      if (!croppingFrames.length) {
        toast.error("Failed to create default A4 frame.");
        return;
      }

      croppingFrame = croppingFrames[0];
    } else {
      croppingFrame = croppingFrames[0];
    }

    const gridLines = getGridLines(canvas);

    // 隱藏網格線與綠框
    hideObjects(gridLines);
    croppingFrame.visible = false;
    canvas.requestRenderAll();

    const transform = canvas.viewportTransform || [1, 0, 0, 1, 0, 0]; // 畫布可能進行平移、縮放，[scaleX, skewX, skewY, scaleY, translateX, translateY]

    // 計算裁切區域
    const adjustedLeft = croppingFrame.left * transform[0] + transform[4];
    const adjustedTop = croppingFrame.top * transform[3] + transform[5];
    const adjustedWidth =
      croppingFrame.width * croppingFrame.scaleX * transform[0];
    const adjustedHeight =
      croppingFrame.height * croppingFrame.scaleY * transform[3];

    // 生成 PNG dataURL
    if (croppingFrame) {
      const dataURL = canvas.toDataURL({
        left: adjustedLeft,
        top: adjustedTop,
        width: adjustedWidth,
        height: adjustedHeight,
        format: "png",
      });

      // 恢復網格線與綠框顯示
      showObjects(gridLines);
      croppingFrame.visible = true;
      canvas.requestRenderAll();

      // 觸發下載
      triggerDownload(dataURL, `${croppingFrame.name}.png`);

      canvas.remove(croppingFrame);
      canvas.requestRenderAll();
    }
  };

  return null; // No buttons, just listens for Redux actions
}
