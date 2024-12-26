"use client";

// 要改要改 components 內的檔案名稱為 Pascal Case

import { useEffect, useRef } from "react";
// import { ReactLenis } from "lenis/react"; // 還沒有感覺用處！
import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import About from "@/app/components/About";
import HowItWorks from "@/app/components/HowItWorks";
import AnchorMenu from "@/app/components/anchor-menu";
import TextReveal from "@/app/components/text-reveal";
import Steps from "@/app/components/Steps";
import TheEnd from "@/app/components/the-end"; // 裡面的按鈕可用，待刪除

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const buildFastRef = useRef<HTMLDivElement>(null);
  const textRevealRef = useRef<HTMLDivElement>(null);
  const heresNowTextRef = useRef<HTMLDivElement>(null);
  const howToBeginRef = useRef<HTMLDivElement>(null);
  const anymoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // prevent history restore position
    window.history.scrollRestoration = "manual";
  }, []);

  return (
    <main>
      <Header showInitTitle={false} />
      {/* <ReactLenis root> */}
      <div ref={heroRef}>
        <Hero />
      </div>
      <div ref={howToBeginRef}>
        <About />
      </div>
      <div ref={buildFastRef}>
        <HowItWorks />
      </div>
      <div ref={textRevealRef}>
        {/* <TextReveal /> */}
        <Steps />
      </div>
      <TheEnd />

      <div className="hidden md:block">
        <AnchorMenu
          heroRef={heroRef}
          howToBeginRef={howToBeginRef}
          buildFastRef={buildFastRef}
          textRevealRef={textRevealRef}
          heresNowTextRef={heresNowTextRef}
          anymoreRef={anymoreRef}
        />
      </div>
      {/* </ReactLenis> */}
    </main>
  );
}
