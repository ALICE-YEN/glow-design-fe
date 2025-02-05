"use client";

import { useState } from "react";
import Link from "next/link";

interface TitleProps {
  designTitle: string;
  updateTitle: (newTitle: string) => Promise<void>;
}

export default function Title({ designTitle, updateTitle }: TitleProps) {
  const [title, setTitle] = useState(designTitle);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSaveTitle = async () => {
    if (title.trim() === "") {
      alert("標題不可為空");
      setTitle(designTitle); // 回退到舊值
      setIsEditing(false);
      return;
    }

    setIsLoading(true);

    try {
      await updateTitle(title);
    } catch (error) {
      console.error("更新失敗：", error);
      alert("更新失敗，請稍後重試");
      setTitle(designTitle); // 回退到舊值
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSaveTitle();
    } else if (event.key === "Escape") {
      setTitle(designTitle);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    handleSaveTitle();
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
          onBlur={handleBlur}
          className="border-b-2 focus:outline-none focus:border-contrast text-lg text-primary"
          autoFocus
        />
      ) : (
        <span
          className="text-primary text-lg cursor-pointer hover:underline"
          onClick={() => setIsEditing(true)}
        >
          {title} {isLoading && " (更新中...)"}
        </span>
      )}
    </div>
  );
}
