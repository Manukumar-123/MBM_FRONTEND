"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { Mail, Lock } from "lucide-react";
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
        (error as AxiosError<{ message?: string }>)?.response?.data?.message ||
        "Invalid email or password";
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
    <div className="min-h-screen bg-[#08080b] flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-violet-500/10 blur-[100px]" />

      <div className="w-full max-w-sm relative">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-cyan-400 to-violet-500" />
          <span className="text-white font-medium text-[16px]">MeBookMeta</span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/[0.08] bg-[#111116] p-8"
        >
          <h1 className="font-serif text-[24px] text-white mb-1">Admin sign in</h1>
          <p className="text-[13px] text-[#8a8a98] mb-6">
            Manage creators, works, and the platform.
          </p>

          <label className="block text-[12.5px] text-[#9a9aa8] mb-1.5">Email</label>
          <div className="flex items-center gap-2 mb-4 px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] focus-within:border-cyan-400/40">
            <Mail size={15} className="text-[#5f5f6e]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mebookmeta.com"
              className="bg-transparent outline-none text-[13.5px] text-white placeholder-[#5f5f6e] w-full"
            />
          </div>

          <label className="block text-[12.5px] text-[#9a9aa8] mb-1.5">Password</label>
          <div className="flex items-center gap-2 mb-6 px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] focus-within:border-cyan-400/40">
            <Lock size={15} className="text-[#5f5f6e]" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-transparent outline-none text-[13.5px] text-white placeholder-[#5f5f6e] w-full"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 rounded-lg text-white text-[13.5px] font-medium bg-gradient-to-r from-cyan-500 to-violet-500 hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isPending ? <Spinner /> : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
