"use client";

// header 退場動畫有點怪

import { useEffect, useState } from "react";
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
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          showDetailedHeader
            ? "bg-white shadow-md border-b border-gray-300 py-2"
            : "bg-transparent py-10"
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <h1
            className={`text-contrast font-bold transition-transform duration-500 ${
              showDetailedHeader
                ? "transform translate-y-0 text-xl"
                : "transform -translate-y-4 text-4xl"
            }`}
          >
            居然好設計 Glow Design
          </h1>

          {/* Login Button */}
          <button
            className={`transition-transform duration-500 p-2 text-white rounded-full ${
              showDetailedHeader
                ? "transform translate-y-0 bg-contrast"
                : "transform -translate-y-4 bg-contrast"
            }`}
          >
            登入
          </button>
        </div>
      </header>

      {/* Design List */}
      <main className="pt-28 container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="flex flex-col justify-center items-center bg-contrast text-white rounded-lg h-48 cursor-pointer hover:bg-contrast-hover">
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
