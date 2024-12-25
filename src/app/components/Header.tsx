// header 退場動畫有點怪

import { useEffect, useState } from "react";
import Link from "next/link";

interface HeaderProps {
  showInitTitle?: boolean;
}

export default function Header({ showInitTitle = true }: HeaderProps) {
  const [showDetailedHeader, setShowDetailedHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setShowDetailedHeader(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-10 duration-300 ${
        showDetailedHeader
          ? "bg-white shadow border-b border-panel-background py-2.5"
          : "bg-transparent py-16"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Title */}
        <Link
          href="/"
          className={`text-contrast font-bold transition-transform duration-300 ${
            showDetailedHeader
              ? "translate-y-0 text-2xl"
              : `-translate-y-4 text-4xl ${!showInitTitle && "invisible"}`
          }`}
        >
          居然好設計 Glow Design
        </Link>

        {/* Button */}
        <button
          className={`px-3 py-2 text-white font-bold rounded-full bg-contrast ${
            showDetailedHeader ? "translate-y-0" : "-translate-y-4"
          }`}
        >
          登入
        </button>
      </div>
    </header>
  );
}
