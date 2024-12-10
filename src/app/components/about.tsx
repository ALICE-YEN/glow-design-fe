import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });

  // free
  const opacity1 = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const blur1 = useTransform(scrollYProgress, [0, 0.4], [20, 0]);
  const translate1Y = useTransform(scrollYProgress, [0, 0.4], [100, 0]);
  const filter1 = useTransform(() => `blur(${blur1.get()}px)`);
  const translate1 = useTransform(() => `0px ${translate1Y.get()}px`);

  // prototype
  const opacity2 = useTransform(scrollYProgress, [0.4, 0.7], [0, 1]);
  const blur2 = useTransform(scrollYProgress, [0.4, 0.7], [20, 0]);
  const translate2Y = useTransform(scrollYProgress, [0.4, 0.7], [100, 0]);
  const filter2 = useTransform(() => `blur(${blur2.get()}px)`);
  const translate2 = useTransform(() => `0px ${translate2Y.get()}px`);

  const [current, setCurrent] = useState<0 | 1 | 2>(0);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.4) {
      setCurrent(0);
    } else if (latest < 0.7) {
      setCurrent(1);
    } else {
      setCurrent(2);
    }
  });

  return (
    <div className="h-[250vh]" ref={ref}>
      <div className="sticky top-0 mx-auto flex h-screen w-full max-w-7xl items-center px-10 xl:px-4">
        <div className="flex w-full items-center justify-between gap-20">
          <div className="space-y-8">
            <h1 className="heading-md text-white">
              室內設計
              <br />
              讓創意流動
            </h1>
            <motion.h1
              className="heading-md text-white"
              style={{
                opacity: opacity1,
                filter: filter1,
                translate: translate1,
              }}
            >
              Easy
            </motion.h1>
            <motion.h1
              className="heading-md text-white"
              style={{
                opacity: opacity2,
                filter: filter2,
                translate: translate2,
              }}
            >
              Professional
            </motion.h1>
          </div>

          <AnimatePresence mode="popLayout">
            {current === 0 && (
              <motion.div
                key={0}
                className="w-[360px] rounded-2xl border-[1px] border-white p-8 text-xl text-white"
                initial={{ opacity: 0, filter: "blur(20px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(20px)" }}
              >
                「從靈感到落地，只需幾步。」 — Alice
                <img src="https://plan-a-design.vercel.app/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdatj4og4i%2Fimage%2Fupload%2Ff_auto%2Cq_auto%2Fv1725725397%2Ffloor-plan2_f0juoa.png&w=1080&q=75"></img>
              </motion.div>
            )}
            {current === 1 && (
              <motion.div
                key={1}
                className="w-[360px] rounded-2xl border-[1px] border-white p-8 text-xl text-white"
                initial={{ opacity: 0, filter: "blur(20px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(20px)" }}
              >
                「專業工具，簡約設計，精準呈現。」 — William
                <img src="https://plan-a-design.vercel.app/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdatj4og4i%2Fimage%2Fupload%2Ff_auto%2Cq_auto%2Fv1725725397%2Ffloor-plan2_f0juoa.png&w=1080&q=75"></img>
              </motion.div>
            )}
            {current === 2 && (
              <motion.div
                key={2}
                className="w-[360px] rounded-2xl border-[1px] border-white p-8 text-xl text-white"
                initial={{ opacity: 0, filter: "blur(20px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(20px)" }}
              >
                「讓設計不再只是構想，而是觸手可及。」 — Sam
                {/* 「專為設計愛好者與專業人士打造的室內設計工具，直觀的操作介面，實現快速且精準的設計。」
                — Sam */}
                <img src="https://plan-a-design.vercel.app/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdatj4og4i%2Fimage%2Fupload%2Ff_auto%2Cq_auto%2Fv1725725397%2Ffloor-plan2_f0juoa.png&w=1080&q=75"></img>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const HowToBeginXS = () => {
  return (
    <div className="grid justify-center gap-8 px-10">
      <motion.div
        key={0}
        className="rounded-2xl border-[1px] border-white p-8 text-xl text-white"
        initial={{ opacity: 0, filter: "blur(10px)", translateY: "40px" }}
        whileInView={{ opacity: 1, filter: "blur(0px)", translateY: "0px" }}
        transition={{ duration: 1, ease: "easeIn" }}
        viewport={{ margin: "-200px 0px 0px 0px", once: true }}
      >
        <div className="heading-md mb-4">
          室內設計
          <br />
          讓創意流動
        </div>
        <div>
          「從靈感到落地，只需幾步。」 — Alice
          <img src="https://plan-a-design.vercel.app/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdatj4og4i%2Fimage%2Fupload%2Ff_auto%2Cq_auto%2Fv1725725397%2Ffloor-plan2_f0juoa.png&w=1080&q=75"></img>
        </div>
      </motion.div>
      <motion.div
        key={1}
        className="rounded-2xl border-[1px] border-white p-8 text-xl text-white"
        initial={{ opacity: 0, filter: "blur(10px)", translateY: "40px" }}
        whileInView={{ opacity: 1, filter: "blur(0px)", translateY: "0px" }}
        transition={{ duration: 1, ease: "easeIn" }}
        viewport={{ margin: "-200px 0px 0px 0px", once: true }}
      >
        <div className="heading-md mb-4">Easy</div>
        <div>
          「專業工具，簡約設計，精準呈現。」 — William
          <img src="https://plan-a-design.vercel.app/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdatj4og4i%2Fimage%2Fupload%2Ff_auto%2Cq_auto%2Fv1725725397%2Ffloor-plan2_f0juoa.png&w=1080&q=75"></img>
        </div>
      </motion.div>
      <motion.div
        key={2}
        className="rounded-2xl border-[1px] border-white p-8 text-xl text-white"
        initial={{ opacity: 0, filter: "blur(10px)", translateY: "40px" }}
        whileInView={{ opacity: 1, filter: "blur(0px)", translateY: "0px" }}
        transition={{ duration: 1, ease: "easeIn" }}
        viewport={{ margin: "-200px 0px 0px 0px", once: true }}
      >
        <div className="heading-md mb-4">Professional</div>
        <div>
          「讓設計不再只是構想，而是觸手可及。」 — Sam
          <img src="https://plan-a-design.vercel.app/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdatj4og4i%2Fimage%2Fupload%2Ff_auto%2Cq_auto%2Fv1725725397%2Ffloor-plan2_f0juoa.png&w=1080&q=75"></img>
        </div>
      </motion.div>
    </div>
  );
};

const HowToBegin = () => {
  return (
    <>
      <div className="hidden md:block">
        <HowToBeginMd />
      </div>

      <div className="block md:hidden">
        <HowToBeginXS />
      </div>
    </>
  );
};
