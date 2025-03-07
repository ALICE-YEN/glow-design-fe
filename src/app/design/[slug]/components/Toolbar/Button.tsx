// 伺服器端組件

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface ButtonProps {
  icon: IconDefinition;
  label: string;
  isActive: boolean;
  isDisabled?: boolean;
  handleClick: () => void;
}

export default function Button({
  icon,
  label,
  isActive,
  isDisabled = false,
  handleClick,
}: ButtonProps) {
  // ZOOM_TO_FIT 的 icon 要客製化邊框
  const borderProps =
    icon.iconName === "arrows-left-right"
      ? {
          className: "fa-border",
          style: {
            border: "2px solid black",
            borderRadius: 3,
            padding: "0.5px",
            transform: "scale(0.85)",
          },
        }
      : {};

  return (
    <button
      onClick={isDisabled ? undefined : handleClick}
      className={`w-10 h-10 rounded-default transition ${
        isDisabled
          ? "cursor-auto text-button-disabled"
          : isActive
          ? "bg-button-active"
          : "hover:bg-button-hover"
      }`}
      title={label} // 瀏覽器控制的 tooltip
      disabled={isDisabled}
    >
      <FontAwesomeIcon icon={icon} size="lg" {...borderProps} />
    </button>
  );
}
