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
      title={label}
      disabled={isDisabled}
    >
      <FontAwesomeIcon icon={icon} size="lg" />
    </button>
  );
}
