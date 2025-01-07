import type { StaticImageData } from "next/image";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { Object } from "fabric";
export interface SidebarButtonConfig {
  id: string;
  icon: IconDefinition;
  label: string;
  title: string;
  description: string;
}

export interface CategoryWithMaterials {
  id: string;
  name: string;
  materials: Material[];
}

export interface Material {
  id: string;
  name: string;
  src: string | StaticImageData;
  description: string;
  url: string; // 之後就不會有分開
}

export interface Point {
  x: number;
  y: number;
}

export interface CanvasState {
  canvas: Object; // Adjust to match the fabric.js `toObject()` type
  points: Point[];
}
