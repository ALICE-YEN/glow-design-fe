"use client";

// 要改要改 components 內的檔案名稱為 Pascal Case

import { useEffect, useRef } from "react";
// import { ReactLenis } from "lenis/react"; // 還沒有感覺用處！
import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import About from "@/app/components/About";
import HowItWorks from "@/app/components/HowItWorks";
import AnchorMenu from "@/app/components/AnchorMenu";
import Steps from "@/app/components/Steps";
import TheEnd from "@/app/components/TheEnd";
import Footer from "@/app/components/Footer";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // prevent history restore position
    window.history.scrollRestoration = "manual";
  }, []);

  return (
    <div>
      <main>
        <Header showInitTitle={false} />
        {/* <ReactLenis root> */}
        <div ref={heroRef}>
          <Hero />
        </div>
        <div ref={aboutRef}>
          <About />
        </div>
        <div ref={howItWorksRef}>
          <HowItWorks />
        </div>
        <div ref={stepsRef}>
          <Steps />
        </div>
        <TheEnd />

        <div className="hidden md:block">
          <AnchorMenu
            heroRef={heroRef}
            aboutRef={aboutRef}
            howItWorksRef={howItWorksRef}
            stepsRef={stepsRef}
          />
        </div>
        {/* </ReactLenis> */}
      </main>

      <Footer />
    </div>
  );
}
