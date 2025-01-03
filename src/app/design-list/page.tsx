"use client";

import Header from "@/app/components/Header";
import Card from "@/app/design-list/components/Card";
import Footer from "@/app/components/Footer";

export default function DesignList() {
  return (
    <div className="bg-panel-background min-h-screen">
      <Header />

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
