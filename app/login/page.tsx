"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Step1 from "../components/signup/Step1";
import Step2 from "../components/signup/Step2";
import useAuthStore from "../store/authStore";
import { toast } from "react-hot-toast";

type Step = 1 | 2;

interface LoginState {
  emailOrPhone: string;
  type: "email" | "phone";
  otp: string;
}

export default function Login() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const { accessToken, user } = useAuthStore();
  const router = useRouter();

  const [loginData, setLoginData] = useState<LoginState>({
    emailOrPhone: "",
    type: "email",
    otp: "",
  });

  // ✅ Redirect logged-in users
  useEffect(() => {
    if (accessToken && user) {
      router.replace("/");
    }
  }, [accessToken, user, router]);

  // ✅ Step 1: Get identifier (email/phone)
  const handleStep1Next = (emailOrPhone: string, type: "email" | "phone") => {
    setLoginData((prev) => ({
      ...prev,
      emailOrPhone,
      type,
    }));
    setCurrentStep(2);
  };

  // ✅ Step 2: Get OTP
  const handleStep2Next = (otp: string) => {
    setLoginData((prev) => ({
      ...prev,
      otp,
    }));
    router.replace("/");
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  if (accessToken && user) return null;

  return (
    <>
      {currentStep === 1 && <Step1 onNext={handleStep1Next} />}
      {currentStep === 2 && (
        <Step2
          onNext={handleStep2Next}
          onBack={handleBack}
          emailOrPhone={loginData.emailOrPhone}
          type={loginData.type}
        />
      )}
    </>
  );
}
