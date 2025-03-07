import { motion, useScroll, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";

const BuildFast = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [numberOfCards, setNumberOfCards] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // h1 - 1
  const opacity1 = useTransform(
    scrollYProgress,
    [0, 0.25, 0.4, 0.5],
    [0, 1, 1, 0]
  );
  const blur1 = useTransform(
    scrollYProgress,
    [0, 0.25, 0.4, 0.5],
    [20, 0, 0, 20]
  );
  const filter1 = useTransform(() => `blur(${blur1.get()}px)`);
  // h1 - 2
  const opacity2 = useTransform(scrollYProgress, [0.4, 0.45], [0, 1]);
  const blur2 = useTransform(scrollYProgress, [0.4, 0.45], [20, 0]);
  const filter2 = useTransform(() => `blur(${blur2.get()}px)`);

  // cards reveal animation
  const scale = useTransform(scrollYProgress, [0.4, 0.5], [0.02, 1.25]);

  useLayoutEffect(() => {
    function calculateCards() {
      if (ref.current) {
        const h = ref.current.clientHeight / 2;
        const w = ref.current.clientWidth;
        const cardHeight = 300;
        const cardWidth = 200;

        const rows = Math.ceil(h / cardHeight); // 確保超過高度
        const columns = Math.ceil(w / cardWidth) + 1; // 確保超過寬度

        // 總卡片數量
        setNumberOfCards(rows * columns);
      }
    }

    calculateCards();
    window.addEventListener("resize", calculateCards);

    return () => {
      window.removeEventListener("resize", calculateCards);
    };
  }, []);

  return (
    <motion.div className="h-[200vh]" ref={ref}>
      <div className="max-w-screen sticky top-0 flex h-screen items-center justify-center overflow-clip">
        <motion.h1
          className="heading-md absolute z-10 max-w-[500px] text-center text-white md:max-w-[650px] px-4"
          style={{
            opacity: opacity1,
            filter: filter1,
          }}
        >
          HOW IT WORKS
        </motion.h1>
        <motion.h1
          className="heading-md absolute z-10 max-w-[400px] text-center text-gray-950 md:max-w-[700px]"
          style={{
            opacity: opacity2,
            filter: filter2,
          }}
        >
          <img src="https://plan-a-design.vercel.app/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdatj4og4i%2Fimage%2Fupload%2Ff_auto%2Cq_auto%2Fv1725725397%2Ffloor-plan2_f0juoa.png&w=1080&q=75"></img>
        </motion.h1>
        <div className="absolute grid min-h-screen w-[120%] grid-cols-[repeat(auto-fill,200px)] grid-rows-[repeat(auto-fill,300px)] place-content-center">
          {Array.from({ length: numberOfCards }).map((_, index) => (
            <motion.div
              key={index}
              className="rounded-xl bg-panel-background"
              style={{ scale }}
            ></motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default BuildFast;
