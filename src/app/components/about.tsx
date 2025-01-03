import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";

const Slide = ({ opacity, filter, translate, children }: any) => (
  <motion.h1
    className="heading-md text-white"
    style={{
      opacity,
      filter,
      transform: `translate(${translate})`,
    }}
  >
    {children}
  </motion.h1>
);

const QuoteCard = ({
  content,
  imgSrc,
}: {
  content: string;
  imgSrc: string;
}) => (
  <motion.div
    className="w-[400px] lg:w-[460px] rounded-card border-[1px] border-white p-8 text-xl text-white"
    initial={{ opacity: 0, filter: "blur(20px)" }}
    animate={{ opacity: 1, filter: "blur(0px)" }}
    exit={{ opacity: 0, filter: "blur(20px)" }}
  >
    {content}
    <img src={imgSrc} alt="Design Preview"></img>
  </motion.div>
);

const HowToBeginMd = () => {
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
      <div className="sticky top-0 mx-auto flex h-screen w-full max-w-7xl items-center px-16 xl:px-20">
        <div className="flex w-full items-center justify-between gap-20">
          <div className="space-y-8">
            <h1 className="heading-md text-white">
              室內設計
              <br />
              讓創意流動
            </h1>
            <Slide opacity={opacity1} filter={filter1} translate={translate1}>
              Easy
            </Slide>
            <Slide opacity={opacity2} filter={filter2} translate={translate2}>
              Professional
            </Slide>
          </div>

          <AnimatePresence mode="popLayout">
            {current === 0 && (
              <QuoteCard
                content="「從靈感到落地，只需幾步。」 — Alice"
                imgSrc="https://plan-a-design.vercel.app/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdatj4og4i%2Fimage%2Fupload%2Ff_auto%2Cq_auto%2Fv1725725397%2Ffloor-plan2_f0juoa.png&w=1080&q=75"
              />
            )}
            {current === 1 && (
              <QuoteCard
                content="「專業工具，簡約設計，精準呈現。」 — William"
                imgSrc="https://plan-a-design.vercel.app/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdatj4og4i%2Fimage%2Fupload%2Ff_auto%2Cq_auto%2Fv1725725397%2Ffloor-plan2_f0juoa.png&w=1080&q=75"
              />
            )}
            {current === 2 && (
              <QuoteCard
                content="「讓設計不再只是構想，而是觸手可及。」 — Sam"
                imgSrc="https://plan-a-design.vercel.app/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdatj4og4i%2Fimage%2Fupload%2Ff_auto%2Cq_auto%2Fv1725725397%2Ffloor-plan2_f0juoa.png&w=1080&q=75"
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const HowToBeginXS = () => {
  const cardData = [
    {
      heading: (
        <>
          室內設計
          <br />
          讓創意流動
        </>
      ),
      content: "「從靈感到落地，只需幾步。」 — Alice",
    },
    {
      heading: "Easy",
      content: "「專業工具，簡約設計，精準呈現。」 — William",
    },
    {
      heading: "Professional",
      content: "「讓設計不再只是構想，而是觸手可及。」 — Sam",
    },
  ];

  return (
    <div className="grid justify-center gap-8 px-10">
      {cardData.map((card, idx) => (
        <motion.div
          key={idx}
          className="rounded-card border-[1px] border-white p-8 text-xl text-white"
          initial={{ opacity: 0, filter: "blur(10px)", translateY: "40px" }}
          whileInView={{ opacity: 1, filter: "blur(0px)", translateY: "0px" }}
          transition={{ duration: 1, ease: "easeIn" }}
          viewport={{ margin: "-200px 0px 0px 0px", once: true }}
        >
          <div className="heading-md mb-4">{card.heading}</div>
          <div>{card.content}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default function HowToBegin() {
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
}
