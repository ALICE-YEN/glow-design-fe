"use client";

import { PropsWithChildren, useMemo, useRef } from "react";
import { motion, MotionValue, useScroll, useTransform } from "motion/react"; // useScroll：監聽滾動進度。useTransform：根據滾動進度調整透明度、寬度、高度等動畫屬性。
import { useWindowSize } from "usehooks-ts"; // useWindowSize：獲取當前視窗的寬度和高度。

type WordType = { word: string; range: [number, number] };

const TextRevealByWord = ({ paragraphs }: { paragraphs: string[] }) => {
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end end"], // 表示動畫開始於容器進入螢幕中央時，結束於容器底部完全滾出螢幕時。
  });

  const paragraphWords = useMemo(() => {
    const arr = paragraphs.map((text) => text.split(" "));
    const totalWords = arr.reduce((acc, cur) => acc + cur.length, 0) * 2;

    let accumulatedWords = 0;
    return arr.reduce<WordType[][]>((acc, cur, index) => {
      if (index > 0) {
        accumulatedWords += arr[index - 1].length;
      }

      const words: WordType[] = cur.map((word, wordIndex) => {
        const start = (accumulatedWords + wordIndex) / totalWords;
        const end = (accumulatedWords + wordIndex + 1) / totalWords;
        return { word, range: [start, end] };
      });

      acc.push(words);

      return acc;
    }, []);
  }, [paragraphs]);

  const opacityOfText = useTransform(
    scrollYProgress,
    [0, 0.5, 0.6], // 在滾動 0~50% 時，保持完全顯示（透明度 1）
    [1, 1, 0.2] // 在 50%~60% 時，逐漸變淡到透明（透明度 0.2）
  );

  // 寬度和高度隨滾動進度逐漸增加
  const preventShowBorderRadius = 50; //  避免背景框過早超出螢幕
  const width = useTransform(
    scrollYProgress,
    [0.6, 1],
    [400, windowWidth + preventShowBorderRadius]
  );
  const height = useTransform(
    scrollYProgress,
    [0.6, 1],
    [300, windowHeight + preventShowBorderRadius]
  );
  const opacityOfCard = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]); // 在滾動進度 50%~60% 時，背景框漸漸顯示

  return (
    <div className="relative h-[200vh]" ref={ref}>
      <div className="sticky top-0 h-screen overflow-clip">
        <div className="mx-auto max-w-3xl space-y-2 pt-12">
          {paragraphWords.map((paragraph, pIndex) => (
            <motion.p
              key={pIndex}
              className="flex flex-wrap p-3 text-xl md:text-2xl lg:text-4xl"
              style={{ opacity: opacityOfText }}
            >
              {paragraph.map((word, wIndex) => {
                // 每個單詞是一個 Word 元件，根據 scrollYProgress 和範圍 range 設定動畫透明度
                return (
                  <Word
                    key={wIndex}
                    progress={scrollYProgress}
                    range={word.range}
                  >
                    {word.word}
                  </Word>
                );
              })}
            </motion.p>
          ))}
        </div>

        {/* <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="grid place-content-center rounded-xl bg-gray-950"
            style={{ width, height, opacity: opacityOfCard }}
          >
            <div className="h-[300px] w-[400px] p-10 text-xl text-white md:text-2xl lg:text-3xl">
              1Lorem Ipsum is not simply random text. It has roots in a piece of
              classical Latin literature from 45 BC.
            </div>
          </motion.div>
        </div> */}
      </div>
    </div>
  );
};

const Word = ({
  children,
  progress,
  range,
}: PropsWithChildren<{
  progress: MotionValue<number>;
  range: [number, number];
}>) => {
  const opacity = useTransform(progress, range, [0.2, 1]); // 每個單詞的透明度根據滾動進度在 range 範圍內變化

  return (
    <span className="xl:lg-3 relative mx-1 lg:mx-2.5">
      <motion.span style={{ opacity: opacity }} className="text-gray-950">
        {children}
      </motion.span>
    </span>
  );
};

const TextReveal = () => {
  return (
    <div className="bg-[#F1F1F1]">
      <TextRevealByWord
        paragraphs={[
          "STEP1：繪製空間。使用繪製工具繪製牆面，系統自動識別並生成封閉空間，未完成封閉空間的牆面可接續繪製",
          "STEP2：應用材質。從材質庫內選擇材質，一鍵應用至選取的空間，可即時預覽、隨時更換以達到理想效果",
          "STEP3：擺放家具。從家具庫內選擇家具，以拖曳方式自由擺放，可按右鍵使用操作選單進行更多操作",
          "STEP4：分享成果。完成設計後，可匯出圖片格式與親友分享圖面",
        ]}
      />
    </div>
  );
};

export default TextReveal;
