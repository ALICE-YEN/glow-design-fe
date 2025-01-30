"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import { useAppDispatch } from "@/services/redux/hooks";
import { openAuthModal } from "@/store/userSlice";

const TheEnd = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { data: userSession } = useSession();

  const handleClick = () => {
    if (userSession) {
      router.push("design-list");
    } else {
      dispatch(openAuthModal());
    }
  };

  return (
    <div className="sm:py-10">
      <motion.div
        className="heading-sm mx-auto scale-50 sm:scale-100 text-center w-[75%] sm:w-[50%] rounded-full bg-contrast cursor-pointer text-white p-10"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        onClick={handleClick}
      >
        <div className="max-w-[1000px]">開始創作 →</div>
      </motion.div>
    </div>
  );
};

export default TheEnd;
