"use client";

// header 退場動畫有點怪

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/app/design-list/components/Card";
import Footer from "@/app/design-list/components/Footer";

export default function DesignList() {
  const [showDetailedHeader, setShowDetailedHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      // 滑動邏輯：當超過 50px 時顯示詳細 Header
      setShowDetailedHeader(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="bg-panel-background min-h-screen">
      <header
        className={`fixed top-0 left-0 w-full z-10 duration-300 ${
          showDetailedHeader
            ? "bg-white shadow border-b border-panel-background py-2.5"
            : "bg-transparent py-16"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className={`text-contrast font-bold transition-transform duration-300 ${
              showDetailedHeader
                ? "translate-y-0 text-2xl"
                : "-translate-y-4 text-4xl"
            }`}
          >
            居然好設計 Glow Design
          </Link>

          {/* Login Button */}
          <button
            className={`px-3 py-2 text-white font-bold rounded-full bg-contrast ${
              showDetailedHeader ? "translate-y-0" : "-translate-y-4"
            }`}
          >
            登入
          </button>
        </div>
      </header>

      {/* Design List */}
      <main className="pt-40 container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div className="flex flex-col justify-center items-center bg-contrast text-white rounded-card cursor-pointer hover:bg-contrast-hover">
            <span className="text-4xl">+</span>
            <p className="mt-2">開新設計</p>
          </div>

          {[...Array(50)].map((_, index) => (
            <Card
              src="https://www.anstone.com.tw/upload/product/202411201445140.jpg"
              title="設計稿"
              key={index}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
