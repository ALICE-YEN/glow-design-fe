"use client";

import { useAppDispatch } from "@/services/redux/hooks";
import { setAction, setSelectedImage } from "@/store/canvasSlice";
import { CanvasAction } from "@/types/enum";
import type {
  SidebarButtonConfig,
  CategoryWithMaterials,
  Material,
} from "@/app/design/[slug]/types/interfaces";
import MaterialLibrary from "./SlideoutPanelContent/MaterialLibrary";
import WallDrawing from "./SlideoutPanelContent/WallDrawing";
import ExportImg from "./SlideoutPanelContent/ExportImg";

interface SlideoutPanelProps {
  isActive: boolean;
  content?: SidebarButtonConfig;
  handleAnimationEnd: () => void;
  handleCloseSlideoutPanel: () => void;
}

const flooring: CategoryWithMaterials[] = [
  {
    id: "stone",
    name: "石材",
    materials: [
      {
        id: "rock1",
        name: "深色板岩地板",
        description: "深色板岩表，低調穩重，適合現代與工業風",
        url: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/flooring/stone-slate.jpg`,
      },
      {
        id: "rock2",
        name: "米色石灰岩地板",
        description: "米色調與細緻紋理，營造溫暖自然的空間",
        url: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/flooring/stone-limestone.jpg`,
      },
      {
        id: "rock3",
        name: "磨光花崗岩地板",
        description: "黑白花崗岩，適合商業與高質感住宅空間",
        url: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/flooring/stone-granite.jpg`,
      },
      {
        id: "rock4",
        name: "白色大理石地板",
        description: "紋理優雅高貴，適合現代高級空間",
        url: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/flooring/stone-marble.jpg`,
      },
    ],
  },
  {
    id: "wood",
    name: "木地板",
    materials: [
      {
        id: "wood1",
        name: "自然橡木地板",
        description: "自然的淺色橡木地板，適合明亮清新的空間",
        url: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/flooring/wood-natural.jpg`,
      },
      {
        id: "wood2",
        name: "深色胡桃木地板",
        description: "深棕色胡桃木紋理，沈穩高質感氛圍",
        url: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/flooring/wood-dark.jpg`,
      },
      {
        id: "wood3",
        name: "灰色仿木地板",
        description: "冷色調木紋，適合現代極簡空間",
        url: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/flooring/wood-modern.jpg`,
      },
    ],
  },
  {
    id: "tile",
    name: "磁磚",
    materials: [
      {
        id: "tile1",
        name: "石英拋光磁磚",
        description: "表面平整光滑，適用於現代室內空間",
        url: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/flooring/tile-quartz.jpg`,
      },
    ],
  },
  {
    id: "outdoor",
    name: "戶外",
    materials: [
      {
        id: "outdoor1",
        name: "深色戶外塑木地板",
        description: "耐候防滑，適合陽台與露台使用",
        url: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/flooring/outdoor-dark.jpg`,
      },
      {
        id: "outdoor2",
        name: "淺色戶外塑木地板",
        description: "清新自然，適合花園或戶外走道鋪設",
        url: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/flooring/outdoor-light.jpg`,
      },
    ],
  },
];

const furniture: CategoryWithMaterials[] = [
  {
    id: "sofa",
    name: "沙發",
    materials: [
      {
        id: "sofa1",
        name: "現代沙發",
        description: "鮮明黃色的現代風格沙發，適合客廳",
        url: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/furniture/sofa-modern-yellow.png`,
      },
      {
        id: "sofa2",
        name: "現代沙發",
        description: "舒適的現代風格沙發，適合客廳",
        url: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/furniture/sofa-modern-gray.png`,
      },
      {
        id: "sofa3",
        name: "復古沙發",
        description: "具有復古風格的沙發，帶來懷舊氣息",
        url: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/furniture/sofa-retro-brown.png`,
      },
    ],
  },
  {
    id: "table",
    name: "桌子",
    materials: [
      {
        id: "table1",
        name: "復古茶几",
        description: "復古風格茶几，下層可收納書籍或裝飾品",
        url: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/furniture/table-vintage-coffee.png`,
      },
      {
        id: "table2",
        name: "現代方桌",
        description: "深色木製方桌，適合客廳或書房",
        url: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/furniture/table-modern-square.png`,
      },
      {
        id: "table3",
        name: "現代圓桌",
        description: "木頭桌面搭配金屬底座，適合用於客廳",
        url: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/furniture/table-modern-round.png`,
      },
    ],
  },
  {
    id: "bed",
    name: "床",
    materials: [
      {
        id: "bed1",
        name: "單人床",
        description: "木頭床架與棕紅色棉被，溫暖氛圍",
        url: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/furniture/bed-single-cream.png`,
      },

      {
        id: "bed2",
        name: "雙人床",
        description: "米白色床包與柔和床頭設計，典雅舒適",
        url: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/furniture/bed-double-cream.png`,
      },
      {
        id: "bed3",
        name: "單人床",
        description: "藍色簡約床架與粉嫩格紋棉被",
        url: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/furniture/bed-single-blue.png`,
      },
      {
        id: "bed4",
        name: "雙人床",
        description: "藍色簡約床架與粉色格紋被套",
        url: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/furniture/bed-double-blue.png`,
      },
    ],
  },
  {
    id: "chair",
    name: "椅子",
    materials: [
      {
        id: "chair1",
        name: "古典風椅子",
        description: "圓形靠背與雕花細節的復古風格椅",
        url: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/furniture/chair-vintage-gray.png`,
      },
      {
        id: "chair2",
        name: "人體工學辦公椅",
        description: "符合人體工學的加墊扶手辦公椅",
        url: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/furniture/chair-office-orange.png`,
      },
      {
        id: "chair3",
        name: "現代椅子",
        description: "木質椅腳與鐵件結構，簡約現代感",
        url: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/furniture/chair-modern-blue.png`,
      },
    ],
  },
];

export default function SlideoutPanel({
  isActive,
  content,
  handleAnimationEnd,
  handleCloseSlideoutPanel,
}: SlideoutPanelProps) {
  const dispatch = useAppDispatch();

  const handleMaterialClick = (material: Material) => {
    dispatch(setSelectedImage(material.url));
    if (content?.id === "furniture") {
      dispatch(setAction(CanvasAction.PLACE_FURNITURE));
    }
    if (content?.id === "flooring") {
      dispatch(setAction(CanvasAction.PLACE_FLOORING));
    }
  };

  const renderContentMap: Record<string, JSX.Element | null> = {
    flooring: (
      <MaterialLibrary
        key="flooring"
        categoriesWithMaterials={flooring}
        handleMaterialClick={handleMaterialClick}
      />
    ),
    furniture: (
      <MaterialLibrary
        key="furniture"
        categoriesWithMaterials={furniture}
        handleMaterialClick={handleMaterialClick}
      />
    ),
    decorate: <WallDrawing />,
    export: <ExportImg handleCloseSlideoutPanel={handleCloseSlideoutPanel} />,
  };

  return (
    <div
      className={`fixed top-1/2 translate-y-[-50%] left-16 w-[340px] h-[500px] overflow-y-auto rounded-r-default bg-panel-background transition-transform duration-300 ${
        isActive ? "translate-x-0 shadow-xl" : "-translate-x-full"
      }`}
      onTransitionEnd={handleAnimationEnd}
    >
      {content && (
        <div className="p-6">
          <h2 className="text-lg font-bold mb-2.5">{content.title}</h2>
          <p className="text-sm text-secondary mb-2.5">{content.description}</p>
          {renderContentMap[content.id]}
        </div>
      )}
    </div>
  );
}
