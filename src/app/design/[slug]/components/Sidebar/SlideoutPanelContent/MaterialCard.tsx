"use client";

import Image from "next/image";
import type { Material } from "@/app/design/[slug]/types/interfaces";

interface MaterialCardProps {
  material: Material;
  handleClick: (material: Material) => void;
}

export default function MaterialCard({
  material,
  handleClick,
}: MaterialCardProps) {
  return (
    // 樣式放在 design.css
    <div className="card cursor-pointer" onClick={() => handleClick(material)}>
      <Image
        src={material.src}
        alt={material.name}
        width={140}
        height={140}
        className="card__img object-cover"
      />
      <div className="card__content">
        <div className="card__content__header">{material.name}</div>
        <p className="card__content__text">{material.description}</p>
      </div>
    </div>
  );
}
