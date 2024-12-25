"use client";

// 要改要改 components 內的檔案名稱為 Pascal Case

import { useEffect, useRef } from "react";
import { ReactLenis } from "lenis/react"; // 還沒有感覺用處！
import Hero from "@/app/components/hero";
import TextMarquee from "@/app/components/text-marquee";
import AnchorMenu from "@/app/components/anchor-menu";
import BuildFast from "@/app/components/build-fast";
import TextReveal from "@/app/components/text-reveal";
import HeresNowText from "@/app/components/heres-now-text";
import About from "@/app/components/about";
import Anymore from "@/app/components/anymore";
import TheEnd from "@/app/components/the-end";

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
      <ReactLenis root>
        <div ref={heroRef}>
          <Hero />
          <TextMarquee />
        </div>
        <div ref={howToBeginRef}>
          <About />
        </div>
        <div ref={buildFastRef}>
          <BuildFast />
        </div>
        <div ref={textRevealRef}>
          <TextReveal />
        </div>
        <div ref={heresNowTextRef}>
          <HeresNowText />
        </div>
        <div ref={anymoreRef}>
          <Anymore />
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
      </ReactLenis>
    </main>
  );
}
