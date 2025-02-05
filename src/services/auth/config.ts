// 後端生成 JWT，並將其返回給 NextAuth，而非用 NextAuth 產生的 token

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

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
  callbacks: {
    // The `jwt` callback is called whenever a JWT is created or updated
    jwt({ token, user, account }) {
      // token：the current state of the NextAuth-managed JWT

      if (account && account.provider === "google") {
        if (account.backendData) {
          token = { ...token, ...account.backendData }; // 使用後端 API 回傳的，包括 token
        }
      } else {
        if (user) {
          token = { ...token, ...user }; // the user object that was returned from the `authorize` callback. 使用後端 API 回傳的，包括 token
        }
      }

      return token;
    },
    // The `session` callback is called whenever a session is checked(ex: useSession)
    session({ session, token }) {
      // Maps token data to the session object for client-side usage
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
