// Google 回傳 token 這段跟 NextAuth 整合還有問題

// Contains NextAuth configuration and exposes the auth, signIn, and signOut methods.
// Focuses on configuring authentication providers and session strategies

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
  },
  callbacks: {
    // The `jwt` callback is called whenever a JWT is created or updated
    jwt({ token, user }) {
      // Defines what data is stored in the token
      // token：the current state of the NextAuth-managed JWT
      // user：user object returned during the sign-in process (from your backend or Google). the user object that was returned from the `authorize` callback.
      // If user exists (e.g., during sign-in), add properties to the token
      console.log("jwt token", token);
      console.log("jwt user", user);
      if (user) {
        token = { ...token, ...user };
      }
      return token;
    },
    // The `session` callback is called whenever a session is checked(ex: useSession)
    session({ session, token }) {
      // Maps token data to the session object for client-side usage
      // token：NextAuth-managed JWT token created or updated in the jwt callback
      // session：This is the session object returned to the frontend. It’s typically what you access with useSession in your Next.js app.
      // Add properties from the token into the session
      console.log("session session", session);
      console.log("session token", token);
      session.user = { ...session.user, ...token };
      return session;
    },
    async signIn({ account, profile }) {
      console.log("account", account);
      console.log("profile", profile);
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
          return response.data;
          // NextAuth 自行處理了部分資料，並覆蓋了你在 signIn Callback 中返回的資料
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
          response_type: "code", // Authorization Code
        },
      },
    }),
    // NextAuth 提供的驗證方式之一，用於自定義驗證邏輯
    CredentialsProvider({
      // 定義了用戶需要輸入的欄位
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // Credentials 驗證的核心，負責處理登入邏輯。它會在用戶提交表單後執行，用於驗證用戶的憑證。
      authorize: async (credentials) => {
        console.log("credentials", credentials);
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
          console.log("user", user);

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
