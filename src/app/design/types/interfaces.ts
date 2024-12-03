import type { StaticImageData } from "next/image";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export interface SidebarButtonConfig {
  id: string;
  icon: IconDefinition;
  label: string;
  title: string;
  description: string;
}

export interface Material {
  id: string;
  name: string;
  src: string | StaticImageData;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
}
