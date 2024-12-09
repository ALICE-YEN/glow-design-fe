"use client";

import RockImg from "@/assets/imgs/rock.jpeg";
import WoodImg from "@/assets/imgs/wood.jpeg";
import type {
  SidebarButtonConfig,
  Material,
  Category,
} from "@/app/design/types/interfaces";
import MaterialLibrary from "./SlideoutPanelContent/MaterialLibrary";
import WallDrawing from "./SlideoutPanelContent/WallDrawing";

interface SlideoutPanelProps {
  isActive: boolean;
  content: SidebarButtonConfig;
  handleAnimationEnd: () => void;
}

const categories: Category[] = [
  { id: "stone", name: "石材" },
  { id: "wood", name: "木地板" },
  { id: "tile", name: "磁磚" },
  { id: "outdoor", name: "戶外" },
];

const materials: Record<string, Material[]> = {
  stone: [
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
  wood: [
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
  tile: [
    {
      id: "tile1",
      name: "磁磚 1",
      src: WoodImg,
      description: "白色方形磁磚",
      url: "data:image/jpeg;base64,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",
    },
  ],
  outdoor: [
    {
      id: "outdoor1",
      name: "戶外材料 1",
      src: RockImg,
      description: "戶外石材",
      url: "https://www.anstone.com.tw/upload/product/202411201445140.jpg",
    },
  ],
};

export default function SlideoutPanel({
  isActive,
  content,
  handleAnimationEnd,
}: SlideoutPanelProps) {
  const renderContent = () => {
    if (content.id === "materials" || content.id === "furniture") {
      return <MaterialLibrary materials={materials} categories={categories} />;
    } else if (content.id === "decorate") {
      return <WallDrawing />;
    } else if (content.id === "export") {
      return <div>這是匯出的 UI</div>;
    }
    return null;
  };

  return (
    <div
      className={`fixed top-1/2 translate-y-[-50%] left-16 w-[300px] min-h-[500px] rounded-r-default bg-panel-background transition-transform duration-300 ${
        isActive ? "translate-x-0 shadow-xl" : "-translate-x-full"
      }`}
      onTransitionEnd={() => {
        if (!isActive) handleAnimationEnd();
      }}
    >
      <div className="p-6">
        <h2 className="text-lg font-bold mb-2.5">{content.title}</h2>
        <p className="text-sm mb-2.5">{content.description}</p>
        {renderContent()}
      </div>
    </div>
  );
}
