"use client";

// import Image from "next/image";
import { useRouter } from "next/navigation";

interface CardProps {
  src: string;
  title: string;
}

export default function Card({ src, title }: CardProps) {
  const router = useRouter();

  return (
    <div
      className="bg-white rounded-card shadow-md overflow-hidden cursor-pointer hover:shadow-xl"
      onClick={() => router.push("/design/1")}
    >
      <img src={src} alt={title} className="w-full h-56 object-cover" />
      {/* <Image
        src={src}
        alt={title}
        width={140}
        height={140}
        className="card__img object-cover"
      /> */}
      <div className="p-4 text-center">
        <p className="text-base font-bold">{title}</p>
        <p className="text-sm text-secondary">2 天前</p>
      </div>
    </div>
  );
}
