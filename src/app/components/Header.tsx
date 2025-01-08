// header 退場動畫有點怪

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import { useAppSelector, useAppDispatch } from "@/services/redux/hooks";
import { openAuthModal } from "@/store/userSlice";
import UserProfileButton from "@/app/components/UserProfileButton";

interface HeaderProps {
  showInitTitle?: boolean;
}

export default function Header({ showInitTitle = true }: HeaderProps) {
  const [showDetailedHeader, setShowDetailedHeader] = useState(false);

  const { data: userSession } = useSession(); // for Client Component。`useSession` must be wrapped in a <SessionProvider />
  console.log("useSession", userSession);

  const isAuthModalOpen = useAppSelector((state) => state.user.isAuthModalOpen);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setShowDetailedHeader(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 對首頁 ReactLenis 無效！！Modal 只會出現在首頁，暫時先移除 ReactLenis（感覺無用）
  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isAuthModalOpen]);

  return (
    <div>
      <header
        className={`fixed top-0 left-0 w-full z-10 duration-300 ${
          showDetailedHeader
            ? "bg-white shadow border-b border-panel-background py-2.5"
            : "bg-transparent py-16"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center">
          {/* Title */}
          <Link
            href="/"
            className={`text-contrast font-bold transition-transform duration-300 ${
              showDetailedHeader
                ? "translate-y-0 text-2xl"
                : `-translate-y-4 text-4xl ${!showInitTitle && "invisible"}`
            }`}
          >
            居然好設計 Glow Design
          </Link>

          {/* Button */}
          {userSession ? (
            <UserProfileButton showDetailedHeader={showDetailedHeader} />
          ) : (
            // <button
            //   onClick={() => setIsAuthModalOpen(true)}
            //   className={`px-3 py-2 text-lg text-contrast font-bold rounded-full border border-contrast transition-transform duration-300 hover:scale-105 ${
            //     showDetailedHeader ? "translate-y-0" : "-translate-y-4"
            //   }`}
            // >
            //   開始設計
            // </button>
            <motion.button
              className="px-3 py-2 text-lg text-contrast font-bold rounded-full border border-contrast"
              onClick={() => dispatch(openAuthModal())}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="mx-auto max-w-[1000px]">開始設計 →</div>
            </motion.button>
          )}
        </div>
      </header>
    </div>
  );
}
