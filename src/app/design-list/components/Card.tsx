"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/zh-tw";
import Modal from "@/app/components/Modal";
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
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    label: string;
    inputValue: string;
    onConfirm: (updatedValue: string) => void;
  }>({
    isOpen: false,
    title: "",
    label: "",
    inputValue: "",
    onConfirm: () => {},
  });

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
      toast.success("設計刪除成功");
    },
    onError: (error) => {
      console.error("刪除失敗：", error);
      toast.error("刪除失敗，請稍後重試");
    },
  });

  const handleModalAction = (action: "rename" | "edit" | "delete") => {
    setMenuOpen(false);

    const actionConfig = {
      rename: {
        title: "重新命名",
        label: "請輸入新的名稱",
        inputValue: title,
        onConfirm: (updatedValue: string) =>
          console.log(`重新命名設計：${updatedValue}`),
      },
      edit: {
        title: "修改描述",
        label: "請輸入新的設計描述",
        inputValue: description,
        onConfirm: (updatedValue: string) =>
          console.log(`修改設計描述：${updatedValue}`),
      },
      delete: {
        title: "刪除確認",
        label: "確定要刪除這個設計嗎？",
        inputValue: "",
        onConfirm: () => deleteDesignMutation.mutate(),
      },
    };

    setModalConfig({
      isOpen: true,
      title: actionConfig[action].title,
      label: actionConfig[action].label,
      inputValue: actionConfig[action].inputValue,
      onConfirm: actionConfig[action].onConfirm,
    });
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
            onRename={(e) => {
              e.stopPropagation();
              handleModalAction("rename");
            }}
            onEditDescription={(e) => {
              e.stopPropagation();
              handleModalAction("edit");
            }}
            onDelete={(e) => {
              e.stopPropagation();
              handleModalAction("delete");
            }}
            onClose={() => setMenuOpen(false)}
            excludeRef={menuButtonRef}
          />
        )}
      </div>
      <div className="p-4 text-center">
        <p className="text-base font-bold">{title}</p>
        <p className="text-sm text-secondary">{timeAgo}</p>
      </div>
      <Modal
        isOpen={modalConfig.isOpen}
        onConfirm={() => {
          modalConfig.onConfirm(modalConfig.inputValue);
        }}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
        title={modalConfig.title}
      >
        <p>{modalConfig.label}</p>
        {["重新命名", "修改描述"].includes(modalConfig.title) && (
          <input
            type="text"
            value={modalConfig.inputValue}
            onChange={(e) =>
              setModalConfig((prev) => ({
                ...prev,
                inputValue: e.target.value,
              }))
            }
            className="w-full p-2 border border-gray-300 rounded-md mt-2"
          />
        )}
      </Modal>
    </div>
  );
}
