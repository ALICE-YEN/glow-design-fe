// 該頁面共用的 layout：該頁面需要多個子路由，共用佈局（如側邊欄）
"use client";

import useIsMobile from "@/hooks/useIsMobile";
import ScreenSizeLimitNotice from "@/app/design/[slug]/components/ScreenSizeLimitNotice";
import "./design.css";

export default function DesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isMobile, isReady } = useIsMobile();

  if (!isReady) return null;
  if (isMobile) return <ScreenSizeLimitNotice />;

  return <>{children}</>;
}
