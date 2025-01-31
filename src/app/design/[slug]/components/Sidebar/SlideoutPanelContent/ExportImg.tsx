"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { ImgSize } from "@/types/enum";

const imgSizeOptions = [
  { size: ImgSize.A4, dimensions: "297 x 210 mm" },
  { size: ImgSize.A3, dimensions: "420 x 297 mm" },
  { size: ImgSize.CUSTOMIZED, dimensions: "" },
];

interface ImgSizeOptionProps {
  size: ImgSize;
  dimensions: string;
  isSelected: boolean;
  onSelect: (size: ImgSize) => void;
}

const ImgSizeOption = ({
  size,
  dimensions,
  isSelected,
  onSelect,
}: ImgSizeOptionProps) => {
  return (
    <div
      className={`p-2.5 rounded-default cursor-pointer mb-2 ${
        isSelected ? "bg-button-hover" : "hover:bg-button-hover"
      }`}
      onClick={() => onSelect(size)}
    >
      <div className="flex items-center">
        <FontAwesomeIcon
          icon={faFile}
          color="#5C573E"
          className="w-5 h-5 mr-2.5"
        />
        <div className="w-full flex flex-row justify-between items-center">
          <h4>{size}</h4>
          <p className="text-sm text-secondary">{dimensions}</p>
        </div>
      </div>
    </div>
  );
};

interface ActionsProps {
  onCancel: () => void;
  onConfirm: () => void;
}

const Actions = ({ onCancel, onConfirm }: ActionsProps) => {
  const baseClass = "w-32 px-5 py-2.5 text-sm rounded-default";

  return (
    <div className="flex justify-between mt-44">
      <button
        onClick={onCancel}
        className={`${baseClass} border border-secondary hover:bg-button-hover`}
      >
        取消
      </button>
      <button
        onClick={onConfirm}
        className={`${baseClass} text-white bg-contrast hover:bg-contrast-hover`}
      >
        確定匯出
      </button>
    </div>
  );
};

interface ExportImgProps {
  handleCloseSlideoutPanel: () => void;
}

export default function ExportImg({
  handleCloseSlideoutPanel,
}: ExportImgProps) {
  const [selectedSize, setSelectedSize] = useState<ImgSize>(ImgSize.A4);

  const handleSelect = (size: ImgSize) => {
    setSelectedSize(size);
  };

  const handleConfirm = () => {
    console.log("Selected size:", selectedSize);
  };

  const handleCancel = () => {
    console.log("Selection canceled");
    handleCloseSlideoutPanel();
  };

  return (
    <div className="py-4">
      {imgSizeOptions.map(({ size, dimensions }) => (
        <ImgSizeOption
          key={size}
          size={size}
          dimensions={dimensions}
          isSelected={selectedSize === size}
          onSelect={handleSelect}
        />
      ))}

      <Actions onCancel={handleCancel} onConfirm={handleConfirm} />
    </div>
  );
}
