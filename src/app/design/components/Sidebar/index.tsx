"use client"; // CSR 模式

import { useState, useEffect } from "react";
import {
  faHome,
  faPalette,
  faChair,
  faFileExport,
} from "@fortawesome/free-solid-svg-icons"; // SVG 模式，只會加載代碼中使用的圖標，避免不必要的資源浪費
// import * as Icons from "@fortawesome/free-solid-svg-icons"; // 導入整個庫，無法 Tree Shaking，之後再來用 build 比較打包大小吧XD(等 lint 錯誤都解完)
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { setAction } from "@/store/canvasSlice";
import { CanvasAction } from "@/types/enum";
import SidebarButton from "@/app/design/components/Sidebar/SidebarButton";
import SlideoutPanel from "@/app/design/components/Sidebar/SlideoutPanel";
import type { SidebarButtonConfig } from "@/app/design/types/interfaces";

const BUTTON_CONFIG: SidebarButtonConfig[] = [
  {
    id: "decorate",
    icon: faHome,
    label: "裝潢",
    title: "繪製格局",
    description: "",
  },
  {
    id: "flooring",
    icon: faPalette,
    label: "材質庫",
    title: "材質庫管理",
    description: "查看和選擇各種地板材質",
  },
  {
    id: "furniture",
    icon: faChair,
    label: "家具庫",
    title: "家具管理",
    description: "查看和選擇各種家具",
  },
  {
    id: "export",
    icon: faFileExport,
    label: "匯出",
    title: "匯出PNG圖片",
    description: "將設計文件匯出",
  },
];

export default function Sidebar() {
  const [activeIndex, setActiveIndex] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false); // SlideoutPanel 動畫

  const currentAction = useAppSelector((state) => state.canvas.currentAction);

  const dispatch = useAppDispatch();

  const activeContent = (BUTTON_CONFIG ?? []).find(
    (obj) => obj.id === activeIndex
  );

  const handleButtonClick = (index: string) => {
    setIsAnimating(true);
    setActiveIndex(activeIndex === index ? null : index);
    dispatch(setAction(CanvasAction.NONE));
  };

  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };

  // 點選 Toolbar SELECT_OBJECT、PAN_CANVAS，關閉 SlideoutPanel
  useEffect(() => {
    if (
      [CanvasAction.SELECT_OBJECT, CanvasAction.PAN_CANVAS].includes(
        currentAction
      )
    ) {
      setActiveIndex(null);
    }
  }, [currentAction]);
  return (
    <div className="flex">
      <nav
        className={`fixed left-0 top-1/2 translate-y-[-50%] w-16 min-h-[500px] flex flex-col justify-center ${
          activeIndex !== null || isAnimating
            ? "rounded-l-default"
            : "rounded-default"
        } shadow-xl bg-panel-background z-10`}
      >
        {BUTTON_CONFIG.map((btn) => (
          <SidebarButton
            key={btn.id}
            icon={btn.icon}
            label={btn.label}
            isActive={activeIndex === btn.id}
            handleClick={() => handleButtonClick(btn.id)}
          />
        ))}
      </nav>

      <SlideoutPanel
        isActive={!!activeIndex}
        content={activeContent}
        handleAnimationEnd={handleAnimationEnd}
        handleCloseSlideoutPanel={() => setActiveIndex(null)}
      />
    </div>
  );
}
