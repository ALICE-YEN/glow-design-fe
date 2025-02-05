import { RefObject, useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  MotionValue,
  useInView,
  useMotionValueEvent,
  useScroll,
  UseScrollOptions,
  useTransform,
} from "motion/react";

const Active = ({ width }: { width: MotionValue<string> }) => {
  return (
    <motion.div
      className="absolute left-0 top-0 h-full w-full rounded-md border-[1px] border-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="absolute left-0 top-0 h-full bg-white"
        style={{ width }}
      ></motion.div>
    </motion.div>
  );
};

const useFillWidth = ({
  target,
  offset = ["start 0.6", "end 0.6"],
}: UseScrollOptions) => {
  const { scrollYProgress } = useScroll({
    target: target,
    offset: offset,
  });
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const defaultIsInView = useInView(target!, { once: true });
  const [isInView, setIsInView] = useState(defaultIsInView);

  useEffect(() => {
    setIsInView(defaultIsInView);
  }, [defaultIsInView]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (value === 1) {
      setIsInView(false);
    } else {
      setIsInView(true);
    }
  });

  return { width, isInView };
};

const AnchorMenu = ({
  heroRef,
  aboutRef,
  howItWorksRef,
  stepsRef,
}: {
  heroRef: RefObject<HTMLDivElement>;
  aboutRef: RefObject<HTMLDivElement>;
  howItWorksRef: RefObject<HTMLDivElement>;
  stepsRef: RefObject<HTMLDivElement>;
}) => {
  const hero = useFillWidth({
    target: heroRef,
    offset: ["end end", "end start"],
  });
  const about = useFillWidth({
    target: aboutRef,
    offset: ["start start", "end 0.6"],
  });
  const howItWorks = useFillWidth({
    target: howItWorksRef,
    offset: ["start start", "end 0.6"],
  });
  const steps = useFillWidth({ target: stepsRef });

  const menuVisible =
    hero.isInView || about.isInView || howItWorks.isInView || steps.isInView;

  const handleScrollIntoView = (ref: RefObject<HTMLDivElement>) => () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {menuVisible && (
        <motion.div
          className="fixed bottom-10 w-screen"
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.3 }}
        >
          <div className="mx-auto flex w-fit gap-1 rounded-md bg-gray-300 bg-opacity-30 p-1 backdrop-blur-lg">
            <button
              className="relative overflow-hidden rounded-md px-4 py-2 text-gray-400 transition duration-300 hover:bg-gray-500"
              onClick={handleScrollIntoView(heroRef)}
            >
              <span className="relative z-10">Let&apos;s</span>
              {hero.isInView && <Active width={hero.width} />}
            </button>

            <button
              className="relative overflow-hidden rounded-md px-4 py-2 text-gray-400 transition duration-300 hover:bg-gray-500"
              onClick={handleScrollIntoView(aboutRef)}
            >
              <span className="relative z-10">Start</span>
              {!hero.isInView && about.isInView && (
                <Active width={about.width} />
              )}
            </button>

            <button
              className="relative overflow-hidden rounded-md px-4 py-2 text-gray-400 transition duration-300 hover:bg-gray-500"
              onClick={handleScrollIntoView(howItWorksRef)}
            >
              <span className="relative z-10">Glow</span>
              {!about.isInView && howItWorks.isInView && (
                <Active width={howItWorks.width} />
              )}
            </button>

            <button
              className="relative overflow-hidden rounded-md px-4 py-2 text-gray-400 transition duration-300 hover:bg-gray-500"
              onClick={handleScrollIntoView(stepsRef)}
            >
              <span className="relative z-10">Design</span>
              {!howItWorks.isInView && steps.isInView && (
                <Active width={steps.width} />
              )}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnchorMenu;
