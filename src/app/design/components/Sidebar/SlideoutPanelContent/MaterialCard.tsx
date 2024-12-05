"use client";

import Image from "next/image";
import type { Material } from "@/app/design/types/interfaces";

interface MaterialCardProps {
  material: Material;
  handleClick: (material: Material) => void;
}

export default function MaterialCard({
  material,
  handleClick,
}: MaterialCardProps) {
  return (
    <div
      className="rounded-md overflow-hidden border border-gray-200 hover:shadow-lg transition cursor-pointer"
      onClick={() => handleClick(material)}
    >
      <Image
        src={material.src}
        alt={material.name}
        width={128}
        height={128}
        className="w-full h-32 object-cover"
      />
      <div className="p-2">
        <h3 className="text-sm font-bold">{material.name}</h3>
        <p className="text-xs text-gray-500">{material.description}</p>
      </div>
    </div>
  );
}
