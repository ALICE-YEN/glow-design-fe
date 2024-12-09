// 伺服器端組件

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface ButtonProps {
  icon: IconDefinition;
  label: string;
  handleClick: () => void;
}

export default function Button({ icon, label, handleClick }: ButtonProps) {
  return (
    <button
      onClick={handleClick}
      className="w-10 h-10 rounded-default hover:bg-button-hover transition"
      title={label}
    >
      <FontAwesomeIcon icon={icon} size="lg" />
    </button>
  );
}
