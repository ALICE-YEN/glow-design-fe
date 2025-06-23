// 後端生成 JWT，並將其返回給 NextAuth，而非用 NextAuth 產生的 token

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // 只能「解碼」JWT，把 payload 解析出來，不會也無法驗證簽章或有效期。需要 secret 或 public key。

function isTokenExpired(token: string): boolean {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    // exp 單位是秒，Date.now() 單位是毫秒
    console.log("Decoded token:", decoded);
    return Date.now() >= decoded.exp * 1000;
  } catch (e) {
    return true;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // JWT 會被存儲在安全的 HTTP-only Cookie
    maxAge: 86400,
  },
  // NextAuth 官方文件與討論建議，refreshToken 可以存在 server-side 的 JWT（token 物件），但不應該傳到 session 讓前端取得，這樣就不會有 refreshToken 泄露到 JS 的問題。
  callbacks: {
    // The `jwt` callback is called whenever a JWT is created or updated
    async jwt({ token, user, account }) {
      console.log("JWT callback called", { token, user, account });
      // token：the current state of the NextAuth-managed JWT
      console.log("Current token:", token.token);

      if (account && account.provider === "google") {
        if (account.backendData) {
          console.log("goole初次登入", account.backendData);
          token = { ...token, ...account.backendData }; // 使用後端 API 回傳的，包括 token
        }
      } else {
        if (user) {
          console.log("帳號密碼初次登入", user);
          token = { ...token, ...user }; // the user object that was returned from the `authorize` callback. 使用後端 API 回傳的，包括 token
        }
      }

      if (token?.token && !isTokenExpired(token?.token)) {
        console.log("🥰Token is still valid, skipping refresh");
        // return token;
      } else {
        console.log("😎Token is expired or missing, refreshing token");
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh-token`,
          {
            refreshToken: token.refreshToken,
          }
        );
        if (response.data && response.data.token) {
          token = { ...token, ...response.data };
          console.log("😎😎New token received:", token.token);
        }
      }

      return token;
    },
    // 自定義要傳到前端的 Session 資料(ex: useSession)
    session({ session, token }) {
      session.user = token; // 使用後端 API 回傳的，包括 token

      return session;
    },
    async signIn({ account, profile }) {
      if (account.provider === "google") {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google-login`,
            {
              username: profile.name,
              email: profile.email,
              ssoId: profile.sub,
            }
          );
          console.log("Google login response:", response.data);
          if (!response.data || !response.data.token) {
            console.error("Missing token in API response");
            return false;
          }

          // 將後端回傳的資料(包括 token) 附加到 account 上
          account.backendData = response.data;

          return true;
        } catch (error) {
          console.error("Error in signIn:", error.message);
          return false;
        }
      }
      return true;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code", // Authorization Code flow
        },
      },
    }),
    // NextAuth 提供的驗證方式之一，用於自定義驗證邏輯（非 OAuth 2.0）
    CredentialsProvider({
      // 定義了用戶需要輸入的欄位
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // Credentials 驗證的核心，負責處理登入邏輯。它會在用戶提交表單後執行，用於驗證用戶的憑證。
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          // 檢查 HTTP 狀態碼
          if (!response) {
            const errorData = await response;
            console.error("Login failed:", errorData);
            throw new Error(errorData.error || "Invalid credentials");
          }

          const user = await response.data;

          if (!user || !user.id || !user.email) {
            throw new Error("Invalid user data from API");
          }

          // 返回 user 對象，這將作為 JWT 的 payload
          return user;
        } catch (error) {
          console.error("Error in authorize:", error.message);
          throw new Error("Login failed. Please try again.");
        }
      },
    }),
  ],
});
