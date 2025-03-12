"use client";

import { useRef, useEffect, MouseEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrashAlt,
  faPencilAlt,
} from "@fortawesome/free-solid-svg-icons";

interface CardMenuProps {
  onRename: (e: MouseEvent) => void;
  onEditDescription: (e: MouseEvent) => void;
  onDelete: (e: MouseEvent) => void;
  onClose: () => void;
  excludeRef?: React.RefObject<HTMLElement>;
}

const itemStyle =
  "px-4 py-2 flex items-center gap-2 hover:bg-button-hover cursor-pointer";

export default function CardMenu({
  onRename,
  onEditDescription,
  onDelete,
  onClose,
  excludeRef,
}: CardMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // 如果點擊發生在 menuRef 範圍外，才呼叫 onClose
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !(
          excludeRef?.current &&
          excludeRef.current.contains(event.target as Node)
        )
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute top-12 right-2 py-2 w-32 z-10 bg-white shadow-md hover:shadow-xl rounded-default text-sm text-primary"
    >
      <div className={itemStyle} onClick={onRename}>
        <FontAwesomeIcon icon={faEdit} />
        <span>重新命名</span>
      </div>
      <div className={itemStyle} onClick={onEditDescription}>
        <FontAwesomeIcon icon={faPencilAlt} />
        <span>修改描述</span>
      </div>
      <div className={itemStyle} onClick={onDelete}>
        <FontAwesomeIcon icon={faTrashAlt} />
        <span>刪除設計</span>
      </div>
    </div>
  );
}
