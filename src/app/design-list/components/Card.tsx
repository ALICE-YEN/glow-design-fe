"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/zh-tw";
import CardMenu from "./CardMenu";

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

  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const [timeAgo, setTimeAgo] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: userSession } = useSession();
  const userId = Number(userSession?.user?.id);

  // TODO: 時間還是有問題!!!!!!
  useEffect(() => {
    setTimeAgo(dayjs.utc(updatedAt).local().fromNow());
  }, [updatedAt]);

  const queryClient = useQueryClient();

  const deleteDesignMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/designs/${id}`
      );
      return response.data;
    },
    // 刪除成功後，可依據需求刷新設計列表
    onSuccess: () => {
      queryClient.invalidateQueries(["design-list", userId]);
    },
    onError: (error) => {
      console.error("刪除失敗：", error);
      alert("刪除失敗，請稍後重試");
    },
  });

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation(); // 避免觸發卡片整體的 onClick
    alert(`重新命名設計：${title}`);
    setMenuOpen(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`確定刪除設計：${title}？`)) {
      deleteDesignMutation.mutate();
    }
    setMenuOpen(false);
  };

  return (
    <div
      className="bg-white rounded-card shadow-md overflow-hidden cursor-pointer hover:shadow-xl"
      onClick={() => router.push(`/design/${id}`)}
    >
      {/* <img src={src} alt={title} className="w-full h-56 object-cover" /> */}
      <div className="big-card cursor-pointer">
        <img src={src} alt={title} className="big-card__img" />
        <button
          ref={menuButtonRef}
          className="absolute top-2 right-2 w-8 h-8 text-primary rounded-default bg-white/20 hover:bg-white/70"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((prev) => !prev);
          }}
        >
          <FontAwesomeIcon icon={faEllipsisV} />
        </button>
        <div className="big-card__content">
          <p className="big-card__content__text">{description}</p>
        </div>

        {menuOpen && (
          <CardMenu
            onRename={handleRename}
            onDelete={handleDelete}
            onClose={() => setMenuOpen(false)}
            excludeRef={menuButtonRef}
          />
        )}
      </div>
      <div className="p-4 text-center">
        <p className="text-base font-bold">{title}</p>
        <p className="text-sm text-secondary">{timeAgo}</p>
      </div>
    </div>
  );
}
