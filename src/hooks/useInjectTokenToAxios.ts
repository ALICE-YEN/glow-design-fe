// 將 token 注入 axios instance
// 由於 axiosInstance 建立於模組層級，無法使用 useSession()（React hook）或 auth()（僅能在 server-side 執行） 來取得 token
// 用 useInjectTokenToAxios 從 useSession() 中取得使用者的 token，呼叫 setTokenGetter(() => token) 把 token 的 getter 函式注入 axios instance
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { setTokenGetter } from "@/services/apis/axios";

const useInjectTokenToAxios = () => {
  const { data: userSession, status } = useSession();
  // status 僅代表「有 session」，不等於 token 有效

  const token = userSession?.user?.token ?? "";

  // 設定 token getter，一次即可
  useEffect(() => {
    if (status === "authenticated" && token) {
      setTokenGetter(() => token);
    }
  }, [token, status]);
};

export default useInjectTokenToAxios;

// 目前的架構如下：
// 1. 使用 next-auth 做登入流程與 useSession() 管理
// 2. 登入後會向你自己的後端發送 login API，取得自定義的 token（非 next-auth 預設的 JWT）。
// 3. 你是登入後呼叫 你自己的後端 API（如 /login），再把後端回傳的 token 存進 session 的 user.token
// 4. axios 攜帶的 Authorization: Bearer ${user.token} 是你注入的，而不是 next-auth 預設驗證

// 所以：
// 1. next-auth 只知道你呼叫 signIn() 過了，就會設 status = "authenticated"
// 2. 它不會去驗證你加進 session.user.token 裡的內容是否合法
// 3. 即使 token 過期或錯誤，status 仍可能是 "authenticated"，你需要透過 API response（如 401）來額外判斷

// 如果你使用的是 next-auth 自帶的 JWT 機制（例如使用 credentials 或 GitHub OAuth）
// "loading"：還在初始化 session（例如 hydration 階段）
// "authenticated"：token 合法、未過期，session 有效
// "unauthenticated"：token 無效、已過期、或 cookie 被清掉
