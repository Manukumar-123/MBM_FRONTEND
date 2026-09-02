"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAdminAuthStore from "../store/adminAuthStore";

export default function AdminIndexPage() {
  const router = useRouter();
  const { adminToken } = useAdminAuthStore();

  useEffect(() => {
    router.replace(adminToken ? "/admin/category" : "/admin/login");
  }, [adminToken, router]);

  return null;
}
