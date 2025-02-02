"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/zh-tw";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.locale("zh-tw");

interface CardProps {
  id: number;
  title: string;
  src: string;
  description: string;
  updatedAt: Date;
}

export default function Card({
  id,
  title,
  src,
  description,
  updatedAt,
}: CardProps) {
  const router = useRouter();

  const [timeAgo, setTimeAgo] = useState("");

  // TODO: 時間還是有問題!!!!!!
  useEffect(() => {
    setTimeAgo(dayjs.utc(updatedAt).local().fromNow());
  }, [updatedAt]);

  return (
    <div
      className="bg-white rounded-card shadow-md overflow-hidden cursor-pointer hover:shadow-xl"
      onClick={() => router.push(`/design/${id}`)}
    >
      {/* <img src={src} alt={title} className="w-full h-56 object-cover" /> */}
      <div className="big-card cursor-pointer">
        <img src={src} alt={title} className="big-card__img" />
        <div className="big-card__content">
          <p className="big-card__content__text">{description}</p>
        </div>
      </div>
      <div className="p-4 text-center">
        <p className="text-base font-bold">{title}</p>
        <p className="text-sm text-secondary">{timeAgo}</p>
      </div>
    </div>
  );
}
