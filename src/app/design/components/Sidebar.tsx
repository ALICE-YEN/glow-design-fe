"use client"; // CSR 模式

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faPalette,
  faChair,
  faFileExport,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons"; // SVG 模式，只會加載代碼中使用的圖標，避免不必要的資源浪費
// import * as Icons from "@fortawesome/free-solid-svg-icons"; // 導入整個庫，無法 Tree Shaking，之後再來用 build 比較打包大小吧XD(等 lint 錯誤都解完)

interface ButtonConfig {
  icon: IconDefinition;
  label: string;
}

const BUTTON_CONFIG: ButtonConfig[] = [
  { icon: faHome, label: "裝潢" },
  { icon: faPalette, label: "材質庫" },
  { icon: faChair, label: "家具庫" },
  { icon: faFileExport, label: "匯出" },
];

interface SidebarButtonProps {
  icon: IconDefinition;
  label: string;
  handleClick: () => void;
}

function SidebarButton({ icon, label, handleClick }: SidebarButtonProps) {
  return (
    // #4F4B32、#5C573E，兩個顏色都不錯
    <button
      onClick={handleClick}
      className={`flex flex-col items-center space-y-2 text-black hover:bg-gray-200 transition-transform duration-300 py-4 last:mb-6`}
    >
      <FontAwesomeIcon icon={icon} color="#5C573E" size="lg" />
      <span className="text-sm">{label}</span>
    </button>
  );
}

interface SlideoutPanelProps {
  isActive: boolean;
  content: string;
  handleAnimationEnd: () => void;
}

function SlideoutPanel({
  isActive,
  content,
  handleAnimationEnd,
}: SlideoutPanelProps) {
  return (
    <div
      className={`fixed top-1/2 translate-y-[-50%] left-16 w-64 min-h-96 rounded-r-md bg-stone-100 transition-transform duration-300 ${
        isActive ? "translate-x-0 shadow-xl" : "-translate-x-full"
      }`}
      onTransitionEnd={() => {
        if (!isActive) handleAnimationEnd();
      }}
    >
      <div className="p-4">
        <h2 className="text-lg font-bold">{content}</h2>
        <p>這是 {content} 的內容</p>
      </div>
    </div>
  );
}

export default function Sidebar({ canvas }: { canvas: HTMLCanvasElement }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false); // SlideoutPanel 動畫

  const handleButtonClick = (index: number) => {
    setIsAnimating(true);
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };

  return (
    <div className="flex">
      <nav
        className={`fixed left-0 top-1/2 translate-y-[-50%] w-16 min-h-96 flex flex-col justify-center ${
          activeIndex !== null || isAnimating ? "rounded-l-md" : "rounded-md"
        }  shadow-xl bg-stone-100 z-10`}
      >
        {BUTTON_CONFIG.map((btn, index) => (
          <SidebarButton
            key={index}
            icon={btn.icon}
            label={btn.label}
            handleClick={() => handleButtonClick(index)}
          />
        ))}
      </nav>

      {BUTTON_CONFIG.map((btn, index) => (
        <SlideoutPanel
          key={index}
          isActive={activeIndex === index}
          content={btn.label}
          handleAnimationEnd={handleAnimationEnd}
        />
      ))}
    </div>
  );
}
