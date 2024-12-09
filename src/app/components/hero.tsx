import { motion } from "motion/react";

const HeroMD = () => {
  return (
    <>
      <motion.h1
        className="heading-lg absolute max-w-[1200px] origin-center text-center"
        initial={{ lineHeight: "120px" }}
        whileInView={{ lineHeight: "200px" }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
      >
        &nbsp; 居 然 好 設 計 &nbsp; Glow Design
      </motion.h1>
      <motion.div
        className="absolute max-w-[850px] origin-center text-center text-3xl leading-[200px]"
        initial={{ opacity: 0, filter: "blur(20px)" }}
        whileInView={{ opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div>Home</div>
        <div>Work</div>
        <div>Life</div>
      </motion.div>
    </>
  );
};

const HeroXS = () => {
  return (
    <>
      <motion.h1
        className="heading-lg max-w-[1200px] text-center"
        initial={{ opacity: 0, filter: "blur(20px)" }}
        whileInView={{ opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
      >
        居 然 好 設 計 Glow Design
      </motion.h1>
      <motion.div
        className="max-w-[850px] text-center text-3xl"
        initial={{ opacity: 0, filter: "blur(20px)" }}
        whileInView={{ opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
      >
        <div>Home</div>
        <div>Work</div>
        <div>Life</div>
      </motion.div>
    </>
  );
};

export default function Hero() {
  return (
    <div className="h-[100vh] bg-background text-white">
      <div className="relative hidden h-full w-full place-items-center md:grid">
        <HeroMD />
      </div>
      <div className="relative block h-full w-full place-content-center md:hidden">
        <HeroXS />
      </div>
    </div>
  );
}
