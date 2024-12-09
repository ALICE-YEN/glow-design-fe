"use client";

import { ReactNode, useState } from "react";
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
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

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
    handleClick: () => {
      dispatch(setAction(CanvasAction.DRAW_WALL));
      setIsDrawing(true);
    },
  };

  const EXIT_DRAWING_ITEM: ItemConfig = {
    id: "exit-draw",
    label: "退出繪製",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="w-16 h-16 text-gray-400"
      >
        <rect x="20" y="20" width="60" height="60" fill="#cccccc" />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#ffffff"
          fontSize="14"
        >
          ESC
        </text>
      </svg>
    ),
    handleClick: () => {
      setIsDrawing(false);
    },
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

  const renderDrawingMode = () => (
    <>
      {/* 退出繪製 */}
      <p className="text-sm text-secondary mb-2.5">
        使用滑鼠左鍵點擊並拖曳以繪製牆體
        <br />
        拖曳到滿意的位置後再點擊一次繪製下一道牆
        <br />
        把起點與終點重合後再點擊一次即可完成繪製
      </p>
      <video
        width="300"
        autoPlay
        loop
        muted
        playsInline
        className="pointer-events-none no-controls"
      >
        <source
          src="https://res.cloudinary.com/datj4og4i/video/upload/v1725736733/drawWall_xoxe7u.mp4"
          type="video/mp4"
        />
        您的瀏覽器不支援影片播放。
      </video>
      <p className="text-sm text-secondary my-2.5">
        或可按下方按鈕或Esc鍵退出繪製模式
      </p>
      <section className="flex pt-2">
        <DrawingButton
          label={EXIT_DRAWING_ITEM.label}
          icon={EXIT_DRAWING_ITEM.icon}
          handleClick={EXIT_DRAWING_ITEM.handleClick}
        />
      </section>
    </>
  );

  const renderDefaultMode = () => (
    <>
      {/* 開使繪製 */}
      <p className="text-sm mb-2.5">點擊下方按鈕或L鍵後進入繪製模式</p>
      <section className="mb-6 flex pt-4">
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
    </>
  );

  return <div>{isDrawing ? renderDrawingMode() : renderDefaultMode()}</div>;
}
