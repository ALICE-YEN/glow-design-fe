"use client";

import { useState } from "react";
import type { Material, Category } from "@/app/design/types/interfaces";
import MaterialCard from "./MaterialCard";

interface MaterialLibraryProps {
  materials: Record<string, Material[]>;
  categories: Category[];
}

export default function MaterialLibrary({
  materials,
  categories,
}: MaterialLibraryProps) {
  const [activeCategory, setActiveCategory] = useState<string>(
    categories[0].id
  );

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  return (
    <div className="py-4">
      {/* 分類標籤 */}
      <div className="flex justify-between">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`pb-2 w-full border-b-2 text-sm ${
              activeCategory === category.id
                ? "border-[#A63A3A] text-[#A63A3A] border-b-[3px]"
                : "hover:text-gray-500"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* 素材列表 */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {materials[activeCategory]?.map((material) => (
          <MaterialCard key={material.id} material={material} />
        ))}
      </div>
    </div>
  );
}
