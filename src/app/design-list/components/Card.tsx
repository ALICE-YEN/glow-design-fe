"use client";

import Image from "next/image";

interface CardProps {
  src: string;
  title: string;
}

export default function Card({ src, title }: CardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer">
      <img src={src} alt={title} className="w-full h-32 object-cover" />
      {/* <Image
        src={src}
        alt={title}
        width={140}
        height={140}
        className="card__img object-cover"
      /> */}
      <div className="p-4 text-center">
        <p className="text-lg font-bold">{title}</p>
        <p className="text-sm text-gray-500">2 天前</p>
      </div>
    </div>
  );
}
