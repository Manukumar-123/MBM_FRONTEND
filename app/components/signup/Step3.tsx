"use client";

import React, { useState } from "react";
import { isValidName, isValidDateOfBirth } from "../../utils/signupValidation";
import { useMutation } from "@tanstack/react-query";
import { completeProfile } from "@/api/api";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { Spinner } from "../sppiner";
import useAuthStore from "@/app/store/authStore";

interface Step3Props {
  onNext: (data: UserDetailsData) => void;
  onBack: () => void;
  initialData?: UserDetailsData;
  identifier: string; // ✅ from Step 1 (email or phone)
}

export interface UserDetailsData {
  name: string;
  year: string;
  month: string;
  day: string;
  gender: string;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const genderOptions = [
  { value: "male", label: "Man" },
  { value: "female", label: "Woman" },
  { value: "nonbinary", label: "Non-binary" },
  { value: "other", label: "Something else" },
  { value: "prefer-not", label: "Prefer not to say" },
];

export default function Step3({
  onNext,
  onBack,
  initialData,
  identifier,
}: Step3Props) {
  const [formData, setFormData] = useState<UserDetailsData>(
    initialData || { name: "", year: "", month: "", day: "", gender: "" }
  );
  const [errors, setErrors] = useState<Partial<UserDetailsData>>({});
  const { setUser, setAccessToken } = useAuthStore();

  // ✅ Mutation for completing the profile
  const mutation = useMutation({
    mutationFn: async (data: unknown) => await completeProfile(data),
    onSuccess: (res) => {
      toast.success(res?.message || "Profile completed successfully!");
      onNext(formData);
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }));
    setErrors((prev) => ({ ...prev, gender: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UserDetailsData> = {};
    if (!isValidName(formData.name))
      newErrors.name = "Please enter a valid name (at least 3 characters)";
    if (!isValidDateOfBirth(formData.year, formData.month, formData.day))
      newErrors.year = "You must be at least 13 years old";
    if (!formData.gender) newErrors.gender = "Please select a gender";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAndProceed = () => {
    if (!validateForm()) return;
    const payload = {
      identifier,
      name: formData.name,
      dob: `${formData.year}-${formData.month}-${formData.day}`,
      gender: formData.gender,
    };
    mutation.mutate(payload);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 13 - i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#191414] to-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="mb-8 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
          Back
        </button>

        <div className="w-full h-1 bg-gray-700 rounded-full mb-12">
          <div className="h-full w-full bg-green-500 rounded-full transition-all duration-300"></div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-1">
          Tell us about yourself
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          This information helps us personalize your experience
        </p>

        {/* --- Name --- */}
        <div className="mb-6">
          <label className="block text-white font-semibold mb-2 text-sm">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-2">{errors.name}</p>
          )}
        </div>

        {/* --- DOB --- */}
        <div className="mb-6">
          <label className="block text-white font-semibold mb-2 text-sm">
            Date of birth
          </label>
          <div className="flex gap-3">
            <select
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="flex-1 px-3 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            >
              <option value="">YYYY</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              name="month"
              value={formData.month}
              onChange={handleInputChange}
              className="flex-1 px-3 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            >
              <option value="">Month</option>
              {months.map((month, i) => (
                <option key={i} value={i + 1}>
                  {month}
                </option>
              ))}
            </select>

            <select
              name="day"
              value={formData.day}
              onChange={handleInputChange}
              className="flex-1 px-3 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            >
              <option value="">DD</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          {errors.year && (
            <p className="text-red-500 text-sm mt-2">{errors.year}</p>
          )}
        </div>

        {/* --- Gender --- */}
        <div className="mb-8">
          <label className="block text-white font-semibold mb-2 text-sm">
            Gender
          </label>
          <div className="space-y-3">
            {genderOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="gender"
                  value={option.value}
                  checked={formData.gender === option.value}
                  onChange={() => handleGenderChange(option.value)}
                  className="hidden"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    formData.gender === option.value
                      ? "border-green-500 bg-green-500"
                      : "border-gray-500 group-hover:border-gray-400"
                  }`}
                >
                  {formData.gender === option.value && (
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                  )}
                </div>
                <span
                  className={`text-sm transition-colors ${
                    formData.gender === option.value
                      ? "text-white"
                      : "text-gray-400"
                  }`}
                >
                  {option.label}
                </span>
              </label>
            ))}
          </div>
          {errors.gender && (
            <p className="text-red-500 text-sm mt-3">{errors.gender}</p>
          )}
        </div>

        {/* --- Button --- */}
        <button
          onClick={validateAndProceed}
          disabled={mutation.isPending}
          className={`w-full  ${
            mutation.isPending ? "bg-gray-400" : "bg-green-500"
          }  text-black font-bold h-14 rounded-full transition-colors duration-200 text-lg`}
        >
          {mutation.isPending ? <Spinner /> : "Create Account"}
        </button>

        <p className="text-gray-400 text-xs text-center">
          By clicking Create Account, you agree to our{" "}
          <a href="#" className="text-green-500 hover:underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="text-green-500 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
