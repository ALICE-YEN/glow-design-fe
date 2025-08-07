"use client";

import useInjectTokenToAxios from "@/hooks/useInjectTokenToAxios";
import "./design-list.css";

export default function DesignListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useInjectTokenToAxios(); // 這裡注入一次即可，所有子頁面共享 token

  return <>{children}</>;
}
