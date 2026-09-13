"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAdminAuthStore from "../store/adminAuthStore";

export default function AdminIndexPage() {
  const router = useRouter();
  const { adminToken, hasHydrated } = useAdminAuthStore();

  useEffect(() => {
    if (!hasHydrated) return;
    router.replace(adminToken ? "/admin/dashboard" : "/admin/login");
  }, [adminToken, hasHydrated, router]);

  return null;
}
