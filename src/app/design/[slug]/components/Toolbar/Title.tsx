"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface TitleProps {
  designTitle: string;
}

export default function Title({ designTitle }: TitleProps) {
  const [title, setTitle] = useState(designTitle);
  const [isEditing, setIsEditing] = useState(false);

  const pathname = usePathname();
  const designId = pathname.split("/").pop();

  const queryClient = useQueryClient();

  const updateTitleMutation = useMutation({
    mutationFn: async (newTitle: string) => {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/designs/${designId}`,
        { name: newTitle }
      );
      return response.data;
    },
    // 更新成功後，重新取得設計資料
    onSuccess: () => {
      queryClient.invalidateQueries(["design", designId]);
      toast.success("設計重新命名成功");
    },
    onError: (error) => {
      console.error("更新失敗：", error);
      toast.error("重新命名失敗，請稍後重試");
      // 回退到原始標題
      setTitle(designTitle);
    },
    // 可選：無論成功或失敗都關閉編輯狀態
    onSettled: () => {
      setIsEditing(false);
    },
  });

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSaveTitle = () => {
    if (title.trim() === "") {
      toast.error("標題不可為空");
      setTitle(designTitle); // 回退到舊值
      setIsEditing(false);
      return;
    }

    // 如果新標題和原本標題相同，就不更新
    if (title.trim() === designTitle.trim()) {
      setIsEditing(false);
      return;
    }

    updateTitleMutation.mutate(title);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSaveTitle();
    } else if (event.key === "Escape") {
      setTitle(designTitle);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center space-x-6 font-bold">
      <Link href="/" className="text-contrast text-xl">
        居然好設計
      </Link>
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleSaveTitle}
          className="border-b-2 focus:outline-none focus:border-contrast text-lg text-primary"
          autoFocus
        />
      ) : (
        <span
          className="text-primary text-lg cursor-pointer hover:underline"
          onClick={() => setIsEditing(true)}
        >
          {title}
        </span>
      )}
    </div>
  );
}
