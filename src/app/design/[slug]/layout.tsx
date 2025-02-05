// 該頁面共用的 layout：該頁面需要多個子路由，共用佈局（如側邊欄）

import "./design.css";

export default function DesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
