import { motion } from "motion/react";

const TheEnd = () => {
  return (
    <div className="bg-[#F1F1F1] py-10">
      <motion.div
        className="heading-md color mx-auto w-[90%] rounded-3xl bg-gray-950 p-8 text-center uppercase text-white lg:p-20"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <div className="mx-auto max-w-[1000px]">開始創作 →</div>
      </motion.div>
    </div>
  );
};

export default TheEnd;
