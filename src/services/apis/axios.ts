import axios, { AxiosInstance } from "axios";

let getToken: (() => string | Promise<string | null>) | null = null;

// 註冊 token 的 getter 函式，供 axios request 攔截器呼叫。
// 必須從 component 或 hook 中動態注入（如 useInjectTokenToAxios）。
export const setTokenGetter = (fn: () => string | Promise<string | null>) => {
  getToken = fn;
};

// 建立全域共用的 axios instance。此檔案位於模組層級，無法直接使用 useSession() 或 auth()。
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 在每次請求前，自動從 getToken() 中取得最新的 token 並加到 headers
axiosInstance.interceptors.request.use(async (config) => {
  const token = await getToken?.();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
