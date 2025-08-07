"use client";

import Image from "next/image";
import { useState } from "react";
import type { Material } from "@/app/design/[slug]/types/interfaces";
import PlaceholderImg from "@/assets/imgs/placeholder.png";

interface MaterialCardProps {
  material: Material;
  handleClick: (material: Material) => void;
}

export default function MaterialCard({
  material,
  handleClick,
}: MaterialCardProps) {
  const [imgSrc, setImgSrc] = useState<string>(material.url);

  const isFurniture = material.url.includes("/furniture/");

  return (
    // 樣式放在 design.css
    <div className="card cursor-pointer" onClick={() => handleClick(material)}>
      <Image
        src={imgSrc}
        alt={material.name}
        width={140}
        height={140}
        className={`card__img ${
          isFurniture ? "object-contain" : "object-cover"
        }`}
        onError={() => setImgSrc(PlaceholderImg.src)}
      />
      <div className="card__content">
        <div className="card__content__header">{material.name}</div>
        <p className="card__content__text">{material.description}</p>
      </div>
    </div>
  );
}
