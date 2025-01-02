"use client";

import { useAppDispatch } from "@/services/redux/hooks";
import { setAction, setSelectedImage } from "@/store/canvasSlice";
import { CanvasAction } from "@/types/enum";
// 假資料
import RockImg from "@/assets/imgs/rock.jpeg";
import WoodImg from "@/assets/imgs/wood.jpeg";
import SofaImg from "@/assets/imgs/sofa.jpg";
import TableImg from "@/assets/imgs/table.jpg";
import BedImg from "@/assets/imgs/bed.jpg";
import ChairImg from "@/assets/imgs/chair.jpg";
import type {
  SidebarButtonConfig,
  CategoryWithMaterials,
  Material,
} from "@/app/design/types/interfaces";
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
        name: "岩石 1",
        src: RockImg,
        description: "經典黑白石材",
        url: "rock.jpeg",
      },
      {
        id: "rock2",
        name: "岩石 2",
        src: RockImg,
        description: "經典黑白石材",
        url: "rock.jpeg",
      },
      {
        id: "rock3",
        name: "岩石 3",
        src: RockImg,
        description: "經典黑白石材",
        url: "rock.jpeg",
      },
    ],
  },
  {
    id: "wood",
    name: "木地板",
    materials: [
      {
        id: "wood1",
        name: "木材 1",
        src: WoodImg,
        description: "橡木木地板",
        url: "wood.jpeg",
      },
      {
        id: "wood2",
        name: "木材 2",
        src: WoodImg,
        description: "胡桃木地板",
        url: "wood.jpeg",
      },
    ],
  },
  {
    id: "tile",
    name: "磁磚",
    materials: [
      {
        id: "tile1",
        name: "磁磚 1",
        src: WoodImg,
        description: "白色方形磁磚",
        url: "wood.jpeg",
      },
    ],
  },
  {
    id: "outdoor",
    name: "戶外",
    materials: [
      {
        id: "outdoor1",
        name: "戶外材料 1",
        src: RockImg,
        description: "戶外石材",
        url: "rock.jpeg",
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
        src: SofaImg,
        description: "舒適的現代風格沙發，適合客廳",
        url: "sofa.jpg",
      },
      {
        id: "sofa2",
        name: "復古沙發",
        src: SofaImg,
        description: "具有復古風格的沙發，帶來懷舊氣息",
        url: "sofa.jpg",
      },
    ],
  },
  {
    id: "table",
    name: "桌子",
    materials: [
      {
        id: "table1",
        name: "木製餐桌",
        src: TableImg,
        description: "堅固的橡木餐桌，適合家庭用餐",
        url: "table.jpg",
      },
      {
        id: "table2",
        name: "玻璃茶几",
        src: TableImg,
        description: "透明玻璃材質茶几，簡約大方",
        url: "table.jpg",
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
        src: BedImg,
        description: "適合小空間的單人床，帶儲物功能",
        url: "bed.jpg",
      },
      {
        id: "bed2",
        name: "雙人床",
        src: BedImg,
        description: "寬敞舒適的雙人床，帶靠背設計",
        url: "bed.jpg",
      },
    ],
  },
  {
    id: "chair",
    name: "椅子",
    materials: [
      {
        id: "chair1",
        name: "辦公椅",
        src: ChairImg,
        description: "符合人體工學的辦公椅，提供長時間舒適支持",
        url: "chair.jpg",
      },
      {
        id: "chair2",
        name: "休閒椅",
        src: ChairImg,
        description: "適合陽台或戶外的休閒椅，輕便易移動",
        url: "chair.jpg",
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
