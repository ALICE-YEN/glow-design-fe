// These functions are called from the client but execute on the server.
// 非 app 資料夾內，必須明確標示 "use server";，否則 Next.js 無法知道它應該僅限於伺服器端執行
// Focuses on exposing reusable server actions for authentication flows

"use server";

import { signIn, signOut } from "@/services/auth/config";

export async function doGoogleSignIn() {
  return await signIn("google", { redirectTo: "/design-list" });
}

export async function doCredentialsSignIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  return await signIn("credentials", {
    email,
    password,
    redirect: false,
  });
}

export async function doSignOut() {
  return await signOut({ redirect: false });
}
