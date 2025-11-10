"use client";

import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { verifyOtp } from "@/api/api";
import { isValidOTP } from "../../utils/signupValidation";
import { AxiosError } from "axios";
import { Spinner } from "../sppiner";

interface Step2Props {
  onNext: (identifier: string) => void;
  onBack: () => void;
  emailOrPhone: string;
  type: "email" | "phone";
}

export default function Step2({
  onNext,
  onBack,
  emailOrPhone,
  type,
}: Step2Props) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Handle resend timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0 && !canResend) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer, canResend]);

  // ✅ React Query Mutation
  const { mutate: verifyOtpMutation, isPending } = useMutation({
    mutationFn: async ({
      identifier,
      otp,
    }: {
      identifier: string;
      otp: string;
    }) => {
      return await verifyOtp(identifier, otp);
    },
    onSuccess: (res) => {
      if (res?.success) {
        toast.success("OTP verified successfully!");
        onNext(emailOrPhone);
      } else {
        toast.error(res?.message || "Invalid OTP");
      }
    },
    onError: (error) => {
      const message =
        (error as AxiosError<{ message?: string }>)?.response?.data?.message ||
        "Something went wrong!";
      toast.error(message);
    },
  });

  const handleOTPChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && otp.join("").length === 4 && !isPending) {
      validateAndSubmit();
    }
  };

  const validateAndSubmit = () => {
    const otpString = otp.join("");
    if (!isValidOTP(otpString)) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }
    // ✅ Pass both identifier and otp to mutation
    verifyOtpMutation({ identifier: emailOrPhone, otp: otpString });
  };

  const handleResend = () => {
    setResendTimer(60);
    setCanResend(false);
    setOtp(["", "", "", ""]);
    setError("");
    toast.success(`OTP resent to ${emailOrPhone}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#191414] to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-8 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
          Back
        </button>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-700 rounded-full mb-12">
          <div className="h-full w-2/3 bg-green-500 rounded-full transition-all duration-300"></div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-2">
          Verify your {type === "email" ? "email" : "phone"}
        </h1>
        <p className="text-gray-400 mb-8">
          We sent a 4-digit code to {emailOrPhone}
        </p>

        {/* OTP Input Fields */}
        <div className="mb-8">
          <label className="block text-white font-semibold mb-4 text-sm">
            Verification Code
          </label>
          <div className="flex gap-3 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOTPChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onKeyPress={handleKeyPress}
                className="w-14 h-14 bg-gray-800 border-2 border-gray-600 rounded-lg text-white text-2xl font-bold text-center focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                placeholder="-"
              />
            ))}
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
          )}
        </div>

        {/* Resend Code */}
        <div className="mb-8 text-center">
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-green-500 font-semibold hover:text-green-400 transition-colors text-sm"
            >
              Resend code
            </button>
          ) : (
            <p className="text-gray-400 text-sm">
              Resend code in{" "}
              <span className="text-green-500 font-semibold">
                {resendTimer}s
              </span>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={validateAndSubmit}
          disabled={isPending || otp.join("").length !== 4}
          className={`w-full  ${
            isPending ? "bg-gray-400" : "bg-green-500"
          }  text-black font-bold h-14 rounded-full transition-colors duration-200 text-lg`}
        >
          {isPending ? <Spinner /> : "Verify"}
        </button>

        {/* Help Text */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Didn’t receive the code?{" "}
          <a
            href="#"
            className="text-green-500 font-semibold hover:text-green-400"
          >
            Get help
          </a>
        </p>
      </div>
    </div>
  );
}
