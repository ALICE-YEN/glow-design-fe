"use client";

// 在 Next.js 14 及更高版本，layout.tsx 默認是一個 Server Component，而 redux 的 <Provider> 必須是一個 Client Component，因為它依賴於 React 的 Context API，只能在客戶端運行
// 將 redux 的 <Provider> 移到一個專門的 Client Component，然後在 Server Component 的 layout.tsx 中嵌套使用

import { Provider } from "react-redux";
import store from "@/store";

export function ReduxProviders({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
