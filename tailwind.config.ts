import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        "panel-background": "var(--panel-background)",
        "button-hover": "var(--button-hover)",
        "button-active": "var(--button-active)",
        primary: "var(--primary-text)", // 文字顏色設為 primary
        secondary: "var(--secondary-text)", // 次要文字顏色設為 secondary
      },
      borderRadius: {
        default: "6px",
      },
    },
  },
  plugins: [],
} satisfies Config;
