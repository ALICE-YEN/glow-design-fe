import { motion } from "motion/react";

const TheEnd = () => {
  return (
    <div className="py-10">
      <motion.div
        className="heading-md color mx-auto w-[80%] rounded-full bg-contrast p-8 text-center text-white lg:p-20"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <div className="max-w-[1000px]">開始創作 →</div>
      </motion.div>
    </div>
  );
};

export default TheEnd;
