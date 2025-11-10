"use client";

import React, { useState } from "react";
import { isValidEmail, isValidPhone } from "../../utils/signupValidation";
import { register, login } from "@/api/api";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { Spinner } from "../sppiner";
import { usePathname } from "next/navigation";

interface Step1Props {
  onNext: (emailOrPhone: string, type: "email" | "phone") => void;
  initialValue?: string;
}

export default function Step1({ onNext, initialValue = "" }: Step1Props) {
  const [emailOrPhone, setEmailOrPhone] = useState(initialValue);
  const [errorMessage, setErrorMessage] = useState("");
  const [usePhone, setUsePhone] = useState(false);
  const pathname = usePathname();

  // ✅ Setup mutation
  const { mutate: registerUser, isPending } = useMutation({
    mutationFn: pathname === "/signup" ? register : login,
    mutationKey: pathname === "/signup" ? ["register"] : ["login"],
    onSuccess: (data) => {
      toast.success(data?.message || "OTP sent successfully!");
      onNext(emailOrPhone, usePhone ? "phone" : "email");
    },
    onError: (error) => {
      const message =
        (error as AxiosError<{ message?: string }>)?.response?.data?.message ||
        "Something went wrong!";
      toast.error(message);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailOrPhone(e.target.value);
    setErrorMessage("");
  };

  const handleToggle = () => {
    setUsePhone(!usePhone);
    setEmailOrPhone("");
    setErrorMessage("");
  };

  const validateAndProceed = () => {
    if (usePhone) {
      if (!isValidPhone(emailOrPhone)) {
        setErrorMessage("Please enter a valid 10-digit phone number");
        return;
      }
    } else {
      if (!isValidEmail(emailOrPhone)) {
        setErrorMessage("Please enter a valid email address");
        return;
      }
    }

    // ✅ Call register API
    const payload = usePhone
      ? { identifier: emailOrPhone }
      : { identifier: emailOrPhone };

    registerUser(payload);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      validateAndProceed();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#191414] to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md mt-28">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">M</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          Sign up to
        </h1>
        <h1 className="text-4xl font-bold text-white text-center mb-12">
          mebookmeta
        </h1>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-700 rounded-full mb-12">
          <div className="h-full w-1/3 bg-green-500 rounded-full transition-all duration-300"></div>
        </div>

        {/* Input Section */}
        <div className="mb-8">
          <label className="block text-white font-semibold mb-4 text-sm">
            {usePhone ? "Phone number" : "Email address"}
          </label>
          <input
            type={usePhone ? "tel" : "email"}
            value={emailOrPhone}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={usePhone ? "+91 10000 00000" : "name@domain.com"}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
            disabled={isPending}
          />
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}

          <button
            onClick={handleToggle}
            type="button"
            className="text-green-500 text-sm font-semibold mt-3 hover:text-green-400 transition-colors"
          >
            {usePhone ? "Use email instead" : "Use phone number instead"}
          </button>
        </div>

        {/* Social Buttons */}
        <div className="mb-8">
          <p className="text-gray-400 text-center text-sm mb-4">or</p>

          <button className="w-full px-4 py-3 border border-gray-600 rounded-full text-white font-semibold flex items-center justify-center gap-3 hover:border-white transition-colors mb-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.545,10.239v3.821h5.445c-0.029,0.155-0.395,1.08-1.279,1.894c-0.865,0.783-2.212,1.664-4.166,1.664c-2.651,0-4.859-2.211-4.859-4.933c0-2.722,2.209-4.933,4.859-4.933c1.211,0,2.315,0.465,3.021,1.045l2.869-2.767C15.316,2.306,13.743,1.346,12,1.346c-5.403,0-9.954,4.555-9.954,10.154c0,5.599,4.551,10.154,9.954,10.154c5.287,0,8.963-3.707,8.963-8.914c0-0.595-0.051-1.179-0.122-1.756H12.545z" />
            </svg>
            Sign up with Google
          </button>

          <button className="w-full px-4 py-3 border border-gray-600 rounded-full text-white font-semibold flex items-center justify-center gap-3 hover:border-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8.905-.24 1.81-.38 2.86-.34 1.88.1 3.32 1.16 3.97 2.91.3.1.66.41.98 1.04-1.92 1.37-2.45 3.22-2.53 4.8.02 1.32.74 2.77 1.97 3.46.06-1.28-.2-2.57-1.13-3.32.03-1.48.57-2.97 1.6-4.01-1.75-1.7-4.14-1.66-5.03-.18-1.77-.16-3.59 1.05-4.69 2.68z" />
            </svg>
            Sign up with Apple
          </button>
        </div>

        {/* Next Button */}
        <button
          onClick={validateAndProceed}
          className={`w-full  ${
            isPending ? "bg-gray-400" : "bg-green-500"
          }  text-black font-bold h-14 rounded-full transition-colors duration-200 text-lg`}
          disabled={isPending}
        >
          {isPending ? <Spinner /> : "Next"}
        </button>

        {/* Login Link */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <a
            href={pathname === "/signup" ? "/login" : "/signup"}
            className="text-white font-semibold hover:underline"
          >
            {pathname === "/signup" ? "Log in" : "Sign up"}
          </a>
        </p>
      </div>
    </div>
  );
}
