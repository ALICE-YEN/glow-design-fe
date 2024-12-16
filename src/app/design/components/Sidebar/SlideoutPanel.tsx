"use client";

import { useAppDispatch } from "@/hooks/redux";
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
        url: "https://media.gettyimages.com/id/125809774/zh/%E7%85%A7%E7%89%87/background-texture.jpg?s=612x612&w=gi&k=20&c=0l3dcIyohxRhOpu9bpIbwEN11X5eGfLxxYKGnRBLSYE=",
      },
      {
        id: "rock2",
        name: "岩石 2",
        src: RockImg,
        description: "經典黑白石材",
        url: "https://media.gettyimages.com/id/125809774/zh/%E7%85%A7%E7%89%87/background-texture.jpg?s=612x612&w=gi&k=20&c=0l3dcIyohxRhOpu9bpIbwEN11X5eGfLxxYKGnRBLSYE=",
      },
      {
        id: "rock3",
        name: "岩石 3",
        src: RockImg,
        description: "經典黑白石材",
        url: "https://media.gettyimages.com/id/125809774/zh/%E7%85%A7%E7%89%87/background-texture.jpg?s=612x612&w=gi&k=20&c=0l3dcIyohxRhOpu9bpIbwEN11X5eGfLxxYKGnRBLSYE=",
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
        url: "https://pcm.trplus.com.tw/1000x1000/sys-master/productImages/ha2/h58/11348817969182/000000000014232069-gallery-01-20221004180635580.jpg",
      },
      {
        id: "wood2",
        name: "木材 2",
        src: WoodImg,
        description: "胡桃木地板",
        url: "https://pcm.trplus.com.tw/1000x1000/sys-master/productImages/ha2/h58/11348817969182/000000000014232069-gallery-01-20221004180635580.jpg",
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
        url: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTEhMWFhUX...",
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
        url: "https://www.anstone.com.tw/upload/product/202411201445140.jpg",
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
        url: "https://www.horia.com.tw/upload/catalog_b/ALL_catalog_21B01_s36mtq6ud6.jpg",
      },
      {
        id: "sofa2",
        name: "復古沙發",
        src: SofaImg,
        description: "具有復古風格的沙發，帶來懷舊氣息",
        url: "https://www.horia.com.tw/upload/catalog_b/ALL_catalog_21B01_s36mtq6ud6.jpg",
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
        url: "https://image-cdn-flare.qdm.cloud/q624d157a7aa25/image/data/2024/02/21/aeea2c101d68cdae8372908738edf822.jpg",
      },
      {
        id: "table2",
        name: "玻璃茶几",
        src: TableImg,
        description: "透明玻璃材質茶几，簡約大方",
        url: "https://www.dowana.com.tw/www/upload/ec/product/332704/A24BC0217_580_580.jpg",
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
        url: "https://www.iloom.com.tw/cdn/shop/files/Vantt_HBA401101.jpg?v=1706505762",
      },
      {
        id: "bed2",
        name: "雙人床",
        src: BedImg,
        description: "寬敞舒適的雙人床，帶靠背設計",
        url: "https://www.dsf.tw/data/goods/gallery/202202/1645437069324811856.jpg",
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
        url: "https://www.uchair.com.tw/wp-content/uploads/2021/11/2.png",
      },
      {
        id: "chair2",
        name: "休閒椅",
        src: ChairImg,
        description: "適合陽台或戶外的休閒椅，輕便易移動",
        url: "https://www.mulsanneliving.com/archive/image/product1/images/AAC0017050002-630-1.jpg?v=1",
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
