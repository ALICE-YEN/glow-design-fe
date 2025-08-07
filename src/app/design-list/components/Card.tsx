"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/zh-tw";
import { updateDesign, deleteDesign } from "@/services/apis";
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

  const { data: userSession } = useSession();
  const userId = Number(userSession?.user?.id);

  const [timeAgo, setTimeAgo] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    actionType: "rename" | "edit" | "delete" | null;
    title: string;
    label: string;
    inputValue: string;
  }>({
    isOpen: false,
    actionType: null,
    title: "",
    label: "",
    inputValue: "",
  });
  const [isComposing, setIsComposing] = useState(false); // 正在中文輸入

  // TODO: 時間還是有問題!!!!!!
  useEffect(() => {
    setTimeAgo(dayjs.utc(updatedAt).local().fromNow());
  }, [updatedAt]);

  const queryClient = useQueryClient();

  const updateDesignMutation = useMutation({
    mutationFn: (body: { name?: string; description?: string }) =>
      updateDesign(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries(["design-list", userId]);
      console.log("modalConfig", modalConfig);
      toast.success("設計修改成功");
    },
    onError: (error) => {
      console.error("修改失敗：", error);
      toast.error("修改失敗，請稍後重試");
    },
  });

  const deleteDesignMutation = useMutation({
    mutationFn: () => deleteDesign(id),
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
      },
      edit: {
        title: "修改描述",
        label: "請輸入新的設計描述",
        inputValue: description,
      },
      delete: {
        title: "刪除確認",
        label: "確定要刪除這個設計嗎？",
        inputValue: "",
      },
    };

    setModalConfig({
      isOpen: true,
      actionType: action,
      title: actionConfig[action].title,
      label: actionConfig[action].label,
      inputValue: actionConfig[action].inputValue,
    });
  };

  const handleConfirm = () => {
    if (modalConfig.actionType === "rename") {
      if (modalConfig.inputValue.trim() === title.trim()) {
        return;
      }
      updateDesignMutation.mutate({ name: modalConfig.inputValue.trim() });
    } else if (modalConfig.actionType === "edit") {
      if (modalConfig.inputValue.trim() === description.trim()) {
        return;
      }
      updateDesignMutation.mutate({
        description: modalConfig.inputValue.trim(),
      });
    } else if (modalConfig.actionType === "delete") {
      deleteDesignMutation.mutate();
    }
  };

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!isComposing) {
        handleConfirm();
        closeModal();
      }
    } else if (e.key === "Escape") {
      closeModal();
    }
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
        onConfirm={handleConfirm}
        onClose={closeModal}
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
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposing(true)} // 中文輸入開始
            onCompositionEnd={() => setIsComposing(false)} // 中文輸入結束
            className="w-full p-2 border border-gray-300 rounded-md mt-2"
            autoFocus
          />
        )}
      </Modal>
    </div>
  );
}
