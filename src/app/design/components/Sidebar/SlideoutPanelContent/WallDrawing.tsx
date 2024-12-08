"use client";

import { ReactNode } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { setAction, setSelectedImage } from "@/store/canvasSlice";
import { CanvasAction } from "@/types/enum";

interface ItemConfig {
  id?: string;
  label: string;
  icon: ReactNode; // 可傳入 SVG 或其他內容
  handleClick: () => void;
}

function DrawingButton({ label, icon, handleClick }: ItemConfig) {
  return (
    <button className="flex flex-col items-center" onClick={handleClick}>
      <div className="w-20 h-20 border flex items-center justify-center">
        {icon}
      </div>
      <span className="text-xs font-bold mt-2">{label}</span>
    </button>
  );
}

export default function WallDrawing() {
  const dispatch = useAppDispatch();

  const DRAWING_ITEM: ItemConfig = {
    id: "draw-wall",
    label: "開始繪製 L",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="w-16 h-16 text-gray-400"
      >
        <rect x="20" y="20" width="60" height="60" fill="#cccccc" />
      </svg>
    ),
    handleClick: () => dispatch(setAction(CanvasAction.DRAW_WALL)),
  };
  const OPENING_ITEMS: ItemConfig[] = [
    {
      id: "single-door",
      label: "單開門",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          className="w-16 h-16 text-gray-400"
        >
          <path
            d="M50 20 L50 80 M50 50 A30 30 0 0 1 80 50"
            stroke="#cccccc"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      ),
      handleClick: () => {
        dispatch(setAction(CanvasAction.PLACE_DOOR));
        dispatch(
          setSelectedImage(
            "https://www.hung-chan.com.tw/media/k2/items/cache/a5cfeb7eb858a454222c6a713718c016_XL.jpg"
          )
        );
      },
    },
    {
      id: "window",
      label: "普通窗",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          className="w-16 h-16 text-gray-400"
        >
          <rect x="30" y="40" width="40" height="20" fill="#cccccc" />
        </svg>
      ),
      handleClick: () => {
        dispatch(setAction(CanvasAction.PLACE_WINDOW));
        dispatch(
          setSelectedImage(
            "https://img.lovepik.com/free-png/20211103/lovepik-window-png-image_400222125_wh1200.png"
          )
        );
      },
    },
  ];

  return (
    <div className="pt-4">
      {/* 繪製牆體 */}
      <section className="mb-6 flex">
        <DrawingButton
          label={DRAWING_ITEM.label}
          icon={DRAWING_ITEM.icon}
          handleClick={DRAWING_ITEM.handleClick}
        />
      </section>

      {/* 放置門窗 */}
      <section className="pt-6 border-t border-gray-300">
        <h2 className="text-lg font-bold mb-2.5">放置門窗</h2>
        <p className="text-sm mb-2.5">請選擇門窗組件</p>
        <div className="pt-4 flex space-x-6">
          {OPENING_ITEMS.map((item) => (
            <DrawingButton
              key={item.id}
              label={item.label}
              icon={item.icon}
              handleClick={item.handleClick}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
