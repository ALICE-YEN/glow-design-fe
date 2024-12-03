import RockImg from "@/assets/imgs/rock.jpeg";
import WoodImg from "@/assets/imgs/wood.jpeg";
import MaterialLibrary from "@/app/design/components/Sidebar/MaterialLibrary";
import type {
  SidebarButtonConfig,
  Material,
  Category,
} from "@/app/design/types/interfaces";

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
    },
    {
      id: "rock2",
      name: "岩石 2",
      src: RockImg,
      description: "經典黑白石材",
    },
    {
      id: "rock3",
      name: "岩石 3",
      src: RockImg,
      description: "經典黑白石材",
    },
  ],
  wood: [
    {
      id: "wood1",
      name: "木材 1",
      src: WoodImg,
      description: "橡木木地板",
    },
    {
      id: "wood2",
      name: "木材 2",
      src: WoodImg,
      description: "胡桃木地板",
    },
  ],
  tile: [
    {
      id: "tile1",
      name: "磁磚 1",
      src: WoodImg,
      description: "白色方形磁磚",
    },
  ],
  outdoor: [
    {
      id: "outdoor1",
      name: "戶外材料 1",
      src: RockImg,
      description: "戶外石材",
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
      return <div>這是裝潢的 UI</div>;
    } else if (content.id === "export") {
      return <div>這是匯出的 UI</div>;
    }
    return null;
  };

  return (
    <div
      className={`fixed top-1/2 translate-y-[-50%] left-16 w-[300px] min-h-[500px] rounded-r-default bg-stone-100 transition-transform duration-300 ${
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
