"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import Header from "@/app/components/Header";
import Card from "@/app/design-list/components/Card";
import Footer from "@/app/components/Footer";
import type { Design } from "@/types/interfaces";

const fetchData = async (userId: number) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/designs/user/${userId}`
  );
  return data;
};

export default function DesignList() {
  const { data: userSession } = useSession();

  const { data, error, isLoading } = useQuery({
    queryKey: ["design-list"],
    queryFn: () => fetchData(Number(userSession?.user?.id)),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

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

          {data.map((design: Design, index: number) => (
            <Card
              id={design.id}
              title={design.name}
              src={
                design.preview_url ||
                `${process.env.NEXT_PUBLIC_URL}/background-color.png`
              }
              description={design.description}
              updatedAt={design.updated_at}
              key={index}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
