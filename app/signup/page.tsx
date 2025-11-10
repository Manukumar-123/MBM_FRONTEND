"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Step1 from "../components/signup/Step1";
import Step2 from "../components/signup/Step2";
import Step3, { UserDetailsData } from "../components/signup/Step3";
import useAuthStore from "../store/authStore";

interface SignUpState {
  emailOrPhone: string;
  type: "email" | "phone";
  otp: string;
  userDetails: UserDetailsData | null;
}

type Step = 1 | 2 | 3 | 4;

export default function SignUp() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const { accessToken: AccessToken, user } = useAuthStore();
  const router = useRouter();

  const [signUpData, setSignUpData] = useState<SignUpState>({
    emailOrPhone: "",
    type: "email",
    otp: "",
    userDetails: null,
  });

  // ✅ Redirect logged-in users
  useEffect(() => {
    if (AccessToken && user) {
      router.replace("/"); // or "/"
    }
  }, [AccessToken, user, router]);

  const handleStep1Next = (emailOrPhone: string, type: "email" | "phone") => {
    setSignUpData((prev) => ({
      ...prev,
      emailOrPhone,
      type,
    }));
    setCurrentStep(2);
  };

  const handleStep2Next = (otp: string) => {
    setSignUpData((prev) => ({
      ...prev,
      otp,
    }));
    setCurrentStep(3);
  };

  const handleStep3Next = (userDetails: UserDetailsData) => {
    setSignUpData((prev) => ({
      ...prev,
      userDetails,
    }));
    setCurrentStep(4);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
    setSignUpData({
      emailOrPhone: "",
      type: "email",
      otp: "",
      userDetails: null,
    });
  };

  // 🟢 Optionally prevent UI flash while redirecting
  if (AccessToken && user) return null;

  return (
    <>
      {currentStep === 1 && <Step1 onNext={handleStep1Next} />}
      {currentStep === 2 && (
        <Step2
          onNext={handleStep2Next}
          onBack={handleBack}
          emailOrPhone={signUpData.emailOrPhone}
          type={signUpData.type}
        />
      )}
      {currentStep === 3 && (
        <Step3
          onNext={handleStep3Next}
          onBack={handleBack}
          initialData={signUpData.userDetails || undefined}
          identifier={signUpData.emailOrPhone}
        />
      )}
    </>
  );
}

// ✅ Success Screen component (same as before)
