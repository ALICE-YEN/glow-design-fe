// 開關應該要有過場動畫
// form: Validation、Autocomplete、Error Messages、Visibility Toggle
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import axios from "axios";
import * as yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { doGoogleSignIn, doCredentialsSignIn } from "@/services/auth/actions";
import { useAppSelector, useAppDispatch } from "@/services/redux/hooks";
import { closeAuthModal } from "@/store/userSlice";
import GoogleIcon from "@/assets/icons/google.svg";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .required("電子信箱不能為空")
    .email("請輸入有效的電子信箱"),
  password: yup
    .string()
    .required("密碼不能為空")
    .min(8, "密碼至少需要 8 個字元")
    .matches(/[A-Z]/, "密碼至少需要一個大寫字母")
    .matches(/[a-z]/, "密碼至少需要一個小寫字母")
    .matches(/[0-9]/, "密碼至少需要一個數字"),
});

export default function AuthModal() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState<string>("test@glow-design.com");
  const [password, setPassword] = useState<string>("GlowDesign1");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [hasSubmitted, setHasSubmitted] = useState(false); // Only validate if the form has been submitted
  const [passwordVisible, setPasswordVisible] = useState(false);

  const router = useRouter();

  const { update: userSessionUpdate } = useSession();

  const isAuthModalOpen = useAppSelector((state) => state.user.isAuthModalOpen);
  const dispatch = useAppDispatch();

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);

    try {
      await validationSchema.validate(
        { email, password },
        { abortEarly: false }
      );
      // Clear errors if validation succeeds
      setErrors({});

      if (activeTab === "signin") {
        try {
          await doCredentialsSignIn({ email, password });
          await userSessionUpdate();
          router.push("/design-list");
          setTimeout(() => {
            handleClose();
          }, 300);
        } catch (error) {
          setErrors((prev) => ({
            ...prev,
            password: "電子信箱或密碼錯誤", // 將錯誤提示位置放在密碼欄位
          }));
          console.error("AuthModal doCredentialsSignIn error", error);
        }
      } else {
        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
            {
              username: email,
              email,
              password,
            }
          );
          setTimeout(() => {
            handleClose();
          }, 300);
        } catch (error) {
          setErrors((prev) => ({
            ...prev,
            password: error?.response?.data?.message ?? "註冊帳號錯誤", // 將錯誤提示位置放在密碼欄位
          }));
          console.error("AuthModal register error", error);
        }
      }
    } catch (validationError: any) {
      // Map Yup validation errors to state
      const newErrors: { [key: string]: string } = {};
      validationError?.inner?.forEach((err: any) => {
        if (err.path) newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    field: "email" | "password"
  ) => {
    return async (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setter(value);

      // Only validate if the form has been submitted
      if (hasSubmitted) {
        try {
          // Validate the specific field on change
          await validationSchema.validateAt(field, { [field]: value });
          setErrors((prev) => ({ ...prev, [field]: "" }));
        } catch (validationError: any) {
          // Update error for the specific field if invalid
          setErrors((prev) => ({ ...prev, [field]: validationError.message }));
        }
      }
    };
  };

  const resetFormState = () => {
    setEmail("");
    setPassword("");
    setErrors({});
    setHasSubmitted(false);
    setPasswordVisible(false);
  };

  const handleClose = () => {
    resetFormState();
    setActiveTab("signin");
    setEmail("test@glow-design.com");
    setPassword("GlowDesign1");
    dispatch(closeAuthModal());
  };

  const handleTabChange = (tab: "signin" | "signup") => {
    setActiveTab(tab);
    resetFormState();
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div
      role="dialog"
      className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-20"
      onMouseDown={(e) => {
        // Check if the mousedown event is on the background, not inside the modal
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="relative w-80 sm:w-96 bg-white bg-opacity-70 backdrop-blur rounded-card shadow-xl p-5 sm:p-10 text-secondary">
        {/* Close Button */}
        <button
          className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700"
          onClick={handleClose}
        >
          <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
        </button>

        {/* Tabs */}
        <div className="flex justify-around mb-8">
          {["signin", "signup"].map((tab) => (
            <button
              key={tab}
              className={`flex-1 text-center py-2 border-b-2 ${
                activeTab === tab
                  ? "border-contrast font-bold"
                  : "border-panel-background"
              }`}
              onClick={() => handleTabChange(tab as "signin" | "signup")}
            >
              {tab === "signin" ? "登入" : "註冊"}
            </button>
          ))}
        </div>

        {/* Content */}
        <form
          className="flex flex-col space-y-4"
          onSubmit={handleSubmit}
          noValidate
        >
          {activeTab === "signin" && (
            <p className="text-center text-sm text-gray-500">
              歡迎使用測試帳號登入體驗
            </p>
          )}
          <input
            type="email"
            placeholder="請輸入電子信箱"
            className="rounded-lg p-2"
            value={email}
            onChange={handleInputChange(setEmail, "email")}
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}

          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder={
                activeTab === "signin"
                  ? "請輸入密碼"
                  : "請輸入密碼 (至少8個字元)" // 請輸入密碼(至少8個字元，含大小寫、數字)
              }
              className="rounded-lg p-2 w-full"
              value={password}
              onChange={handleInputChange(setPassword, "password")}
              autoComplete={
                activeTab === "signin" ? "current-password" : "new-password"
              }
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              <FontAwesomeIcon
                icon={passwordVisible ? faEyeSlash : faEye}
                className="w-4 h-4"
              />
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}

          <button className="bg-contrast text-white rounded-lg py-2 hover:bg-contrast-hover">
            {activeTab === "signin" ? "登入" : "註冊"}
          </button>

          <p className="text-sm text-gray-500 text-center pt-6">
            {activeTab === "signin"
              ? "或選擇以Google帳號登入"
              : "或選擇以Google帳號註冊"}
          </p>
          <button
            type="button"
            className="flex items-center justify-center rounded-lg py-2 bg-white hover:bg-gray-100"
            onClick={doGoogleSignIn}
            // onClick={openSSOWindow} // 之後要做另外視窗的 Google SSO
          >
            <Image
              src={GoogleIcon}
              alt="Google Icon"
              width={22}
              height={22}
              className="mr-2"
            />
            Google
          </button>
        </form>
      </div>
    </div>
  );
}
