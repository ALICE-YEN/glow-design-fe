// 伺服器端組件

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface ButtonProps {
  icon: IconDefinition;
  label: string;
  isActive: boolean;
  handleClick: () => void;
}

export default function Button({
  icon,
  label,
  isActive,
  handleClick,
}: ButtonProps) {
  return (
    <button
      onClick={handleClick}
      className={`w-10 h-10 rounded-default transition ${
        isActive ? "bg-button-active" : "hover:bg-button-hover"
      }`}
      title={label}
    >
      <FontAwesomeIcon icon={icon} size="lg" />
    </button>
  );
}
