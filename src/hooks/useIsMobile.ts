import { useEffect, useState } from "react";

function useIsMobile(breakpoint = 800) {
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < breakpoint);
      setIsReady(true);
    };

    check();

    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return { isMobile, isReady };
}

export default useIsMobile;
