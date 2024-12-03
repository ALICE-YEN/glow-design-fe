import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons"; // SVG 模式，只會加載代碼中使用的圖標，避免不必要的資源浪費

interface SidebarButtonProps {
  icon: IconDefinition;
  label: string;
  isActive: boolean;
  handleClick: () => void;
}

export default function SidebarButton({
  icon,
  label,
  isActive,
  handleClick,
}: SidebarButtonProps) {
  return (
    // #4F4B32、#5C573E，兩個顏色都不錯
    <button
      onClick={handleClick}
      className={`flex flex-col items-center space-y-2 text-black ${
        isActive ? "bg-gray-200" : "hover:bg-gray-200"
      } transition-transform duration-300 py-6 last:mb-6`}
    >
      <FontAwesomeIcon icon={icon} color="#5C573E" size="lg" />
      <span className="text-sm">{label}</span>
    </button>
  );
}
