"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { completeProfile } from "@/api/api";
import { Spinner } from "../sppiner";
import useAuthStore from "@/app/store/authStore";
import { UserDetailsData } from "./Step3";

interface Step4Props {
  onBack: () => void;
  identifier: string;
  userDetails: UserDetailsData;
}

type UserRole = "user" | "author" | "writer";

const roleOptions: Array<{ value: UserRole; label: string }> = [
  { value: "user", label: "User" },
  { value: "author", label: "Auther" },
  { value: "writer", label: "Writer" },
];

export default function Step4({ onBack, identifier, userDetails }: Step4Props) {
  const [role, setRole] = useState<UserRole | "">("");
  const [error, setError] = useState("");
  const { setUser, setAccessToken } = useAuthStore();

  const mutation = useMutation({
    mutationFn: async (payload: unknown) => await completeProfile(payload),
    onSuccess: (res) => {
      toast.success(res?.message || "Profile completed successfully!");
      setUser(res?.data?.user);
      setAccessToken(res?.data?.token);
    },
    onError: (err: unknown) => {
      const message =
        (err as AxiosError<{ message?: string }>)?.response?.data?.message ||
        "Something went wrong!";
      toast.error(message);
    },
  });

  const handleCreateAccount = () => {
    if (!role) {
      setError("Please select your role");
      return;
    }

    const payload = {
      identifier,
      name: userDetails.name,
      dob: `${userDetails.year}-${userDetails.month}-${userDetails.day}`,
      gender: userDetails.gender,
      role,
    };

    mutation.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white dark:from-[#191414] dark:to-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="mb-8 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
          Back
        </button>

        <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mb-12">
          <div className="h-full w-full bg-green-500 rounded-full transition-all duration-300"></div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          Select your role
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Your role
        </p>

        <div className="mb-8">
          <label className="block text-gray-900 dark:text-white font-semibold mb-3 text-sm">
            Your role
          </label>
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value as UserRole);
              setError("");
            }}
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
          >
            <option value="">Choose a role</option>
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <button
          onClick={handleCreateAccount}
          disabled={mutation.isPending}
          className={`w-full ${
            mutation.isPending ? "bg-gray-400" : "bg-green-500"
          } text-black font-bold h-14 rounded-full transition-colors duration-200 text-lg`}
        >
          {mutation.isPending ? <Spinner /> : "Create Account"}
        </button>
      </div>
    </div>
  );
}
