"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

export default function ViewportWarning() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center text-panel-background px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-contrast mb-10"
      >
        <FontAwesomeIcon icon={faCircleExclamation} size="6x" />
      </motion.div>

      <h1 className="text-xl font-semibold mb-2">
        請使用桌面版瀏覽器以獲得最佳設計體驗
      </h1>
      <p className="mb-10">您當前的設備螢幕太小，無法提供完整的設計功能</p>

      <motion.button
        className="px-3 py-2 sm:text-lg text-contrast font-bold rounded-full border border-contrast"
        onClick={() => router.push("/")}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <div className="mx-auto max-w-[1000px]">返回首頁 →</div>
      </motion.button>
    </div>
  );
}
