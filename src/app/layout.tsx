import type { Metadata } from "next"; // Next.js 自動將這些數據注入到 HTML <head>
// 從 next/font/local 引入自定義字體，支持直接從本地文件載入字體（例如 .woff, .woff2）。
import localFont from "next/font/local"; // Next.js 的字體優化 API，字體加載是自動優化的，會根據頁面的訪問只加載所需字體，減少資源浪費。
import { auth } from "@/services/auth/config";
import { config } from "@fortawesome/fontawesome-svg-core";
import { ReduxProviders } from "@/components/ReduxProviders";
import AuthModal from "@/app/components/AuthModal";
import { SessionProvider } from "next-auth/react"; // 在整個應用程式 client-side 提供身份驗證會話
import "@fortawesome/fontawesome-svg-core/styles.css"; // 引入基礎樣式
import "./globals.css";

config.autoAddCss = false; // 禁止自動添加 CSS

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans", // 定義一個全局的 CSS 變數名稱
  weight: "100 900", // 定義字體的權重範圍
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "居然好設計",
  description: "居然好設計 Glow Design",
  keywords: "室內設計, 居然好設計, Glow Design",
};

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth(); // for Server Component
  // console.log("auth() session", session);

  return (
    <SessionProvider>
      <ReduxProviders>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            {children}
            <AuthModal />
          </body>
        </html>
      </ReduxProviders>
    </SessionProvider>
  );
}
