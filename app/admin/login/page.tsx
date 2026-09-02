"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { adminLogin } from "@/api/adminApi";
import useAdminAuthStore from "../../store/adminAuthStore";
import { Spinner } from "../../components/sppiner";

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAdminToken } = useAdminAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: () => adminLogin(email, password),
    onSuccess: (res) => {
      if (res?.success && res?.data?.token) {
        setAdminToken(res.data.token);
        toast.success("Welcome back, admin!");
        router.replace("/admin/category");
      } else {
        toast.error(res?.message || "Login failed");
      }
    },
    onError: (error) => {
      const message =
        (error as AxiosError<{ message?: string }>)?.response?.data
          ?.message || "Invalid email or password";
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }
    mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-white dark:from-[#191414] dark:to-black px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white dark:bg-[#111] border border-gray-200 dark:border-[#2a2a2a] rounded-2xl p-8 shadow-lg"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Admin Login
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Sign in to manage categories &amp; subcategories
        </p>

        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@mebookmeta.com"
          className="w-full mb-4 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#323232] bg-transparent text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500/50"
        />

        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full mb-6 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#323232] bg-transparent text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500/50"
        />

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isPending ? <Spinner /> : "Login"}
        </button>
      </form>
    </div>
  );
}
