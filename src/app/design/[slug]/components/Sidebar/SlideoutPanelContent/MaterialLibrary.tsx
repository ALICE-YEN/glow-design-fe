"use client";

import { useState } from "react";
import type {
  Material,
  CategoryWithMaterials,
} from "@/app/design/[slug]/types/interfaces";
import MaterialCard from "./MaterialCard";

interface MaterialLibraryProps {
  categoriesWithMaterials: CategoryWithMaterials[];
  handleMaterialClick: (material: Material) => void;
}

export default function MaterialLibrary({
  categoriesWithMaterials,
  handleMaterialClick,
}: MaterialLibraryProps) {
  const [activeCategory, setActiveCategory] = useState<string>(
    categoriesWithMaterials[0].id
  );

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  return (
    <div className="py-4">
      {/* 分類標籤 */}
      <div className="flex justify-between">
        {categoriesWithMaterials.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`pb-2 w-full border-b-2 text-sm ${
              activeCategory === category.id
                ? "border-contrast text-contrast border-b-[3px]"
                : "hover:text-gray-500"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* 素材列表 */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {categoriesWithMaterials
          .find((category) => category.id === activeCategory)
          ?.materials.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
              handleClick={handleMaterialClick}
            />
          ))}
      </div>
    </div>
  );
}
